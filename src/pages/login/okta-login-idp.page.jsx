import { Center, Spinner, VStack, Text, Box } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import { getOktaConfig } from '@services/query-services/lambda.query-service';

import { initializeOktaAuth } from '@util/helpers';
import { useLoginShared } from '@util/hooks';
import { useTranslation } from 'react-i18next';

export default function OktaLoginIdpPage() {
  const { t } = useTranslation();

  const [searchParams] = useSearchParams();
  const [isAuthenticatingWithOkta, setIsAuthenticatingWithOkta] = useState(true);
  const navigate = useNavigate();
  const { openErrorToast } = useLoginShared();

  useEffect(() => {
    const handleAuth = async () => {
      const iss = searchParams.get('iss');
      if (iss) {
        try {
          const subdomain = new URL(iss).hostname.split('.')[0];
          const tenantConfig = await getOktaConfig(subdomain);

          const oktaConfig = {};
          oktaConfig.clientId = tenantConfig.clientId;
          oktaConfig.issuer = tenantConfig.domain;
          oktaConfig.redirectUri = window.location.origin + '/callback/login/okta';

          const redirectState = { state: JSON.stringify({ subdomain }) };

          const oktaAuth = initializeOktaAuth(oktaConfig);
          await oktaAuth.signInWithRedirect(redirectState);

          setIsAuthenticatingWithOkta(false);
        } catch (err) {
          console.log('err: ', err);

          openErrorToast('Failed to connect to Okta. Please try again.');
          navigate('/login/okta');
        }
      }
    };

    handleAuth();
  }, []);

  return (
    <Box data-cy='okta-callback-page'>
      <Center pt={10}>
        {isAuthenticatingWithOkta && (
          <VStack gap={6}>
            <Text fontSize='lg'>{t('oktaLoginIdpPage.connectingToOkta')}</Text>
            <Spinner size='xl' />
          </VStack>
        )}
      </Center>
    </Box>
  );
}
