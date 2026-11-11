import { Box } from '@chakra-ui/react';
import { useRef } from 'react';

import { useClickOutsideListener } from '@util/hooks';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import { useGlobalSearchState } from '@util/hooks/global-search.hooks';
import GlobalSearchResults from './global-search-results.component';
import GlobalSearchInput from './global-search-input.component';

export default function DesktopGlobalSearch() {
  const globalSearchBoxRef = useRef(null);

  const {
    isInputFocused,
    globalSearchQuery,
    globalSearchQueryResult,
    clearGlobalSearchExpansion,
    handleViewAllClick,
    pushQueryToRecentSearches
  } = useGlobalSearchState();

  const handleResultClick = () => {
    pushQueryToRecentSearches();
    clearGlobalSearchExpansion();
  };

  useClickOutsideListener(globalSearchBoxRef, clearGlobalSearchExpansion);

  return (
    <Box
      position='relative'
      w='800px'
      h={11}
      ref={globalSearchBoxRef}
    >
      <GlobalSearchInput
        showIcon
        globalSearchQuery={globalSearchQuery}
        maxH='95vh'
        position='absolute'
        overflowY='scroll'
        top={0}
        left={0}
        gap={0}
        zIndex='overlay'
        sx={HIDE_SCROLLBAR}
      >
        {isInputFocused ? (
          <Box borderTop='dark'>
            <GlobalSearchResults
              globalSearchQuery={globalSearchQuery}
              handleResultClick={handleResultClick}
              handleViewAllClick={handleViewAllClick}
              globalSearchQueryResult={globalSearchQueryResult}
            />
          </Box>
        ) : null}
      </GlobalSearchInput>
    </Box>
  );
}
