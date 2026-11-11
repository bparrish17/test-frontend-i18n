import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

import { useDocumentUploads, useMeetingUploads } from '@util/hooks/upload.hooks';

import { useChannels } from '@services/query-services/channels.query-service';
import { useBatches } from '@services/query-services/batches.query-service';
import { useMeetings } from '@services/query-services/meetings.query-service';
import { useCards } from '@services/query-services/cards.query-service.js';

vi.mock('@services/query-services/channels.query-service');
vi.mock('@services/query-services/batches.query-service');
vi.mock('@services/query-services/meetings.query-service');
vi.mock('@services/query-services/cards.query-service.js');

export function renderHookWithQueryClient(hook) {
  const queryClient = new QueryClient();
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  });
}

describe('useDocumentUploads', () => {
  const mockUser = { id: 'user-1' };
  const mockChannels = [{ id: 'c1' }];
  const mockBatches = [{ id: 'b1' }];
  const mockCards = [{ id: 'card1' }];

  beforeEach(() => {
    useBatches.mockImplementation((params, options) => {
      if (options?.enabled === false) {
        return { data: null, isLoading: false };
      }
      return { data: mockBatches, isLoading: false };
    });

    useCards.mockImplementation((params, options) => {
      if (options?.enabled === false) {
        return { data: null, isLoading: false };
      }
      return { data: mockCards, isLoading: false };
    });
  });

  it('returns null when no data is loaded', () => {
    useChannels.mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHookWithQueryClient(() => useDocumentUploads({ user: mockUser }));

    expect(useChannels).toHaveBeenCalledWith({
      pageSize: 100,
      creator_id: 'user-1',
      sources: ['Email', 'Document']
    });

    expect(useBatches).toHaveBeenCalledWith(
      {
        pageSize: 100,
        channel_ids: []
      },
      { enabled: false }
    );

    expect(useCards).toHaveBeenCalledWith(
      {
        batch_ids: undefined,
        pageSize: undefined
      },
      { enabled: false }
    );

    expect(result.current.batches).toEqual(null);
    expect(result.current.cards).toEqual(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns data when channels, batches, and cards are available', () => {
    useChannels.mockReturnValue({ data: mockChannels, isLoading: false });

    const { result } = renderHookWithQueryClient(() => useDocumentUploads({ user: mockUser }));

    expect(useChannels).toHaveBeenCalledWith({
      pageSize: 100,
      creator_id: 'user-1',
      sources: ['Email', 'Document']
    });

    expect(useBatches).toHaveBeenCalledWith(
      {
        pageSize: 100,
        channel_ids: mockChannels.map((c) => c?.id)
      },
      { enabled: true }
    );

    expect(useCards).toHaveBeenCalledWith(
      {
        batch_ids: mockBatches.map((b) => b?.id),
        pageSize: mockBatches.length
      },
      { enabled: true }
    );

    expect(result.current.batches).toEqual(mockBatches);
    expect(result.current.cards).toEqual(mockCards);
    expect(result.current.isLoading).toBe(false);
  });

  it('combines isLoading states', () => {
    useChannels.mockReturnValue({ data: [], isLoading: true });

    const { result } = renderHookWithQueryClient(() => useDocumentUploads({ user: mockUser }));
    expect(result.current.isLoading).toBe(true);
  });
});

describe('useMeetingUploads', () => {
  const mockCards = [{ id: 'card1' }];

  beforeEach(() => {
    useCards.mockImplementation((params, options) => {
      if (options?.enabled === false) {
        return { data: null, isLoading: false };
      }
      return { data: mockCards, isLoading: false };
    });
  });

  it('returns null when no data is loaded', () => {
    useMeetings.mockReturnValue({ data: [], isLoading: false });

    const { result } = renderHookWithQueryClient(() => useMeetingUploads());

    expect(useMeetings).toHaveBeenCalledWith({
      pageSize: 100,
      tags: ['meeting_upload']
    });

    expect(useCards).toHaveBeenCalledWith(
      {
        source_data_ids: undefined,
        pageSize: undefined
      },
      { enabled: false }
    );

    expect(result.current.meetings).toEqual([]);
    expect(result.current.cards).toEqual(null);
    expect(result.current.isLoading).toBe(false);
  });

  it('returns data when meetings and cards are available', () => {
    const mockMeetings = [{ id: 'm1' }];

    useMeetings.mockReturnValue({ data: mockMeetings, isLoading: false });

    const { result } = renderHookWithQueryClient(() => useMeetingUploads());

    expect(useMeetings).toHaveBeenCalledWith({
      pageSize: 100,
      tags: ['meeting_upload']
    });

    expect(useCards).toHaveBeenCalledWith(
      {
        source_data_ids: mockMeetings.map((m) => m?.id),
        pageSize: mockMeetings.length
      },
      { enabled: true }
    );

    expect(result.current.meetings).toEqual(mockMeetings);
    expect(result.current.cards).toEqual(mockCards);
    expect(result.current.isLoading).toBe(false);
  });

  it('combines isLoading states', () => {
    useMeetings.mockReturnValue({ data: [], isLoading: true });

    const { result } = renderHookWithQueryClient(() => useMeetingUploads());
    expect(result.current.isLoading).toBe(true);
  });
});
