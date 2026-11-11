/**
 * Tests for the Error Boundary Babel plugin
 * 
 * These tests verify that the plugin correctly transforms React components
 * by adding error boundary wrappers to isolate component errors.
 */
import { transform } from '@babel/core';
import { describe, expect, it } from 'vitest';
import { createErrorBoundaryBabelPlugin } from '../../build-helpers/vite-error-boundary-plugin.js';

/**
 * Transforms code using the error boundary Babel plugin
 * 
 * @param {string} code - JavaScript/JSX code to transform
 * @param {string} filename - Filename to use for the transformation
 * @returns {string} Transformed code
 */
function transformCode(code, filename) {
  return transform(code, {
    plugins: [[createErrorBoundaryBabelPlugin, { filename }]],
    presets: [['@babel/preset-react', { runtime: 'automatic' }]],
    filename,
    babelrc: false,
    configFile: false
  }).code;
}

describe('Error Boundary Babel Plugin', () => {
  it('adds error boundary imports to a React component file', () => {
    const code = `
      import React from 'react';
      
      export function MyComponent() {
        return <div>Hello World</div>;
      }
    `;

    const result = transformCode(code, 'src/components/test.jsx');

    expect(result).toContain("withErrorBoundary");
    expect(result).toContain("shouldWrapWithErrorBoundary");
    expect(result).toContain("componentName: \"MyComponent\"");
  });

  it('wraps a functional component with error boundary', () => {
    const code = `
      import React from 'react';
      
      export function MyComponent() {
        return <div>Hello World</div>;
      }
    `;

    const result = transformCode(code, 'src/components/test2.jsx');

    expect(result).toContain('shouldWrapWithErrorBoundary');
    expect(result).toContain('withErrorBoundary(MyComponent, {');
    expect(result).toContain('componentName: "MyComponent"');
  });

  it.skip('wraps a class component with error boundary', () => {
    const code = `
      import React from 'react';
      
      export class ClassComponent extends React.Component {
        render() {
          return <div>Hello World</div>;
        }
      }
    `;

    const result = transformCode(code, 'src/components/class-test.jsx');

    expect(result).toContain('shouldWrapWithErrorBoundary');
    expect(result).toContain('withErrorBoundary(ClassComponent, {');
    expect(result).toContain('componentName: "ClassComponent"');
  });

  it('wraps a default exported component with error boundary', () => {
    const code = `
      import React from 'react';
      
      function DefaultComponent() {
        return <div>Hello World</div>;
      }
      
      export default DefaultComponent;
    `;

    const result = transformCode(code, 'src/components/default-test.jsx');

    expect(result).toContain('shouldWrapWithErrorBoundary("DefaultComponent",');
    expect(result).toContain('withErrorBoundary(DefaultComponent');
  });

  it('wraps a default exported function declaration with error boundary', () => {
    const code = `
      import React from 'react';
      
      export default function DefaultFunctionComponent() {
        return <div>Hello World</div>;
      }
    `;

    const result = transformCode(code, 'src/components/default-func-test.jsx');

    expect(result).toContain('function DefaultFunctionComponent()');
    expect(result).toContain('shouldWrapWithErrorBoundary("DefaultFunctionComponent"');
    expect(result).toContain('withErrorBoundary(DefaultFunctionComponent');
  });

  it('does not transform non-React files', () => {
    const code = `
      export function myUtilFunction() {
        return 'Hello World';
      }
    `;

    const result = transformCode(code, 'src/utils/helpers.js');

    expect(result).not.toContain('withErrorBoundary');
    expect(result).not.toContain('shouldWrapWithErrorBoundary');
  });

  it('skips files in node_modules', () => {
    const code = `
      import React from 'react';
      
      export function ExternalComponent() {
        return <div>External Component</div>;
      }
    `;

    const result = transformCode(code, 'node_modules/some-package/component.jsx');

    expect(result).not.toContain('withErrorBoundary');
    expect(result).not.toContain('shouldWrapWithErrorBoundary');
  });
});
