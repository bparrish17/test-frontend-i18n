import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import PusherService from '@services/pusher.service';
import { useUserStore } from '@store/app.store';
import { useInvalidateQueries } from './query.hooks';
import { useFeedPageFilters } from './feed.hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useStyledToast } from './general.hooks';
import { getCardSourceLink } from '@util/helpers';

const pusherService = PusherService.getInstance();

export function usePusherCardNotifications() {
  const toast = useStyledToast();
  const toastId = 'pusher-card-toast';
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const isCustomSummaryModalOpen = useUserStore((state) => state.isCustomSummaryModalOpen);
  const { channel } = usePusherChannel(user?.id);
  const { handleResetFilters } = useFeedPageFilters();
  const invalidateQueries = useInvalidateQueries();

  usePusherEvent(channel, 'on_new_card', (/** @type {Card} */ card) => {
    // Skip alerting for lens cards or if user is creating a custom summary
    if (card?.initiative?.type === 'Lens' || isCustomSummaryModalOpen) {
      return;
    }

    const detailsLink = getCardSourceLink(card, true, user) || '/summaries';

    if (!toast.isActive(toastId)) {
      toast({
        id: toastId,
        duration: 6000,
        position: 'bottom',
        title: 'New Summary Available',
        isClosable: true,
        actionText: 'View',
        onActionClick: async () => {
          if (detailsLink === '/summaries') {
            await invalidateQueries({ model: 'cards', refetchType: 'all' });
            handleResetFilters();
          }
          navigate(detailsLink);
        }
      });
    }
  });
}

export function usePusherLogout() {
  const user = useUserStore((state) => state.user);
  const { channel } = usePusherChannel(user?.id);
  const navigate = useNavigate();

  usePusherEvent(channel, 'force_logout', () => {
    navigate('/logout');
  });
}

/**
 * @typedef {Object} UsePusherChannelResult
 * @property {PusherChannel} channel
 * @property {() => void} destroyChannel
 *
 * @param {string} channelId
 * @returns {UsePusherChannelResult}
 */
export const usePusherChannel = (channelId) => {
  const [channel, setChannel] = useState(null);
  const [currChannelId, setCurrChannelId] = useState(null);

  const destroyChannel = useCallback(() => {
    if (channel) {
      channel.unbind();
      pusherService.unsubscribe(currChannelId);
    }
    setChannel(null);
  }, [channel, channelId]);

  useEffect(() => {
    if (channelId) {
      if (channel) {
        destroyChannel();
      }

      const pusherChannel = pusherService.subscribe(channelId);
      setChannel(pusherChannel);
      setCurrChannelId(channelId);
    }

    return () => {
      destroyChannel();
    };
  }, [channelId]);

  return { channel, destroyChannel };
};

/**
 * @param {PusherChannel} channel
 * @param {PusherEvent} eventName
 * @param {() => void} callback
 * @returns {void}
 */
export const usePusherEvent = (channel, eventName, callback) => {
  useEffect(() => {
    if (!channel) {
      return;
    }

    const wrappedCallback = (data) => {
      callback(data);
    };

    channel.bind(eventName, wrappedCallback);

    return () => {
      channel.unbind(eventName, wrappedCallback);
    };
  }, [channel, eventName, callback]); // Include `callback` in dependencies
};

/**
 * Primitive hook for handling Recall bot status changes
 * @param {PusherChannel} channel
 * @param {RecallStatusCode[]} codes
 * @param {() => void} callback
 * @returns {void}
 */
const useCallStatusChangeEvent = (channel, codes, callback) => {
  const templateCallback = useCallback(
    (data) => {
      if (!callback) {
        return;
      }
      if (codes.includes(data?.code)) {
        callback();
      }
    },
    [callback]
  );

  usePusherEvent(channel, 'status_changes', templateCallback);
};

export const useInCallRecordingEvent = (channel, bot, callback) => {
  useEffect(() => {
    if (bot?.status_changes?.some((sc) => sc?.code === 'in_call_recording')) {
      callback();
    }
  }, [bot, callback, channel]);
  useCallStatusChangeEvent(channel, ['in_call_recording'], callback);
};

export const useInWaitingRoomEvent = (channel, bot, callback) => {
  useEffect(() => {
    if (bot?.status_changes?.some((sc) => sc?.code === 'in_waiting_room')) {
      callback();
    }
  }, [bot, callback, channel]);
  useCallStatusChangeEvent(channel, ['in_waiting_room'], callback);
};

export const useCallEndedEvent = (channel, bot, callback) => {
  useEffect(() => {
    if (bot?.status_changes?.some((sc) => ['call_ended', 'done'].includes(sc?.code))) {
      callback();
    }
  }, [bot, callback, channel]);
  useCallStatusChangeEvent(channel, ['call_ended', 'done'], callback);
};

/**
 * Function to ingest pusher event (either status_changes or transcripts) and update the provided bot object with it
 * Depending on page, bot is either on the meeting (e.g. /meetings/search or its own separate property on the query e.g. /meetings/{id}/all)
 * So the consumer will have to provide the relevant queryKey to update and how it wants to update it with the updaterFn
 * @param {string} botId
 * @param {'status_changes' | 'transcripts'} eventName
 * @param {any[]} queryKey
 * @param {(previous, eventData, botId)} updaterFn
 *
 * Reskin Todo: disable this in the recent summaries feed
 */
export const useUpdateBotFromPusherEvent = (botId, eventName, queryKey, updaterFn) => {
  const queryClient = useQueryClient();
  const { channel } = usePusherChannel(botId);

  const handlePusherEvent = (eventData) => {
    if (!queryKey || !updaterFn) {
      return;
    }
    const previousRecords = queryClient.getQueryData(queryKey);

    if (!previousRecords) {
      console.warn('No record found in cache for queryKey: ', queryKey);
      return;
    }

    queryClient.setQueryData(queryKey, (previous) => updaterFn(previous, eventData, botId));
  };

  usePusherEvent(channel, eventName, handlePusherEvent);
};

/*

TODO: Add back in pusher subscription errors and channel destruction with better errors

**
 * @typedef {Object} UseMeetingPusherStatusProps
 * @property {Object} bot
 * @property {import('./pusher.hooks').UsePusherChannelResult} pusherChannel
 *
 * @param {UseMeetingPusherStatusProps} props
 * @returns {MeetingPusherStatus | undefined}
export const useMeetingPusherStatus = ({ bot, pusherChannel }) => {
  const { channel, destroyChannel } = pusherChannel;

  // here null indicates that Pusher is not connected
  const [pusherStatus, setPusherStatus] = useState('pending')

  // reskin todo: add this error handling back
  const handlePusherError = useCallback((error) => {
    const { status } = error;
    if (
      status === httpStatusCodesByName['Request Timeout'] ||
      status === httpStatusCodesByName['Service Unavailable']
    ) {
      destroyChannel();
      setPusherStatus('error');
    }
  }, []);

  usePusherEvent(channel, 'pusher:subscription_error', handlePusherError);
  usePusherEvent(channel, 'status_changes', (sc) => {
    refetchMeetingContent();
    if (sc?.code === 'in_call_recording') {
      setPusherStatus('running');
    } else if (sc?.code === 'call_ended') {
      setPusherStatus('completed');
    } else if (sc?.code === 'done') {
      refetchMeetingContent();
    }
  });

  return pusherStatus;
};

*/
