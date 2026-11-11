import { GoogleIcon, MicrosoftIcon } from '@assets/icons';
import { BlackOktaAura } from '@assets/images';
import { useMsal } from '@azure/msal-react';
import { Button, Image, VStack } from '@chakra-ui/react';
import { useGoogleLogin } from '@react-oauth/google';

import { useBreakpoints } from '@util/hooks';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MICROSOFT_AUTH_LOGIN_REQUEST } from '@util/constants';
import { useUserMSALStore, useUserStore } from '@store/app.store';
import { useRollbar } from '@rollbar/react';
import { formatRollbarTitle } from '@util/helpers/error-boundary.helpers';
import { useTranslation } from 'react-i18next';

/**
 * Renders a stack of OAuth provider buttons (Google, Microsoft, Okta).
 *
 * @param {object} props - Component props.
 * @param {string} props.redirectUrl - URL to navigate to after successful authentication.
 * @param {Function} props.openErrorToast - Function to display a generic error toast.
 * @param {Function} props.openCredsErrorToast - Function to display a credentials-specific error toast.
 * @param {boolean} props.isSubmitting - Indicates if a parent form is submitting (disables buttons).
 * @param {boolean} props.isGuest - Indicates if the flow is for a guest user.
 * @returns {JSX.Element} A VStack containing OAuth buttons.
 */
export default function OAuthStack({
  redirectUrl,
  openErrorToast,
  openCredsErrorToast,
  isSubmitting,
  isGuest
}) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const authenticateWithGoogle = useUserStore((state) => state.authenticateWithGoogle);
  const authenticateWithMicrosoft = useUserStore((state) => state.authenticateWithMicrosoft);
  const setTokens = useUserMSALStore((state) => state.setTokens);
  const [isAuthenticatingWithGoogle, setIsAuthenticatingWithGoogle] = useState(false);
  const [isAuthenticatingWithMicrosoft, setIsAuthenticatingWithMicrosoft] = useState(false);
  const [isAuthenticatingWithOkta, setIsAuthenticatingWithOkta] = useState(false);
  const { instance: msalInstance } = useMsal();
  const { isMobile } = useBreakpoints();
  const rollbar = useRollbar();

  /**
   * Initiates the Google Sign-In flow.
   * Sets loading state and calls the Google login hook.
   */
  const handleGoogleSignIn = () => {
    setIsAuthenticatingWithGoogle(true);
    loginWithGoogle();
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: (res) => {
      (async () => {
        try {
          await authenticateWithGoogle(res?.access_token);
          navigate(redirectUrl);
        } catch (e) {
          if (e?.status !== 422) {
            rollbar?.error(formatRollbarTitle('Manual', 'Login Error: Non-credentials'), e);
          }

          setIsAuthenticatingWithGoogle(false);
          openCredsErrorToast(e);
        }
      })();
    },
    onError: () => {
      setIsAuthenticatingWithGoogle(false);
      openErrorToast('Failed to connect to Google. Please try again.');
    },
    onNonOAuthError: (e) => {
      setIsAuthenticatingWithGoogle(false);
      switch (e.type) {
        case 'popup_closed':
          openErrorToast(
            'Authentication was cancelled. Popup window was closed before the process was completed.'
          );
          break;
        case 'popup_failed_to_open':
          openErrorToast('Authentication was cancelled. Popup window failed to open.');
          break;
        case 'unknown':
          openErrorToast('Authentication was cancelled. An unknown error occurred.');
          break;
        default:
          openErrorToast('Failed to connect to Google. Please try again.');
          break;
      }
    }
  });

  /**
   * Initiates the Microsoft Sign-In flow.
   * Handles both redirect (mobile) and popup flows.
   * Authenticates with the backend on success.
   */
  const handleMicrosoftSignIn = async () => {
    setIsAuthenticatingWithMicrosoft(true);
    if (isMobile) {
      await msalInstance
        .loginRedirect(MICROSOFT_AUTH_LOGIN_REQUEST)
        .catch(() => openErrorToast('Failed to connect to Microsoft. Please try again.'));
    } else {
      const { accessToken, idToken } = await msalInstance
        .loginPopup(MICROSOFT_AUTH_LOGIN_REQUEST)
        .catch(() => openErrorToast('Failed to connect to Microsoft. Please try again.'));
      if (accessToken) {
        setTokens({ accessToken, idToken });
        try {
          await authenticateWithMicrosoft(accessToken, idToken);
          navigate(redirectUrl);
        } catch (e) {
          if (e?.status !== 422) {
            rollbar?.error(formatRollbarTitle('Manual', 'Login Error: Non-credentials'), e);
          }

          openCredsErrorToast(e);
        }
      }
    }
    setIsAuthenticatingWithMicrosoft(false);
  };

  /**
   * Initiates the Okta Sign-In flow by navigating to the Okta login page.
   */
  const handleOktaSignIn = async () => {
    setIsAuthenticatingWithOkta(true);
    navigate('/login/okta');
    setIsAuthenticatingWithOkta(false);
  };

  /**
   * Generates the button text based on provider and guest status.
   *
   * @param {string} provider - Name of the OAuth provider (e.g., 'Google').
   * @returns {string} The text to display on the button.
   */
  const actionText = (provider) => (isGuest ? 'Continue' : 'Sign in') + ` with ${provider}`;

  return (
    <VStack
      gap={4}
      w='full'
    >
      <OAuthButton
        leftIcon={<GoogleIcon />}
        onClick={handleGoogleSignIn}
        isDisabled={isAuthenticatingWithGoogle || isSubmitting}
      >
        {isAuthenticatingWithGoogle ? 'Connecting...' : actionText('Google')}
      </OAuthButton>
      <OAuthButton
        leftIcon={<MicrosoftIcon />}
        onClick={handleMicrosoftSignIn}
        isDisabled={isAuthenticatingWithMicrosoft || isSubmitting}
      >
        {isAuthenticatingWithMicrosoft ? 'Connecting...' : actionText('Microsoft')}
      </OAuthButton>
      <OAuthButton
        leftIcon={
          <Image
            src={BlackOktaAura}
            alt={t('oauthStack.oktaLogoAlt')}
            h={8}
          />
        }
        onClick={handleOktaSignIn}
        isDisabled={isAuthenticatingWithOkta || isSubmitting}
      >
        {isAuthenticatingWithOkta ? 'Connecting...' : actionText('Okta')}
      </OAuthButton>
    </VStack>
  );
}

/**
 * Reusable button component styled for OAuth providers.
 *
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Button content.
 * @param {React.ReactElement} props.leftIcon - Icon to display on the left.
 * @param {Function} props.onClick - Click handler.
 * @param {boolean} props.isDisabled - Whether the button is disabled.
 * @returns {JSX.Element} A Chakra Button styled for OAuth.
 */
const OAuthButton = ({ children, leftIcon, onClick, isDisabled }) => (
  <Button
    variant='reskinGhost'
    py={6}
    w='full'
    isDisabled={isDisabled}
    leftIcon={leftIcon}
    onClick={onClick}
    color='surface.onSurfaceVariant'
    bgColor='surface.surface'
    _hover={{ bg: 'surface.surfaceDim', color: 'surface' }}
    fontWeight={400}
  >
    {children}
  </Button>
);
