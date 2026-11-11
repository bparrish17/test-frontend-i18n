import React, { Fragment, Suspense } from 'react';
import { Flex, Heading } from '@chakra-ui/react';
import PulsePanelHeader from '@components/pulse/pp-header.component.jsx';
import PulseQuote from '@components/pulse/pulse-quote.component.jsx';
import PulsePill from '@components/pulse/pulse-pill.component.jsx';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import PulsePanelFooter from '@components/pulse/pp-footer.component.jsx';
import { uniqueId, upperFirst } from 'lodash-es';
import { useMaxTopics } from '@util/hooks/pulse.hooks.jsx';
import { lazyWithRetry } from '@util/helpers';

const WithSeeMore = lazyWithRetry(() =>
  import('react-insta-stories').then((module) => ({
    default: module.WithSeeMore
  }))
);

function TopicsPulsePanel({ panel }) {
  let { topicType } = panel;
  topicType = topicType || 'strategic';
  return {
    content: (props) => {
      const currTopics = useMaxTopics(panel, topicType);
      return (
        <Suspense>
          <WithSeeMore {...props}>
            <Flex
              bg='#EFF4F8'
              borderRadius={{ base: '0px', md: '10px' }}
              flexDir='column'
              justify='space-between'
              height='inherit'
              w='inherit'
              margin='30px 0px'
              padding='0px 30px'
            >
              <Flex flexDir='column'>
                <PulsePanelHeader
                  variant='primary'
                  panel={panel}
                />

                <Heading
                  variant='bolder-md'
                  color='#1353EC'
                >
                  {upperFirst(topicType)} Topics
                </Heading>

                <Flex
                  mt='36px'
                  gap='24px'
                  flexDirection='column'
                >
                  {currTopics.map((topic) => {
                    const noOfLines = currTopics.length === 1 ? 4 : undefined;
                    return (
                      <Fragment key={uniqueId()}>
                        <PulsePill
                          noOfLines={noOfLines}
                          variant='primary'
                          icon={<BsFillLightningChargeFill />}
                          text={topic.title}
                        />
                        <PulseQuote
                          textColor='#1D2330'
                          lineColor='brandTertiary.primary'
                          text={topic.details}
                        />
                      </Fragment>
                    );
                  })}
                </Flex>
              </Flex>

              <Flex justify='center'></Flex>
            </Flex>
          </WithSeeMore>
        </Suspense>
      );
    },
    seeMoreCollapsed: () => {
      const currTopics = useMaxTopics(panel, topicType);
      return (
        <PulsePanelFooter
          anchor='?topicSort=1|asc#insight-from-lenses'
          ctaText={`${upperFirst(topicType)} Topics`}
          countPath='source_data.topics.length'
          countLabel='Topics'
          variant='light'
          panel={{
            ...panel,
            source_data: {
              ...panel.source_data,
              topics: currTopics
            }
          }}
        />
      );
    },
    seeMore: () => <></>,
    duration: 5000
  };
}

export default TopicsPulsePanel;
