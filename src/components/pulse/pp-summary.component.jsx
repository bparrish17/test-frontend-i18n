import React, { Suspense } from 'react';
import { Text, Flex, Box } from '@chakra-ui/react';
import PulsePanelHeader from '@components/pulse/pp-header.component.jsx';
import PulsePanelFooter from '@components/pulse/pp-footer.component.jsx';
import PulseQuote from '@components/pulse/pulse-quote.component.jsx';
import { lazyWithRetry } from '@util/helpers';
// import { getRandomPulseImage } from '@util/helpers/bootstrap.helpers.js';

const sharedStyles = {
  position: 'absolute',
  h: 'full',
  w: 'full',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  borderRadius: '10px'
};

const WithSeeMore = lazyWithRetry(() =>
  import('react-insta-stories').then((module) => ({
    default: module.WithSeeMore
  }))
);

function SummaryPulsePanel({ panel }) {
  // const randomImage = getRandomPulseImage();
  return {
    content: (props) => {
      return (
        <Suspense>
          <WithSeeMore {...props}>
            <Flex
              bg='transparent'
              position='relative'
              px={6}
              borderRadius={{ base: '0px', md: '10px' }}
              flexDir='column'
              h='full'
              w='full'
              bgGradient={
                panel?.source_data?.high_priority
                  ? 'linear(to-t, #01016E 0%, #CC3D4D 100%)'
                  : 'linear(to-t, #01016E 0%, #2967ea 100%)'
              }
            >
              {/* todo: put image here for background */}
              {/* <Image */}
              {/*   src={randomImage.src} */}
              {/*   objectFit="cover" */}
              {/*   // opacity={0.5} */}
              {/*   zIndex={0} */}
              {/*   {...sharedStyles} */}
              {/* /> */}
              <Box
                bg='rgba(41, 103, 234, 0.5)'
                zIndex={1}
                {...sharedStyles}
              />
              <PulsePanelHeader
                variant='transparent'
                panel={panel}
              />
              <Flex
                h='full'
                flexDir='column'
                justifyContent='center'
              >
                <Flex
                  flexDir='column'
                  gap='36px'
                  zIndex={2}
                >
                  <Text
                    zIndex={2}
                    color='#FEFFFF'
                    variant='display-sm'
                  >
                    {panel.headline}
                  </Text>

                  <PulseQuote
                    noOfLines={10}
                    lineColor='#FEFFFF'
                    text={panel.sections.map((section) => section.title).join('. ')}
                  />
                </Flex>
              </Flex>
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
          anchor='personal-summary'
          ctaText='Your Personal Summary'
          countPath='sections.length'
          countLabel='Items'
          variant='dark'
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

export default SummaryPulsePanel;
