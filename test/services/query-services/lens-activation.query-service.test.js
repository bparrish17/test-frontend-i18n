import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import { useDisclosure } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { useStyledToast } from '@util/hooks';
import { useArchiveInitiative } from '@services/query-services/initiatives.query-service';

import { useLensActivation } from '@services/query-services/lens-activation.query-service';

// Mock dependencies
vi.mock('@chakra-ui/react', () => ({
  useDisclosure: vi.fn()
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn()
}));

vi.mock('@services/query-services/initiatives.query-service', () => ({
  useArchiveInitiative: vi.fn()
}));

describe('useLensActivation', () => {
  const mockDisclosure = {
    isOpen: false,
    onOpen: vi.fn(),
    onClose: vi.fn()
  };

  const mockNavigate = vi.fn();
  const mockToast = vi.fn();
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDisclosure.mockReturnValue(mockDisclosure);
    useNavigate.mockReturnValue(mockNavigate);
    useStyledToast.mockReturnValue(mockToast);
  });

  test('returns disclosure object', () => {
    useArchiveInitiative.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: false
    });
    const { result } = renderHook(() => useLensActivation());
    expect(result.current.disclosure).toBe(mockDisclosure);
  });

  test('deactivateLens calls archiveLens with correct parameters', async () => {
    useArchiveInitiative.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: false
    });
    const { result } = renderHook(() => useLensActivation());

    await act(async () => {
      await result.current.deactivateLens('test-id');
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(
      { id: 'test-id', value: true },
      expect.any(Object)
    );
    expect(mockDisclosure.onClose).toHaveBeenCalled();
  });

  test('reactivateLens calls unarchiveLens with correct parameters', async () => {
    useArchiveInitiative.mockReturnValue({
      mutateAsync: mockMutateAsync,
      isLoading: false
    });
    const { result } = renderHook(() => useLensActivation());

    await act(async () => {
      await result.current.reactivateLens('test-id');
    });

    expect(mockMutateAsync).toHaveBeenCalledWith(
      { id: 'test-id', value: false },
      expect.any(Object)
    );
    expect(mockDisclosure.onClose).toHaveBeenCalled();
  });
});
