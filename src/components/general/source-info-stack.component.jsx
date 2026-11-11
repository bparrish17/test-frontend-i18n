import { Avatar, HStack, Text, Tooltip } from '@chakra-ui/react';
import { capitalize } from 'lodash-es';

import { BG_COLORS } from '@util/constants';
import {
  formatCardCreatedTime,
  formatCronToCadence,
  formatMeetingDateTime,
  formatMeetingDuration,
  emailToInt
} from '@util/helpers';

/**
 *
 * @param {{
 *  sourceData: Meeting | Bot | Channel;
 *  sourceType: 'Meeting' | 'Bot' | 'Channel';
 *  participants: any[] | null;
 *  participantsFormat: 'short' | 'long';
 *  sourceDateFormat: 'short-P' | 'short-mmm-d' | 'long',
 *  card?: Card
 * }} props
 * @returns
 */
export default function SourceInfoStack({
  source: sourceData,
  sourceType,
  participants,
  participantsFormat,
  showSourceDate,
  showGenerationDate,
  sourceDateFormat,
  card,
  ...containerProps
}) {
  const hasParticipants = !!participants && participants?.length > 0;
  const nylas = sourceData?.nylas ?? {};
  const owner =
    nylas.owner ?? nylas.organizer?.name ?? nylas.organizer?.email ?? sourceData?.creator?.name;

  let source;
  if (sourceType === 'Meeting') {
    source = 'Meeting';
  } else if (sourceType === 'Channel') {
    if (sourceData?.source === 'Email') {
      source = 'Email';
    } else if (sourceData?.source === 'Slack' || sourceData?.source === 'Teams') {
      // limiting calls to useChannelById to only when source is Slack or Teams
      source = `${capitalize(formatCronToCadence(sourceData?.schedule) ?? '')} Digest`;
    }
  }

  return (
    <HStack {...containerProps}>
      {hasParticipants && (
        <HStack gap={3}>
          <Tooltip
            my={3}
            label={participants.map((p, i) => (
              <div key={p.email ?? i}>
                {p.name && p.name !== p.email ? `${p.name} - ${p.email}` : p.email}
              </div>
            ))}
          >
            <HStack
              position='relative'
              w={8}
            >
              {/* Todo: update to use AvatarGroup from Chakra? */}
              {participants.slice(0, 3).map((participant, i) => {
                const seedInt = emailToInt(participant?.email);
                return (
                  <Avatar
                    key={participant.email}
                    position='absolute'
                    left={i * 2}
                    bgColor={BG_COLORS[seedInt % BG_COLORS.length]}
                    color='white'
                    size='xs'
                    border='2px solid white'
                    src={participant.avatar_url}
                    name={participant.name ?? participant.email}
                  />
                );
              })}
            </HStack>
          </Tooltip>
          {/* set negative margin to adjust participants count back towards avatars */}
          <Text
            fontSize='xs'
            ml={participantsFormat === 'short' && `-${3 - participants?.length}`}
          >
            {participantsFormat === 'short'
              ? participants?.length
              : `${owner} (Owner) & ${participants?.length} others`}
          </Text>
        </HStack>
      )}
      <Text
        color='surface.onSurfaceVariant'
        fontSize='xs'
      >
        {source}
        {sourceType === 'Meeting' &&
          sourceData?.start_at &&
          sourceData?.end_at &&
          new Date(sourceData?.end_at).getTime() > new Date(sourceData?.start_at).getTime() &&
          ` (${formatMeetingDuration(sourceData?.start_at, sourceData?.end_at)})`}
      </Text>
      {showSourceDate && (
        <Text
          color='surface.onSurfaceVariant'
          fontSize='xs'
        >
          {formatMeetingDateTime(sourceData, sourceDateFormat)}
        </Text>
      )}
      {card && showGenerationDate && (
        <Text
          color='surface.onSurfaceVariant'
          fontSize='xs'
        >
          Generated on {formatCardCreatedTime(card)}
        </Text>
      )}
    </HStack>
  );
}
