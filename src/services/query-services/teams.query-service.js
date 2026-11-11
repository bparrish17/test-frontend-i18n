import Axios from 'axios';
import { useQuery, useQueries } from '@tanstack/react-query';
import { omit } from 'lodash-es';
import { useUserMSALStore, useUserStore } from '@store/app.store';

const model = 'microsoft/teams';
const MICROSOFT_AUTH_HOST = 'https://login.microsoftonline.com';

/**
 * Directs user's tenant admin to the Microsoft Admin Consent Page
 * This lets them authorize us as an application that can perform permissions on our own on behalf of their entire tenant
 * @see {@link https://learn.microsoft.com/en-us/graph/auth-v2-service?tabs=http}
 */
export function authorizeMicrosoftAsAdmin() {
  const isDev = import.meta.env.DEV === true;
  const redirectHost = isDev ? 'http://localhost:5173' : 'https://app.fora.day';
  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
    redirect_uri: `${redirectHost}/callback/teams`
  }).toString();
  window.location.assign(`${MICROSOFT_AUTH_HOST}/common/adminconsent?${params}`);
}

function makeTeamsRequest({ endpoint = '', params, headers }) {
  return Axios({
    method: 'GET',
    url: `/${model}${endpoint}`,
    params,
    headers
  }).then((res) => res?.data?.value);
}

// note: might only allow 15 ids at a time? test this
function toIdInExpression(ids) {
  const idStrings = ids.map((id) => `'${id}'`).join(',');
  return `id in (${idStrings})`;
}

const useTeamsQuery = ({ endpoint, params, queryOptions = {} }) => {
  const tenantAccessToken = useUserStore((state) => state.tenant?.teams_config?.access_token);
  const userAccessToken = useUserMSALStore((state) => state.accessToken);
  const queryKey = [model, endpoint, params].filter((keySection) => !!keySection);
  const headers = endpoint.includes('/mine')
    ? { 'X-Fora-Microsoft': userAccessToken }
    : { 'X-Fora-Tenant': tenantAccessToken };

  return useQuery({
    queryKey,
    queryFn: () => makeTeamsRequest({ endpoint, params, headers }),
    enabled: !!(tenantAccessToken || userAccessToken) && queryOptions.enabled,
    ...omit(queryOptions, 'enabled')
  });
};

export const useTeams = ({ teamIds } = {}, queryOptions) => {
  let params;
  if (teamIds?.length > 0) {
    params = { filter: toIdInExpression(teamIds) };
  }
  return useTeamsQuery({ endpoint: '', params, queryOptions });
};

export const useMyTeams = (queryOptions) => {
  return useTeamsQuery({ endpoint: '/mine', queryOptions });
};

export const useTeamChannels = ({ teamId, channelIds = [] }, queryOptions) => {
  return useTeamsQuery({
    endpoint: `/${teamId}/channels`,
    params: getChannelParams(channelIds),
    queryOptions
  });
};

/**
 *
  Makes multiple queries to fetch channels associated to each "teamId"

  How to use:
  const results = useMultipleTeamChannels({
    // pass in teamIds array here
    teamIds: ['92a02d9e-167d-4a9f-8e26-f52ad7069ad5']
  });

  // results will be an array of query results.  If you wanted to get the
  // data you could map over to get results to get the list of channels

  const teamChannels = results.map(result => result.data);
*/
export const useMultipleTeamChannels = (
  { teamIds = [], channelIds = [], mine = false },
  queryOptions
) => {
  const tenantAccessToken = useUserStore((state) => state.tenant?.teams_config?.access_token);
  const userAccessToken = useUserMSALStore((state) => state.accessToken);
  const params = getChannelParams(channelIds);

  const queries = teamIds.map((teamId) => {
    const queryKey = [model, teamId, 'channels'];
    mine && queryKey.push('mine');
    !!params && queryKey.push(params);

    return {
      queryKey,
      queryFn: () =>
        makeTeamsRequest({
          endpoint: `/${teamId}/channels`.concat(mine ? '/mine' : ''),
          params,
          headers: mine
            ? { 'X-Fora-Microsoft': userAccessToken }
            : { 'X-Fora-Tenant': tenantAccessToken }
        }),
      enabled: !!tenantAccessToken && queryOptions?.enabled,
      ...omit(queryOptions, 'enabled')
    };
  });

  return useQueries({ queries });
};

function getChannelParams(channelIds) {
  const filters =
    channelIds?.length > 0
      ? `membershipType ne 'private' and ${toIdInExpression(channelIds)}`
      : "membershipType ne 'private'";

  return { filter: filters };
}

/*
Microsoft Graph API "filter" param documentation:
https://learn.microsoft.com/en-us/graph/filter-query-parameter?tabs=http#syntax-for-using-the-filter-odata-query-parameter

local dev teams callback url on admin consent
https://127.0.0.1:5173/callback/teams#code=0.AVAA9L8Qaw8Oy0KU-CdmPu5b1vJzfhIultNEhiz2h8tiNriAAAs.AgABAAIAAAAtyolDObpQQ5VtlI4uGjEPAgDs_wUA9P-vHyp6AbA1VvBbMaLRU-Unhf0V8cWW2-B1ZwN9d1HRow-nTmAL9HXg24Wvjma3p98NlyTSrakLXQ6pOn7X8XN-OljJvJq5FQrKWy4dPEb14wwjaKJ4WgcjVeZrv7PB49Sz92b-_9HNeU2R8Wy8SxS3KvM1CBSEYNqQXmfaaMLi9FM0q3h4r7qmGaAgYfxXvDMKRmLq88hrNGJi5JgoOE4ieYR1jKrsUiEYaSPE1jYPjQGoSoWNRI-IdmsRNGL0-lCtyj4Zn9bAjnADsZOpEfvXCVE6pRyIMV5e2Bx8Ljx54lDFm8W2UNdsDG3EaEBBPokcUzzWbbnPrizdBuZKNcp20ai5gNTfcWpwPwKhagHKzvzvT3EbANyva9jkNgX3Wj6Pd95KuN8lI-LvJ2DnX-ntXxdzKCRhyKCgF1ehvBo9c9jRpEkA3bt8gzNK3poW9osCMx3_z73nY4IVOnEiyhbPyt7p-pcEhzI8qCoYIeRL1AjxWPm2SOmPjm9tL34OUIp5NvlvZwG44e2gT3O3eR4TfPqI4uausWHEmS7aoER8Onx0mEIGLrVl5uJ2a7U1Vstt4FQTpy-fk966wxaaX4sv4ZvnXiainbEwMiOCjGZWNze4Q5hSkhPIvQC6aeoTxTVi7jFBGuzmccxUTf100COS9mfMzg8kU0HVw1PGn5BPNhtdbhwr7fJoPiPOSVPWeMURlZaI8n_pcfbUqfQJd6i1DSqKdhvEvoUIKHTbgfsodmwT8YvM1TSlodYI42Q70Ss1-LIPAfI-AMxYP8of42NTG_7TkFpBQZLDMhKRLK0aOMfQJoL8PtVY5Ul0ZhFUoIxnwVIe_--3HREnRcCy-TbKfYyC1KEWToMqbjOYiKC0e0F5GqZRhEp9d3W5vtTnYv2L&client_info=eyJ1aWQiOiJhMmYxMjI3MC04NGNmLTQ1ODItODViYS05NTJhNTdkNmQ3MTkiLCJ1dGlkIjoiNmIxMGJmZjQtMGUwZi00MmNiLTk0ZjgtMjc2NjNlZWU1YmQ2In0&state=eyJpZCI6IjE2NWEwN2IxLWViMjgtNGFlMy04YzYzLWE2ZmJiNzAwNjBkYyIsIm1ldGEiOnsiaW50ZXJhY3Rpb25UeXBlIjoicmVkaXJlY3QifX0%3d&session_state=04acb28d-ca39-4ef0-850f-8960461b7222
*/
