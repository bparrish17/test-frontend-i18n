/**
 * @fileoverview Feature Gates Store
 *
 * This file implements a Zustand store for managing feature gates in the application.
 * It replaces the previous implementation which mixed React Query with manual localStorage
 * management. This approach provides a more consistent state management pattern by using
 * Zustand throughout the application.
 *
 * Features:
 * - Persistent storage with localStorage via Zustand's persist middleware
 * - Automatic API fetching with caching
 * - User-specific access evaluation with Statsig integration
 * - Backward compatible API with the previous implementation
 *
 * Usage:
 * - Direct store access: useFeatureGatesStore()
 * - Hooks for components: useFeatureGatesWithAccess(), useFeatureGate(gateName)
 * - Initialization: initializeFeatureGates()
 * - Cache clearing: clearFeatureGatesCache()
 *
 * See documentation/feature-gates.md for more details.
 */

import { useEffect } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from 'axios';
import { useStatsigClient } from '@statsig/react-bindings';
import { isEmpty, isObject, mapValues, pickBy } from 'lodash';
import { rollbar } from '@util/helpers';

const CACHE_TIME = 10 * 60 * 1000;

/**
 * Feature gates store with persistent localStorage cache
 */
export const useFeatureGatesStore = create(
  persist(
    (set, get) => ({
      gates: {},
      isInitialized: false,
      isLoading: false,
      error: null,
      lastFetchTime: null,

      /**
       * Fetches feature gates from the API or returns cached data if available
       * @param {boolean} forceRefresh - Whether to force a refresh from the API
       * @returns {Promise<Object>} The feature gates data
       */
      fetchFeatureGates: async (forceRefresh = false) => {
        const state = get();
        const now = new Date().getTime();

        const isCacheValid =
          !forceRefresh &&
          state.isInitialized &&
          state.lastFetchTime?.valueOf() &&
          now - state.lastFetchTime < CACHE_TIME &&
          !isEmpty(state.gates);

        if (isCacheValid) {
          return state.gates;
        }

        try {
          set({ isLoading: true, error: null });

          const url = `${window.location.origin}/.netlify/functions/get-feature-gates`;
          const axiosInstance = axios.create({ baseURL: '' });
          const response = await axiosInstance.get(url);
          const gates = response.data?.data || [];

          if (gates.length > 0) {
            const processedGates = Object.fromEntries(
              gates
                .filter((gate) => gate.name)
                .map((gate) => {
                  return [
                    gate.name,
                    {
                      isEnabled: !!gate.isEnabled,
                      yourAccess: !!gate.isEnabled,
                      ...gate
                    }
                  ];
                })
            );

            set({
              gates: processedGates,
              isInitialized: true,
              isLoading: false,
              lastFetchTime: now
            });

            return processedGates;
          }

          set({
            isInitialized: true,
            isLoading: false,
            lastFetchTime: now
          });

          return state.gates;
        } catch (error) {
          const errorMessage = error.message || 'Failed to fetch feature gates';
          console.error('[FeatureGates] Fetch error:', error);
          rollbar.error('[FeatureGates] Fetch error:', error);

          set({
            error: errorMessage,
            isLoading: false
          });

          return state.gates;
        }
      },

      /**
       * Update user-specific access with Statsig client
       * @param {Object} statsigClient - The Statsig client instance
       * @returns {Object} The updated feature gates
       */
      updateUserAccess: (statsigClient) => {
        const state = get();

        if (!statsigClient?.checkGate) {
          console.warn('[FeatureGates] No valid Statsig client provided for access check');
          return state.gates;
        }

        try {
          const { checkGate } = statsigClient;
          const updatedGates = Object.fromEntries(
            Object.entries(state.gates).map(([gateName, gate]) => {
              try {
                const yourAccess = checkGate(gateName);
                return [
                  gateName,
                  {
                    ...gate,
                    yourAccess: gate.isEnabled ? yourAccess : false
                  }
                ];
              } catch (error) {
                console.error(`[FeatureGates] Error evaluating gate ${gateName}:`, error);
                return [gateName, gate];
              }
            })
          );

          set({ gates: updatedGates });
          return updatedGates;
        } catch (error) {
          console.error('[FeatureGates] User access update error:', error);
          rollbar.error('[FeatureGates] User access update error:', error);
          return state.gates;
        }
      },

      /**
       * Clear all gates data - used during logout
       */
      clearFeatureGates: () => {
        set({
          gates: {},
          isInitialized: false,
          isLoading: false,
          error: null,
          lastFetchTime: null
        });
      },

      /**
       * Check if a specific gate is enabled and user has access
       * @param {string} gateName - The name of the gate to check
       * @returns {Object} Gate access information with { isEnabled, yourAccess } properties
       */
      checkGate: (gateName) => {
        const state = get();
        const gate = state.gates[gateName];

        if (!gate) {
          return { isEnabled: false, yourAccess: false };
        }

        return {
          isEnabled: !!gate.isEnabled,
          yourAccess: !!gate.yourAccess
        };
      }
    }),
    {
      name: 'feature-gates-store',
      partialize: (state) => ({
        gates: state.gates,
        isInitialized: state.isInitialized,
        lastFetchTime: state.lastFetchTime
      })
    }
  )
);

/**
 * Hook for accessing feature gates with user-specific access information
 * @param {Object} options - React Query compatible options
 * @returns {Object} Feature gates data with loading/error states
 */
export function useFeatureGatesWithAccess() {
  const statsigClient = useStatsigClient();
  const { gates, isLoading, error, isInitialized, fetchFeatureGates, updateUserAccess } =
    useFeatureGatesStore();

  useEffect(() => {
    if (!isInitialized) {
      fetchFeatureGates();
    } else if (statsigClient && statsigClient.checkGate) {
      updateUserAccess(statsigClient);
    }
  }, [isInitialized, statsigClient, fetchFeatureGates, updateUserAccess]);

  useEffect(() => {
    if (statsigClient && statsigClient.checkGate) {
      updateUserAccess(statsigClient);
    }
  }, [statsigClient, updateUserAccess]);

  return {
    data: gates,
    isLoading,
    error,
    refetch: (forceRefresh = false) => fetchFeatureGates(forceRefresh)
  };
}

/**
 * Hook for accessing a specific feature gate
 * @param {string} gateName - Name of the gate to check
 * @returns {Object} Gate information with enabled status
 */
export function useFeatureGate(gateName) {
  const { data: gates, isLoading, error, refetch } = useFeatureGatesWithAccess();

  return {
    gate: gates?.[gateName],
    isEnabled: gates?.[gateName]?.isEnabled || false,
    yourAccess: gates?.[gateName]?.yourAccess || false,
    isLoading,
    error,
    refetch
  };
}

/**
 * Initialize feature gates on app startup - can be called during app initialization
 * @param {boolean} forceRefresh - Whether to force a refresh from the API
 * @returns {Promise<Object>} The feature gates data
 */
export async function initializeFeatureGates(forceRefresh = false) {
  return useFeatureGatesStore.getState().fetchFeatureGates(forceRefresh);
}

/**
 * Clear feature gates cache - for use during logout
 */
export function clearFeatureGatesCache() {
  useFeatureGatesStore.getState().clearFeatureGates();
}

/**
 * Non-hook function to check if a gate is enabled (for use outside React components)
 * @param {string} gateName - The name of the gate to check
 * @returns {boolean} Whether the gate is enabled and the user has access
 */
export function isFeatureEnabled(gateName) {
  const { isEnabled, yourAccess } = useFeatureGatesStore.getState().checkGate(gateName);
  return isEnabled && yourAccess;
}

/**
 * Synchronously retrieves a simplified map of all feature gates from the store.
 * Each gate will have an isEnabled and yourAccess property.
 * @returns {Object<string, {isEnabled: boolean, yourAccess: boolean}>} A map of simplified gate statuses.
 */
export function getSimplifiedGatesFromStore() {
  const { gates } = useFeatureGatesStore.getState();

  if (!isObject(gates)) {
    return {};
  }

  const validGates = pickBy(gates, (gate) => gate && isObject(gate));

  return mapValues(validGates, (gate) => ({
    isEnabled: !!gate.isEnabled,
    yourAccess: !!gate.yourAccess
  }));
}
