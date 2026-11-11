import Axios from 'axios';

const model = 'oauth';

/**
 * Returns request to POST /oauth/ with provided service
 * TODO: confirm if we really need to make two requests, question mark?
 * @param {'google' | 'microsoft' | 'okta'} service
 * @returns {(accessToken: string, idToken: string, domain: string, realm: boolean) => Promise<any>}
 */
function authenticateWith(service) {
  const makeAuthRequest = (accessToken, idToken, domain, realm, guest) =>
    Axios({
      method: 'POST',
      url: `${model}/${service}`,
      data: { accessToken, idToken, rememberMe: true, guest, domain, realm }
    }).then((res) => res?.data);

  return async (accessToken, idToken, domain, realm) => {
    try {
      // First attempt, non-guest login
      return await makeAuthRequest(accessToken, idToken, domain, realm, false);
    } catch (error) {
      // Second attempt, guest login
      return await makeAuthRequest(accessToken, idToken, domain, realm, true);
    }
  };
}

export const authenticateWithGoogle = authenticateWith('google');
export const authenticateWithMicrosoft = authenticateWith('microsoft');
export const authenticateWithOkta = authenticateWith('okta');
