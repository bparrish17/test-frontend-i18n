import React from 'react';
import { VStack, Text, SimpleGrid, Box, Icon, Flex, Image } from '@chakra-ui/react';
import {
  SFCircleDottedCircleIcon,
  SFLineChartIcon,
  InsightIcon,
  SFBookPagesOutlinedIcon
} from '@assets/icons';
import { ForaLogoWhite } from '@assets/images';
import { useTranslation } from 'react-i18next';

// Component can be used in both mobile and desktop layouts
const ChatSplashScreen = () => {
  const { t } = useTranslation();

  const features = [
    {
      icon: SFCircleDottedCircleIcon,
      title: t('chatSplashScreen.strategicAnalysis'),
      description: t('chatSplashScreen.reviewTheStrategicTopics')
    },
    {
      icon: SFLineChartIcon,
      title: t('chatSplashScreen.sentimentAnalysis'),
      description: t('chatSplashScreen.understandTheSentimentRegarding')
    },
    {
      icon: InsightIcon,
      title: t('chatSplashScreen.topicDeepDive'),
      description: t('chatSplashScreen.digDeeperIntoAn')
    },
    {
      icon: SFBookPagesOutlinedIcon,
      title: t('chatSplashScreen.transcriptDeepDive'),
      description: t('chatSplashScreen.reviewKeyQuotesDebates')
    }
  ];

  return (
    <VStack
      spacing={6}
      align='center'
      px={6}
      py={8}
      h='100%'
      maxH='calc(100vh - 140px)' // Account for header and input
      overflow='auto'
      style={{ scrollbarWidth: 'none' }}
    >
      {/* FORA Logo */}
      <Box
        bg='brandPrimary.primary'
        borderRadius='xl'
        p={2}
        width='64px'
        height='64px'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexShrink={0}
      >
        <Image
          h='78px'
          w='78px'
          src={ForaLogoWhite}
        />
      </Box>

      {/* Title Section */}
      <VStack
        spacing={2}
        flexShrink={0}
      >
        <Text
          fontSize='xl'
          fontWeight='semibold'
          textAlign='center'
        >
          {t('chatSplashScreen.whatWouldYouLike')}
        </Text>
        <Text
          color='light_material.600'
          fontSize='sm'
          textAlign='center'
        >
          {t('chatSplashScreen.hereAreSomeWays')}
        </Text>
      </VStack>

      {/* Feature Grid - Now using SimpleGrid with minChildWidth */}
      <SimpleGrid
        columns={{ base: 1 }}
        spacing={2}
        w='100%'
        maxW='600px'
        borderRadius='lg'
      >
        {features.map((feature) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </SimpleGrid>
    </VStack>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <Box
    bg='surface.surface'
    p={4}
    borderRadius='lg'
    // commenting out cursor / hover functionality til they actually work
    // cursor="pointer"
    // _hover={{ bg: 'blue.100' }}
    transition='background 0.2s'
    height='100%'
  >
    <Flex gap={3}>
      <Icon
        as={icon}
        boxSize={5}
        color='brandPrimary.primary'
        flexShrink={0}
      />
      <VStack
        align='start'
        spacing={1}
      >
        <Text
          color='brandPrimary.onPrimaryFixed'
          fontWeight='medium'
          fontSize='md'
        >
          {title}
        </Text>
        <Text
          fontSize='sm'
          color='surface.onSurfaceVariant'
          lineHeight='short'
        >
          {description}
        </Text>
      </VStack>
    </Flex>
  </Box>
);

export default ChatSplashScreen;
