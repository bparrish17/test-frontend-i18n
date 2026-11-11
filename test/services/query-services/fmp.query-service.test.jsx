import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAvailableSymbols, usePeriods, processEarningsCallDates, useRunFmp } from '@services/query-services/fmp.query-service';
import Axios from 'axios';

vi.mock('axios');

describe('FMP Query Service', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('useAvailableSymbols', () => {
    it('fetches available symbols correctly', async () => {
      const mockSymbols = [
        { symbol: 'AAPL', name: 'Apple Inc.' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.' }
      ];

      Axios.mockResolvedValueOnce({ data: mockSymbols });

      const { result } = renderHook(() => useAvailableSymbols(), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockSymbols);
      });

      expect(Axios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/fmp/availableSymbols',
        params: {
          term: ''
        }
      });
    });

    it('handles error when fetching symbols', async () => {
      const error = new Error('Failed to fetch symbols');
      Axios.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useAvailableSymbols(), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('usePeriods', () => {
    const symbol = 'AAPL';
    const mockPeriodsData = [
      { date: '2024-01-15' },
      { date: '2024-04-15' }
    ];

    it('fetches periods data correctly', async () => {
      Axios.mockResolvedValueOnce({ data: mockPeriodsData });

      const { result } = renderHook(() => usePeriods(symbol), { wrapper });

      await waitFor(() => {
        expect(result.current.data).toEqual(mockPeriodsData);
      });

      expect(Axios).toHaveBeenCalledWith({
        method: 'GET',
        url: '/fmp/periods',
        params: { symbol }
      });
    });

    it('handles error when fetching periods', async () => {
      const error = new Error('Failed to fetch periods');
      Axios.mockRejectedValueOnce(error);

      const { result } = renderHook(() => usePeriods(symbol), { wrapper });

      await waitFor(() => {
        expect(result.current.error).toBeTruthy();
      });
    });
  });

  describe('processEarningsCallDates', () => {
    it('processes valid periods data correctly', () => {
      const periodsData = [
        { date: '2024-01-15T00:00:00.000Z' },
        { date: '2024-01-15T00:00:00.000Z' }
      ];

      const result = processEarningsCallDates(periodsData);
      const { lastUpdated, nextCall } = result;

      // Compare dates ignoring timezone
      expect(lastUpdated.toISOString().split('T')[0]).toBe('2024-01-15');
      expect(nextCall.toISOString().split('T')[0]).toBe('2024-04-15');
    });

    it('handles empty periods data', () => {
      const result = processEarningsCallDates([]);
      expect(result).toBeNull();
    });

    it('handles null periods data', () => {
      const result = processEarningsCallDates(null);
      expect(result).toBeNull();
    });

    it('estimates next call date when no future dates available', () => {
      const periodsData = [
        { date: '2024-02-15T00:00:00.000Z' }
      ];

      const result = processEarningsCallDates(periodsData);
      const { lastUpdated, nextCall } = result;

      // Compare dates ignoring timezone
      expect(lastUpdated.toISOString().split('T')[0]).toBe('2024-02-15');
      expect(nextCall.toISOString().split('T')[0]).toBe('2024-05-15');
    });
  });

  describe('useRunFmp', () => {
    it('creates FMP operation correctly', async () => {
      const mockResponse = { success: true };
      Axios.mockResolvedValueOnce({ data: mockResponse });

      const { result } = renderHook(() => useRunFmp(), { wrapper });
      
      const mutate = result.current.mutateAsync;
      expect(mutate).toBeDefined();

      const testBody = { operation: 'test' };
      await mutate(testBody);

      expect(Axios).toHaveBeenCalledWith({
        method: 'POST',
        url: 'fmp',
        data: {
          operation: 'test'
        },
        params: {
          wait: true
        }
      });
    });

    it('handles error in FMP operation', async () => {
      const error = new Error('Operation failed');
      Axios.mockRejectedValueOnce(error);

      const { result } = renderHook(() => useRunFmp(), { wrapper });
      
      try {
        await result.current.mutateAsync({ operation: 'test' });
      } catch (e) {
        expect(e).toBeTruthy();
      }
    });
  });
}); 
