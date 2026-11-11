import {
  Spinner,
  InputGroup,
  InputRightElement,
  Textarea,
  Text,
  Box,
  Button
} from '@chakra-ui/react';
import { useChatStore } from '@store/chat/chat.store';
import { useStyledToast } from '@util/hooks';

import { FaArrowUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
const ChatInputSection = ({
  handleSubmit,
  inputValue,
  setInputValue,
  isThinking,
  inputRef,
  disabled
}) => {
  const { t } = useTranslation();

  const conversation = useChatStore((state) => state.conversation);
  return (
    <form onSubmit={handleSubmit}>
      {conversation?.messages?.length >= 8 && <ClearChatPopup />}
      <InputGroup
        p={4}
        bg='surface.containerLow'
      >
        <Textarea
          placeholder={t('chatInput.messageForaPlaceholder')}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          size='md'
          bg='white'
          borderRadius='md'
          pr='60px'
          _focus={{
            borderColor: 'brandPrimary.primaryDim',
            boxShadow: 'none'
          }}
          disabled={isThinking || disabled}
          ref={inputRef}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (!e.shiftKey) {
                e.preventDefault();
                // Call your form submission function here
                e.target.form.requestSubmit();
              }
            }
          }}
          rows='2'
        />
        <InputRightElement
          mt='25px'
          mr='25px'
        >
          {isThinking ? (
            <Spinner size='xs' />
          ) : (
            <Box
              display='flex'
              alignItems='center'
              justifyContent='center'
              w='32px'
              h='32px'
              bg={inputValue?.length ? 'blue.500' : 'gray.300'}
              borderRadius='md'
              cursor='pointer'
              onClick={handleSubmit}
              transition='background-color 0.2s'
              _hover={{
                bg: inputValue?.length ? 'blue.600' : 'gray.400'
              }}
            >
              <FaArrowUp
                color='white'
                size='14px'
              />
            </Box>
          )}
        </InputRightElement>
      </InputGroup>
    </form>
  );
};

const ClearChatPopup = () => {
  const { t } = useTranslation();

  const clearChatFunction = useChatStore((state) => state.clearChat);
  const toast = useStyledToast();
  return (
    <Box
      display='flex'
      justifyContent='center'
      mb={-2}
      position='relative'
      zIndex={1401}
    >
      <Box
        bgColor='caution.container'
        color='caution.onSurface'
        display='flex'
        w='90%'
        p={3}
        justifyContent='space-between'
      >
        <Text fontSize='14px'>{t('chatInput.slowClearTheChat')}</Text>
        <Button
          h={6}
          fontSize='xs'
          color='caution.onSurface'
          bgColor='caution.container'
          _hover={{
            bgColor: 'caution.containerHigh'
          }}
          onClick={() => clearChatFunction(toast)}
        >
          {t('chatInput.clearChat')}
        </Button>
      </Box>
    </Box>
  );
};

export default ChatInputSection;
