import { addSeconds, isAfter } from 'date-fns';
import { lazy } from 'react';

const key = 'lazy-error-force-refresh';
const storedValue = (refreshed) => JSON.stringify({ refreshed, updatedAt: Date.now() });

export const lazyWithRetry = (componentImport) =>
  lazy(async () => {
    const { refreshed, updatedAt } = JSON.parse(
      window.localStorage.getItem(key) || storedValue(false)
    );

    const canRefresh = isAfter(Date.now(), addSeconds(updatedAt, 5));
    const pageHasAlreadyBeenForceRefreshed = refreshed && !canRefresh;

    try {
      const component = await componentImport();

      window.localStorage.setItem(key, storedValue(false));

      return component;
    } catch (error) {
      if (!pageHasAlreadyBeenForceRefreshed) {
        window.localStorage.setItem(key, storedValue(true));
        return window.location.reload();
      }

      throw error;
    }
  });
