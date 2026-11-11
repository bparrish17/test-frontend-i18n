import React from 'react';
import { createRoot } from 'react-dom/client';
import { act } from '@testing-library/react';
import { vi } from 'vitest';
import { addMinutes } from 'date-fns';

import { useControlBarState } from '@util/hooks/reskin-meeting-card.hooks';
import { useMeetingBotStatuses, useMeetingTimeStatus } from '@util/hooks/meeting.hooks';
import { useLiveDate } from '@util/hooks';
import { getControlBarState } from '@util/helpers/card.helpers';

// Mock the dependencies
vi.mock('@util/hooks/meeting.hooks', () => {
  return {
    useMeetingBotStatuses: vi.fn(),
    useMeetingTimeStatus: vi.fn()
  };
});

vi.mock('@util/helpers/card.helpers', () => ({
  getControlBarState: vi.fn()
}));

vi.mock('@util/hooks');

describe('useControlBarState', () => {
  const mockDate = new Date();
  let container;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
    vi.clearAllMocks();
    vi.restoreAllMocks(); // Restore original implementations
  });

  const TestComponent = ({ meeting, bot }) => {
    const controlBarState = useControlBarState(meeting, bot);
    return <div data-testid='controlBarState'>{JSON.stringify(controlBarState)}</div>;
  };

  it('should return the correct controlBarState based on inputs', async () => {
    // Mock custom hooks' return values
    const mockMeetingBotStatuses = {
      botWasScheduled: true,
      recordingWasStarted: false,
      botWasKicked: false,
      botWasNeverAdmitted: false,
      isCallEnded: false,
      isLive: true,
      isDone: false,
      inWaitingRoom: false,
      wasSummarized: false,
      isOnPause: false,
      hasTranscripts: true,
      didNotGenerate: false,
      errorStateSubCode: null,
      errorStateMessage: null,
      isJoining: false,
      hasFatalError: false,
      scheduledReason: ''
    };
    const mockMeetingTimeStatus = 'live';

    const mockMeeting = { url: 'https://meeting.example.com' };
    const mockBot = { id: 'bot123' };

    vi.mocked(useMeetingBotStatuses).mockReturnValue(mockMeetingBotStatuses);
    vi.mocked(useMeetingTimeStatus).mockReturnValue(mockMeetingTimeStatus);
    vi.mocked(useLiveDate).mockReturnValue(mockDate);
    vi.mocked(getControlBarState).mockReturnValue({
      leftElement: <span>Live</span>,
      text: 'Recording',
      bgColor: 'green_system.500',
      color: 'white'
    });

    // Render the component and assert
    await act(() => {
      createRoot(container).render(
        <TestComponent
          meeting={mockMeeting}
          bot={mockBot}
        />
      );
    });

    const result = container.querySelector('[data-testid="controlBarState"]');
    const controlBarState = JSON.parse(result.textContent);

    // Assertions
    expect(useMeetingBotStatuses).toHaveBeenCalledWith(mockBot);
    expect(useMeetingTimeStatus).toHaveBeenCalledWith(mockMeeting);
    expect(useLiveDate).toHaveBeenCalledWith(10000);
    expect(getControlBarState).toHaveBeenCalledWith(
      {
        meetingTimeStatus: mockMeetingTimeStatus,
        liveDate: mockDate,
        ...mockMeetingBotStatuses
      },
      mockMeeting
    );
    expect(controlBarState).toEqual({
      leftElement: {
        type: 'span',
        _owner: null,
        _store: {},
        props: { children: 'Live' },
        key: null,
        ref: null
      },
      text: 'Recording',
      bgColor: 'green_system.500',
      color: 'white'
    });
  });

  const testControlBarStateStatusChange = async (initialStatuses, updatedStatuses) => {
    const mockMeeting = { url: 'https://meeting.example.com' };
    const mockBot = { id: 'bot123' };

    vi.mocked(useMeetingBotStatuses)
      .mockReturnValueOnce(initialStatuses)
      .mockReturnValueOnce(updatedStatuses);

    vi.mocked(getControlBarState)
      .mockReturnValueOnce({ text: 'Initial' })
      .mockReturnValueOnce({ text: 'Updated' });

    const root = createRoot(container);

    // Render the component with initial statuses
    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeeting}
          bot={mockBot}
        />
      );
    });

    let result = container.querySelector('[data-testid="controlBarState"]');
    let controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Initial');

    // Update hook dependencies and re-render
    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeeting}
          bot={mockBot}
        />
      );
    });

    result = container.querySelector('[data-testid="controlBarState"]');
    controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Updated');
  };

  describe.each([
    [{ botWasScheduled: true }, { botWasScheduled: false }],
    [{ recordingWasStarted: true }, { recordingWasStarted: false }],
    [{ botWasKicked: true }, { botWasKicked: false }],
    [{ botWasNeverAdmitted: true }, { botWasNeverAdmitted: false }],
    [{ isCallEnded: true }, { isCallEnded: false }],
    [{ isLive: true }, { isLive: false }],
    [{ isDone: true }, { isDone: false }],
    [{ inWaitingRoom: true }, { inWaitingRoom: false }],
    [{ wasSummarized: true }, { wasSummarized: false }],
    [{ isOnPause: true }, { isOnPause: false }],
    [{ hasTranscripts: true }, { hasTranscripts: false }],
    [{ didNotGenerate: true }, { didNotGenerate: false }],
    [{ errorStateSubCode: true }, { errorStateSubCode: false }],
    [{ errorStateMessage: true }, { errorStateMessage: false }],
    [{ isJoining: true }, { isJoining: false }],
    [{ insufficientTranscripts: true }, { insufficientTranscripts: false }],
    [{ hasFatalError: false }, { hasFatalError: true }],
    [{ scheduledReason: false }, { scheduledReason: true }]
  ])(
    'should recompute controlBarState when status dependencies change',
    (initialStatuses, updatedStatuses) => {
      it(`should recompute when ${Object.keys(initialStatuses)[0]} changes`, async () => {
        await testControlBarStateStatusChange(initialStatuses, updatedStatuses);
      });
    }
  );

  it('should recompute controlBarState when meeting url changes', async () => {
    const initialStatuses = { botWasScheduled: true };
    const mockBot = { id: 'bot123' };

    vi.mocked(useLiveDate).mockReturnValue(mockDate);
    vi.mocked(useMeetingBotStatuses).mockReturnValue(initialStatuses);

    // fake responses for testing purposes, these do not reflect actual
    // responses from getControlBarState
    vi.mocked(getControlBarState)
      .mockReturnValueOnce({ text: 'Initial' })
      .mockReturnValueOnce({ text: 'Updated' });

    const root = createRoot(container);

    const mockMeetingOne = { url: 'https://meeting.example.com' };
    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeetingOne}
          bot={mockBot}
        />
      );
    });

    let result = container.querySelector('[data-testid="controlBarState"]');
    let controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Initial');

    const mockMeetingTwo = { url: 'https://meeting-two.example.com' };
    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeetingTwo}
          bot={mockBot}
        />
      );
    });

    result = container.querySelector('[data-testid="controlBarState"]');
    controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Updated');
  });

  it('should recompute controlBarState when meeting tags change', async () => {
    const initialStatuses = { botWasScheduled: true };
    const mockBot = { id: 'bot123' };

    vi.mocked(useLiveDate).mockReturnValue(mockDate);
    vi.mocked(useMeetingBotStatuses).mockReturnValue(initialStatuses);

    // fake responses for testing purposes, these do not reflect actual
    // responses from getControlBarState
    vi.mocked(getControlBarState)
      .mockReturnValueOnce({ text: 'Initial' })
      .mockReturnValueOnce({ text: 'Updated' });

    const root = createRoot(container);

    const mockMeetingOne = { tags: [] };
    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeetingOne}
          bot={mockBot}
        />
      );
    });

    let result = container.querySelector('[data-testid="controlBarState"]');
    let controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Initial');

    const mockMeetingTwo = { tags: ['meeting_upload'] };
    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeetingTwo}
          bot={mockBot}
        />
      );
    });

    result = container.querySelector('[data-testid="controlBarState"]');
    controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Updated');
  });

  it('should recompute controlBarState when meetingTimeStatus changes', async () => {
    const initialStatuses = { botWasScheduled: true };
    const mockBot = { id: 'bot123' };
    const mockMeeting = { url: 'https://meeting.example.com' };

    vi.mocked(useLiveDate).mockReturnValue(mockDate);
    vi.mocked(useMeetingBotStatuses).mockReturnValue(initialStatuses);

    // fake responses for testing purposes, these do not reflect actual
    // responses from getControlBarState
    vi.mocked(getControlBarState)
      .mockReturnValueOnce({ text: 'Initial' })
      .mockReturnValueOnce({ text: 'Updated' });

    // useMeetingTimeStatus returns different values causing a data refresh
    vi.mocked(useMeetingTimeStatus).mockReturnValueOnce('upcoming').mockReturnValueOnce('live');

    const root = createRoot(container);

    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeeting}
          bot={mockBot}
        />
      );
    });

    let result = container.querySelector('[data-testid="controlBarState"]');
    let controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Initial');

    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeeting}
          bot={mockBot}
        />
      );
    });

    result = container.querySelector('[data-testid="controlBarState"]');
    controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Updated');
  });

  it('should recompute controlBarState when useLiveDate changes', async () => {
    const initialStatuses = { botWasScheduled: true };
    const mockBot = { id: 'bot123' };
    const mockMeeting = { url: 'https://meeting.example.com' };

    vi.mocked(useMeetingTimeStatus).mockReturnValueOnce('upcoming');
    vi.mocked(useMeetingBotStatuses).mockReturnValue(initialStatuses);

    // fake responses for testing purposes, these do not reflect actual
    // responses from getControlBarState
    vi.mocked(getControlBarState)
      .mockReturnValueOnce({ text: 'Initial' })
      .mockReturnValueOnce({ text: 'Updated' });

    // useLiveDate should change after initial load, causing a data refresh
    vi.mocked(useLiveDate).mockReturnValueOnce(mockDate).mockReturnValue(addMinutes(mockDate, 1));

    const root = createRoot(container);

    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeeting}
          bot={mockBot}
        />
      );
    });

    let result = container.querySelector('[data-testid="controlBarState"]');
    let controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Initial');

    await act(() => {
      root.render(
        <TestComponent
          meeting={mockMeeting}
          bot={mockBot}
        />
      );
    });

    result = container.querySelector('[data-testid="controlBarState"]');
    controlBarState = JSON.parse(result.textContent);
    expect(controlBarState.text).toBe('Updated');
  });
});
