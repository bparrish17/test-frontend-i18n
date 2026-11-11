import { Button, HStack } from '@chakra-ui/react';
import { useQueryClient } from '@tanstack/react-query';
import { useMeetingBotStatuses } from '@util/hooks';

export default function ReplayActions({ meeting, bot, statusChangeUpdaterFn }) {
  const meetingId = meeting?.id;
  const queryClient = useQueryClient();
  const { isOnPause, botWasKicked } = useMeetingBotStatuses(bot);

  const handleReplayPauseResume = () => {
    queryClient.setQueryData(['meetings', { id: meetingId }], (previous) =>
      statusChangeUpdaterFn(previous, {
        code: isOnPause ? 'in_call_recording' : 'in_call_not_recording'
      })
    );
  };

  const handleKickBot = () => {
    queryClient.setQueryData(['meetings', { id: meetingId }], (previous) => {
      console.log('previous', previous);
      if (botWasKicked) {
        console.log(
          'unkicking',
          previous?.bot?.status_changes?.filter((sc) => sc.code !== 'bot_received_leave_call')
        );
        return {
          ...previous,
          bot: {
            ...previous.bot,
            status_changes: previous?.bot?.status_changes?.filter(
              (sc) => sc.code !== 'bot_received_leave_call'
            ),
            num_of_status_changes: previous?.bot?.num_of_status_changes - 1
          }
        };
      } else {
        return statusChangeUpdaterFn(previous, { code: 'bot_received_leave_call' });
      }
    });
  };

  return (
    <HStack>
      <Button
        size='reskinMd'
        variant='reskinWhite'
        onClick={handleReplayPauseResume}
        mt={6}
      >
        {isOnPause ? 'Resume' : 'Pause'}
      </Button>
      <Button
        size='reskinMd'
        variant='reskinWhite'
        onClick={handleKickBot}
        mt={6}
      >
        {botWasKicked ? 'Unkick Bot' : 'Kick Bot'}
      </Button>
    </HStack>
  );
}
