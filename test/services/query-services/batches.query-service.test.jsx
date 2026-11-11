import { vi, describe, it, expect } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';

import { useBatches } from '@services/query-services/batches.query-service';

vi.mock('axios');

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

describe('useBatches', () => {
  it('should call search with correct arguments and render fetched data', async () => {
    axios.mockResolvedValueOnce({
      total: 1,
      data: {
        data: [
          {
            id: '12345'
          }
        ]
      }
    });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const TestComponent = () => {
      const { data, isLoading } = useBatches(123);
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
        url: '/batches/search',
        data: { sort: 'created_at', asc: false, pageSize: 50 }
      });
    });
  });
});
