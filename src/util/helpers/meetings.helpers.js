import {
  map,
  pick,
  uniqBy,
  filter,
  flow,
  forEach,
  get,
  set as _set,
  isObject,
  isEmpty,
  mergeWith
} from 'lodash-es';
import {
  differenceInMinutes,
  differenceInMilliseconds,
  isBefore,
  isAfter,
  addMinutes
} from 'date-fns';
import {
  CheckIconBold,
  CloseIcon,
  QuestionIcon,
  TeamsIcon,
  ZoomLogoIcon,
  MeetLogoIcon,
  StatusRecordingIcon
} from '@assets/icons';
import { APOLLO_AVATAR_PLACEHOLDER_URL } from '@util/constants';
import { getEmailDomain, seconds } from '@util/helpers';

/**
 * @typedef {Object} AttendanceStatus
 * @property {string} name
 * @property {any} icon
 * @property {string} iconColor
 * @property {string} textColor
 */

/**
 * Returns the status (name, icon, color) of the user's attendance for a meeting
 * @param {Meeting} meeting
 * @param {Partial<{ id: string; email: string }} user
 * @returns {AttendanceStatus}
 */
export function getUserAttendanceStatus(meeting, user) {
  const status =
    meeting?.nylas?.participants?.find((p) => p.email === user?.email)?.status ?? 'noreply';
  const meetingLiveStatus = getMeetingTimeStatus(meeting, new Date());
  const isLive = meetingLiveStatus === 'live';

  // reskin todo: can remove once legacy MeetingCard is removed
  /** @type {{ [key: string]: AttendanceStatus }} */
  const futureAttendanceStatuses = {
    yes: {
      name: 'Attending',
      icon: CheckIconBold,
      iconColor: 'green_system.500',
      textColor: 'green_system.800'
    },
    no: {
      name: 'Not Attending',
      icon: CloseIcon,
      iconColor: 'red_system.400',
      textColor: 'red_system.800'
    },
    maybe: {
      name: 'Maybe',
      icon: QuestionIcon,
      textColor: 'surface.onSurfaceVariant'
    },
    noreply: {
      name: 'RSVP',
      icon: QuestionIcon,
      textColor: 'surface.onSurfaceVariant'
    }
  };

  // reskin todo: use `useMeetingTimeProgress` for this?
  // - also maybe not needed? cc: @K
  const elapsedMins = differenceInMinutes(new Date(), meeting?.start_at);
  const elapsedText = elapsedMins > 0 ? `${elapsedMins} min elapsed` : 'You attended this meeting';

  /** @type {{ [key: string]: AttendanceStatus }} */
  const pastAttendanceStatuses = {
    yes: {
      name: 'You Attended',
      icon: CheckIconBold,
      iconColor: 'green_system.500',
      textColor: 'green_system.800'
    },
    no: {
      // reskin todo: this text might not be correct moving forward, since they might have RSVP'd "No" but still attended
      name: isLive ? elapsedText : 'Did Not Attend',
      icon: CloseIcon,
      iconColor: 'red_system.400',
      textColor: 'red_system.800'
    },
    maybe: {
      name: 'Responded "Maybe"',
      icon: QuestionIcon,
      textColor: 'surface.onSurfaceVariant'
    },
    noreply: {
      name: isLive ? elapsedText : 'Did Not Attend',
      icon: QuestionIcon,
      textColor: 'surface.onSurfaceVariant'
    }
  };

  const futureAttendanceStatus =
    futureAttendanceStatuses[status] ?? futureAttendanceStatuses.noreply;
  const pastAttendanceStatus = pastAttendanceStatuses[status] ?? pastAttendanceStatuses.noreply;

  return meetingLiveStatus === 'upcoming'
    ? { status, ...futureAttendanceStatus }
    : { status, ...pastAttendanceStatus };
}

export function populateAgendaData(meetings, user) {
  const meetingsWithRSVP = meetings.map((m) => ({ ...m, rsvp: getUserAttendanceStatus(m, user) }));
  return meetingsWithRSVP.map(addConflictsToRSVP);
}

function addConflictsToRSVP(meeting, index, allMeetings) {
  const conflicts = {};

  if (meeting.rsvp.status === 'yes') {
    // Overlaps previous meeting
    if (index > 0) {
      const prevMeeting = allMeetings[index - 1];
      if (prevMeeting.rsvp.status === 'yes' && isBefore(meeting.start_at, prevMeeting.end_at)) {
        conflicts.previous = {
          meeting: pick(prevMeeting, ['id', 'title']),
          overlap: differenceInMinutes(prevMeeting.end_at, meeting.start_at)
        };
      }
    }

    // Overlaps next meeting
    if (index < allMeetings.length - 1) {
      const nextMeeting = allMeetings[index + 1];
      if (nextMeeting.rsvp.status === 'yes' && isAfter(meeting.end_at, nextMeeting.start_at)) {
        conflicts.next = {
          meeting: pick(nextMeeting, ['id', 'title']),
          overlap: differenceInMinutes(meeting.end_at, nextMeeting.start_at)
        };
      }
    }
  }

  return { ...meeting, rsvp: { ...meeting.rsvp, conflicts } };
}

// To ensure participant text is supported for both Meeting records and card.source_data
function getParticipantData(meetingOrSourceData) {
  const nylas = meetingOrSourceData.nylas;

  // two different potential nylas.organizer data structures for Nylas v3 vs Nylas v2
  const organizer = {
    name: nylas?.organizer?.name || nylas?.organizerName || meetingOrSourceData?.organizer?.name,
    email: nylas?.organizer?.email || nylas?.organizerEmail || meetingOrSourceData?.organizer?.email
  };

  const participants = nylas?.participants || meetingOrSourceData?.participants || [];

  return {
    participants,
    organizer,
    creatorName: meetingOrSourceData?.creator?.name
  };
}

export function getParticipantText(meeting) {
  const { participants, organizer, creatorName } = getParticipantData(meeting);

  const organizerText = organizer.name?.length > 0 ? organizer.name : organizer.email;
  const participantStrs = participants.map((p) => p.name ?? p.email);

  if (participants?.length < 1) {
    return creatorName ?? '';
  } else if (participants?.length < 3) {
    const invitee = participantStrs.find((p) => p !== organizer.name && p !== organizer.email);
    return `${organizerText}`.concat(invitee ? ` & ${invitee}` : '');
  } else {
    return `${organizerText}`.concat(` & ${participants?.length - 1} more`);
  }
}

export function getClosestMeetingStartTime(meetings) {
  const date = new Date();
  let closestMeetingIndex = 0;
  meetings.forEach((meeting, index) => {
    const diff = Math.abs(differenceInMilliseconds(meeting.start_at, date));
    const prevDiff = Math.abs(
      differenceInMilliseconds(meetings[closestMeetingIndex].start_at, date)
    );
    if (diff < prevDiff) {
      closestMeetingIndex = index;
    }
  });
  return closestMeetingIndex;
}

export function isExternalMeeting(participants, user) {
  if (!participants || participants.length < 1) {
    return false;
  }

  const userEmailDomain = getEmailDomain(user?.email);
  return participants?.some((p) => getEmailDomain(p.email) !== userEmailDomain);
}

/**
 * Handles the logic for determining the status of a meeting based on the current date-time
 * @param {Meeting} meeting
 * @param {Date} [date]
 * @returns {MeetingTimeStatus | null}
 */
export function getMeetingTimeStatus(meeting, date = new Date()) {
  if (!meeting) {
    return null;
  }

  if (isAfter(date, meeting?.start_at) && isBefore(date, meeting.end_at)) {
    return 'live';
  } else if (isAfter(date, meeting?.end_at)) {
    return 'done';
  }

  return 'upcoming';
}

/**
 * @param {Meeting} meeting
 * @param {object} user
 * @returns {{searchBody: object, sectionDescriptor: string}[]}
 */
export function getPriorMeetingsSectionsSearchBodies(meeting, attendees, user) {
  const nylasAttendees = meeting?.nylas?.participants ?? [];
  if (nylasAttendees?.length < 2) {
    return [];
  }

  const isReadOnlyUser = user?.type === 'Associate';
  const currentUserApolloAttendee = user?.apollo_profile;
  const isExternal = isExternalMeeting(nylasAttendees, user);
  const isOneOnOne =
    attendees?.length === 2 && attendees.some((p) => p.id === currentUserApolloAttendee?.id);

  const userParam = isReadOnlyUser
    ? { nylas_participant_emails: [user?.email] }
    : { creator_id: user?.id };
  const defaultSearchBody = {
    start_at_to: meeting?.start_at - 1,
    creator_id: user?.id,
    not_canceled: true,
    ...userParam
  };

  const sections = [];

  const addSection = (searchBody, sectionDescriptor) => {
    const mergedSearchBody = mergeWith({}, defaultSearchBody, searchBody, (objValue, srcValue) => {
      if (Array.isArray(objValue)) {
        return objValue.concat(srcValue);
      }
    });

    sections.push({ searchBody: mergedSearchBody, sectionDescriptor });
  };

  if (meeting?.parent_id) {
    addSection({ has_parent_id: true, parent_id: meeting?.parent_id }, 'In This Series');
  }

  if (isOneOnOne) {
    const otherParticipant = attendees?.find((p) => p.email !== user?.email);
    addSection(
      {
        nylas_participant_emails: [otherParticipant?.email]
      },
      `With ${otherParticipant?.name || '<' + otherParticipant?.email + '>'}`
    );
  }

  if (isExternal) {
    flow(
      (_attendees) => map(_attendees, 'organization'),
      (companies) => uniqBy(companies, 'id'),
      (uniqCompanies) =>
        filter(
          uniqCompanies,
          (company) => company?.id !== currentUserApolloAttendee?.organization?.id
        ),
      (externalCompanies) =>
        forEach(externalCompanies, (company) => {
          if (!company?.primary_domain) {
            return;
          }

          addSection(
            { nylas_participant_email_suffix: `@${company?.primary_domain}` },
            `With ${company?.name}`
          );
        })
    )(attendees);
  }

  return sections;
}

/**
 * @typedef {Object} MeetingSource
 * @property {string} name
 * @property {string} icon
 * @property {number} iconSize
 *
 * @param {Meeting} meeting
 * @returns {MeetingSource | null}
 */
export function getMeetingSource(meeting) {
  if (!meeting) {
    return null;
  }

  const hasHost = (host) => meeting?.url?.includes(host);
  if (hasHost('meet.google')) {
    return { name: 'Meet', icon: MeetLogoIcon, iconSize: 4 };
  } else if (hasHost('teams.microsoft.com')) {
    return { name: 'Teams', icon: TeamsIcon, iconSize: 5 };
  } else if (hasHost('zoom')) {
    return { name: 'Zoom', icon: ZoomLogoIcon, iconSize: 4 };
  } else if (hasHost('s3://fora-meeting-uploads')) {
    return { name: 'FORA Recording', icon: StatusRecordingIcon, iconSize: 4 };
  } else {
    return null;
  }
}

export function scrollToCurrentAgendaMeeting(meetings, meetingRefs, mainRef) {
  const meetingIndex = getClosestMeetingStartTime(meetings);
  const scrollTop = meetingRefs[meetingIndex]?.current?.offsetTop;
  if (mainRef.current) {
    mainRef.current.scrollTo({ top: scrollTop, behavior: 'smooth' });
  }
}

export function addMeetingDataToNylasAttendee(acc, meeting) {
  const participants = meeting?.nylas?.participants ?? [];
  const participantsToReturn = [
    ...acc,
    ...participants.map((p) => ({
      ...p,
      meetingId: meeting.id,
      isOrganizer: p.email === meeting?.nylas?.organizer?.email
    }))
  ];

  // https://foraday.atlassian.net/browse/FORA-1227
  // If there are no participants, then the organizer is the only participant
  if (isEmpty(participantsToReturn) && meeting?.nylas?.organizer) {
    participantsToReturn.push({
      ...meeting?.nylas?.organizer,
      external: false
    });
  }

  return participantsToReturn;
}

export function populateNylasAttendee(nylasAttendee, apolloData, internalData, contactData) {
  const isPlaceholderApolloPhoto = apolloData?.photo_url?.includes(APOLLO_AVATAR_PLACEHOLDER_URL);
  const apolloPhoto = isPlaceholderApolloPhoto ? null : apolloData?.photo_url;
  const email = nylasAttendee.email;

  return {
    ...nylasAttendee,
    email,
    internalId: internalData?.id,
    first_name: apolloData?.first_name || internalData?.first_name,
    name: nylasAttendee?.name || internalData?.name || apolloData?.name || email,
    title: internalData?.title || contactData?.title || apolloData?.title,
    organizationName:
      get(internalData, ['tenants', 0, 'name']) ||
      contactData?.company?.name ||
      apolloData?.organization?.name,
    photo_url: internalData?.avatar_url || apolloPhoto || contactData?.avatar_url,
    apolloProfile: apolloData,
    contactProfile: contactData
  };
}

/**
 *
 * @param {{ value: Meeting; bot: Bot; card: Card }} meetingData
 * @returns
 */
export function addFakeReplayBotData(meetingData) {
  // reskin todo: put this in a helper ya silly goose
  _set(meetingData, ['value', 'start_at'], Date.now());
  _set(meetingData, ['value', 'end_at'], addMinutes(Date.now(), 30));
  _set(meetingData, ['bot', 'num_of_status_changes'], 4);
  _set(
    meetingData,
    ['bot', 'status_changes'],
    [
      {
        code: 'joining_call',
        created_at: Date.now()
      },
      {
        code: 'in_call_not_recording',
        created_at: Date.now() + seconds(0.5)
      },
      {
        code: 'recording_permission_allowed',
        created_at: Date.now() + seconds(1)
      },
      {
        code: 'in_call_recording',
        created_at: Date.now() + seconds(1.5)
      }
    ]
  );
  _set(meetingData, ['bot', 'num_of_transcripts'], 0);
  _set(meetingData, ['bot', 'transcripts'], []);
  return meetingData;
}

/**
 * If stringified JSON or pure JSON, return false
 * otherwise return true
 * @param {Bot} bot
 * @returns
 */
export function checkIsOldSummary(bot) {
  try {
    JSON.parse(bot?.summary);
    return false;
  } catch (e) {
    return !isObject(bot?.summary);
  }
}

export function meetingIdWithBot(meeting) {
  return meeting?.bot_attendee ? meeting?.id : meeting?.linked?.id;
}

/**
 * Returns an array of emails for a recipients
 * of a shared meeting
 * @param {Meeting} meeting
 * @returns {Array} emails ['test@fora.day']
 */
export const sharedEmails = (meeting) => {
  return meeting?.shares?.map((share) => {
    return share.email;
  });
};

export function isMeetingParticipant(user, meeting) {
  const participants = meeting?.nylas?.participants || meeting?.attendees;
  const groups = user?.groups || [];
  if (!participants) return false;

  return participants.some(
    (p) =>
      p?.email?.toLowerCase() === user?.email?.toLowerCase() ||
      groups.some((group) => group.toLowerCase() === p?.email?.toLowerCase())
  );
}

export function isUserThatWasSharedWith(user, meeting) {
  if (!meeting?.shares) return false;

  return meeting.shares?.some((share) => share.email.toLowerCase() === user?.email?.toLowerCase());
}

export function isUserWithAccess(user, meeting) {
  if (meeting && meeting?.sensitive) {
    if (meeting?.nylas?.participants) {
      if (isEmpty(meeting?.nylas?.participants)) {
        if (user?.id === meeting?.creator?.id) {
          return true;
        }
      } else if (isMeetingParticipant(user, meeting)) {
        return true;
      } else if (user?.email === meeting?.nylas?.organizer?.email) {
        return true;
      }
    }

    // If the user was shared with, they have access
    if (isUserThatWasSharedWith(user, meeting)) {
      return true;
    }

    return false;
  } else {
    return true;
  }
}

export function updateURL({ cardsArr, tabIndex, location, videoDisclosure, urlParams }) {
  if (!cardsArr?.length) return;

  const lensInitiativeId = cardsArr[tabIndex]?.initiative?.id;
  const currentParams = new URLSearchParams(location.search);

  if (lensInitiativeId) {
    currentParams.set('initiativeId', lensInitiativeId);
  } else {
    currentParams.delete('initiativeId');
  }

  // https://foraday.atlassian.net/browse/FORA-986
  // When the video player is "opening", isOpen will be false, but, we
  // may have passed in a custom time from the KeyPointsSection, if this is
  // the case, append that value to the meeting link
  const time = urlParams.get('time');
  if (time) {
    currentParams.set('time', time);
  } else {
    currentParams.delete('time');
  }

  const meetingLink = `${location.pathname}?${currentParams.toString()}${location.hash}`;

  if (!videoDisclosure?.isOpen) {
    history.replaceState(null, '', tabIndex === -1 ? location.pathname : meetingLink);

    // Scroll to the hash
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  if (!videoDisclosure?.isOpen) {
    history.replaceState(null, '', tabIndex === -1 ? location.pathname : meetingLink);

    // Scroll to the hash
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }
}

// Convert sentiment value to a english with color values
export const translateSentiment = (val) => {
  return val >= 0.6
    ? { copy: 'Positive', bgColor: '#d7fce3', color: '#1b7939' }
    : val > 0.3 && val < 0.6
    ? { copy: 'Slightly Positive', bgColor: '#dcefea', color: '#467d6b' }
    : val > -0.3 && val <= 0.3
    ? { copy: 'Neutral', bgColor: '#e3ebf1', color: 'surface.onSurfaceVariant' }
    : val > -0.6 && val <= -0.3
    ? { copy: 'Slightly Negative', bgColor: '#DDDAE2BF', color: '#5A3D50' }
    : { copy: 'Negative', bgColor: '#fde0df', color: '#6d161a' };
};

export function meetingsGroupComparator(a, b) {
  if (a.rsvp && !b.rsvp) return -1;
  if (!a.rsvp && b.rsvp) return 1;
  if (a.rsvp && b.rsvp) {
    if (a.rsvp.status === 'yes' && b.rsvp.status !== 'yes') return -1;
    if (a.rsvp.status !== 'yes' && b.rsvp.status === 'yes') return 1;
  }

  const durationA = a.end_at - a.start_at;
  const durationB = b.end_at - b.start_at;
  if (durationA < durationB) return -1;
  if (durationA > durationB) return 1;

  if (a.title && !b.title) return -1;
  if (!a.title && b.title) return 1;
  if (a.title && b.title) {
    return a.title.localeCompare(b.title);
  }

  return 0;
}

export function extractZoomMeetingId(meeting) {
  const match = meeting?.url?.match(/zoom\.us\/[jw]\/(\d+)\?/);
  return match ? match[1] : null;
}
