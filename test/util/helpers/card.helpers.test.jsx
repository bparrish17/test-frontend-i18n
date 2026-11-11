import React from 'react';
import { Spinner } from '@chakra-ui/react';
import { describe, test, expect, vi } from 'vitest';
import { addMinutes } from 'date-fns';
import timezoneMock from 'timezone-mock';

import {
  getCardSourceLink,
  getCardSource,
  getCardTime,
  getControlBarState,
  selectAndSortCards,
  getDocumentMetadataFromCard,
  extractErrorStatus,
  getSummaryObject
} from '@util/helpers/card.helpers';
import { SFCheckIconCircleFilled, SFNoVideoIcon, StatusErrorIcon, InfoIcon } from '@assets/icons';

describe('getCardSourceLink', () => {
  it('returns null when card source is undefined', () => {
    const result = getCardSourceLink({});
    expect(result).toBeNull();
  });

  it('builds correct link for Bot source', () => {
    const card = { id: '123', source: 'Bot', source_data: { id: '456' } };
    const result = getCardSourceLink(card);
    expect(result).toBe('/meeting/456');
  });

  it('adds queryParams to Bot source if queryParams true ', () => {
    const card = { id: '123', source: 'Bot', source_data: { id: '456' } };
    const result = getCardSourceLink(card, true);
    expect(result).toBe('/meeting/456?cardId=123');
  });

  it('builds correct link with queryParams true and user for Meeting source', () => {
    const user = { id: '789' };
    const card = { id: '123', source: 'Meeting', source_data: { id: '456' } };
    const result = getCardSourceLink(card, true, user);
    expect(result).toBe('/meeting/456?cardId=123&personId=789');
  });

  it('builds correct link for Channel source', () => {
    const card = { id: '123', source: 'Channel' };
    const result = getCardSourceLink(card, true);
    expect(result).toBe('/cards/123');
  });
});

describe('getCardSource', () => {
  it('returns "Meeting" when source is Meeting', () => {
    const card = { source: 'Meeting' };
    const result = getCardSource(card);
    expect(result).toBe('Meeting');
  });

  it('returns "Email" when source is Channel with Email', () => {
    const card = { source: 'Channel', source_data: { source: 'Email' } };
    const result = getCardSource(card);
    expect(result).toBe('Email');
  });

  it('returns "Digest" when source is Channel with another source', () => {
    const card = { source: 'Channel', source_data: { source: 'Slack' } };
    const result = getCardSource(card);
    expect(result).toBe('Slack Digest');
  });

  it('returns "Earnings Call" when source is Bot', () => {
    const card = { source: 'Bot' };
    const result = getCardSource(card);
    expect(result).toBe('Earnings Call');
  });

  it('returns an empty string for undefined source', () => {
    const card = {};
    const result = getCardSource(card);
    expect(result).toBe('');
  });
});

describe('getCardTime', () => {
  beforeEach(() => {
    timezoneMock.register('UTC');
  });

  afterEach(() => {
    timezoneMock.unregister();
  });

  it('returns formatted time range for Meeting source', () => {
    const card = {
      source: 'Meeting',
      source_data: {
        start_at: 1733947200000,
        end_at: 1733949000000
      }
    };
    const result = getCardTime(card);
    expect(result).toBe('Wed, Dec 11, 8–8:30 PM');
  });

  it('returns formatted creation time for Channel source', () => {
    const card = {
      source: 'Channel',
      created_at: 1733947200000
    };
    const result = getCardTime(card);
    expect(result).toBe('Wed, Dec 11');
  });

  it('returns generated time for undefined source', () => {
    const card = {
      created_at: 1733947200000
    };
    const result = getCardTime(card);
    expect(result).toBe('Generated on Wed, Dec 11, 8:00 PM');
  });
});

describe('getControlBarState', () => {
  const endAt = 1752500700000;
  const isWithinEndWindow = addMinutes(endAt, 4);
  const isAfterEndWindow = addMinutes(endAt, 6);

  const fakeMeeting = { url: 'https://fora.day', end_at: endAt };

  test('should return error state when meetingTimeStatus is not done and meeting.url is missing', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'upcoming',
        errorStateSubCode: '',
        isJoining: false
      },
      { url: null }
    );

    expect(result).toEqual({
      bgColor: 'critical.container',
      color: 'critical.onContainer',
      text: 'Fora Needs a Link',
      leftElement: (
        <SFNoVideoIcon
          color='critical.primary'
          boxSize={5}
        />
      )
    });
  });

  test('should return empty state when meetingTimeStatus is not done and bot was not scheduled', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'upcoming',
        botWasScheduled: false,
        errorStateSubCode: '',
        isJoining: true // shouldn't be the case
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'surface.containerLow',
      color: 'surface.onSurfaceVariant',
      text: 'Fora is not Scheduled'
    });
  });

  test('should return primary state when Fora is Joining', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'upcoming',
        botWasScheduled: true,
        errorStateSubCode: '',
        isJoining: true
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'brandPrimary.primary',
      color: 'brandPrimary.onPrimary',
      text: 'FORA is Joining'
    });
  });

  test('should return error state when Fora is in the Waiting Room', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'live',
        botWasScheduled: true,
        inWaitingRoom: true,
        errorStateSubCode: '',
        isJoining: false
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'critical.container',
      color: 'critical.onContainer',
      text: 'Fora is in the Waiting Room',
      leftElement: (
        <StatusErrorIcon
          color='critical.primary'
          boxSize={5}
        />
      )
    });
  });

  test('should return secondary state when recording has not started but bot is scheduled', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'upcoming',
        recordingWasStarted: false,
        botWasScheduled: true,
        isDone: false,
        inWaitingRoom: false,
        errorStateSubCode: '',
        isJoining: false,
        scheduledReason: 'Tenant-level auto-scheduling enabled'
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'brandPrimary.containerLow',
      color: 'brandPrimary.primary',
      text: 'Fora is Scheduled',
      toolTip: 'Tenant-level auto-scheduling enabled'
    });
  });

  test('should return primary state when meeting is live and not paused', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'live',
        isLive: true,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: false,
        inWaitingRoom: false,
        errorStateSubCode: '',
        isJoining: false,
        scheduledReason: 'Tenant-level auto-scheduling enabled'
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'brandPrimary.primary',
      color: 'brandPrimary.onPrimary',
      text: 'Active • Recording',
      toolTip: 'Tenant-level auto-scheduling enabled'
    });
  });

  test('should return secondary state when meeting is live and paused', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'live',
        isLive: true,
        isOnPause: true,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: false,
        inWaitingRoom: false,
        errorStateSubCode: '',
        isJoining: false,
        scheduledReason: 'Tenant-level auto-scheduling enabled'
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'brandPrimary.containerLow',
      color: 'brandPrimary.primary',
      text: 'Paused',
      toolTip: 'Tenant-level auto-scheduling enabled'
    });
  });

  test('should return error state when FORA could not summarize', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: false,
        wasSummarized: false,
        insufficientTranscripts: false,
        didNotGenerate: true,
        errorStateSubCode: '',
        isJoining: false
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'critical.container',
      color: 'critical.onContainer',
      text: 'FORA could not summarize.'
    });
  });

  test('should return primary state when FORA could summarize', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: false,
        wasSummarized: false,
        insufficientTranscripts: false,
        didNotGenerate: false,
        errorStateSubCode: '',
        isJoining: false
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'brandPrimary.primary',
      color: 'brandPrimary.onPrimary',
      text: 'Summarizing',
      leftElement: (
        <Spinner
          size='sm'
          speed='0.8s'
          color='brandPrimary.onPrimary'
          mr={1}
        />
      )
    });
  });

  test('should return active & recording when call is not "live" but has not ended', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: false,
        botWasKicked: false,
        wasSummarized: false,
        insufficientTranscripts: false,
        didNotGenerate: false,
        errorStateSubCode: '',
        isJoining: false,
        scheduledReason: 'Tenant-level auto-scheduling enabled'
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'brandPrimary.primary',
      color: 'brandPrimary.onPrimary',
      text: 'Active • Recording',
      toolTip: 'Tenant-level auto-scheduling enabled'
    });
  });

  test('should return secondary state when FORA summarized', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: false,
        wasSummarized: true,
        insufficientTranscripts: false,
        didNotGenerate: false,
        errorStateSubCode: '',
        isJoining: false,
        scheduledReason: 'Tenant-level auto-scheduling enabled'
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'brandPrimary.containerLow',
      color: 'brandPrimary.primary',
      text: 'Summarized',
      leftElement: (
        <SFCheckIconCircleFilled
          color='brandPrimary.onContainer'
          boxSize={4}
        />
      ),
      toolTip: 'Tenant-level auto-scheduling enabled'
    });
  });

  test('should return FORA WAS removed', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'live',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: true,
        wasSummarized: false,
        insufficientTranscripts: true,
        didNotGenerate: true,
        errorStateSubCode: '',
        isJoining: false
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'critical.container',
      color: 'critical.onContainer',
      text: 'FORA was removed.',
      toolTip: 'To add the FORA bot back, please click the "Add FORA Back" button.',
      rightElement: <InfoIcon display='inline' />
    });
  });

  test('should return Transcribing state', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: false,
        wasSummarized: false,
        insufficientTranscripts: true,
        didNotGenerate: true,
        isJoining: false,
        hasFatalError: false
      },
      { url: 'https://fora.day', tags: ['meeting_upload'] }
    );

    expect(result).toEqual({
      bgColor: 'brandPrimary.primary',
      color: 'brandPrimary.onPrimary',
      text: 'Transcribing Meeting Recording',
      leftElement: (
        <Spinner
          size='sm'
          speed='0.8s'
          color='brandPrimary.onPrimary'
          mr={1}
        />
      )
    });
  });

  test('should return error state (meeting upload)', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: false,
        wasSummarized: false,
        insufficientTranscripts: true,
        didNotGenerate: true,
        isJoining: false,
        errorStateSubCode: 'call_ended_by_host',
        hasFatalError: true,
        liveDate: isWithinEndWindow
      },
      { url: 'https://fora.day', tags: ['meeting_upload'], end_at: endAt }
    );

    expect(result).toEqual({
      bgColor: 'critical.container',
      color: 'critical.onContainer',
      text: 'FORA was unable to summarize due to lack of content',
      leftElement: <StatusErrorIcon />
    });
  });

  test('should return error state', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: false,
        wasSummarized: false,
        insufficientTranscripts: true,
        didNotGenerate: true,
        errorStateSubCode: 'zoom_local_recording_disabled',
        isJoining: false,
        liveDate: isAfterEndWindow
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'critical.container',
      color: 'critical.onContainer',
      text: 'Zoom Local Recording must be enabled',
      leftElement: <StatusErrorIcon />
    });
  });

  test('should return summarizing if not 5 minutes after meeting end', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: false,
        wasSummarized: false,
        insufficientTranscripts: true,
        didNotGenerate: true,
        errorStateSubCode: 'zoom_local_recording_disabled',
        isJoining: false,
        liveDate: isWithinEndWindow
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'brandPrimary.primary',
      color: 'brandPrimary.onPrimary',
      text: 'Summarizing',
      leftElement: (
        <Spinner
          size='sm'
          speed='0.8s'
          color='brandPrimary.onPrimary'
          mr={1}
        />
      )
    });
  });

  test('should return default azure error state', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: false,
        wasSummarized: false,
        insufficientTranscripts: true,
        didNotGenerate: true,
        hasFatalError: true,
        errorStateSubCode: 'azure_transcription',
        errorStateMessage: 'MICROSOFT_TRANSCRIPTION_FAILURE: {invalid json}',
        liveDate: isWithinEndWindow,
        isJoining: false
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'critical.container',
      color: 'critical.onContainer',
      text: 'FORA was unable to summarize',
      leftElement: <StatusErrorIcon />
    });
  });

  test('should return custom azure error state', () => {
    const result = getControlBarState(
      {
        meetingTimeStatus: 'done',
        isLive: false,
        isOnPause: false,
        recordingWasStarted: true,
        botWasScheduled: true,
        isDone: true,
        inWaitingRoom: false,
        isCallEnded: true,
        botWasKicked: false,
        wasSummarized: false,
        insufficientTranscripts: true,
        didNotGenerate: true,
        hasFatalError: true,
        errorStateSubCode: 'azure_transcription',
        errorStateMessage:
          'MICROSOFT_TRANSCRIPTION_FAILURE: {"createdDateTime":"Mon May 19 20:00:47 UTC 2025","displayName":"bot:00c0366d-3e32-452a-9919-99a3a9cf2bb5","lastActionDateTime":"Mon May 19 20:00:56 UTC 2025","links":{"files":"https:\\/\\/eastus.api.cognitive.microsoft.com\\/speechtotext\\/v3.2\\/transcriptions\\/0372c580-93b1-4268-bc38-ef52db3b5827\\/files"},"locale":"en-US","properties":{"diarization":{"speakers":{"maxCount":10,"minCount":10}},"diarizationEnabled":true,"error":{"code":"InvalidData","message":"The recordings URI contains invalid data."},"profanityFilterMode":"Masked","punctuationMode":"DictatedAndAutomatic","timeToLive":"P1D"},"self":"https:\\/\\/eastus.api.cognitive.microsoft.com\\/speechtotext\\/v3.2\\/transcriptions\\/0372c580-93b1-4268-bc38-ef52db3b5827","status":"Failed"}',
        isJoining: false,
        liveDate: isWithinEndWindow
      },
      fakeMeeting
    );

    expect(result).toEqual({
      bgColor: 'critical.container',
      color: 'critical.onContainer',
      text: 'The recordings URI contains invalid data.',
      leftElement: <StatusErrorIcon />
    });
  });
});

describe('selectAndSortCards', () => {
  const initialCard = { initiative: { id: 'init-1' } };
  const meetingIdWithBot = vi.fn(() => 'meeting-123');
  const meeting = { id: 'meeting-123' };

  it('should sort cards and add generating summary card', () => {
    const getGeneratingSummary = vi.fn(() => ({
      generating: true,
      meetingId: 'meeting-123',
      lensId: 'lens-1',
      initiativeTitle: 'Generated Summary'
    }));

    const cards = [
      { initiative: { id: 'init-2', title: 'Card 2' } },
      { initiative: { id: 'init-1', title: 'Card 1' } }
    ];

    const result = selectAndSortCards(
      cards,
      initialCard,
      getGeneratingSummary,
      meetingIdWithBot,
      meeting
    );

    expect(result).toEqual([
      { initiative: { id: 'init-1', title: 'Card 1' } },
      { initiative: { id: 'init-2', title: 'Card 2' } },
      {
        id: 'generating-summary',
        initiative: {
          id: 'lens-1',
          title: 'Generated Summary',
          tags: ['template']
        }
      }
    ]);
  });

  it('should return unique cards by initiative id', () => {
    const getGeneratingSummary = vi.fn(() => null);

    const cards = [
      { initiative: { id: 'init-1', title: 'Card 1' } },
      { initiative: { id: 'init-1', title: 'Duplicate Card 1' } }
    ];

    const result = selectAndSortCards(
      cards,
      initialCard,
      getGeneratingSummary,
      meetingIdWithBot,
      meeting
    );

    expect(result).toHaveLength(1);
    expect(result[0].initiative.id).toBe('init-1');
  });

  it('should not add generating summary card when generating is false', () => {
    const getGeneratingSummary = vi.fn(() => ({
      generating: false, // Simulate generating being false
      meetingId: 'meeting-123'
    }));

    const cards = [
      { initiative: { id: 'init-2', title: 'Card 2' } },
      { initiative: { id: 'init-1', title: 'Card 1' } }
    ];

    const result = selectAndSortCards(
      cards,
      initialCard,
      getGeneratingSummary,
      meetingIdWithBot,
      meeting
    );

    expect(result).toEqual([
      { initiative: { id: 'init-1', title: 'Card 1' } },
      { initiative: { id: 'init-2', title: 'Card 2' } }
    ]);
  });

  it('should not add generating summary card when meetingId does not match', () => {
    const getGeneratingSummary = vi.fn(() => ({
      generating: true,
      meetingId: 'invalid-meeting-id', // Simulate a mismatch in meetingId
      lensId: 'lens-1',
      initiativeTitle: 'Generated Summary'
    }));

    const cards = [
      { initiative: { id: 'init-2', title: 'Card 2' } },
      { initiative: { id: 'init-1', title: 'Card 1' } }
    ];

    const result = selectAndSortCards(
      cards,
      initialCard,
      getGeneratingSummary,
      meetingIdWithBot,
      meeting
    );

    expect(result).toEqual([
      { initiative: { id: 'init-1', title: 'Card 1' } },
      { initiative: { id: 'init-2', title: 'Card 2' } }
    ]);
  });
});

describe('getDocumentMetadataFromCard', () => {
  const cardWithFileNamed = (name) => ({
    tags: [`filename:${name}`]
  });
  it(`should extract filename and file extension from card tags'`, () => {
    const { name, extension } = getDocumentMetadataFromCard(cardWithFileNamed('test.txt'));
    expect(name).toBe('test.txt');
    expect(extension).toBe('txt');
  });
  it(`should return null when card has no filename tag`, () => {
    const { name, extension } = getDocumentMetadataFromCard({});
    expect(name).toBeNull();
    expect(extension).toBeNull();
  });
});

describe('extractErrorStatus', () => {
  it('returns error message from valid azure_transcription JSON', () => {
    const input =
      'MICROSOFT_TRANSCRIPTION_FAILURE: {"properties":{"error":{"message":"The recordings URI contains invalid data."}}}';
    const result = extractErrorStatus('azure_transcription', input);
    expect(result).toEqual('The recordings URI contains invalid data.');
  });

  it('returns error message from gladia_transcription error', () => {
    const input = 'Failed to retrieve audio file';
    const result = extractErrorStatus('gladia_transcription', input);
    expect(result).toEqual(input);
  });

  it('falls back to RECALL_STATUS_CODE_MAP for known subcode', () => {
    const result = extractErrorStatus('zoom_local_recording_disabled', 'Some message');
    expect(result).toEqual('Zoom Local Recording must be enabled');
  });

  it('returns default fallback message for unknown subcode', () => {
    const result = extractErrorStatus('unknown_subcode', 'Some message');
    expect(result).toEqual('Fora Did Not Attend');
  });

  it('handles invalid JSON gracefully', () => {
    const input = 'MICROSOFT_TRANSCRIPTION_FAILURE: {invalid json}';
    const result = extractErrorStatus('azure_transcription', input);
    expect(result).toEqual('FORA was unable to summarize');
  });

  it('handles missing error message in parsed JSON', () => {
    const input = 'MICROSOFT_TRANSCRIPTION_FAILURE: {"properties":{}}';
    const result = extractErrorStatus('azure_transcription', input);
    expect(result).toEqual('FORA was unable to summarize');
  });
});

describe('getSummaryObject', () => {
  it('returns meeting summary object when isMeeting is true', () => {
    const input = {
      start_at: 123,
      bot: { tweet: 'headline' },
      foo: 'bar'
    };
    const result = getSummaryObject(input, true);
    expect(result).toEqual({
      source: 'Meeting',
      source_data: input,
      created_at: 123,
      headline: 'headline'
    });
  });

  it('returns original object when isMeeting is false', () => {
    const input = { foo: 'bar' };
    const result = getSummaryObject(input, false);
    expect(result).toBe(input);
  });

  it('handles missing bot or tweet gracefully', () => {
    const input = { start_at: 456 };
    const result = getSummaryObject(input, true);
    expect(result).toEqual({
      source: 'Meeting',
      source_data: input,
      created_at: 456,
      headline: undefined
    });
  });

  it('handles missing start_at gracefully', () => {
    const input = { bot: { tweet: 'headline' } };
    const result = getSummaryObject(input, true);
    expect(result).toEqual({
      source: 'Meeting',
      source_data: input,
      created_at: undefined,
      headline: 'headline'
    });
  });
});
