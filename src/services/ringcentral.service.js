const RC_CLIENT_ID = import.meta.env.VITE_RC_CLIENT_ID;

export async function connectRingCentralAccount() {
  const params = {
    response_type: 'code',
    client_id: RC_CLIENT_ID,
    redirect_uri: `${window.location.origin}/ringcentral/callback`
  };
  const queryString = new URLSearchParams(params).toString();

  window.location.assign(`https://platform.ringcentral.com/restapi/oauth/authorize?${queryString}`);
}
