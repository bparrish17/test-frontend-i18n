import { SFExclamationMarkCircleFilled } from '@assets/icons';
import { Icon, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function HighPriorityExplanation({ card, ...props }) {
  const { t } = useTranslation();

  return (
    <Stack
      p={3}
      flexDir='row'
      bgColor='brandTertiary.containerLow'
      data-testid='high-priority-explanation'
      {...props}
    >
      <Icon
        as={SFExclamationMarkCircleFilled}
        color='brandTertiary.primary'
        boxSize={4}
        mr={1}
      />
      <Stack>
        <Text
          fontSize='xs'
          variant='content-section-header'
          color='brandTertiary.primary'
        >
          {t('highPriorityExplanation.highPriority')}
        </Text>
        <Text
          fontSize='sm'
          color='surface.onSurfaceVariant'
        >
          {card.high_priority_explanation}
        </Text>
      </Stack>
    </Stack>
  );
}
