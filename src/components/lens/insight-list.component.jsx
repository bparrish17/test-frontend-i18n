import { format } from 'date-fns';
import { Center, Spinner, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { removeFootnotesFromInsightSection } from '@util/helpers';

const showViewMoreAfter = 3;

/**
 * A generic component for displaying a list of insights
 * @typedef {Object} InsightListProps
 * @property {Array} insights - List of insights to display
 * @property {boolean} showDateHeaders - Whether to show date headers above each insight
 * @property {boolean} isLoading - Whether the insights are loading
 *
 * @param {InsightListProps}
 */
export default function InsightList({ insights = [], showDateHeaders = true, isLoading = false }) {
  const [showAll, setShowAll] = useState(false);
  const visibleInsights = showAll ? insights : insights?.slice(0, showViewMoreAfter);
  const hasMoreToShow = insights?.length > showViewMoreAfter;

  if (!insights?.length && !isLoading) {
    return (
      <Center>
        <Text
          color='surface.onSurfaceVariant'
          variant='body-600-md'
        >
          No Updates
        </Text>
      </Center>
    );
  } else if (isLoading) {
    return (
      <Center
        pt={6}
        pb={4}
      >
        <Spinner size='lg' />
      </Center>
    );
  }

  return (
    <Stack
      spacing={6}
      minH={showAll ? 'auto' : '300px'}
    >
      {visibleInsights?.map((insight) => (
        <InsightContent
          key={insight?.id}
          insight={insight}
          showDateHeaders={showDateHeaders}
        />
      ))}

      {hasMoreToShow && (
        <Text
          cursor='pointer'
          color='brandPrimary.primary'
          alignSelf='flex-start'
          variant='title-sm'
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'View Less' : 'View More'}
        </Text>
      )}
    </Stack>
  );
}

function InsightContent({ insight, showDateHeaders }) {
  const navigate = useNavigate();
  const handleInsightClick = (insight) => {
    navigate(`/insights/${insight.id}`);
  };

  return (
    <Stack
      gap={4}
      key={insight?.id}
    >
      {showDateHeaders && (
        <Text
          variant='content-section-header'
          my={4}
        >
          {format(new Date(insight?.created_at), 'MMMM d, yyyy')}
        </Text>
      )}

      <Stack gap={4}>
        <Text
          color='brandPrimary.primary'
          variant='title-sm'
          cursor='pointer'
          onClick={() => handleInsightClick(insight)}
        >
          {insight?.initiative?.title}
        </Text>

        <Text
          variant='title-md'
          cursor='pointer'
          onClick={() => handleInsightClick(insight)}
        >
          {insight?.headline}
        </Text>
      </Stack>
      <Text
        color='surface.onSurfaceVariant'
        variant='label-500-lg'
        noOfLines={5}
        textOverflow='ellipsis'
        as='span'
      >
        <Text
          as='span'
          color='brandPrimary.primary'
          variant='label-caps-600-md'
        >
          {format(new Date(insight?.created_at), 'EEE, MMM d, yyyy')}
        </Text>
        &nbsp;{removeFootnotesFromInsightSection(insight?.sections[0]?.content)}
      </Text>
    </Stack>
  );
}
