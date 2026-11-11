import { useUserStore } from '@store/app.store';
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query';
import { PEOPLE_ORG_STATS_PAGE_SIZE } from '@util/constants';
import {
  addFakeReplayBotData,
  checkForExpectedError,
  getUserAttendanceStatus,
  minutes,
  populateAgendaData,
  retryQueryWhen
} from '@util/helpers';
import Axios from 'axios';
import { endOfDay, format, startOfDay } from 'date-fns';
import { identity, omit } from 'lodash-es';
import {
  getById,
  getOptimisticUpdateMutateOptions,
  search,
  setAttribute,
  useCreate,
  useDeleteAttribute,
  useGetByAttributeQuery,
  useGetByIdQuery,
  useInfiniteSearchQuery,
  usePatch,
  useSetAttribute
} from './default.query-service';
import { useNylasAccountStatus } from './nylas.query-service';

const model = 'meetings';
const defaultBody = {
  pageSize: 250,
  sort: 'start_at',
  asc: false,
  not_canceled: true
};

async function matchMeetings(body) {
  return Axios({
    method: 'POST',
    url: `${model}/match`,
    data: body
  }).then((res) => res?.data);
}

async function scheduleBotForMeeting({ meetingId }) {
  return Axios({
    method: 'POST',
    url: `${model}/${meetingId}/schedule`,
    params: { wait: true },
    data: {}
  }).then((res) => res?.data);
}

async function startMeeting({ meetingId }) {
  return Axios({
    method: 'PUT',
    url: `${model}/${meetingId}/start`,
    data: {}
  }).then((res) => res?.data);
}

async function getParticipantsX(body) {
  return Axios({
    method: 'POST',
    url: `${model}/participantsX`,
    data: body
  }).then((res) => res?.data);
}

export async function searchAgendaMeetings(selectedDate, user) {
  const isReadOnlyUser = user?.type === 'Associate';
  const userParam = isReadOnlyUser
    ? { nylas_participant_emails: [user?.email] }
    : { creator_id: user?.id };

  const body = {
    sort: 'start_at',
    asc: true,
    creator_id: user?.id,
    start_at_from: startOfDay(selectedDate),
    start_at_to: endOfDay(selectedDate),
    not_canceled: true,
    pageSize: 100,
    ...userParam
  };

  let meetings = await search({ model, body });
  meetings = populateAgendaData(meetings, user);
  return meetings;
}

const getMeetingsQuery = ({ body, queryKey, queryOptions }) => ({
  queryKey: [model, queryKey ?? body],
  queryFn: () => search({ model, body: { ...defaultBody, ...body } }),
  ...omit(queryOptions, 'select')
});

/** @type {useSearchQuery<MeetingSearchRequest, Meeting>} */
export const useMeetings = (body, queryOptions = {}) =>
  useQuery(getMeetingsQuery({ body, queryOptions }));

/**
 * @param {MeetingSearchRequest[]} searchBodies
 * @param {UseQueryOptionsT<Meeting[]>} queryOptions
 * @returns {UseQueryResultT<Meeting[]>}
 */
export const useMeetingsQueries = (searchBodies, queryOptions = {}) => {
  return useQueries({
    queries: searchBodies?.map((body) => getMeetingsQuery({ body, queryOptions }))
  });
};

// Custom query to merge meetings with their linked meetings and fetch by a given day
/** @type {useSearchQuery<Date | Number, Meeting>} */
export const useAgendaMeetings = (selectedDate = 0, queryOptions = {}) => {
  const user = useUserStore((state) => state.user);

  return useQuery({
    queryKey: [model, 'agenda', format(new Date(selectedDate), 'M/dd/yyyy')],
    queryFn: () => searchAgendaMeetings(selectedDate, user),
    enabled: !!user?.id,
    ...queryOptions
  });
};

/**
 * Gets meeting participant stats based on the supplied meeting search criteria.
 * MUST supply 'domains' filter with at least one value.
 * @param {{ domains: string[] }} body
 * @param {import('@tanstack/react-query').QueryOptions} queryOptions
 * @returns
 */
export const useParticipantsX = (body, queryOptions = {}) => {
  return useQuery({
    queryKey: [model, 'participantsX', body],
    queryFn: () => getParticipantsX(body),
    ...queryOptions
  });
};

/**
 * Get "All" dynamic content associated with this meeting for the user
 * Returns the Meeting + its Bot (if there is one) + the user's Card for the meeting in question
 * @param {String} meetingId
 * @returns {AllMeetingContent}
 */
export const fetchAllMeetingDataById = async (meetingId) => {
  return Axios({
    method: 'GET',
    url: `${model}/${meetingId}/all`
  }).then((res) => res?.data);
};

/**
 * React query hook for aforementioned "Get All" call
 * @param {String} meetingId
 * @param {*} queryOptions
 * @returns
 */
export const useAllMeetingContentById = (meetingId, isReplay, queryOptions = {}) => {
  const replayQueryOptions = isReplay
    ? {
        refetchOnMount: false,
        cacheTime: minutes(30),
        staleTime: minutes(30)
      }
    : {};
  return useQuery({
    retry: retryQueryWhen(1, (err) => {
      const regex = /The Meeting with ID '[^']*' cannot be found\./;
      return !regex.test(err);
    }),
    queryKey: [model, { id: meetingId }, 'all'],
    queryFn: () =>
      fetchAllMeetingDataById(meetingId).then((meetingData) =>
        isReplay ? addFakeReplayBotData(meetingData) : meetingData
      ),
    ...queryOptions,
    ...replayQueryOptions
  });
};

/** @type {useGetByIdQuery<Bot>} */
export const useMeetingById = useGetByIdQuery({ model });

// Helper function to trigger a meeting page "view". Append the special header
// so that we can filter it out from the calls endpoint later. In the event
// of error we just ignore the call
export async function getMeetingView(meetingId) {
  try {
    await getById({
      model,
      id: meetingId,
      headers: { 'X-Fora-Actor': 'manual' }
    });
  } catch {}
}

/** @type {useInfiniteSearchQuery<MeetingSearchRequest, Meeting>} */
export const useInfiniteMeetings = useInfiniteSearchQuery({
  model,
  defaultBody
});

/** @type {useGetByAttributeQuery<Meeting>} */
export const usePriorMeeting = useGetByAttributeQuery({
  model,
  attribute: 'prior'
});

/** @type {useGetByAttributeQuery<Meeting>} */
export const usePriorMeetings = useGetByAttributeQuery({
  model,
  attribute: 'priors'
});

/** @type {useGetByAttributeQuery<any>} */
export const useMeetingViews = useGetByAttributeQuery({
  model,
  attribute: 'views'
});

/** @type {useCreate<Meeting>} */
export const useCreateMeeting = useCreate({ model });

/** @type {useSetAttribute<Meeting>} */
export const useShareMeeting = useSetAttribute({
  model,
  method: 'POST',
  attribute: 'share'
});

export const useUnshareMeeting = useDeleteAttribute({
  model,
  attribute: 'share'
});

/** @type {useSetAttribute<Meeting>} */
export const useArchiveMeeting = useSetAttribute({
  model,
  attribute: 'archive'
});

/** @type {usePatch<Meeting>} */
export const usePatchMeeting = usePatch({ model });

/** @type {useSetAttribute<Meeting>} */
export const useSetMeetingLabels = useSetAttribute({
  model,
  attribute: 'labels'
});

export const useScheduleBotForMeeting = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: scheduleBotForMeeting,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [model] });
    }
  });
};

/** @type {useDeleteAttribute<Meeting>} */
export const useUnscheduleBot = (queryParameters = { keep: true }) =>
  useDeleteAttribute({
    model,
    attribute: 'schedule',
    queryParameters
  })();

/** @type {useDeleteAttribute<Meeting>} */
export const useRemoveInitiativeFromMeeting = useDeleteAttribute({
  model,
  attribute: 'initiative'
});

/** @type {useSetAttribute<Meeting>} */
export const useUpdateMeetingInitiative = useSetAttribute({
  model,
  attribute: 'initiative'
});

export const useUpdateMeetingSensitivity = useSetAttribute({
  model,
  attribute: 'sensitive'
});

export const useStartMeeting = () => {
  return useMutation({
    mutationFn: startMeeting
  });
};

/** @type {useCreate<MeetingSearchRequest>} */
export const useMatchMeetings = (mutateOptions) => {
  const queryClient = useQueryClient();
  const mutationFn = (body) => matchMeetings(body);
  return useMutation({
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [model] });
    },
    onError: (error) => {
      console.error('Error matching meetings:', error);
    },
    mutationFn,
    ...mutateOptions
  });
};

export const useRSVP = (_mutateOptions = {}) => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state?.user);
  const isGuest = user?.isGuest;
  const { data: userNylasEmail } = useNylasAccountStatus({
    enabled: !!(user && !isGuest),
    select: (n) => n?.value?.email_address
  });
  const { optimisticUpdateConfig, ...mutateOptions } = _mutateOptions;

  const searchUpdaterFn = (previous, mutationVars) => {
    return [...previous]?.map((prev) => {
      if (prev.id === mutationVars.id) {
        const updatedParticipantIdx = prev.nylas?.participants.findIndex(
          (p) => p?.email === userNylasEmail || p?.email === user?.email
        );
        prev.nylas.participants[updatedParticipantIdx] = {
          ...prev.nylas?.participants[updatedParticipantIdx],
          status: mutationVars.status
        };
        prev.rsvp = getUserAttendanceStatus(prev, user);
      }
      return prev;
    });
  };

  const idUpdaterFn = (prev, mutationVars) => {
    const updatedParticipantIdx = prev.nylas?.participants.findIndex(
      (p) => p?.email === userNylasEmail || p?.email === user?.email
    );
    prev.nylas.participants[updatedParticipantIdx] = {
      ...prev.nylas?.participants[updatedParticipantIdx],
      status: mutationVars.status
    };
    prev.rsvp = getUserAttendanceStatus(prev, user);
    return prev;
  };

  return useMutation({
    mutationFn: ({ id, status }) =>
      setAttribute({ model, method: 'POST', attribute: 'rsvp' })({
        id,
        body: { status, notify: false }
      }).catch((err) => {
        const nylasError = checkForExpectedError(err, ['provider returned error']);
        if (nylasError) {
          return true;
        } else {
          throw err;
        }
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [model] });
    },
    ...getOptimisticUpdateMutateOptions(
      queryClient,
      model,
      optimisticUpdateConfig,
      searchUpdaterFn,
      identity, // add infinite optimistic updaterFn if relevant
      idUpdaterFn
    ),
    ...mutateOptions
  });
};

/**
 * Helper hook to invalidate all queries associated with a given meeting and ensure parity
 * between meeting details and agenda
 * @param {Meeting} meeting
 * @returns {() => void}
 */
export const useInvalidateMeetingQueries = (meeting, idQueryOptions = {}) => {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({
      queryKey: ['meetings', { id: meeting?.id }, 'all'],
      refetchType: 'all',
      ...idQueryOptions
    });
    queryClient.invalidateQueries({
      queryKey: ['meetings', 'agenda', format(new Date(meeting?.start_at ?? 0), 'M/dd/yyyy')],
      refetchType: 'all'
    });
  };
};

/**
 * https://foraday.atlassian.net/browse/FORA-854
 * Get the meeting access stats, for example:
  {
    "num_of_shares": 1,
    "num_of_participants": 2,
    "num_of_managers": 3,
    "num_of_collaborators": 4
  }
 * @param {String} meetingId
 * @returns {AccessStats | undefined}
 */
const getAccessStats = async (meetingId) => {
  return Axios({
    method: 'GET',
    url: `${model}/${meetingId}/access`
  }).then((res) => res?.data);
};

/**
 * @param {String} meetingId
 * @returns
 */
export const useGetAccessStats = (meetingId) => {
  return useQuery({
    queryKey: [model, 'accessStats', meetingId],
    queryFn: () => getAccessStats(meetingId),
    enabled: !!meetingId
  });
};

/**
 * @param {"organizations" | "participants"} type
 * @param {PersonOrgStatsParams} params
 * @returns {Promise<PersonOrgStats[]>}
 */
const getPersonOrgStats = async (
  {
    personId,
    domain,
    query = null,
    email,
    page = 1,
    days = 90,
    pageSize = PEOPLE_ORG_STATS_PAGE_SIZE
  },
  type = 'organizations'
) => {
  return Axios({
    method: 'GET',
    url: `${model}/${type}`,
    params: { personId, domain, email, query, days, page, pageSize }
  }).then((res) => res?.data);
};

/**
 * @param {"organizations" | "participants"} type
 * @returns {(
 *   params: PersonOrgStatsParams,
 *   queryOptions: UseQueryOptionsT<PersonOrgStats[]>
 * ) => UseQueryResultT<PersonOrgStats[]>}
 */
const _useStatsByType = (type) => (params, queryOptions) => {
  return useQuery({
    queryKey: [model, type, params],
    queryFn: () => getPersonOrgStats(params, type),
    ...queryOptions
  });
};

export const usePeopleStats = _useStatsByType('participants');
export const useOrganizationsStats = _useStatsByType('organizations');

const getExternalPersonOrgStatsByEmail = async ({ email, from, to }) => {
  return Axios({
    method: 'POST',
    url: `${model}/participants`,
    data: {
      nylas_participant_emails: [email],
      start_at_from: from,
      start_at_to: to
    }
  }).then((res) => res?.data);
};

export const useExternalPersonStatsByEmail = ({ email, from, to }, queryOptions) => {
  return useQuery({
    queryKey: [model, 'participants', email],
    queryFn: () => getExternalPersonOrgStatsByEmail({ email, from, to }),
    ...queryOptions
  });
};
