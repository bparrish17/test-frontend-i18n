import React, { Suspense, useState, useRef, useMemo, useEffect } from 'react';
import roomIcon from '@assets/images/videoprojector.svg';
import { Flex, Heading, UnorderedList, ListItem, Text, Avatar } from '@chakra-ui/react';
import PulsePanelHeader from '@components/pulse/pp-header.component.jsx';
import PulsePanelFooter from '@components/pulse/pp-footer.component.jsx';
import { uniqueId } from 'lodash-es';
import PulseQuote from '@components/pulse/pulse-quote.component.jsx';
import { PiUserSound } from 'react-icons/pi';
import PulsePill from '@components/pulse/pulse-pill.component.jsx';
import { useMaxParticipants } from '@util/hooks/pulse.hooks.jsx';
import { lazyWithRetry } from '@util/helpers';

const WithSeeMore = lazyWithRetry(() =>
  import('react-insta-stories').then((module) => ({
    default: module.WithSeeMore
  }))
);

function ParticipantsPulsePanel({ panel }) {
  return {
    content: (props) => {
      const { speakers } = panel.source_data;
      const maxParticipants = useMaxParticipants();

      const [sortedSpeakers, setSortedSpeakers] = useState([]);
      const [numRemainingSpeakers, setNumRemainingSpeakers] = useState(0);
      const hasBootstrapped = useRef(false);

      useMemo(() => {
        if (speakers?.length > 0) {
          const speakersArray = speakers
            .sort((a, b) => b.duration - a.duration)
            .map((speaker) => {
              const { duration } = speaker;
              const speakingTime = (duration / 60).toFixed(1) + ' mins';
              return {
                speakingTime,
                ...speaker
              };
            });
          setSortedSpeakers(speakersArray);
          hasBootstrapped.current = true;
        }
      }, [speakers]);

      useEffect(() => {
        if (hasBootstrapped.current) {
          setNumRemainingSpeakers(speakers.length - maxParticipants);
        }
      }, [maxParticipants, speakers]);

      const _renderParticipants = () => {
        if (sortedSpeakers.length === 0) return null;

        return sortedSpeakers.slice(0, maxParticipants).map((speaker) => {
          // todo: hack to see if its a room
          if (/\broom\b/i.test(speaker.name)) {
            speaker.avatar_url = roomIcon;
          }
          return (
            <ListItem key={uniqueId()}>
              <Flex flexDir='column'>
                <Flex>
                  <Avatar
                    fit='fill'
                    sx={{
                      img: { objectFit: 'fill' }
                    }}
                    name={speaker?.name}
                    mb={3}
                    size='lg'
                    src={speaker?.avatar_url}
                    filter='grayscale(1)'
                  />
                  <Text
                    display='flex'
                    flexDir='column'
                    justifyContent='center'
                    variant='headline-lighter-md'
                    ml={4}
                    color='#FEFFFF'
                  >
                    {speaker.name}
                  </Text>
                </Flex>
                <Flex mb={3}>
                  <PulseQuote
                    textColor='#FEFFFF'
                    lineColor='#AAC1F5'
                    text={speaker.behavior}
                  />
                </Flex>
                <Flex
                  gap={2}
                  mb={9}
                >
                  <PulsePill
                    variant='neutral'
                    icon={<PiUserSound />}
                    text={speaker.speakingTime}
                  />
                  <PulsePill
                    variant='neutral'
                    topic='discussion'
                    level={speaker.demeanor}
                  />
                </Flex>
              </Flex>
            </ListItem>
          );
        });
      };

      return (
        <Suspense>
          <WithSeeMore {...props}>
            <Flex
              px={6}
              borderRadius={{ base: '0px', md: '10px' }}
              flexDir='column'
              justify='space-between'
              h='full'
              w='full'
              mixBlendMode='plus-darker'
              bgGradient='linear(to-b, #123790 0%, #05102A 100%)'
            >
              <Flex flexDir='column'>
                <PulsePanelHeader panel={panel} />
                <Heading
                  variant='bolder-md'
                  color='#FEFFFF'
                >
                  Active Participants
                </Heading>
              </Flex>

              {sortedSpeakers.length > 0 && (
                <Flex flexDir='column'>
                  <UnorderedList>{_renderParticipants()}</UnorderedList>
                  {numRemainingSpeakers > 0 && (
                    <Text
                      variant='body-reg'
                      ml='69px'
                      mt={2}
                      color='white'
                    >
                      +{numRemainingSpeakers} more
                    </Text>
                  )}
                </Flex>
              )}

              <Flex></Flex>
            </Flex>
          </WithSeeMore>
        </Suspense>
      );
    },
    seeMoreCollapsed: () => {
      // to use built-in see more feature, utilize the onClick below
      // onClick={() => toggleMore(true)}
      // {toggleMore, action}
      const maxParticipants = useMaxParticipants();
      const currParticipants = panel.source_data.participants.slice(0, maxParticipants);
      return (
        <PulsePanelFooter
          anchor='meeting-prep'
          ctaText='Participants'
          countPath='source_data.participants.length'
          countLabel='People'
          variant='dark'
          panel={{
            ...panel,
            source_data: {
              ...panel.source_data,
              participants: currParticipants
            }
          }}
        />
      );
    },
    seeMore: () => {
      // { close }
      return <></>;
    },
    duration: 5000
  };
}

export default ParticipantsPulsePanel;
