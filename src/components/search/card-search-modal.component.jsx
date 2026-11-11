import {
  Box,
  VStack,
  HStack,
  Text,
  ModalCloseButton,
  useDisclosure,
  Button
} from '@chakra-ui/react';
import { useState, useRef, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

// import { SFMagnifyingGlassIcon } from '@assets/icons';
import { useChatStore } from '@store/chat/chat.store';
import { useUserStore } from '@store/app.store';
import { CardSearchChatProvider } from '@store/chat/card-search-chat.store';

import StyledModal from '@components/general/modals/styled-modal.component';
import ChatInputSection from '@components/chat/chat-input.component';
import { usePusherChannel, usePusherEvent } from '@util/hooks';
import { getConversationById } from '@services/query-services/conversations.query-service';
import CardSearchModalContent from './card-search-modal-content.component';
import { useTranslation } from 'react-i18next';

const CardSearchModalWrapped = ({ submitFn }) => {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const inputRef = useRef(null);

  const setConversation = useChatStore((state) => state.setConversation);
  const setDisplayMessages = useChatStore((state) => state.setDisplayMessages);
  const inputValue = useChatStore((state) => state.inputValue);
  const setInputValue = useChatStore((state) => state.setInputValue);
  const setInputRef = useChatStore((state) => state.setInputRef);
  const isThinking = useChatStore((state) => state.isThinking);
  const send = useChatStore((state) => state.send);
  const appendThoughtToChain = useChatStore((state) => state.appendThoughtToChain);
  const setShowReasoningPanel = useChatStore((state) => state.setShowReasoningPanel);
  const setIsThinking = useChatStore((state) => state.setIsThinking);

  const [conversationId, setConversationId] = useState(null);
  const [cardIds, setCardIds] = useState([]);

  const { channel } = usePusherChannel(user?.id);
  usePusherEvent(channel, 'card-search-chat-CoT', (data) => {
    // if (data.meetingId === meeting.id) {
    appendThoughtToChain(data.thoughtData);
    setShowReasoningPanel(true);
    // }
    queryClient.invalidateQueries({ queryKey: ['conversations', 'type-card-search'] });
  });

  usePusherEvent(channel, 'refetch-modal-conversation', ({ conversationId }) => {
    if (conversationId && conversationId !== 'dummy') {
      setConversationId(conversationId);
    }
    queryClient.invalidateQueries({ queryKey: ['conversations', 'type-card-search'] });
    setIsThinking(false);
  });

  useEffect(() => {
    async function fetchConversation() {
      const conversationData = await getConversationById(conversationId);
      if (conversationData) {
        setConversation(conversationData);
        setDisplayMessages(conversationData.messages || []);
      }
    }
    if (conversationId) {
      fetchConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    setInputRef(inputRef);
  }, [setInputRef]);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue?.trim() || isThinking) return;

    const messageObj = {
      role: 'user',
      value: inputValue.trim()
    };

    const assistantResponse = await send(messageObj, queryClient);
    if (assistantResponse?.conversationId) {
      setConversationId(assistantResponse?.conversationId);
    }
    setInputValue('');
  };

  return (
    <Box
      h='600px'
      w='full'
      display='flex'
      flexDirection='column'
    >
      <Box
        flex={1}
        overflow='hidden'
        display='flex'
        justifyContent='center'
      >
        <CardSearchModalContent
          customSplashScreen={<CustomSplashScreen />}
          cardIds={cardIds}
          setCardIds={setCardIds}
        />
      </Box>
      <ChatInputSection
        handleSubmit={handleSubmit}
        inputValue={inputValue}
        setInputValue={setInputValue}
        isThinking={isThinking}
        inputRef={inputRef}
        disabled={false}
      />
      <HStack p={5}>
        <Button
          variant='reskinPrimary'
          onClick={() => submitFn(cardIds)}
          isDisabled={!cardIds.length}
        >
          Add {cardIds.length || ''} Summaries to Selection
        </Button>
        <Button variant='reskinSecondary'>{t('cardSearchModal.clear')}</Button>
      </HStack>
    </Box>
  );
};

export default function CardSearchModal({ disclosure, submitFn }) {
  const { t } = useTranslation();

  const defaultDisclosure = useDisclosure();
  const modalDisclosure = disclosure || defaultDisclosure;

  const handleClose = () => {
    modalDisclosure.onClose();
  };

  return (
    <StyledModal
      title={t('cardSearchModal.searchMeetingSummaries')}
      disclosure={modalDisclosure}
      modalProps={{
        scrollBehavior: 'inside',
        blockScrollOnMount: false,
        size: 'xl'
      }}
      modalContentProps={{
        maxH: 'calc(100vh - 48px)',
        w: { base: '90vw', md: '700px' },
        h: { base: '80vh', md: '700px' }
      }}
      modalBodyProps={{
        p: 0,
        overflow: 'hidden'
      }}
      customHeader={
        <HStack
          color='brandPrimary.onPrimary'
          bgColor='brandPrimary.primary'
          py={4}
          px={{ base: 6, sm: 4 }}
        >
          <Text fontWeight={500}>{t('cardSearchModal.searchMeetingSummaries')}</Text>
          <ModalCloseButton />
        </HStack>
      }
    >
      <CardSearchChatProvider closeFn={handleClose}>
        <CardSearchModalWrapped
          submitFn={(cardIds) => {
            submitFn(cardIds);
            handleClose();
          }}
        />
      </CardSearchChatProvider>
    </StyledModal>
  );
}

function CustomSplashScreen() {
  const { t } = useTranslation();

  return (
    <VStack
      spacing={6}
      justify='center'
      align='center'
      h='300px'
      textAlign='center'
      color='surface.onSurfaceVariant'
    >
      <VStack spacing={2}>
        <Text
          fontSize='lg'
          fontWeight='600'
          color='surface.onSurface'
        >
          {t('cardSearchModal.searchMeetingSummaries')}
        </Text>
        <Text fontSize='sm'>{t('cardSearchModal.askMeToHelp')}</Text>
      </VStack>
    </VStack>
  );
}
