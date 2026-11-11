import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { vi } from 'vitest';
import axios from 'axios';
import { useInsights, useLatestInsight } from '@services/query-services/insights.query-service';
import { useUserStore } from '@store/app.store';
import { init } from 'rollbar';

// Mock dependencies
vi.mock('axios');
vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQuery: vi.fn()
  };
});

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

describe('Insights Query Service', () => {
  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          staleTime: 0
        }
      }
    });
    return ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  const mockUser = {
    id: 'user123',
    email: 'user@example.com',
    name: 'John Doe'
  };

  beforeEach(() => {
    vi.clearAllMocks();

    useUserStore.mockImplementation((selector) => selector({ user: mockUser }));
  });

  describe('useInsights', () => {
    it('calls search with the correct parameters', async () => {
      axios.mockResolvedValueOnce({
        total: 1,
        data: {
          data: {
            id: '12345',
            type: 'Lens',
            headline: 'FORA Enhances Executive Support'
          }
        }
      });

      renderHook(() => useInsights({ initiative_type: 'Lens' }), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(useQuery).toHaveBeenCalled();
      });

      const queryFn = useQuery.mock.calls[0][0].queryFn;
      const result = await queryFn();

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: '/insights/search',
        data: { initiative_type: 'Lens', sort: 'updated_at', asc: false }
      });

      expect(result).toEqual({
        id: '12345',
        type: 'Lens',
        headline: 'FORA Enhances Executive Support'
      });

      const queryKey = useQuery.mock.calls[0][0].queryKey;
      expect(queryKey).toEqual(['insights', { initiative_type: 'Lens' }]);
    });

    it('handles includeTotal', async () => {
      axios.mockResolvedValueOnce({
        total: 1,
        data: {
          id: '12345',
          type: 'Lens',
          headline: 'FORA Enhances Executive Support'
        }
      });

      renderHook(() => useInsights({ initiative_type: 'Lens' }, { includeTotal: true }), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(useQuery).toHaveBeenCalled();
      });

      const queryFn = useQuery.mock.calls[0][0].queryFn;
      const result = await queryFn();

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: '/insights/search',
        data: { initiative_type: 'Lens', sort: 'updated_at', asc: false }
      });

      const queryKey = useQuery.mock.calls[0][0].queryKey;
      expect(queryKey).toEqual(['insights', { initiative_type: 'Lens' }, true]);
    });
  });

  describe('useLatestInsight', () => {
    it('calls useInsights with correct parameters for default initiativeType', async () => {
      const mockLensId = '67890';
      axios.mockResolvedValueOnce({
        data: {
          id: mockLensId,
          type: 'Lens',
          headline: 'FORA Enhances Executive Support'
        }
      });

      renderHook(() => useLatestInsight(mockLensId, 'Lens'), {
        wrapper: createWrapper()
      });

      await waitFor(() => {
        expect(useQuery).toHaveBeenCalled();
      });

      const queryFn = useQuery.mock.calls[0][0].queryFn;
      const result = await queryFn();

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: '/insights/search',
        data: {
          initiative_type: 'Lens',
          initiative_id: mockLensId,
          sort: 'updated_at',
          asc: false,
          person_id: mockUser.id,
          pageSize: 1
        }
      });
    });
  });
});
