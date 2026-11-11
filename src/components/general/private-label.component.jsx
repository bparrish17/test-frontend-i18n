import { HStack, Text, Tooltip } from '@chakra-ui/react';
import { SFLockIcon } from '@assets/icons';
import { useTranslation } from 'react-i18next';

export default function PrivateLabel({ dark = false }) {
  const { t } = useTranslation();

  return (
    <Tooltip label={t('privateLabel.privateMeetingsAreOnly')}>
      <HStack
        width='fit-content'
        padding='3px 6px'
        justifyContent='center'
        gap={1}
        borderRadius='lg'
        background={dark ? 'brandPrimary.primary' : 'surface.surface'}
        cursor='help'
      >
        <SFLockIcon
          boxSize={4}
          color={dark ? 'brandPrimary.onPrimary' : 'brandPrimary.primary'}
        />
        <Text
          textTransform='uppercase'
          variant='label-caps-600-md'
          color={dark ? 'brandPrimary.onPrimary' : 'brandPrimary.primary'}
        >
          {t('privateLabel.private')}
        </Text>
      </HStack>
    </Tooltip>
  );
}
