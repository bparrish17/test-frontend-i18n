import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { useAgendaMeetingActions, useAgendaState } from '@util/hooks/agenda.hooks';
import { useArchiveMeeting } from '@services/query-services/meetings.query-service';
import { useCardActions, useMeetingMetaActions, useStyledToast } from '@util/hooks';

import { useNylasAccountStatus } from '@services/query-services/nylas.query-service';
import { useCalendars } from '@services/query-services/calendars.query-service';

vi.mock('@util/hooks', async () => ({
  useCardActions: vi.fn(() => vi.fn()),
  useMeetingMetaActions: vi.fn(() => vi.fn()),
  useStyledToast: vi.fn(() => vi.fn()),
  useClock: vi.fn()
}));

vi.mock('@services/query-services/meetings.query-service', async () => ({
  useArchiveMeeting: vi.fn(() => ({
    mutate: vi.fn()
  }))
}));

vi.mock('@tanstack/react-query', async (importActual) => {
  const original = await importActual();
  return {
    ...original,
    useQueryClient: vi.fn(() => ({
      invalidateQueries: vi.fn()
    }))
  };
});

vi.mock('@services/query-services/nylas.query-service');
vi.mock('@services/query-services/calendars.query-service');

describe('useAgendaMeetingActions', () => {
  const date = new Date('2025-06-06');

  const wrapper = ({ children }) => {
    const queryClient = new QueryClient();
    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns onCardActionClick and onMeetingActionClick', () => {
    const { result } = renderHook(() => useAgendaMeetingActions(date), { wrapper });
    expect(result.current).toHaveProperty('onCardActionClick');
    expect(result.current).toHaveProperty('onMeetingActionClick');
    expect(typeof result.current.onCardActionClick).toBe('function');
    expect(typeof result.current.onMeetingActionClick).toBe('function');
  });

  it('provides expected optimisticUpdateConfigs to action hooks', () => {
    const agendaQueryKey = ['agenda', '6/06/2025'];
    renderHook(() => useAgendaMeetingActions(date), { wrapper });
    expect(useArchiveMeeting).toHaveBeenCalledWith({
      optimisticUpdateConfig: expect.objectContaining({
        enabled: true,
        type: 'search',
        queryKeyToUpdate: agendaQueryKey,
        updaterFn: expect.any(Function)
      })
    });
    expect(useCardActions).toHaveBeenCalledWith({
      type: 'search',
      model: 'meetings',
      queryKeyToUpdate: agendaQueryKey,
      updaterFn: expect.any(Function)
    });
    expect(useMeetingMetaActions).toHaveBeenCalledWith({
      type: 'search',
      queryKeyToUpdate: agendaQueryKey
    });
  });

  it('calls archiveMeeting on "archive" action', () => {
    const mockMutate = vi.fn();
    const mockToast = vi.fn();
    const invalidateQueries = vi.fn();

    useArchiveMeeting.mockReturnValue({ mutate: mockMutate });
    useStyledToast.mockReturnValue(mockToast);
    useQueryClient.mockReturnValue({ invalidateQueries });

    const { result } = renderHook(() => useAgendaMeetingActions(date), { wrapper });

    const fakeMeeting = { id: 'abc123' };

    act(() => {
      result.current.onMeetingActionClick('archive', null, fakeMeeting);
    });

    expect(mockMutate).toHaveBeenCalledWith(
      { id: 'abc123' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function)
      })
    );
  });

  it('calls onMeetingMetaActionClick on non-archive action', () => {
    const mockMetaAction = vi.fn();
    useMeetingMetaActions.mockReturnValue(mockMetaAction);

    const { result } = renderHook(() => useAgendaMeetingActions(date), { wrapper });

    const fakeMeeting = { id: 'xyz' };

    act(() => {
      result.current.onMeetingActionClick('share', 'value', fakeMeeting);
    });

    expect(mockMetaAction).toHaveBeenCalledWith('share', 'value', fakeMeeting);
  });
});

describe('useAgendaState', () => {
  const mockUser = { id: 'user-1' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns "isLoading" when any loading flag is true', () => {
    useNylasAccountStatus.mockReturnValue({ data: null, isLoading: true });
    useCalendars.mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHook(() =>
      useAgendaState({
        isMeetingsLoading: false,
        isMeetingsSuccess: false,
        meetings: [],
        user: mockUser
      })
    );

    expect(result.current).toBe('isLoading');
  });

  it('returns "errorNoNylasAccount" if nylas status is noAccount and calendars are empty', () => {
    useNylasAccountStatus.mockReturnValue({ data: { status: 'noAccount' }, isLoading: false });
    useCalendars.mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHook(() =>
      useAgendaState({
        isMeetingsLoading: false,
        isMeetingsSuccess: false,
        meetings: [],
        user: mockUser
      })
    );

    expect(result.current).toBe('errorNoNylasAccount');
  });

  it('returns "errorInvalidNylasAccount" if nylas status is noAccount but calendars exist', () => {
    useNylasAccountStatus.mockReturnValue({ data: { status: 'noAccount' }, isLoading: false });
    useCalendars.mockReturnValue({ data: [{ id: 'cal1' }], isLoading: false });

    const { result } = renderHook(() =>
      useAgendaState({
        isMeetingsLoading: false,
        isMeetingsSuccess: false,
        meetings: [],
        user: mockUser
      })
    );

    expect(result.current).toBe('errorInvalidNylasAccount');
  });

  it('returns "errorInvalidNylasAccount" if nylas status is invalidAccount', () => {
    useNylasAccountStatus.mockReturnValue({ data: { status: 'invalidAccount' }, isLoading: false });
    useCalendars.mockReturnValue({ data: [{ id: 'cal1' }], isLoading: false });

    const { result } = renderHook(() =>
      useAgendaState({
        isMeetingsLoading: false,
        isMeetingsSuccess: false,
        meetings: [],
        user: mockUser
      })
    );

    expect(result.current).toBe('errorInvalidNylasAccount');
  });

  it('returns "errorNoCalendars" if nylasAccount has no num_of_calendars', () => {
    useNylasAccountStatus.mockReturnValue({
      data: { status: 'validAccount', num_of_calendars: 0 },
      isLoading: false
    });
    useCalendars.mockReturnValue({ data: [{ id: 'cal1' }], isLoading: false });

    const { result } = renderHook(() =>
      useAgendaState({
        isMeetingsLoading: false,
        isMeetingsSuccess: false,
        meetings: [],
        user: mockUser
      })
    );

    expect(result.current).toBe('errorNoCalendars');
  });

  it('returns "errorInvalidNylasAccount" if nylasAccount is valid but expired', () => {
    useNylasAccountStatus.mockReturnValue({
      data: { status: 'validAccount', num_of_calendars: 1, value: { expired_at: '2024-01-01' } },
      isLoading: false
    });
    useCalendars.mockReturnValue({ data: ['cal1'], isLoading: false });

    const { result } = renderHook(() =>
      useAgendaState({
        isMeetingsLoading: false,
        isMeetingsSuccess: false,
        meetings: [],
        user: mockUser
      })
    );

    expect(result.current).toBe('errorInvalidNylasAccount');
  });

  it('returns "successNoMeetings" if meetings success and no meetings', () => {
    useNylasAccountStatus.mockReturnValue({
      data: { status: 'validAccount', num_of_calendars: 1 },
      isLoading: false
    });
    useCalendars.mockReturnValue({ data: [{ id: 'cal1' }], isLoading: false });

    const { result } = renderHook(() =>
      useAgendaState({
        isMeetingsLoading: false,
        isMeetingsSuccess: true,
        meetings: [],
        user: mockUser
      })
    );

    expect(result.current).toBe('successNoMeetings');
  });

  it('returns "successFewMeetings" if meetings success and less than 4 meetings', () => {
    useNylasAccountStatus.mockReturnValue({
      data: { status: 'validAccount', num_of_calendars: 1 },
      isLoading: false
    });
    useCalendars.mockReturnValue({ data: [{ id: 'cal1' }], isLoading: false });

    const { result } = renderHook(() =>
      useAgendaState({
        isMeetingsLoading: false,
        isMeetingsSuccess: true,
        meetings: [{ id: 1 }, { id: 2 }, { id: 3 }],
        user: mockUser
      })
    );

    expect(result.current).toBe('successFewMeetings');
  });

  it('returns "successManyMeetings" if meetings success and 4+ meetings', () => {
    useNylasAccountStatus.mockReturnValue({
      data: { status: 'validAccount', num_of_calendars: 1 },
      isLoading: false
    });
    useCalendars.mockReturnValue({ data: [{ id: 'cal1' }], isLoading: false });

    const { result } = renderHook(() =>
      useAgendaState({
        isMeetingsLoading: false,
        isMeetingsSuccess: true,
        meetings: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
        user: mockUser
      })
    );

    expect(result.current).toBe('successManyMeetings');
  });
});
