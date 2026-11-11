import { Heading, List, ListIcon, ListItem, Text, VStack } from '@chakra-ui/react';
import { FiCheckCircle } from 'react-icons/fi';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import FullPageLoader from '@components/general/loader/full-page-loader.component';

import { useHubspotOauth } from '@services/query-services/lambda.query-service';
import { useTranslation } from 'react-i18next';

function getCodeFromQueryString(s) {
  const params = new URLSearchParams(s);
  return params.get('code');
}

function HubspotCallbackPage() {
  const { t } = useTranslation();

  const userStore = useUserStore();
  const user = userStore.user;

  const { search } = useLocation();
  const code = getCodeFromQueryString(search);
  const navigate = useNavigate();
  const toast = useStyledToast();

  const { mutateAsync: hubspotOauth } = useHubspotOauth();

  async function authorize(code) {
    const tenantId = user.tenants[0].id;
    await hubspotOauth(
      { code, tenant_id: tenantId },
      {
        onSuccess: () =>
          toast({
            title: t('hubspotCallbackPage.hubspotConnectedSuccessfully'),
            status: 'success'
          }),
        onError: () =>
          toast({
            status: 'error',
            title: t('hubspotCallbackPage.somethingWentWrongYou')
          })
      }
    );

    navigate('/agenda');
  }

  useEffect(() => {
    if (code && user) authorize(code);
  }, [code, user]);

  return (
    <FullPageLoader>
      <VStack
        spacing={3}
        maxW='sm'
        textAlign='center'
      >
        <Heading size='md'>{t('hubspotCallbackPage.connectingToHubspot')}</Heading>
        <Text color='gray.500'>{t('hubspotCallbackPage.thisUsuallyTakesA')}</Text>
        <List
          spacing={2}
          textAlign='left'
        >
          <ListItem>
            <ListIcon
              as={FiCheckCircle}
              color='green.500'
            />
            {t('hubspotCallbackPage.syncContactsAndCompanies')}
          </ListItem>
          <ListItem>
            <ListIcon
              as={FiCheckCircle}
              color='green.500'
            />
            {t('hubspotCallbackPage.logMeetingsToDeal')}
          </ListItem>
          <ListItem>
            <ListIcon
              as={FiCheckCircle}
              color='green.500'
            />
            {t('hubspotCallbackPage.keepNotesUpTo')}
          </ListItem>
        </List>
      </VStack>
    </FullPageLoader>
  );
}

export default HubspotCallbackPage;
