import { Text, HStack, Icon } from '@chakra-ui/react';

import { QuestionIconBold, ArrowUpRightIcon } from '@assets/icons';
import { NOTION_GLOBAL_SEARCH_URL } from '@util/constants';
import { useTranslation } from 'react-i18next';

export default function LearnMore() {
  const { t } = useTranslation();

  return (
    <HStack
      gap={{ base: 2, lg: 3 }}
      py={{ base: '5px', lg: 0 }}
      fontSize='sm'
      as='a'
      href={NOTION_GLOBAL_SEARCH_URL}
      target='_blank'
      rel='noreferrer'
      _hover={{ textDecor: 'underline' }}
    >
      <Icon
        as={QuestionIconBold}
        boxSize={4}
        color='surface.outline'
      />
      <Text
        as='span'
        color='surface.onSurface'
      >
        {t('globalSearchLearnMore.learnMoreAboutSearching')}
      </Text>
      <Icon
        as={ArrowUpRightIcon}
        boxSize={4}
        color='surface.outline'
      />
    </HStack>
  );
}
