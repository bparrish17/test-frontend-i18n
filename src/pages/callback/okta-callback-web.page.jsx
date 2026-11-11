import { Center, Spinner, VStack, Text, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useUserStore } from '@store/app.store';

import { getOktaToken } from '@services/query-services/lambda.query-service';
import { initializeOktaAuth } from '@util/helpers';
import { OKTA_CONFIG } from '@util/constants';
import { useLoginShared } from '@util/hooks';
import { useTranslation } from 'react-i18next';

export default function OktaCallbackWebPage() {
  const { t } = useTranslation();

  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [isAuthenticatingWithOkta, setIsAuthenticatingWithOkta] = useState(true);
  const authenticateWithOkta = useUserStore((state) => state.authenticateWithOkta);
  const navigate = useNavigate();
  const { openErrorToast } = useLoginShared();

  const oktaConfig = {
    clientId: OKTA_CONFIG.clientId,
    issuer: OKTA_CONFIG.issuer
  };
  const oktaAuth = initializeOktaAuth(oktaConfig);

  useEffect(() => {
    const handleAuth = async () => {
      // New web based logic
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const codeVerifier = await oktaAuth.transactionManager.load().codeVerifier;

      if (code && codeVerifier && state) {
        const { subdomain } = JSON.parse(state);
        const redirectUri = `${window.location.origin}${location.pathname}`;
        const tokenResponse = await getOktaToken(subdomain, code, codeVerifier, redirectUri);
        await authenticateWithOkta(
          tokenResponse?.accessToken,
          tokenResponse?.idToken,
          tokenResponse.subdomain
        );
        navigate('/');
      } else {
        openErrorToast('Failed to connect to Okta. Please try again.');
        navigate('/login/okta');
      }

      setIsAuthenticatingWithOkta(false);
    };

    handleAuth();
  }, []);

  return (
    <Box data-cy='okta-callback-page'>
      <Center pt={10}>
        {isAuthenticatingWithOkta && (
          <VStack gap={6}>
            <Text fontSize='lg'>{t('oktaCallbackWebPage.connectingToOkta')}</Text>
            <Spinner size='xl' />
          </VStack>
        )}
      </Center>
    </Box>
  );
}
