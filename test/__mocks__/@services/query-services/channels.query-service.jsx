import { vi } from 'vitest';

export const useChannels = vi.fn(() => ({
  data: [],
  isLoading: false,
  error: null
}));

export const useDeleteChannel = vi.fn(() => ({
  mutateAsync: vi.fn(),
  isLoading: false,
  error: null
}));
