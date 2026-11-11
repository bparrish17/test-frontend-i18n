import { describe, it, expect, vi } from 'vitest';
import { connectHubspotAccount } from '@services/hubspot.service';

// Mock the `window.location.assign` function
vi.stubGlobal('location', { assign: vi.fn() });

describe('connectHubspotAccount', () => {
  it('should redirect to HubSpot OAuth authorization page with correct parameters', async () => {
    // Call the function
    await connectHubspotAccount();

    // Define the expected query parameters
    const expectedParams = new URLSearchParams({
      client_id: import.meta.env.VITE_HUBSPOT_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_HUBSPOT_REDIRECT_URI,
      scope: [
        'crm.objects.companies.read',
        'crm.objects.contacts.read',
        'crm.objects.deals.read',
        'crm.objects.leads.read',
        'crm.objects.users.read',
        'crm.objects.owners.read'
      ].join(' ')
    });

    // Check if `window.location.assign` was called with the correct URL
    expect(location.assign).toHaveBeenCalledWith(
      `https://app.hubspot.com/oauth/authorize?${expectedParams.toString()}`
    );
  });
});
