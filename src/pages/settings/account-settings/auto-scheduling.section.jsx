import { HStack, Switch, Text } from '@chakra-ui/react';
import { get } from 'lodash-es';
import { useSetMeetingConfig } from '@services/query-services/people.query-service';
import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import { SFInfoIcon } from '@assets/icons';
import ControlledTooltip from '@components/general/controlled-tooltip.component';

const getAutoScheduleConfig = (property) => (state) =>
  get(state, [property, 'meeting_config', 'auto_schedule'], null);

export default function AutoSchedulingSection() {
  const user = useUserStore((state) => state?.user);
  const setUser = useUserStore((state) => state.setUser);
  const userAutoSchedule = useUserStore(getAutoScheduleConfig('user'));
  const tenantAutoSchedule = useUserStore(getAutoScheduleConfig('tenant'));
  const toast = useStyledToast();
  const { mutateAsync: setMeetingConfig, isLoading: isSetting } = useSetMeetingConfig();
  const autoSchedule = userAutoSchedule === null ? tenantAutoSchedule : userAutoSchedule;

  const handleAutoScheduleChange = async (value) => {
    await setMeetingConfig(
      {
        id: user?.id,
        body: { auto_schedule: value }
      },
      {
        onSuccess: () => {
          setUser({ ...user, meeting_config: { ...user?.meeting_config, auto_schedule: value } });
          toast({
            title: 'Auto Scheduling Updated Successfully',
            status: 'success',
            isClosable: true
          });
        },
        onError: () =>
          toast({
            title: 'Something went wrong while updating auto scheduling, please try again.',
            status: 'error',
            duration: 3000,
            isClosable: true
          })
      }
    );
  };

  return (
    <HStack gap={3}>
      <Switch
        id='auto-scheduling'
        isChecked={autoSchedule}
        onChange={(e) => handleAutoScheduleChange(e?.target?.checked)}
        isDisabled={isSetting}
      />
      <Text
        as='label'
        htmlFor='auto-scheduling'
        variant='body-500-md'
        color='surface.onSurfaceVariant'
        cursor='pointer'
      >
        Automatically schedule FORA to join all future videoconference calls
      </Text>
      <ControlledTooltip
        label={`Turning this ON will auto-schedule FORA to join all of your meetings scheduled going
        forward. Existing meetings on your calendar will not be automatically scheduled.`}
      >
        {(tooltipProps) => (
          <span>
            <SFInfoIcon {...tooltipProps} />
          </span>
        )}
      </ControlledTooltip>
    </HStack>
  );
}
