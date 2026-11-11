import Axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import {
  useSearchQuery,
  useInfiniteSearchQuery,
  useCreate,
  usePatch,
  useDelete,
  useSetAttribute,
  useDeleteAttribute,
  useGetByIdQuery,
  usePrefetchInfiniteSearchQuery,
  search
} from './default.query-service';

const model = 'cards';

const defaultBody = { sort: 'created_at', asc: false, initiative_type: 'Focus' };

/** @type {useSearchQuery<CardSearchRequest, Card>} */
export const useCards = useSearchQuery({
  model,
  defaultBody
});

/** @type {useSearchQuery<CardSearchRequest, Card>} */
export const useCardsCleanBody = useSearchQuery({ model });

/** @type {useInfiniteSearchQuery<CardSearchRequest, Card>} */
export const useInfiniteCards = useInfiniteSearchQuery({
  model,
  defaultBody
});

/** @type {useCreate<Card>} */
export const useCreateCard = useCreate({ model });

export const createCard = async (cardData) => {
  return Axios({
    method: 'POST',
    url: `${model}`,
    data: cardData
  }).then((res) => res.data);
};

export const fetchAllCardContentById = (id) => {
  return Axios({
    method: 'GET',
    url: `${model}/${id}/all`
  }).then((res) => res?.data);
};

/** @param {CardSearchRequest} body */
export const searchCards = async (body) => {
  return await search({ model, body });
};

/** @type {useCreate<Card>} */
export const useGenerateCard = useCreate({ model: `${model}/generate` });

/** @type {usePatch<Card>} */
export const usePatchCard = usePatch({ model });

/** @type {useSetAttribute<Card>} */
export const useSaveCard = useSetAttribute({ model, attribute: 'preferred' });

/** @type {useSetAttribute<Card>} */
export const useArchiveCard = useSetAttribute({ model, attribute: 'archived' });

/** @type {useSetAttribute<Card>} */
export const useReadCard = useSetAttribute({ model, attribute: 'read' });

/** @type {useSetAttribute<Card>} */
export const useSetCardShared = useSetAttribute({ model, attribute: 'shared' });

/** @type {useSetAttribute<Card>} */
export const useShareCard = useSetAttribute({ model, method: 'POST', attribute: 'share' });

/** @type {useSetAttribute<Card>} */
export const useSaveCardNote = useSetAttribute({ model, attribute: 'comments' });

/** @type {useDeleteAttribute<Card>} */
export const useDeleteCardNote = useDeleteAttribute({ model, attribute: 'comments' });

/** @type {useDelete<Card>} */
export const useDeleteCard = useDelete({ model });

/** @type {useGetByIdQuery<Card>} */
export const useCardById = useGetByIdQuery({ model });

/** @type {useSetAttribute<Meeting>} */
export const useSetCardLabels = useSetAttribute({ model, attribute: 'labels' });

/**
 * React query hook for aforementioned "Get All" call
 * @param {String} cardId
 * @param {*} queryOptions
 * @returns
 */
export const useAllCardContentById = (cardId, queryOptions = {}) => {
  return useQuery({
    queryKey: [model, { id: cardId }, 'all'],
    queryFn: () => fetchAllCardContentById(cardId),
    ...queryOptions
  });
};

/** @type {useInfiniteSearchQuery<CardSearchRequest, Card>} */
export const usePrefetchInfiniteCards = usePrefetchInfiniteSearchQuery({ model, defaultBody });

export const getCardBySourceId = async (sourceId, excludeTranscripts = true) => {
  return Axios({
    method: 'GET',
    url: `/${model}/sources/${sourceId}/all`,
    params: { excludeTranscripts }
  }).then((res) => {
    if (res?.status === 204) {
      throw new Error('No Card');
    } else {
      return res?.data;
    }
  });
};

/** @returns {UseQueryResultT<{value: Card, bot: Bot, meeting: Meeting, initiative: Initiative}> */
export const useGetCardBySourceId = (sourceId, queryOptions) => {
  return useQuery({
    queryKey: ['cards', 'sources', sourceId, 'all'],
    queryFn: () => getCardBySourceId(sourceId),
    enabled: !!sourceId,
    ...queryOptions
  });
};

export const generateLensCardPreview = async (data) => {
  return Axios({
    method: 'POST',
    url: `/${model}/initiatives`,
    data
  }).then((res) => res.data);
};

export const getCardSubSources = async ({ personId, domain, email, days = 90 }) => {
  return Axios({
    method: 'GET',
    url: `/${model}/subSources`,
    params: { personId, domain, email, days }
  }).then((res) => {
    if (res?.status === 204) {
      throw new Error('No Card');
    } else {
      return res?.data;
    }
  });
};

export const useCardSubSources = ({ personId, domain, email, days = 90 }, queryOptions) => {
  return useQuery({
    queryKey: ['cards', 'subSources', personId, domain, email, days],
    queryFn: () => getCardSubSources({ personId, domain, email, days }),
    enabled: !!personId || !!domain || !!email,
    ...queryOptions
  });
};
