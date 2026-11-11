import { Box, Flex, Stack, Text } from '@chakra-ui/react';
import { partition, some } from 'lodash-es';

import { formatTimeDurationFromZero, hours } from '@util/helpers';
import { useTranslation } from 'react-i18next';

export default function AgendaStats({ meetings }) {
  const { t } = useTranslation();

  // Todo: prep all this data in one go rather than multiple separate split/reduces
  const [externalMeetings, internalMeetings] = partition(meetings, (m) =>
    some(m?.nylas?.participants, { external: true })
  );
  const externalDurations = externalMeetings.reduce(accumulateDuration, 0);
  const internalDurations = internalMeetings.reduce(accumulateDuration, 0);
  const allDurations = externalDurations + internalDurations;

  return (
    <Stack
      flexDir={{ base: 'row', md: 'column' }}
      w='full'
    >
      <Flex
        gap={2.5}
        flexDir={{ base: 'column', md: 'row' }}
        flex={1}
      >
        <Box
          w='100px'
          fontWeight={600}
        >
          {t('agendaStats.meetings')}
        </Box>
        <Stack
          flex={1}
          gap={0}
          fontWeight={500}
        >
          <DurationStat
            meetings={meetings}
            duration={allDurations}
            label={t('agendaStats.total')}
            color='surface.onSurfaceVariant'
          />
          <DurationStat
            meetings={internalMeetings}
            duration={internalDurations}
            label={t('agendaStats.internal')}
            fontSize='sm'
            color='surface.onSurfaceVariant'
            lineHeight={5}
          />
          <DurationStat
            meetings={externalMeetings}
            duration={externalDurations}
            label={t('agendaStats.external')}
            fontSize='sm'
            color='surface.onSurfaceVariant'
            lineHeight={5}
          />
        </Stack>
      </Flex>

      <Flex
        gap={2.5}
        flexDir={{ base: 'column', md: 'row' }}
        flex={1}
      >
        <Box
          w='100px'
          fontWeight={600}
          color='surface.onSurfaceVariant'
        >
          {t('agendaStats.availability')}
        </Box>
        <Text
          flex={1}
          fontWeight={500}
        >
          {formatAccDuration(hours(8) - allDurations)}
        </Text>
      </Flex>
    </Stack>
  );
}

const accumulateDuration = (acc, meeting) => {
  const duration = meeting?.end_at - meeting?.start_at;
  return acc + duration;
};

const formatAccDuration = (duration) => formatTimeDurationFromZero(duration, 'single');

// reskin todo: as="dt"/"dl"
function DurationStat({ label, meetings, duration, ...props }) {
  const formattedDuration = formatAccDuration(duration);
  return (
    <Text {...props}>
      {meetings?.length} {label}&nbsp;
      {formattedDuration?.length > 0 && (
        <Text
          as='span'
          color='surface.onSurfaceVariant'
        >
          ({formattedDuration})
        </Text>
      )}
    </Text>
  );
}
