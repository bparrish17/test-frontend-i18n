import { useConst } from '@chakra-ui/react';
import { useQueryParam, NumberParam, withDefault } from 'use-query-params';
import { useCallback, useEffect } from 'react';
import { isToday as getIsToday, addDays, subDays, format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';
import { set, isEmpty } from 'lodash-es';

import { useNylasAccountStatus } from '@services/query-services/nylas.query-service';
import { useCalendars } from '@services/query-services/calendars.query-service';
import {
  searchAgendaMeetings,
  useArchiveMeeting
} from '@services/query-services/meetings.query-service';
import { useUserStore } from '@store/app.store';
import { useCardActions, useClock, useMeetingMetaActions, useStyledToast } from '@util/hooks';

export const usePrefetchAgendaMeetings = () => {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();

  const prefetch = async (selectedDate) =>
    await queryClient.prefetchQuery({
      queryKey: ['meetings', 'agenda', format(selectedDate, 'M/dd/yyyy')],
      queryFn: () => searchAgendaMeetings(selectedDate, user)
    });

  return prefetch;
};

/**
 * Hook to share scrolling between days in the agenda page and app header (if scrolled down)
 * This makes sure we're sharing the exact same values and functionality across both usages.
 * - Also note this requires the useAgendaMeetings query calls to be prefetched to have the same
 *   search body as this hook so that the correct queryKey is being prefetched
 */
export const useAgendaDateScroll = () => {
  const user = useUserStore((state) => state?.user);
  const today = useConst(Date.now());
  const [selectedDate, _setSelectedDate] = useQueryParam('date', withDefault(NumberParam, today));
  const currentTime = useClock('p');
  const isToday = getIsToday(selectedDate);

  const prefetchMeetings = usePrefetchAgendaMeetings();

  useEffect(() => {
    if (user?.id) {
      prefetchMeetings(addDays(selectedDate, 1));
      prefetchMeetings(subDays(selectedDate, 1));
    }
  }, [user?.id]);

  const handlePrevDayClick = useCallback(() => {
    prefetchMeetings(subDays(selectedDate, 2));
    _setSelectedDate(subDays(selectedDate, 1).getTime(), 'replaceIn');
  }, [selectedDate, _setSelectedDate]);

  const handleNextDayClick = useCallback(() => {
    prefetchMeetings(addDays(selectedDate, 2));
    _setSelectedDate(addDays(selectedDate, 1).getTime(), 'replaceIn');
  }, [selectedDate, _setSelectedDate]);

  const handleBackToTodayClick = useCallback(
    () => _setSelectedDate(Date.now(), 'replaceIn'),
    [_setSelectedDate]
  );

  const setSelectedDate = useCallback(
    (date) => {
      prefetchMeetings(date);
      _setSelectedDate(date, 'replaceIn');
    },
    [_setSelectedDate]
  );

  return {
    selectedDate,
    setSelectedDate,
    currentTime,
    isToday,
    handlePrevDayClick,
    handleNextDayClick,
    handleBackToTodayClick
  };
};

/**
 * @typedef {'isLoading' | 'errorNoNylasAccount' | 'errorInvalidNylasAccount' | 'errorNoCalendars' | 'successNoMeetings' | 'successFewMeetings' | 'successManyMeetings'} AgendaState
 * @param {{ isMeetingsLoading: boolean; isMeetingsSuccess: boolean; meetings: Meeting[], user: User{} }}
 * @returns {AgendaState}
 */
export function useAgendaState({ isMeetingsLoading, isMeetingsSuccess, meetings, user }) {
  const { data: nylasAccount, isLoading: isAccountStatusLoading } = useNylasAccountStatus();
  const { data: calendars, isLoading: isLoadingCalendars } = useCalendars({ creator_id: user?.id });

  const nylasStatus = nylasAccount?.status;
  if (isAccountStatusLoading || isMeetingsLoading || isLoadingCalendars) {
    return 'isLoading';
  } else if (nylasStatus === 'noAccount') {
    if (isEmpty(calendars)) return 'errorNoNylasAccount';

    return 'errorInvalidNylasAccount';
  } else if (nylasStatus === 'invalidAccount') {
    return 'errorInvalidNylasAccount';
  } else if (!nylasAccount?.num_of_calendars) {
    return 'errorNoCalendars';
  } else if (nylasStatus === 'validAccount' && nylasAccount?.value?.expired_at) {
    return 'errorInvalidNylasAccount';
  } else if (isMeetingsSuccess) {
    if (meetings?.length === 0) {
      return 'successNoMeetings';
    } else if (meetings?.length < 4) {
      return 'successFewMeetings';
    } else {
      return 'successManyMeetings';
    }
  }
}

/**
 * Helper wrapper for performing actions on shared agenda queries
 * @param {Date} selectedDate
 * @returns {{ onCardActionClick: () => void; onMeetingActionClick: () => void }}
 */
export function useAgendaMeetingActions(selectedDate) {
  const agendaQueryKey = ['agenda', format(selectedDate, 'M/dd/yyyy')];
  const toast = useStyledToast();
  const queryClient = useQueryClient();
  const { mutate: archiveMeeting } = useArchiveMeeting({
    optimisticUpdateConfig: {
      enabled: true,
      type: 'search',
      queryKeyToUpdate: agendaQueryKey,
      updaterFn: (previous, mutationVars) =>
        previous?.filter((meeting) => meeting?.id !== mutationVars.id)
    }
  });

  const onCardActionClick = useCardActions({
    type: 'search',
    model: 'meetings',
    queryKeyToUpdate: agendaQueryKey,
    updaterFn: (prev, mutationVars) => {
      const { action, id, value } = mutationVars;
      return prev.map((prevMeeting) => {
        if (prevMeeting?.card?.id === id) {
          if (action === 'save') {
            set(prevMeeting, ['card', 'preferred'], value);
          } else if (action === 'archive') {
            set(prevMeeting, ['card', 'archived'], value);
          } else if (action === 'share') {
            set(prevMeeting, ['card', 'shared_at'], new Date());
          }
        }
        return prevMeeting;
      });
    }
  });

  const onMeetingMetaActionClick = useMeetingMetaActions({
    type: 'search',
    queryKeyToUpdate: agendaQueryKey
  });

  const onMeetingActionClick = (action, value, meeting) => {
    if (action === 'archive') {
      archiveMeeting(
        { id: meeting?.id },
        {
          onSuccess: () => {
            // meeting/:id/archive also removes the related summaries and insight sources from that meeting, so need to invalidate those models
            queryClient.invalidateQueries(['cards']);
            queryClient.invalidateQueries(['insights']);
            toast({ status: 'success', title: 'Meeting Successfully Deleted' });
          },
          onError: () => {
            toast({
              status: 'error',
              title: 'Something went wrong while deleting meeting. Please try again.'
            });
          }
        }
      );
    } else {
      onMeetingMetaActionClick(action, value, meeting);
    }
  };
  return { onCardActionClick, onMeetingActionClick };
}
