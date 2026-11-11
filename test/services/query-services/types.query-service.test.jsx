import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useTimeZones } from '@services/query-services/types.query-service';
import Axios from 'axios';

vi.mock('axios');

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false }
    }
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useTimeZones', () => {
  const mockTimeZones = [
    { id: 'tz1', name: 'Time Zone 1' },
    { id: 'tz2', name: 'Time Zone 2' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    Axios.mockResolvedValue({ data: mockTimeZones });
  });

  it('should return time zones data when called', async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useTimeZones(), { wrapper });

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.data).toEqual(mockTimeZones);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isError).toBe(false);
  });
});
