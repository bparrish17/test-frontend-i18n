import { vi } from 'vitest';
import { connectRingCentralAccount } from '@services/ringcentral.service';

const RC_CLIENT_ID = process.env.VITE_RC_CLIENT_ID;

describe('connectRingCentralAccount', () => {
  beforeEach(() => {
    // Mock window.location.assign
    global.window = Object.create(window);
    global.window.location = { assign: vi.fn(), origin: vi.fn(() => 'http://localhost') };
  });

  it('should redirect to the correct ringcentral OAuth URL', () => {
    connectRingCentralAccount();

    const params = {
      response_type: 'code',
      client_id: RC_CLIENT_ID,
      redirect_uri: `${window.location.origin}/ringcentral/callback`
    };
    const queryString = new URLSearchParams(params).toString();
    const expectedUrl = `https://platform.ringcentral.com/restapi/oauth/authorize?${queryString}`;

    // Verify redirect
    expect(window.location.assign).toHaveBeenCalledWith(expectedUrl);
  });
});
