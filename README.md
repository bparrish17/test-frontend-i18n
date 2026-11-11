# Fora Web Application

**Last Updated:** [1/22/25]

A modern web application built with React, Vite, and Chakra UI. This application integrates with various services including Azure AD (MSAL), AWS, and Nylas for a comprehensive meeting management solution.

[![Netlify Status](https://api.netlify.com/api/v1/badges/c4c5f338-4447-4cde-966f-a3c9720f17e8/deploy-status)](https://app.netlify.com/sites/foraday/deploys)

## 🚀 Quick Start

1. **Install Dependencies**

   ```bash
   npm install
   ```

2. **Start Development Server**

   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 📜 Available Scripts

### Development

- `npm run dev` - Start development server with hot reload
- `npm run dev:as-prod` - Run development server using production configuration
- `npm run dev:netlify` - Run development server with Netlify edge functions
- `npm run preview` - Preview the production build locally

### Building

- `npm run build` - Create production build
- `npm run gen:theme-typings` - Generate Chakra UI theme TypeScript definitions

## Testing

The test suite can be run via the following command:

`npm run test`

You can run just a single test file using this command:

`npm run test path/to/test/file`

or if you'd like to run just one test can you use this:

`npx vitest path/to/test/file --testNamePattern="renders the menu and lens tabs correctly" --run`

### E2E tests

- `npm run test:e2e` - Run end-to-end tests with Cypress in headless mode
- `npm run test-local:e2e` - Open Cypress Test Runner for e2e tests

### Code Coverage

The app now includes code coverage after the test suite is run. You can generate
a coverage report using the following command:

`npm run test-coverage`

and if you'd like to check the coverage of just 1 file, you can do:

`npx vitest --coverage --run --coverage.include=src/util/hooks/meeting.hooks.js`

#### Excluding files from coverage

The app now runs a github action to check the test coverage against updated files.
This could be problematic for certain files that have no coverage currently and
are difficult to test. For the time being, we can exclude those files in our
vite.config.js file, for ex:

```
test: {
   coverage: {
      exclude: ['node_modules', 'tests', 'your/path/here']
   }
}
```

### Code Quality

- `npm run lint` - Run ESLint in quiet mode
- `npm run lint:fix` - Run ESLint and fix auto-fixable issues
- `npm run lint:full` - Run ESLint with detailed output
- `npm run lint:strict` - Run ESLint with zero warnings allowed
- `npm run pretty` - Format code using Prettier

### Release Management

- `npm run release:dev` - Create a development release with changelog
- `npm run release:prod` - Create a production release with changelog
- `npm run print-sonar-url` - Print SonarQube analysis URL

## 🔄 Git Workflow

### Branch Naming Convention

Branches should follow the pattern: `FORA-[NUMBER]-description`
Example: `FORA-1234-add-calendar-integration`

### Commit Messages

Ideally use conventional commits. This is not mandatory. Format: `type(scope): description`
Examples:

- `feat(calendar): add meeting creation`
- `fix(auth): resolve MSAL token refresh`
- `chore(deps): update dependencies`

### Release Process

1. Create feature branch from `dev`
2. Make changes and push
3. Create PR to `dev`
4. After merge, automated workflow:
   - Updates version
   - Generates changelog
   - Creates git tag
   - Pushes changes back to `dev`

## 🔒 Environment Variables

Required environment variables:

- `VITE_MSAL_CLIENT_ID` - Azure AD Client ID
- `VITE_MSAL_TENANT_ID` - Azure AD Tenant ID
- `VITE_API_URL` - Backend API URL
- `JIRA_TOKEN` - For changelog generation
- `GITHUB_TOKEN` - For GitHub operations

## 📚 Documentation

- [MSAL Integration](documentation/msal.md)
- [Teams Integration](documentation/teams.md)
- [Pusher Integration](https://www.figma.com/board/bz5zKSzezOnHkgJh3kal4c/Frontend-Eng-Diagrams?node-id=0-1)

## 🛠 Tech Stack

- React with Vite
- Chakra UI for components
- MSAL for authentication
- AWS SDK for cloud services
- Nylas for email integration
- Cypress for E2E testing
- Vitest for unit testing
- ESLint + Prettier for code quality
- Husky for git hooks
- release-it for version management

## 🚀 Deployment

Deployment is handled automatically by Netlify:

1. Push to `dev` triggers development deployment
2. Push to `main` triggers production deployment

## 🤝 Contributing

1. Follow branch naming convention
2. Ensure tests pass (`npm run test`)
3. Ensure linting passes (`npm run lint:strict`)
4. Create PR with conventional commit style title
5. Get approval from at least one reviewer
