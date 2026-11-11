const SALESFORCE_REDIRECT_URI = import.meta.env.VITE_SALESFORCE_REDIRECT_URI;
const CONSUMER_KEY = import.meta.env.VITE_SALESFORCE_CONSUMER_KEY;

export async function connectSFAccount() {
  const params = {
    response_type: 'code',
    redirect_uri: SALESFORCE_REDIRECT_URI,
    client_id: CONSUMER_KEY,
    prompt: 'consent'
  };
  const queryString = new URLSearchParams(params).toString();
  window.location.assign(`https://login.salesforce.com/services/oauth2/authorize?${queryString}`);
}
