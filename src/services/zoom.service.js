import RecallService from '@services/recall.service';

const ZOOM_CLIENT_ID = import.meta.env.VITE_ZOOM_CLIENT_ID;
const ZOOM_REDIRECT_URI = import.meta.env.VITE_ZOOM_REDIRECT_URI;
const recallService = RecallService.getInstance();

export async function connectZoomAccount() {
  const params = {
    response_type: 'code',
    redirect_uri: ZOOM_REDIRECT_URI,
    client_id: ZOOM_CLIENT_ID
  };
  const queryString = new URLSearchParams(params).toString();
  window.location.assign(`https://zoom.us/oauth/authorize?${queryString}`);
}

export async function registerWithBackend(code) {
  return recallService.createZoomOAuthCredential(code, ZOOM_REDIRECT_URI);
}
