import { vi, describe, it, expect } from 'vitest';
import { render, act, renderHook, waitFor } from '@testing-library/react';
import { useQueryClient } from '@tanstack/react-query';

import {
  useManageMeetingSensitivity,
  useManageMeetingShares,
  getMeetingBotStatuses,
  useMeetingBotStatuses,
  useMeetingRecordingStatus,
  useMeetingPauseResume,
  errorStateData,
  didNotGenerate,
  getScheduledReason,
  useRemoveFora
} from '@util/hooks/meeting.hooks';
import {
  useUpdateMeetingSensitivity,
  useUnshareMeeting,
  useStartMeeting,
  useInvalidateMeetingQueries,
  useUnscheduleBot
} from '@services/query-services/meetings.query-service';
import { sharedEmails } from '@util/helpers/meetings.helpers';
import { useStyledToast } from '@util/hooks/general.hooks';
import {
  usePauseBot,
  useRemoveBot,
  useResumeBot
} from '@services/query-services/bots.query-service';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn()
}));

vi.mock('@services/query-services/meetings.query-service', () => ({
  useUpdateMeetingSensitivity: vi.fn(),
  useUnshareMeeting: vi.fn(),
  useStartMeeting: vi.fn(),
  useInvalidateMeetingQueries: vi.fn(),
  useUnscheduleBot: vi.fn()
}));

vi.mock('@services/query-services/bots.query-service', () => ({
  usePauseBot: vi.fn(),
  useResumeBot: vi.fn(),
  useRemoveBot: vi.fn()
}));

vi.mock('@util/hooks/card.hooks', () => ({
  useCardActions: vi.fn()
}));

vi.mock('@util/hooks/general.hooks', () => ({
  useStyledToast: vi.fn()
}));

// TODO: We should eventually decouple some of the functions in this file,
// it makes testing and mocking them pretty challenging, since so many rely on each other.
vi.mock('@util/hooks/meeting.hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMeetingBotStatuses: vi.fn()
  };
});

const createBot = (overrides = {}) => ({
  id: 'bot_123',
  status_changes: [],
  num_of_transcripts: 0,
  summary: null,
  ...overrides
});

describe('useManageMeetingSensitivity', () => {
  // Component wrapper to use the hook
  const TestComponent = ({ meeting, optimisticUpdateConfig }) => {
    const manageMeetingSensitivity = useManageMeetingSensitivity(optimisticUpdateConfig);
    act(() => {
      manageMeetingSensitivity(meeting);
    });
    return null;
  };

  let setMeetingSensitivityMock;

  beforeEach(() => {
    setMeetingSensitivityMock = vi.fn();
    useUpdateMeetingSensitivity.mockReturnValue({ mutateAsync: setMeetingSensitivityMock });
  });

  it('should call unshareMeeting and setMeetingSensitivity when meeting is not sensitive and has shares', async () => {
    const mockMeeting = {
      id: '123',
      sensitive: false,
      shares: ['user@example.com']
    };

    setMeetingSensitivityMock.mockResolvedValueOnce();

    await act(async () => {
      render(
        <TestComponent
          meeting={mockMeeting}
          optimisticUpdateConfig={{}}
        />
      );
    });

    // Wait for any async operations to complete
    await act(async () => {
      // Ensure setMeetingSensitivity was called after unsharing
      expect(setMeetingSensitivityMock).toHaveBeenCalledWith(
        { id: '123', value: true, params: { clean: true } },
        expect.any(Object)
      );
    });
  });

  it('should call setMeetingSensitivity without unsharing when meeting is already sensitive', async () => {
    const mockMeeting = {
      id: '123',
      sensitive: true,
      shares: ['user@example.com']
    };

    setMeetingSensitivityMock.mockResolvedValueOnce();

    await act(async () => {
      render(
        <TestComponent
          meeting={mockMeeting}
          optimisticUpdateConfig={{}}
        />
      );
    });

    // Wait for async operations to complete
    await act(async () => {
      // Ensure setMeetingSensitivity is called directly
      expect(setMeetingSensitivityMock).toHaveBeenCalledWith(
        { id: '123', value: false, params: { clean: true } },
        expect.any(Object)
      );
    });
  });

  it('should call setMeetingSensitivity without unsharing when meeting has no shares', async () => {
    const mockMeeting = {
      id: '123',
      sensitive: false,
      shares: []
    };

    setMeetingSensitivityMock.mockResolvedValueOnce();

    await act(async () => {
      render(
        <TestComponent
          meeting={mockMeeting}
          optimisticUpdateConfig={{}}
        />
      );
    });

    // Wait for async operations to complete
    await act(async () => {
      // Ensure setMeetingSensitivity is called directly
      expect(setMeetingSensitivityMock).toHaveBeenCalledWith(
        { id: '123', value: true, params: { clean: true } },
        expect.any(Object)
      );
    });
  });
});

describe('useManageMeetingShares', () => {
  // Component wrapper to use the hook
  const TestComponent = ({ meeting }) => {
    const manageMeetingShares = useManageMeetingShares();
    act(() => {
      manageMeetingShares(meeting);
    });
    return null;
  };

  let unshareMeetingMock;

  beforeEach(() => {
    unshareMeetingMock = vi.fn();
    useUnshareMeeting.mockReturnValue({ mutateAsync: unshareMeetingMock });
  });

  it('should call unshareMeeting when meeting is not sensitive and has shares', async () => {
    const mockMeeting = {
      id: '123',
      sensitive: false,
      shares: ['user@example.com']
    };

    unshareMeetingMock.mockResolvedValueOnce();

    await act(async () => {
      render(<TestComponent meeting={mockMeeting} />);
    });

    // Wait for any async operations to complete
    await act(async () => {
      // Ensure unshareMeeting was called with the correct arguments
      expect(unshareMeetingMock).toHaveBeenCalledWith(
        { id: '123', body: sharedEmails(mockMeeting) },
        expect.any(Object)
      );
    });
  });

  it('does not unshare when meeting is already sensitive', async () => {
    const mockMeeting = {
      id: '123',
      sensitive: true,
      shares: ['user@example.com']
    };

    unshareMeetingMock.mockResolvedValueOnce();

    await act(async () => {
      render(<TestComponent meeting={mockMeeting} />);
    });

    // Wait for async operations to complete
    await act(async () => {
      expect(unshareMeetingMock).not.toHaveBeenCalled();
    });
  });

  it('does not unshare when meeting has no shares', async () => {
    const mockMeeting = {
      id: '123',
      sensitive: false,
      shares: []
    };

    unshareMeetingMock.mockResolvedValueOnce();

    await act(async () => {
      render(<TestComponent meeting={mockMeeting} />);
    });

    // Wait for async operations to complete
    await act(async () => {
      expect(unshareMeetingMock).not.toHaveBeenCalled();
    });
  });
});

describe('getMeetingBotStatuses', () => {
  it('should return default values when bot is null', () => {
    const result = getMeetingBotStatuses(null);

    expect(result).toEqual({
      botWasScheduled: false,
      recordingWasStarted: false,
      botIsInMeeting: false,
      isLive: false,
      isOnPause: false,
      isActivelyRecording: false,
      hasTranscripts: false,
      insufficientTranscripts: true,
      startedRecordingAt: null,
      endedRecordingAt: null,
      recordingPausedSegments: [],
      isCallEnded: false,
      isDone: false,
      botWasKicked: false,
      botWasNeverAdmitted: false,
      isRecordingAcquired: false,
      wasSummarized: false,
      didNotGenerate: false,
      lastStatusChange: undefined,
      errorStateSubCode: undefined,
      inWaitingRoom: false,
      isJoining: false,
      hasFatalError: false,
      scheduledReason: ''
    });
  });

  it('should detect when a bot was scheduled', () => {
    const bot = createBot({ id: 'bot_456' });
    const result = getMeetingBotStatuses(bot);
    expect(result.botWasScheduled).toBe(true);
  });

  it('should detect when recording was started', () => {
    const bot = createBot({ status_changes: [{ code: 'in_call_recording' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.recordingWasStarted).toBe(true);
  });

  it('should detect bot in meeting', () => {
    const bot = createBot({ status_changes: [{ code: 'in_call_recording' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.botIsInMeeting).toBe(true);
  });

  it('should detect bot in meeting 2', () => {
    const bot = createBot({ status_changes: [{ code: 'in_call_not_recording' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.botIsInMeeting).toBe(true);
  });

  it('should detect if bot is live', () => {
    const bot = createBot({ status_changes: [{ code: 'in_call_recording' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.isLive).toBe(true);
  });

  it('should detect if bot is paused', () => {
    const bot = createBot({
      status_changes: [
        { code: 'in_call_not_recording' },
        { code: 'in_call_recording' },
        { code: 'in_call_not_recording' }
      ]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.isOnPause).toBe(true);
  });

  it('should detect when call ended', () => {
    const bot = createBot({ status_changes: [{ code: 'call_ended' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.isCallEnded).toBe(true);
  });

  it('should detect when bot is done', () => {
    const bot = createBot({ status_changes: [{ code: 'done' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.isDone).toBe(true);
  });

  it('should detect when bot has fatal status and no num_of_summaries and did not generate a summary', () => {
    const bot = createBot({ status_changes: [{ code: 'fatal' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.didNotGenerate).toBe(true);
  });

  it('should detect when bot has fatal status but has num_of_summaries and did generate a summary', () => {
    const bot = createBot({ status_changes: [{ code: 'fatal', num_of_summaries: 1 }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.didNotGenerate).toBe(false);
  });

  it('should detect when bot has done status no summary on the bot and did not generate a summary', () => {
    const bot = createBot({ status_changes: [{ code: 'done' }], summary: null });
    const result = getMeetingBotStatuses(bot);
    expect(result.didNotGenerate).toBe(true);
  });

  it('should detect when bot has done status but 0 num_of_summaries and did not generate a summary', () => {
    const bot = createBot({ status_changes: [{ code: 'done', num_of_summaries: 0 }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.didNotGenerate).toBe(true);
  });

  it('should detect when bot has done status and > 0 num_of_summaries and did not generate a summary', () => {
    const bot = createBot({ status_changes: [{ code: 'done', num_of_summaries: 1 }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.didNotGenerate).toBe(false);
  });

  it('should detect has transcripts', () => {
    const bot = createBot({ num_of_transcripts: 1 });
    const result = getMeetingBotStatuses(bot);
    expect(result.hasTranscripts).toBe(true);
  });

  it('should detect when bot was kicked', () => {
    const bot = createBot({
      status_changes: [{ code: 'call_ended', sub_code: 'bot_kicked_from_call' }]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.botWasKicked).toBe(true);
  });

  it('should detect when bot was never admitted', () => {
    const bot = createBot({
      status_changes: [{ code: 'call_ended', sub_code: 'timeout_exceeded_waiting_room' }]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.botWasNeverAdmitted).toBe(true);
  });

  it('should detect when the bot is actively recording', () => {
    const bot = createBot({
      status_changes: [{ code: 'in_call_recording' }]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.isActivelyRecording).toBe(true);
  });

  it('should detect when recording is acquired', () => {
    const bot = createBot({
      status_changes: [{ code: 'recording_acquired' }]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.isRecordingAcquired).toBe(true);
  });

  it('should detect a summary', () => {
    const bot = createBot({ summary: 'Some summarized content' });
    const result = getMeetingBotStatuses(bot);
    expect(result.wasSummarized).toBe(true);
  });

  it('should detect bot inWaitingRoom', () => {
    const bot = createBot({ status_changes: [{ code: 'in_waiting_room' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.inWaitingRoom).toBe(true);
  });

  it('should detect isJoining', () => {
    const bot = createBot({ status_changes: [{ code: 'joining_call' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.isJoining).toBe(true);
  });

  it('should detect isJoining by in_call_not_recording', () => {
    const bot = createBot({ status_changes: [{ code: 'in_call_not_recording' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.isJoining).toBe(true);
  });

  it('should detect isJoining by recording_permission_allowed', () => {
    const bot = createBot({ status_changes: [{ code: 'recording_permission_allowed' }] });
    const result = getMeetingBotStatuses(bot);
    expect(result.isJoining).toBe(true);
  });

  it('should not detect isJoining when in_call_not_recording > 1', () => {
    const bot = createBot({
      status_changes: [
        { code: 'in_call_not_recording' },
        { code: 'in_call_recording' },
        { code: 'in_call_not_recording' }
      ]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.isJoining).toBe(false);
  });

  it('should not detect isJoining when recording_permission_allowed > 1', () => {
    const bot = createBot({
      status_changes: [
        { code: 'recording_permission_allowed' },
        { code: 'recording_permission_denied' },
        { code: 'recording_permission_allowed' }
      ]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.isJoining).toBe(false);
  });

  it('should detect hasFatalError', () => {
    const bot = createBot({
      status_changes: [{ code: 'fatal' }]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.hasFatalError).toBe(true);
  });

  it('should return the last_status_change', () => {
    const bot = createBot({
      status_changes: [{ code: 'in_call_not_recording' }, { code: 'in_call_recording' }]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.lastStatusChange).toEqual({ code: 'in_call_recording' });
  });

  it('should return the correct timestamps for recording start and end', () => {
    const bot = createBot({
      status_changes: [
        { code: 'in_call_recording', created_at: '2024-01-01T10:00:00Z' },
        { code: 'call_ended', created_at: '2024-01-01T11:00:00Z' }
      ]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.startedRecordingAt).toBe('2024-01-01T10:00:00Z');
    expect(result.endedRecordingAt).toBe('2024-01-01T11:00:00Z');
  });

  it('should return errorStateSubCode', () => {
    const bot = createBot({
      status_changes: [
        { code: 'in_call_not_recording' },
        { code: 'in_call_recording' },
        { code: 'fatal', sub_code: 'azure_transciption', message: 'AZURE TRANSCRIPTION FAILED' }
      ]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.errorStateSubCode).toEqual('azure_transciption');
  });

  it('should return errorStateMessage', () => {
    const bot = createBot({
      status_changes: [
        { code: 'in_call_not_recording' },
        { code: 'in_call_recording' },
        { code: 'fatal', sub_code: 'azure_transciption', message: 'AZURE TRANSCRIPTION FAILED' }
      ]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.errorStateMessage).toEqual('AZURE TRANSCRIPTION FAILED');
  });

  it('should correctly sort the status changes', () => {
    const bot = createBot({
      status_changes: [
        { code: 'in_call_recording', created_at: 1739562233915 },
        { code: 'ready', created_at: 1739562233900 }
      ]
    });
    const result = getMeetingBotStatuses(bot);
    expect(result.lastStatusChange).toEqual({
      code: 'in_call_recording',
      created_at: 1739562233915
    });
  });

  it('should return scheduledReason', () => {
    const bot = createBot({ origin: 'Auto_By_Tenant' });
    const result = getMeetingBotStatuses(bot);
    expect(result.scheduledReason).toEqual('Tenant-level auto-scheduling enabled');
  });
});

describe('useMeetingRecordingStatus', () => {
  let mockStartMeeting;
  let mockToast;
  let mockInvalidateMeetingQueries;
  const mockQueryClient = {
    invalidateQueries: vi.fn()
  };

  beforeEach(() => {
    mockStartMeeting = vi.fn().mockResolvedValue({});
    mockToast = vi.fn();
    mockInvalidateMeetingQueries = vi.fn();

    useMeetingBotStatuses.mockReturnValue({ botIsInMeeting: false });
    useInvalidateMeetingQueries.mockReturnValue({
      mutateAsync: mockInvalidateMeetingQueries,
      isLoading: false
    });
    useStartMeeting.mockReturnValue({ mutateAsync: mockStartMeeting, isLoading: false });
    useStyledToast.mockReturnValue(mockToast);
    useQueryClient.mockReturnValue(mockQueryClient);

    useInvalidateMeetingQueries.mockImplementation((meetingArg) => {
      return () => {
        mockQueryClient.invalidateQueries({
          queryKey: ['meetings', { id: meetingArg?.id }, 'all'],
          refetchActive: true,
          refetchInactive: true
        });
      };
    });
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: vi.fn() }
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should initialize with correct default values', () => {
    const { result } = renderHook(() => useMeetingRecordingStatus({}, {}));

    expect(result.current.isStartingRecording).toBe(false);
    expect(result.current.isStartingMeeting).toBe(false);
  });

  test('should set isStartingRecording to false when botIsInMeeting becomes true', () => {
    const { result, rerender } = renderHook(({ bot }) => useMeetingRecordingStatus({}, bot), {
      initialProps: { bot: {} }
    });

    expect(result.current.isStartingRecording).toBe(false);

    useMeetingBotStatuses.mockReturnValue({ botIsInMeeting: true });
    rerender({ bot: {} });

    expect(result.current.isStartingRecording).toBe(false);
  });

  test('should start meeting and update state correctly', async () => {
    const meeting = { id: '123', linked: { id: '456', bot_id: 'bot123' } };
    const { result } = renderHook(() => useMeetingRecordingStatus(meeting, {}));

    await act(async () => {
      await result.current.startMeetingAndRecording();
    });

    expect(result.current.isStartingRecording).toBe(true);
    expect(mockStartMeeting).toHaveBeenCalledWith(
      { meetingId: '123' },
      expect.any(Object),
      expect.any(Object)
    );
    expect(mockQueryClient.invalidateQueries).toHaveBeenCalledWith({
      queryKey: ['meetings', { id: '123' }, 'all'], // uses curr meeting id
      refetchActive: true,
      refetchInactive: true
    });
  });
});

describe('useMeetingPauseResume', () => {
  const mockResume = vi.fn();
  const mockPause = vi.fn();
  const mockInvalidate = vi.fn();

  const mockQueryClient = { invalidateQueries: mockInvalidate };

  beforeEach(() => {
    vi.useFakeTimers();
    useMeetingBotStatuses.mockReturnValue({ isOnPause: true });
    useQueryClient.mockReturnValue(mockQueryClient);
    useResumeBot.mockReturnValue({ mutateAsync: mockResume });
    usePauseBot.mockReturnValue({ mutateAsync: mockPause });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('should call resumeBot if bot is currently on pause', async () => {
    const pausedBot = createBot({
      status_changes: [
        { code: 'in_call_not_recording' },
        { code: 'in_call_recording' },
        { code: 'in_call_not_recording' }
      ]
    });
    const { result } = renderHook(() => useMeetingPauseResume({ start_at: new Date() }, pausedBot));
    await act(async () => {
      await result.current.pauseResume();
    });

    expect(mockResume).toHaveBeenCalledWith({ id: 'bot_123' });
  });

  it('should call pause if bot is currently recording', async () => {
    const recordingBot = createBot({
      status_changes: [{ code: 'in_call_not_recording' }, { code: 'in_call_recording' }]
    });
    const { result } = renderHook(() =>
      useMeetingPauseResume({ start_at: new Date() }, recordingBot)
    );
    await act(async () => await result.current.pauseResume());
    expect(mockPause).toHaveBeenCalledWith({ id: 'bot_123' });
  });

  it("should mark agenda meeting query for provided meeting's day as invalid", async () => {
    const { result } = renderHook(() =>
      useMeetingPauseResume({ start_at: new Date(2025, 5, 16, 12, 0, 0) }, { id: '123' })
    );
    await act(async () => await result.current.pauseResume());

    expect(mockInvalidate).toHaveBeenCalledWith({ queryKey: ['recall/bots'] });
    expect(mockInvalidate).toHaveBeenCalledWith({
      queryKey: ['meetings', 'agenda', '6/16/2025'],
      refetchType: 'none'
    });
  });
});

describe('didNotGenerate', () => {
  it('returns false if hasFatalError is true and there is a summary in statusChanges', () => {
    const result = didNotGenerate(true, false, [{ code: 'fatal', num_of_summaries: 1 }], {
      summary: null
    });
    expect(result).toBe(false);
  });

  it('returns false if isDone is true and there is a summary in statusChanges', () => {
    const result = didNotGenerate(false, true, [{ code: 'done', num_of_summaries: 2 }], {
      summary: null
    });
    expect(result).toBe(false);
  });

  it('returns true if isDone is true and bot.summary is falsy, and no summaries in statusChanges', () => {
    const result = didNotGenerate(false, true, [{ code: 'done', num_of_summaries: 0 }], {
      summary: null
    });
    expect(result).toBe(true);
  });

  it('returns false if isDone is true and bot.summary is truthy', () => {
    const result = didNotGenerate(false, true, [{ code: 'done', num_of_summaries: 0 }], {
      summary: 'generated-summary'
    });
    expect(result).toBe(false);
  });

  it('returns false if statusChanges has at least one truthy num_of_summaries', () => {
    const result = didNotGenerate(
      false,
      false,
      [{ num_of_summaries: 0 }, { num_of_summaries: 5 }],
      { summary: null }
    );
    expect(result).toBe(false);
  });

  it('returns false if statusChanges is null or undefined and isDone is false', () => {
    const result = didNotGenerate(false, false, null, { summary: null });
    expect(result).toBe(false);
  });

  it('returns false if bot is null or undefined and isDone is false', () => {
    const result = didNotGenerate(false, false, [], null);
    expect(result).toBe(false);
  });

  it('returns false if neither isDone nor hasFatalError is true', () => {
    const result = didNotGenerate(false, false, [{ num_of_summaries: 0 }], { summary: null });
    expect(result).toBe(false);
  });
});

describe('errorStateData', () => {
  it('returns sub_code when a matching code is found', () => {
    const statusChanges = [
      { code: 'other_code' },
      { code: 'call_ended', sub_code: 'call_ended_by_host' }
    ];
    expect(errorStateData(statusChanges)).toEqual({ subCode: 'call_ended_by_host' });
  });

  it('returns sub_code when a matching fatal code is found', () => {
    const statusChanges = [
      { code: 'other_code', sub_code: '123' },
      { code: 'fatal', sub_code: 'bot_error' }
    ];
    expect(errorStateData(statusChanges)).toEqual({ subCode: 'bot_error' });
  });

  it('returns message when an error with message is found', () => {
    const statusChanges = [
      { code: 'other_code', sub_code: '123' },
      { code: 'fatal', sub_code: 'bot_error', message: 'Detailed Explanation of error' }
    ];
    expect(errorStateData(statusChanges)).toEqual({
      subCode: 'bot_error',
      message: 'Detailed Explanation of error'
    });
  });

  it('returns sub_code when a matching recording_permission_denied code is found', () => {
    const statusChanges = [
      { code: 'other_code', sub_code: '123' },
      { code: 'recording_permission_denied', sub_code: 'zoom_local_recording_disabled' }
    ];
    expect(errorStateData(statusChanges)).toEqual({ subCode: 'zoom_local_recording_disabled' });
  });

  it('returns an empty object when no matching code is found', () => {
    const statusChanges = [
      { code: 'other_code', sub_code: '123' },
      { code: 'another_code', sub_code: '456' }
    ];
    expect(errorStateData(statusChanges)).toEqual({});
  });

  it('returns an empty object when the matching code has no sub_code', () => {
    const statusChanges = [{ code: 'call_ended' }, { code: 'fatal', sub_code: undefined }];
    expect(errorStateData(statusChanges)).toEqual({});
  });

  it('returns the first found sub_code if multiple matching codes exist', () => {
    const statusChanges = [
      { code: 'fatal', sub_code: '999' },
      { code: 'call_ended', sub_code: '123' }
    ];
    expect(errorStateData(statusChanges)).toEqual({ subCode: '999' }); // First matching sub_code
  });

  it('returns an empty object when given an empty array', () => {
    expect(errorStateData([])).toEqual({});
  });
});

describe('useRemoveFora', () => {
  let mockRemoveBot;
  let mockUnscheduleBotForMeeting;
  let mockUnscheduleMeetingSeries;
  let mockToast;
  let mockInvalidateMeetingQueries;
  const mockQueryClient = {
    invalidateQueries: vi.fn()
  };

  beforeEach(() => {
    mockToast = vi.fn();
    mockInvalidateMeetingQueries = vi.fn();
    mockUnscheduleBotForMeeting = vi.fn();
    mockUnscheduleMeetingSeries = vi.fn();
    mockRemoveBot = vi.fn();

    // getMeetingBotStatuses = vi.fn();

    useRemoveBot.mockReturnValue({
      mutateAsync: mockRemoveBot,
      isLoading: false
    });
    useUnscheduleBot.mockImplementation(({ keep }) => {
      const mutateAsync = keep ? mockUnscheduleBotForMeeting : mockUnscheduleMeetingSeries;
      return { mutateAsync, isLoading: false };
    });
    useInvalidateMeetingQueries.mockReturnValue({
      mutateAsync: mockInvalidateMeetingQueries,
      isLoading: false
    });
    useStyledToast.mockReturnValue(mockToast);
    useQueryClient.mockReturnValue(mockQueryClient);

    useInvalidateMeetingQueries.mockImplementation((meetingArg) => {
      return () => {
        mockQueryClient.invalidateQueries({
          queryKey: ['meetings', { id: meetingArg?.id }, 'all'],
          refetchActive: true,
          refetchInactive: true
        });
      };
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('should initialize with correct default values', () => {
    const { result } = renderHook(() => useRemoveFora({}, {}));

    expect(result.current.isRemovingFora).toBe(false);
    expect(result.current.isRemovingFromSeries).toBe(false);
  });

  test('should use removeBot if bot is in meeting, else unscheduleBotForMeeting', async () => {
    const botInTheMeeting = { status_changes: [{ code: 'in_call_recording' }] };

    const { result, rerender } = renderHook(({ bot }) => useRemoveFora({ id: 'meeting-1' }, bot), {
      initialProps: { bot: {} }
    });

    await act(async () => await result.current.removeFora());
    await waitFor(() => expect(useUnscheduleBot).toHaveBeenCalledWith({ keep: true }));
    await waitFor(() =>
      expect(mockUnscheduleBotForMeeting).toHaveBeenCalledWith(
        { id: 'meeting-1' },
        expect.anything()
      )
    );

    rerender({ bot: botInTheMeeting });

    await act(async () => await result.current.removeFora());
    await waitFor(() => expect(mockRemoveBot).toHaveBeenCalledOnce());
  });

  test('removeForaFromSeries should call useUnscheduleBot with keep set to false', async () => {
    const { result } = renderHook(() => useRemoveFora({ id: 'meeting-1' }, {}));
    await act(async () => await result.current.removeFromSeries());
    await waitFor(() => expect(useUnscheduleBot).toHaveBeenCalledWith({ keep: false }));
    expect(mockUnscheduleMeetingSeries).toHaveBeenCalledWith(
      { id: 'meeting-1' },
      expect.anything()
    );
  });
});

describe('getScheduledReason', () => {
  it('returns user auto-scheduling message for Auto_By_Person origin', () => {
    const bot = {
      origin: 'Auto_By_Person',
      creator: { name: 'Alice' }
    };
    expect(getScheduledReason(bot)).toBe('User auto-scheduling enabled for Alice');
  });

  it('returns tenant-level message for Auto_By_Tenant origin', () => {
    const bot = {
      origin: 'Auto_By_Tenant'
    };
    expect(getScheduledReason(bot)).toBe('Tenant-level auto-scheduling enabled');
  });

  it('returns manual message for Manual origin', () => {
    const bot = {
      origin: 'Manual',
      creator: { name: 'Bob' }
    };
    expect(getScheduledReason(bot)).toBe('Manually added by Bob');
  });

  it('returns empty string for unknown origin', () => {
    const bot = {
      origin: 'Some_Unknown_Value'
    };
    expect(getScheduledReason(bot)).toBe('');
  });

  it('returns empty string when bot is undefined', () => {
    expect(getScheduledReason(undefined)).toBe('');
  });

  it('handles missing creator gracefully for Manual', () => {
    const bot = {
      origin: 'Manual'
    };
    expect(getScheduledReason(bot)).toBe('Manually added by undefined');
  });

  it('handles missing creator gracefully for Auto_By_Person', () => {
    const bot = {
      origin: 'Auto_By_Person'
    };
    expect(getScheduledReason(bot)).toBe('User auto-scheduling enabled for undefined');
  });
});
