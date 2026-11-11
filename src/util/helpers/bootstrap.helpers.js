import axios from 'axios';
import store from 'storejs';
import { isNil, omit, random, uniqueId } from 'lodash-es';
import { OktaAuth } from '@okta/okta-auth-js';
import Rollbar from 'rollbar';

import { MICROSOFT_AUTH_APP_CONFIG, OKTA_CONFIG } from '@util/constants';
import { NavigationClient, PublicClientApplication } from '@azure/msal-browser';
import { generateRandomImageURL } from '@util/helpers/general.helpers.js';
import OneSignal from 'react-onesignal';
import buildInfo from '@root/build-helpers/build-info.json';
import { formatRollbarTitle, normalizeUrlPath } from '@util/helpers/error-boundary.helpers';
import { getSimplifiedGatesFromStore } from '@store/feature-gates.store';

const INTERCOM_APP_ID = import.meta.env.VITE_INTERCOM_APP_ID;
const ROLLBAR_TOKEN = import.meta.env.VITE_ROLLBAR_TOKEN;

/**
 * Determines the current deployment environment based on the window hostname.
 * @returns {'production'|'development'|'deploy-preview'|'local'|'unknown'} The environment name.
 */
function getEnvironmentName() {
  if (window && window.location) {
    if (window.location.hostname === 'app.fora.day') {
      return 'production';
    } else if (
      window.location.hostname === 'dev.fora.day' ||
      window.location.hostname === 'dev--foraday.netlify.app'
    ) {
      return 'development';
    } else if (window.location.hostname.indexOf('deploy-preview') > -1) {
      return 'deploy-preview';
    } else {
      return 'local';
    }
  }
  return process.env.NODE_ENV || 'unknown';
}

// --- Sanitization Helpers ---
const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'apikey',
  'api_key',
  'auth',
  'authorization',
  'cookie',
  'set-cookie',
  'email',
  'creditcard',
  'credit_card',
  'ccnum',
  'cvv',
  'ssn'
];

const SENSITIVE_HEADERS = [
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'proxy-authorization',
  'x-fora-key'
];

const REDACTED_PLACEHOLDER = '[REDACTED]';
const MAX_VALUE_LENGTH = 2048;

const EMAIL_REGEX = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;

/**
 * Recursively sanitizes an input value (object, array, or primitive).
 * Redacts strings matching email patterns and keys/values identified as sensitive.
 * Truncates long strings and handles circular references.
 * @param {*} value - The value to sanitize.
 * @param {string} [path=''] - The current path of the value within the original object (used for context, not currently for redaction logic).
 * @param {Set<Object>} [visited=new Set()] - A set to track visited objects for circular reference detection.
 * @returns {*} The sanitized value.
 */
export function sanitizeValue(value, path = '', visited = new Set()) {
  if (value === null || typeof value !== 'object') return handlePrimitiveValue(value);
  if (visited.has(value)) return '[CIRCULAR_REFERENCE]';

  visited.add(value);

  let sanitizedData;
  if (Array.isArray(value)) {
    sanitizedData = value.map((item, index) => sanitizeValue(item, `${path}[${index}]`, visited));
  } else {
    sanitizedData = {};
    for (const key in value) {
      if (Object.hasOwn(value, key)) {
        const lowerKey = key.toLowerCase();
        const currentPath = path ? `${path}.${key}` : key;

        if (SENSITIVE_KEYS.includes(lowerKey)) {
          sanitizedData[key] = REDACTED_PLACEHOLDER;
        } else {
          sanitizedData[key] = sanitizeValue(value[key], currentPath, visited);
        }
      }
    }
  }

  visited.delete(value);
  return sanitizedData;
}

// Helper function for sanitizeValue
function handlePrimitiveValue(value) {
  if (typeof value !== 'string') return value;

  let sanitized = value.replace(EMAIL_REGEX, REDACTED_PLACEHOLDER);

  if (sanitized.length > MAX_VALUE_LENGTH) {
    sanitized = sanitized.substring(0, MAX_VALUE_LENGTH) + '...[TRUNCATED]';
  }

  return sanitized;
}

/**
 * Sanitizes HTTP headers by redacting sensitive header values.
 * @param {Object} headers - The headers object to sanitize.
 * @returns {Object} Sanitized headers object with sensitive values redacted.
 */
export function sanitizeHeaders(headers) {
  if (!headers || typeof headers !== 'object') {
    return headers;
  }
  const sanitized = {};
  for (const key in headers) {
    if (Object.hasOwn(headers, key)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_HEADERS.includes(lowerKey)) {
        sanitized[key] = REDACTED_PLACEHOLDER;
      } else {
        sanitized[key] = sanitizeValue(headers[key], `header.${key}`);
      }
    }
  }
  return sanitized;
}

// --- End Sanitization Helpers ---

// --- Rollbar Transform Helper Functions ---

/**
 * Tries to apply a standardized title to the Rollbar payload.
 * Looks for a title format like `[TYPE] Identifier` in context args or error messages.
 * @param {object} payload - The Rollbar payload object (will be mutated).
 * @param {object} context - The Rollbar context object.
 * @returns {object} The potentially modified payload.
 */
export function applyCustomTitle(payload, context) {
  let customTitle = null;
  if (context?.args && typeof context.args[0] === 'string' && context.args[0].startsWith('[')) {
    customTitle = context.args[0];
  } else if (payload?.custom?.errorMessage?.startsWith('[')) {
    customTitle = payload.custom.errorMessage;
  } else if (payload?.body?.trace?.exception?.message?.startsWith('[')) {
    customTitle = payload.body.trace.exception.message;
  }

  if (customTitle) {
    payload.body = payload.body || {};
    if (!payload.body.message) payload.body.message = {};
    payload.body.message.body = customTitle;

    if (payload.body.trace?.exception) {
      payload.body.trace.exception.message = customTitle;
    } else if (payload.body?.trace && !payload.body.trace.exception) {
      payload.body.trace.exception = { message: customTitle };
    }
    if (payload.body.trace_chain) {
      payload.body.trace_chain.forEach((trace) => {
        if (trace.exception) {
          trace.exception.message = customTitle;
        }
      });
    }
  }
  return payload;
}

/**
 * Sanitizes raw request payload and headers attached to the payload.custom object.
 * Redacts sensitive fields and replaces raw data with sanitized versions.
 * @param {object} payload - The Rollbar payload object (will be mutated).
 * @returns {object} The potentially modified payload.
 */
export function sanitizePayloadData(payload) {
  if (!payload.custom) payload.custom = {};

  if (payload?.custom?.rawRequestPayload) {
    let rawPayload = payload.custom.rawRequestPayload;
    try {
      if (typeof rawPayload === 'string') {
        try {
          rawPayload = JSON.parse(rawPayload);
        } catch (parseError) {
          console.warn(
            '[Rollbar Transform] Failed to parse rawRequestPayload as JSON.',
            parseError
          );
        }
      }
      let sanitizedPayload = sanitizeValue(rawPayload);
      try {
        const stringifiedPayload = JSON.stringify(sanitizedPayload);
        if (stringifiedPayload.length > MAX_VALUE_LENGTH) {
          sanitizedPayload =
            stringifiedPayload.substring(0, MAX_VALUE_LENGTH) + '...[TRUNCATED_PAYLOAD]';
        } else if (
          sanitizedPayload === REDACTED_PLACEHOLDER ||
          sanitizedPayload === '[ERROR_SANITIZING_PAYLOAD]'
        ) {
          sanitizedPayload = stringifiedPayload;
        }
      } catch (stringifyError) {
        console.warn('[Rollbar Transform] Failed to stringify sanitized payload.', stringifyError);
        sanitizedPayload = '[ERROR_STRINGIFYING_PAYLOAD]';
      }
      payload.custom.sanitizedRequestPayload = sanitizedPayload;
    } catch (e) {
      console.error('[Rollbar Transform] Error sanitizing request payload:', e);
      payload.custom.sanitizedRequestPayload = '[ERROR_SANITIZING_PAYLOAD]';
    }
    delete payload.custom.rawRequestPayload;
  }

  if (payload.custom?.rawRequestHeaders) {
    try {
      payload.custom.sanitizedRequestHeaders = sanitizeHeaders(payload.custom.rawRequestHeaders);
    } catch (e) {
      console.error('[Rollbar Transform] Error sanitizing request headers:', e);
      payload.custom.sanitizedRequestHeaders = '[ERROR_SANITIZING_HEADERS]';
    }
    delete payload.custom.rawRequestHeaders;
  }
  return payload;
}

/**
 * Adds build information (version, branch, etc.) and environment to the payload.
 * @param {object} payload - The Rollbar payload object (will be mutated).
 * @returns {object} The modified payload.
 */
export function addBuildInfo(payload) {
  if (!payload.custom) payload.custom = {};
  payload.custom.buildInfo = buildInfo
    ? { ...buildInfo, environment: getEnvironmentName() }
    : { environment: getEnvironmentName() };
  return payload;
}

/**
 * Merges extra arguments (often from Rollbar.error context) into the main payload.custom object.
 * @param {object} payload - The Rollbar payload object (will be mutated).
 * @returns {object} The modified payload.
 */
export function mergeExtraArgs(payload) {
  if (!payload.custom) payload.custom = {};
  if (payload.custom?.extraArgs?.['0']) {
    const contextData = payload.custom.extraArgs['0'];
    payload.custom = { ...contextData, ...payload.custom };
  }
  delete payload.custom?.extraArgs;

  if (payload.custom?.componentProps?.extraArgs) {
    const args = payload.custom.componentProps.extraArgs;
    for (const key in args) {
      if (!Object.hasOwn(payload.custom, key)) {
        payload.custom[key] = args[key];
      }
    }
    delete payload.custom.componentProps.extraArgs;
  }

  return payload;
}

/**
 * Removes potentially large Statsig client instances from the payload.
 * @param {object} payload - The Rollbar payload object (will be mutated).
 * @returns {object} The modified payload.
 */
export function removeStatsigClient(payload) {
  if (!payload.custom) payload.custom = {};

  if (payload.custom?.componentProps?.statsigClient) {
    delete payload.custom.componentProps.statsigClient;
  }

  deleteStatsigFromAllKeys(payload.custom);
  deleteStatsigFromExtraArgs(payload.custom);

  return payload;
}

// Helper function for removeStatsigClient
function deleteStatsigFromAllKeys(obj) {
  for (const key in obj) {
    if (obj[key]?.statsigClient) {
      safeDelete(obj[key], 'statsigClient', `custom.${key}`);
    }
  }
}

// Helper function for removeStatsigClient
function deleteStatsigFromExtraArgs(custom) {
  const args = custom.extraArgs;
  if (!args) return;

  for (const key in args) {
    if (args[key]?.statsigClient) {
      safeDelete(args[key], 'statsigClient', `extraArgs.${key}`);
    }
  }

  delete custom.extraArgs;
}

// Helper function for removeStatsigClient
function safeDelete(obj, key, context) {
  try {
    delete obj[key];
  } catch (e) {
    console.warn(e);
    console.warn(`[Rollbar Transform] Could not delete statsigClient from ${context}`);
  }
}

/**
 * Removes keys from `payload.body.trace.extra` if they also exist in `payload.custom`
 * to avoid redundancy. Deletes `payload.body.trace.extra` if it becomes empty.
 * @param {object} payload - The Rollbar payload object (will be mutated).
 * @returns {object} The modified payload.
 */
export function cleanTraceExtra(payload) {
  if (payload.custom && payload.body?.trace?.extra) {
    const customKeys = Object.keys(payload.custom);
    for (const key of customKeys) {
      if (key in payload.body.trace.extra) {
        delete payload.body.trace.extra[key];
      }
    }
    if (Object.keys(payload.body.trace.extra).length === 0) {
      delete payload.body.trace.extra;
    }
  }
  return payload;
}

/**
 * Truncates the `payload.custom.componentStack` string if it exceeds a certain length.
 * @param {object} payload - The Rollbar payload object (will be mutated).
 * @returns {object} The modified payload.
 */
export function truncateComponentStack(payload) {
  if (payload.custom?.componentStack && payload.custom.componentStack.length > 300) {
    payload.custom.componentStack =
      payload.custom.componentStack.substring(0, 300) + '... (truncated)';
  }
  return payload;
}

/**
 * Deduplicates error entries within the `payload.body.telemetry` array based on message and stack.
 * @param {object} payload - The Rollbar payload object (will be mutated).
 * @returns {object} The modified payload.
 */
export function deduplicateTelemetry(payload) {
  if (
    payload.body?.telemetry &&
    Array.isArray(payload.body.telemetry) &&
    payload.body.telemetry.length > 1
  ) {
    const seenErrors = new Map();
    const originalTelemetryCount = payload.body.telemetry.length;

    const uniqueTelemetry = payload.body.telemetry.filter((entry) => {
      if (entry.type !== 'error' || !entry.body) {
        return true;
      }

      const stackSample = entry.body.stack?.split('\\n').slice(0, 3).join('') || '';
      const messageKey = entry.body.message || `error_entry_${entry.level || 'unknown'}`;
      const errorKey = `${messageKey}:${stackSample}`;

      if (seenErrors.has(errorKey)) {
        return false;
      }
      seenErrors.set(errorKey, true);
      return true;
    });

    if (uniqueTelemetry.length < originalTelemetryCount) {
      payload.body.telemetry = uniqueTelemetry;
      if (!payload.custom) payload.custom = {};
      payload.custom.telemetryDeduplication = {
        originalCount: originalTelemetryCount,
        deduplicatedCount: uniqueTelemetry.length
      };
    }
  }
  return payload;
}

// --- End Rollbar Transform Helper Functions ---
const currentEnv = getEnvironmentName();

/**
 * Configuration object for the Rollbar SDK.
 * Defines settings for access token, environment, enabled status, payload defaults,
 * and custom logic for ignoring items and transforming payloads before sending to Rollbar.
 */
export const rollbarConfig = {
  accessToken: ROLLBAR_TOKEN,
  environment: currentEnv,
  enabled: currentEnv !== 'local',
  captureIp: false,
  verbose: true,
  addErrorContext: true,
  autoInstrument: {
    network: false,
    log: true,
    dom: true,
    navigation: true,
    connectivity: true,
    contentSecurityPolicy: true,
    errorOnContentSecurityPolicy: true
  },
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: buildInfo['Commit Hash'] || 'unknown',
        guess_uncaught_frames: true,
        context: `Version: ${buildInfo.Version || 'unknown'}`
      }
    }
  },
  /**
   * Determines whether a Rollbar item should be ignored and not sent.
   * Ignores errors reported by the Axios interceptor (to prevent duplicates),
   * specific test messages, and likely duplicate uncaught errors from the global handler
   * that haven't yet been processed by an ErrorBoundary.
   * @param {boolean} isUncaught - True if the error was uncaught by a try/catch block.
   * @param {Array} args - Original arguments passed to the Rollbar reporting method (e.g., `rollbar.error(message, error, context)`).
   * @param {object} payload - The Rollbar payload object about to be sent.
   * @returns {boolean} True to ignore the item, false to send it.
   */
  checkIgnore: function (isUncaught, args, payload) {
    const originalError = args?.[0];
    if (originalError?._reportedByInterceptor) {
      return true;
    }

    const errorMsg =
      payload?.body?.trace?.exception?.message ||
      payload?.body?.message?.body ||
      (typeof payload?.body?.message === 'string' ? payload.body.message : '') ||
      (typeof args?.[0] === 'string' ? args[0] : '') ||
      originalError?.message ||
      '';

    if (errorMsg.includes('Test:') || errorMsg.includes('should be caught')) {
      console.log('[Rollbar CheckIgnore] Ignoring test error:', errorMsg);
      return true;
    }

    if (errorMsg.includes('403')) {
      return true;
    }

    const customErrorMessage = payload?.custom?.errorMessage;
    const messageIsFormatted =
      typeof customErrorMessage === 'string' && customErrorMessage.startsWith('[');

    if (isUncaught && !messageIsFormatted) {
      console.log(
        '[Rollbar CheckIgnore] Ignoring likely duplicate uncaught error (lacks formatted title):',
        errorMsg
      );
      return true;
    }

    return false;
  },
  /**
   * Modifies the payload object before it is sent to Rollbar.
   * Applies various sanitization, enrichment, and formatting steps sequentially:
   * applies custom title, sanitizes payload data (including headers),
   * adds build info, merges extra arguments, removes Statsig client instances,
   * cleans trace extra data, truncates component stack, and deduplicates telemetry.
   * @param {object} payload - The initial payload object.
   * @param {object} context - Context object provided by Rollbar, containing original arguments and other info.
   * @returns {object} The processed and finalized payload object to be sent to Rollbar.
   */
  transform: function (payload, context) {
    let processedPayload = typeof payload === 'object' && payload !== null ? { ...payload } : {};
    processedPayload.custom =
      typeof processedPayload.custom === 'object' && processedPayload.custom !== null
        ? { ...processedPayload.custom }
        : {};

    processedPayload = applyCustomTitle(processedPayload, context);
    processedPayload = sanitizePayloadData(processedPayload);
    processedPayload = addBuildInfo(processedPayload);
    processedPayload = mergeExtraArgs(processedPayload);
    processedPayload = removeStatsigClient(processedPayload);
    processedPayload = cleanTraceExtra(processedPayload);
    processedPayload = truncateComponentStack(processedPayload);
    processedPayload = deduplicateTelemetry(processedPayload);

    return processedPayload;
  }
};

export const rollbar = new Rollbar(rollbarConfig);

const authUrls = new Set(['people/authenticate', 'oauth/google', 'oauth/microsoft', 'oauth/okta']);

/**
 * Checks for valid request config before passing X-Fora-Key. Ignores login requests
 * @param {string} sessionId - Current user session ID.
 * @param {object} config - Axios request configuration object, containing the URL.
 * @returns {object} An object containing the 'X-Fora-Key' header if applicable, otherwise an empty object.
 *
 * Note that for any fora routes, the url only includes everything after the configured baseURL, e.g.
 * config: {
 *    baseUrl: https://app.fora.day/api/
 *    url: 'people/authenticate'
 * }
 * So localhost http:// calls will not experience any issues
 */
export function generateAuthHeader(sessionId, config) {
  if (authUrls.has(config.url) || config.url.includes('http://')) {
    return {};
  } else {
    return {
      'X-Fora-Key': sessionId
    };
  }
}

/**
 * Configures global Axios defaults and sets up request and response interceptors.
 * - Sets `axios.defaults.baseURL` based on the environment.
 * - Request interceptor: Adds an authentication header (`X-Fora-Key`) to relevant requests.
 * - Response interceptor: Handles API errors by reporting them to Rollbar (with sanitized context and feature flags)
 *   and marking them as reported to prevent duplicate reports. Also handles 403 errors by clearing local session data.
 * @param {object} [env=import.meta.env] - Environment variables object, typically `import.meta.env`.
 */
export function bootstrapAxios(env = import.meta.env) {
  const isDev = env.DEV === true;
  axios.defaults.baseURL = isDev ? env.VITE_FORA_BACKEND_API : `${window.location.origin}/api/`;

  axios.interceptors.request.use(
    (config) => {
      const sessionID = store.get('sessionID');
      const authHeader = generateAuthHeader(sessionID, config);
      return {
        ...config,
        headers: {
          ...authHeader,
          ...config.headers
        }
      };
    },
    (error) => {
      console.warn('request error:', error);
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const method = error?.config?.method?.toUpperCase();
      const url = error?.config?.url;
      const status = error?.response?.status;

      const identifier = `${method || 'UNKNOWN METHOD'} ${status || 'UNKNOWN STATUS CODE'} ${
        url ? normalizeUrlPath(url) : 'UNKNOWN_URL'
      }`;
      const errorMessage = formatRollbarTitle('API Error', identifier);

      const originalContext = {
        apiRequestMethod: method || 'Unknown',
        apiUrl: url || 'Unknown',
        apiResponseStatus: status || 'N/A',
        isApiError: true,
        rawRequestPayload: error?.config?.data,
        rawRequestHeaders: error?.config?.headers
      };

      if (!error._reportedByInterceptor) {
        let processedContext = { custom: { ...originalContext } };
        processedContext = sanitizePayloadData(processedContext);

        try {
          const simplifiedFlags = getSimplifiedGatesFromStore();
          if (simplifiedFlags && Object.keys(simplifiedFlags).length > 0) {
            processedContext.custom.featureFlags = simplifiedFlags;
          }
        } catch (flagError) {
          console.error(
            '[Axios Interceptor] Failed to get feature flags for Rollbar context:',
            flagError
          );
        }

        processedContext.custom.buildInfo = buildInfo;
        rollbar?.error(errorMessage, processedContext.custom);

        Object.defineProperty(error, '_reportedByInterceptor', {
          value: true,
          writable: false,
          enumerable: false,
          configurable: true
        });
      }

      if (status === 403) {
        console.warn('403 Forbidden error, clearing session:', url);
        store.remove('sessionID');
        store.remove('session');
        store.remove('Bearer');

        window.location.assign(`${window.location.origin}/login`);
      }

      console.warn(
        `Axios response error details: ${errorMessage}`,
        error.response || error.message
      );

      return Promise.reject(error);
    }
  );
}

/**
 * Sets up PWA-specific features:
 * - Prevents the default browser context menu.
 * - Attempts to request persistent storage for the application.
 * Logs outcomes to the console.
 * @async
 */
export async function bootstrapPWA() {
  document.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  if (navigator?.storage?.persist) {
    const isPersisted = await navigator.storage.persist();
    if (isPersisted) {
      console.log('Persistent storage granted');
    } else {
      console.log('Persistent storage not granted');
    }
  } else {
    console.warn('Persistent storage API not supported');
  }
}

/**
 * Registers the OneSignal service worker and initializes the OneSignal SDK for push notifications.
 * The OneSignal App ID is chosen based on the development/production environment.
 * @param {boolean} isDev - Indicates if the application is running in a development environment.
 * @param {string} OS_LOCAL_ID - The OneSignal App ID for local/development environments.
 * @param {string} OS_PROD_ID - The OneSignal App ID for the production environment.
 */
export function bootstrapServiceWorker(isDev, OS_LOCAL_ID, OS_PROD_ID) {
  if ('serviceWorker' in navigator) {
    const OSAppId = isDev ? OS_LOCAL_ID : OS_PROD_ID;
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/OneSignalSDKWorker.js', { scope: '/' })
        .then(() => {
          OneSignal.init({
            appId: OSAppId,
            notifyButton: {
              enable: false
            },
            allowLocalhostAsSecureOrigin: isDev
          });
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    });
  }
}

const cachedImages = [];

/**
 * Preloads a set of random images (intended for pulse panels) by fetching them and storing them in an image cache.
 * This helps to avoid loading delays when these images are needed.
 * @async
 */
export async function bootstrapRandomPulseImages() {
  const width = 928;
  const height = 1648;

  for (let i = 0; i < 20; i++) {
    const imageUrl = generateRandomImageURL(width, height);
    axios
      .get(imageUrl, { maxRedirects: 0 })
      .then((response) => {
        const finalUrl = response.request.responseURL;
        const img = new Image();
        img.src = finalUrl;
        cachedImages.push(img);
      })
      .catch((error) => {
        if (error.response && error.response.status === 302) {
          const finalUrl = error.response.headers.location;
          const img = new Image();
          img.src = finalUrl;
          cachedImages.push(img);
        } else {
          console.error('Error loading image:', error);
        }
      });
  }
}

/**
 * Returns a randomly selected preloaded pulse image from the cache.
 * @returns {HTMLImageElement} A random HTMLImageElement from the cache.
 * @throws {Error} If no images are cached (i.e., `bootstrapRandomPulseImages` was not called or failed).
 */
export function getRandomPulseImage() {
  if (cachedImages.length === 0) {
    throw new Error('No images cached. Please call cacheRandomImages() first.');
  }
  const randomIndex = random(0, cachedImages.length - 1);
  return cachedImages[randomIndex];
}

/**
 * Checks if the application is currently running in standalone Progressive Web App (PWA) mode.
 * @returns {boolean} True if the app is in PWA mode, false otherwise.
 */
export function isPWA() {
  return (
    window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true
  );
}

/**
 * Initializes Pendo analytics with user and tenant data, if Pendo is available on the window object.
 * @param {object} user - The current user object, expected to have id, email, name, title, created_at.
 * @param {object} tenant - The current tenant object, expected to have id, name, slack_config, teams_config, created_at.
 */
export function initializePendo(user, tenant) {
  if (window?.pendo) {
    window.pendo.initialize({
      visitor: {
        id: user.id,
        email: user.email,
        full_name: user.name,
        role: user.title,
        creationDate: user.created_at
      },
      account: {
        id: tenant.id,
        name: tenant.name,
        usesSlack: !isNil(tenant.slack_config),
        usesTeams: !isNil(tenant.teams_config)
      }
    });
  }
}

/**
 * Creates and configures the Microsoft Authentication Library (MSAL) PublicClientApplication instance.
 * It sets up a custom navigation client to integrate with React Router.
 * @param {Function} navigate - React Router navigate function for handling redirects.
 * @param {string} [microsoftTenantId='common'] - Optional Microsoft tenant ID. Defaults to 'common'.
 * @returns {import('@azure/msal-browser').PublicClientApplication} The configured MSAL PublicClientApplication instance.
 */
export function bootstrapMsalPCA(navigate, microsoftTenantId = 'common') {
  const pca = new PublicClientApplication(MICROSOFT_AUTH_APP_CONFIG(microsoftTenantId));
  const navigationClient = new CustomNavigationClient(navigate);
  pca.setNavigationClient(navigationClient);
  return pca;
}

/**
 * Creates and configures the Okta authentication client using OktaAuth from '@okta/okta-auth-js'.
 * @param {object} oktaConfig - Okta configuration options, typically including `clientId` and `issuer`.
 * @returns {import('@okta/okta-auth-js').OktaAuth} The configured OktaAuth client instance.
 */
export function initializeOktaAuth(oktaConfig) {
  return new OktaAuth({
    redirectUri: OKTA_CONFIG.redirectUri,
    scopes: OKTA_CONFIG.scopes,
    ...oktaConfig
  });
}

/**
 * Custom MSAL navigation client that integrates with React Router v6 for handling browser navigation
 * triggered by MSAL operations like loginRedirect or acquireTokenRedirect.
 */
export class CustomNavigationClient extends NavigationClient {
  /**
   * Creates an instance of CustomNavigationClient.
   * @param {Function} navigate - The navigate function from React Router (useNavigate hook).
   */
  constructor(navigate) {
    super();
    this.navigate = navigate;
  }

  /**
   * Handles MSAL's internal navigation requests by using the provided React Router navigate function.
   * @param {string} url - The URL (potentially absolute) to navigate to, as requested by MSAL.
   * @param {object} options - Navigation options provided by MSAL.
   * @param {boolean} options.noHistory - If true, the navigation should replace the current entry in history.
   * @returns {Promise<boolean>} Always returns a Promise resolving to false to indicate to MSAL that navigation has been handled.
   */
  async navigateInternal(url, options) {
    const relativePath = url.replace(window.location.origin, '');
    const navigateOptions = { state: { msalLoading: true } };
    if (options.noHistory) {
      this.navigate(relativePath, { replace: true, ...navigateOptions });
    } else {
      this.navigate(relativePath, navigateOptions);
    }

    return false;
  }
}

/**
 * Initializes the Intercom chat widget if the Intercom App ID is configured and the application
 * is running on the production host ('app.fora.day').
 * @param {object} user - The current user object, expected to have id, name, email, created_at.
 * @param {object} tenant - The current tenant object, expected to have id, name, created_at.
 */
export function initializeIntercom(user, tenant) {
  if (INTERCOM_APP_ID && window.location.host === 'app.fora.day') {
    window.Intercom('boot', {
      api_base: 'https://api-iam.intercom.io',
      app_id: INTERCOM_APP_ID,
      user_id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.created_at,
      company: {
        id: tenant.id,
        name: tenant.name,
        created_at: tenant.created_at
      },
      custom_launcher_selector: '#intercom-support'
    });
  }
}

/**
 * Builds a Statsig user object from the application's user object.
 * If no user is provided, a unique ID for a logged-out user is generated.
 * For guest users, tenant is set to 'guest'. Otherwise, the user's primary tenant name is used.
 * @param {object|null} user - The application's user object, or null for logged-out users.
 * @returns {object} The Statsig user object with userID, email, name, and custom properties.
 */
export function buildStatsigUser(user) {
  let tenant;
  if (!user) {
    return {
      userID: uniqueId('LOGGED_OUT-')
    };
  } else if (user.isGuest) {
    tenant = 'guest';
  } else {
    tenant = user.tenants[0].name;
  }
  return {
    userID: user?.id,
    email: user?.email,
    name: user?.name,
    custom: {
      tenant,
      ...omit(user, [
        'tenants',
        'email',
        'name',
        'id',
        'level',
        'context',
        'digest_configs',
        'nylas_account_id',
        'card_receipt_levels',
        'apollo_profile'
      ])
    }
  };
}

/**
 * Configures the provided or global Rollbar instance with user identification data.
 * If no specific Rollbar instance is given, the module-scoped `rollbar` instance is used.
 * If a user with an ID is provided, Rollbar is configured with the user's ID and email.
 * If no user or no user ID is provided, the person context in Rollbar is cleared.
 * @param {object} user - The user object, expected to have `id` and optionally `email`.
 * @param {object} [rollbarInstance] - Optional specific Rollbar instance to configure.
 */
export function registerUserWithRollbar(user, rollbarInstance) {
  const effectiveRollbar = rollbarInstance || rollbar;
  if (effectiveRollbar && user?.id) {
    effectiveRollbar.configure({
      payload: {
        person: {
          id: user.id,
          email: user?.email
        }
      }
    });
    console.log('[Rollbar] User configured:', user.id);
  } else if (effectiveRollbar) {
    effectiveRollbar.configure({
      payload: {
        person: null
      }
    });
    console.log('[Rollbar] User context cleared (registerUserWithRollbar).');
  }
}

/**
 * Explicitly clears the user context (person data) from the provided or global Rollbar instance.
 * If no specific Rollbar instance is given, the module-scoped `rollbar` instance is used.
 * @param {object} [rollbarInstance] - Optional specific Rollbar instance to configure.
 */
export function clearUserFromRollbar(rollbarInstance) {
  const effectiveRollbar = rollbarInstance || rollbar;
  if (effectiveRollbar) {
    effectiveRollbar.configure({
      payload: {
        person: null
      }
    });
    console.log('[Rollbar] User context explicitly cleared (clearUserFromRollbar).');
  }
}
