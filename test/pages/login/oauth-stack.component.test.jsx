import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useMsal } from '@azure/msal-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

import OAuthStack from '@pages/login/oauth-stack.component';
import { useUserStore, useUserMSALStore } from '@store/app.store';
import { useBreakpoints } from '@util/hooks';

// Mock external dependencies
vi.mock('@azure/msal-react', () => ({
  useMsal: vi.fn()
}));
vi.mock('@react-oauth/google', () => ({
  useGoogleLogin: vi.fn()
}));
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn(),
  useUserMSALStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn()
}));

describe('OAuthStack', () => {
  const mockAuthenticateWithGoogle = vi.fn();
  const mockAuthenticateWithMicrosoft = vi.fn();
  const mockOpenErrorToast = vi.fn();
  const mockOpenCredsErrorToast = vi.fn();
  const mockNavigate = vi.fn();
  const mockSetMsftTokens = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore
      .mockReturnValueOnce(mockAuthenticateWithGoogle)
      .mockReturnValueOnce(mockAuthenticateWithMicrosoft);

    useUserMSALStore.mockReturnValueOnce(mockSetMsftTokens);

    useNavigate.mockReturnValue(mockNavigate);
    useMsal.mockReturnValue({
      instance: {
        loginRedirect: vi.fn(),
        loginPopup: vi.fn()
      }
    });
    useGoogleLogin.mockImplementation(({ onSuccess }) => () => {
      onSuccess({ access_token: 'mockAccessToken' });
    });
    useBreakpoints.mockReturnValue({ isMobile: false });
  });

  it('renders the OAuth buttons', () => {
    render(
      <OAuthStack
        redirectUrl='/dashboard'
        openErrorToast={mockOpenErrorToast}
        openCredsErrorToast={mockOpenCredsErrorToast}
        isSubmitting={false}
        isGuest={false}
      />
    );

    expect(screen.getByText('Sign in with Google')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Microsoft')).toBeInTheDocument();
    expect(screen.getByText('Sign in with Okta')).toBeInTheDocument();
  });

  it('handles Google sign-in', async () => {
    render(
      <OAuthStack
        redirectUrl='/dashboard'
        openErrorToast={mockOpenErrorToast}
        openCredsErrorToast={mockOpenCredsErrorToast}
        isSubmitting={false}
        isGuest={false}
      />
    );

    const googleButton = screen.getByText('Sign in with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockAuthenticateWithGoogle).toHaveBeenCalledWith('mockAccessToken');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles Google sign-in error', async () => {
    useGoogleLogin.mockImplementation(({ onError }) => () => {
      onError();
    });

    render(
      <OAuthStack
        redirectUrl='/dashboard'
        openErrorToast={mockOpenErrorToast}
        openCredsErrorToast={mockOpenCredsErrorToast}
        isSubmitting={false}
        isGuest={false}
      />
    );

    const googleButton = screen.getByText('Sign in with Google');
    fireEvent.click(googleButton);

    await waitFor(() => {
      expect(mockOpenErrorToast).toHaveBeenCalledWith(
        'Failed to connect to Google. Please try again.'
      );
    });
  });

  it('handles Microsoft sign-in via popup', async () => {
    const mockLoginPopup = vi
      .fn()
      .mockResolvedValue({ accessToken: 'mockAccessToken', idToken: 'mockIdToken' });
    useMsal.mockReturnValue({
      instance: { loginPopup: mockLoginPopup, loginRedirect: vi.fn() }
    });

    render(
      <OAuthStack
        redirectUrl='/dashboard'
        openErrorToast={mockOpenErrorToast}
        openCredsErrorToast={mockOpenCredsErrorToast}
        isSubmitting={false}
        isGuest={false}
      />
    );

    const microsoftButton = screen.getByText('Sign in with Microsoft');
    fireEvent.click(microsoftButton);

    await waitFor(() => {
      expect(mockLoginPopup).toHaveBeenCalled();
      expect(mockAuthenticateWithMicrosoft).toHaveBeenCalledWith('mockAccessToken', 'mockIdToken');
      expect(mockSetMsftTokens).toHaveBeenCalledWith({
        accessToken: 'mockAccessToken',
        idToken: 'mockIdToken'
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('handles Okta sign-in', async () => {
    render(
      <OAuthStack
        redirectUrl='/dashboard'
        openErrorToast={mockOpenErrorToast}
        openCredsErrorToast={mockOpenCredsErrorToast}
        isSubmitting={false}
        isGuest={false}
      />
    );

    const oktaButton = screen.getByText('Sign in with Okta');
    fireEvent.click(oktaButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/login/okta');
    });
  });
});
