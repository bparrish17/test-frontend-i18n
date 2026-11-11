import { Box, Flex, HStack, IconButton, VStack } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { noop } from 'lodash-es';

import { HIDE_SCROLLBAR } from '@styles/css-configs';
import { ChevronLeftIcon, ChevronRightIcon } from '@assets/icons';
import { useBreakpoints, useListRefs } from '@util/hooks';
import { useTranslation } from 'react-i18next';

export default function ScrollContainer({
  children,
  items,
  totalItemCount,
  enableScrollButtons = true,
  scrollContainerProps,
  resultsText = 'Results',
  onInitialInteraction = noop
}) {
  const { t } = useTranslation();

  const itemGap = 4;
  const resultCount = totalItemCount ?? items?.length;
  const hasResults = resultCount > 0;
  const [scrollLeftDisabled, setScrollLeftDisabled] = useState(true);
  const [scrollRightDisabled, setScrollRightDisabled] = useState(false);
  const [hasScrolling, setHasScrolling] = useState();
  const [currentPage, setCurrentPage] = useState(0);
  const rootContainerRef = useRef(null);
  const itemScrollRef = useRef(null);
  const { refs: itemRefs } = useListRefs();
  const { isMobile } = useBreakpoints();

  useEffect(() => {
    if (itemScrollRef?.current) {
      const { scrollWidth, offsetWidth } = itemScrollRef?.current ?? {};
      const hasMoreSpace = scrollWidth > offsetWidth;
      const hasMoreUnrenderedItems = totalItemCount > items?.length;
      setHasScrolling(hasMoreSpace || hasMoreUnrenderedItems);
    }
  }, [itemScrollRef?.current?.scrollWidth, itemScrollRef?.current?.offsetWidth, resultCount]);

  const handleScroll = () => {
    const { scrollLeft, scrollWidth, offsetWidth } = itemScrollRef?.current ?? {};
    setCurrentPage(Math.floor(Math.abs(scrollLeft / offsetWidth)));
    setScrollLeftDisabled(scrollLeft === 0);
    setScrollRightDisabled(scrollLeft === scrollWidth - offsetWidth);
  };

  const handleScrollClick = (direction) => {
    onInitialInteraction();
    setTimeout(() => {
      const scrollLeft = itemScrollRef?.current.scrollLeft ?? 0;
      const containerWidth = itemScrollRef.current.offsetWidth;
      const scrollDiff = containerWidth + itemGap * 4; // REM => PX
      const newScroll = direction === 'left' ? scrollLeft - scrollDiff : scrollLeft + scrollDiff;
      itemScrollRef.current.scrollLeft = newScroll;
    }, 0);
  };

  const showScrollButtons = hasResults && hasScrolling && enableScrollButtons;

  return (
    <VStack
      ref={rootContainerRef}
      onMouseEnter={onInitialInteraction} // ensure additional items are loaded before clicking
    >
      <HStack
        px={{ base: 0, md: 1 }}
        w={isMobile ? 'full' : 'calc(100% + 32px)'}
        gap={1}
      >
        {!isMobile && (
          <ScrollButton
            icon={<ChevronLeftIcon />}
            hidden={!showScrollButtons}
            isDisabled={scrollLeftDisabled || !enableScrollButtons}
            onClick={() => handleScrollClick('left')}
          />
        )}

        <Flex
          ref={itemScrollRef}
          gap={itemGap}
          scrollBehavior='smooth'
          w='full'
          maxW='full'
          overflow='scroll'
          sx={HIDE_SCROLLBAR}
          onScroll={handleScroll}
          {...scrollContainerProps}
        >
          {hasResults ? (
            items.map((item, itemIndex) => children(item, itemIndex, itemRefs.current[itemIndex]))
          ) : (
            <Flex
              alignItems='center'
              px={10}
            >
              {t('scrollContainer.noFound', { resultsText })}
            </Flex>
          )}
        </Flex>

        {!isMobile && (
          <ScrollButton
            icon={<ChevronRightIcon />}
            hidden={!showScrollButtons}
            isDisabled={scrollRightDisabled || !enableScrollButtons}
            onClick={() => handleScrollClick('right')}
          />
        )}
      </HStack>

      {isMobile && (
        <HStack
          mt={4}
          px={8}
          flexWrap='wrap'
        >
          {items?.map((item, index) => {
            const isCurrent = currentPage === index;
            return (
              <Box
                key={item?.id + '-page-' + index}
                rounded='full'
                boxSize={2}
                bgColor={isCurrent ? 'surface.onSurfaceVariant' : 'surface.outline'}
              />
            );
          })}
        </HStack>
      )}
    </VStack>
  );
}

function ScrollButton({ icon, hidden, isDisabled, onClick }) {
  return (
    <Box>
      <IconButton
        size='xs'
        isRound
        fontSize='lg'
        icon={icon}
        variant='link'
        isDisabled={isDisabled && !hidden}
        opacity={hidden ? 0 : 1}
        onClick={onClick}
      />
    </Box>
  );
}
