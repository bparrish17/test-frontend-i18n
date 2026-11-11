import { vi, describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

import { useUserStore } from '@store/app.store';
import { usePeople } from '@services/query-services/people.query-service';

vi.mock('axios');
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

// Create a reusable QueryClient for testing
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for easier testing
        staleTime: 0
      }
    }
  });

describe('usePeople', () => {
  it('should call search with correct arguments and render fetched data', async () => {
    axios.mockResolvedValueOnce({
      total: 1,
      data: {
        data: [
          {
            id: '12345',
            email: 'jeff@lebowski.com'
          }
        ]
      }
    });
    useUserStore.mockReturnValue('tenant-1');
    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );
    const TestComponent = () => {
      const { data, isLoading } = usePeople(123);
      if (isLoading) return <p>Loading...</p>;
      if (data) return <div>Data: {JSON.stringify(data)}</div>;
      return null;
    };
    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );
    // Wait for the query to complete and assert Axios was called with the correct arguments
    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: '/people/search',
        data: { tenant_ids: ['tenant-1'], pageSize: 1000 }
      });
    });
  });
});
