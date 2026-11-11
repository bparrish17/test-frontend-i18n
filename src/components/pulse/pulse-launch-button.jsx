import React, { Fragment } from 'react';
import { Box, Icon, IconButton, Tooltip } from '@chakra-ui/react';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { SFCalendarIcon } from '@assets/icons';
import { uniqueId } from 'lodash-es';
import { useBreakpoints } from '@util/hooks/index.js';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * A button component that launches either a modal with meeting details or navigates to a meeting page.
 * Features a calendar icon with a pulse indicator and responsive tooltip behavior.
 *
 * @param {Object} props
 * @param {Object} props.meeting - Meeting data object containing meeting details and source data.
 * @param {number} props.meetingIndex - Index of the meeting in the list of meetings.
 * @param {Function} props.setSelectedMeeting - Callback function to set the selected meeting when clicked.
 * @param {Function} props.onOpen - Callback function to open the meeting details modal.
 * @param {boolean} [props.shouldRouteToMeeting=false] - When true, clicking the button navigates to the meeting page instead of opening a modal.
 * @returns {JSX.Element} A button with calendar icon and pulse indicator.
 *
 * @example
 * // Button that opens a modal with meeting details
 * <PulseLaunchButton
 *   meeting={meetingData}
 *   meetingIndex={0}
 *   setSelectedMeeting={setMeeting}
 *   onOpen={openModal}
 * />
 *
 * @example
 * // Button that navigates directly to meeting page
 * <PulseLaunchButton
 *   meeting={meetingData}
 *   meetingIndex={0}
 *   setSelectedMeeting={setMeeting}
 *   onOpen={openModal}
 *   shouldRouteToMeeting={true}
 * />
 */
const PulseLaunchButton = ({
  meeting,
  meetingIndex,
  setSelectedMeeting,
  onOpen,
  shouldRouteToMeeting
}) => {
  const { t } = useTranslation();

  const { isMobile } = useBreakpoints();
  const navigate = useNavigate();
  const Wrapper = isMobile ? Fragment : Tooltip;

  return (
    <Wrapper label={!isMobile && t('pulseLaunchButton.launchPulse')}>
      <Box
        position='relative'
        _hover={{
          filter: 'brightness(80%)'
        }}
      >
        <IconButton
          onClick={() => {
            if (shouldRouteToMeeting) {
              navigate(`/meeting/${meeting.source_data.id}`);
              return;
            }
            setSelectedMeeting({
              ...meeting,
              meetingIndex
            });
            onOpen();
          }}
          aria-label={t('pulseLaunchButton.launchPulseAriaLabel')}
          icon={<SFCalendarIcon />}
          key={uniqueId()}
          display='flex'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          bg='linear-gradient(180deg, #1353EC 0%, #000075 100%)'
          color='white'
          width='48px'
          height='48px'
          borderRadius='16px'
          position='relative'
        />
        <Box
          position='absolute'
          bottom='0'
          right='0'
          width='18px'
          height='18px'
          borderRadius='50%'
          bg='#1353EC'
          display='flex'
          alignItems='center'
          justifyContent='center'
          transform='translate(40%, 15%)'
        >
          <Icon
            as={TbActivityHeartbeat}
            color='white'
            transform='scale(0.85)'
          />
        </Box>
      </Box>
    </Wrapper>
  );
};

export default PulseLaunchButton;
