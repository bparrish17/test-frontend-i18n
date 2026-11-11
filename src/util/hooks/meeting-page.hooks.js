import { useQueryParam, BooleanParam, withDefault } from 'use-query-params';
import { map, uniqBy, mapValues, keyBy, filter, flatten, isEmpty, get, debounce } from 'lodash-es';
import { createRef, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useRollbar } from '@rollbar/react';
import pluralize from 'pluralize';

import {
  useAllMeetingContentById,
  useMeetingsQueries
} from '@services/query-services/meetings.query-service';
import { useApolloPeople } from '@services/query-services/apollo.query-service';
import { usePeople } from '@services/query-services/people.query-service';
import { useUserStore } from '@store/app.store';
import {
  useCallEndedEvent,
  useInWaitingRoomEvent,
  usePusherChannel,
  usePusherEvent,
  useMeetingTimeStatus,
  useMeetingBotStatuses,
  useTopicGroupsAndSummaries,
  useStyledToast
} from '@util/hooks';
import {
  addMeetingDataToNylasAttendee,
  getPriorMeetingsSectionsSearchBodies,
  hours,
  populateNylasAttendee,
  keyApolloProfilesByEmails,
  checkIsOldSummary,
  selectAndSortCards,
  isSafariMobile,
  getCardSourceLink,
  mergeAttendeesWithSpeakers,
  getSpeakerTimesMap
} from '@util/helpers';
import {
  SFBoltFillIcon,
  SFCalendarIcon,
  SFChecklistIcon,
  SFLensIcon,
  SFLightbulbOutlinedIcon,
  SFMagnifyPlusIcon,
  SFScreensIcon,
  SFTwoPersonOutlinedIcon
} from '@assets/icons';
import { BOT_ATTENDEE_EMAILS } from '@util/constants';
import { meetingIdWithBot, isUserWithAccess } from '@util/helpers/meetings.helpers';
import { useCards } from '@services/query-services/cards.query-service';
import { useContacts } from '@services/query-services/contacts.query-service';

/**
 * @param {Meeting} meeting
 * @returns {{ title: string, priorMeetings: Meeting[]}[]}
 */
export const usePriorMeetingsSections = (meeting, attendees) => {
  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;

  const sectionsSearchBodies = useMemo(() => {
    if (!isGuest && meeting && attendees) {
      return getPriorMeetingsSectionsSearchBodies(meeting, attendees, user);
    }
    return [];
  }, [meeting, attendees]);

  const results = useMeetingsQueries(sectionsSearchBodies.map((s) => s.searchBody));
  const sections = results
    .map((result, i) => ({
      title: `Prior Meetings ${sectionsSearchBodies[i].sectionDescriptor}`,
      searchBody: sectionsSearchBodies[i].searchBody,
      priorMeetings: result.data
    }))
    .filter((section) => section.priorMeetings?.length > 0);

  return sections;
};

/**
 * Given a set of meetings
 *
 * 1. Get unique participants across meetings
 *    - add meeting-relevant data to their object for access later
 * 2. Populate unique participants with internal and apollo data as relevant
 * 3. Iterate over every participant
 *    - Add apollo and internal data as relevant
 *    - Add their relevant apollo organization data to a populatedOrganization map if it does not exist
 *    - Add their meeting attendance to that organization
 *
 * I'm sorry for this abomination, it is SLOW AF, reskin todo: Fix when we have time
 */
export const usePopulateMeetingAttendees = (meetings, enabled = false) => {
  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;

  const { allNylasAttendees, uniqNylasAttendees, internalAttendees, filteredAttendees } =
    useMemo(() => {
      if (!enabled) return {};
      const nylasParticipants = meetings?.reduce(addMeetingDataToNylasAttendee, []);
      const allNylasAttendees = flatten(nylasParticipants);
      const filteredAttendees = filter(
        allNylasAttendees,
        (a) => !BOT_ATTENDEE_EMAILS.includes(a?.email)
      );

      // TODO: Eventually support > 100 attendees on agenda page
      const uniqNylasAttendees = uniqBy(filteredAttendees, 'email').slice(0, 99);

      return {
        allNylasAttendees,
        uniqNylasAttendees,
        internalAttendees: filter(uniqNylasAttendees, { external: false }),
        filteredAttendees
      };
    }, [meetings]);

  const {
    data: fullInternalAttendeeMap,
    isFetched: areInternalPeopleFetched,
    isLoading: isPeopleLoading
  } = usePeople(
    { emails: map(internalAttendees, 'email') },
    {
      enabled: internalAttendees?.length > 0 && !!(user && !isGuest),
      select: (attendees) => keyBy(attendees, 'email')
    }
  );

  // get apollo data for each attendee
  const {
    data: fullApolloAttendeeMap,
    isFetched: areApolloPeopleFetched,
    isLoading: isApolloPeopleLoading
  } = useApolloPeople(map(uniqNylasAttendees, 'email'), {
    staleTime: hours(8),
    retry: false,
    enabled: uniqNylasAttendees?.length > 0,
    select: keyApolloProfilesByEmails
  });

  const {
    data: contactAttendeeMap,
    isFetched: areContactsFetched,
    isLoading: isContactsLoading
  } = useContacts(
    { emails: map(uniqNylasAttendees, 'email') },
    {
      enabled: !isGuest && uniqNylasAttendees?.length > 0,
      select: (contacts) => keyBy(contacts, 'email')
    }
  );

  const isAttendeesPopulating =
    (isPeopleLoading || isApolloPeopleLoading || isContactsLoading) &&
    allNylasAttendees?.length > 0;

  const populatedData = useMemo(() => {
    if (
      allNylasAttendees?.length === 0 ||
      !areInternalPeopleFetched ||
      !areApolloPeopleFetched ||
      !areContactsFetched ||
      (isEmpty(fullApolloAttendeeMap) && isEmpty(contactAttendeeMap))
    ) {
      return null;
    }

    const populatedAttendees = [];
    const populatedOrganizationsMap = {};
    allNylasAttendees.forEach((nylasAttendee) => {
      const email = nylasAttendee?.email;
      const fullInternalData = get(fullInternalAttendeeMap, [email]);
      const fullApolloData = fullApolloAttendeeMap[email];
      const fullContactData = contactAttendeeMap ? contactAttendeeMap[email] : {};
      const populatedAttendee = populateNylasAttendee(
        nylasAttendee,
        fullApolloData,
        fullInternalData,
        fullContactData
      );
      populatedAttendees.push(populatedAttendee);
      if (fullApolloData) {
        let _populatedOrganization = populatedOrganizationsMap[fullApolloData.organization_id];
        if (!_populatedOrganization) {
          _populatedOrganization = fullApolloData?.organization;
          _populatedOrganization.meetings = { [populatedAttendee.meetingId]: 1 };
          populatedOrganizationsMap[fullApolloData.organization_id] = _populatedOrganization;
        } else {
          const existingMeeting = _populatedOrganization.meetings[populatedAttendee.meetingId];
          if (existingMeeting) _populatedOrganization.meetings[populatedAttendee.meetingId] += 1;
          else _populatedOrganization.meetings[populatedAttendee.meetingId] = 1;
        }
      }
    });

    const populatedOrganizations = map(populatedOrganizationsMap);

    return { populatedAttendees, populatedOrganizations, isAttendeesPopulating };
  }, [
    allNylasAttendees,
    fullInternalAttendeeMap,
    areInternalPeopleFetched,
    areApolloPeopleFetched,
    fullApolloAttendeeMap,
    areContactsFetched,
    contactAttendeeMap
  ]);

  if (isGuest) {
    // Guests don't get any special attendee information, just return
    // the filtered list of attendees on the meeting
    return {
      populatedAttendees: filteredAttendees,
      populatedOrganizations: null,
      isAttendeesPopulating: false
    };
  }

  return (
    populatedData ?? {
      populatedAttendees: null,
      populatedOrganizations: null,
      isAttendeesPopulating
    }
  );
};

export const useGeneratedCardData = (card, meeting, user, getGeneratingSummary) => {
  const cardsBySource = {
    source_data_id: card?.source_data?.id || meeting?.linked?.id || meeting?.id,
    person_id: user?.id,
    initiative_type: null,
    archived: false,
    pageSize: 50
  };

  const { data: fetchedCards, isLoading } = useCards(cardsBySource, {
    enabled: !!(user && !user?.isGuest),
    select: (cards) =>
      selectAndSortCards(cards, card, getGeneratingSummary, meetingIdWithBot, meeting)
  });

  if (user?.isGuest) {
    return {
      cardsBySource,
      allCards: [card],
      isLoading: false
    };
  }

  const allCards = fetchedCards ?? [];
  return { cardsBySource, allCards, isLoading };
};

// everything related to fetching meeting data
const useFetchMeetingData = (meetingId, isReplay) => {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const isCustomSummaryModalOpen = useUserStore((state) => state.isCustomSummaryModalOpen);
  const getGeneratingSummary = useUserStore((state) => state.getGeneratingSummary);
  const removeGeneratingSummary = useUserStore((state) => state?.removeGeneratingSummary);
  const toast = useStyledToast();
  const navigate = useNavigate();
  const rollbar = useRollbar();

  const {
    data: allMeetingContent,
    isLoading,
    refetch: refetchMeetingContent,
    error,
    isError,
    fetchStatus
  } = useAllMeetingContentById(meetingId, isReplay, { enabled: !!meetingId });

  const meeting = { ...allMeetingContent?.value, videoUrl: allMeetingContent?.videoUrl };
  const bot = allMeetingContent?.bot;
  const card = allMeetingContent?.card;

  useEffect(() => {
    if (isError) handleMeetingError({ error, toast, navigate, rollbar, meetingId });
  }, [isError, error]);

  // https://foraday.atlassian.net/browse/FORA-854
  // if a meeting is sensitive, only participants of the meeting should have access
  useEffect(() => {
    if (!isUserWithAccess(user, meeting)) {
      const toastId = 'no-meeting-access';
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          status: 'warning',
          duration: 6000,
          position: 'bottom',
          title: 'You do not have access to this meeting.',
          isClosable: true
        });
      }

      navigate('/');
    }
  }, [meeting]);

  const { channel: userIdChannel } = usePusherChannel(user?.id);

  // listen for new card and refresh the meeting content
  // FYI: This hijacks the "main" new card hook defined in: src/layouts/page.layout.jsx
  // so we'll need fallback to usePusherCardNotifications here when the new card
  // is not related to the current meeting page
  const handleNewCard = useCallback(
    debounce((newCard) => {
      if (isCustomSummaryModalOpen) {
        return;
      }
      const meetingId = meetingIdWithBot(meeting);
      if (newCard?.source_data?.id === meetingId) {
        removeGeneratingSummary();
        refetchMeetingContent();

        queryClient.invalidateQueries({
          queryKey: ['cards'],
          refetchActive: true,
          refetchInactive: true
        });

        const toastId = 'custom-summary-toast';
        if (!toast.isActive(toastId)) {
          toast({
            id: toastId,
            duration: 6000,
            position: 'bottom',
            title: 'New Summary Available',
            isClosable: true
          });
        }
      } else {
        const toastId = 'pusher-card-toast';
        const detailsLink = getCardSourceLink(newCard, true, user) || '/summaries';
        if (!toast.isActive(toastId)) {
          toast({
            id: toastId,
            duration: 6000,
            position: 'bottom',
            title: 'New Summary Available',
            isClosable: true,
            actionText: 'View',
            onActionClick: () => {
              navigate(detailsLink);
            }
          });
        }
      }
    }, 5000),
    [
      meeting,
      meetingIdWithBot,
      refetchMeetingContent,
      removeGeneratingSummary,
      queryClient,
      toast,
      navigate
    ]
  );
  usePusherEvent(userIdChannel, 'on_new_card', handleNewCard);

  const { populatedAttendees, populatedOrganizations: organizations } = usePopulateMeetingAttendees(
    [meeting],
    !!meeting
  );

  const speakerMap = getSpeakerTimesMap(bot);
  const attendees = mergeAttendeesWithSpeakers(populatedAttendees, speakerMap);

  const {
    cardsBySource,
    allCards,
    isLoading: isAllCardsLoading
  } = useGeneratedCardData(card, meeting, user, getGeneratingSummary);

  const thumbnailQueryResult = useVideoThumbnail(meeting);

  return {
    meeting,
    bot,
    card,
    allCards,
    isAllCardsLoading,
    cardsBySource,
    attendees,
    organizations,
    isLoading,
    fetchStatus,
    refetchMeetingContent,
    thumbnailQueryResult
  };
};

export const handleMeetingError = ({ error, toast, navigate, rollbar, meetingId }) => {
  if (!error) return;

  let toastId;
  let title;

  if (error.status === 401) {
    toastId = 'no-meeting-access';
    title = 'You do not have access to this meeting.';
  } else if (error.status === 404) {
    toastId = 'meeting-not-found';
    title = 'This meeting cannot be found, please try again.';
  } else {
    toastId = 'error-loading-meeting';
    title = 'Failed to load meeting data, please try again.';
  }

  rollbar?.error('User encountered error loading meeting data', error.response?.data, {
    meetingId
  });

  if (!toast.isActive(toastId)) toast({ id: toastId, status: 'warning', title });
  if ([401, 403, 404].includes(error.status)) navigate('/');
};

export const useMeetingPageState = (meetingId) => {
  const [isReplay, setIsReplay] = useQueryParam('replay', withDefault(BooleanParam, false));
  const toast = useStyledToast();
  const {
    meeting,
    bot,
    card,
    allCards,
    isAllCardsLoading,
    cardsBySource,
    attendees,
    organizations,
    isLoading: isContentLoading,
    fetchStatus,
    refetchMeetingContent,
    thumbnailQueryResult
  } = useFetchMeetingData(meetingId, isReplay);
  const { isCallEnded } = useMeetingBotStatuses(bot);
  const meetingTimeStatus = useMeetingTimeStatus(meeting);
  const meetingHasBot = !!(meeting?.bot_id || meeting?.linked?.bot_id); // duplicate of meetingBotStatuses.botWasScheduled?

  const botIsActivelyFetching = isContentLoading && fetchStatus !== 'idle';
  const isLoadingBotData = meetingHasBot && (botIsActivelyFetching || isContentLoading);
  const isLoadingAll =
    isContentLoading || isLoadingBotData || isAllCardsLoading || thumbnailQueryResult.isLoading;

  const pusherChannel = usePusherChannel(bot?.id);
  const { topicGroups, ungroupedSummaries } = useTopicGroupsAndSummaries(meeting, bot);

  /* --- Pusher Event Handlers --- */

  const { channel } = pusherChannel;

  useCallEndedEvent(channel, () => {
    if (!toast.isActive('concluded')) {
      toast({ id: 'concluded', title: 'This Meeting Has Concluded' });
    }
    if (isReplay) {
      setIsReplay(false);
    }
    refetchMeetingContent();
  });

  useInWaitingRoomEvent(channel, () => {
    refetchMeetingContent();
  });

  const priorMeetingsSections = usePriorMeetingsSections(meeting, attendees);
  const isOldSummary = checkIsOldSummary(bot);

  const foraCards = allCards.filter((curCard) => {
    if (!curCard?.initiative) {
      return false;
    }
    const { id, tags } = curCard?.initiative ?? {};
    return id !== card?.initiative?.id && tags?.[0] !== 'template';
  });

  /** @type {MeetingPageSection[]} */
  const sections = useMemo(() => {
    const sectionsConfig = {
      meetingSummary: {
        enabled: !!card || !!bot?.recap,
        name: `Your ${pluralize('Summary', allCards?.length)}`,
        icon: SFChecklistIcon,
        order: 0
      },
      topicAnalysis: {
        enabled: !!bot?.topics,
        name: 'Topic Analysis',
        icon: SFBoltFillIcon,
        order: 1
      },
      meetingInsights: {
        enabled: !isContentLoading && (!!card || !!bot?.recap) && foraCards.length,
        name: 'Insights From Lenses',
        icon: SFLensIcon,
        order: 2
      },
      followUps: {
        // enabled if bot.followups is present or bot.summary includes "Potential Followups" (legacy)
        enabled: isCallEnded && (!!bot?.followups || bot?.summary?.includes('Potential Followups')),
        name: 'Follow-Ups',
        hideNavigation: isOldSummary,
        icon: SFLightbulbOutlinedIcon,
        order: 3
      },
      keyPoints: {
        enabled: isCallEnded ? !!bot?.summary : bot?.transcripts?.length > 0,
        name: 'Meeting Timeline',
        icon: SFMagnifyPlusIcon,
        order: 4
      },
      meetingPrep: {
        enabled: attendees?.length > 1 || organizations?.length,
        name: 'Meeting Prep',
        icon: SFScreensIcon,
        order: 5
      },
      attendees: {
        enabled: attendees?.length > 1 || organizations?.length,
        name: 'Attendees',
        icon: SFTwoPersonOutlinedIcon,
        order: 6
      },
      priorMeetings: {
        enabled: priorMeetingsSections?.length >= 1,
        name: 'Prior Meetings',
        icon: SFCalendarIcon,
        order: 7
      }
    };

    return mapValues(sectionsConfig, (section) => ({ ...section, ref: createRef() }));
  }, [
    isContentLoading,
    card,
    attendees?.length,
    organizations?.length,
    isCallEnded,
    isAllCardsLoading,
    !!bot?.summary,
    !!bot?.followups,
    isOldSummary,
    !!meeting?.preparation,
    bot?.transcripts?.length,
    priorMeetingsSections?.length,
    foraCards?.length
  ]);

  let isLoading = isLoadingAll;

  // if bot+meeting+card stopped loading, but we don't have enough sections to display, stop loading screen
  // this is a workaround for meetings that don't have enough data stuck in loading state
  if (
    !isContentLoading &&
    Object.values(sections)
      .map((s) => s.enabled)
      .filter(Boolean).length < 3
  ) {
    isLoading = false;
  }

  // if the thumbnail failed to load or it's trying to load before meeting is done, stop loading screen
  if (
    thumbnailQueryResult.isLoadingError ||
    (!isContentLoading && !isLoadingBotData && thumbnailQueryResult.isLoading && !isCallEnded)
  ) {
    isLoading = false;
  }

  return {
    isLoading,
    isContentLoading,
    meeting,
    bot,
    card,
    allCards,
    cardsBySource,
    priorMeetingsSections,
    meetingTimeStatus,
    topicGroups,
    ungroupedSummaries,
    attendees,
    organizations,
    sections,
    thumbnailQueryResult
  };
};

/** @type {import('@tanstack/react-query').UseQueryResult<{thumbnail: string, videoDuration: number}>} */
export const useVideoThumbnail = (meeting) => {
  const fetchThumbnail = useCallback((videoUrl) => {
    return new Promise((resolve, reject) => {
      if (!videoUrl) {
        return reject(new Error('No video URL'));
      }

      const videoElement = document.createElement('video');
      videoElement.crossOrigin = 'anonymous';
      videoElement.preload = 'metadata';
      videoElement.muted = true;
      videoElement.playsInline = true;
      videoElement.src = videoUrl;

      videoElement.style.display = 'none';
      document.body.appendChild(videoElement);

      const cleanup = () => {
        clearTimeout(timeoutId);
        videoElement.pause();
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.removeEventListener('error', handleError);

        if (isSafariMobile()) {
          videoElement.removeEventListener('canplay', handleSeeked);
        } else {
          videoElement.removeEventListener('seeked', handleSeeked);
        }

        videoElement.remove();
      };

      const handleLoadedMetadata = () => {
        const duration = videoElement.duration;
        const middleTime = duration / 2;

        if (typeof videoElement.fastSeek === 'function') {
          videoElement.fastSeek(middleTime);
        } else {
          videoElement.currentTime = middleTime;
        }
      };

      const handleSeeked = () => {
        const canvas = document.createElement('canvas');
        const compressionFactor = 0.5;
        canvas.width = videoElement.videoWidth * compressionFactor;
        canvas.height = videoElement.videoHeight * compressionFactor;

        const context = canvas.getContext('2d');
        context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve({ thumbnail: dataURL, videoDuration: videoElement.duration });

        canvas.remove();
        cleanup();
      };

      const handleError = (e) => {
        reject(new Error(`Error loading video: ${e.message}`));
        cleanup();
      };

      videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
      videoElement.addEventListener('error', handleError);

      if (isSafariMobile()) {
        videoElement.addEventListener('canplay', handleSeeked);
      } else {
        videoElement.addEventListener('seeked', handleSeeked);
      }

      const timeoutId = setTimeout(() => {
        reject(new Error('Timeout while loading video data'));
        cleanup();
      }, 10000);

      videoElement.load();
    });
  }, []);

  const hasVideoUrlInMeeting = !!meeting?.videoUrl;
  const videoUrl = meeting?.videoUrl;
  const queryKey = ['meetings', 'videoThumbnailData', meeting?.id];

  return {
    ...useQuery(queryKey, () => fetchThumbnail(videoUrl), {
      enabled: !!videoUrl,
      staleTime: Infinity,
      retry: false,
      refetchOnWindowFocus: false
    }),
    isLoadingError: !hasVideoUrlInMeeting
  };
};

/*
STASH:
---------------


// sometimes we have to derive the meeting data from the card, other times we have to derive from the meeting
const useFetchAndDeriveAllMeetingData = (meetingId, cardId, user) => {
  const cardQuery = useAllCardContentById(cardId, { enabled: !!cardId && !!user?.id });
  const meetingQuery = useAllMeetingContentById(meetingId, {
    enabled: !cardId && !!meetingId && !!user?.id
  });

  let meeting, bot, fetchedCard;

  if (cardId) {
    meeting = cardQuery?.data?.meeting;
    bot = cardQuery?.data?.bot;
    fetchedCard = cardQuery?.data?.value;
  } else {
    meeting = meetingQuery?.data?.value;
    bot = meetingQuery?.data?.bot;
    fetchedCard = meetingQuery?.data?.card;
  }

  const isLoading = cardId ? cardQuery.isLoading : meetingQuery.isLoading;
  const refetchMeetingContent = cardId ? cardQuery.refetch : meetingQuery.refetch;
  const isError = cardId ? cardQuery.isError : meetingQuery.isError;
  const fetchStatus = cardId ? cardQuery.fetchStatus : meetingQuery.fetchStatus;

  return {
    meeting,
    bot,
    fetchedCard,
    isLoading,
    refetchMeetingContent,
    isError,
    fetchStatus
  };
};
*/
