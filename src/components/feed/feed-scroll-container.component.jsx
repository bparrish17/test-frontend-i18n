import { VStack, Stack, Box, Center, Text, Icon, HStack, Spacer } from '@chakra-ui/react';
import { useEffect, useRef } from 'react';
import { isUndefined } from 'lodash-es';
import { format } from 'date-fns';

import { useIsElementVisible, useBreakpoints, useFeedPageFilters } from '@util/hooks';
import { TildeIcon } from '@assets/icons';

export default function FeedScrollContainer({
  infiniteQueryResult,
  loadingSkeleton,
  children,
  noResultsText,
  shouldShowEndOfResults,
  scrollPlaceholderHeight = 24,
  endOfResultsProps = {},
  noResultsProps = {},
  ...stackProps
}) {
  const {
    data: searchResults,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = infiniteQueryResult;
  const endOfScrollRef = useRef();
  const isVisible = useIsElementVisible(endOfScrollRef, 600);
  const { isMobile } = useBreakpoints();
  const { hasActiveFilters, handleResetFilters } = useFeedPageFilters();

  useEffect(() => {
    if (isVisible) {
      fetchNextPage();
    }
  }, [isVisible]);

  const Loader = ({ ...containerProps }) => (
    <Center
      w='full'
      {...containerProps}
    >
      <Stack
        w='full'
        {...stackProps}
      >
        {loadingSkeleton}
        {loadingSkeleton}
      </Stack>
    </Center>
  );

  const isScrolled = !isUndefined(shouldShowEndOfResults)
    ? shouldShowEndOfResults
    : searchResults?.pages?.length > 1 || searchResults?.pages[0]?.data?.length > 3;

  const LoadingResultsSection = () => {
    if (isFetchingNextPage) {
      return <Loader py={6} />;
    } else if (hasNextPage) {
      return <Box h={scrollPlaceholderHeight} />;
    }
  };

  if (isLoading) {
    return <Loader />;
  } else if (!searchResults?.pages[0]?.data?.length) {
    return (
      <Text
        textAlign='center'
        color='surface.onSurfaceVariant'
        py={8}
        {...noResultsProps}
      >
        {noResultsText ?? 'No Results Found'}
      </Text>
    );
  } else {
    return (
      <Stack
        w='full'
        gap={0}
      >
        {isMobile &&
          (hasActiveFilters ? (
            <HStack p={4}>
              <Text
                fontSize='sm'
                color='surface.onSurface'
                fontWeight={600}
              >
                {searchResults?.pages[0]?.total} results
              </Text>
              <Spacer />
              <Text
                fontSize='sm'
                color='brandPrimary.primary'
                onClick={handleResetFilters}
              >
                Clear Filters
              </Text>
            </HStack>
          ) : (
            <Text
              variant='surface.onSurface'
              p={3}
              fontSize='lg'
              fontWeight={600}
            >
              {format(new Date(), 'ccc, LLL d')}
            </Text>
          ))}
        <Stack {...stackProps}>
          {searchResults?.pages.map((page, pageIndex) => children(page, pageIndex))}
        </Stack>
        <div
          display='none'
          ref={endOfScrollRef}
        />
        <LoadingResultsSection />
        {!hasNextPage && isScrolled && (
          <Center
            py={8}
            {...endOfResultsProps}
          >
            <VStack
              gap={1}
              color='surface.onSurfaceVariant'
            >
              <Icon
                as={TildeIcon}
                w={6}
                h={6}
              />
              <Text>End of Results</Text>
            </VStack>
          </Center>
        )}
      </Stack>
    );
  }
}
