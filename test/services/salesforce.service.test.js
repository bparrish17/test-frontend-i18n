import { vi } from 'vitest';
import { connectSFAccount } from '@services/salesforce.service';

const SALESFORCE_REDIRECT_URI = process.env.VITE_SALESFORCE_REDIRECT_URI;
const CONSUMER_KEY = process.env.VITE_SALESFORCE_CONSUMER_KEY;

describe('connectSFAccount', () => {
  beforeEach(() => {
    // Mock window.location.assign
    global.window = Object.create(window);
    global.window.location = { assign: vi.fn() };
  });

  it('should redirect to the correct Salesforce OAuth URL', () => {
    connectSFAccount();

    // Expected URL
    const expectedUrl = `https://login.salesforce.com/services/oauth2/authorize?response_type=code&redirect_uri=${encodeURIComponent(
      SALESFORCE_REDIRECT_URI
    )}&client_id=${CONSUMER_KEY}&prompt=consent`;

    // Verify redirect
    expect(window.location.assign).toHaveBeenCalledWith(expectedUrl);
  });
});
