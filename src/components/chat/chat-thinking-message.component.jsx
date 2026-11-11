import { Box, HStack, Text, Stack } from '@chakra-ui/react';

import { SFBrainHeadProfile } from '@assets/icons';
import { MotionBox } from '@components/general/motion-box.component';
import ForaBadge from './chat-fora-badge.component';
import ActiveChainOfThoughtDisplay from './chat-cot-display.component';
import { useTranslation } from 'react-i18next';

const ThinkingMessage = () => {
  const { t } = useTranslation();

  return (
    <Stack>
      <ForaBadge />
      <Box
        bgColor='neutral.onPrimary'
        position='relative'
        p={4}
        borderRadius='lg'
        boxShadow='sm'
        maxW='100%'
        overflow='clip'
      >
        <MotionBox
          bgColor='brandPrimary.containerLow'
          position='absolute'
          top={0}
          left={0}
          w='full'
          h='full'
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            transition: { duration: 2, repeat: Infinity, repeatType: 'mirror' }
          }}
        />
        <Stack position='relative'>
          <HStack
            gap={1.5}
            color='brandPrimary.onContainer'
          >
            <SFBrainHeadProfile boxSize={4} />
            <Text variant='body-sm'>{t('chatThinkingMessage.foraIsThinking')}</Text>
          </HStack>
          <ActiveChainOfThoughtDisplay />
        </Stack>
      </Box>
    </Stack>
  );
};

export default ThinkingMessage;
