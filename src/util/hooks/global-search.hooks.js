import { useLocation, useNavigate } from 'react-router-dom';
import { useShallow } from 'zustand/react/shallow';
import { pick } from 'lodash-es';

import { useDebouncedProp, useFeedPageFilters } from '@util/hooks';
import { useGlobalSearchStore } from '@store/app.store';
import { useGlobalSearch } from '@services/query-services/global.query-service';
import { minutes } from '@util/helpers';

export const useGlobalSearchState = () => {
  const navigate = useNavigate();
  const { handleFilterChange } = useFeedPageFilters();
  const location = useLocation();
  const { input, isInputFocused, setIsInputFocused, setIsExpanded, pushRecentSearch } =
    useGlobalSearchStore(
      useShallow((state) =>
        pick(state, [
          'input',
          'isInputFocused',
          'setIsInputFocused',
          'setIsExpanded',
          'pushRecentSearch'
        ])
      )
    );

  const [globalSearchQuery] = useDebouncedProp(input);

  const globalSearchQueryResult = useGlobalSearch(globalSearchQuery, {
    enabled: globalSearchQuery?.length > 0,
    refetchOnMount: false,
    staleTime: minutes(5)
  });

  const clearGlobalSearchExpansion = () => {
    setIsInputFocused(false);
    setIsExpanded(false);
  };

  const pushQueryToRecentSearches = () => {
    if (globalSearchQuery?.length > 0) {
      pushRecentSearch(globalSearchQuery);
    }
  };

  const handleViewAllClick = (destination) => {
    const destPath = `/${destination}`;
    clearGlobalSearchExpansion();
    // if we're already on feed, just set query param state value
    if (destPath !== location.pathname) {
      navigate(`${destPath}?keyword=${globalSearchQuery}`);
    } else {
      handleFilterChange('keyword', globalSearchQuery);
    }
  };

  return {
    isInputFocused,
    globalSearchQuery,
    globalSearchQueryResult,
    clearGlobalSearchExpansion,
    handleViewAllClick,
    pushQueryToRecentSearches
  };
};
