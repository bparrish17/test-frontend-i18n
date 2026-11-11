import { Text, HStack, Spacer, Stack, Button } from '@chakra-ui/react';

import { useUserStore } from '@store/app.store';
import { useFeedPageFilters } from '@util/hooks';

import FeedFilterAccordion from '@components/feed/feed-filter-accordion.component';
import FeedFilterTabs from '@components/feed/feed-filter-tabs.component';
import { useTranslation } from 'react-i18next';

export default function FeedFilterMobile({ setIsSelectingFilters, tab }) {
  const { t } = useTranslation();

  const { hasActiveFilters, handleResetFilters } = useFeedPageFilters();
  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;

  const handleViewResultsClicked = () => {
    setIsSelectingFilters(false);
  };

  return (
    <Stack p={2}>
      <HStack>
        <Text
          variant='content-section-header'
          p={2}
          fontSize='md'
        >
          {t('feedFilterMobile.filterOptions')}
        </Text>
        {hasActiveFilters && (
          <>
            <Spacer />
            <Text
              fontSize='sm'
              color='brandPrimary.primary'
              onClick={handleResetFilters}
            >
              {t('feedFilterMobile.clearFilters')}
            </Text>
          </>
        )}
      </HStack>
      {!isGuest && <FeedFilterTabs tab={tab} />}
      <FeedFilterAccordion tab={tab} />
      {hasActiveFilters && (
        <Button
          position='fixed'
          bottom={4}
          left='50%'
          w='95%'
          transform='translateX(-50%)'
          variant='reskinPrimary'
          onClick={handleViewResultsClicked}
        >
          {t('feedFilterMobile.viewResults')}
        </Button>
      )}
    </Stack>
  );
}
