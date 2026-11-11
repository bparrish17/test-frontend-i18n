import { Stack, Spinner } from '@chakra-ui/react';

import { useCalendars } from '@services/query-services/calendars.query-service';
import { useUserStore } from '@store/app.store';
import { useNylasAccounts } from '@services/query-services/nylas.query-service';
import { useSetDocumentTitle } from '@util/hooks';
import SettingsLayout from '@layouts/settings.layout';
import CalendarSettings from '@components/settings/calendar-settings.component';
import AddCalendarButton from '@components/settings/add-calendar-button.component';

export default function CalendarSettingsPage() {
  useSetDocumentTitle('Data Sources - FORA');
  const user = useUserStore((state) => state.user);
  const { data: calendars, isLoading: isLoadingCalendars } = useCalendars({ creator_id: user?.id });
  const { data: nylasAccounts, isLoading: isLoadingNylasAccounts } = useNylasAccounts({
    person_id: user?.id
  });
  const isLoading = isLoadingCalendars || isLoadingNylasAccounts;

  return (
    <SettingsLayout
      w='3xl'
      mx='auto'
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <Stack
          w='full'
          gap={4}
        >
          <AddCalendarButton
            variant='reskinWhite'
            borderRadius='2xl'
            justifyContent='flex-start'
          />
          {calendars?.length > 0 && (
            <CalendarSettings
              calendars={calendars}
              nylasAccount={nylasAccounts && nylasAccounts[0]}
            />
          )}
          {/* <ForaSettings /> */}
        </Stack>
      )}
    </SettingsLayout>
  );
}
