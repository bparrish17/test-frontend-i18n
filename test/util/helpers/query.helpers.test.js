import { describe, it, expect, vi } from 'vitest';

import {
  multiBotTranscriptUpdaterFn,
  meetingTranscriptsUpdaterFn,
  singleBotStatusChangeUpdaterFn
} from '@util/helpers/query.helpers';

describe('multiBotTranscriptUpdaterFn', () => {
  const rawTranscript = 'bot response';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('updates the meeting with matching bot_id', () => {
    const previous = [
      { bot_id: 'abc', bot: { transcripts: [] } },
      { bot_id: 'def', bot: { transcripts: [] } }
    ];

    const result = multiBotTranscriptUpdaterFn(previous, rawTranscript, 'abc');

    expect(result[0]).toEqual(meetingTranscriptsUpdaterFn(previous[0], rawTranscript));
    expect(result[1]).toEqual(previous[1]); // unchanged
  });

  it('updates the meeting with matching linked.bot_id', () => {
    const previous = [
      { linked: { bot_id: 'xyz' }, bot: { transcripts: [] } },
      { bot_id: 'def', bot: { transcripts: [] } }
    ];

    const result = multiBotTranscriptUpdaterFn(previous, rawTranscript, 'xyz');

    expect(result[0]).toEqual(meetingTranscriptsUpdaterFn(previous[0], rawTranscript));
    expect(result[1]).toEqual(previous[1]);
  });

  it('returns original meeting if no match found', () => {
    const previous = [{ bot_id: 'not-it', bot: { transcripts: ['unchanged'] } }];

    const result = multiBotTranscriptUpdaterFn(previous, rawTranscript, 'other-id');

    expect(result[0]).toEqual(previous[0]);
  });

  it('handles undefined or empty previous array', () => {
    const result = multiBotTranscriptUpdaterFn(undefined, rawTranscript, 'abc');
    expect(result).toBeUndefined();
  });
});

describe('meetingTranscriptsUpdaterFn', () => {
  it('adds a transcript and increments count', () => {
    const previous = {
      bot: {
        num_of_transcripts: 1,
        transcripts: ['old transcript']
      }
    };
    const rawTranscript = 'new transcript';

    const result = meetingTranscriptsUpdaterFn(previous, rawTranscript);

    expect(result.bot.num_of_transcripts).toBe(2);
    expect(result.bot.transcripts).toEqual(['old transcript', 'new transcript']);
  });

  it('handles undefined transcripts and num_of_transcripts', () => {
    const previous = {
      bot: {}
    };
    const rawTranscript = 'first transcript';

    const result = meetingTranscriptsUpdaterFn(previous, rawTranscript);

    expect(result.bot.num_of_transcripts).toBe(1);
    expect(result.bot.transcripts).toEqual(['first transcript']);
  });

  it('preserves unrelated properties', () => {
    const previous = {
      id: 123,
      topic: 'Weekly Sync',
      bot: {
        id: 987,
        num_of_transcripts: 0,
        transcripts: []
      }
    };
    const rawTranscript = 'transcript content';

    const result = meetingTranscriptsUpdaterFn(previous, rawTranscript);

    expect(result.id).toBe(123);
    expect(result.topic).toBe('Weekly Sync');
    expect(result.bot.id).toBe(987);
    expect(result.bot.transcripts).toContain('transcript content');
  });
});

describe('singleBotStatusChangeUpdaterFn', () => {
  it('should add a new status change and increment num_of_status_changes', () => {
    const previous = {
      bot: {
        num_of_status_changes: 1,
        status_changes: [{ code: 'started', created_at: 1739562233900 }]
      }
    };

    const newStatusChange = { code: 'in_call_recording', created_at: 1739562233915 };

    const result = singleBotStatusChangeUpdaterFn(previous, newStatusChange);

    expect(result.bot.num_of_status_changes).toBe(2);
    expect(result.bot.status_changes).toEqual([
      { code: 'started', created_at: 1739562233900 },
      { code: 'in_call_recording', created_at: 1739562233915 }
    ]);
  });

  it('should correctly sort status changes by created_at timestamp', () => {
    const previous = {
      bot: {
        num_of_status_changes: 2,
        status_changes: [
          { code: 'in_call_recording', created_at: 1739562233915 },
          { code: 'started', created_at: 1739562233900 }
        ]
      }
    };

    const newStatusChange = { code: 'ended', created_at: 1739562233925 };

    const result = singleBotStatusChangeUpdaterFn(previous, newStatusChange);

    expect(result.bot.status_changes).toEqual([
      { code: 'started', created_at: 1739562233900 },
      { code: 'in_call_recording', created_at: 1739562233915 },
      { code: 'ended', created_at: 1739562233925 }
    ]);
  });

  it('should handle an empty previous status_changes array', () => {
    const previous = { bot: { num_of_status_changes: 0, status_changes: [] } };
    const newStatusChange = { code: 'started', created_at: 1739562233900 };

    const result = singleBotStatusChangeUpdaterFn(previous, newStatusChange);

    expect(result.bot.num_of_status_changes).toBe(1);
    expect(result.bot.status_changes).toEqual([newStatusChange]);
  });

  it('should handle a missing bot object in previous state', () => {
    const previous = {};
    const newStatusChange = { code: 'started', created_at: 1739562233900 };

    const result = singleBotStatusChangeUpdaterFn(previous, newStatusChange);

    expect(result.bot.num_of_status_changes).toBe(1);
    expect(result.bot.status_changes).toEqual([newStatusChange]);
  });

  it('should not append a status change if the code and created_at values match the latest one exactly', () => {
    const previous = {
      bot: {
        num_of_status_changes: 2,
        status_changes: [
          { code: 'in_call_not_recording', created_at: 1739562233815 },
          { code: 'in_call_recording', created_at: 1739562233900 }
        ]
      }
    };
    const newStatusChange = { code: 'in_call_recording', created_at: 1739562233900 };
    const result = singleBotStatusChangeUpdaterFn(previous, newStatusChange);
    expect(result.bot.num_of_status_changes).toBe(2);
    expect(result.bot.status_changes).toEqual(previous.bot.status_changes);
  });

  it('should not append a status change if the code, sub_code, and created_at values match the latest one exactly', () => {
    const duplicateStatusChange = {
      code: 'call_ended',
      sub_code: 'call_ended_by_host',
      created_at: 1739562233815
    };
    const previous = {
      bot: {
        num_of_status_changes: 1,
        status_changes: [duplicateStatusChange]
      }
    };
    const newStatusChange = duplicateStatusChange;
    const result = singleBotStatusChangeUpdaterFn(previous, newStatusChange);
    expect(result.bot.num_of_status_changes).toBe(1);
    expect(result.bot.status_changes).toEqual(previous.bot.status_changes);
  });

  it('should append a status change if the code is the same but the created_at is different', () => {
    // note: i'm unsure if this is a scenario that'll really occur, but we're checking regardless
    // also this might be a duplicate test functionally, but leaving just for documentations sake
    const previous = {
      bot: {
        num_of_status_changes: 1,
        status_changes: [{ code: 'in_call_recording', created_at: 1739562233800 }]
      }
    };
    const newStatusChange = {
      code: 'in_call_recording',
      created_at: 1739562233815
    };
    const result = singleBotStatusChangeUpdaterFn(previous, newStatusChange);
    expect(result.bot.num_of_status_changes).toBe(2);
    expect(result.bot.status_changes).toEqual([...previous.bot.status_changes, newStatusChange]);
  });
});
