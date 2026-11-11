import { Text } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { SlackLogo } from '@assets/images';
import { useSlackChannels } from '@services/query-services/slack.query-service';
import DigestCard from './digest-card.component';

export default function SlackDigestCard({ digest }) {
  const slackChannelsIds = new Set(digest?.identifiers);
  const { data: slackChannels } = useSlackChannels({
    select: (allSlackChannels) => allSlackChannels.filter((c) => slackChannelsIds.has(c.id)),
    placeholderData: []
  });

  return (
    <DigestCard
      digest={digest}
      logo={SlackLogo}
    >
      <>
        <Text
          fontSize='sm'
          color='surface.onSurfaceVariant'
        >
          Summarizing {slackChannels?.length} {pluralize('channel', slackChannels?.length)}:
        </Text>
        {slackChannels.map((channel) => {
          return (
            <Text
              key={channel.id}
              fontWeight={500}
              fontSize='sm'
            >
              #{channel.name}
            </Text>
          );
        })}
      </>
    </DigestCard>
  );
}
