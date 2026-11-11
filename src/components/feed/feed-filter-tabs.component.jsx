import { memo, useMemo } from 'react';
import { Tabs, TabList, Tab, useMediaQuery } from '@chakra-ui/react';

import StyledSelect from '@components/general/styled-select.component';
import { useUserStore } from '@store/app.store';
import { useFeedPageFilters } from '@util/hooks';

const tabProps = {
  borderRadius: 'xl',
  px: 4,
  py: 3,
  fontWeight: 500,
  _selected: { bg: 'brandPrimary.primary', color: 'brandPrimary.onPrimary' },
  whiteSpace: 'nowrap',
  fontSize: 'xs'
};

const TAB_OPTIONS = [
  { label: 'All Summaries', value: 0, test_id: 'all-summaries-tab' },
  { label: 'Your Summaries', value: 1, test_id: 'your-summaries-tab' },
  { label: 'Shared Summaries', value: 2, test_id: 'shared-summaries-tab' }
];

const FeedFilterTabs = () => {
  const user = useUserStore((state) => state.user);
  const { filters, handleFilterChange } = useFeedPageFilters();
  const [isSmallScreen] = useMediaQuery('(max-width: 1400px)');

  const activeIndex = useMemo(() => {
    if (filters?.sharedFilter) return 2;

    return filters?.participantId ? 1 : 0;
  }, [filters?.participantId, filters?.sharedFilter]);

  const handleTabChange = (index) => {
    if (index === 0) {
      handleFilterChange('sharedFilter', null);
      handleFilterChange('participantId', null);
    } else if (index === 1) {
      handleFilterChange('sharedFilter', null);
      handleFilterChange('participantId', user?.id);
    } else {
      handleFilterChange('participantId', null);
      handleFilterChange('sharedFilter', true);
    }
  };

  if (isSmallScreen) {
    return (
      <StyledSelect
        options={TAB_OPTIONS}
        value={TAB_OPTIONS.find((opt) => opt.value === activeIndex).value}
        onChange={handleTabChange}
        menuButtonProps={{ 'data-testid': 'feed-filter-dropdown' }}
        menuListProps={{ 'data-testid': 'feed-filter-list' }}
      />
    );
  }

  return (
    <Tabs
      align='center'
      isFitted
      w='100%'
      index={activeIndex}
      onChange={handleTabChange}
      data-testid='feed-filter-tabs'
    >
      <TabList
        display='inline-flex'
        gap={1}
        bg='brandPrimary.containerLow'
        p={1}
        borderRadius='xl'
        w='100%'
      >
        {TAB_OPTIONS.map((option) => (
          <Tab
            key={option.value}
            {...tabProps}
            data-testid={option.test_id}
          >
            {option.label}
          </Tab>
        ))}
      </TabList>
    </Tabs>
  );
};

export default memo(FeedFilterTabs);
