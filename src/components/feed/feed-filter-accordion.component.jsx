/* eslint-disable camelcase */
import {
  Button,
  Checkbox,
  Divider,
  Flex,
  HStack,
  Icon,
  Input,
  Show,
  Spacer,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { memo } from 'react';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { useStatsigClient } from '@statsig/react-bindings';

import { useInitiatives } from '@services/query-services/initiatives.query-service';
import { useContentTypeOptions, useFeedPageFilters } from '@util/hooks';
import { dateRangeMenuItems } from '@util/constants';
import { ChevronDownIcon } from '@assets/icons';
import { useUserStore } from '@store/app.store';
import Dropdown from '@components/general/dropdown.component';
import ForaBanner from '@components/general/fora-banner.component';
import CustomSelect from '@components/general/form/custom-select.component';
import FilterItem from '@components/feed/feed-filter-item.component';

import FeedRangepicker, { SelectedDateRange } from './feed-rangepicker.component';

function FeedFilterAccordion({ tab }) {
  const { checkGate } = useStatsigClient();
  const enableLabels = checkGate('labels');

  const user = useUserStore((state) => state?.user);
  const tenant = useUserStore((state) => state.tenant);
  const isGuest = user?.isGuest;
  const { filters, handleFilterChange } = useFeedPageFilters();
  const [startDate, setStartDateRaw] = useQueryParam(
    'createdAtFrom',
    withDefault(NumberParam, null)
  );
  const [endDate, setEndDateRaw] = useQueryParam('createdAtTo', withDefault(NumberParam, null));
  const setStartDate = (value) => setStartDateRaw(value, 'replaceIn');
  const setEndDate = (value) => setEndDateRaw(value, 'replaceIn');

  const { data: focuses } = useInitiatives({ type: 'Focus' }, { enabled: !!(user && !isGuest) });
  const { data: allLabels } = useInitiatives(
    {
      type: 'Label',
      has_archived_at: false,
      tenant_id: tenant?.id,
      pageSize: 100
    },
    { enabled: !!(user && !isGuest) }
  );

  const disclosure = useDisclosure();
  const contentTypeFilters = useContentTypeOptions();

  const rangePickerDisclosure = {
    ...disclosure,
    onClose: (confirm = false) => {
      if (!confirm) {
        handleFilterChange('dateRange', 'All Dates');
      }
      disclosure.onClose();
    }
  };

  const dateMenuItems = [
    ...dateRangeMenuItems.map((item) => ({
      name: item.name,
      onClick: () => {
        handleFilterChange('dateRange', item.name);
        setStartDate(item.createdAtFrom?.getTime());
      }
    })),
    {
      name: 'Custom...',
      onClick: () => {
        handleFilterChange('dateRange', 'Custom');
        rangePickerDisclosure.onOpen();
      }
    }
  ];

  const handleFocusChecked = (e, focusId) => {
    const checked = e?.target?.checked;
    const newFocusFilters = checked
      ? [...filters.focuses, focusId]
      : filters.focuses.filter((f) => f !== focusId);
    handleFilterChange('focuses', newFocusFilters);
  };

  const handleContentTypeChecked = (e, contentType) => {
    const { sub_sources } = contentType;
    const checked = e?.target?.checked;
    const newSubSourcesFilter = checked
      ? [...filters.contentTypeSubSources, ...sub_sources]
      : filters.contentTypeSubSources.filter((subSource) => !sub_sources.includes(subSource));
    handleFilterChange('contentTypeSubSources', newSubSourcesFilter);
  };

  return (
    <>
      <Stack gap={4}>
        <FilterItem text='Keyword'>
          <Input
            size='sm'
            w='full'
            fontSize='sm'
            h={10}
            value={filters.keyword}
            onChange={(e) => handleFilterChange('keyword', e.target.value)}
            borderRadius='md'
            placeholder='Enter a keyword'
            _placeholder={{
              color: 'surface.outline',
              p: 0.5,
              ml: 1,
              textStyle: 'body-500-sm'
            }}
          />
        </FilterItem>
        {enableLabels && !isGuest && (
          <FilterItem text='Labels'>
            <CustomSelect
              size='md'
              selectProps={{ width: '100%' }}
              placeholder='Type or select a label'
              options={allLabels}
              getOptionLabel={(opt) => opt?.title}
              getOptionValue={(opt) => opt?.id}
              onChange={(e) => {
                handleFilterChange(
                  'labels',
                  e.map((label) => label?.id)
                );
              }}
              value={allLabels?.filter((label) => filters?.labels?.includes(label?.id))}
              menuPlacement='auto'
            />
          </FilterItem>
        )}
        {tab !== 'meetings' && !isGuest && (
          <FilterItem
            text='Category'
            toggleCount={filters?.focuses?.length}
            isToggleable
          >
            <Stack
              pl={1}
              border='surface.outlineVariant'
              bgColor='surface.surfaceBright'
              borderWidth='2px'
            >
              {(focuses ?? []).map((focus) => (
                <HStack
                  p={1}
                  key={focus?.id}
                  minH={6}
                  spacing={3}
                >
                  <Text
                    fontSize='xs'
                    color='surface.onSurfaceVariant'
                  >
                    {focus?.title}
                  </Text>
                  <Spacer />
                  <Checkbox
                    isChecked={filters?.focuses?.includes(focus?.id)}
                    onChange={(e) => handleFocusChecked(e, focus?.id)}
                    data-testid='focus-checkbox'
                  />
                </HStack>
              ))}
            </Stack>
          </FilterItem>
        )}
        {tab === 'summaries' && !isGuest && (
          <FilterItem text='Content Type'>
            <Stack
              p={2}
              border='surface.outlineVariant'
              bgColor='surface.containerLowest'
              borderWidth='2px'
              borderRadius='md'
            >
              {contentTypeFilters.map((contentType) => (
                <HStack
                  p={1}
                  key={contentType?.title}
                  minH={6}
                  spacing={3}
                >
                  <Icon as={contentType.icon} />
                  <Text
                    fontSize='xs'
                    color='surface.onSurfaceVariant'
                  >
                    {contentType?.title}
                  </Text>
                  <Spacer />
                  <Checkbox
                    spacing={3}
                    isChecked={contentType.sub_sources.every((subSource) =>
                      filters?.contentTypeSubSources?.includes(subSource)
                    )}
                    onChange={(e) => handleContentTypeChecked(e, contentType)}
                  />
                </HStack>
              ))}
            </Stack>
          </FilterItem>
        )}
        <FilterItem
          text='Date Range'
          marginBottom={isGuest ? 25 : 0}
        >
          <Flex
            flexDir='column'
            gap={4}
            color='surface.onSurfaceVariant'
          >
            <Dropdown
              variant='small'
              triggerButtonType='button'
              triggerButton={
                <Button
                  pr={0}
                  border='surface.outlineVariant'
                  bgColor='surface.containerLow'
                  borderWidth='2px'
                  w='full'
                >
                  <Flex
                    w='full'
                    alignItems='center'
                  >
                    <Text
                      fontSize='xs'
                      fontWeight={400}
                      color='surface.onSurfaceVariant'
                    >
                      {filters?.dateRange}
                    </Text>
                    <Spacer />
                    <Icon
                      as={ChevronDownIcon}
                      mr={3}
                    />
                  </Flex>
                </Button>
              }
              triggerButtonProps={{
                p: 0
              }}
              menuItems={dateMenuItems}
            />
            {filters?.dateRange === 'Custom' && (
              <SelectedDateRange
                startDate={startDate}
                endDate={endDate}
                onClick={rangePickerDisclosure.onOpen}
              />
            )}
          </Flex>
        </FilterItem>
        {!isGuest && (
          <FilterItem
            text='Saved & Archived'
            data-testid='saved-and-archived'
            marginBottom={75}
          >
            <Stack
              p={2}
              border='surface.outlineVariant'
              bgColor='surface.containerLowest'
              borderWidth='2px'
              borderRadius='md'
            >
              <HStack
                p={1}
                minH={6}
                spacing={3}
              >
                <Text
                  fontSize='xs'
                  color='surface.onSurfaceVariant'
                >
                  Saved Summaries
                </Text>
                <Spacer />
                <Checkbox
                  spacing={3}
                  isChecked={filters.savedFilter}
                  onChange={(e) => {
                    handleFilterChange('savedFilter', e.target.checked ? true : null);
                  }}
                  data-testid='saved-filter-checkbox'
                />
              </HStack>
              <HStack
                p={1}
                minH={6}
                spacing={3}
              >
                <Text
                  fontSize='xs'
                  color='surface.onSurfaceVariant'
                >
                  Archived Summaries
                </Text>
                <Spacer />
                <Checkbox
                  spacing={3}
                  isChecked={filters.archivedFilter}
                  onChange={(e) => {
                    handleFilterChange('archivedFilter', e.target.checked ? true : null);
                  }}
                  data-testid='archived-filter-checkbox'
                />
              </HStack>
            </Stack>
          </FilterItem>
        )}
        {isGuest && (
          <Show above='lg'>
            <Divider mb={25} />
            <ForaBanner />
          </Show>
        )}
      </Stack>
      <FeedRangepicker
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        disclosure={rangePickerDisclosure}
      />
    </>
  );
}

export default memo(FeedFilterAccordion);
