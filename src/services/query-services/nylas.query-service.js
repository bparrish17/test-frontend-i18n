import { useMutation, useQuery } from '@tanstack/react-query';
import Axios from 'axios';
import { useSearchQuery } from './default.query-service';

const model = 'nylas/accounts';
const defaultBody = { sort: 'created_at', asc: false };

/**
 * Retrieves both the NylasAccount and number of calendars owned by the current user. An example output is:
 *
 * 401: the current user is NOT an application user (i.e. god key).
 * 204: the current user does NOT have an existing connected Nylas Account.
 * 404: the current user has an invalid Nylas Account ID on their session record. This should not happen but it's possible.
 * 200: the current user has a valid Nylas Account ID on their session record.
 *
 * @typedef {'noAccount' | 'validAccount' | 'invalidAccount'} NylasAccountStatus
 */
const getNylasAccountStatus = () =>
  Axios({ method: 'GET', url: `/${model}/current` })
    .then((res) => {
      if (res?.status === 204) {
        return { status: 'noAccount' };
      } else {
        const data = res.data ?? {};
        return { status: 'validAccount', ...data };
      }
    })
    .catch(() => ({ status: 'invalidAccount' }));

/** @type {useSearchQuery<NylasAccountSearchRequest, NylasAccount>} */
export const useNylasAccounts = useSearchQuery({ model, defaultBody });

/** @returns {UseQueryResultT<{ status: NylasAccountStatus; num_of_calendars?: 3; value?: NylasAccount }>} */
export const useNylasAccountStatus = (queryOptions = {}) =>
  useQuery({
    queryKey: [model, 'current-account-status'],
    queryFn: getNylasAccountStatus,
    cacheTime: Infinity,
    staleTime: Infinity,
    ...queryOptions
  });

/** @type {useMutationT<NylasAccount>} */
export const useSyncNylasAccount = (mutateOptions = {}) =>
  useMutation({
    mutationFn: async () =>
      Axios({ method: 'POST', url: `/${model}/sync` }).then((res) => res.data),
    ...mutateOptions
  });
