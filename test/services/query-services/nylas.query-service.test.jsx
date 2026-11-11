import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSyncNylasAccount } from '@services/query-services/nylas.query-service';
import Axios from 'axios';

vi.mock('axios');

describe('useSyncNylasAccount', () => {
  let queryClient;

  const renderHookWithProvider = (hook, options = {}) => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    });
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    return renderHook(hook, { wrapper, ...options });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient?.clear();
  });

  it('should make POST request to sync endpoint', async () => {
    const mockResponse = { data: { id: 'account-123', status: 'synced' } };
    Axios.mockResolvedValue(mockResponse);

    const { result } = renderHookWithProvider(() => useSyncNylasAccount());
    await result.current.mutateAsync();
    expect(Axios).toHaveBeenCalledWith({
      method: 'POST',
      url: '/nylas/accounts/sync'
    });
  });

  it('should return data from successful response', async () => {
    const mockData = { id: 'account-123', status: 'synced' };
    const mockResponse = { data: mockData };
    Axios.mockResolvedValue(mockResponse);

    const { result } = renderHookWithProvider(() => useSyncNylasAccount());
    const response = await result.current.mutateAsync();
    expect(response).toEqual(mockData);
  });
});
