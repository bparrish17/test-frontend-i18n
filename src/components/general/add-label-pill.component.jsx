import { Box, Flex, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

export default function AddLabelPill() {
  const { t } = useTranslation();

  return (
    <Flex
      align='center'
      height={7}
    >
      <Box
        width={0}
        height={0}
        borderTop='12px solid transparent'
        borderBottom='12px solid transparent'
        borderRight='12px solid'
        borderRightColor='brandSecondary.primary'
      />
      <Flex
        alignItems='center'
        h={6}
        pl={2}
        pr={2.5}
        bg='brandSecondary.primary'
        color='brandSecondary.onPrimary'
        borderTopRightRadius='lg'
        borderBottomRightRadius='lg'
      >
        <Text
          fontSize='xs'
          fontWeight={500}
        >
          {t('addLabelPill.addALabel')}
        </Text>
      </Flex>
    </Flex>
  );
}
