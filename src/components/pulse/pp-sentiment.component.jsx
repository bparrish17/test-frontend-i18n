import React, { Suspense } from 'react';
import { useMediaQuery, Image, Flex, Heading } from '@chakra-ui/react';
import PulsePanelHeader from '@components/pulse/pp-header.component.jsx';
import PulseQuote from '@components/pulse/pulse-quote.component.jsx';
import { getHighestAndLowestSentiment } from '@util/helpers/pulse.helpers.js';
import PulsePill from '@components/pulse/pulse-pill.component.jsx';
import { BsFillLightningChargeFill } from 'react-icons/bs';
import { sentimentGraph } from '@assets/images/index.js';
import PulsePanelFooter from '@components/pulse/pp-footer.component.jsx';
import { lazyWithRetry } from '@util/helpers';
const WithSeeMore = lazyWithRetry(() =>
  import('react-insta-stories').then((module) => ({
    default: module.WithSeeMore
  }))
);

function SentimentPulsePanel({ panel }) {
  return {
    content: (props) => {
      let { highest, lowest } = getHighestAndLowestSentiment(panel.source_data.topics);
      highest = highest || 'No Sentiment Found';
      lowest = lowest || 'No Sentiment Found';

      const [isSmallScreen] = useMediaQuery('(max-height: 720px)');
      const [isMediumScreen] = useMediaQuery('(min-height: 721px) and (max-height: 900px)');
      const [isLargeScreen] = useMediaQuery('(min-height: 901px)');

      let maxH;
      let noOfLines;
      if (isSmallScreen) {
        maxH = '20vh';
        noOfLines = 1;
      } else if (isMediumScreen) {
        maxH = '30vh';
        noOfLines = 2;
      } else if (isLargeScreen) {
        maxH = '35vh';
        noOfLines = 3;
      } else {
        maxH = '30vh';
        noOfLines = 2;
      }
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
                  Sentiment Summary
                </Heading>
              </Flex>

              <Flex
                height='100%'
                mt='12px'
                gap='24px'
                flexDirection='column'
              >
                <PulseQuote
                  textColor='#1D2330'
                  lineColor='#00A376'
                  text={highest.details}
                  noOfLines={noOfLines}
                />

                <PulsePill
                  variant='positive'
                  icon={<BsFillLightningChargeFill />}
                  text={highest.title}
                />

                <Flex width='100%'>
                  <Image
                    objectFit='fill'
                    maxH={maxH}
                    w='100%'
                    src={sentimentGraph}
                    alt='Sentiment Graph'
                  />
                </Flex>

                <Flex justify='flex-end'>
                  <PulsePill
                    variant='negative'
                    icon={<BsFillLightningChargeFill />}
                    text={lowest.title}
                  />
                </Flex>

                <PulseQuote
                  align='right'
                  textColor='#1D2330'
                  lineColor='#F04755'
                  text={lowest.details}
                  noOfLines={noOfLines}
                />
              </Flex>

              <Flex
                justify='center'
                // marginTop="auto"
              ></Flex>
            </Flex>
          </WithSeeMore>
        </Suspense>
      );
    },
    seeMoreCollapsed: () => {
      // to use built-in see more feature, utilize the onClick below
      // onClick={() => toggleMore(true)}
      // {toggleMore, action}
      return (
        <PulsePanelFooter
          anchor='?topicSort=2|desc#insight-from-lenses'
          ctaText='Topics by Sentiment'
          countPath='source_data.topics.length'
          countLabel='Topics'
          variant='light'
          panel={panel}
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

export default SentimentPulsePanel;
