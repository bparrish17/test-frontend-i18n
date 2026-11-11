import Axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { find, identity, map } from 'lodash-es';

import * as ApolloTypes from '@util/types/apollo.types';
import * as QueryTypes from '@tanstack/react-query';
import { minutes, retryQueryWhen } from '@util/helpers';
import { FAKE_FORA_APOLLO_ID, REAL_FORA_APOLLO_ID } from '@util/constants';

const model = 'apollo';

export function makeApolloRequest({ method, endpoint = '', data, params = {} }) {
  return Axios({
    method,
    url: `${model}${endpoint}`,
    params,
    data
  }).then((res) => res.data);
}

const getApolloQuery = ({
  method,
  endpoint,
  data,
  params,
  queryOptions = {},
  requestCb = identity
}) => {
  const queryKey = [model, endpoint, params, data].filter((keySection) => !!keySection);
  return {
    queryKey,
    queryFn: () => makeApolloRequest({ method, endpoint, data, params }).then(requestCb),
    staleTime: minutes(10),
    refetchOnMount: false,
    ...queryOptions
  };
};

const apolloPersonQuery = (email, queryOptions) =>
  getApolloQuery({
    method: 'GET',
    endpoint: '/people/item',
    params: { email },
    queryOptions: {
      retry: retryQueryWhen(1, (err) => !err?.includes('Person Match could not find ')),
      ...queryOptions
    },
    requestCb: (resData) => resData?.value
  });

/**
 * Fetches Apollo.io Person by email address.
 *
 * @param {string} email
 * @param {import('@tanstack/react-query').QueryOptions} queryOptions
 * @returns {QueryTypes.UseQueryResult<ApolloTypes.ApolloPerson>}
 */
export const useApolloPerson = (email, queryOptions) =>
  useQuery(apolloPersonQuery(email, queryOptions));

export const useApolloPeople = (emails, queryOptions) => {
  const queryClient = useQueryClient();

  return useQuery(
    getApolloQuery({
      method: 'POST',
      endpoint: '/people/items',
      data: emails,
      queryOptions,
      requestCb: (people) => {
        const realFora = find(people, ['organization_id', REAL_FORA_APOLLO_ID])?.organization;
        const resolvedPeople = people?.map((person) => {
          if (person?.organization_id === FAKE_FORA_APOLLO_ID && realFora) {
            return { ...person, organization_id: realFora?.id, organization: realFora };
          }
          return person;
        });

        // pre-populate apollo organization cache with person.organization since the call fails sometimes
        resolvedPeople.forEach((person) => {
          const organization = person?.organization;
          if (organization?.id) {
            queryClient.setQueryData(
              ['apollo', '/organizations/items', { ids: organization?.id }],
              [organization]
            );
          }
        });

        return resolvedPeople;
      }
    })
  );
};

/** @returns {QueryTypes.UseQueryResult<ApolloTypes.ApolloOrganization>} */
export const useApolloOrganizationsByIds = (ids, queryOptions) =>
  useQuery(
    getApolloQuery({
      method: 'GET',
      endpoint: '/organizations/items',
      params: { ids: ids.join(',') },
      queryOptions: {
        staleTime: Infinity,
        ...queryOptions
      },
      requestCb: (resData) => map(resData, 'value')
    })
  );

/** @returns {UseQueryResultT<ApolloTypes.ApolloOrganization[]>} */
export const useApolloOrganizationsByDomains = (domains, queryOptions) => {
  const queryClient = useQueryClient();

  return useQuery(
    getApolloQuery({
      method: 'GET',
      endpoint: '/organizations/domains',
      params: { domains: domains.join(',') },
      queryOptions: {
        staleTime: Infinity,
        ...queryOptions
      },
      requestCb: (resData) => {
        const organizations = map(resData, 'value');
        queryClient.setQueryData(
          ['apollo', '/organizations/items', { ids: map(organizations, 'id').join(',') }],
          organizations
        );
        return organizations;
      }
    })
  );
};

/*
Apollo Fetching/Caching Idea
- store actual results as person/organization ID keyed objects
- when fetching one or many, check for keyed person/organization before fetching
- queryKeyHashFn?

*/
