import { Text, HStack, Stack, Spacer } from '@chakra-ui/react';

import { useUserStore } from '@store/app.store';
import { useFeedPageFilters } from '@util/hooks';
import FeedFilterAccordion from '@components/feed/feed-filter-accordion.component';
import FeedFilterTabs from '@components/feed/feed-filter-tabs.component';
import { useTranslation } from 'react-i18next';

export default function FeedFilterSidebar({ tab }) {
  const { t } = useTranslation();

  const { hasActiveFilters, handleResetFilters } = useFeedPageFilters();
  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;

  return (
    <Stack
      p={11}
      gap={6}
    >
      <HStack>
        <Text variant='content-section-header'>{t('feedFilterSidebar.filterBy')}</Text>
        {hasActiveFilters && (
          <>
            <Spacer />
            <Text
              fontSize='sm'
              color='brandPrimary.primary'
              onClick={handleResetFilters}
              cursor='pointer'
              _hover={{ bgColor: 'none' }}
            >
              {t('feedFilterSidebar.clearFilters')}
            </Text>
          </>
        )}
      </HStack>
      {!isGuest && <FeedFilterTabs tab={tab} />}
      <FeedFilterAccordion tab={tab} />
    </Stack>
  );
}
