import {
  Box,
  Stack,
  HStack,
  Text,
  Switch,
  Button,
  Input,
  Divider,
  Select,
  Spinner
} from '@chakra-ui/react';
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { usePatchPerson } from '@services/query-services/people.query-service';
import { useTimeZones } from '@services/query-services/types.query-service';
import { useUserStore } from '@store/app.store';
import { useMutationToast, useSetDocumentTitle } from '@util/hooks';
import {
  hhmmToUTCMinutes,
  getBrowserTimezone,
  utcMinutesToHHMM,
  getIanaTzName
} from '@util/helpers';
import { FORA_TIMEZONE_MAP } from '@util/constants';
import SettingsLayout from '@layouts/settings.layout';
import { useTranslation } from 'react-i18next';

const digestConfigsToFormValues = (userTimeZone, digestConfigs = {}) => {
  const { morning, evening } = digestConfigs;
  return {
    meetingPrepEnabled: !!morning,
    meetingPrepTime: utcMinutesToHHMM(morning?.time_of_day, userTimeZone),
    summariesEnabled: !!evening,
    summariesTime: utcMinutesToHHMM(evening?.time_of_day, userTimeZone)
  };
};

export default function EmailSubscriptionsPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Email Subscriptions - FORA');
  const navigate = useNavigate();
  const user = useUserStore((state) => state?.user);
  const tenant = useUserStore((state) => state?.tenant);
  const setUser = useUserStore((state) => state?.setUser);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isChangingTimezone, setIsChangingTimezone] = useState(false);

  const tzCodeName = (tzId) => FORA_TIMEZONE_MAP[tzId] ?? tzId;
  const { data: timeZones } = useTimeZones();

  const tzId = user?.time_zone_id ?? tenant?.time_zone_id;
  const ianaTzName = getIanaTzName(tzId);
  const configuredTimezone = timeZones?.length && timeZones?.find((tz) => tz.id === tzId)?.name;
  const userTimeZone = configuredTimezone ?? getBrowserTimezone();

  const defaultValues = digestConfigsToFormValues(ianaTzName, user?.digest_configs);
  const { handleSubmit, ...formMethods } = useForm({ defaultValues });

  useEffect(() => {
    formMethods.reset(defaultValues);
  }, [user, userTimeZone]);

  const { mutateAsync: patchPerson } = usePatchPerson();
  const { onSuccess, onError } = useMutationToast({
    success: {
      title: t('emailSubscriptionsPage.successfullyUpdatedEmailSubscriptions'),
      callback: (user) => {
        setUser(user);
        navigate('/settings');
      }
    },
    error: { title: t('emailSubscriptionsPage.somethingWentWrongWhile') }
  });
  const { onSuccess: onTimezoneChangeSuccess, onError: onTimezoneChangeError } = useMutationToast({
    success: {
      title: t('emailSubscriptionsPage.successfullyUpdatedUserTimezone'),
      callback: setUser
    },
    error: { title: t('emailSubscriptionsPage.somethingWentWrongWhile2') }
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

  const onTimezoneChange = async (e) => {
    setIsChangingTimezone(true);
    await patchPerson(
      {
        id: user?.id,
        time_zone_id: e?.target?.value
      },
      {
        onSuccess: onTimezoneChangeSuccess,
        onError: onTimezoneChangeError,
        onSettled: () => setIsChangingTimezone(false)
      }
    );
  };

  return (
    <SettingsLayout>
      <Stack
        w={{ base: 'full', md: '2xl' }}
        gap={8}
        mt={8}
      >
        <HStack gap={4}>
          <Text as='b'>{t('emailSubscriptionsPage.userTimezone')} </Text>
          <Select
            w={60}
            placeholder={t('emailSubscriptionsPage.selectTimezonePlaceholder')}
            variant='reskinFilled'
            size='reskinMd'
            isDisabled={isChangingTimezone}
            value={user?.time_zone_id}
            onChange={onTimezoneChange}
          >
            {timeZones?.length &&
              timeZones?.map((tz) => (
                <option
                  key={tz.id}
                  value={tz.id}
                >
                  {tz.name} ({tzCodeName(tz.id)})
                </option>
              ))}
          </Select>
          {isChangingTimezone && (
            <Spinner
              size='xs'
              color='brandPrimary.primary'
            />
          )}
        </HStack>
        <Divider />
        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={8}>
              <SubscriptionStack
                title={t('emailSubscriptionsPage.foraMorningPrep')}
                description={t('emailSubscriptionsPage.helpsYouPrepareFor')}
                userTimeZone={tzCodeName(tzId)}
                switchControlName='meetingPrepEnabled'
                inputControlName='meetingPrepTime'
              />
              <SubscriptionStack
                title={t('emailSubscriptionsPage.foraEndOfDay')}
                description={t('emailSubscriptionsPage.reviewRecentlySummarizedInformation')}
                userTimeZone={tzCodeName(tzId)}
                switchControlName='summariesEnabled'
                inputControlName='summariesTime'
              />
              <Box>
                <Button
                  variant='reskinPrimary'
                  w={40}
                  type='submit'
                  isLoading={isSubmitting}
                  isDisabled={!formMethods?.formState?.isDirty}
                >
                  {t('common.save')}
                </Button>
              </Box>
            </Stack>
          </form>
        </FormProvider>
      </Stack>
    </SettingsLayout>
  );
}

function SubscriptionStack({
  title,
  description,
  userTimeZone,
  switchControlName,
  inputControlName
}) {
  const { t } = useTranslation();

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
      <Stack gap={4}>
        <Text>
          <b>{title}: </b>
          {description}
        </Text>
        {isChecked && (
          <Stack color='surface.onSurfaceVariant'>
            <HStack gap={3}>
              <Text>{t('emailSubscriptionsPage.deliverDailyAt')}</Text>
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
