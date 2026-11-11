import { useMutation, useQuery, useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import Axios from 'axios';

/****************************************************
 * API Calls
 ****************************************************/

export async function find({ model, resource, paramName = 'term', term = '' }) {
  return Axios({
    method: 'GET',
    url: resource ? `/${model}/${resource}` : `/${model}`,
    params: { [paramName]: term }
  }).then((res) => res?.data);
}

export async function search({ model, body, includeTotal }) {
  return Axios({
    method: 'POST',
    url: `/${model}/search`,
    data: body
  }).then((res) => (includeTotal ? res?.data : res?.data?.data));
}

export async function infiniteSearch({ model, body, pageParam }) {
  return search({ model, body: { ...body, page: pageParam }, includeTotal: true }).then(
    (responseBody) => {
      const hasNextPage = pageParam * body.pageSize < responseBody?.total;
      return {
        ...responseBody,
        page: pageParam,
        // add prevPage stuff here as well, if needed
        nextPage: hasNextPage ? pageParam + 1 : undefined,
        pageSize: body.pageSize
      };
    }
  );
}

export async function getById({ model, id, headers = {} }) {
  return Axios({
    method: 'GET',
    url: `/${model}/${id}`,
    params: model === 'cards' ? { more: true, full: true } : {},
    headers
  }).then((res) => res?.data);
}

export async function getAllById({ model, id, excludeTranscripts = true }) {
  return Axios({
    method: 'GET',
    url: `/${model}/${id}/all`,
    params: { excludeTranscripts }
  }).then((res) => res?.data);
}

export async function getByAttribute({ model, id, attribute }) {
  return Axios({
    method: 'GET',
    url: `/${model}/${id}/${attribute}`
  }).then((res) => res?.data);
}

export async function create({ model, body }) {
  return Axios({
    method: 'POST',
    url: `${model}`,
    data: body,
    params: {
      wait: true // waits for full ES indexing before completion
    }
  }).then((res) => res?.data);
}

export async function patch({ model, id, body }) {
  return Axios({
    method: 'PATCH',
    url: `${model}/${id}`,
    data: body,
    params: {
      wait: true
    }
  }).then((res) => res?.data);
}

export async function deleteRecord({ model, id }) {
  return Axios({
    method: 'DELETE',
    url: `${model}/${id}`,
    params: {
      wait: true
    }
  });
}

export function setAttribute({ model, method = 'PUT', attribute }) {
  return (data) => {
    const { id, value, body, headers, params } = data;
    return Axios({
      method,
      url: `${model}/${id}/${attribute}`,
      params: { value, wait: true, ...params },
      data: body,
      headers
    });
  };
}

export function deleteAttribute({ model, attribute, queryParameters = {} }) {
  return (data) => {
    const { id, body } = data;
    return Axios({
      method: 'DELETE',
      url: `${model}/${id}/${attribute}`,
      params: { wait: true, ...queryParameters },
      data: body
    });
  };
}

export async function getVideoContentType(videoUrl) {
  const video = await Axios({
    method: 'GET',
    url: videoUrl,
    headers: {
      Range: 'bytes=0-1'
    }
  });

  return { contentType: video.headers['content-type'] };
}

/****************************************************
 * Queries
 ****************************************************/

export const useGetByIdQuery =
  ({ model, ...defaultQueryOptions }) =>
  (id, queryOptions = {}) =>
    useQuery({
      queryKey: [model, { id }],
      queryFn: () => getById({ model, id }),
      ...defaultQueryOptions,
      ...queryOptions
    });

export const useGetByAttributeQuery =
  ({ model, attribute, ...defaultQueryOptions }) =>
  (id, queryOptions = {}) =>
    useQuery({
      queryKey: [model, attribute, { id }],
      queryFn: () => getByAttribute({ model, id, attribute }),
      ...defaultQueryOptions,
      ...queryOptions
    });

export const useFindQuery =
  ({ model, paramName, ...defaultQueryOptions }) =>
  (term, _queryOptions = {}) => {
    const { resource, ...queryOptions } = { ...defaultQueryOptions, ..._queryOptions };
    const queryKey = resource ? [model, resource, { term }] : [model, { term }];
    return useQuery({
      queryKey,
      queryFn: () => find({ model, resource, paramName, term }),
      ...queryOptions
    });
  };

export const useSearchQuery =
  ({ model, defaultBody = {}, defaultQueryOptions = {} }) =>
  (body, _queryOptions = {}) => {
    const { includeTotal, ...queryOptions } = { ...defaultQueryOptions, ..._queryOptions };
    const queryKey = body ? [model, body] : [model];
    if (includeTotal) {
      queryKey.push(includeTotal);
    }
    return useQuery({
      queryKey,
      queryFn: () => search({ model, body: { ...defaultBody, ...body }, includeTotal }),
      ...queryOptions
    });
  };

export const useInfiniteSearchQuery =
  ({ model, defaultBody = {} }) =>
  (body, queryOptions) => {
    return useInfiniteQuery({
      queryKey: [model, body],
      queryFn: ({ pageParam = 1 }) =>
        infiniteSearch({ model, body: { ...defaultBody, ...body }, pageParam }),
      getNextPageParam: (lastPage) => lastPage.nextPage,
      ...queryOptions
    });
  };

/****************************************************
 * Fetching / Prefetching
 ****************************************************/

/**
 * Asynchronous fetching of search query, in rare cases where useQuery isn't possible
 * @param {{ model: string; body: object; includeTotal: boolean }}
 * @returns {() => (body, _queryOptions: object) => Promise<UseQueryResultT>} same result as useQuery
 * unlike useQuery, body is passed after invoking hook in component hence the extra layer
 * ex)
 * - initiatives.query-service.js => export const useFetchInitiatives = useFetchSearchQuery({ model, defaultBody })
 * - example-component.jsx => const fetchInitiatives = useFetchInitiatives();
 * - functionality => await fetchInitiatives(body, queryOptions);
 */
export const useFetchSearchQuery =
  ({ model, defaultBody = {}, defaultQueryOptions = {} }) =>
  () => {
    const queryClient = useQueryClient();
    return (body, _queryOptions = {}) => {
      const { includeTotal, ...queryOptions } = { ...defaultQueryOptions, ..._queryOptions };
      const queryKey = body ? [model, body, !!includeTotal] : [model, !!includeTotal];
      return queryClient.fetchQuery({
        queryKey,
        queryFn: () => search({ model, body: { ...defaultBody, ...body }, includeTotal }),
        ...queryOptions
      });
    };
  };

export const usePrefetchInfiniteSearchQuery =
  ({ model, defaultBody = {} }) =>
  (body, queryOptions) => {
    const queryClient = useQueryClient();

    const prefetch = async () =>
      await queryClient.prefetchInfiniteQuery({
        queryKey: [model, body],
        queryFn: ({ pageParam = 1 }) =>
          infiniteSearch({ model, body: { ...defaultBody, ...body }, pageParam }),
        getNextPageParam: (lastPage) => lastPage.nextPage,
        ...queryOptions
      });

    return prefetch;
  };

export function usePrefetchSearchQuery({ model, defaultBody = {}, includeTotal = false }) {
  return (body, queryOptions = {}) => {
    const queryClient = useQueryClient();
    const queryKey = body ? [model, body] : [model];

    const prefetch = async () =>
      await queryClient.prefetchQuery({
        queryKey,
        queryFn: () => search({ model, body: { ...defaultBody, ...body }, includeTotal }),
        ...queryOptions
      });

    return prefetch;
  };
}

/****************************************************
 * Mutations
 ****************************************************/

export const useCreate =
  ({ model, defaultBody = {} }) =>
  () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (body) => create({ model, body: { ...defaultBody, ...body } }),
      onSuccess: async () => {
        // todo: have this run even when component supplies its own 'onSuccess' callback
        await queryClient.invalidateQueries({ queryKey: [model], refetchType: 'all' });
      }
    });
  };

export const usePatch =
  ({ model, _defaultMutateOptions = {} }) =>
  (_mutateOptions = {}) => {
    const { optimisticUpdateConfig, ...mutateOptions } = {
      ..._defaultMutateOptions,
      ..._mutateOptions
    };
    const queryClient = useQueryClient();

    const searchUpdaterFn = (previous, mutationVars) => {
      return previous?.map((prev) =>
        prev.id === mutationVars.id ? { ...prev, ...mutationVars } : prev
      );
    };

    const infiniteUpdaterFn = (previous, pageIndex, recordIndex, mutationValue) => {
      const previousRecord = { ...previous.pages[pageIndex].data[recordIndex] };
      previous.pages[pageIndex].data[recordIndex] = { ...previousRecord, ...mutationValue };
      return {
        pages: previous.pages,
        pageParams: previous.pageParams
      };
    };

    const idUpdaterFn = (previous, mutationVars) => {
      return { ...previous, ...mutationVars };
    };

    return useMutation({
      mutationFn: ({ id, ...body }) => patch({ model, id, body }),
      onSuccess: async (updatedRecord, mutationVars) => {
        // updates cache state from record returned in response without having to re-fetch
        queryClient.setQueryData([model, { id: mutationVars.id }], updatedRecord);
        await queryClient.invalidateQueries({ queryKey: [model] });
      },
      ...getOptimisticUpdateMutateOptions(
        queryClient,
        model,
        optimisticUpdateConfig,
        searchUpdaterFn,
        infiniteUpdaterFn,
        idUpdaterFn
      ),
      ...mutateOptions
    });
  };

export const useDelete =
  ({ model, _defaultMutateOptions = {} }) =>
  (_mutateOptions = {}) => {
    const { optimisticUpdateConfig, ...mutateOptions } = {
      ..._defaultMutateOptions,
      ..._mutateOptions
    };
    const queryClient = useQueryClient();

    const searchUpdaterFn = (previous, recordId) =>
      previous?.filter((prevRecord) => prevRecord.id !== recordId);

    return useMutation({
      mutationFn: (id) => deleteRecord({ model, id }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [model] });
      },
      ...getOptimisticUpdateMutateOptions(
        queryClient,
        model,
        optimisticUpdateConfig,
        searchUpdaterFn
        // add infinite query updaterFn here if needed
      ),
      ...mutateOptions
    });
  };

/*
Note that the optimistic updaterFns for this query require some additional mutationVars.
This is configured at the mutate/mutateAsync level because that's where we know what the args are

Example that doesn't need any additional vars:
PUT /cards/{id}/preferred { value: mutationValue }
- updates query cache value as { ...updatedCard, preferred: mutationValue }
- updated query cache value equals the backend model, so no optimisticUpdateValue needed to bring them to parity

Example that does need additional vars:
PUT /meetings/{id}/initiative { value: <initiative-id>/mutationValue }
- needs to update query cache value as { ...updatedMeeting, initiative: { id: <initiative-id>/mutationValue, title, ...etc} }
  to reflect the backend
- therefore optimisticUpdates on attributes like meeting.initiative that have different endpoint payloads than their resulting value
  require an additional mutationVar called "optimisticUpdateValue" to update the query cache value with
*/
export const useSetAttribute =
  ({ model, attribute, method = 'PUT', _defaultMutateOptions = {} }) =>
  (_mutateOptions = {}) => {
    const { optimisticUpdateConfig, ...mutateOptions } = {
      ..._defaultMutateOptions,
      ..._mutateOptions
    };
    const queryClient = useQueryClient();

    const searchUpdaterFn = (previous, mutationVars) => {
      const newQueryValue = mutationVars?.optimisticUpdateValue ?? mutationVars?.value;
      const newQueryAttribute = mutationVars?.optimisticUpdateAttribute ?? attribute;
      return previous?.map((prev) =>
        prev.id === mutationVars.id ? { ...prev, [newQueryAttribute]: newQueryValue } : prev
      );
    };

    const infiniteUpdaterFn = (
      previous,
      pageIndex,
      recordIndex,
      mutationValue,
      addlMutationVars
    ) => {
      const newQueryValue = addlMutationVars?.optimisticUpdateValue ?? mutationValue;
      const newQueryAttribute = addlMutationVars?.optimisticUpdateAttribute ?? attribute;
      previous.pages[pageIndex].data[recordIndex][newQueryAttribute] = newQueryValue;
      return {
        pages: previous.pages,
        pageParams: previous.pageParams
      };
    };

    const idUpdaterFn = (previous, mutationVars) => {
      const newQueryValue = mutationVars?.optimisticUpdateValue ?? mutationVars?.value;
      const newQueryAttribute = mutationVars?.optimisticUpdateAttribute ?? attribute;
      return {
        ...previous,
        [newQueryAttribute]: newQueryValue
      };
    };

    return useMutation({
      mutationFn: setAttribute({ model, method, attribute }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [model] });
      },
      ...getOptimisticUpdateMutateOptions(
        queryClient,
        model,
        optimisticUpdateConfig,
        searchUpdaterFn,
        infiniteUpdaterFn,
        idUpdaterFn
      ),
      ...mutateOptions
    });
  };

/*
propertyName is an optional config value for if the provided "attribute" param does not map 1-to-1
to the property on the record that is being deleted. This ensures that any optimistic updates to the model
reflect whatever the backend is actually doing. If no propertyName is provided, it assumes the attribute
is property name to be deleted

e.g. DELETE /meetings/{id}/unschedule does not remove the "unschedule" property, it removes the "bot_id".

*/
export const useDeleteAttribute =
  ({ model, attribute, propertyName, queryParameters, _defaultMutateOptions = {} }) =>
  (_mutateOptions = {}) => {
    const { optimisticUpdateConfig, ...mutateOptions } = {
      ..._defaultMutateOptions,
      ..._mutateOptions
    };
    const queryClient = useQueryClient();

    const searchUpdaterFn = (previous, mutationVars) => {
      const newQueryValue = mutationVars?.optimisticUpdateValue ?? undefined;
      const newQueryAttribute = mutationVars?.optimisticUpdateAttribute ?? attribute;
      return previous?.map((prev) =>
        prev.id === mutationVars.id ? { ...prev, [newQueryAttribute]: newQueryValue } : prev
      );
    };

    const idUpdaterFn = (previous) => {
      // todo: update to reflect optimisticUpdateAttribute stuff above
      return { ...previous, [propertyName ?? attribute]: undefined };
    };

    return useMutation({
      mutationFn: deleteAttribute({
        model,
        attribute,
        queryParameters
      }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: [model] });
      },
      ...getOptimisticUpdateMutateOptions(
        queryClient,
        model,
        optimisticUpdateConfig,
        searchUpdaterFn,
        null,
        idUpdaterFn
      ),
      ...mutateOptions
    });
  };

/****************************************************
 * Optimistic Update Handlers
 ****************************************************/

/**
 * Converts optimisticUpdateConfig provided by service or component to
 * mutateOptions needed to perform optimistic updates
 * @param {QueryClient} queryClient
 * @param {string} model
 * @param {{ enabled: boolean, type: 'id' | 'search' | 'infinite', queryKeyToUpdate?: unknown[] }} optimisticUpdateConfig
 * @param {(previous, mutationVars) => any} searchUpdaterFn
 * - optimistic update function for search queries
 * @param {(previous, pageIndex: number, recordIndex: number, mutationValue) => any} infiniteUpdaterFn
 * - optimistic update function for infinite queries
 * @param {(previous, mutationVars) => any} idUpdaterFn
 * - optimistic update function for getById queries
 */
export function getOptimisticUpdateMutateOptions(
  queryClient,
  model,
  optimisticUpdateConfig,
  searchUpdaterFn,
  infiniteUpdaterFn,
  idUpdaterFn
) {
  if (!optimisticUpdateConfig?.enabled) {
    return {};
  }

  const {
    type,
    model: customModel,
    queryKeyToUpdate,
    updaterFn: customUpdaterFn
  } = optimisticUpdateConfig;

  if (type === 'infinite') {
    return optimisticUpdateInfiniteQuery(
      queryClient,
      customModel || model,
      queryKeyToUpdate,
      customUpdaterFn ?? infiniteUpdaterFn
    );
  } else if (type === 'id') {
    return optimisticUpdateIdQuery(
      queryClient,
      customModel || model,
      queryKeyToUpdate,
      customUpdaterFn ?? idUpdaterFn
    );
  } else if (type === 'search') {
    return optimisticUpdateQuery(
      queryClient,
      customModel || model,
      queryKeyToUpdate,
      customUpdaterFn ?? searchUpdaterFn
    );
  } else if (!type) {
    console.warn("Optimistic Update failed: missing query type ('search' | 'id' | 'infinite')");
  } else {
    console.warn(
      `Optimistic Update failed: missing query type for model: ${
        customModel || model
      } | queryKeyToUpdate: `,
      queryKeyToUpdate
    );
  }
}

/*
Note: Elastic Search delays index updates, so upon record creation we need to do optimistic updates
to the cache on the queries for /search and /find. This is to prevent the resulting changes of patch,
delete, and creation calls from looking awkwardly delayed.

The page will provide whatever queryKey it's using on its search in the arg queryKeyToUpdate.
This argument lets the component pass it's search body (which is the key along with the model) so that we can optimistically update
that cache in particular. If none is provided, this is because the search query is acting as a "get all" method. An example is
useFocuses where we always want all focus records regardless of page.
*/
export function optimisticUpdateQuery(queryClient, model, queryKeyToUpdate, updaterFn) {
  let queryKey;
  if (queryKeyToUpdate) {
    if (Array.isArray(queryKeyToUpdate)) {
      queryKey = [model, ...queryKeyToUpdate];
    } else {
      queryKey = [model, queryKeyToUpdate];
    }
  } else {
    queryKey = [model];
  }
  return {
    onMutate: async (mutationVars) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      const previousRecords = queryClient.getQueryData(queryKey);
      if (!previousRecords) {
        console.warn('No records found in cache for queryKey: ', queryKey);
      }

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (previous) => updaterFn(previous, mutationVars));

      return { previousRecords };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: async (_err, _newRecord, context) => {
      queryClient.setQueryData(queryKey, context.previousRecords);
      await queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => {}
  };
}

/**
 * Separate optimistic update handler for the { pages: [{ data: [] }, { data: [] }] }
 * structure of infinite query cache data
 * @param {QueryClient} queryClient
 * @param {string} model
 * @param {unknown[]} queryKeyToUpdate
 * @param {(previous, pageIndex: number, recordIndex: number, mutationValue: unknown) =>
 *    ({ pages: unknown[], pageParams: (undefined | number)[]})
 * } updaterFn
 * @returns
 */
export function optimisticUpdateInfiniteQuery(queryClient, model, queryKeyToUpdate, updaterFn) {
  const queryKey = [model, queryKeyToUpdate];
  return {
    onMutate: async (mutationVars) => {
      const { pageIndex, recordIndex, value: mutationValue, ...addlMutationVars } = mutationVars;
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(queryKey);
      const previousRecords = queryClient.getQueryData(queryKey);

      if (!previousRecords) {
        console.warn('No records found in cache for queryKey: ', queryKey);
      }

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (previous) =>
        updaterFn(previous, pageIndex, recordIndex, mutationValue, addlMutationVars)
      );

      return { previousRecords };
    },
    onError: (_err, _newRecord, context) => {
      queryClient.setQueryData(queryKey, context.previousRecords);
    },
    onSuccess: () => {
      // do nothing, no invalidation on infinite queries by default
    }
  };
}

/**
 * Separate optimistic update handler for getById query types
 * Note: does not require queryKeyToUpdate since you provide the ID in the mutation and that's the queryKey
 * you'll almost always be invalidating.
 * @param {QueryClient} queryClient
 * @param {string} model
 * @param {(previous, mutationVars) => any} updaterFn
 * @returns
 */
export function optimisticUpdateIdQuery(queryClient, model, queryKeyToUpdate, updaterFn) {
  return {
    onMutate: async (mutationVars) => {
      let queryKey;

      if (queryKeyToUpdate) {
        if (Array.isArray(queryKeyToUpdate)) {
          queryKey = [model, ...queryKeyToUpdate];
        } else {
          queryKey = [model, queryKeyToUpdate];
        }
      } else {
        queryKey = [model, { id: mutationVars.id }];
      }

      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      const previousRecord = queryClient.getQueryData(queryKey);

      if (!previousRecord) {
        console.warn('No record found in cache for queryKey: ', queryKey);
      }

      // Optimistically update to the new value
      queryClient.setQueryData(queryKey, (previous) => updaterFn(previous, mutationVars));

      return { previousRecord };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: async (_err, _newRecord, context) => {
      const queryKey = queryKeyToUpdate
        ? [model, queryKeyToUpdate]
        : [model, { id: context?.previousRecord?.id }];
      queryClient.setQueryData(queryKey, context.previousRecord);
      await queryClient.invalidateQueries({ queryKey });
    },
    onSuccess: () => {
      // do nothing, no invalidation on id queries by default
    }
  };
}
