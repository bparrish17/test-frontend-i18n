import { useDisclosure, Menu } from '@chakra-ui/react';

import { useGetAccessStats, useMeetingById } from '@services/query-services/meetings.query-service';

import { useManageMeetingSensitivity, useManageMeetingShares } from '@util/hooks';
import { isMeetingParticipant, meetingIdWithBot } from '@util/helpers/meetings.helpers';

import PrivacyMenuList from '@components/privacy/privacy-menu-list.component';
import PrivacyMenuButton from '@components/privacy/privacy-menu-button.component';
import ConfirmAccessModal from '@components/privacy/confirm-access-modal.component';
import { useUserStore } from '@store/app.store';

export default function PrivacyMenu({ meeting }) {
  const user = useUserStore((state) => state?.user);
  const disclosure = useDisclosure();
  const modalDisclosure = useDisclosure();
  const isSensitive = meeting?.sensitive;
  const manageMeetingSensitivity = useManageMeetingSensitivity({});
  const manageMeetingShares = useManageMeetingShares();

  const originalMeetingId = meeting?.id;
  const { data: accessStats, isLoading } = useGetAccessStats(originalMeetingId);
  const meetingId = meetingIdWithBot(meeting);
  const { data: meetingWithBot, isLoading: isLoadingMeeting } = useMeetingById(meetingId, {
    enabled: !!meetingId
  });

  const toggleMeetingSensitivity = async () => {
    if (meetingWithBot) await manageMeetingShares(meetingWithBot);
    await manageMeetingSensitivity(meeting);
    modalDisclosure?.onClose();
  };

  return (
    <Menu
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
      modifiers={[
        {
          name: 'offset',
          options: {
            offset: [-40, 5] // Horizontal and vertical offsets
          }
        },
        {
          name: 'preventOverflow',
          options: {
            boundary: 'viewport'
          }
        }
      ]}
    >
      <PrivacyMenuButton
        disclosure={disclosure}
        isLoading={isLoading}
        isSensitive={isSensitive}
        accessStats={accessStats}
      />
      <PrivacyMenuList
        isSensitive={isSensitive}
        accessStats={accessStats}
        toggleMeetingSensitivity={toggleMeetingSensitivity}
        modalDisclosure={modalDisclosure}
        isLoadingMeeting={isLoadingMeeting}
        isMeetingParticipant={isMeetingParticipant(user, meeting)}
      />
      <ConfirmAccessModal
        disclosure={modalDisclosure}
        accessStats={accessStats}
        toggleMeetingSensitivity={toggleMeetingSensitivity}
      />
    </Menu>
  );
}
