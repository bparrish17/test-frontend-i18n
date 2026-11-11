import { HStack, Stack, Text } from '@chakra-ui/react';

import { SpeakerIcon } from '@assets/icons';
import ReskinPeopleStack from '@components/general/reskin-people-stack.component';
import { useUserStore } from '@store/app.store';
import { useStatsigClient } from '@statsig/react-bindings';

export default function MeetingAttendees({ attendees }) {
  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;
  const getInitialMaxPeople = () => {
    if (!attendees) return undefined;
    const lastSpeakerIndex = attendees.findIndex((a) => !a.duration);
    return lastSpeakerIndex > 0 ? lastSpeakerIndex : undefined;
  };

  const { checkGate } = useStatsigClient();
  const isBehaviorEnabled = checkGate('show-speaker-behavior');

  return (
    <ReskinPeopleStack
      people={attendees}
      personPreviewProps={(person) => ({
        title: (
          <Stack
            gap={1.5}
            mt={0.5}
          >
            {isBehaviorEnabled && !isGuest && person?.behavior && (
              <Text
                variant='label-reg-lg'
                color='surface.onSurfaceVariant'
                lineHeight={1.125}
              >
                {person.behavior}
              </Text>
            )}
            <Text
              variant='label-reg-md'
              color='surface.outline'
              lineHeight={1.125}
            >
              {person.title}
              {person?.organizationName && person?.title && ', '}
              <Text as='span'>{person?.organizationName}</Text>
            </Text>
          </Stack>
        ),
        isLink: !!person.email,
        nameProps: { variant: 'body-reg-md' },
        avatarProps: {
          boxSize: '50px'
        }
      })}
      personRightElement={SpeakerTimeLabel}
      initialMaxPeople={getInitialMaxPeople()}
    />
  );
}

const SpeakerTimeLabel = ({ person }) => {
  const minutes = person?.duration;
  if (!minutes) {
    return null;
  }

  return (
    <HStack
      h={8}
      bgColor='brandPrimary.container'
      color='brandPrimary.onSurface'
      rounded='md'
      px={3}
      minW='fit-content'
    >
      <SpeakerIcon />
      <Text variant='body-reg-sm'>{minutes} min</Text>
    </HStack>
  );
};
