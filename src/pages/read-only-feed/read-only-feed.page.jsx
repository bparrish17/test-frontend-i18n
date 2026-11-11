import {
  Flex,
  Text,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Grid,
  GridItem,
  useDisclosure,
  Collapse,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Box
} from '@chakra-ui/react';
import { useState, useEffect, useRef } from 'react';
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion';
import { useUserStore } from '@store/app.store';
import { useDebouncedProp, useFeedPageFilters, useBreakpoints } from '@util/hooks';
import { SearchIcon, CloseIcon } from '@assets/icons';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import CenteredLayout from '@layouts/centered.layout';
import FeedFilterSidebar from '@components/feed/feed-filter-sidebar.component';
import FeedFiltersToggle from '@components/feed/feed-open-filters-button.component';
import ReadOnlyFeedMeetings from '@components/read-only-feed/read-only-feed-meetings.component';
import { useTranslation } from 'react-i18next';

export default function ReadOnlyFeedPage() {
  const { t } = useTranslation();

  const [isSearching, setIsSearching] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { isOpen: isFilterMenuOpen, onToggle: onToggleFilterMenu } = useDisclosure();
  const { filters, hasActiveFilters, activeFilterCount, handleFilterChange } = useFeedPageFilters();
  const { isMobile } = useBreakpoints();
  const containerRef = useRef();
  const searchInputRef = useRef();
  const user = useUserStore((state) => state.user);

  const [debouncedKeyword] = useDebouncedProp(filters?.keyword);
  const startOfToday = new Date();
  startOfToday.setUTCHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setUTCHours(23, 59, 59, 0);

  const meetingSearchBody = {
    title: debouncedKeyword,
    has_either_bot_id: true,
    creator_id: user.id,
    sort: 'start_at',
    asc: true
  };

  useEffect(() => {
    if (isSearching && searchInputRef?.current) {
      searchInputRef.current.focus();
    }
  }, [isSearching, searchInputRef]);

  return (
    <Box data-cy='feed-page'>
      {isMobile && (
        <Drawer
          placement='bottom'
          onClose={onToggleFilterMenu}
          isOpen={isFilterMenuOpen}
        >
          <DrawerOverlay />
          <DrawerContent
            h='60vh'
            overflowY='scroll'
            py={12}
          >
            <FeedFilterSidebar tab='meetings' />
          </DrawerContent>
        </Drawer>
      )}
      <Flex
        w='full'
        gap={3}
        overflowY='scroll'
        h='full'
        sx={HIDE_SCROLLBAR}
        justify='center'
        ref={containerRef}
        overflowX='hidden'
        onScroll={(e) => setHasScrolled(e?.target?.scrollTop > 0)}
      >
        <LayoutGroup id='feed-page'>
          <AnimatePresence>
            {isFilterMenuOpen && !isMobile && (
              <FeedFilterSidebar
                tab='meetings'
                isOpen={isFilterMenuOpen}
              />
            )}
          </AnimatePresence>
          <CenteredLayout>
            <Grid
              as={motion.div}
              layout='position'
              layoutRoot
              w='full'
              templateColumns='1fr 194px 1fr'
              pt={4}
              pb={2}
              px={{ base: 2, md: 10 }}
              gap={4}
              top={0}
              position='sticky'
              bgColor='surface.containerLowest'
              zIndex={5}
              animate={{
                boxShadow: hasScrolled ? '0 8px 8px -8px #aaa' : '0px'
              }}
            >
              <Box
                h='full'
                w='200%'
                position='absolute'
                top={0}
                left='-50%'
                zIndex={-1}
                bgColor='surface.containerLowest'
              />
              <GridItem>
                <FeedFiltersToggle
                  activeFilterCount={activeFilterCount}
                  isFilterMenuOpen={isFilterMenuOpen}
                  hasActiveFilters={hasActiveFilters}
                  onToggleFilterMenu={onToggleFilterMenu}
                />
              </GridItem>
              <GridItem
                display='flex'
                justifyContent='center'
                alignItems='center'
              >
                <Text variant='content-section-header'>{t('readOnlyFeedPage.yourMeetings')}</Text>
              </GridItem>
              <GridItem
                display='flex'
                justifyContent='flex-end'
              >
                <IconButton
                  size='lg'
                  icon={<SearchIcon fontSize='24px' />}
                  isRound
                  variant='ghost'
                  color={isSearching ? 'legacyForaBlue' : 'surface.onSurfaceVariant'}
                  border={isSearching ? '1px solid' : 'none'}
                  bgColor={isSearching ? 'white' : 'transparent'}
                  onClick={() => setIsSearching(!isSearching)}
                />
              </GridItem>
              <GridItem
                colSpan={3}
                position='relative'
              >
                <Collapse in={isSearching}>
                  <InputGroup
                    w='full'
                    size='lg'
                    my={4}
                  >
                    <Input
                      ref={searchInputRef}
                      variant='filled'
                      fontSize='md'
                      placeholder={t('readOnlyFeedPage.enterKeywordsPlaceholder')}
                      value={filters?.keyword ?? ''}
                      onChange={(e) => handleFilterChange('keyword', e?.target?.value)}
                    />
                    {filters?.keyword && (
                      <InputRightElement
                        as='button'
                        onClick={() => handleFilterChange('keyword', undefined)}
                      >
                        <Icon as={CloseIcon} />
                      </InputRightElement>
                    )}
                  </InputGroup>
                </Collapse>
              </GridItem>
            </Grid>
            <Box
              w='full'
              py={4}
            >
              <ReadOnlyFeedMeetings meetingSearchBody={meetingSearchBody} />
            </Box>
          </CenteredLayout>
        </LayoutGroup>
      </Flex>
    </Box>
  );
}
