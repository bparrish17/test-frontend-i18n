import { Stack, Text } from '@chakra-ui/react';
import { getFormattedDate } from '@util/helpers';

export default function SourceModalSubheader({ card }) {
  const date = card?.source_data?.start_at || card?.created_at;
  const formattedDate = getFormattedDate(date);

  return (
    <Stack
      spacing={3}
      px={9}
    >
      <Text
        variant='headline-sm'
        color='surface.onSurface'
      >
        {card?.headline}
      </Text>
      <Text
        variant='label-caps-600-sm'
        color='brandPrimary.primary'
        whiteSpace='nowrap'
      >
        {formattedDate}
      </Text>
    </Stack>
  );
}
