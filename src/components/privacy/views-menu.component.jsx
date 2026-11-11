import { useDisclosure, Menu } from '@chakra-ui/react';

import { meetingIdWithBot } from '@util/helpers/meetings.helpers';
import { useMeetingViews, useMeetingById } from '@services/query-services/meetings.query-service';

import ViewsMenuList from '@components/privacy/views-menu-list.component';
import ViewsMenuButton from '@components/privacy/views-menu-button.component';

export default function ViewsMenu({ meeting }) {
  const disclosure = useDisclosure();
  const meetingId = meetingIdWithBot(meeting);
  const { data: views, isLoading } = useMeetingViews(meetingId, { enabled: !!meetingId });

  // The meeting with the bot is the one that has the shared users on it
  const { data: meetingWithBot } = useMeetingById(meetingId, { enabled: !!meetingId });

  if (!meetingId) {
    return null;
  }

  return (
    <Menu
      isOpen={disclosure.isOpen}
      onClose={disclosure.onClose}
    >
      <ViewsMenuButton
        disclosure={disclosure}
        isLoading={isLoading}
        views={views}
      />
      <ViewsMenuList
        views={views}
        meeting={meetingWithBot}
      />
    </Menu>
  );
}
