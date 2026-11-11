import { describe, it, expect, vi, beforeEach } from 'vitest';

import { checkSession, extractOktaSubdomain } from '@util/helpers/okta.helpers';
import { initializeOktaAuth } from '@util/helpers';
import { OKTA_CONFIG } from '@util/constants';

vi.mock('@util/helpers', () => ({
  initializeOktaAuth: vi.fn()
}));

describe('checkSession', () => {
  const mockOktaAuth = {
    token: {
      getWithoutPrompt: vi.fn()
    },
    tokenManager: {
      setTokens: vi.fn()
    }
  };

  const oktaConfig = {
    clientId: OKTA_CONFIG.clientId,
    issuer: OKTA_CONFIG.issuer
  };

  beforeEach(() => {
    vi.clearAllMocks();
    initializeOktaAuth.mockReturnValue(mockOktaAuth);
  });

  it('should return true if tokens are successfully fetched and set', async () => {
    // Mock successful token fetch
    const mockTokens = { tokens: { accessToken: 'mockAccessToken' } };
    mockOktaAuth.token.getWithoutPrompt.mockResolvedValue(mockTokens);

    const result = await checkSession(oktaConfig);

    // Assertions
    expect(initializeOktaAuth).toHaveBeenCalledWith(oktaConfig);
    expect(mockOktaAuth.token.getWithoutPrompt).toHaveBeenCalledTimes(1);
    expect(mockOktaAuth.tokenManager.setTokens).toHaveBeenCalledWith(mockTokens.tokens);
    expect(result).toBe(true);
  });

  it('should return false if token fetch fails', async () => {
    // Mock a failure during token fetch
    mockOktaAuth.token.getWithoutPrompt.mockRejectedValue(new Error('Failed'));

    const result = await checkSession(oktaConfig);

    // Assertions
    expect(initializeOktaAuth).toHaveBeenCalledWith(oktaConfig);
    expect(mockOktaAuth.token.getWithoutPrompt).toHaveBeenCalledTimes(1);
    expect(mockOktaAuth.tokenManager.setTokens).not.toHaveBeenCalled();
    expect(result).toBe(false);
  });
});

describe('extractOktaSubdomain', () => {
  it('should extract subdomain and realm', async () => {
    const { subdomain, realm } = extractOktaSubdomain(
      'https://test-12345.okta.com/oauth2/custom/v1/userinfo'
    );
    expect(subdomain).toBe('test-12345');
    expect(realm).toBe('custom');
  });

  it('should handle default realm', async () => {
    const { subdomain, realm } = extractOktaSubdomain(
      'https://test-12345.okta.com/oauth2/default/v1/userinfo'
    );
    expect(subdomain).toBe('test-12345');
    expect(realm).toBe('default');
  });

  it('should handle partial match (built-in auth server)', async () => {
    const { subdomain, realm } = extractOktaSubdomain(
      'https://test-12345.okta.com/oauth2/v1/userinfo'
    );
    expect(subdomain).toBe('test-12345');
    expect(realm).toBe(undefined);
  });

  it('should handle no match', async () => {
    const { subdomain, realm } = extractOktaSubdomain('test-12345.okta.com');
    expect(subdomain).toBe(null);
    expect(realm).toBe('default');
  });
});
