import { Stack, Divider, UnorderedList, ListItem, Flex, Box } from '@chakra-ui/react';

import { SFClockArrow2CirclesIcon } from '@assets/icons';
import SectionHeader from '@components/meeting/section-header.component';
import MeetingMarkdown from '@components/meeting/meeting-markdown.component';
import MeetingPageSection from '@pages/meeting/section.component';
import CopyTextMenu from '@components/general/copy-text-menu.component';
import analyticsService from '@services/analytics.service';

export default function FollowUpsSection({ section, bot, hideHeader = false }) {
  const botFollowups = bot?.followups;
  let followupsMarkdown =
    typeof bot?.summary === 'string' && !botFollowups ? bot?.summary?.split('\n\n')[1] : null;

  // markdown list
  if (botFollowups) {
    followupsMarkdown = 'Potential Followups:\n';
    followupsMarkdown += botFollowups.reduce((acc, followup) => {
      return `${acc}- ${followup.value}\n`;
    }, '');
  } else {
    return null;
  }

  const handleMenuClick = () => {
    analyticsService.trackMenuClick('Followups Overflow Menu Click', {
      meetingId: section.meetingId,
      route: window?.location?.pathname
    });
  };

  return (
    <MeetingPageSection
      id='follow-ups'
      section={section}
      hideHeader={hideHeader}
    >
      <Stack
        layerStyle='section-card'
        gap={0}
      >
        <SectionHeader
          headline='Potential Followups'
          icon={SFClockArrow2CirclesIcon}
          actionIcon={
            <CopyTextMenu
              textToCopy={followupsMarkdown}
              hoverButton={false}
              trackerFn={handleMenuClick}
            />
          }
        />
        <Divider style={{ margin: 0 }} />
        <Stack
          p={1}
          gap={8}
        >
          {botFollowups && botFollowupsList(botFollowups)}

          {!botFollowups && followupsMarkdown && (
            <MeetingMarkdown>{followupsMarkdown}</MeetingMarkdown>
          )}
        </Stack>
      </Stack>
    </MeetingPageSection>
  );
}

function botFollowupsList(followups) {
  return (
    <Stack
      bgColor='surface.containerLowest'
      p={3}
      gap={3}
    >
      <UnorderedList
        color='surface.onSurfaceVariant'
        fontWeight={500}
        p={2}
        ml='10px'
        fontSize='sm'
        sx={{ 'li:not(:last-child)': { paddingBottom: '12px' } }}
      >
        {followups?.map((followup) => (
          <ListItem
            key={followup?.value}
            pb={3}
            color='surface.inverseSurface'
            _hover={{ color: 'surface.onSurface' }}
            className='group'
          >
            <Flex
              justify='space-between'
              align='flex-start'
            >
              <Box>{followup?.value}</Box>
              <CopyTextMenu textToCopy={followup?.value} />
            </Flex>
          </ListItem>
        ))}
      </UnorderedList>
    </Stack>
  );
}
