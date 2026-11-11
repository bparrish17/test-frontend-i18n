import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Axios from 'axios';
import { useSlackChannels } from '@services/query-services/slack.query-service';
import { vi } from 'vitest';
import { useUserStore } from '@store/app.store';

vi.mock('axios');
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

describe('Slack Query Service', () => {
  const wrapper = ({ children }) => (
    <QueryClientProvider client={new QueryClient()}>{children}</QueryClientProvider>
  );

  describe('useSlackChannels', () => {
    const mockChannels = [
      {
        id: 'C04C6LCUADB',
        name: 'random'
      },
      {
        id: 'C04C9JT3WTC',
        name: 'general'
      },
      {
        id: 'C04CL80FBCJ',
        name: 'eng'
      },
      {
        id: 'C04CZA4069W',
        name: 'prototype'
      }
    ];

    it('fetches slack channels correctly', async () => {
      useUserStore.mockReturnValueOnce('tokn-12345');
      Axios.mockResolvedValueOnce({ data: { channels: mockChannels } });

      const { result } = renderHook(() => useSlackChannels(), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockChannels);
      });

      expect(Axios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/slack/channels',
        headers: { 'X-Fora-Tenant': 'tokn-12345' }
      });
    });
  });
});
