import { Flex, Heading, OrderedList, ListItem, Text } from '@chakra-ui/react';
import PulsePanelHeader from '@components/pulse/pp-header.component.jsx';
import PulsePanelFooter from '@components/pulse/pp-footer.component.jsx';
import { uniqueId } from 'lodash-es';
import React, { Suspense } from 'react';
import { useMaxFollowups } from '@util/hooks/pulse.hooks.jsx';
const WithSeeMore = React.lazy(() =>
  import('react-insta-stories').then((module) => ({
    default: module.WithSeeMore
  }))
);

function FollowUpsPulsePanel({ panel }) {
  return {
    content: (props) => {
      const { bot } = panel;
      const currFollowups = useMaxFollowups(bot);
      const numRemainingFollowups = bot?.followups?.length - currFollowups.length;

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
                  color='brandPrimary.onPrimary'
                >
                  Followups
                </Heading>
              </Flex>

              <Flex flexDir='column'>
                <OrderedList variant='numbered'>
                  {currFollowups.map((followup) => (
                    <ListItem key={uniqueId()}>
                      <Heading
                        color='brandPrimary.onPrimary'
                        variant='lighter-md'
                      >
                        {followup.value}
                      </Heading>
                    </ListItem>
                  ))}
                </OrderedList>
                {numRemainingFollowups > 0 && (
                  <Text
                    variant='body-reg'
                    ml='69px'
                    mt={2}
                    color='white'
                  >
                    +{numRemainingFollowups} more
                  </Text>
                )}
              </Flex>

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
      const { bot } = panel;
      return (
        <PulsePanelFooter
          anchor='follow-ups'
          ctaText='Your Followups'
          countPath='followups.length'
          countLabel='Followups'
          variant='dark'
          panel={{
            ...panel,
            followups: bot?.followups
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

export default FollowUpsPulsePanel;
