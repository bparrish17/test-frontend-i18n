import Axios from 'axios';
import { vi } from 'vitest';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import { useQueryClient, QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { endOfDay, startOfDay } from 'date-fns';

import * as queryService from '@services/query-services/default.query-service.js';
import {
  useMeetingViews,
  useUnshareMeeting,
  getMeetingView,
  useRSVP,
  useUnscheduleBot,
  searchAgendaMeetings
} from '@services/query-services/meetings.query-service.js';

import { useUserStore } from '@store/app.store';
import { useNylasAccountStatus } from '@services/query-services/nylas.query-service';
import { checkForExpectedError, getUserAttendanceStatus } from '@util/helpers';

vi.mock('@store/app.store');
vi.mock('@services/query-services/nylas.query-service');
vi.mock('@util/helpers');

vi.mock('@tanstack/react-query', async () => {
  const original = await vi.importActual('@tanstack/react-query');
  return {
    ...original,
    useQuery: vi.fn()
  };
});

vi.mock('@services/query-services/default.query-service', async (importOriginal) => {
  const originalModule = await importOriginal();

  return {
    useDeleteAttribute: vi.fn().mockReturnValue({
      mutate: vi.fn(),
      isLoading: false,
      isError: false,
      data: null
    }),
    ...originalModule
  };
});

vi.mock('axios'); // Mock Axios

const model = 'meetings';
const queryClient = new QueryClient();

describe('searchAgendaMeetings', () => {
  beforeEach(() => {
    vi.spyOn(queryService, 'search').mockResolvedValue([]);
  });

  it('calls search with correct body', async () => {
    const user = { id: 'user1' };
    const selectedDate = new Date();

    const expectedBody = {
      sort: 'start_at',
      asc: true,
      creator_id: user?.id,
      start_at_from: startOfDay(selectedDate),
      start_at_to: endOfDay(selectedDate),
      not_canceled: true,
      pageSize: 100
    };

    await searchAgendaMeetings(selectedDate, user);

    expect(queryService.search).toHaveBeenCalledWith({ model, body: expectedBody });
  });
});

describe('getMeetingView', () => {
  beforeEach(() => {
    vi.spyOn(queryService, 'getById').mockResolvedValue({ id: '12345' });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getById with the correct model, id, and custom headers', async () => {
    const meetingId = '12345';
    await getMeetingView(meetingId);

    // Ensure getById was called with the correct arguments
    expect(queryService.getById).toHaveBeenCalledWith({
      model,
      id: meetingId,
      headers: { 'X-Fora-Actor': 'manual' }
    });
  });
});

describe('useMeetingViews', () => {
  it('should call useQuery with the correct parameters', async () => {
    // Mocking useQuery to return a dummy result
    useQuery.mockReturnValue({
      data: { views: 123 },
      isLoading: false,
      isError: false
    });

    // mock axios call
    Axios.mockResolvedValue({ views: 123 });

    // Using the hook
    const id = 'meeting123';
    const { result } = renderHook(() => useMeetingViews(id));

    // Assertions
    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['meetings', 'views', { id }],
      queryFn: expect.any(Function)
    });

    // Validate the data returned from the hook
    expect(result.current.data).toEqual({ views: 123 });
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should handle loading state correctly', () => {
    // Mocking useQuery to simulate a loading state
    useQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false
    });

    const id = 'meeting123';
    const { result } = renderHook(() => useMeetingViews(id));

    // Assertions
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isError).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should handle errors correctly', () => {
    // Mocking useQuery to simulate an error state
    useQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      isError: true
    });

    const id = 'meeting123';
    const { result } = renderHook(() => useMeetingViews(id));

    // Assertions
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(true);
    expect(result.current.data).toBeUndefined();
  });
});

describe('useUnshareMeeting', () => {
  // Helper component to use the hook
  const TestComponent = () => {
    const { mutateAsync: mutation } = useUnshareMeeting();
    return <div>{mutation ? 'hook called' : 'hook not called'}</div>;
  };

  it('should return a valid mutation object', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <TestComponent />
      </QueryClientProvider>
    );

    // Check that the hook was called and returned the correct mutation object
    const text = screen.getByText('hook called');
    expect(text).toBeInTheDocument();
  });
});

describe('useRSVP', () => {
  const queryClient = new QueryClient();

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();

    useNylasAccountStatus.mockReturnValue({
      data: 'test@example.com'
    });

    vi.spyOn(queryService, 'setAttribute').mockReturnValue(() => Promise.resolve(true));
    vi.spyOn(queryService, 'getOptimisticUpdateMutateOptions').mockReturnValue({
      onMutate: vi.fn(),
      onError: vi.fn(),
      onSettled: vi.fn()
    });

    checkForExpectedError.mockReturnValue(false);
    getUserAttendanceStatus.mockReturnValue('yes');
  });

  describe('FORA user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({
        email: 'test@example.com',
        isGuest: false
      });
    });

    it('calls mutationFn and onSuccess correctly', async () => {
      const { result } = renderHook(() => useRSVP(), { wrapper });

      await result.current.mutateAsync({ id: '123', status: 'yes' });

      await waitFor(() => {
        expect(queryService.setAttribute).toHaveBeenCalledWith(
          expect.objectContaining({
            model,
            method: 'POST',
            attribute: 'rsvp'
          })
        );
      });
    });

    it('handles expected errors gracefully', async () => {
      vi.spyOn(queryService, 'setAttribute').mockReturnValue(() =>
        Promise.reject(new Error('provider returned error'))
      );
      checkForExpectedError.mockReturnValue(true);

      const { result } = renderHook(() => useRSVP(), { wrapper });

      await expect(result.current.mutateAsync({ id: '123', status: 'maybe' })).resolves.toBe(true);
    });

    it('throws for unexpected errors', async () => {
      const error = new Error('unexpected');
      vi.spyOn(queryService, 'setAttribute').mockReturnValue(() => Promise.reject(error));
      checkForExpectedError.mockReturnValue(false);

      const { result } = renderHook(() => useRSVP(), { wrapper });

      await expect(result.current.mutateAsync({ id: '123', status: 'no' })).rejects.toThrow(
        'unexpected'
      );
    });
  });

  describe('guest user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({
        email: 'test@example.com',
        isGuest: true
      });
    });

    it('disables useNylasAccountStatus', async () => {
      renderHook(() => useRSVP(), { wrapper });
      await waitFor(() => {
        expect(useNylasAccountStatus).toHaveBeenCalledWith({
          enabled: false,
          select: expect.any(Function)
        });
      });
    });
  });
});

describe('useUnscheduleBot', () => {
  it('should call useDeleteAttribute with correct parameters', () => {
    const mockMutation = { mutate: vi.fn() };
    const mockDeleteAttributeFunction = vi.fn().mockReturnValue(mockMutation);
    vi.spyOn(queryService, 'useDeleteAttribute').mockReturnValue(mockDeleteAttributeFunction);

    const { result } = renderHook(() => useUnscheduleBot());

    expect(queryService.useDeleteAttribute).toHaveBeenCalledWith({
      model,
      attribute: 'schedule',
      queryParameters: { keep: true }
    });
    expect(result.current).toEqual(mockMutation);
  });

  it('should accept custom query parameters', () => {
    const customParams = { keep: false };
    const mockMutation = { mutate: vi.fn() };
    const mockDeleteAttributeFunction = vi.fn().mockReturnValue(mockMutation);
    vi.spyOn(queryService, 'useDeleteAttribute').mockReturnValue(mockDeleteAttributeFunction);

    renderHook(() => useUnscheduleBot(customParams));

    expect(queryService.useDeleteAttribute).toHaveBeenCalledWith({
      model,
      attribute: 'schedule',
      queryParameters: customParams
    });
  });
});
