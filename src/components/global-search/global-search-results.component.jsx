import { Center, Spinner, Text, Stack, HStack, Button, StackDivider, Icon } from '@chakra-ui/react';
import { useCallback } from 'react';
import { format } from 'date-fns';

import {
  SummaryCardIcon,
  OrganizationIconBold,
  CalendarIcon,
  InsightIcon,
  UserIconBold,
  SearchIconBold
} from '@assets/icons';
import { buildOrgLink, getCardSourceLink, hasAnyResults, mergePeople } from '@util/helpers';
import { useGlobalSearchStore } from '@store/app.store';

import SourceLogo from '@components/general/source-logo.component';
import GlobalSearchResultSet from './global-search-result-set.component';
import LearnMore from './global-search-learn-more.component';
import ResultWithContext from './global-search-result.component';
import RecentSearches from './recent-searches.component';

const textResultStyles = { as: 'span', fontSize: 'sm', color: 'surface.onSurfaceVariant' };

/*
---------------------------------------
Structure:
---------------------------------------
<Desktop/MobileGlobalSearchWrapper>
  <GlobalSearchInput />
  <GlobalSearchResults>
    <GlobalSearchResultsSet> // e.g. Summaries Set
      <GlobalSearchResultLink> // individual result link wrapper
       <ResultChildFromSet ... />
      </GlobalSearchResultLink>
    </GlobalSearchResultsSet>
    {...rest of sections}
  <GlobalSearchResults>
*/
export default function GlobalSearchResults({
  globalSearchQuery,
  handleResultClick,
  handleViewAllClick,
  globalSearchQueryResult
}) {
  const { data: results, isFetching, isSuccess } = globalSearchQueryResult;
  const highlight = useCallback(getHighlightedText(globalSearchQuery), [globalSearchQuery]);
  const recentSearches = useGlobalSearchStore((state) => state.recentSearches);
  const setInput = useGlobalSearchStore((state) => state.setInput);
  const clearRecentSearches = useGlobalSearchStore((state) => state.clearRecentSearches);

  if (isFetching) {
    return (
      <Center py={6}>
        <Spinner />
      </Center>
    );
  } else if (isSuccess && hasAnyResults(results)) {
    const foraPeople = results?.persons?.data;
    const participants = results?.participants;
    const mergedPeople = mergePeople(foraPeople, participants);

    return (
      <Stack divider={<StackDivider style={{ margin: 0 }} />}>
        {results.cards.total > 0 && (
          <GlobalSearchResultSet
            label='Summaries'
            labelButton={
              <Button
                size='reskinSm'
                variant='reskinLink'
                ml={4}
                onClick={() => handleViewAllClick('summaries')}
              >
                View All
              </Button>
            }
            icon={SummaryCardIcon}
            iconBgColor='brandPrimary.containerHigh'
            iconColor='brandPrimary.onContainer'
            getLink={getCardSourceLink}
            results={results.cards?.data}
            handleItemClick={handleResultClick}
          >
            {(card) => (
              <ResultWithContext
                title={card?.resultHeadline}
                context={card?.resultContext}
              >
                <ResultSource
                  sourceType={card?.source}
                  subSource={card?.sub_source}
                  sourceData={card?.source_data}
                >
                  {format(card?.source_data?.start_at ?? card?.created_at, 'MMM d')}
                </ResultSource>
              </ResultWithContext>
            )}
          </GlobalSearchResultSet>
        )}
        {results.meetings?.total > 0 && (
          <GlobalSearchResultSet
            label='Previous Meetings'
            icon={CalendarIcon}
            iconBgColor='critical.containerHigh'
            iconColor='critical.onContainer'
            getLink={(meeting) => `/meeting/${meeting?.id}`}
            results={results.meetings?.data}
            handleItemClick={handleResultClick}
          >
            {(meeting) => (
              <ResultWithContext
                title={meeting?.resultHeadline}
                context={meeting?.resultContext}
              >
                <ResultSource
                  sourceType='Meeting'
                  sourceData={meeting}
                >
                  {format(meeting?.start_at, 'MMM d')}
                </ResultSource>
              </ResultWithContext>
            )}
          </GlobalSearchResultSet>
        )}
        {results.organizations?.values?.length > 0 && (
          <GlobalSearchResultSet
            label='Companies'
            icon={OrganizationIconBold}
            iconBgColor='brandTertiary.containerHigh'
            iconColor='brandTertiary.onSurface'
            getLink={(org) => buildOrgLink({ id: org?.id, domain: org?.primary_domain })}
            results={results.organizations?.values}
            handleItemClick={handleResultClick}
          >
            {(organization) => <Text {...textResultStyles}>{highlight(organization?.name)}</Text>}
          </GlobalSearchResultSet>
        )}
        {mergedPeople?.length > 0 && (
          <GlobalSearchResultSet
            label='People'
            icon={UserIconBold}
            iconBgColor='positive.containerHigh'
            iconColor='positive.onSurface'
            idProp='email'
            getLink={(person) => person?.link}
            results={mergedPeople}
            handleItemClick={handleResultClick}
          >
            {(person) => (
              <Text {...textResultStyles}>
                {highlight(
                  [person.name ?? person.email, person.title, person.company_name]
                    .filter(Boolean)
                    .join(', ')
                )}
              </Text>
            )}
          </GlobalSearchResultSet>
        )}
        {results.insights?.total > 0 && (
          <GlobalSearchResultSet
            label='Insights'
            icon={InsightIcon}
            iconBgColor='caution.containerHigh'
            iconColor='caution.onSurface'
            getLink={(insight) => `/insights/${insight?.id}`}
            results={results.insights?.data}
            handleItemClick={handleResultClick}
          >
            {(insight) => (
              <ResultWithContext
                title={insight?.resultHeadline}
                context={insight?.resultContext}
              />
            )}
          </GlobalSearchResultSet>
        )}
      </Stack>
    );
  } else if (globalSearchQuery?.length > 0 && isSuccess) {
    return (
      <Stack
        px={{ base: '30px', lg: 4 }}
        py={3}
        gap={4}
        fontSize='sm'
      >
        <NoResults globalSearchQuery={globalSearchQuery} />
        <LearnMore />
      </Stack>
    );
  } else {
    return (
      <Stack divider={<StackDivider style={{ margin: 0 }} />}>
        {recentSearches.length > 0 && (
          <RecentSearches
            setInput={setInput}
            clearRecentSearches={clearRecentSearches}
            recentSearches={recentSearches}
          />
        )}
        <Stack
          px={{ base: '30px', lg: 4 }}
          py={3}
        >
          <LearnMore />
        </Stack>
      </Stack>
    );
  }
}

function getHighlightedText(keyword) {
  return (text) => {
    const parts = text.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => (
          <Text
            as='span'
            key={`${part}-${i}`}
            fontWeight={part.toLowerCase() === keyword.toLowerCase() ? 700 : 'initial'}
          >
            {part}
          </Text>
        ))}
      </>
    );
  };
}

function ResultSource({ sourceType, subSource, sourceData, children }) {
  return (
    <HStack minW={16}>
      <SourceLogo
        sourceType={sourceType}
        subSource={subSource}
        source={sourceData}
        boxSize='14px'
      />
      <Text
        as='span'
        fontSize='xs'
        fontWeight={400}
        color='surface.onSurfaceVariant'
      >
        {children}
      </Text>
    </HStack>
  );
}

function NoResults({ globalSearchQuery }) {
  return (
    <HStack
      gap={{ base: 2, lg: 3 }}
      py={{ base: '5px', lg: 0 }}
    >
      <Icon
        as={SearchIconBold}
        boxSize='14px'
        color='surface.outline'
      />
      <Text as='span'>
        No results for&nbsp;
        <Text
          as='span'
          fontWeight={600}
        >
          &apos;{globalSearchQuery}&apos;
        </Text>
      </Text>
    </HStack>
  );
}
