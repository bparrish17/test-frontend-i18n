import { Box, Text, Flex, ListItem, UnorderedList, Skeleton } from '@chakra-ui/react';
import pluralize from 'pluralize';
import { useTeamChannels, useTeams } from '@services/query-services/teams.query-service';
import { TeamsLogo } from '@assets/images';
import DigestCard from './digest-card.component';

export default function TeamsDigestCard({ digest }) {
  const { data: teams } = useTeams(
    { teamIds: digest?.identifiers },
    { enabled: digest?.identifiers?.length > 0 }
  );

  return (
    <DigestCard
      digest={digest}
      logo={TeamsLogo}
      gap={4}
    >
      <Text
        fontSize='sm'
        color='surface.onSurfaceVariant'
      >
        Summarizing {digest?.identifiers?.length} {pluralize('team', digest?.identifiers?.length)}:
      </Text>
      {(teams ?? []).map(({ id, displayName }) => (
        <TeamListItem
          key={id}
          teamId={id}
          displayName={displayName}
          channelIds={digest?.metadata?.channels[id]}
        />
      ))}
    </DigestCard>
  );
}

function TeamListItem({ teamId, displayName, channelIds }) {
  const { data: channels, isLoading } = useTeamChannels(
    { teamId, channelIds },
    { enabled: !!teamId }
  );

  return (
    <Flex flexDir='column'>
      <Text
        fontWeight={500}
        fontSize='sm'
      >
        {displayName}
      </Text>
      <Box mt={1}>
        <Skeleton
          isLoaded={!isLoading}
          height='14px'
          width='120px'
        >
          <UnorderedList>
            {channels?.map((channel) => (
              <ListItem
                key={channel?.id}
                fontSize='sm'
              >
                {channel?.displayName}
              </ListItem>
            ))}
          </UnorderedList>
        </Skeleton>
      </Box>
    </Flex>
  );
}
