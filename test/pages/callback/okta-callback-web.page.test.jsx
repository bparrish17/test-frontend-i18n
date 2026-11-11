import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getOktaToken } from '@services/query-services/lambda.query-service';
import { useUserStore } from '@store/app.store';
import { initializeOktaAuth } from '@util/helpers';
import { useLoginShared } from '@util/hooks';

import OktaCallbackWebPage from '@pages/callback/okta-callback-web.page';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useSearchParams: vi.fn(),
  useLocation: vi.fn(() => {
    return {
      pathname: '/callback/login/okta'
    };
  })
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

vi.mock('@services/query-services/lambda.query-service', () => ({
  getOktaToken: vi.fn()
}));

describe('OktaCallbackWebPage', () => {
  const mockNavigate = vi.fn();
  const mockAuthenticateWithOkta = vi.fn();
  const mockOpenErrorToast = vi.fn();
  const mockOktaAuth = {
    transactionManager: {
      load: vi.fn(() => {
        return {
          codeVerifier: 'code-verifier'
        };
      })
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
    getOktaToken.mockResolvedValue({
      accessToken: 'token1',
      idToken: 'id-token-1',
      subdomain: 'test-123456'
    });
  });

  it('should render the loading spinner initially', async () => {
    useSearchParams.mockReturnValue([new URLSearchParams('')]);
    render(<OktaCallbackWebPage />);

    await waitFor(() => {
      expect(screen.getByText('Connecting to Okta...')).toBeInTheDocument();
      expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
    });
  });

  it('should navigate to the home page on successful authentication', async () => {
    useSearchParams.mockReturnValue([
      new URLSearchParams(`code=code&state=${JSON.stringify({ subdomain: 'fora' })}`)
    ]);
    render(<OktaCallbackWebPage />);

    await waitFor(() => {
      expect(getOktaToken).toHaveBeenCalledWith(
        'fora',
        'code',
        'code-verifier',
        'http://localhost:3000/callback/login/okta'
      );
      expect(mockAuthenticateWithOkta).toHaveBeenCalledWith('token1', 'id-token-1', 'test-123456');
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('should display an error toast and navigate to /login/okta on authentication failure', async () => {
    // navigates to callback page w/o state param
    useSearchParams.mockReturnValue([new URLSearchParams('code=code')]);

    render(<OktaCallbackWebPage />);
    await waitFor(() => {
      expect(getOktaToken).not.toHaveBeenCalled();
      expect(mockAuthenticateWithOkta).not.toHaveBeenCalledWith();
      expect(mockOpenErrorToast).toHaveBeenCalledWith(
        'Failed to connect to Okta. Please try again.'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login/okta');
    });
  });
});
