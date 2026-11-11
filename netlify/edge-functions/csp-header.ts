/* global Deno */

import crypto from 'crypto';

export default async (request, context) => {
  const nonce = crypto.randomBytes(16).toString('base64');

  try {
    // Clone the response so we can modify it
    const response = await context.next();
    const newHeaders = new Headers(response.headers);

    // Set the CSP header
    newHeaders.set(
      'Content-Security-Policy',
      // `default-src 'self'; style-src 'self' 'nonce-${nonce}'; script-src 'self';`
      generateCSP(nonce)
    );

    // some other security headers
    newHeaders.set('X-Content-Type-Options', 'nosniff');
    newHeaders.set('X-Frame-Options', 'SAMEORIGIN');

    // Inject the nonce into the HTML
    if (newHeaders.get('Content-Type')?.includes('text/html')) {
      const body = await response.text();
      const modifiedBody = addNonceToHtmlElements(body, nonce);

      return new Response(modifiedBody, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders
      });
    }

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders
    });
  } catch (error) {
    await sendToRollbar(error, context);

    const html = errorHtml(nonce);
    return new Response(html, {
      status: 500,
      headers: {
        'Content-Type': 'text/html',
        'Content-Security-Policy': `default-src 'none'; style-src 'self' 'nonce-${nonce}'; img-src https://fora-dev-public.s3.us-east-1.amazonaws.com;`
      }
    });
  }
};

const errorHtml = (nonce) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="csp-nonce" content="${nonce}">
  <title>Error</title>
  <style nonce="${nonce}">
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      background-color: #DCE5FC;
      color: #0f3ca8;
      font-family: sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    img {
      max-width: 120px;
      margin-bottom: 1.5rem;
    }
    h1 {
      margin: 0 0 1rem 0;
      font-size: 1.75rem;
    }
    p {
      font-size: 1rem;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <img src="https://fora-dev-public.s3.us-east-1.amazonaws.com/assets/fora.png" alt="Fora Logo" />
    <h1>Oops! Something went wrong.</h1>
    <p>We're working on it. Please try again later.</p>
  </div>
</body>
</html>
`;

async function sendToRollbar(error, context) {
  const ROLLBAR_ACCESS_TOKEN = Deno.env.get('ROLLBAR_SERVER_TOKEN');
  const ENVIRONMENT = 'production';

  if (!ROLLBAR_ACCESS_TOKEN) {
    console.warn('Rollbar token is not defined');
    return;
  }

  const body = {
    access_token: ROLLBAR_ACCESS_TOKEN,
    data: {
      environment: ENVIRONMENT,
      body: {
        trace: {
          exception: {
            class: error.name,
            message: error.message
          },
          frames: []
        }
      },
      timestamp: Math.floor(Date.now() / 1000),
      level: 'error',
      platform: 'javascript',
      language: 'javascript',
      context: context.pathname
    }
  };

  try {
    await fetch('https://api.rollbar.com/api/1/item/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
  } catch (e) {
    console.error('Failed to send error to Rollbar:', e);
  }
}

function addNonceToHtmlElements(originalHtml, nonce) {
  const replacedHeadTags = originalHtml.replace(
    '<head>',
    `<head><meta name="csp-nonce" content="${nonce}">`
  );
  const replacedScriptTags = replacedHeadTags.replaceAll('<script', `<script nonce="${nonce}"`);
  const replacedStyleTags = replacedScriptTags.replaceAll('<style', `<style nonce="${nonce}"`);
  const replacedLinkTags = replacedStyleTags.replaceAll('<link', `<link nonce="${nonce}"`);
  return replacedLinkTags;
}

function generateCSP(nonce) {
  const policy = {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      'https://js.intercomcdn.com',
      'https://*.fora.day',
      'https://*.netlify.app',
      // 'https://deploy-preview-*--foraday.netlify.app',
      'https://notif-onesignal--foraday.netlify.app',
      'https://cdn.pendo.io',
      'https://pendo-io-static.storage.googleapis.com',
      'https://app.pendo.io',
      'https://cdn.jsdelivr.net',
      'https://accounts.google.com',
      'https://*.bugsnag.com',
      'https://sessions.bugsnag.com',
      'https://cdn.segment.com',
      'https://*.segment.com',
      'https://www.google-analytics.com',
      'https://featureassets.org',
      'https://prodregistryv2.org',
      'https://beyondwickedmapping.org',
      'https://cloudflare-dns.com',
      'https://storage.googleapis.com',
      'https://*.pushnotifications.pusher.com',
      'https://*.onesignal.com',
      'https://overbridgenet.com',
      "'wasm-unsafe-eval'",
      `'nonce-${nonce}'`,
      "'unsafe-inline'",
      "'unsafe-eval'",
      "'strict-dynamic'",
      'blob:',
      'https:',
      'http:'
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://onesignal.com',
      'https://fonts.googleapis.com',
      'https://app.pendo.io'
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:',
      'https://*.googleusercontent.com',
      'https://app.pendo.io',
      'https://data.pendo.io',
      'https://cdn.pendo.io'
    ],
    'font-src': [
      "'self'",
      'https://fonts.gstatic.com',
      'https://fonts.intercomcdn.com',
      'https://use.fontawesome.com',
      'data:'
    ],
    'connect-src': [
      "'self'",
      'https://*.fora.day',
      'https://*.fora.app',
      'https://api.fora.app',
      'https://api-dev.fora.app',
      'https://widget.intercom.io',
      'https://api-iam.intercom.io',
      'https://cdn.pendo.io',
      'https://data.pendo.io',
      'https://app.pendo.io',
      'https://featureassets.org',
      'https://prodregistryv2.org',
      'https://beyondwickedmapping.org',
      'https://cloudflare-dns.com',
      'wss:',
      'ws:',
      'https://ws-us2.pusher.com',
      'https://sockjs-us2.pusher.com',
      'https://*.pushnotifications.pusher.com',
      'https://*.onesignal.com',
      'https://onesignal.com',
      'https://*.rollbar.com',
      'https://rollbar.com',
      'https://ingesteer.services-prod.nsvcs.net',
      'https://slack.com',
      'https://login.microsoftonline.com',
      'https://fora-prod-recordings.s3.amazonaws.com',
      'https://xpyw1vn8kf.execute-api.us-east-1.amazonaws.com',
      'https://edhvcis510.execute-api.us-east-1.amazonaws.com',
      'https://sessions.bugsnag.com',
      'https://cdn.segment.com',
      'https://*.segment.com',
      'https://www.google-analytics.com',
      'https://overbridgenet.com',
      'https://js8.offer',
      'data:',
      'blob:',
      'https://fora-meeting-uploads.s3.us-east-1.amazonaws.com',
      'https://fora-avatars.s3.us-east-1.amazonaws.com',
      'https://email-parser-processing.s3.us-east-1.amazonaws.com',
      'https://trial-7694437.okta.com',
      'https://trial-8407732.okta.com',
      'https://dev-44895517.okta.com',
      'https://skullcandy.okta.com',
      'https://apollo-prod.okta.com',
      'https://parachutehealth.okta.com',
      'https://oin-ops-test.trexcloud.com',
      // 'https://deploy-preview-*--foraday.netlify.app',
      'https://notif-onesignal--foraday.netlify.app',
      'https://statsigapi.net',
      'https://assetsconfigcdn.org'
    ],
    'frame-src': [
      "'self'",
      'https://app.netlify.com',
      'https://*.netlify.app',
      // 'https://deploy-preview-*--foraday.netlify.app',
      'https://notif-onesignal--foraday.netlify.app',
      'https://intercom-sheets.com',
      'https://app.pendo.io',
      'https://accounts.google.com',
      'https://overbridgenet.com',
      'https://dev-44895517.okta.com',
      'https://trial-8407732.okta.com',
      'https://skullcandy.okta.com',
      'https://apollo-prod.okta.com',
      'https://parachutehealth.okta.com',
      'https://oin-ops-test.trexcloud.com'
    ],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'media-src': [
      "'self'",
      'blob:',
      'https://fora-prod-recordings.s3.amazonaws.com',
      'https://js.intercomcdn.com'
    ],
    'upgrade-insecure-requests': '',
    'frame-ancestors': [
      "'self'",
      'https://*.netlify.app',
      'https://app.netlify.com',
      // 'https://deploy-preview-*--foraday.netlify.app',
      'https://notif-onesignal--foraday.netlify.app'
    ],
    'worker-src': [
      "'self'",
      'blob:',
      'https://*.netlify.app',
      'https://*.fora.day',
      'https://onesignal.com',
      // 'https://deploy-preview-*--foraday.netlify.app',
      'https://notif-onesignal--foraday.netlify.app'
    ]
  };
  const keys = Object.keys(policy);
  return keys
    .map((key) => {
      let value = policy[key];
      if (Array.isArray(value)) {
        value = value.join(' ');
      }
      return `${key} ${value};`;
    })
    .join(' ');
}
