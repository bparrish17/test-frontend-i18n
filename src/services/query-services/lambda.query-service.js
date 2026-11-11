import Axios from 'axios';
import { useQuery, useMutation } from '@tanstack/react-query';
import { minutes } from '@util/helpers';

export async function makeLambdaRequest({
  method,
  endpoint,
  data = {},
  params = {},
  headers = {}
}) {
  return Axios({
    method,
    url: `${import.meta.env.VITE_LAMBDA_API}/${endpoint}`,
    data,
    params,
    headers
  }).then((res) => res.data);
}

const useLambdaQuery = (
  { method, endpoint, data, params, enabled, defaultQueryOptions = {} },
  queryOptions
) => {
  return useQuery({
    queryKey: ['lambda', method, endpoint, data, params],
    queryFn: () => makeLambdaRequest({ method, endpoint, data, params }),
    enabled,
    staleTime: 0,
    ...defaultQueryOptions,
    ...queryOptions
  });
};

const useLambdaMutation = ({ method, endpoint }) => {
  return useMutation(
    (payload, params = {}) => makeLambdaRequest({ method, endpoint, data: payload, params }),
    {}
  );
};

export const useParseDocument = () => {
  return useLambdaMutation({
    method: 'POST',
    endpoint: 'document-parser'
  });
};

export const useHubspotOauth = () => {
  return useLambdaMutation({
    method: 'POST',
    endpoint: 'hubspot/oauth'
  });
};

export const useSalesforceOauth = () => {
  return useLambdaMutation({
    method: 'POST',
    endpoint: 'salesforce/oauth'
  });
};

export const useRingCentralOauth = () => {
  return useLambdaMutation({
    method: 'POST',
    endpoint: 'ringcentral/oauth'
  });
};

export const useZoomAccountSettings = (zoomCredentialId) => {
  return useLambdaQuery({
    method: 'GET',
    endpoint: 'integrations/zoom/account-settings',
    params: { zoom_oauth_credential_id: zoomCredentialId },
    enabled: !!zoomCredentialId
  });
};

export const usePatchZoomAccountSettings = () => {
  return useLambdaMutation({
    method: 'PATCH',
    endpoint: 'integrations/zoom/account-settings'
  });
};

export const useZoomUsers = (zoomCredentialId) => {
  return useLambdaQuery({
    method: 'GET',
    endpoint: 'integrations/zoom/users',
    params: { zoom_oauth_credential_id: zoomCredentialId },
    enabled: !!zoomCredentialId
  });
};

export const useZoomUserSettings = (zoomCredentialId, userId) => {
  return useLambdaQuery({
    method: 'GET',
    endpoint: 'integrations/zoom/user-settings',
    params: { zoom_oauth_credential_id: zoomCredentialId, user_id: userId },
    enabled: !!zoomCredentialId
  });
};

export const useZoomMeetingRecordingStatus = (
  zoomCredentialId,
  meetingId,
  foraMeetingId,
  enabled
) => {
  return useLambdaQuery(
    {
      method: 'GET',
      endpoint: 'integrations/zoom/meeting-recording-status',
      params: {
        zoom_oauth_credential_id: zoomCredentialId,
        meeting_id: meetingId,
        fora_meeting_id: foraMeetingId
      },
      enabled: !!zoomCredentialId && !!meetingId && enabled
    },
    { staleTime: minutes(10) }
  );
};

export const usePostZoomDownloadMeetingRecording = () => {
  return useLambdaMutation({
    method: 'POST',
    endpoint: 'integrations/zoom/download-meeting-recording'
  });
};

export const usePatchZoomUserSettings = () => {
  return useLambdaMutation({
    method: 'PATCH',
    endpoint: 'integrations/zoom/user-settings'
  });
};

export const usePostConvertFromVideo = () => {
  return useLambdaMutation({
    method: 'POST',
    endpoint: 'meetings/convert-from-video'
  });
};

export const useViews = (meetingId) => {
  return useLambdaQuery({
    method: 'GET',
    params: { meeting_id: meetingId },
    endpoint: 'meetings/views'
  });
};

const CHAT_ENDPOINTS = [
  'meeting-chat',
  'custom-summary-chat',
  'earnings-call-chat',
  'card-explorer-chat',
  'card-search-chat'
];
export const sendChatMessage = (endpoint, data) => {
  if (!endpoint) {
    throw new Error('[sendChatMessage] No chat endpoint provided');
  } else if (!CHAT_ENDPOINTS.some((ep) => ep === endpoint)) {
    throw new Error('[sendChatMessage] Invalid endpoint provided');
  }
  return makeLambdaRequest({
    method: 'POST',
    endpoint,
    data
  });
};

// gets recommended prompts for the card explorer chat based on sources
// @param data should just look like { sources: [<ConversationSource>]}
export const getCardExplorerChatRecommendedPrompts = (data) => {
  if (!data.sources?.length)
    return ['What surprising relationships do you notice between these summaries?']; // default
  return makeLambdaRequest({
    method: 'POST',
    endpoint: 'card-explorer-recommend-prompts',
    data
  });
};

export const useMeetingChat = () => {
  return useLambdaMutation({
    method: 'POST',
    endpoint: 'meeting-chat'
  });
};

export const useGetConversations = (meetingId) => {
  return useLambdaQuery({
    method: 'GET',
    endpoint: 'conversations',
    params: {
      meetingId
    }
  });
};

export const useSetConversations = () => {
  return useLambdaMutation({
    method: 'POST',
    endpoint: 'conversations'
  });
};

export const useGenerateLabelPrompts = () => {
  return useLambdaMutation({
    method: 'POST',
    endpoint: 'label-prompts/generate-label-prompts'
  });
};

/**
 * Fully processes provided channel and generates cards, if applicable
 * @param {string} channelId - Channel to process
 * @param {object} [params] - additional request params
 * @returns {Promise<string>} - Success or error message
 */
export const processChannelById = (channelId, params = {}) =>
  makeLambdaRequest({
    method: 'POST',
    endpoint: 'channel/process-channel-by-id',
    data: { channel_id: channelId },
    params
  });

export const getOktaToken = (subdomain, code, codeVerifier, redirectUri) =>
  makeLambdaRequest({
    method: 'GET',
    endpoint: 'okta/token',
    params: {
      subdomain,
      code,
      code_verifier: codeVerifier,
      redirect_uri: redirectUri
    }
  });

export const getOktaConfig = (subdomain) =>
  makeLambdaRequest({
    method: 'GET',
    endpoint: 'okta/config',
    params: {
      subdomain
    }
  });

export const getPresignedUrl = ({ command, bucket, fileName }) =>
  makeLambdaRequest({
    method: 'POST',
    endpoint: 'general/s3-presigned-url',
    data: {
      command,
      bucket,
      file_name: fileName
    }
  });
