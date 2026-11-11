import { Button, Stack, Text } from '@chakra-ui/react';
import { SearchIconBold } from '@assets/icons';
import { useTranslation } from 'react-i18next';

export default function RecentSearches({ recentSearches, setInput, clearRecentSearches }) {
  const { t } = useTranslation();

  return (
    <Stack
      px={{ base: '30px', lg: 4 }}
      py={4}
      gap={3}
    >
      <Text
        fontSize='xs'
        textTransform='uppercase'
        fontWeight={600}
      >
        {t('recentSearches.recentSearches')}
      </Text>
      {recentSearches.map((search) => (
        <Button
          leftIcon={<SearchIconBold strokeWidth='12px' />}
          gap={2}
          key={search}
          onClick={() => setInput(search)}
          size='xs'
          borderRadius='xl'
          variant='ghost'
          w='fit-content'
          fontWeight={400}
        >
          {search}
        </Button>
      ))}
      <Button
        ml={-2}
        size='xs'
        borderRadius='xl'
        w='fit-content'
        onClick={clearRecentSearches}
        variant='ghost'
      >
        {t('recentSearches.clearAll')}
      </Button>
    </Stack>
  );
}
