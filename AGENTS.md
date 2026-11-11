# Repository Guidelines

## Project Structure & Module Organization

- Source: `src/` (feature folders under `components/`, `pages/`, `routes/`, `services/`, `store/`, `util/`, `styles/`). Entry: `src/main.jsx`, app shell: `src/App.jsx`.
- Tests: `test/` mirrors app domains (e.g., `test/services`, `test/util`). Unit test setup at `test/setupTests.jsx`.
- Assets: `public/` for static files; build output in `dist/`.
- Aliases: see `vite.config.js` (e.g., `@components`, `@pages`, `@services`, `@test`). Example: `import Card from '@components/general/card/card.component.jsx';`.

### Tooling

- Build & Dev: Vite 5, `@vitejs/plugin-react`, custom Vite plugins for error boundaries (`build-helpers/vite-error-boundary-plugin.js`) and build metadata (`build-helpers/vite-build-info.plugin.js`), `vite-plugin-eslint`; path aliases defined in `vite.config.js`.
- Testing: Vitest (+ `@vitest/coverage-v8`) with jsdom and Testing Library (`@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`); MSW (`msw`) for API mocking; Cypress for E2E (`cypress`, `cypress-localstorage-commands`).
- Lint/Format & Git Hooks: ESLint (React, a11y, import, promise, standard, Cypress) configured in `.eslintrc.cjs`; Prettier via `.prettierrc`; Husky + lint-staged enforce on commit; Commitlint (`@commitlint/config-conventional`).
- UI & Styling: Chakra UI (`@chakra-ui/react`) with Emotion (`@emotion/react`, `@emotion/styled`) and Framer Motion; Chakra CLI tokens (`npm run gen:theme-typings`); `chakra-react-select`; Ant Design `ConfigProvider` used for CSP nonce; fonts via `@fontsource/inter`.
- Routing & State/Data: React Router v6 (`react-router-dom`); React Query v4 (`@tanstack/react-query`, Devtools in dev); Zustand for app store; `use-query-params` for URL state.
- Auth: Azure MSAL (`@azure/msal-react`, `@azure/msal-browser`), Okta (`@okta/okta-react`, `@okta/okta-auth-js`), Google OAuth (`@react-oauth/google`); token utils via `jwt-decode`.
- Analytics, Flags, Errors: Statsig (`@statsig/react-bindings`, `@statsig/web-analytics`, `@statsig/session-replay`); Rollbar (`rollbar`, `@rollbar/react`) with global ErrorBoundary.
- Realtime & Notifications: `pusher-js` for realtime; `react-onesignal` for push notifications.
- Editors & Content: TipTap (`@tiptap/*`) with `@hocuspocus/provider`; `react-quill`; markdown via `react-markdown`; PDFs via `@react-pdf/renderer`.
- Charts & Visualization: `chart.js`, `react-chartjs-2`, `chartjs-adapter-date-fns`; diagrams/flows via `@xyflow/react`.
- Media & UX: `lottie-react`, `react-player`, `react-dropzone`, `react-swipeable`, `react-idle-timer`, `react-icons`, `html-react-parser`, `react-datepicker`.
- Networking & Utils: `axios`; dates via `date-fns`/`date-fns-tz`; `lodash-es`, `uuid`, `validator`, `pluralize`, `storejs`, `ahooks`, `history`.
- Cloud & Integrations: AWS SDK v3 (`@aws-sdk/client-s3`, `@aws-sdk/client-lambda`); Nylas (`@nylas/nylas-react`); Netlify CLI for local dev.
- Hosting, CSP & Edge: Netlify with Edge Functions (`netlify/edge-functions`) for CSP headers with nonce injection and dynamic OG images; `@netlify/plugin-csp-nonce`; Emotion cache wired to CSP nonce (`src/emotion-cache.js`); redirects/headers in `netlify.toml`.
- Release & CI: `release-it` with custom changelog generator (`build-helpers/ChangelogUpdater.js`, uses Octokit + Slack API); GitHub Actions workflows for tests and releases; SonarCloud config in `sonar-project.properties`.

## Build, Test, and Development Commands

- `npm run dev`: Start Vite dev server at `http://localhost:5173`.
- `npm run dev:as-prod`: Dev server with production mode flags.
- `npm run build`: Production build with versioned asset names.
- `npm run preview`: Serve the production build locally.
- `npm test`: Run unit tests once (Vitest + jsdom).
- `npm run test test/path/to/test-file.test.js`: Run a specific test file
- `npm run test:watch:file`: Watch tests for changed files.
- `npm run test-coverage`: Generate coverage (V8) with thresholds.
- `npm run test:e2e`: Run Cypress E2E in headless Chrome; `test-local:e2e` opens UI.
- `npm run lint` / `lint:fix` / `lint:strict`: Lint, auto-fix, or fail on warnings.

## Coding Style & Naming Conventions

- Format: Prettier (`.prettierrc`), 2‑space indent, single quotes, semicolons, one JSX attribute per line.
- Lint: ESLint (`.eslintrc.cjs`) with React, a11y, and project rules. Prefer arrow functions; camelCase for vars; kebab-case for file/dir names.
- Components: prefer `*.component.jsx`; hooks/utilities: `*.hooks.js[x]`, helpers: `*.helpers.js[x]`.

## Testing Guidelines

- Frameworks: Vitest with Testing Library; jsdom environment.
- Coverage: 80% statements/branches/functions/lines (configured in `vite.config.js`).
- Naming: `*.test.js[x]` or `*.spec.js[x]`; place under `test/` mirroring source.
- Setup: globals and mocks defined in `test/setupTests.jsx`.

## Commit & Pull Request Guidelines

- Branches: must match `FORA-<ticket>-optional-slug` (enforced on pre‑push), e.g., `FORA-1234-fix-loading`.
- Commits: Conventional Commits style (e.g., `feat: add meeting card skeleton`). Commitlint config exists; hook may be disabled locally.
- PRs: include clear description, linked issue, and screenshots for UI changes. Ensure `npm run lint:strict`, unit tests, and (when relevant) E2E tests pass. Mention any config or ENV changes.

## Security & Configuration Tips

- Env: copy `.env` template and set required `VITE_*` keys for local/dev; Cypress uses `cypress.config.js` envs.
- Secrets: never commit credentials or real keys; prefer `.env` and CI secrets.
