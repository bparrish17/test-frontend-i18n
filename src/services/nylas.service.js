import Axios from 'axios';

const NYLAS_CLIENT_ID = import.meta.env.VITE_NYLAS_CLIENT_ID;

export default class NylasService {
  static serviceInstance = null;

  constructor() {
    this.baseURL = '/nylas';
    this.nylasURL = 'https://api.us.nylas.com';
  }

  static getInstance() {
    if (NylasService.serviceInstance == null) {
      NylasService.serviceInstance = new NylasService();
    }
    return this.serviceInstance;
  }

  // redirect user to Nylas hosted auth (and then later send resultant code to backend for proecessing)
  async connectNylasAccount(person) {
    const params = {
      client_id: NYLAS_CLIENT_ID,
      redirect_uri: `${window.location.origin}/callback/nylas`,
      response_type: 'code',
      login_hint: person.email,
      access_type: 'offline'
    };
    const queryString = new URLSearchParams(params).toString();
    window.location.assign(`${this.nylasURL}/v3/connect/auth?${queryString}`);
  }

  async registerWithBackend(code) {
    return Axios({
      data: {
        code,
        redirectUri: `${window.location.origin}/callback/nylas`
      },
      method: 'POST',
      url: `${this.baseURL}/authorize`
    }).then((res) => res?.data);
  }

  async getNylasAccountForUser(user) {
    return Axios({
      method: 'POST',
      url: `${this.baseURL}/accounts/search`,
      data: {
        person_id: user?.id
      }
    });
  }

  async deleteNylasGrant(accountId, propagate = false) {
    return Axios({
      method: 'DELETE',
      url: `${this.baseURL}/grants/${accountId}`,
      params: {
        propagate
      }
    }).then((res) => res?.data);
  }
}
