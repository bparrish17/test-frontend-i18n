import React, { useEffect, useState } from 'react';
import { VStack, Text, Box, Image } from '@chakra-ui/react';
import { ForaLogoWhite } from '@assets/images';
import { useExplorerPageStore } from '@store/app.store';
import { getCardExplorerChatRecommendedPrompts } from '@services/query-services/lambda.query-service';
import { useChatStore } from '@store/chat/chat.store';
import { useTranslation } from 'react-i18next';

const ChatExplorerSplashScreen = () => {
  const { t } = useTranslation();

  const sources = useExplorerPageStore((state) => state?.sources);
  const conversation = useChatStore((state) => state.conversation);
  const [recommendedPrompts, setRecommendedPrompts] = useState([
    'What surprising relationships do you notice between these summaries?'
  ]);

  useEffect(() => {
    async function getRecommendedPrompts() {
      const recommendedPrompts = await getCardExplorerChatRecommendedPrompts({ sources });
      setRecommendedPrompts(recommendedPrompts);
    }
    if (sources?.length > 0 && !conversation?.messages?.length) {
      getRecommendedPrompts();
    }
  }, [sources, conversation]);

  return (
    <VStack
      spacing={8}
      align='center'
      justify='center'
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
        p={4}
        width='80px'
        height='80px'
        display='flex'
        alignItems='center'
        justifyContent='center'
        flexShrink={0}
      >
        <Image
          h='40px'
          w='40px'
          src={ForaLogoWhite}
        />
      </Box>

      {/* Main Content */}
      <VStack
        spacing={6}
        align='center'
        textAlign='center'
        maxW='500px'
      >
        {/* Main Heading */}
        <Text
          fontSize={{ base: '2xl', md: '3xl' }}
          fontWeight='bold'
          color='brandPrimary.primary'
          lineHeight='1.2'
        >
          {sources?.length > 0
            ? t('explorerSplash.exploreYourSummaries')
            : t('explorerSplash.welcomeToTheCard')}
        </Text>
        {/* Subtitle */}
        <Text
          fontSize='lg'
          color='surface.onSurfaceVariant'
          lineHeight='1.5'
        >
          {sources?.length > 0
            ? `You have ${sources.length} summaries ready to explore.`
            : t('explorerSplash.startByAddingSome')}
        </Text>
        $
        {recommendedPrompts.length > 0 ? (
          <Text
            fontSize='md'
            fontStyle='italic'
          >{`Try asking: ${recommendedPrompts[0]}`}</Text>
        ) : (
          ''
        )}
      </VStack>
    </VStack>
  );
};

export default ChatExplorerSplashScreen;
