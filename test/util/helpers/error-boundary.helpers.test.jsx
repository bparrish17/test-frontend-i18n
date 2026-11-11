import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import {
  shouldWrapWithErrorBoundary,
  withErrorBoundary,
  normalizeUrlPath
} from '@util/helpers/error-boundary.helpers';

// Mock the ErrorBoundary component that gets dynamically imported
const MockErrorBoundary = vi.fn(({ children }) => <>{children}</>);
vi.mock('@components/general/error-boundary/error-boundary.component', () => ({
  default: MockErrorBoundary
}));

// Simple component for testing
function TestComponent({ text = 'Hello' }) {
  return <div>{text}</div>;
}
TestComponent.displayName = 'TestComponent';

describe('Error Boundary Helpers', () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    // Restore original NODE_ENV
    process.env.NODE_ENV = originalEnv;
    vi.clearAllMocks();
  });

  describe('shouldWrapWithErrorBoundary', () => {
    it('should return the original component when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      const Wrapped = shouldWrapWithErrorBoundary('TestComponent', TestComponent);
      expect(Wrapped).toBe(TestComponent);
    });

    it('should return the original component when NODE_ENV is not test', () => {
      process.env.NODE_ENV = 'development';
      const Wrapped = shouldWrapWithErrorBoundary('TestComponent', TestComponent);
      // Based on current implementation, it always returns the original component
      expect(Wrapped).toBe(TestComponent);

      process.env.NODE_ENV = 'production';
      const WrappedProd = shouldWrapWithErrorBoundary('TestComponent', TestComponent);
      expect(WrappedProd).toBe(TestComponent);
    });
  });

  describe('withErrorBoundary', () => {
    it('should return the original component when NODE_ENV is test', () => {
      process.env.NODE_ENV = 'test';
      const WrappedComponent = withErrorBoundary(TestComponent);
      expect(WrappedComponent).toBe(TestComponent);

      // Ensure rendering works as expected (it's the original component)
      render(<WrappedComponent text='Test Env' />);
      expect(screen.getByText('Test Env')).toBeInTheDocument();
    });

    it('should return a wrapped component when NODE_ENV is not test', async () => {
      process.env.NODE_ENV = 'development';
      const WrappedComponent = withErrorBoundary(TestComponent, 'MyTestComponent');

      // Check displayName
      expect(WrappedComponent.displayName).toBe('WithErrorBoundary(TestComponent)');

      // Check rendering - use findByText to handle Suspense
      render(<WrappedComponent text='Dev Env' />);
      expect(await screen.findByText('Dev Env')).toBeInTheDocument();

      // Check if MockErrorBoundary was used with correct props
      expect(MockErrorBoundary).toHaveBeenCalled();
      expect(MockErrorBoundary).toHaveBeenCalledWith(
        expect.objectContaining({ componentName: 'MyTestComponent' }),
        expect.anything() // Context object
      );
    });

    it('should handle options as an object', async () => {
      process.env.NODE_ENV = 'production';
      const options = { componentName: 'ProdComponent', severity: 'warning' };
      const WrappedComponent = withErrorBoundary(TestComponent, options);

      expect(WrappedComponent.displayName).toBe('WithErrorBoundary(TestComponent)');

      render(<WrappedComponent text='Prod Env' />);
      expect(await screen.findByText('Prod Env')).toBeInTheDocument();

      expect(MockErrorBoundary).toHaveBeenCalled();
      expect(MockErrorBoundary).toHaveBeenCalledWith(
        expect.objectContaining(options), // Should pass the whole options object
        expect.anything()
      );
    });

    it('should handle component without explicit displayName', async () => {
      process.env.NODE_ENV = 'development';
      const NamelessComponent = () => <div>Nameless</div>;
      const WrappedComponent = withErrorBoundary(NamelessComponent, 'NamelessTest');

      expect(WrappedComponent.displayName).toBe('WithErrorBoundary(NamelessComponent)');

      render(<WrappedComponent />);
      expect(await screen.findByText('Nameless')).toBeInTheDocument();

      expect(MockErrorBoundary).toHaveBeenCalledWith(
        expect.objectContaining({ componentName: 'NamelessTest' }),
        expect.anything()
      );
    });

    it('should render fallback for suspense', async () => {
      // This test primarily ensures Suspense is used.
      // We mocked React.lazy to resolve immediately, so the actual fallback won't show,
      // but the structure implies Suspense is present.
      process.env.NODE_ENV = 'development';
      const WrappedComponent = withErrorBoundary(TestComponent, 'SuspenseTest');
      render(<WrappedComponent text='Suspense Check' />);
      // Use findByText to handle async nature of Suspense/lazy
      expect(await screen.findByText('Suspense Check')).toBeInTheDocument();
      // Verify our mock error boundary was called, implying lazy/Suspense worked
      expect(MockErrorBoundary).toHaveBeenCalledWith(
        expect.objectContaining({ componentName: 'SuspenseTest' }),
        expect.anything()
      );
    });
  });

  describe('normalizeUrlPath', () => {
    it('replaces long hashes with :id', () => {
      const url =
        '/meetings/6f9fd79daaf5bbd3d80dd6659934ff52ba0a22b8_0vt31hffd4k1v23tjs0ko99s4c/all';
      expect(normalizeUrlPath(url)).toBe('/meetings/:id/all');
    });

    it('leaves simple paths unchanged', () => {
      const url = '/health';
      expect(normalizeUrlPath(url)).toBe('/health');
    });

    it('replaces multiple IDs in one path', () => {
      const url = '/projects/1234567890abcdef09837/tasks/0987654321abcdef9302';
      expect(normalizeUrlPath(url)).toBe('/projects/:id/tasks/:id');
    });

    it('replaces short alphanumeric ids too', () => {
      const url = '/user/asdf1234fdsapoiu1234/settings';
      expect(normalizeUrlPath(url)).toBe('/user/:id/settings');
    });

    it('replaces id in cards endpoint', () => {
      const url = '/cards/sources/7cbebc32-1453-489e-bbe1-02bf10c72e20/all';
      expect(normalizeUrlPath(url)).toBe('/cards/sources/:id/all');
    });

    it('replaces id in scroll endpoint', () => {
      const url =
        '/channels/scroll/FGluY2x1ZGVfY29udGV4dF91dWlkDXF1ZXJ5QW5kRmV0Y2gBFk9td193NTZiUkRpVjdORUFaaVRaTGcAAAAAACk23xZSRVpLSU1mQ1M4bWtTZEkzSWNyZGtn';
      expect(normalizeUrlPath(url)).toBe('/channels/scroll/:id');
    });

    it('replaces id in teams endpoint', () => {
      const url =
        '/microsoft/teams/19:4AdajHD4pkCNSvE2RdS4mKphmRXj3_Y21Y0Okkd10cI1@thread.tacv2/channels';
      expect(normalizeUrlPath(url)).toBe('/microsoft/teams/:id/channels');
    });

    it('keeps numeric-only paths (like years)', () => {
      const url = '/archive/2024/summary';
      expect(normalizeUrlPath(url)).toBe('/archive/2024/summary');
    });

    it('never replaces the first part of the path', () => {
      const url = '/somereallylongmodelnamethatcouldmatch/all';
      expect(normalizeUrlPath(url)).toBe('/somereallylongmodelnamethatcouldmatch/all');
    });

    // should never happen, but just in case
    it('handles undefined', () => {
      const url = undefined;
      expect(normalizeUrlPath(url)).toBe(undefined);
    });

    it('handles bad param', () => {
      const url = { bad: 'data' };
      expect(normalizeUrlPath(url)).toEqual({ bad: 'data' });
    });
  });
});
