import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getOktaConfig } from '@services/query-services/lambda.query-service';
import { initializeOktaAuth } from '@util/helpers';
import { useLoginShared } from '@util/hooks';

import OktaLoginIdpPage from '@pages/login/okta-login-idp.page';

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useSearchParams: vi.fn()
}));

vi.mock('@util/helpers', () => ({
  initializeOktaAuth: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useLoginShared: vi.fn()
}));

vi.mock('@services/query-services/lambda.query-service', () => ({
  getOktaConfig: vi.fn()
}));

describe('OktaLoginIdpPage', () => {
  const mockNavigate = vi.fn();
  const mockOpenErrorToast = vi.fn();
  const mockSignInWithRedirect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useNavigate.mockReturnValue(mockNavigate);
    useLoginShared.mockReturnValue({
      openErrorToast: mockOpenErrorToast
    });

    initializeOktaAuth.mockReturnValue({
      signInWithRedirect: mockSignInWithRedirect
    });

    getOktaConfig.mockResolvedValue({
      domain: 'https://fora.okta.com',
      clientId: 'client-id'
    });
  });

  it('should render the loading spinner initially', async () => {
    useSearchParams.mockReturnValue([new URLSearchParams('')]);
    render(<OktaLoginIdpPage />);

    await waitFor(() => {
      expect(screen.getByText('Connecting to Okta...')).toBeInTheDocument();
      expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
    });
  });

  it('should trigger signInWithRedirect when successful', async () => {
    useSearchParams.mockReturnValue([new URLSearchParams(`iss=https://fora.okta.com`)]);
    render(<OktaLoginIdpPage />);

    await waitFor(() => {
      expect(getOktaConfig).toHaveBeenCalledWith('fora');
      expect(initializeOktaAuth).toHaveBeenCalledWith({
        clientId: 'client-id',
        issuer: 'https://fora.okta.com',
        redirectUri: 'http://localhost:3000/callback/login/okta'
      });
      expect(mockSignInWithRedirect).toHaveBeenCalledWith({
        state: JSON.stringify({ subdomain: 'fora' })
      });
    });
  });

  it('should display an error toast and navigate to /login/okta on authentication failure', async () => {
    // navigates to login page when error
    getOktaConfig.mockRejectedValueOnce(new Error());

    render(<OktaLoginIdpPage />);
    await waitFor(() => {
      expect(getOktaConfig).toHaveBeenCalledWith('fora');
      expect(initializeOktaAuth).not.toHaveBeenCalled();
      expect(mockSignInWithRedirect).not.toHaveBeenCalled();
      expect(mockOpenErrorToast).toHaveBeenCalledWith(
        'Failed to connect to Okta. Please try again.'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login/okta');
    });
  });
});
