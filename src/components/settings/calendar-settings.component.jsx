import { Stack, HStack, Text, Image, Center, Divider, Spacer, Switch } from '@chakra-ui/react';
import { Fragment } from 'react';

import { useSetCalendarActive } from '@services/query-services/calendars.query-service';
import { useUserStore } from '@store/app.store';
import { OutlookLogo, GoogleCalendarLogo } from '@assets/images';

function CalendarHeader({ provider }) {
  let isUnexpectedProvider = false;
  let logoSrc;
  let logoName;

  if (provider === 'gmail') {
    logoSrc = GoogleCalendarLogo;
    logoName = 'Google Calendar';
  } else if (provider === 'eas') {
    logoSrc = OutlookLogo;
    logoName = 'Microsoft Outlook';
  } else {
    logoName = 'your calendar provider';
    isUnexpectedProvider = true;
  }

  if (!provider) {
    return null;
  }

  return (
    <Stack pb={2}>
      {!isUnexpectedProvider && (
        <>
          <Center boxSize={10}>
            <Image src={logoSrc} />
          </Center>
          <Text
            fontWeight={700}
            fontSize='lg'
            mt={2}
          >
            {logoName}
          </Text>
        </>
      )}
      <Text
        fontSize='sm'
        color='surface.onSurfaceVariant'
      >
        Events & changes from {logoName} are synced with Fora.
      </Text>
    </Stack>
  );
}

export default function CalendarSettings({ calendars, nylasAccount }) {
  const userId = useUserStore((state) => state?.user?.id);
  const queryOptions = {
    optimisticUpdateConfig: {
      enabled: true,
      type: 'search',
      queryKeyToUpdate: { creator_id: userId }
    }
  };
  // todo: add removing back... just make sure it doesn't remove the calendar on google!!
  const { mutateAsync: setCalendarActive } = useSetCalendarActive(queryOptions);

  const handleActiveToggle = async (id, value) => {
    await setCalendarActive({ id, value });
  };

  return (
    <Stack
      border='reskin'
      rounded='2xl'
      p={6}
      h='full'
      gap={4}
    >
      <CalendarHeader provider={nylasAccount?.provider} />
      {calendars.map((calendar) => {
        return (
          <Fragment key={calendar.id}>
            <Divider />
            <HStack gap={4}>
              <Text fontWeight={600}>{calendar.name}</Text>
              <Spacer />
              <Switch
                isChecked={calendar.active}
                onChange={(e) => handleActiveToggle(calendar.id, e.target.checked)}
              />
              {/* <Button
                variant="outline"
                size="sm"
                colorScheme="red"
                onClick={() => handleRemoveCalendar(calendar.id)}
              >
                Remove
              </Button> */}
            </HStack>
          </Fragment>
        );
      })}
    </Stack>
  );
}
