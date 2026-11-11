import { Stack, HStack, Text, Switch, Button, Input, Divider, Spinner } from '@chakra-ui/react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { useEffect, useState } from 'react';

import { usePatchPerson } from '@services/query-services/people.query-service';
import { useTimeZones } from '@services/query-services/types.query-service';
import { useUserStore } from '@store/app.store';
import { useMutationToast } from '@util/hooks';
import {
  getBrowserTimezone,
  getIanaTzName,
  hhmmToUTCMinutes,
  utcMinutesToHHMM
} from '@util/helpers';
import { FORA_TIMEZONE_MAP } from '@util/constants';

const digestConfigsToFormValues = (userTimeZone, digestConfigs = {}) => {
  const { morning, evening } = digestConfigs;
  return {
    meetingPrepEnabled: !!morning,
    meetingPrepTime: utcMinutesToHHMM(morning?.time_of_day, userTimeZone),
    summariesEnabled: !!evening,
    summariesTime: utcMinutesToHHMM(evening?.time_of_day, userTimeZone)
  };
};

export default function EmailSubscriptionsSection() {
  const user = useUserStore((state) => state?.user);
  const setUser = useUserStore((state) => state?.setUser);
  const tenant = useUserStore((state) => state.tenant);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: timeZones } = useTimeZones();
  const tzId = user?.time_zone_id ?? tenant?.time_zone_id;
  const ianaTzName = getIanaTzName(tzId);
  const userFriendlyTz = FORA_TIMEZONE_MAP[tzId] ?? tzId;
  const configuredTimezone = timeZones?.length && timeZones?.find((tz) => tz.id === tzId)?.name;
  const userTimeZone = configuredTimezone ?? getBrowserTimezone();
  const defaultValues = digestConfigsToFormValues(ianaTzName, user?.digest_configs);
  const { handleSubmit, ...formMethods } = useForm({ defaultValues });

  useEffect(() => {
    formMethods.reset(defaultValues);
  }, [userTimeZone]);

  const { mutateAsync: patchPerson } = usePatchPerson();
  const { onSuccess, onError } = useMutationToast({
    success: {
      title: 'Successfully Updated Email Subscriptions',
      callback: setUser
    },
    error: { title: 'Something went wrong while updating email subscriptions. Please try again. ' }
  });

  const onSubmit = async (formVal) => {
    setIsSubmitting(true);
    const { meetingPrepEnabled, meetingPrepTime, summariesEnabled, summariesTime } = formVal;
    const toConfig = (enabled, time) =>
      enabled ? { time_of_day: hhmmToUTCMinutes(time, ianaTzName) } : null;
    const morning = toConfig(meetingPrepEnabled, meetingPrepTime);
    const evening = toConfig(summariesEnabled, summariesTime);
    await patchPerson(
      {
        id: user?.id,
        // if both are null, need to submit entire config as null
        digest_configs: morning || evening ? { morning, evening } : null
      },
      { onSuccess, onError, onSettled: () => setIsSubmitting(false) }
    );
  };

  return (
    <FormProvider {...formMethods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={6}>
          <SubscriptionStack
            title='FORA Morning Prep'
            description='Prepare for the day'
            switchControlName='meetingPrepEnabled'
            inputControlName='meetingPrepTime'
            userTimeZone={userFriendlyTz}
          />
          <Divider />
          <SubscriptionStack
            title='FORA End-of-Day Summary'
            description='Review recently summarized information'
            switchControlName='summariesEnabled'
            inputControlName='summariesTime'
            userTimeZone={userFriendlyTz}
          />
          <Button
            alignSelf='flex-end'
            size='reskinLg'
            type='submit'
            isDisabled={isSubmitting || !formMethods?.formState?.isDirty}
          >
            Save Subscriptions
            {isSubmitting && (
              <Spinner
                size='xs'
                ml={3}
              />
            )}
          </Button>
        </Stack>
      </form>
    </FormProvider>
  );
}

function SubscriptionStack({
  title,
  description,
  switchControlName,
  inputControlName,
  userTimeZone
}) {
  const { register, watch, formState, control } = useFormContext();
  const isChecked = watch(switchControlName);

  return (
    <HStack
      alignItems='flex-start'
      gap={4}
    >
      <Controller
        control={control}
        name={switchControlName}
        render={({ field: { onChange, value } }) => (
          <Switch
            colorScheme='brandPrimary'
            isChecked={value}
            onChange={onChange}
          />
        )}
      />
      <Stack>
        <Text variant='body-600-lg'>{title}</Text>
        <Text
          variant='body-500-md'
          color='surface.onSurfaceVariant'
        >
          {description}
        </Text>
        {isChecked && (
          <Stack color='surface.onSurfaceVariant'>
            <HStack gap={3}>
              <Text>Deliver daily at</Text>
              <Input
                type='time'
                w={40}
                {...register(inputControlName, {
                  required: `${title} Delivery Time is Required`
                })}
              />
              <Text>{userTimeZone}</Text>
            </HStack>
            {formState?.errors[inputControlName] && (
              <Text
                color='critical.primary'
                fontSize='sm'
              >
                *{formState?.errors[inputControlName]?.message}
              </Text>
            )}
          </Stack>
        )}
      </Stack>
    </HStack>
  );
}
