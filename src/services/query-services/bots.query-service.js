import Axios from 'axios';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { identity } from 'lodash-es';

import {
  getByAttribute,
  useDelete,
  useGetByAttributeQuery,
  useGetByIdQuery,
  useSearchQuery,
  getOptimisticUpdateMutateOptions
} from './default.query-service';

import RecallService from '@services/recall.service';
import { useStyledToast } from '@util/hooks';
import { useState } from 'react';
const recallService = RecallService.getInstance();

const model = 'recall/bots';

const defaultBody = { sort: 'created_at', asc: false, pageSize: 1000 };

/** @type {(id: string) => import('axios').AxiosResponse<{title: string, url: string}>} */
export async function getBotVideoUrl(id) {
  const res = await Axios({
    method: 'GET',
    url: `${model}/${id}/video`
  });

  const videoUrl = res?.data?.url;

  // Fetch only the headers to get the content type
  const video = await Axios({
    method: 'GET',
    url: videoUrl,
    headers: {
      Range: 'bytes=0-1'
    }
  });

  return { ...res?.data, contentType: video.headers['content-type'] };
}

export const getBotTranscript = async (id) =>
  getByAttribute({ model, id, attribute: 'transcripts' });

export const useBotTranscripts = useGetByAttributeQuery({
  model,
  attribute: 'transcripts'
});

/** @type {useGetByAttributeQuery<any>} */
export const useBotVideoUrl = (id, queryOptions = {}) => {
  return useQuery({
    queryKey: [model, 'video', id],
    queryFn: () => getBotVideoUrl(id),
    ...queryOptions
  });
};

/** @type {useSearchQuery<BotSearchRequest, Bot>} */
export const useBots = useSearchQuery({ model, defaultBody });

/** @type {useGetByIdQuery<Bot>} */
export const useBotById = useGetByIdQuery({ model });

/** @type {useGetByAttributeQuery<string>} */
export const useBotAsVTT = useGetByAttributeQuery({ model, attribute: 'vtt' });

/** @type {useDelete<Bot>} */
export const useRemoveBot = useDelete({ model });

const recordingControlCall = async (id, action, message) => {
  const { data: botData } = await Axios({
    method: 'POST',
    url: `/${model}/${id}/${action}`
  });
  await recallService.sendChat(message, id);
  return botData;
};
const pauseBot = async (id) => recordingControlCall(id, 'pause', 'Recording paused');
const resumeBot = async (id) => recordingControlCall(id, 'resume', 'Recording resumed');

const useRecordingControlMutation = (newStatusCode, actionFnCall) => {
  return (_mutateOptions = {}) => {
    const queryClient = useQueryClient();

    const { optimisticUpdateConfig, ...mutateOptions } = _mutateOptions;

    const idUpdaterFn = (previous) => {
      if (!previous) {
        return undefined;
      }
      return {
        ...previous,
        status_changes: [
          ...previous.status_changes,
          { code: newStatusCode, created_at: new Date() }
        ]
      };
    };

    return useMutation({
      mutationFn: ({ id }) => actionFnCall(id),
      ...getOptimisticUpdateMutateOptions(
        queryClient,
        model,
        optimisticUpdateConfig,
        identity,
        identity,
        idUpdaterFn
      ),
      ...mutateOptions
    });
  };
};
export const usePauseBot = useRecordingControlMutation('in_call_not_recording', pauseBot);
export const useResumeBot = useRecordingControlMutation('in_call_recording', resumeBot);

export const useDownloadVideo = () => {
  const toast = useStyledToast();
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const download = (url, title) => {
    setDownloading(true);
    toast({ title: 'Download Started. File Will Appear in Browser Downloads When Completed.' });
    const save = (blob) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = title;
      link.click();
      setDownloading(false);
      setDownloadProgress(0);
      toast({ status: 'success', title: 'Download Complete' });
    };
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob';
    xhr.onprogress = (e) => setDownloadProgress(parseInt((e.loaded / e.total) * 100));
    xhr.onload = () => save(xhr.response);
    xhr.onerror = () => {
      setDownloading(false);
      setDownloadProgress(0);
      toast({ status: 'error', title: 'Download Failed. Please try again.' });
    };
    xhr.send();
  };

  return { downloading, downloadProgress, download };
};
