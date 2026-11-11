import { Text, Tooltip } from '@chakra-ui/react';
import { some } from 'lodash-es';
import { memo } from 'react';

import { getEmailDomain, getParticipantText } from '@util/helpers';
import { useRefStore, useUserStore } from '@store/app.store';

// Participants text on summary card. Rendered on meeting page and feed.
// If user is on the meeting page and attendees modal can be opened, clicking on the text will open the modal.
// Else, hovering over the text will show a tooltip with the list of participants.
function MeetingParticipantsText({ meeting, showParticipantStatus = true, ...textProps }) {
  const openAttendeesModal = useRefStore((state) => state.openAttendeesModal);
  const participantText = getParticipantText(meeting);
  const nylasParticipants = meeting?.nylas?.participants;
  const showTooltip = nylasParticipants?.length >= 3;
  const userEmailDomain = useUserStore((state) => getEmailDomain(state?.user?.email));
  const isExternal = some(
    nylasParticipants ?? meeting?.participants,
    (p) => getEmailDomain(p.email) !== userEmailDomain
  );

  return (
    <Tooltip
      label={nylasParticipants?.map((p, i) => (
        <div key={p.email ?? i}>
          {p.name && p.name !== p.email ? `${p.name} - ${p.email}` : p.email}
        </div>
      ))}
      isDisabled={!showTooltip}
    >
      <Text
        as='span'
        fontSize='sm'
        lineHeight='normal'
        cursor={showTooltip ? 'default' : 'initial'}
        onClick={openAttendeesModal}
        {...textProps}
      >
        {participantText}
        {showParticipantStatus && ` (${isExternal ? 'External' : 'Internal'})`}
      </Text>
    </Tooltip>
  );
}

export default memo(MeetingParticipantsText);
