import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import eslintPlugin from 'vite-plugin-eslint';
import buildInfoPlugin from './build-helpers/vite-build-info.plugin.js';
import viteErrorBoundaryPlugin from './build-helpers/vite-error-boundary-plugin.js';

const packageJson = JSON.parse(fs.readFileSync('package.json'));
const version = packageJson.version;

/**
 * Defines the Vite configuration for the application.
 * This function returns an object containing settings for resolving aliases,
 * esbuild options, plugins (React, ESLint, custom error boundary, build info),
 * test environment (Vitest globals, jsdom, setup files, coverage), and build options
 * (sourcemaps, Rollup manual chunks, chunk size limits).
 * @returns {import('vite').UserConfig} The Vite configuration object.
 */
export default defineConfig(() => {
  return {
    resolve: {
      alias: {
        '@src': path.resolve(__dirname, './src'),
        '@root': path.resolve(__dirname, './'),
        '@components': path.resolve(__dirname, './src/components'),
        '@layouts': path.resolve(__dirname, './src/layouts'),
        '@test-data': path.resolve(__dirname, './src/test-data'),
        '@routes': path.resolve(__dirname, './src/routes'),
        '@services': path.resolve(__dirname, './src/services'),
        '@store': path.resolve(__dirname, './src/store'),
        '@util': path.resolve(__dirname, './src/util'),
        '@assets': path.resolve(__dirname, './src/assets'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@node_modules': path.resolve(__dirname, './node_modules'),
        '@test': path.resolve(__dirname, './test')
      }
    },
    esbuild: { legalComments: 'none' },
    plugins: [
      // Add error boundary plugin for both dev and prod modes
      viteErrorBoundaryPlugin({
        // Only include component files we want to wrap with error boundaries
        include: ['**/components/**/*.jsx', '**/pages/**/*.jsx'],
        exclude: [
          '**/error-boundary/**',
          '**/*.spec.*',
          '**/*.test.*',
          '**/node_modules/**',
          // Exclude skeleton components
          '**/right-rail-skeleton.component.jsx',
          '**/person-skeleton.component.jsx',
          '**/meeting-card-skeleton.component.jsx',
          '**/summary-card-skeleton.component.jsx',
          '**/person-card-skeleton.component.jsx',
          '**/meeting/skeleton.component.jsx',
          // Exclude loader components
          '**/full-page-loader.component.jsx',
          '**/three-dot-loader.component.jsx',
          '**/loading-screen.component.jsx',
          '**/lens-card-loading.component.jsx',
          '**/chat-thinking-message.component.jsx',
          '**/components/share-summary/share-summary.component.jsx',
          '**/components/pdf/**'
        ],
        // Force include the testing page even though it imports helpers
        forceInclude: ['**/rollbar-testing.page.jsx']
      }),
      react(),
      eslintPlugin({
        emitWarning: true,
        formatter: 'stylish',
        include: ['src/**/*.js', 'src/**/*.jsx', 'src/**/*.ts', 'src/**/*.tsx'],
        overrideConfigFile: path.resolve(__dirname, '.eslintrc.cjs')
      }),
      buildInfoPlugin()
    ].filter(Boolean),
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './test/setupTests.jsx',
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        all: true,
        include: ['src/**/*.{js,ts,jsx,tsx}'],
        exclude: ['node_modules', 'tests'],
        thresholds: {
          statements: 80,
          branches: 80,
          functions: 80,
          lines: 80
        }
      }
    },
    build: {
      sourcemap: true,
      rollupOptions: {
        output: {
          chunkFileNames: `assets/[name]-${version}.js`,
          entryFileNames: `assets/[name]-${version}.js`,
          assetFileNames: `assets/[name]-${version}.[ext]`,
          manualChunks: {
            react: [
              'react',
              'react-datepicker',
              'react-device-detect',
              'react-dom',
              'react-helmet',
              'react-hook-form',
              'react-icons',
              'react-idle-timer',
              'react-insta-stories',
              'react-markdown',
              'react-multi-email',
              'react-onesignal',
              'react-player',
              'react-quill',
              'react-router-dom',
              'react-swipeable'
            ],
            chakra: ['@chakra-ui/react'],
            lottie: ['lottie-web', 'lottie-react'],
            lodash: ['lodash'],
            antd: ['antd', '@ant-design/icons'],
            datefns: ['date-fns', 'date-fns-tz'],
            okta: ['@okta/okta-auth-js', '@okta/okta-react'],
            pusher: ['pusher-js']
          }
        }
      },
      chunkSizeWarningLimit: 1000,
      commonjsOptions: {
        transformMixedEsModules: true
      }
    }
  };
});
