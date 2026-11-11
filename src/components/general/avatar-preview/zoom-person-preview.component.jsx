import { Avatar, Flex, Stack, Switch, Text, Spinner } from '@chakra-ui/react';

import { useUserStore } from '@store/app.store';
import {
  useZoomUserSettings,
  usePatchZoomUserSettings
} from '@services/query-services/lambda.query-service';
import { useInvalidateQueries, useStyledToast } from '@util/hooks';

export default function ZoomPersonPreview({ user }) {
  const toast = useStyledToast();
  const tenant = useUserStore((state) => state?.tenant);
  const invalidateQueries = useInvalidateQueries();
  const { data: zoomUserSettings, isLoading } = useZoomUserSettings(
    tenant?.recall_config?.zoom_oauth_credential_id,
    user?.id
  );
  const { mutateAsync: patchUserSettings } = usePatchZoomUserSettings();

  const handleSwitchChange = async (event) => {
    await patchUserSettings(
      {
        zoom_oauth_credential_id: tenant?.recall_config?.zoom_oauth_credential_id,
        user_id: user?.id,
        payload: {
          recording: {
            local_recording: event.target.checked
          }
        }
      },
      {
        onSuccess: () => {
          toast({
            title: 'User updated successfully',
            status: 'success',
            duration: 9000,
            isClosable: true
          });
          invalidateQueries({
            model: 'lambda',
            queryKey: [
              'GET',
              'zoom/user-settings',
              undefined,
              {
                zoom_oauth_credential_id: tenant?.recall_config?.zoom_oauth_credential_id,
                user_id: user?.id
              }
            ]
          });
        }
      }
    );
  };

  return (
    <Flex
      gap={2.5}
      size='sm'
      p={3}
      border='reskin'
      borderRadius='xl'
    >
      <Avatar
        src={user?.pic_url}
        size='sm'
      />
      <Stack
        gap='6px'
        align='flex-start'
      >
        <Text
          color='brandPrimary.primary'
          fontWeight={600}
          letterSpacing='tight'
          fontSize='sm'
          lineHeight='16px'
          textOverflow='ellipsis'
        >
          {user?.display_name}
        </Text>
        <Flex
          color='surface.onSurfaceVariant'
          fontSize='xs'
          lineHeight='14px'
          fontWeight={500}
          w='full'
        >
          <Text as='span'>{user?.email}</Text>
        </Flex>
      </Stack>
      <Flex
        w='100%'
        align='flex-start'
        justifyContent='flex-end'
        alignSelf='flex-end'
      >
        {isLoading ? (
          <Spinner size='sm' />
        ) : (
          <>
            <Switch
              isChecked={zoomUserSettings?.recording?.local_recording}
              onChange={handleSwitchChange}
              p={2}
            />
            <Stack align='flex-start'>
              <Text
                fontSize='sm'
                variant='page-header'
              >
                Local Recording
              </Text>
              <Text
                fontWeight={500}
                color='surface.onSurfaceVariant'
                fontSize='xs'
              >
                FORA requires local recording be enabled
              </Text>
            </Stack>
          </>
        )}
      </Flex>
    </Flex>
  );
}
