import { HStack, Select, Spinner } from '@chakra-ui/react';

import { usePatchPerson } from '@services/query-services/people.query-service';
import { useTimeZones } from '@services/query-services/types.query-service';
import { useUserStore } from '@store/app.store';
import { useMutationToast } from '@util/hooks';
import { FORA_TIMEZONE_MAP } from '@util/constants';
import { useTranslation } from 'react-i18next';

export default function TimezoneSection() {
  const { t } = useTranslation();

  const user = useUserStore((state) => state?.user);
  const setUser = useUserStore((state) => state?.setUser);
  const { data: timeZones } = useTimeZones();
  const { mutateAsync: patchPerson, isLoading: isChangingTimezone } = usePatchPerson();
  const { onSuccess: onTimezoneChangeSuccess, onError: onTimezoneChangeError } = useMutationToast({
    success: {
      title: t('timezoneSection.successfullyUpdatedUserTimezone'),
      callback: setUser
    },
    error: { title: t('timezoneSection.somethingWentWrongWhile') }
  });

  const onTimezoneChange = async (e) => {
    await patchPerson(
      {
        id: user?.id,
        time_zone_id: e?.target?.value
      },
      {
        onSuccess: onTimezoneChangeSuccess,
        onError: onTimezoneChangeError
      }
    );
  };

  return (
    <HStack gap={4}>
      <Select
        placeholder={t('timezoneSection.selectTimezonePlaceholder')}
        variant='reskinFilled'
        size='reskinLg'
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
              {tz.name} ({FORA_TIMEZONE_MAP[tz.id] ?? tz.id})
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
  );
}
