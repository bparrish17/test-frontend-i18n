import { describe, it, expect, vi } from 'vitest';
import {
  isMeetingParticipant,
  meetingIdWithBot,
  sharedEmails,
  isUserWithAccess,
  updateURL,
  translateSentiment,
  meetingsGroupComparator,
  addMeetingDataToNylasAttendee,
  extractZoomMeetingId,
  getPriorMeetingsSectionsSearchBodies,
  isUserThatWasSharedWith
} from '@util/helpers/meetings.helpers';

describe('meetingIdWithBot', () => {
  const meeting = {
    id: '12345',
    linked: {
      id: '54321'
    }
  };

  it('returns meeting id if bot_attendee is true', () => {
    meeting.bot_attendee = true;
    const result = meetingIdWithBot(meeting);
    expect(result).toBe('12345');
  });

  it('returns linked meeting id if bot_attendee is false', () => {
    meeting.bot_attendee = false;
    const result = meetingIdWithBot(meeting);
    expect(result).toBe('54321');
  });
});

describe('sharedEmails function', () => {
  it('should return an array of emails when shares are present', () => {
    const meeting = {
      shares: [{ email: 'test1@example.com' }, { email: 'test2@example.com' }]
    };

    const result = sharedEmails(meeting);
    expect(result).toEqual(['test1@example.com', 'test2@example.com']);
  });

  it('should return an empty array when there are no shares', () => {
    const meeting = {
      shares: []
    };

    const result = sharedEmails(meeting);
    expect(result).toEqual([]);
  });
});

describe('isMeetingParticipant', () => {
  it('should return true when user is a participant in nylas participants', () => {
    const user = { email: 'test@example.com' };
    const meeting = {
      nylas: {
        participants: [{ email: 'test@example.com' }, { email: 'other@example.com' }]
      }
    };

    const result = isMeetingParticipant(user, meeting);
    expect(result).toBe(true);
  });

  it('should return true when user is a member of a group in nylas participants', () => {
    const user = { email: 'test@example.com', groups: ['all@fora.day'] };
    const meeting = {
      nylas: {
        participants: [{ email: 'all@fora.day' }, { email: 'other@example.com' }]
      }
    };

    const result = isMeetingParticipant(user, meeting);
    expect(result).toBe(true);
  });

  it('should return true when user is a member of multiple groups in nylas participants', () => {
    const user = { email: 'test@example.com', groups: ['all@fora.day', 'test@fora.day'] };
    const meeting = {
      nylas: {
        participants: [
          { email: 'all@fora.day' },
          { email: 'test@fora.day' },
          { email: 'other@example.com' }
        ]
      }
    };

    const result = isMeetingParticipant(user, meeting);
    expect(result).toBe(true);
  });

  it('should return true when user is a participant (case insensitive)', () => {
    const user = { email: 'TestCamelCase@example.com' };
    const meeting = {
      nylas: {
        participants: [{ email: 'testcamelcase@example.com' }, { email: 'other@example.com' }]
      }
    };

    const result = isMeetingParticipant(user, meeting);
    expect(result).toBe(true);
  });

  it('should return true when user is a participant in attendees', () => {
    const user = { email: 'test@example.com' };
    const meeting = {
      attendees: [{ email: 'test@example.com' }, { email: 'other@example.com' }]
    };

    const result = isMeetingParticipant(user, meeting);
    expect(result).toBe(true);
  });

  it('should return true when user is a participant of a group in attendees', () => {
    const user = { email: 'test@example.com', groups: ['all@fora.day'] };
    const meeting = {
      attendees: [{ email: 'all@fora.day' }, { email: 'other@example.com' }]
    };

    const result = isMeetingParticipant(user, meeting);
    expect(result).toBe(true);
  });

  it('should return false when user is not a participant', () => {
    const user = { email: 'notparticipant@example.com' };
    const meeting = {
      nylas: {
        participants: [{ email: 'test@example.com' }, { email: 'other@example.com' }]
      }
    };

    const result = isMeetingParticipant(user, meeting);
    expect(result).toBe(false);
  });

  it('should return false when meeting has no participants or attendees', () => {
    const user = { email: 'test@example.com' };
    const meeting = {};

    const result = isMeetingParticipant(user, meeting);
    expect(result).toBe(false);
  });

  it('should return false when meeting is undefined', () => {
    const user = { email: 'test@example.com' };

    const result = isMeetingParticipant(user, undefined);
    expect(result).toBe(false);
  });

  it('should handle cases with undefined user or email gracefully', () => {
    const user = { email: undefined };
    const meeting = {
      nylas: {
        participants: [{ email: 'test@example.com' }, { email: 'other@example.com' }]
      }
    };

    const result = isMeetingParticipant(user, meeting);
    expect(result).toBe(false);
  });
});

describe('isUserWithAccess', () => {
  it('should return true if no meeting is provided', () => {
    const user = { id: 1 };

    expect(isUserWithAccess(user, null)).toBe(true);
  });

  it('should return true if meeting is not sensitive', () => {
    const user = { id: 1 };
    const meeting = { sensitive: false };

    expect(isUserWithAccess(user, meeting)).toBe(true);
  });

  it('should return true if meeting is sensitive, has no participants, and user is the creator', () => {
    const user = { id: 1 };
    const meeting = { sensitive: true, creator: { id: 1 }, nylas: { participants: [] } };

    expect(isUserWithAccess(user, meeting)).toBe(true);
  });

  it('should return false if meeting is sensitive, has no participants, and user is not the creator', () => {
    const user = { id: 2 };
    const meeting = { sensitive: true, nylas: { participants: [] }, creator: { id: 1 } };

    expect(isUserWithAccess(user, meeting)).toBe(false);
  });

  it('should return false if meeting is sensitive and user is not a participant', () => {
    const user = { id: 2, email: 'notparticipant@test.com' };
    const meeting = {
      sensitive: true,
      nylas: { participants: [{ email: 'participant@test.com' }] }
    };

    expect(isUserWithAccess(user, meeting)).toBe(false);
  });

  it('should return true if meeting is sensitive and user is a participant', () => {
    const user = { id: 2, email: 'participant@test.com' };
    const meeting = {
      sensitive: true,
      nylas: { participants: [{ email: 'participant@test.com' }] }
    };

    expect(isUserWithAccess(user, meeting)).toBe(true);
  });

  it('should return true if meeting is sensitive and user is the organizer', () => {
    const user = { id: 2, email: 'organizer@test.com' };
    const meeting = {
      sensitive: true,
      nylas: {
        participants: [{ email: 'participant@test.com' }],
        organizer: { email: 'organizer@test.com' }
      }
    };

    expect(isUserWithAccess(user, meeting)).toBe(true);
  });

  it('should return true if the user is a guest that has had the meeting shared with them', () => {
    const user = { email: 'sharedwith@me.com', id: 3 };
    const meeting = {
      sensitive: true,
      shares: [{ email: 'sharedwith@me.com', id: 3 }],
      nylas: {
        participants: [{ email: 'participant@test.com' }],
        organizer: { email: 'organizer@test.com' }
      }
    };
  });
});

describe('updateURL', () => {
  let mockHistoryReplaceState;
  let mockScrollIntoView;

  beforeEach(() => {
    mockHistoryReplaceState = vi.spyOn(history, 'replaceState').mockImplementation(() => {});
    mockScrollIntoView = vi.fn();
    document.getElementById = vi.fn(() => ({ scrollIntoView: mockScrollIntoView }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('updates the URL with initiativeId', () => {
    const args = {
      cardsArr: [{ initiative: { id: '123' } }],
      tabIndex: 0,
      location: { pathname: '/path', hash: '#section' },
      videoDisclosure: { isOpen: false },
      urlParams: new URLSearchParams()
    };

    updateURL(args);

    expect(mockHistoryReplaceState).toHaveBeenCalledWith(
      null,
      '',
      '/path?initiativeId=123#section'
    );
    expect(mockScrollIntoView).toHaveBeenCalled();
  });

  it('does not update the URL when video player is open', () => {
    const args = {
      cardsArr: [{ initiative: { id: '123' } }],
      tabIndex: 0,
      location: { pathname: '/path', hash: '#section' },
      videoDisclosure: { isOpen: true },
      urlParams: new URLSearchParams()
    };

    updateURL(args);

    expect(mockHistoryReplaceState).not.toHaveBeenCalled();
  });

  it('appends the "time" parameter to the URL when it exists', () => {
    const args = {
      cardsArr: [{ initiative: { id: '123' } }],
      tabIndex: 0,
      location: { pathname: '/path', hash: '' },
      videoDisclosure: { isOpen: false },
      urlParams: new URLSearchParams('time=120')
    };

    updateURL(args);

    expect(mockHistoryReplaceState).toHaveBeenCalledWith(
      null,
      '',
      '/path?initiativeId=123&time=120'
    );
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('does not update the URL when cardsArr is empty', () => {
    const args = {
      cardsArr: [],
      tabIndex: 0,
      location: { pathname: '/path', hash: '#section' },
      videoDisclosure: { isOpen: false },
      urlParams: new URLSearchParams()
    };

    updateURL(args);

    expect(mockHistoryReplaceState).not.toHaveBeenCalled();
  });

  it('removes initiativeId from the URL when lensInitiativeId is not present', () => {
    const args = {
      cardsArr: [{}],
      tabIndex: 0,
      location: { pathname: '/path', hash: '#section' },
      videoDisclosure: { isOpen: false },
      urlParams: new URLSearchParams('initiativeId=123')
    };

    updateURL(args);

    expect(mockHistoryReplaceState).toHaveBeenCalledWith(null, '', '/path?#section');
    expect(mockScrollIntoView).toHaveBeenCalled();
  });

  it('removes the "time" parameter from the URL when it is not present', () => {
    const args = {
      cardsArr: [{ initiative: { id: '123' } }],
      tabIndex: 0,
      location: { pathname: '/path', hash: '' },
      videoDisclosure: { isOpen: false },
      urlParams: new URLSearchParams('time=120')
    };

    updateURL({ ...args, urlParams: new URLSearchParams() });

    expect(mockHistoryReplaceState).toHaveBeenCalledWith(null, '', '/path?initiativeId=123');
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });

  it('does not scroll when location.hash is not present', () => {
    const args = {
      cardsArr: [{ initiative: { id: '123' } }],
      tabIndex: 0,
      location: { pathname: '/path', hash: '' },
      videoDisclosure: { isOpen: false },
      urlParams: new URLSearchParams()
    };

    updateURL(args);

    expect(mockHistoryReplaceState).toHaveBeenCalledWith(null, '', '/path?initiativeId=123');
    expect(mockScrollIntoView).not.toHaveBeenCalled();
  });
});

describe('translateSentiment', () => {
  it('returns positive for values >= 0.6', () => {
    expect(translateSentiment(0.6)).toEqual({
      copy: 'Positive',
      bgColor: '#d7fce3',
      color: '#1b7939'
    });
  });

  it('returns slightly positive for values between 0.3 and 0.6', () => {
    expect(translateSentiment(0.59)).toEqual({
      copy: 'Slightly Positive',
      bgColor: '#dcefea',
      color: '#467d6b'
    });
    expect(translateSentiment(0.31)).toEqual({
      copy: 'Slightly Positive',
      bgColor: '#dcefea',
      color: '#467d6b'
    });
  });

  it('returns neutral for values between -0.3 and 0.3', () => {
    expect(translateSentiment(0.3)).toEqual({
      copy: 'Neutral',
      bgColor: '#e3ebf1',
      color: 'surface.onSurfaceVariant'
    });
    expect(translateSentiment(-0.29)).toEqual({
      copy: 'Neutral',
      bgColor: '#e3ebf1',
      color: 'surface.onSurfaceVariant'
    });
  });

  it('returns slightly negative for values between -0.6 and -0.3', () => {
    expect(translateSentiment(-0.3)).toEqual({
      copy: 'Slightly Negative',
      bgColor: '#DDDAE2BF',
      color: '#5A3D50'
    });
    expect(translateSentiment(-0.59)).toEqual({
      copy: 'Slightly Negative',
      bgColor: '#DDDAE2BF',
      color: '#5A3D50'
    });
  });

  it('returns negative for values <= -0.6', () => {
    expect(translateSentiment(-0.6)).toEqual({
      copy: 'Negative',
      bgColor: '#fde0df',
      color: '#6d161a'
    });
  });
});

describe('meetingsGroupComparator', () => {
  it('should prioritize meeting with yes RSVP over no RSVP', () => {
    const meetingA = { start_at: new Date(), end_at: new Date(), rsvp: { status: 'yes' } };
    const meetingB = { start_at: new Date(), end_at: new Date() };
    expect(meetingsGroupComparator(meetingA, meetingB)).toBe(-1);
    expect(meetingsGroupComparator(meetingB, meetingA)).toBe(1);
  });

  it('should prioritize meeting with yes RSVP over maybe RSVP', () => {
    const meetingA = { start_at: new Date(), end_at: new Date(), rsvp: { status: 'yes' } };
    const meetingB = { start_at: new Date(), end_at: new Date(), rsvp: { status: 'maybe' } };
    expect(meetingsGroupComparator(meetingA, meetingB)).toBe(-1);
    expect(meetingsGroupComparator(meetingB, meetingA)).toBe(1);
  });

  it('should prioritize shorter duration over longer duration', () => {
    const shortMeeting = {
      start_at: new Date('2025-01-17T10:00:00'),
      end_at: new Date('2025-01-17T11:00:00')
    };
    const longMeeting = {
      start_at: new Date('2025-01-17T10:00:00'),
      end_at: new Date('2025-01-17T12:00:00')
    };
    expect(meetingsGroupComparator(shortMeeting, longMeeting)).toBe(-1);
    expect(meetingsGroupComparator(longMeeting, shortMeeting)).toBe(1);
  });

  it('should sort by title when durations are equal', () => {
    const meetingA = {
      start_at: new Date('2025-01-17T10:00:00'),
      end_at: new Date('2025-01-17T11:00:00'),
      title: 'A Meeting'
    };
    const meetingB = {
      start_at: new Date('2025-01-17T10:00:00'),
      end_at: new Date('2025-01-17T11:00:00'),
      title: 'B Meeting'
    };
    expect(meetingsGroupComparator(meetingA, meetingB)).toBeLessThan(0);
    expect(meetingsGroupComparator(meetingB, meetingA)).toBeGreaterThan(0);
  });

  it('should prioritize meeting with title over no title', () => {
    const start_at = new Date('2025-01-17T10:00:00');
    const end_at = new Date('2025-01-17T11:00:00');

    const meetingA = {
      start_at,
      end_at,
      title: 'Meeting'
    };
    const meetingB = {
      start_at,
      end_at
    };
    expect(meetingsGroupComparator(meetingA, meetingB)).toBe(-1);
    expect(meetingsGroupComparator(meetingB, meetingA)).toBe(1);
  });

  it('should return 0 when meetings are identical', () => {
    const time = new Date();
    const meeting = {
      start_at: time,
      end_at: time
    };
    expect(meetingsGroupComparator(meeting, meeting)).toBe(0);
  });
});

describe('addMeetingDataToNylasAttendee', () => {
  it('should add meetingId to each participant', () => {
    const acc = [];
    const meeting = {
      id: '12345',
      nylas: {
        participants: [
          { email: 'user1@example.com', name: 'User One' },
          { email: 'user2@example.com', name: 'User Two' }
        ],
        organizer: { email: 'organizer@example.com', name: 'Organizer' }
      }
    };

    const result = addMeetingDataToNylasAttendee(acc, meeting);

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({ email: 'user1@example.com', meetingId: '12345' });
    expect(result[1]).toMatchObject({ email: 'user2@example.com', meetingId: '12345' });
  });

  it('should correctly identify the organizer', () => {
    const acc = [];
    const meeting = {
      id: '12345',
      nylas: {
        participants: [
          { email: 'user1@example.com', name: 'User One' },
          { email: 'organizer@example.com', name: 'Organizer' }
        ],
        organizer: { email: 'organizer@example.com', name: 'Organizer' }
      }
    };

    const result = addMeetingDataToNylasAttendee(acc, meeting);

    expect(result.find((p) => p.email === 'organizer@example.com').isOrganizer).toBe(true);
    expect(result.find((p) => p.email === 'user1@example.com').isOrganizer).toBe(false);
  });

  it('should return only the organizer if there are no participants', () => {
    const acc = [];
    const meeting = {
      id: '12345',
      nylas: {
        participants: [],
        organizer: { email: 'organizer@example.com', name: 'Organizer' }
      }
    };

    const result = addMeetingDataToNylasAttendee(acc, meeting);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ email: 'organizer@example.com', external: false });
  });

  it('should handle an empty meeting object gracefully', () => {
    const acc = [];
    const meeting = {};

    const result = addMeetingDataToNylasAttendee(acc, meeting);

    expect(result).toEqual([]); // Should return an empty array
  });

  it('should return acc unchanged if nylas data is missing', () => {
    const acc = [{ email: 'existing@example.com', name: 'Existing' }];
    const meeting = { id: '12345' };

    const result = addMeetingDataToNylasAttendee(acc, meeting);

    expect(result).toEqual(acc); // Should not modify acc
  });
});

describe('extractZoomMeetingId', () => {
  it('returns the meeting ID from a valid zoom join URL with /j/', () => {
    const meeting = { url: 'https://zoom.us/j/1234567890?pwd=abc' };
    expect(extractZoomMeetingId(meeting)).toBe('1234567890');
  });

  it('returns the meeting ID from a valid zoom watch URL with /w/', () => {
    const meeting = { url: 'https://zoom.us/w/9876543210?someparam=true' };
    expect(extractZoomMeetingId(meeting)).toBe('9876543210');
  });

  it('returns null if the URL is missing', () => {
    const meeting = {};
    expect(extractZoomMeetingId(meeting)).toBe(null);
  });

  it('returns null if the URL does not contain a zoom meeting path', () => {
    const meeting = { url: 'https://google.com/some/path' };
    expect(extractZoomMeetingId(meeting)).toBe(null);
  });

  it('returns null if the URL contains zoom.us but not a valid /j/ or /w/ pattern', () => {
    const meeting = { url: 'https://zoom.us/invalid/1234567890' };
    expect(extractZoomMeetingId(meeting)).toBe(null);
  });
});

describe('getPriorMeetingsSectionsSearchBodies', () => {
  const attendees = [
    { id: 1, email: 'user1@gmail.com' },
    { id: 2, email: 'user2@gmail.com' }
  ];
  const meeting = { nylas: { participants: attendees } };
  const user = {
    apollo_profile: { id: 1 }
  };

  it('returns "one on one" section if meeting had 2 attendees', () => {
    const sections = getPriorMeetingsSectionsSearchBodies(meeting, attendees, user);
    expect(sections.find((s) => s.sectionDescriptor.startsWith('With'))).toBeTruthy();
  });

  it('returns series section if meeting has parent_id', () => {
    const sections = getPriorMeetingsSectionsSearchBodies(
      { ...meeting, parent_id: 1 },
      attendees,
      user
    );
    expect(sections.find((s) => s.sectionDescriptor.startsWith('In This Series'))).toBeTruthy();
  });

  it('returns empty array if less than 2 participants', () => {
    const sections = getPriorMeetingsSectionsSearchBodies(
      { ...meeting, parent_id: 1 },
      [attendees.pop()],
      user
    );
    expect(sections.length).toEqual(0);
  });
});

describe('isUserThatWasSharedWith', () => {
  const user = { email: 'test@example.com' };

  it('returns false if meeting is null or undefined', () => {
    expect(isUserThatWasSharedWith(user, null)).toBe(false);
    expect(isUserThatWasSharedWith(user, undefined)).toBe(false);
  });

  it('returns false if meeting.shares is missing', () => {
    expect(isUserThatWasSharedWith(user, {})).toBe(false);
  });

  it('returns false if shares does not contain the user email', () => {
    const meeting = {
      shares: [{ email: 'other@example.com' }]
    };
    expect(isUserThatWasSharedWith(user, meeting)).toBe(false);
  });

  it('returns true if shares contains the user email (case-insensitive)', () => {
    const meeting = {
      shares: [{ email: 'TEST@example.com' }]
    };
    expect(isUserThatWasSharedWith(user, meeting)).toBe(true);
  });

  it('returns false if user is missing an email', () => {
    const meeting = {
      shares: [{ email: 'test@example.com' }]
    };
    expect(isUserThatWasSharedWith({}, meeting)).toBe(false);
  });

  it('handles multiple shares correctly', () => {
    const meeting = {
      shares: [
        { email: 'foo@example.com' },
        { email: 'bar@example.com' },
        { email: 'test@example.com' }
      ]
    };
    expect(isUserThatWasSharedWith(user, meeting)).toBe(true);
  });
});
