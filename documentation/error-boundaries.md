# Component-Level Error Boundaries

This document explains the automatic error boundary solution implemented in the Fora frontend codebase to prevent entire page crashes due to component-level errors.

## Background

Previously, when a component encountered an error (like the TypeError in insight.helpers.js), the entire page would crash. Our solution isolates errors to individual components, preventing application-wide failures.

## How It Works

The solution consists of three key parts:

1. **Custom Error Boundary Component**: A specialized component that catches errors in its children and displays a fallback UI while reporting to Rollbar
2. **Rollbar Integration**: Automatic error reporting to Rollbar for monitoring and fixing issues
3. **Vite Plugin**: A custom Vite plugin that transforms React components to be wrapped with error boundaries

### Component Error Boundary

The `ErrorBoundaryWrapper` component (`src/components/general/error-boundary/error-boundary.component.jsx`) provides:

- Error isolation at the component level
- Error reporting to Rollbar
- A user-friendly fallback UI
- Retry capability
- Component name in error messages for easy debugging

### Rollbar Integration

Our error boundary integrates with Rollbar through the `@rollbar/react` package:

- Automatically reports caught errors to Rollbar
- Includes component names in error data for better debugging
- Provides standardized reporting for all errors
- Allows for error severity customization

### Vite Plugin

Our custom `vite-error-boundary-plugin` handles both development and production:

- Transforms React components to be wrapped with error boundaries
- Works with both named exports and default exports
- Intelligently wraps components without creating circular references
- Ensures consistent behavior across all environments

## Configuration

Our setup is configured in `vite.config.js` to handle both development and production:

```javascript
// For both development and production
viteErrorBoundaryPlugin({
  include: ['**/components/**/*.jsx', '**/pages/**/*.jsx'],
  exclude: [
    '**/node_modules/**', 
    '**/error-boundary/**', 
    '**/*.spec.*', 
    '**/*.test.*'
  ]
})
```

## Testing

To test if the error boundary wrapping is working correctly, you can visit:

`/test/error-boundary` - A test page with components that trigger errors

The test page demonstrates four different methods for implementing error boundaries:

1. **Method 1: Automatic Plugin Wrapping** - A component that is automatically wrapped with an error boundary by the Vite plugin without any manual code
2. **Method 2: Higher Order Component (HOC) Pattern** - Another component that is automatically wrapped by the plugin, which demonstrates where you would typically use the withErrorBoundary HOC
3. **Method 3: Direct Component Usage** - Using the ErrorBoundary component directly in JSX to wrap specific sections
4. **Method 4: Alternative HOC Usage** - Creating a pre-wrapped component with the withErrorBoundary HOC

If clicking the test buttons on any of these components causes the entire page to crash, then the error boundary implementation is not working. If only that component shows an error message while the rest of the page continues to function, then the error boundary wrapping is working correctly.

## Development and Production Consistency

With our custom Vite plugin approach, error boundaries work consistently in both development and production environments. This provides several benefits:

- Faster development cycles as you can immediately see how error boundaries behave
- More accurate representation of production behavior during development
- Consistent error reporting to Rollbar in all environments
- No need to manually wrap components for testing

## Manual Usage

While most components are automatically wrapped, you can still manually wrap any component if needed:

```jsx
import ErrorBoundaryWrapper from '@components/general/error-boundary/error-boundary.component';

const MyComponent = () => {
  // Component implementation
};

export default function MyComponentWithErrorBoundary() {
  return (
    <ErrorBoundaryWrapper componentName='MyComponent'>
      <MyComponent />
    </ErrorBoundaryWrapper>
  );
}
```

## Component Structure Pattern

For components where automatic error boundary wrapping is critical, we recommend using the inner/outer component pattern:

```jsx
import ErrorBoundaryWrapper from '@components/general/error-boundary/error-boundary.component';

// Inner component with the actual implementation
function MyComponentInner() {
  // Component implementation that might throw errors
}

// Outer component that applies the error boundary
export function MyComponent() {
  return (
    <ErrorBoundaryWrapper componentName='MyComponent'>
      <MyComponentInner />
    </ErrorBoundaryWrapper>
  );
}
```

This pattern ensures the component will always have error protection, even if the automatic wrapping fails.

## Troubleshooting

If you encounter issues with error boundaries not working:

1. **Check if Auto-Wrapping Works**: Visit the test page at `/test/error-boundary` to see if automatic wrapping is functioning
2. **Verify the Component Structure**: Make sure your component is exporting properly and follows React component conventions
3. **Check for Import Conflicts**: Ensure the component isn't already importing the error boundary component
4. **Use Manual Wrapping**: For critical components, use explicit error boundary wrapping with the inner/outer component pattern

If the automatic wrapping is not reliable for a specific component, manually wrapping it with an error boundary is the most dependable solution.

## Limitations

- Error boundaries only catch errors in the React component tree
- They don't catch errors in:
  - Event handlers
  - Asynchronous code (e.g., `setTimeout`, `requestAnimationFrame`, promises)
  - Server-side rendering
  - Errors thrown in the error boundary itself

For errors not caught by error boundaries (like those in async code), you should use try/catch blocks and report errors manually to Rollbar.

## Rollbar Reporting

All errors caught by our error boundaries are automatically reported to Rollbar with:

- The error message and stack trace
- The component name where the error occurred
- The React component tree at the time of the error
- Error classification to categorize different types of errors
- Feature flag data to provide additional context

This allows us to quickly identify and fix issues in production.

## Bundle Size Impact

The automatic error boundary implementation adds minimal overhead to the bundle size (less than 2KB after minification and compression), well below the 5% threshold.

## Performance Considerations

- The error boundary adds a minimal additional component to the React tree
- No performance impact during normal operation
- Only activates when errors occur 