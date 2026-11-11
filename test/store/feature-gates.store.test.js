/**
 * @fileoverview Tests for the Feature Gates Store (`src/store/feature-gates.store.js`).
 * This suite tests the core functionalities of the feature gates store, including:
 * - Fetching feature gates data from the API and handling caching logic.
 * - Clearing the feature gates cache (e.g., on logout).
 * - Checking if specific features are enabled based on global status and user access.
 * - Retrieving a simplified map of all gates for contexts like error reporting.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import axios from 'axios';
import { act } from '@testing-library/react';
import {
  clearFeatureGatesCache,
  initializeFeatureGates,
  isFeatureEnabled,
  useFeatureGatesStore,
  getSimplifiedGatesFromStore
} from '@store/feature-gates.store';

vi.mock('axios', () => ({
  default: {
    create: vi.fn()
  }
}));

vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: vi.fn()
}));

vi.mock('zustand/middleware', () => ({
  persist: (config) => (set, get, api) => {
    const initialState = config(
      (...args) => {
        set(...args);
      },
      get,
      api
    );
    return initialState;
  }
}));

/**
 * Test suite for the main Feature Gates Zustand store.
 */
describe('Feature Gates Store', () => {
  const mockGates = [
    { name: 'feature1', isEnabled: true },
    { name: 'feature2', isEnabled: false }
  ];

  let mockStorage = {};
  let mockAxiosGet;

  /**
   * Sets up mocks and initial store state before each test.
   * Clears all Vitest mocks, resets the feature gates store state,
   * mocks localStorage, Axios, and window.location.
   */
  beforeEach(() => {
    vi.clearAllMocks();

    act(() => {
      useFeatureGatesStore.setState({
        gates: {},
        isInitialized: false,
        isLoading: false,
        error: null,
        lastFetchTime: null
      });
    });

    mockStorage = {};
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn((key) => mockStorage[key] || null),
        setItem: vi.fn((key, value) => {
          mockStorage[key] = value;
        }),
        removeItem: vi.fn((key) => {
          delete mockStorage[key];
        }),
        clear: vi.fn(() => {
          mockStorage = {};
        })
      },
      writable: true
    });

    mockAxiosGet = vi.fn();
    axios.create.mockReturnValue({ get: mockAxiosGet });

    Object.defineProperty(window, 'location', {
      value: { origin: 'http://localhost:3000' },
      writable: true
    });
  });

  /**
   * Clears all mocks after each test to ensure test isolation.
   */
  afterEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Test suite for the `fetchFeatureGates` action and related caching logic.
   */
  describe('fetchFeatureGates', () => {
    it('should fetch gates from API when not in cache', async () => {
      const mockResponse = { data: { data: mockGates } };
      mockAxiosGet.mockResolvedValue(mockResponse);

      await initializeFeatureGates();

      expect(mockAxiosGet).toHaveBeenCalledWith(
        'http://localhost:3000/.netlify/functions/get-feature-gates'
      );

      const state = useFeatureGatesStore.getState();
      expect(state.isInitialized).toBe(true);
      expect(Object.keys(state.gates).length).toBe(2);
    });

    it('should use cached gates when available and not forcing refresh', async () => {
      act(() => {
        useFeatureGatesStore.setState({
          gates: { feature1: { isEnabled: true } },
          isInitialized: true,
          lastFetchTime: Date.now()
        });
      });

      await initializeFeatureGates(false);
      expect(mockAxiosGet).not.toHaveBeenCalled();
    });

    it('should handle API errors gracefully', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAxiosGet.mockRejectedValue(new Error('API Error'));

      await initializeFeatureGates();

      const state = useFeatureGatesStore.getState();
      expect(state.error).toBeTruthy();
      expect(consoleSpy).toHaveBeenCalled();

      consoleSpy.mockRestore();
    });
  });

  /**
   * Test suite for the `clearFeatureGatesCache` action.
   */
  describe('clearFeatureGatesCache', () => {
    it('should clear all state', () => {
      act(() => {
        useFeatureGatesStore.setState({
          gates: { feature1: { isEnabled: true } },
          isInitialized: true,
          lastFetchTime: Date.now()
        });
      });

      clearFeatureGatesCache();

      const state = useFeatureGatesStore.getState();
      expect(state.gates).toEqual({});
      expect(state.isInitialized).toBe(false);
      expect(state.lastFetchTime).toBeNull();
    });
  });

  /**
   * Test suite for the `isFeatureEnabled` selector.
   */
  describe('isFeatureEnabled', () => {
    it('should return false when gate does not exist', () => {
      const result = isFeatureEnabled('nonexistent-gate');
      expect(result).toBe(false);
    });

    it('should return false when gate is disabled', () => {
      act(() => {
        useFeatureGatesStore.setState({
          gates: { testGate: { isEnabled: false, yourAccess: false } }
        });
      });

      const result = isFeatureEnabled('testGate');
      expect(result).toBe(false);
    });

    it('should return false when gate is enabled but user has no access', () => {
      act(() => {
        useFeatureGatesStore.setState({
          gates: { testGate: { isEnabled: true, yourAccess: false } }
        });
      });

      const result = isFeatureEnabled('testGate');
      expect(result).toBe(false);
    });

    it('should return true when gate is enabled and user has access', () => {
      act(() => {
        useFeatureGatesStore.setState({
          gates: { testGate: { isEnabled: true, yourAccess: true } }
        });
      });

      const result = isFeatureEnabled('testGate');
      expect(result).toBe(true);
    });
  });

  /**
   * Test suite for the `getSimplifiedGatesFromStore` selector.
   */
  describe('getSimplifiedGatesFromStore', () => {
    it('should return an empty object if store gates are empty', () => {
      act(() => {
        useFeatureGatesStore.setState({ gates: {} });
      });
      const simplified = getSimplifiedGatesFromStore();
      expect(simplified).toEqual({});
    });

    it('should return an empty object if store gates are null or not an object', () => {
      act(() => {
        useFeatureGatesStore.setState({ gates: null });
      });
      let simplified = getSimplifiedGatesFromStore();
      expect(simplified).toEqual({});

      act(() => {
        useFeatureGatesStore.setState({ gates: 'not_an_object' });
      });
      simplified = getSimplifiedGatesFromStore();
      expect(simplified).toEqual({});
    });

    it('should correctly simplify gate objects from the store', () => {
      const mockFullGates = {
        gateA: { name: 'gateA', isEnabled: true, yourAccess: true, otherData: 'abc' },
        gateB: { name: 'gateB', isEnabled: false, yourAccess: false, moreData: 123 },
        gateC: { name: 'gateC', isEnabled: true, yourAccess: false, evenMore: {} }
      };
      act(() => {
        useFeatureGatesStore.setState({ gates: mockFullGates });
      });

      const simplified = getSimplifiedGatesFromStore();

      expect(simplified).toEqual({
        gateA: { isEnabled: true, yourAccess: true },
        gateB: { isEnabled: false, yourAccess: false },
        gateC: { isEnabled: true, yourAccess: false }
      });
    });

    it('should handle missing isEnabled or yourAccess properties by coercing to false', () => {
      const mockPartialGates = {
        gateD: { name: 'gateD', yourAccess: true },
        gateE: { name: 'gateE', isEnabled: true },
        gateF: { name: 'gateF' }
      };
      act(() => {
        useFeatureGatesStore.setState({ gates: mockPartialGates });
      });

      const simplified = getSimplifiedGatesFromStore();

      expect(simplified).toEqual({
        gateD: { isEnabled: false, yourAccess: true },
        gateE: { isEnabled: true, yourAccess: false },
        gateF: { isEnabled: false, yourAccess: false }
      });
    });

    it('should filter out null or non-object gates during simplification', () => {
      const mockMixedGates = {
        gateG: { name: 'gateG', isEnabled: true, yourAccess: true },
        invalidGate: null,
        anotherValid: { name: 'anotherValid', isEnabled: false, yourAccess: true },
        stringGate: 'iamastring'
      };
      act(() => {
        useFeatureGatesStore.setState({ gates: mockMixedGates });
      });

      const simplified = getSimplifiedGatesFromStore();

      expect(simplified).toEqual({
        gateG: { isEnabled: true, yourAccess: true },
        anotherValid: { isEnabled: false, yourAccess: true }
      });
      expect(simplified).not.toHaveProperty('invalidGate');
      expect(simplified).not.toHaveProperty('stringGate');
    });
  });
});
