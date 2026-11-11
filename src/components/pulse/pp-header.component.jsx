import { Avatar, Flex, Heading, Text } from '@chakra-ui/react';
import { formatMeetingDateTime } from '@util/helpers/index.js';
import { format } from 'date-fns';
import { useUserStore } from '@store/app.store.js';

function PulsePanelHeader({ panel, variant = 'transparent' }) {
  const user = useUserStore((state) => state.user);
  const meeting = {
    start_at: new Date(panel?.source_data?.start_at),
    end_at: new Date(panel?.source_data?.end_at)
  };
  const titleColor = variant === 'transparent' ? 'brandPrimary.onPrimary' : '#1353EC';
  const dateColor = variant === 'transparent' ? 'brandPrimary.onPrimary' : '#1353EC';
  const timeColor = variant === 'transparent' ? 'brandPrimary.onPrimary' : '#113281';
  const { type } = panel;

  return (
    <Flex
      cursor='pointer'
      data-is-link={type}
      zIndex='overlay'
      margin='30px 0px'
      height='fit-content'
      padding='0px 0px'
    >
      <Flex
        data-is-link={type}
        alignItems='center'
      >
        <Avatar
          data-is-link={type}
          name={user?.name}
          src={user?.avatar_url}
          boxSize={10}
        />
      </Flex>
      <Flex
        cursor='pointer'
        marginLeft='10px'
        width='100%'
        flexDir='column'
      >
        <Heading
          data-is-link={type}
          color={titleColor}
          variant='ppTitle'
        >
          {panel?.source_data?.title}
        </Heading>
        <Flex gap='12px'>
          <Text
            data-is-link={type}
            variant='label-md'
            color={dateColor}
          >
            {format(new Date(meeting.start_at), 'EEE, MMM d')}
          </Text>

          <Text
            data-is-link={type}
            variant='label-md'
            color={timeColor}
          >
            {formatMeetingDateTime(meeting, 'short-p')}
          </Text>
        </Flex>
      </Flex>
      {/* <Text as='h2'>{format(new Date(panel.source_data.meeting.start_date), 'EEE, MMM d')}</Text> */}
    </Flex>
  );
}

export default PulsePanelHeader;
