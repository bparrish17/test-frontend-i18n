import { Stack, Text } from '@chakra-ui/react';
import { format, parseISO } from 'date-fns';
import { intervalToFormattedDuration } from '@util/helpers';
import { useTranslation } from 'react-i18next';

export default function EmploymentHistoryPosition({ position, positionIndex, positions }) {
  const { t } = useTranslation();

  const backupStartDate =
    positionIndex === 0 ? new Date() : positions[positionIndex - 1].start_date;
  const startDate = parseISO(position.start_date ?? backupStartDate);
  const backupEndDate =
    positionIndex === 0 ? new Date() : parseISO(positions[positionIndex - 1].start_date);
  const endDate = position.end_date ? parseISO(position.end_date) : backupEndDate;
  const duration = intervalToFormattedDuration(startDate, endDate, ['years', 'months']);
  const durationText = duration ? `(${duration})` : '';

  return (
    <Stack
      gap={0.5}
      pb={3}
    >
      <Text lineHeight='normal'>{position.title}</Text>
      <Text
        fontSize='xs'
        color='surface.onSurfaceVariant'
        lineHeight='normal'
      >
        {positionIndex === 0 && position.current
          ? t('employmentHistoryPosition.current')
          : `${format(startDate, 'y')}-${format(endDate, 'y')} ${durationText}`}
      </Text>
    </Stack>
  );
}
