import { createFilter } from '@rollup/pluginutils';
import * as babel from '@babel/core';

/**
 * Creates a Babel plugin that wraps React components with error boundaries
 * @param {Object} options - Babel plugin options
 * @param {Object} options.types - Babel types object
 * @returns {Object} Babel plugin definition
 */
export function createErrorBoundaryBabelPlugin({ types: t }) {
  const isReactFile = (filename) =>
    filename && (filename.endsWith('.jsx') || filename.endsWith('.tsx'));
  const isNodeModulesFile = (filename) => filename && filename.includes('node_modules');

  return {
    name: 'direct-error-boundary-wrapper',
    visitor: {
      Program(path, state) {
        if (!isReactFile(state.filename) || isNodeModulesFile(state.filename)) {
          return;
        }

        // Check if helpers are already imported
        let hasWithErrorBoundaryImport = false;
        let hasShouldWrapImport = false;
        path.traverse({
          ImportDeclaration(importPath) {
            if (importPath.node.source.value === '@util/helpers/error-boundary.helpers') {
              importPath.node.specifiers.forEach((specifier) => {
                if (t.isImportSpecifier(specifier)) {
                  if (specifier.imported.name === 'withErrorBoundary') {
                    hasWithErrorBoundaryImport = true;
                  }
                  if (specifier.imported.name === 'shouldWrapWithErrorBoundary') {
                    hasShouldWrapImport = true;
                  }
                }
              });
            }
          }
        });

        // Only add imports if they are missing
        if (!hasWithErrorBoundaryImport || !hasShouldWrapImport) {
          const specifiersToImport = [];
          if (!hasWithErrorBoundaryImport) {
            specifiersToImport.push(
              t.importSpecifier(
                t.identifier('withErrorBoundary'),
                t.identifier('withErrorBoundary')
              )
            );
          }
          if (!hasShouldWrapImport) {
            specifiersToImport.push(
              t.importSpecifier(
                t.identifier('shouldWrapWithErrorBoundary'),
                t.identifier('shouldWrapWithErrorBoundary')
              )
            );
          }

          if (specifiersToImport.length > 0) {
            const importDeclaration = t.importDeclaration(
              specifiersToImport,
              t.stringLiteral('@util/helpers/error-boundary.helpers')
            );
            path.node.body.unshift(importDeclaration);
          }
        }

        const processedComponents = new Map();

        // Handle both named exports and default exports
        path.traverse({
          // Handle named exports like: export function ComponentName()
          ExportNamedDeclaration(exportPath) {
            // Only handle exported function declarations
            if (
              exportPath.node.declaration &&
              (exportPath.node.declaration.type === 'FunctionDeclaration' ||
                exportPath.node.declaration.type === 'ClassDeclaration')
            ) {
              const declaration = exportPath.node.declaration;
              const componentName = declaration.id.name;

              if (processedComponents.has(componentName)) {
                return;
              }
              processedComponents.set(componentName, true);

              const wrappedVarName = `Wrapped${componentName}`;

              // Create the wrapped component declaration
              const wrappedComponent = t.variableDeclaration('const', [
                t.variableDeclarator(
                  t.identifier(wrappedVarName),
                  t.callExpression(t.identifier('shouldWrapWithErrorBoundary'), [
                    t.stringLiteral(componentName),
                    t.callExpression(t.identifier('withErrorBoundary'), [
                      t.identifier(componentName),
                      t.objectExpression([
                        t.objectProperty(
                          t.identifier('componentName'),
                          t.stringLiteral(componentName)
                        )
                      ])
                    ])
                  ])
                )
              ]);

              // Convert export to a non-export declaration
              const componentDeclaration = t.cloneNode(declaration);

              const wrappedExport = t.exportNamedDeclaration(null, [
                t.exportSpecifier(t.identifier(wrappedVarName), t.identifier(componentName))
              ]);

              exportPath.replaceWith(componentDeclaration);

              // Add the wrapper after the component
              exportPath.insertAfter(wrappedComponent);

              // Add the export of the wrapped component
              exportPath.insertAfter(wrappedExport);
            }
          },

          // Handle default exports like: export default ComponentName
          ExportDefaultDeclaration(exportPath) {
            const declaration = exportPath.node.declaration;

            // Only handle identifier exports (e.g., export default ComponentName)
            if (t.isIdentifier(declaration)) {
              const componentName = declaration.name;

              if (processedComponents.has(componentName)) {
                return;
              }
              processedComponents.set(componentName, true);

              // Replace the export with the wrapped version
              exportPath.node.declaration = t.callExpression(
                t.identifier('shouldWrapWithErrorBoundary'),
                [
                  t.stringLiteral(componentName),
                  t.callExpression(t.identifier('withErrorBoundary'), [
                    t.identifier(componentName),
                    t.objectExpression([
                      t.objectProperty(
                        t.identifier('componentName'),
                        t.stringLiteral(componentName)
                      )
                    ])
                  ])
                ]
              );
            }
            // Handle inline function declarations (e.g., export default function ComponentName())
            else if (t.isFunctionDeclaration(declaration) && declaration.id) {
              const componentName = declaration.id.name;

              if (processedComponents.has(componentName)) {
                return;
              }
              processedComponents.set(componentName, true);

              // Create a regular function declaration (not exported)
              const funcDeclaration = t.functionDeclaration(
                t.identifier(componentName),
                declaration.params,
                declaration.body,
                declaration.generator,
                declaration.async
              );

              // Insert the function declaration before the export
              exportPath.insertBefore(funcDeclaration);

              // Replace the export with the wrapped version
              exportPath.node.declaration = t.callExpression(
                t.identifier('shouldWrapWithErrorBoundary'),
                [
                  t.stringLiteral(componentName),
                  t.callExpression(t.identifier('withErrorBoundary'), [
                    t.identifier(componentName),
                    t.objectExpression([
                      t.objectProperty(
                        t.identifier('componentName'),
                        t.stringLiteral(componentName)
                      )
                    ])
                  ])
                ]
              );
            }
          }
        });
      }
    }
  };
}

/**
 * Vite plugin to automatically transform React components with error boundaries
 * @param {Object} options - Plugin configuration options
 * @param {string[]} [options.include] - Glob patterns for files to include
 * @param {string[]} [options.exclude] - Glob patterns for files to exclude
 * @param {string} [options.errorBoundaryPath] - Path to error boundary component
 * @returns {Object} Vite plugin definition
 */
export default function viteErrorBoundaryPlugin(options = {}) {
  const defaultOptions = {
    include: ['**/*.jsx', '**/*.tsx'],
    exclude: ['**/node_modules/**', '**/error-boundary/**', '**/*.spec.*', '**/*.test.*'],
    errorBoundaryPath: '@components/general/error-boundary/error-boundary.component',
    forceInclude: [] // New option for files to always wrap
  };

  const opts = { ...defaultOptions, ...options };
  const filter = createFilter(opts.include, opts.exclude);
  // Create a separate filter for the forceInclude option
  const forceFilter = opts.forceInclude.length > 0 ? createFilter(opts.forceInclude) : () => false;

  return {
    name: 'vite-error-boundary-plugin',
    enforce: 'pre',
    transform(code, id) {
      if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
        return null;
      }

      // Check if the file should be forcefully included
      const isForceIncluded = forceFilter(id);

      // Only apply the main filter if not force included
      if (!isForceIncluded && !filter(id)) {
        return null;
      }

      if (!id.endsWith('.jsx') && !id.endsWith('.tsx')) {
        return null;
      }

      // Skip files that explicitly import helpers, UNLESS force included
      if (!isForceIncluded) {
        if (
          code.includes(`import ${opts.errorBoundaryPath}`) ||
          code.includes(`from '${opts.errorBoundaryPath}'`) ||
          code.includes(`from "${opts.errorBoundaryPath}"`) ||
          code.includes('import { withErrorBoundary') ||
          code.includes('import { shouldWrapWithErrorBoundary')
        ) {
          return null;
        }
      }

      try {
        const result = babel.transformSync(code, {
          filename: id,
          plugins: [[createErrorBoundaryBabelPlugin, { ...opts }]],
          presets: [['@babel/preset-react', { runtime: 'automatic' }]],
          sourceMaps: true,
          configFile: false,
          babelrc: false
        });

        if (!result) {
          return null;
        }

        return {
          code: result.code,
          map: result.map
        };
      } catch (error) {
        console.error(`Error transforming ${id}:`, error);
        return null;
      }
    }
  };
}
