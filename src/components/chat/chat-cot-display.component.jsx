import { Box, Text, Stack } from '@chakra-ui/react';
import { useChatStore } from '@store/chat/chat.store';
import { THINKING_STEP_DISPLAY_MAP } from '@util/constants';

const ActiveChainOfThoughtDisplay = () => {
  const activeChainOfThought = useChatStore((state) => state.activeChainOfThought);

  if (!activeChainOfThought.length) return null;

  return (
    <Stack
      borderRadius='lg'
      gap={5}
    >
      {activeChainOfThought.map((thoughtData) => {
        return (
          <Box
            display='inline'
            key={thoughtData.name}
          >
            <Text
              as='span'
              variant='label-caps-600-lg'
              textTransform='uppercase'
              color='brandPrimary.primary'
            >
              {THINKING_STEP_DISPLAY_MAP[thoughtData.name]}
            </Text>
            <Text
              as='span'
              variant='body-sm'
              ml={2}
            >
              {thoughtData.content}
            </Text>
          </Box>
        );
      })}
    </Stack>
  );
};

export default ActiveChainOfThoughtDisplay;
