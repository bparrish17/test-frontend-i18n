import React, { useCallback, useState } from 'react';
import { Box, Button, Heading, Text, useColorModeValue } from '@chakra-ui/react';
import { ErrorBoundary as RollbarErrorBoundary } from '@rollbar/react';
import { getSimplifiedGatesFromStore } from '@store/feature-gates.store';
import {
  classifyError,
  extractComponentTree,
  formatRollbarTitle,
  sanitizeProps
} from '@util/helpers/error-boundary.helpers';

import buildInfo from '@root/build-helpers/build-info.json';

/**
 * Default UI component displayed when an error boundary catches an error.
 *
 * @param {object} props - Component props.
 * @param {Function} props.resetError - Function to call to attempt resetting the error state.
 * @param {string} [props.componentName='UI Component'] - Name of the component that errored.
 * @param {string} props.bgColor - Background color for the fallback UI.
 * @param {string} props.borderColor - Border color for the fallback UI.
 * @param {string} props.textColor - Text color for the fallback UI.
 * @param {boolean} [props.showRetry=true] - Whether to show the Retry/Reload buttons.
 * @returns {JSX.Element} The fallback UI component.
 */
function DefaultFallbackUI({
  // resetError,
  componentName,
  bgColor,
  borderColor,
  textColor,
  showRetry = true
}) {
  return (
    <Box
      bg={bgColor}
      borderRadius='md'
      p={4}
      my={2}
      border='1px solid'
      borderColor={borderColor}
    >
      <Heading size='sm'>Component Error in {componentName || 'UI Component'}</Heading>
      <Text
        fontSize='sm'
        mt={2}
        color={textColor}
      >
        This component encountered an error and couldn&apos;t be displayed.
      </Text>
      {showRetry && (
        <Button
          mt={3}
          size='sm'
          onClick={() => window.location.reload()}
        >
          Reload Page
        </Button>
      )}
    </Box>
  );
}

/**
 * Main Error Boundary component wrapper.
 * Uses Rollbar's ErrorBoundary and provides custom context and fallback UI.
 *
 * @param {object} props - Component props passed to RollbarErrorBoundary and DefaultFallbackUI.
 * @param {React.ReactNode} props.children - The components to wrap with the error boundary.
 * @param {string} [props.componentName] - The name of the wrapped component (often injected by plugin).
 * @param {'critical'|'error'|'warning'|'info'|'debug'} [props.severity='error'] - The severity level for Rollbar.
 * @param {React.ReactNode} [props.fallback] - Optional custom fallback component.
 * @param {boolean} [props.showRetry] - Whether the default fallback should show retry buttons.
 * @returns {JSX.Element} The Rollbar ErrorBoundary wrapping the children.
 */
function ErrorBoundaryWrapper(props) {
  const bgColor = useColorModeValue('container.surfaceContainerLow', 'surface.surface');
  const borderColor = useColorModeValue('surface.outlineVariant', 'surface.outlineVariant');
  const textColor = useColorModeValue('surface.onSurfaceVariant', 'surface.onSurfaceVariant');
  const [errorState, setErrorState] = useState({ hasError: false, error: null });

  /**
   * Callback to render the fallback UI when an error is caught.
   * If a custom `props.fallback` is provided, it's used; otherwise, `DefaultFallbackUI` is rendered.
   * @param {object} params - Parameters provided by RollbarErrorBoundary.
   * @param {Error} params.error - The error that was caught.
   * @param {Function} params.resetError - Function to reset the error boundary state.
   * @returns {React.ReactNode} The fallback UI to display.
   */
  const customFallbackUI = useCallback(
    ({ error, resetError }) => {
      if (!errorState.hasError) {
        setErrorState({ hasError: true, error });
      }

      if (props.fallback) {
        return props.fallback;
      }

      return (
        <DefaultFallbackUI
          error={error}
          resetError={() => {
            setErrorState({ hasError: false, error: null });
            resetError();
          }}
          componentName={props.componentName}
          bgColor={bgColor}
          borderColor={borderColor}
          textColor={textColor}
          showRetry={props.showRetry !== false}
        />
      );
    },
    [
      props.fallback,
      props.componentName,
      props.showRetry,
      bgColor,
      borderColor,
      textColor,
      errorState.hasError
    ]
  );

  /**
   * Async handler called by RollbarErrorBoundary when an error is caught.
   * Updates the component's error state and allows Rollbar to continue its default error handling.
   * @param {Error} originalError - The error caught by the boundary.
   * @returns {Promise<boolean>} A promise resolving to true to indicate Rollbar should proceed.
   */
  const onError = async (originalError) => {
    setErrorState({ hasError: true, error: originalError });
    return true;
  };

  /**
   * Function to generate extra context for Rollbar reports.
   * Includes component name, severity, sanitized props, route information,
   * simplified feature flags, a component stack trace, and error classification.
   * @param {Error} originalError - The original error object.
   * @param {object} errorInfo - React error information object, containing componentStack.
   * @returns {object} An object containing additional context for Rollbar.
   */
  const getExtraContext = (originalError, errorInfo) => {
    const simplifiedFeatureFlags = getSimplifiedGatesFromStore() || {};

    const context = {
      componentName: props.componentName || 'Unknown component',
      severity: props.severity || 'error',
      componentProps: sanitizeProps(props),
      route: {
        pathname: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
        url: window.location.href
      },
      featureFlags: simplifiedFeatureFlags,
      componentTree: extractComponentTree(errorInfo?.componentStack, 10),
      errorCategory: classifyError(originalError),
      buildInfo
    };

    return context;
  };

  return (
    <RollbarErrorBoundary
      level={props.severity || 'error'}
      errorMessage={formatRollbarTitle('Component', props.componentName || 'Unknown Component')}
      fallbackUI={customFallbackUI}
      extra={getExtraContext}
      onError={onError}
    >
      {props.children}
    </RollbarErrorBoundary>
  );
}

export default ErrorBoundaryWrapper;
