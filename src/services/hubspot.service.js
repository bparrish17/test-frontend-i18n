const HUBSPOT_CLIENT_ID = import.meta.env.VITE_HUBSPOT_CLIENT_ID;
const HUBSPOT_REDIRECT_URI = import.meta.env.VITE_HUBSPOT_REDIRECT_URI;
const scopes = [
  'crm.objects.companies.read',
  'crm.objects.contacts.read',
  'crm.objects.deals.read',
  'crm.objects.leads.read',
  'crm.objects.users.read',
  'crm.objects.owners.read'
];

export async function connectHubspotAccount() {
  const params = {
    client_id: HUBSPOT_CLIENT_ID,
    redirect_uri: HUBSPOT_REDIRECT_URI,
    scope: scopes.join(' ')
  };
  const queryString = new URLSearchParams(params).toString();
  window.location.assign(`https://app.hubspot.com/oauth/authorize?${queryString}`);
}
