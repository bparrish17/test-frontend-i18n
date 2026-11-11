import { Avatar, AvatarGroup, HStack } from '@chakra-ui/react';
import MeetingParticipantsText from '@components/general/card/meeting-card/meeting-participants-text.component';

export default function MeetingParticipants({ meeting, showParticipantStatus = true }) {
  if (!meeting?.nylas?.participants?.length) {
    return null;
  }
  return (
    <HStack>
      <AvatarGroup
        size='xsm'
        max={2}
      >
        {meeting?.nylas?.participants?.map((p) => (
          <Avatar
            src={p?.avatar_url || ''}
            key={`${p?.email || p?.name}-avatar`}
            name={p?.name}
          />
        ))}
      </AvatarGroup>
      <MeetingParticipantsText
        meeting={meeting}
        fontSize='sm'
        noOfLines={1}
        color='brandPrimary.primary'
        fontWeight={600}
        textOverflow='ellipsis'
        showParticipantStatus={showParticipantStatus}
      />
    </HStack>
  );
}
