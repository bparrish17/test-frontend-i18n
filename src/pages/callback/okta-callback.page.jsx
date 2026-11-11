import { Center, Spinner, VStack, Text, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '@store/app.store';

import { initializeOktaAuth, extractOktaSubdomain } from '@util/helpers';
import { OKTA_CONFIG } from '@util/constants';
import { useLoginShared } from '@util/hooks';

export default function OktaCallbackPage() {
  // const [searchParams] = useSearchParams();
  const [isAuthenticatingWithOkta, setIsAuthenticatingWithOkta] = useState(true);
  const authenticateWithOkta = useUserStore((state) => state.authenticateWithOkta);
  const navigate = useNavigate();
  const { openErrorToast } = useLoginShared();

  // this can still be the default to handle the redirect
  const oktaConfig = {
    clientId: OKTA_CONFIG.clientId,
    issuer: OKTA_CONFIG.issuer
  };
  const oktaAuth = initializeOktaAuth(oktaConfig);

  useEffect(() => {
    const handleAuth = async () => {
      // Handle tokens from the redirect
      await oktaAuth.handleRedirect();
      const accessToken = await oktaAuth.tokenManager.get('accessToken');
      const idToken = await oktaAuth.tokenManager.get('idToken');

      if (accessToken && idToken) {
        const { subdomain, realm } = extractOktaSubdomain(accessToken?.userinfoUrl);
        await authenticateWithOkta(accessToken?.accessToken, idToken?.idToken, subdomain, realm);
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
            <Text fontSize='lg'>Connecting to Okta...</Text>
            <Spinner size='xl' />
          </VStack>
        )}
      </Center>
    </Box>
  );
}
