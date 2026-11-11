import { useUserStore } from '@store/app.store';
import {
  useSearchQuery,
  useInfiniteSearchQuery,
  useGetByIdQuery,
  usePatch,
  useDelete,
  useSetAttribute,
  usePrefetchInfiniteSearchQuery,
  usePrefetchSearchQuery
} from './default.query-service';
import { footnoteFormatterQuerySelector } from '@util/helpers';
import Axios from 'axios';

const model = 'insights';

const defaultBody = { sort: 'updated_at', asc: false };

/** @type {useSearchQuery<InsightSearchRequest, Insight>} */
export const useInsights = useSearchQuery({ model, defaultBody });

/** @type {useInfiniteSearchQuery<InsightSearchRequest, Insight>} */
export const useInfiniteInsights = useInfiniteSearchQuery({ model, defaultBody });

/** @type {useGetByIdQuery<Insight>} */
export const useInsightById = useGetByIdQuery({ model });

/** @type {useDelete<Insight>} */
export const useDeleteInsight = useDelete({ model });

/** @type {usePatch<Insight>} */
export const usePatchInsight = usePatch({ model });

/** @type {useSetAttribute<Insight>} */
export const useSaveInsight = useSetAttribute({ model, attribute: 'preferred' });

/** @type {useSetAttribute<Insight>} */
export const useArchiveInsight = useSetAttribute({ model, attribute: 'archived' });

/** @type {useSetAttribute<Insight>} */
export const useReadInsight = useSetAttribute({ model, attribute: 'read' });

export const usePrefetchInfiniteInsights = usePrefetchInfiniteSearchQuery({ model, defaultBody });

export const usePrefetchInsights = usePrefetchSearchQuery({ model, defaultBody });

// apply footnotes to one insight
export const useInsightWithFootnotes = (insightId, queryOptions = {}) => {
  return useInsightById(insightId, {
    ...queryOptions,
    select: footnoteFormatterQuerySelector
  });
};

export const archiveInsight = async (insightId) => {
  return Axios({
    method: 'PUT',
    url: `${model}/${insightId}/archived?value=true`
  }).then((res) => res.data);
};

/**
 *
 * @param {{ initiativeId: string, personId?: string, cardIds?: [string]  }} insightParams
 * @returns GenerateInsightResponse
 * note: the "id" of the GenerateInsightResponse is a websocket channel that will broadcast the status of this insight generation process
 */
export const generateInsight = async (insightParams) => {
  if (!insightParams.initiativeId) {
    throw new Error('Error during generate insight: no initiative ID provided');
  }
  return Axios({
    method: 'POST',
    url: `${model}/generate`,
    data: insightParams
  }).then((res) => res.data);
};

// "regenerate" an insight by archiving the old one and generating a new one
export const regenerateInsight = async (originalInsight) => {
  const insightParams = {
    initiativeId: originalInsight.initiative.id,
    personId: originalInsight.person.id,
    cardIds: originalInsight.cards.map((c) => c.id)
  };
  try {
    await archiveInsight(originalInsight.id);
  } catch (e) {
    throw new Error(`Error archiving old insight during regeneration: ${e}`);
  }

  return generateInsight(insightParams);
};

/**
 * @param {string} initiativeId
 * @param {'Lens'|'Focus'} [initiativeType='Lens']
 * @returns {UseQueryResultT<Insight>}
 */
export const useLatestInsight = (initiativeId, initiativeType = 'Lens') => {
  const user = useUserStore((state) => state.user);

  return useInsights(
    {
      initiative_type: initiativeType,
      initiative_id: initiativeId,
      person_id: user?.id,
      sort: 'updated_at',
      asc: false,
      pageSize: 1
    },
    {
      enabled: !!initiativeId,
      select: (insights) => insights[0]
    }
  );
};
