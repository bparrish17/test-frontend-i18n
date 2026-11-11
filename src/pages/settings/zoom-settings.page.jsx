import { Stack, Switch, Flex, Spinner, Text, Divider } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useUserStore } from '@store/app.store';
import { useSetDocumentTitle, useStyledToast, useInvalidateQueries } from '@util/hooks';

import SettingsLayout from '@layouts/settings.layout';
import ZoomPersonPreview from '@components/general/avatar-preview/zoom-person-preview.component';

import {
  useZoomUsers,
  useZoomAccountSettings,
  usePatchZoomAccountSettings
} from '@services/query-services/lambda.query-service';
import { useTranslation } from 'react-i18next';

export default function ZoomSettingsPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Zoom Admin - FORA');
  const tenant = useUserStore((state) => state?.tenant);
  const navigate = useNavigate();
  const toast = useStyledToast();
  const invalidateQueries = useInvalidateQueries();
  const { data: accountSettings, isLoading: isLoadingSettings } = useZoomAccountSettings(
    tenant?.recall_config?.zoom_oauth_credential_id
  );
  const { data: zoomUsers, isLoading } = useZoomUsers(
    tenant?.recall_config?.zoom_oauth_credential_id
  );

  const { mutateAsync: patchAccountSettings } = usePatchZoomAccountSettings();
  useEffect(() => {
    if (tenant && !tenant?.recall_config?.zoom_oauth_credential_id) {
      navigate('/settings/sources');
      toast({
        title: t('zoomSettingsPage.zoomAccountNotConnected'),
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    }
  }, [tenant]);

  const handleSwitchChange = async (event) => {
    await patchAccountSettings(
      {
        zoom_oauth_credential_id: tenant?.recall_config?.zoom_oauth_credential_id,
        payload: {
          recording: {
            local_recording: event.target.checked
          }
        }
      },
      {
        onSuccess: () => {
          toast({
            title: t('zoomSettingsPage.accountUpdatedSuccessfully'),
            status: 'success',
            duration: 9000,
            isClosable: true
          });
          invalidateQueries({
            model: 'lambda',
            queryKey: [
              'GET',
              'zoom/account-settings',
              undefined,
              {
                zoom_oauth_credential_id: tenant?.recall_config?.zoom_oauth_credential_id
              }
            ]
          });
        }
      }
    );
  };

  return (
    <SettingsLayout
      w='3xl'
      mx='auto'
    >
      <Stack gap={6}>
        <Flex
          gap={2.5}
          size='sm'
          p={3}
          border='reskin'
          align='flex-start'
          borderRadius='xl'
        >
          <Text
            color='brandPrimary.primary'
            fontWeight={600}
            letterSpacing='tight'
            fontSize='sm'
            lineHeight='16px'
            w='50%'
          >
            {t('zoomSettingsPage.accountSettings')}
          </Text>
          {isLoadingSettings ? (
            <Spinner size='lg' />
          ) : (
            <Flex
              w='100%'
              align='flex-start'
              justifyContent='flex-end'
              alignSelf='flex-end'
            >
              <Switch
                isChecked={accountSettings?.recording?.local_recording}
                onChange={handleSwitchChange}
                p={2}
              />
              <Stack align='flex-start'>
                <Text
                  fontSize='sm'
                  variant='page-header'
                >
                  {t('zoomSettingsPage.localRecording')}
                </Text>
                <Text
                  fontWeight={500}
                  color='surface.onSurfaceVariant'
                  fontSize='xs'
                >
                  {t('zoomSettingsPage.foraRequiresLocalRecording')}
                </Text>
              </Stack>
            </Flex>
          )}
        </Flex>
        <Divider color='surface.outline' />
        {isLoading ? (
          <Spinner size='lg' />
        ) : (
          zoomUsers?.map((user) => (
            <ZoomPersonPreview
              key={user?.email}
              user={user}
            />
          ))
        )}
      </Stack>
    </SettingsLayout>
  );
}
