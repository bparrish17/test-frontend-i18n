# Feature Gates System

**Last updated:** [Current Date]

## Overview

The feature gates system allows for feature flagging throughout the application. It provides a way to enable or disable features for specific users or environments without deploying new code.

The implementation uses Zustand with persist middleware to manage feature gate state and persist it to localStorage, replacing the previous React Query implementation.

## Architecture

The feature gates system has been refactored to use Zustand for state management instead of the previous implementation which mixed React Query with manual localStorage handling.

### Key Components

1. **Zustand Store (`src/store/feature-gates.store.js`):**
   - Manages all feature gate state
   - Handles fetching gates from the API
   - Persists data to localStorage
   - Provides access to feature gate status
   - Uses Statsig client for user-specific access checks

> **Important**: The previous compatibility layer (`src/services/query-services/feature-gates.query-service.js`) has been removed. All imports should now use the Zustand store directly.

## Benefits of the New Implementation

The new Zustand-based implementation offers several advantages over the previous approach:

1. **Single Source of Truth:** All feature gate data is managed in one place, eliminating potential inconsistencies between React Query cache and localStorage.

2. **Automatic Persistence:** Zustand's persist middleware handles localStorage synchronization transparently.

3. **Simplified Mental Model:** No need to coordinate between multiple caching systems.

4. **Better Performance:** Reduces unnecessary API calls and renders by efficiently checking local storage first.

5. **Improved Error Handling:** Consistent error handling and reporting via Rollbar.

## Usage

### Checking a Feature Gate

To check whether a specific feature gate is enabled for the current user:

```jsx
import { useFeatureGate } from '@store/feature-gates.store';

function MyComponent() {
  const { isEnabled, yourAccess } = useFeatureGate('my-feature-gate');

  if (!isEnabled) {
    return <p>This feature is not enabled</p>;
  }

  if (!yourAccess) {
    return <p>You don't have access to this feature</p>;
  }

  return <p>Feature is enabled and you have access!</p>;
}
```

### Accessing All Feature Gates

To access all feature gates:

```jsx
import { useFeatureGatesWithAccess } from '@store/feature-gates.store';

function FeatureGatesList() {
  const { data: gates, isLoading, error, refetch } = useFeatureGatesWithAccess();

  if (isLoading) {
    return <p>Loading feature gates...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <button onClick={refetch}>Refresh gates</button>
      <ul>
        {Object.entries(gates).map(([gateName, gate]) => (
          <li key={gateName}>
            {gateName}: {gate.isEnabled ? 'Enabled' : 'Disabled'} 
            (Your access: {gate.yourAccess ? 'Yes' : 'No'})
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Checking a Gate Outside React Components

For non-component code that needs to check if a feature is enabled:

```js
import { isFeatureEnabled } from '@store/feature-gates.store';

function someFunction() {
  if (isFeatureEnabled('my-feature-gate')) {
    // Do something when feature is enabled
  } else {
    // Do alternative implementation
  }
}
```

### Initializing Feature Gates

Feature gates are automatically initialized in the `App.jsx` component. For non-authenticated users, they are initialized during app startup. For authenticated users, they are initialized during the login flow.

If you need to manually initialize or refresh the feature gates:

```jsx
import { initializeFeatureGates } from '@store/feature-gates.store';

// To initialize with cached values first
await initializeFeatureGates();

// To force refresh from API
await initializeFeatureGates(true);
```

### Clearing Feature Gates Cache

Feature gates are automatically cleared during logout. If you need to manually clear the cache:

```jsx
import { clearFeatureGatesCache } from '@store/feature-gates.store';

clearFeatureGatesCache();
```

## Implementation Details

### Zustand Store

The Zustand store provides:

1. **State:**
   - `gates`: Object containing all feature gates
   - `isInitialized`: Boolean indicating if the feature gates have been initialized
   - `isLoading`: Boolean indicating if the feature gates are being fetched
   - `error`: Error object if there was an error fetching feature gates
   - `lastFetchTime`: Timestamp of the last successful fetch

2. **Actions:**
   - `fetchFeatureGates`: Fetches feature gates from the API
   - `updateUserAccess`: Updates user-specific access for all gates
   - `clearFeatureGates`: Clears all feature gate data
   - `checkGate`: Checks if a specific gate is enabled and accessible

3. **Persistence:**
   - Uses Zustand's persist middleware to store feature gates in localStorage
   - Only persists the necessary parts of the state to minimize storage usage

### API Integration

Feature gates are fetched from the API using:

```
GET /.netlify/functions/get-feature-gates
```

The response format is an array of feature gate objects, which are transformed into a map of gate name to gate data.

### User-Specific Access

Feature gates have two levels of access:

1. **isEnabled**: Whether the feature is enabled globally
2. **yourAccess**: Whether the current user has access to the feature

The `yourAccess` property is determined by the Statsig client using the `checkGate` function.

## Direct Zustand Store Access

For advanced use cases, you can access the Zustand store directly:

```jsx
import { useFeatureGatesStore } from '@store/feature-gates.store';

// In a component
function AdvancedComponent() {
  // Subscribe to store changes
  const gates = useFeatureGatesStore(state => state.gates);
  const isLoading = useFeatureGatesStore(state => state.isLoading);
  
  // ...
}

// Outside a component (non-reactive)
function someUtilityFunction() {
  const gates = useFeatureGatesStore.getState().gates;
  // ...
}
```

### Getting All Simplified Gates Synchronously (for specific integrations)

In rare cases, like providing context to an error reporting service, you might need a synchronous snapshot of all gates in a simplified format (`{ isEnabled: boolean, yourAccess: boolean }`). For this, you can use:

```js
import { getSimplifiedGatesFromStore } from '@store/feature-gates.store';

function getErrorContext() {
  const simplifiedGates = getSimplifiedGatesFromStore();
  // Use simplifiedGates for context
  return { featureFlags: simplifiedGates };
}
``` 