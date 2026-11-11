import { useFindQuery } from './default.query-service';

const model = 'types';

/**
 * @param {UseQueryOptionsT<Named[]>} queryOptions
 * @returns {UseQueryResultT<Named[]>}
 */
export const useTimeZones = useFindQuery({ model, resource: 'timeZones' });
