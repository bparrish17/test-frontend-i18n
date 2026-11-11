import React from 'react';
import { lazyWithRetry } from './lazy.helpers';

/**
 * Determines if a component should be wrapped with an error boundary.
 * The Vite plugin uses this function to wrap components for error isolation.
 *
 * @param {string} componentName - Name of the component to wrap
 * @param {React.ComponentType} WrappedComponent - The wrapped component
 * @returns {React.ComponentType} The wrapped component
 */
export function shouldWrapWithErrorBoundary(componentName, WrappedComponent) {
  if (process.env.NODE_ENV === 'test') {
    return WrappedComponent;
  }

  return WrappedComponent;
}

/**
 * Manual implementation of withErrorBoundary that can be used for components
 * that need to be explicitly wrapped with an error boundary.
 *
 * @param {React.ComponentType} Component - Component to wrap
 * @param {string|Object} options - Component name or configuration options
 * @returns {React.FC} Wrapped component
 */
export function withErrorBoundary(Component, options = {}) {
  if (process.env.NODE_ENV === 'test') {
    return Component;
  }

  if (typeof options === 'string') {
    options = { componentName: options };
  }

  const ErrorBoundary = lazyWithRetry(() =>
    import('@components/general/error-boundary/error-boundary.component')
  );

  const WrappedComponent = (props) => {
    return (
      <React.Suspense fallback={null}>
        <ErrorBoundary {...options}>
          <Component {...props} />
        </ErrorBoundary>
      </React.Suspense>
    );
  };

  WrappedComponent.displayName = `WithErrorBoundary(${
    Component.displayName || Component.name || 'Component'
  })`;
  return WrappedComponent;
}

/**
 * Sanitizes props to remove potential PII or sensitive data for error reporting
 *
 * @param {Object} props - Component props to sanitize
 * @returns {Object} Sanitized props object
 */
export const sanitizeProps = (props) => {
  if (!props) return {};

  const sanitized = { ...props };

  delete sanitized.children;
  delete sanitized.rollbar;
  delete sanitized.password;
  delete sanitized.token;
  delete sanitized.apiKey;
  delete sanitized.statsigClient;

  return sanitized;
};

/**
 * Extracts component tree from React error info for better error context
 *
 * @param {string} componentStack - Component stack trace from error boundary
 * @param {number} limit - Maximum number of components to include
 * @returns {string[]} Array of component names in the stack
 */
export const extractComponentTree = (componentStack, limit = 10) => {
  if (!componentStack) return [];

  return componentStack
    .split('\n')
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const regex = /at\s([A-Za-z0-9$_]+)/;
      const match = regex.exec(line);
      return match ? match[1] : line.trim();
    })
    .filter(Boolean)
    .slice(0, limit);
};

/**
 * Classifies error by type and content for better error categorization
 *
 * @param {Error} error - The error to classify
 * @returns {string[]} Array of classification tags for the error
 */
export const classifyError = (error) => {
  if (!error) return ['Unknown', 'ErrorBoundary'];

  const errorType = error.constructor.name || 'Error';
  const classifications = [errorType, 'ErrorBoundary'];
  const errorMessage = error.message || '';

  if (errorMessage.includes('Cannot read properties of')) {
    classifications.push('NullOrUndefinedAccess');
  }
  if (errorMessage.includes('is not a function')) {
    classifications.push('NotAFunction');
  }
  if (errorMessage.includes('is not defined')) {
    classifications.push('UndefinedVariable');
  }
  if (errorMessage.includes('Maximum update depth exceeded')) {
    classifications.push('InfiniteLoop');
  }
  if (errorMessage.includes('memory leak')) {
    classifications.push('MemoryLeak');
  }
  if (errorMessage.includes('Network Error')) {
    classifications.push('NetworkIssue');
  }

  return classifications;
};

/**
 * Standardizes Rollbar error titles.
 * @param {string} type - The general category (e.g., 'API Error', 'Component', 'Manual')
 * @param {string} identifier - A specific identifier (e.g., Component name, API endpoint, description)
 * @returns {string} Formatted title string like `[Type] Identifier`
 */
export const formatRollbarTitle = (type, identifier) => {
  return `[${type || 'General'}] ${identifier || 'Unknown Issue'}`;
};

// https://foraday.atlassian.net/browse/FORA-1655
//
// Not the best solution for this, but it helps to organize the errors in rollbar
// and isn't too critical if it doesn't work.  NOTE: We should only use this in
// the title of the error, the real URL should still be stored in the context
// of the error sent to rollbar.
export const normalizeUrlPath = (url) => {
  try {
    if (!url) return url;

    const knownNonIds = new Set([
      'search',
      'list',
      'all',
      'settings',
      'view',
      'start',
      'organizations',
      'prioritized',
      'availablesymbols',
      'summarization',
      'coverimageurl',
      'participants',
      'morningdigest',
      'highlights',
      'transcripts',
      'botcreationrequest'
    ]);

    if (!url.startsWith('/')) url = '/' + url;
    return url
      .split('/')
      .map((segment, index) => {
        if (!segment || index === 1) return segment;
        // Match UUIDs or hash-like strings
        if (/^[a-f0-9]{32,}$/i.test(segment)) return ':id';
        // Match other ID-like segments
        if (/^[a-z0-9\-_.@:]{20,}$/i.test(segment) && !knownNonIds.has(segment.toLowerCase())) {
          return ':id';
        }

        return segment;
      })
      .join('/');
  } catch (e) {
    console.warn(`Failed to normalize ${url}: `, e);
    return url;
  }
};
