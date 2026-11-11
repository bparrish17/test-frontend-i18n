import { Button, Hide, IconButton, Show } from '@chakra-ui/react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import ClockArrow2CirclesIcon from '@assets/icons/sf-icons/clock-arrow-2-circles.icon';
import { useSyncNylasAccount } from '@services/query-services/nylas.query-service';
import { usePusherChannel, usePusherEvent, useStyledToast } from '@util/hooks';
import { useTranslation } from 'react-i18next';

const CalendarSyncButton = () => {
  const { t } = useTranslation();

  const toast = useStyledToast();
  const queryClient = useQueryClient();

  const [isSyncing, setIsSyncing] = useState(false);
  const [infoToastId, setInfoToastId] = useState(null);
  const [nylasAccountId, setNylasAccountId] = useState(null);
  const { mutateAsync: syncNylasAccount } = useSyncNylasAccount({
    onSuccess: () => {
      setIsSyncing(true);
      const toastId = toast({
        title: t('calendarSyncButton.syncingCalendar'),
        status: 'info',
        duration: 9000,
        isClosable: true
      });
      setInfoToastId(toastId);
    }
  });
  const { channel } = usePusherChannel(nylasAccountId);
  usePusherEvent(channel, 'on_completion', () => {
    toast.close(infoToastId);
    setIsSyncing(false);
    toast({
      title: t('calendarSyncButton.calendarSyncComplete'),
      status: 'success',
      duration: 9000,
      isClosable: true
    });

    queryClient.invalidateQueries({ queryKey: ['meetings', 'agenda'] });
    queryClient.invalidateQueries({ queryKey: ['nylas/accounts'] });
  });

  const onClick = async () => {
    const nylasAccount = await syncNylasAccount();
    setNylasAccountId(nylasAccount.id);
  };

  return (
    <>
      <Show above='lg'>
        <Button
          size='xs'
          variant='reskinSecondary'
          onClick={onClick}
          isLoading={isSyncing}
        >
          {t('calendarSyncButton.reSync')}
        </Button>
      </Show>
      <Hide above='lg'>
        <IconButton
          isRound
          variant='reskinGhost'
          colorScheme='surface'
          size='sm'
          icon={
            <ClockArrow2CirclesIcon
              color='surface.onSurfaceVariant'
              boxSize={6}
            />
          }
          onClick={onClick}
          isLoading={isSyncing}
        />
      </Hide>
    </>
  );
};

export default CalendarSyncButton;
