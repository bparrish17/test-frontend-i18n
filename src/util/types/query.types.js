/****************************************************
 * Queries
 ****************************************************/

/**
 * @template T
 * @typedef {import('@tanstack/react-query').UseQueryResult<T, unknown>} UseQueryResultT
 */

/**
 * @template T
 * @typedef {import('@tanstack/react-query').UseInfiniteQueryResult<T, unknown>} UseInfiniteQueryResultT
 */

/**
 * @template T
 * @typedef {import('@tanstack/react-query').UseQueryOptions<T>} UseQueryOptionsT
 */

/****************************************************/

/**
 * @template TRequest
 * @template TResponse
 * @typedef {(searchBody: TRequest, queryOptions: UseQueryOptionsT<TResponse[]>) => UseQueryResultT<TResponse[]>} useSearchQuery
 */
/**
 * @template TResponse
 * @typedef {(id: string, queryOptions: UseQueryOptionsT<TResponse>) => UseQueryResultT<TResponse>} useGetByIdQuery
 */
/**
 * @template TResponse
 * @typedef {(id: string, queryOptions: UseQueryOptionsT<TResponse>) => UseQueryResultT<TResponse>} useGetByAttributeQuery
 */
/**
 * @template TRequest
 * @template TResponse
 * @typedef {(searchBody: TRequest, queryOptions: UseQueryOptionsT<TResponse[]>) => Omit<UseInfiniteQueryResultT<TResponse>, 'data'> &
 *    {data: {
 *      pages: {
 *        data: TResponse[],
 *        nextPage: number,
 *        page: number,
 *        total: number
 *      }[]
 *    }
 * } useInfiniteSearchQuery
 */

/****************************************************
 * Mutations
 ****************************************************/

/**
 * @template TRequest
 * @template TResponse
 * @typedef {import('@tanstack/react-query').UseMutationResult<TResponse, unknown, TRequest, unknown>} UseMutationResultT
 */

/**
 * @template TResponse
 * @typedef {(mutateOptions: import('@tanstack/react-query').UseMutationOptions) => UseMutationResultT<undefined, TResponse>} useMutationT
 */

/** @typedef {string} MutationId */

/**
 * @typedef {Object} UseSetAttributeOptions
 * @property {string} id
 * @property {any} value
 * @property {any} body
 * @property {any} headers
 * @property {unknown} params
 */

/**
 * @typedef {Object} UseDeleteAttributeOptions
 * @property {string} id
 */

/****************************************************/

/**
 * @template TMutable
 * @typedef {(TMutable) => UseMutationResultT<TMutable, TMutable>} useCreate
 */

/**
 * @template TMutable
 * @typedef {(TMutable) => UseMutationResultT<TMutable, TMutable>} usePatch
 */

/**
 * @template TMutable
 * @typedef {(TMutable) => UseMutationResultT<MutationId, TMutable>} useDelete
 */

/**
 * @template TMutable
 * @typedef {(TMutable) => UseMutationResultT<UseSetAttributeOptions, TMutable>} useSetAttribute
 */

/**
 * @template TMutable
 * @typedef {(TMutable) => UseMutationResultT<UseDeleteAttributeOptions, TMutable>} useDeleteAttribute
 */

/****************************************************/

/**
 * @typedef {'search' | 'id' | 'infinite'} OptimisticUpdateType
 */

/**
 * @typedef {object} OptimisticUpdateConfig
 * @property {boolean} enabled
 * @property {string} model - if separate from that query's API model (e.g. performing saveCard but optimistically updating meetings/:id/all card property
 * @property {OptimisticUpdateType} type
 * @property {object=} queryKeyToUpdate
 * @property {string} optimisticUpdateAttribute
 * @property {any} optimisticUpdateValue
 * @property {Function=} updaterFn
 */
