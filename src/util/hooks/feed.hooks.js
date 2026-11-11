import { isNil, filter } from 'lodash-es';
import {
  useQueryParam,
  StringParam,
  ArrayParam,
  withDefault,
  NumberParam,
  BooleanParam
} from 'use-query-params';
import { useQueryClient } from '@tanstack/react-query';
import { useStatsigClient } from '@statsig/react-bindings';
import { useCallback, useMemo } from 'react';

import { useQueryStore, useUserStore } from '@store/app.store';
import {
  useArchiveCard,
  usePrefetchInfiniteCards,
  useSaveCard,
  useSetCardShared
} from '@services/query-services/cards.query-service';
import { optimisticUpdateInfiniteQuery } from '@services/query-services/default.query-service';
import { usePrefetchInsights } from '@services/query-services/insights.query-service';
import {
  SFCalendarIcon,
  SFDocOutlinedIcon,
  SFDollarSignCircleIcon,
  SFEnvelopeOutlined,
  SlackIcon,
  TeamsIcon
} from '@assets/icons';

/**
 * Separate helper for performing actions on cards that are returned inside the POST /insights/search response
 * - We need a separate custom optimisticUpdateConfig to support the fact that they're nested inside insights
 * @param {object} insightSearchBody
 * @returns {(action, value, card, pageIndex?, insightIndex?) => void}
 */
export const useInsightCardActions = (insightSearchBody) => {
  const queryClient = useQueryClient();
  const getMutateOptions = (attribute) =>
    optimisticUpdateInfiniteQuery(
      queryClient,
      'insights',
      insightSearchBody,
      (previous, pageIndex, recordIndex, mutationValue, addlMutationVars) => {
        const { id: cardId } = addlMutationVars;
        const cardIndex = previous.pages[pageIndex].data[recordIndex].cards.findIndex(
          (card) => card.id === cardId
        );
        previous.pages[pageIndex].data[recordIndex].cards[cardIndex][attribute] = mutationValue;
        return {
          pages: previous.pages,
          pageParams: previous.pageParams
        };
      }
    );
  const { mutateAsync: saveCard } = useSaveCard(getMutateOptions('preferred'));
  const { mutate: archiveCard } = useArchiveCard(getMutateOptions('archived'));
  const { mutateAsync: shareCard } = useSetCardShared(getMutateOptions('shared'));
  const { mutateAsync: readCard } = useSetCardShared(getMutateOptions('read'));

  return (action, value, card, pageIndex, insightIndex) => {
    const mutationVars = { id: card.id, value, pageIndex, recordIndex: insightIndex };
    if (action === 'save') saveCard(mutationVars);
    else if (action === 'archive') archiveCard(mutationVars);
    else if (action === 'read') readCard(mutationVars);
    else if (action === 'share') shareCard(mutationVars);
  };
};

// hook to share filter functionality in the feed page tree
// some filters need a queryParam, others do not. This keeps them all in one place and includes helpers to read/manage them
// todo: the keyword query param is inherently slow (about 65ms) which is noticeable when typing in the keyword field
//       K added a fix for this, but it had to be undone to allow navigating with keyword params from global-search
//       we need to find a more permanent solution where the URL keyword is still the source of truth, while still letting the input field
//       set a value more seamlessly
export const useFeedPageFilters = () => {
  const [keyword, setKeyword] = useQueryParam('keyword', withDefault(StringParam, ''));
  const [savedFilter, setSavedFilter] = useQueryParam('saved', withDefault(BooleanParam, null));
  const [archivedFilter, setArchivedFilter] = useQueryParam(
    'archived',
    withDefault(BooleanParam, null)
  );
  const [sharedFilter, setSharedFilter] = useQueryParam('shared', withDefault(BooleanParam, null));
  const [focuses, setFocuses] = useQueryParam('focuses', withDefault(ArrayParam, []));
  const [labels, setLabels] = useQueryParam('labels', withDefault(ArrayParam, []));
  const [dateRange, setDateRange] = useQueryParam(
    'dateRange',
    withDefault(StringParam, 'All Dates')
  );
  const [contentTypeSubSources, setContentTypeSubSources] = useQueryParam(
    'contentTypeSubSources',
    withDefault(ArrayParam, [])
  );
  const [createdAtFrom, setCreatedAtFrom] = useQueryParam(
    'createdAtFrom',
    withDefault(NumberParam, null)
  );
  const [createdAtTo, setCreatedAtTo] = useQueryParam(
    'createdAtTo',
    withDefault(NumberParam, null)
  );
  const [participantId, setParticipantId] = useQueryParam(
    'participantId',
    withDefault(StringParam, null)
  );

  const handleFilterChange = useCallback((filterName, value) => {
    switch (filterName) {
      case 'savedFilter':
        setSavedFilter(value, 'replaceIn');
        break;
      case 'archivedFilter':
        setArchivedFilter(value, 'replaceIn');
        break;
      case 'sharedFilter':
        setSharedFilter(value, 'replaceIn');
        break;
      case 'focuses':
        setFocuses(value, 'replaceIn');
        break;
      case 'labels':
        setLabels(value, 'replaceIn');
        break;
      case 'keyword':
        if (value === '') {
          setKeyword(null, 'replaceIn');
        } else {
          setKeyword(value, 'replaceIn');
        }
        break;
      case 'contentTypeSubSources':
        setContentTypeSubSources(value, 'replaceIn');
        break;
      case 'createdAtFrom':
        setCreatedAtFrom(value, 'replaceIn');
        break;
      case 'createdAtTo':
        setCreatedAtTo(value, 'replaceIn');
        break;
      case 'dateRange':
        setDateRange(value, 'replaceIn');
        break;
      case 'participantId':
        setParticipantId(value, 'replaceIn');
        break;
    }
  }, []);

  const handleResetFilters = () => {
    setSavedFilter(null);
    setArchivedFilter(null);
    setFocuses([]);
    setLabels([]);
    setKeyword(null);
    setContentTypeSubSources([]);
    setCreatedAtFrom(null);
    setCreatedAtTo(null);
    setDateRange(null);
    setParticipantId(null);
    setSharedFilter(null);
  };

  const activeAttrFilterCount = useMemo(() => {
    const attrFilters = {
      keyword,
      createdAtFrom,
      createdAtTo
    };
    return filter(attrFilters, (f) => {
      if (typeof f === 'string') {
        return f?.length > 0;
      } else {
        return !isNil(f);
      }
    }).length;
  }, [keyword, createdAtFrom, createdAtTo]);

  const activeFocusFilterCount = focuses?.length;
  const activeLabelsFilterCount = labels?.length;
  const contentTypeSubSourcesCount = contentTypeSubSources?.length;
  const hasActiveFilters = useMemo(
    () =>
      savedFilter ||
      archivedFilter ||
      sharedFilter ||
      !!participantId ||
      activeFocusFilterCount > 0 ||
      activeAttrFilterCount > 0 ||
      activeLabelsFilterCount > 0 ||
      contentTypeSubSourcesCount > 0,
    [
      savedFilter,
      archivedFilter,
      sharedFilter,
      participantId,
      activeFocusFilterCount,
      activeAttrFilterCount,
      activeLabelsFilterCount,
      contentTypeSubSourcesCount
    ]
  );
  const activeFilterCount = useMemo(
    () => activeFocusFilterCount + activeAttrFilterCount,
    [activeFocusFilterCount, activeAttrFilterCount]
  );

  return {
    filters: {
      savedFilter,
      archivedFilter,
      sharedFilter,
      focuses,
      labels,
      dateRange,
      keyword,
      contentTypeSubSources,
      createdAtFrom,
      createdAtTo,
      participantId
    },
    hasActiveFilters,
    activeFilterCount,
    handleFilterChange,
    handleResetFilters
  };
};

export const usePrefetchFeedCards = () => {
  const feedCardsSearchBody = useQueryStore((state) => state.feedCardsSearchBody);
  const userId = useUserStore((state) => state?.user?.id);
  const prefetchInfiniteCards = usePrefetchInfiniteCards(feedCardsSearchBody(userId));

  return prefetchInfiniteCards;
};

export const usePrefetchFeedInsights = () => {
  const userId = useUserStore((state) => state?.user?.id);
  const sharedBody = {
    initiative_type: 'Lens',
    person_id: userId,
    has_archived_at: false
  };
  const prefetchInsights = usePrefetchInsights({
    ...sharedBody,
    sort: 'updated_at',
    asc: false,
    pageSize: 20
  });

  const prefetchHasInsights = usePrefetchInsights({
    ...sharedBody,
    pageSize: 1
  });

  return () => {
    prefetchHasInsights();
    prefetchInsights();
  };
};

export const useContentTypeOptions = () => {
  const { checkGate } = useStatsigClient();
  const isEarningsCallEnabled = checkGate('earnings-calls');
  const isTeamsEnabled = checkGate('teams-digests');

  const contentTypeOptions = useMemo(
    () =>
      [
        {
          hidden: !isEarningsCallEnabled,
          title: 'Earnings Call',
          id: 'Bot',
          source: null,
          sub_sources: ['Earnings_Call'],
          icon: SFDollarSignCircleIcon
        },
        {
          title: 'Meeting',
          id: 'Meeting',
          sub_sources: ['Google_Meeting', 'Teams_Meeting', 'Webex_Meeting', 'Zoom_Meeting'],
          icon: SFCalendarIcon
        },
        {
          title: 'Email Thread',
          id: 'Channel',
          sub_sources: ['Email_Thread'],
          icon: SFEnvelopeOutlined
        },
        {
          title: 'Documents',
          id: 'Channel',
          sub_sources: ['Document_Upload'],
          icon: SFDocOutlinedIcon
        },
        { title: 'Slack Digest', id: 'Channel', sub_sources: ['Slack_Digest'], icon: SlackIcon },
        {
          hidden: !isTeamsEnabled,
          title: 'Teams Digest',
          id: 'Channel',
          sub_sources: ['Teams_Digest'],
          icon: TeamsIcon
        }
      ].filter((opt) => !opt.hidden),
    [isTeamsEnabled, isEarningsCallEnabled]
  );

  return contentTypeOptions;
};
