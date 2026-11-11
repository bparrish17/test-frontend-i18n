import { Center, Spinner, VStack, Text, Box } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { usePatchTenantAsAppUser } from '@services/query-services/tenants.query-service';
import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import { useTranslation } from 'react-i18next';

export default function TeamsCallbackPage() {
  const { t } = useTranslation();

  const {
    mutate: patchTenantAsAppUser,
    isLoading,
    isError
  } = usePatchTenantAsAppUser({ retry: 1 });
  const [searchParams] = useSearchParams();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const toast = useStyledToast();

  useEffect(() => {
    if (user) {
      if (user?.isGuest) {
        navigate('/');
        return;
      }
      const adminConsented = searchParams.get('admin_consent') === 'True';
      const microsoftTenantId = searchParams.get('tenant');
      const tenantId = user.tenants[0]?.id;
      if (adminConsented && tenantId) {
        patchTenantAsAppUser(
          {
            id: tenantId,
            teams_config: { access_token: microsoftTenantId, alert_channel: 'fora-alerts' }
          },
          {
            onSuccess: () => {
              toast({
                title: t('teamsCallbackPage.microsoftTeamsConnectedSuccessfully'),
                status: 'success'
              });
              navigate('/');
            }
          }
        );
      }
    }
  }, [user]);

  return (
    <Box data-cy='teams-callback-page'>
      <Center pt={10}>
        {isLoading && (
          <VStack gap={6}>
            <Text fontSize='lg'>{t('teamsCallbackPage.connectingToTeams')}</Text>
            <Spinner size='xl' />
          </VStack>
        )}
        {isError && <Text fontSize='lg'>{t('teamsCallbackPage.failedToConnectFora')}</Text>}
      </Center>
    </Box>
  );
}
