import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { useNavigate } from 'react-router-dom';

import { useUserStore } from '@store/app.store';
import { initializeOktaAuth, extractOktaSubdomain } from '@util/helpers';
import { useLoginShared } from '@util/hooks';
import OktaCallbackPage from '@pages/callback/okta-callback.page';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/helpers', () => ({
  initializeOktaAuth: vi.fn(),
  extractOktaSubdomain: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useLoginShared: vi.fn()
}));

describe('OktaCallbackPage', () => {
  const mockNavigate = vi.fn();
  const mockAuthenticateWithOkta = vi.fn();
  const mockOpenErrorToast = vi.fn();
  const mockOktaAuth = {
    handleRedirect: vi.fn(),
    tokenManager: {
      get: vi.fn()
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useUserStore.mockReturnValue(mockAuthenticateWithOkta);
    useLoginShared.mockReturnValue({
      openErrorToast: mockOpenErrorToast
    });
    initializeOktaAuth.mockReturnValue(mockOktaAuth);
    extractOktaSubdomain.mockReturnValue({ subdomain: 'test-123456', realm: 'default' });
  });

  it('should render the loading spinner initially', async () => {
    render(<OktaCallbackPage />);

    await waitFor(() => {
      expect(screen.getByText('Connecting to Okta...')).toBeInTheDocument();
      expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
    });
  });

  it('should navigate to the home page on successful authentication', async () => {
    mockOktaAuth.handleRedirect.mockResolvedValueOnce();
    mockOktaAuth.tokenManager.get
      .mockResolvedValueOnce({
        accessToken: 'mockAccessToken',
        userinfoUrl: 'https://test-123456.okta.com/oauth2/default/userInfo'
      }) // Mock accessToken
      .mockResolvedValueOnce({ idToken: 'mockIdToken' }); // Mock idToken

    render(<OktaCallbackPage />);

    await waitFor(() => {
      expect(mockOktaAuth.handleRedirect).toHaveBeenCalled();
      expect(mockOktaAuth.tokenManager.get).toHaveBeenCalledWith('accessToken');
      expect(mockOktaAuth.tokenManager.get).toHaveBeenCalledWith('idToken');
      expect(mockAuthenticateWithOkta).toHaveBeenCalledWith(
        'mockAccessToken',
        'mockIdToken',
        'test-123456',
        'default'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display an error toast and navigate to /login/okta on authentication failure', async () => {
    mockOktaAuth.handleRedirect.mockResolvedValueOnce();
    mockOktaAuth.tokenManager.get
      .mockResolvedValueOnce(null) // No accessToken
      .mockResolvedValueOnce(null); // No idToken

    render(<OktaCallbackPage />);

    await waitFor(() => {
      expect(mockOktaAuth.handleRedirect).toHaveBeenCalled();
      expect(mockOktaAuth.tokenManager.get).toHaveBeenCalledWith('accessToken');
      expect(mockOktaAuth.tokenManager.get).toHaveBeenCalledWith('idToken');
      expect(mockOpenErrorToast).toHaveBeenCalledWith(
        'Failed to connect to Okta. Please try again.'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login/okta');
    });
  });
});
