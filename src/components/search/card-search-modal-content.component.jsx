import {
  Box,
  VStack,
  HStack,
  Text,
  IconButton,
  Stack,
  Button,
  Collapse,
  Spacer,
  Spinner
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { uniq, uniqueId } from 'lodash-es';
import MessageContent from '@components/chat/chat-message-content.component';

import { CloseIcon, CopyIcon, SFBrainHeadProfile } from '@assets/icons';
import { useCopyToClipboard } from '@util/hooks';
import { useChatStore } from '@store/chat/chat.store.jsx';
import ActiveChainOfThoughtDisplay from '@components/chat/chat-cot-display.component';
import ForaBadge from '@components/chat/chat-fora-badge.component';
import ThinkingMessage from '@components/chat/chat-thinking-message.component';
import ReskinSummaryCard from '@components/general/card/reskin-summary-card/reskin-summary-card.component';
import { useCardsCleanBody } from '@services/query-services/cards.query-service';
import { useTranslation } from 'react-i18next';

const CardSearchModalContent = ({ scrollerRef, customSplashScreen, cardIds, setCardIds }) => {
  const { t } = useTranslation();

  const copyToClipboard = useCopyToClipboard();
  const [showThinking, setShowThinking] = useState(false);

  const displayMessages = useChatStore((state) => state.displayMessages);
  const isThinking = useChatStore((state) => state.isThinking);
  const isErrorState = useChatStore((state) => state.isErrorState);
  const setIsErrorState = useChatStore((state) => state.setIsErrorState);
  const activeChainOfThought = useChatStore((state) => state.activeChainOfThought);

  const { data: cards, isLoading } = useCardsCleanBody({
    ids: cardIds,
    sort: 'created_at',
    asc: false
  });

  const removeCard = (cardId) => {
    const updatedCardIds = cardIds.filter((id) => id !== cardId);
    setCardIds(updatedCardIds);
  };

  useEffect(() => {
    let newCardIds = [];
    if (displayMessages?.length) {
      for (const message of displayMessages) {
        if (message.role === 'assistant' && message.artifact) {
          const parsed = JSON.parse(message.artifact.content);
          newCardIds = [...newCardIds, ...parsed];
        }
      }
      setCardIds(uniq(newCardIds));
    }
  }, [displayMessages]);

  return (
    <VStack
      flex={1}
      overflowY='auto'
      spacing={4}
      p={3}
      align='stretch'
      bg='surface.containerLow'
      height='100%'
      width='100%'
      // pb={isMobile ? 100 : 3}
      pb='0'
      style={{ scrollbarWidth: 'none' }}
      maxWidth='720px'
    >
      {!isThinking && displayMessages && !displayMessages.length && customSplashScreen}
      {displayMessages?.map((message, index) => {
        if (typeof message === 'string') message = JSON.parse(message);
        const content = message?.value;
        const isLastMessage = index === displayMessages.length - 1;
        return (
          <Box key={uniqueId(message?.role)}>
            {message?.role === 'user' ? (
              <Box
                bg='surface.containerHigh'
                p={3}
                borderRadius='lg'
                maxW='90%'
                ml='auto'
                mr={0}
                ref={index === displayMessages.length - 2 ? scrollerRef : null}
              >
                <MessageContent content={content} />
              </Box>
            ) : (
              <Stack>
                <ForaBadge />
                <Box
                  bgColor='neutral.onPrimary'
                  p={4}
                  borderRadius='lg'
                  boxShadow='sm'
                  maxW='100%'
                >
                  <MessageContent
                    content={content}
                    animateText
                  />
                  <HStack spacing={2}>
                    {isLastMessage && !isThinking && activeChainOfThought?.length > 0 && (
                      <Button
                        size='xs'
                        colorScheme='neutral'
                        variant='ghost'
                        leftIcon={showThinking ? <CloseIcon /> : <SFBrainHeadProfile boxSize={4} />}
                        onClick={() => setShowThinking(!showThinking)}
                      >
                        <Text variant='body-sm'>
                          {showThinking
                            ? t('cardSearchModalContent.hide')
                            : t('cardSearchModalContent.show')}{' '}
                          thinking
                        </Text>
                      </Button>
                    )}
                    <Spacer />
                    <IconButton
                      icon={<CopyIcon />}
                      variant='ghost'
                      size='sm'
                      aria-label={t('cardSearchModalContent.copyAriaLabel')}
                      color='surface.onSurfaceVariant'
                      onClick={() => copyToClipboard(content)}
                      hidden={!!message?.hideCopyButton}
                    />
                  </HStack>
                  <Collapse in={showThinking && isLastMessage}>
                    <ActiveChainOfThoughtDisplay />
                  </Collapse>
                </Box>
                {message?.artifact && (
                  <HStack
                    bg='white'
                    p={4}
                    borderRadius='lg'
                    boxShadow='sm'
                    maxW='100%'
                    justify='flex-start'
                    cursor='pointer'
                  >
                    <VStack
                      align='flex-start'
                      spacing={0}
                      px={4}
                    >
                      {isLoading && <Spinner size='xs' />}
                      {!isLoading && cards?.length && (
                        <VStack
                          gap={2}
                          align='flex-start'
                        >
                          {cards.map((card) => (
                            <ReskinSummaryCard
                              key={card.id}
                              card={card}
                              showBody={false}
                              showFooter={false}
                              navigateOnClick={false}
                              isExplorerRightRailCard
                              removeFn={() => removeCard(card.id)}
                            />
                          ))}
                        </VStack>
                      )}
                    </VStack>
                  </HStack>
                )}
              </Stack>
            )}
          </Box>
        );
      })}
      {isErrorState && (
        <Box
          bg='white'
          p={4}
          borderRadius='lg'
          borderColor='critical.primary'
          boxShadow='sm'
          maxW='100%'
        >
          <MessageContent content={t('cardSearchModalContent.iSeemToHave')} />
          <button onClick={() => setIsErrorState(false)}>
            {t('cardSearchModalContent.dismiss')}
          </button>
        </Box>
      )}
      {isThinking && <ThinkingMessage />}
    </VStack>
  );
};

export default CardSearchModalContent;
