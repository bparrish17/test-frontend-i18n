import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Fade } from '@chakra-ui/react';
import { SFChatBubblesIconOutlined as ChatIcon, ChevronUpIcon } from '@assets/icons';
import { useBreakpoints } from '@util/hooks';
import { useChatStore } from '@store/chat/chat.store.jsx';
import { useTranslation } from 'react-i18next';

export const CollapsedChatView = () => {
  const { isMobile } = useBreakpoints();
  if (isMobile) {
    return <CollapsedChatViewMobile />;
  } else {
    return <CollapsedChatViewDesktop />;
  }
};

export const CollapsedChatViewDesktop = () => {
  const { t } = useTranslation();

  const conversation = useChatStore((state) => state.conversation);
  const showFloatingChat = useChatStore((state) => state.showFloatingChat);
  const meeting = useChatStore((state) => state.initiatorData);

  return (
    <Fade in>
      <Box
        w='450px'
        bg='brandPrimary.primaryDim'
        borderTopRadius={12}
        boxShadow='lg'
        p={4}
        color='white'
        onClick={() => showFloatingChat()}
        cursor='pointer'
      >
        <HStack
          align='center'
          justifyContent='space-between'
        >
          <HStack
            spacing={3}
            align='center'
          >
            <Box
              bg='brandPrimary.primaryDim'
              p={2}
              borderRadius='md'
            >
              <ChatIcon color='white' />
            </Box>
            <VStack
              alignItems='flex-start'
              spacing={0}
            >
              <HStack>
                <Text fontWeight='bold'>{t('chatCollapsedViews.askFora')}</Text>
                {conversation?.messages?.length && (
                  <Text fontWeight='light'>({conversation?.messages?.length / 2})</Text>
                )}
              </HStack>
              <HStack>
                <Text
                  fontSize='sm'
                  color='whiteAlpha.800'
                >
                  {meeting?.title}
                </Text>
              </HStack>
            </VStack>
          </HStack>
          <ChevronUpIcon fontSize={28} />
        </HStack>
      </Box>
    </Fade>
  );
};

export const CollapsedChatViewMobile = () => {
  const { t } = useTranslation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const conversation = useChatStore((state) => state.conversation);
  const showFloatingChat = useChatStore((state) => state.showFloatingChat);

  useEffect(() => {
    const checkModalOpen = () => {
      const modal = document.querySelector('.chakra-modal__content');
      setIsModalOpen(!!modal);
    };

    checkModalOpen();
    const observer = new MutationObserver(checkModalOpen);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  if (isModalOpen) {
    return null;
  }

  return (
    <Fade in>
      <Box
        position='fixed'
        bottom={4}
        left='50%'
        transform='translateX(-50%)'
        zIndex='modal'
      >
        <Box
          bg='brandPrimary.primaryDim'
          color='white'
          boxShadow='lg'
          borderRadius='full'
          px={3}
          py={2}
          cursor='pointer'
          onClick={() => showFloatingChat()}
        >
          <HStack spacing={2}>
            <Box bg='brandPrimary.primaryDim'>
              <ChatIcon
                color='white'
                w='20px'
                h='20px'
              />
            </Box>
            <Text fontWeight='medium'>{t('chatCollapsedViews.askFora')}</Text>
            {conversation?.messages?.length ? <Text>{conversation?.messages.length / 2}</Text> : ''}
          </HStack>
        </Box>
      </Box>
    </Fade>
  );
};

export default CollapsedChatView;
