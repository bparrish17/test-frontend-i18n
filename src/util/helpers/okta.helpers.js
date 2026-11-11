import { initializeOktaAuth } from '@util/helpers';

export async function checkSession(oktaConfig) {
  try {
    const oktaAuth = initializeOktaAuth(oktaConfig);
    const tokens = await oktaAuth.token.getWithoutPrompt();
    oktaAuth.tokenManager.setTokens(tokens.tokens);
    return true;
  } catch (err) {
    return false;
  }
}

export function extractOktaSubdomain(url) {
  const regex = /https:\/\/([^.]+)\.okta\.com\/oauth2(?:\/([^/]+))?\/v1\/userinfo/;
  const match = url.match(regex);

  if (match) {
    return {
      subdomain: match[1],
      realm: match[2]
    };
  }

  return {
    subdomain: null,
    realm: 'default'
  };
}
