import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { filter } from 'lodash-es';
import { add, addMinutes } from 'date-fns';
import { faker } from '@faker-js/faker';

import rawTranscript from '@test/fixtures/transcript.json';
import { getSpeakerTimesMap, parseRawTranscripts, mergeAttendeesWithSpeakers } from '@util/helpers';
import { useUserStore } from '@store/app.store';
import { renderHookWithProviders } from '@test/test.helpers';
import { useAllMeetingContentById } from '@services/query-services/meetings.query-service';
import { waitFor } from '@testing-library/react';
import { usePopulateMeetingAttendees } from '@util/hooks';

vi.mock('@store/app.store', () => ({ useUserStore: vi.fn() }));

describe('parseRawTranscript', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should not return topicGroups if parseTopicGroups = false', () => {
    const { topicGroups, ungroupedSummaries } = parseRawTranscripts(
      rawTranscript,
      new Date().getTime(),
      [],
      false
    );
    expect(topicGroups?.length).toBe(0);
    expect(ungroupedSummaries?.length).toBe(0);
  });

  it('should return a topic group for each rawTranscript entry with a "todos" if parseTopicGroups = true', () => {
    const rawTranscriptTodos = filter(
      rawTranscript,
      (transcript) => !!transcript?.todos_title
    )?.length;
    const { topicGroups } = parseRawTranscripts(rawTranscript, new Date().getTime(), [], true);
    expect(topicGroups?.length).toEqual(rawTranscriptTodos);
  });

  it('should return formatted topicGroups and ungroupedSummaries if parseTopicGroups = true', () => {
    const rawTranscripts = [
      {
        speaker: 'Speaker 1',
        segment: 'Hello',
        start_time: 0,
        end_time: 5,
        todos: true,
        todos_title: 'Topic Group Title',
        title: 'Topic Group Summary Title',
        summary: 'Topic Group Summary Text'
      },
      {
        speaker: 'Speaker 2',
        segment: 'World',
        start_time: 5,
        end_time: 10,
        title: 'Summary Title',
        summary: 'Summary Text'
      }
    ];

    const result = parseRawTranscripts(rawTranscripts, new Date(), [], true);

    expect(result.transcripts).toEqual([
      {
        start_time: 0,
        end_time: 5,
        speaker: 'Speaker 1',
        message: 'Hello'
      },
      {
        start_time: 5,
        end_time: 10,
        speaker: 'Speaker 2',
        message: 'World'
      }
    ]);
    expect(result.topicGroups).toEqual([
      expect.objectContaining({
        title: 'Topic Group Title',
        topic_summary: true,
        summaries: expect.any(Array)
      })
    ]);
    expect(result.ungroupedSummaries).toEqual([
      expect.objectContaining({ title: 'Summary Title', contentLines: ['Summary Text'] })
    ]);
  });

  it('should return empty topicGroups, ungroupedSummaries, and transcripts if rawTranscript is empty', () => {
    const result = parseRawTranscripts([], new Date().getTime(), [], true);
    expect(result.topicGroups).toEqual([]);
    expect(result.ungroupedSummaries).toEqual([]);
    expect(result.transcripts).toEqual([]);
  });

  it("should aggregate transcript entry's words with the previous entry if speaker is the same", () => {
    const rawTranscripts = [
      { speaker: 'Speaker 1', segment: 'Hello', start_time: 0, end_time: 5 },
      { speaker: 'Speaker 1', segment: 'World', start_time: 5, end_time: 10 }
    ];
    const result = parseRawTranscripts(rawTranscripts, new Date(), []);

    expect(result.transcripts).toEqual([
      {
        start_time: 0,
        end_time: 5,
        speaker: 'Speaker 1',
        message: 'Hello World'
      }
    ]);
  });

  it('should create separate transcript entries if speaker changed between rawTranscript entries', () => {
    const rawTranscripts = [
      { speaker: 'Speaker 1', segment: 'Hello', start_time: 0, end_time: 5 },
      { speaker: 'Speaker 2', segment: 'World', start_time: 5, end_time: 10 }
    ];
    const result = parseRawTranscripts(rawTranscripts, new Date(), []);
    expect(result.transcripts).toEqual([
      {
        start_time: 0,
        end_time: 5,
        speaker: 'Speaker 1',
        message: 'Hello'
      },
      {
        start_time: 5,
        end_time: 10,
        speaker: 'Speaker 2',
        message: 'World'
      }
    ]);
  });

  it('should handle transcripts with transitions', () => {
    const fakeRecordingStartTime = new Date('2025-02-19T14:42:26.820Z');
    const rawTranscriptEntry = {
      transition: true,
      speaker: 'Cynthia Susairaj',
      start_time: 12,
      segment: ' Morning.',
      to: add(fakeRecordingStartTime, { minutes: 3, seconds: 12 }),
      absolute_start_time: addMinutes(fakeRecordingStartTime, 3)
    };
    const result = parseRawTranscripts([rawTranscriptEntry], fakeRecordingStartTime, []);

    expect(result.transcripts).toEqual([
      expect.objectContaining({
        start_time: 12,
        end_time: 12 + 60 * 3,
        speaker: 'Paused',
        transition: true,
        message: 'FORA was paused for 3m'
      })
    ]);
  });
});

const mockSpeakerTimesMap = new Map([
  ['Speaker 1', { duration: 0.2, behavior: 'classy' }],
  ['Speaker 2', { duration: 6.3, behavior: 'curious' }],
  ['Speaker 3', { duration: 4.1, behavior: 'questionable' }],
  ['Speaker 4', { duration: 4.1, behavior: 'unimpressed' }]
]);

describe('getSpeakerTimesMap', () => {
  const mockBot = {
    speakers_: [
      { name: 'Speaker 1', duration: 12, behavior: 'classy' },
      { name: 'Speaker 2', duration: 380, behavior: 'curious' },
      { name: 'Speaker 3', duration: 245, behavior: 'questionable' },
      { name: 'Speaker 4', duration: 245, behavior: 'unimpressed' }
    ]
  };

  it('returns map where key is speaker name and value is duration in minutes', () => {
    const map = getSpeakerTimesMap(mockBot);
    expect(map).toEqual(mockSpeakerTimesMap);
  });

  it('returns empty map if bot is undefined', () => {
    const map = getSpeakerTimesMap();
    expect(map).toEqual(new Map());
  });

  it('falls back to `speakers` if `speakers_` are not provided', () => {
    const mockSpeakerTimesMap = new Map([
      ['Speaker 1', { duration: 0.2, behavior: undefined }],
      ['Speaker 2', { duration: 6.3, behavior: 'curious' }],
      ['Speaker 3', { duration: 4.1, behavior: 'questionable' }],
      ['Speaker 4', { duration: 4.1, behavior: 'unimpressed' }]
    ]);
    const mockSpeakerTimesMapWithoutBehavior = new Map();
    mockSpeakerTimesMap.forEach((v, k) => {
      mockSpeakerTimesMapWithoutBehavior.set(k, { ...v, behavior: undefined });
    });

    const map = getSpeakerTimesMap({
      speakers: {
        'Speaker 1': 12,
        'Speaker 2': 380,
        'Speaker 3': 245,
        'Speaker 4': 245
      }
    });
    expect(map).toEqual(mockSpeakerTimesMapWithoutBehavior);
  });
});

describe('mergeAttendeesWithSpeakers', () => {
  const mockAttendees = ['Speaker 1', 'Silent Speaker', 'Speaker 4', 'Speaker 2', 'Speaker 3'].map(
    (name) => ({ name })
  );

  it('correctly sorts attendees and speakers', () => {
    const sortedAttendees = mergeAttendeesWithSpeakers(mockAttendees, mockSpeakerTimesMap);
    expect(sortedAttendees.map((a) => a.name)).toEqual([
      'Speaker 2',
      'Speaker 3',
      'Speaker 4',
      'Speaker 1',
      'Silent Speaker'
    ]);
  });

  it('adds speakers not found in attendees list', () => {
    const sortedAttendees = mergeAttendeesWithSpeakers([], mockSpeakerTimesMap);
    expect(sortedAttendees.map((a) => a.name)).toEqual([
      'Speaker 2',
      'Speaker 3',
      'Speaker 4',
      'Speaker 1'
    ]);
  });

  it('returns all participants and speakers', async () => {
    useUserStore.mockImplementation((selector) => selector({ tenant: { id: '1' }, user: {} }));
    const { result: meetingAllResult } = renderHookWithProviders(() => useAllMeetingContentById());
    await waitFor(() => {
      expect(meetingAllResult.current.isFetched).toBeTruthy();
    });

    const meeting = {
      ...meetingAllResult.current.data.value,
      // since Nylas property isn't described in OpenAPI spec
      nylas: {
        participants: [...new Array(faker.number.int({ min: 1, max: 100 })).keys()].map((_) => ({
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          title: faker.string.alpha({ length: { min: 0, max: 500 } }),
          company_name: faker.person.fullName(),
          company_type: faker.string.alpha({ length: { min: 0, max: 255 } }),
          company_industry: faker.string.alpha({ length: { min: 0, max: 255 } }),
          avatar_url: faker.internet.url(),
          comment: faker.string.alpha({ length: { min: 0, max: 500 } }),
          status: faker.helpers.arrayElement(['yes', 'no', 'maybe', 'noreply']),
          external: faker.datatype.boolean()
        }))
      }
    };

    const { result: attendeesResult } = renderHookWithProviders(() =>
      usePopulateMeetingAttendees([meeting], true)
    );
    await waitFor(() => {
      expect(attendeesResult.current.populatedAttendees).toBeTruthy();
    });

    const populatedAttendees = attendeesResult.current.populatedAttendees;
    const speakerTimesMap = getSpeakerTimesMap(meetingAllResult.current.data.bot);
    const mergedAttendees = mergeAttendeesWithSpeakers(populatedAttendees, speakerTimesMap);

    const expectedAttendeesAndSpeakerNames = [
      ...populatedAttendees?.map((a) => a.name),
      ...speakerTimesMap.keys()
    ];
    const actualAttendeesAndSpeakerNames = mergedAttendees?.map((a) => a.name);

    const sortAlphabetically = (a, b) => a.localeCompare(b);
    expect(actualAttendeesAndSpeakerNames.sort(sortAlphabetically)).toEqual(
      expectedAttendeesAndSpeakerNames.sort(sortAlphabetically)
    );
  });
});
