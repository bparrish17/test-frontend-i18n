import { Flex, Heading } from '@chakra-ui/react';
import PulsePanelHeader from '@components/pulse/pp-header.component.jsx';
import PulsePill from '@components/pulse/pulse-pill.component.jsx';
import FacePile from '@components/general/face-pile.jsx';
import MeetingVibe from '@components/general/meeting-vibe.component.jsx';
import { BsFillLightningChargeFill } from 'react-icons/bs';

function CoverPulsePanel({ panel }) {
  return {
    content: () => {
      return (
        <Flex
          px={6}
          borderRadius={{ base: '0px', md: '10px' }}
          flexDir='column'
          justify='space-between'
          h='full'
          w='full'
          mixBlendMode='plus-darker'
          // different background for high priority meetings
          bgGradient={
            panel?.source_data?.high_priority
              ? 'linear(to-t, #01016E 0%, #CC3D4D 100%)'
              : 'linear(to-t, #01016E 0%, #2967ea 100%)'
          }
        >
          <PulsePanelHeader
            variant='transparent'
            panel={panel}
          />

          <Flex
            mb='160px !important'
            flexDir='column'
            m='0px'
            gap='24px'
          >
            <Heading
              color='surface.onPrimary'
              fontFamily='Suisse Intl'
              fontSize='40px'
              fontStyle='normal'
              fontWeight='700'
              lineHeight={11}
              letterSpacing='-0.576px'
            >
              {panel?.source_data?.title}
            </Heading>

            <PulsePill
              variant='neutral'
              icon={<BsFillLightningChargeFill />}
              text={panel?.headline}
            />
            <Flex>
              <Flex
                flexDirection={{ base: 'column', md: 'row' }}
                gap='36px'
                justifyContent='space-between'
              >
                <FacePile
                  size='medium'
                  faces={panel?.source_data?.participants}
                />
                <Flex
                  flexDir={{ base: 'column', md: 'row' }}
                  alignItems='center'
                  alignContent='center'
                  justifyContent='center'
                >
                  <Flex
                    gap='24px'
                    flexDirection='column'
                  >
                    <MeetingVibe
                      topic='sentiment'
                      level={panel?.net_sentiment_score}
                    />
                    <MeetingVibe
                      topic='discussion'
                      level={panel?.net_strategic_tactical_score}
                    />
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      );
    },
    duration: 5000
  };
}

export default CoverPulsePanel;
