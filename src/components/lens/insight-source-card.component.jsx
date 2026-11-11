import { Heading, HStack, Stack, Text } from '@chakra-ui/react';
import { format } from 'date-fns';
import { capitalize } from 'lodash-es';

import ReskinMeetingCard from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component';
import SourceLogo from '@components/general/source-logo.component';
import { formatCronToCadence } from '@util/helpers';
import { useTranslation } from 'react-i18next';

export default function LensInsightSourceCard({ card }) {
  const { t } = useTranslation();

  if (card?.source === 'Meeting') {
    const isSensitive = card.source_data?.sensitive;
    return (
      <ReskinMeetingCard
        card={card}
        meeting={card.source_data}
        enableControlBar={false}
        includeDate
        isLensSourceCard
        isSensitive={isSensitive}
      />
    );
  } else {
    const channel = card?.source_data;
    return (
      <Stack
        layerStyle='section-card'
        w='full'
        h='fit-content'
        p={3}
        gap={0.5}
      >
        <HStack gap={3}>
          <SourceLogo
            source={channel}
            sourceType='Channel'
          />
          <Heading fontSize='md'>
            {channel?.title ?? t('insightSourceCard.untitledChannel')}
          </Heading>
        </HStack>
        <HStack
          fontWeight={500}
          color='surface.onSurfaceVariant'
          ml={8}
          gap={1.5}
        >
          <Text
            fontSize={{ base: '12px', xl: '13px' }}
            fontWeight={600}
          >
            {capitalize(formatCronToCadence(channel?.schedule))} Digest
          </Text>
          <Text>•</Text>
          {card?.created_at && (
            <Text
              fontSize={{ base: '12px', xl: '13px' }}
              fontWeight={600}
            >
              {format(card?.created_at, 'LLL d')} Edition
            </Text>
          )}
        </HStack>
      </Stack>
    );
  }
}
