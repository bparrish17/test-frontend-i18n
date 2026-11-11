import Axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '@store/app.store';

export function authorizeSlack() {
  const params = {
    client_id: import.meta.env.VITE_SLACK_CLIENT_ID,
    scope:
      'channels:history,channels:read,chat:write,chat:write.public,commands,groups:read,im:history,im:read,im:write,incoming-webhook,mpim:read,mpim:write,users:read,users:read.email',
    redirect_uri: `${window.location.origin}/callback/slack`
  };
  const queryString = new URLSearchParams(params).toString();
  window.location.assign(`https://slack.com/oauth/v2/authorize?${queryString}`);
}

export function makeSlackRequest({ method, endpoint, data = {}, token }) {
  return Axios({
    method,
    url: `https://slack.com/api/${endpoint}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: { ...data, token }
  }).then((res) => res.data);
}

export const useSlackChannels = (queryOptions = {}) => {
  const tenantAccessToken = useUserStore((state) => state?.tenant?.slack_config?.access_token);
  return useQuery({
    queryKey: ['slack', 'channels'],
    queryFn: () =>
      Axios({
        method: 'GET',
        url: '/slack/channels',
        headers: { 'X-Fora-Tenant': tenantAccessToken }
      }).then((res) => res?.data?.channels ?? []),
    refetchOnWindowFocus: false,
    enabled: !!tenantAccessToken,
    ...queryOptions
  });
};
