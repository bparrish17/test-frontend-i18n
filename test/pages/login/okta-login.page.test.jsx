import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';

import OktaLoginPage from '@pages/login/okta-login.page';
import { useLoginShared } from '@util/hooks';
import { initializeOktaAuth } from '@util/helpers';

vi.mock('@util/hooks', () => ({
  useLoginShared: vi.fn()
}));

vi.mock('@util/helpers', () => ({
  initializeOktaAuth: vi.fn()
}));

vi.mock('@assets/images', () => ({
  BlackOktaAura: 'BlackOktaAura.png',
  BlackOktaWordmark: 'BlackOktaWordmark.png'
}));

describe('OktaLoginPage', () => {
  const mockOpenCredsErrorToast = vi.fn();
  const mockOpenErrorToast = vi.fn();
  const mockSignInWithRedirect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useLoginShared.mockReturnValue({
      openCredsErrorToast: mockOpenCredsErrorToast,
      openErrorToast: mockOpenErrorToast
    });

    initializeOktaAuth.mockReturnValue({
      signInWithRedirect: mockSignInWithRedirect
    });
  });

  it('renders the form with input and button', () => {
    render(<OktaLoginPage />);

    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Okta Logo/i })).toBeInTheDocument();
  });

  it('shows validation error when email is empty', async () => {
    render(<OktaLoginPage />);

    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email format', async () => {
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'invalid-email' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
    });
  });

  it('displays an error toast for unsupported email domain', async () => {
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@unsupported.com' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(mockOpenErrorToast).toHaveBeenCalledWith('Invalid email format');
    });
  });

  it('initializes OktaAuth and redirects for apollo domain', async () => {
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@apollo.com' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(initializeOktaAuth).toHaveBeenCalledWith({
        clientId: import.meta.env.VITE_OKTA_APOLLO_CLIENT_ID,
        issuer: import.meta.env.VITE_OKTA_APOLLO_ISSUER
      });
      expect(mockSignInWithRedirect).toHaveBeenCalledWith({});
    });
  });

  it('initializes OktaAuth and redirects for apollo-advisors domain', async () => {
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@apollo-advisors.com' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(initializeOktaAuth).toHaveBeenCalledWith({
        clientId: import.meta.env.VITE_OKTA_APOLLO_CLIENT_ID,
        issuer: import.meta.env.VITE_OKTA_APOLLO_ISSUER
      });
      expect(mockSignInWithRedirect).toHaveBeenCalledWith({});
    });
  });

  it('initializes OktaAuth and redirects for fora domain', async () => {
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@fora.com' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(initializeOktaAuth).toHaveBeenCalledWith({
        clientId: import.meta.env.VITE_OKTA_FORA_CLIENT_ID,
        issuer: import.meta.env.VITE_OKTA_FORA_ISSUER,
        redirectUri: 'http://localhost:3000/callback/login/okta'
      });
      expect(mockSignInWithRedirect).toHaveBeenCalledWith({
        state: JSON.stringify({ subdomain: 'fora' })
      });
    });
  });

  it('initializes OktaAuth and redirects for skullcandy domain', async () => {
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@skullcandy.com' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(initializeOktaAuth).toHaveBeenCalledWith({
        clientId: import.meta.env.VITE_OKTA_SKULLCANDY_CLIENT_ID,
        issuer: import.meta.env.VITE_OKTA_SKULLCANDY_ISSUER,
        redirectUri: 'http://localhost:3000/callback/login/okta'
      });
      expect(mockSignInWithRedirect).toHaveBeenCalledWith({
        state: JSON.stringify({ subdomain: 'skullcandy' })
      });
    });
  });

  it('initializes OktaAuth and redirects for parachute domain', async () => {
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@parachutehealth.com' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(initializeOktaAuth).toHaveBeenCalledWith({
        clientId: import.meta.env.VITE_OKTA_PARACHUTE_CLIENT_ID,
        issuer: import.meta.env.VITE_OKTA_PARACHUTE_ISSUER,
        redirectUri: 'http://localhost:3000/callback/login/okta'
      });
      expect(mockSignInWithRedirect).toHaveBeenCalledWith({
        state: JSON.stringify({ subdomain: 'parachutehealth' })
      });
    });
  });

  it('initializes OktaAuth and redirects for okta domain', async () => {
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@okta.com' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(initializeOktaAuth).toHaveBeenCalledWith({
        clientId: import.meta.env.VITE_OKTA_OKTA_CLIENT_ID,
        issuer: import.meta.env.VITE_OKTA_OKTA_ISSUER,
        redirectUri: 'http://localhost:3000/callback/login/okta'
      });
      expect(mockSignInWithRedirect).toHaveBeenCalledWith({
        state: JSON.stringify({ subdomain: 'okta' })
      });
    });
  });

  it('opens error toast if unsupported domain', async () => {
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@unfora.com' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(mockOpenErrorToast).toHaveBeenCalledWith('Invalid email format');
    });
  });

  it('handles errors during Okta sign-in', async () => {
    mockSignInWithRedirect.mockRejectedValueOnce(new Error('Sign-in failed'));
    render(<OktaLoginPage />);

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'user@apollo.com' }
    });
    fireEvent.submit(screen.getByRole('button', { name: /Okta Logo/i }));

    await waitFor(() => {
      expect(mockOpenErrorToast).toHaveBeenCalledWith(
        'Failed to connect to Okta. Please try again.'
      );
    });
  });
});
