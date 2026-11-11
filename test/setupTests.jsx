import '@testing-library/jest-dom';
import { afterAll, beforeAll, vi } from 'vitest';
import timezoneMock from 'timezone-mock';
import { server } from './mocks/node';
import '@src/i18n';

// Mock window.matchMedia for Chakra UI
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn()
  }))
});

// Setup ENV variables
process.env.VITE_MICROSOFT_CLIENT_ID = 'test-client-id';
process.env.NODE_ENV = 'test';
process.env.VITE_LAMBDA_API = 'https://test.execute-api.us-east-1.amazonaws.com/dev';
process.env.VITE_PUSHER_APP_KEY = 'test';
process.env.VITE_OKTA_CLIENT_ID = 'test-client-id';
process.env.VITE_OKTA_ISSUER = 'https://dev.okta.com';
process.env.VITE_OKTA_REDIRECT_URI = 'https://localhost:5173/callback/okta';
process.env.VITE_OKTA_APOLLO_CLIENT_ID = 'apollo-1';
process.env.VITE_OKTA_APOLLO_ISSUER = 'https://apollo.okta.com';
process.env.VITE_OKTA_FORA_CLIENT_ID = 'fora-1';
process.env.VITE_OKTA_FORA_ISSUER = 'https://fora.okta.com';
process.env.TZ = 'America/New_York';

process.env.VITE_OKTA_SKULLCANDY_CLIENT_ID = 'skull-1';
process.env.VITE_OKTA_SKULLCANDY_ISSUER = 'https://skullcandy.okta.com';

process.env.VITE_OKTA_PARACHUTE_CLIENT_ID = 'parachute-1';
process.env.VITE_OKTA_PARACHUTE_ISSUER = 'https://parachutehealth.okta.com';

process.env.VITE_SALESFORCE_REDIRECT_URI = 'https://myapp.com/oauth/callback';
process.env.VITE_SALESFORCE_CONSUMER_KEY = 'my-consumer-key';

process.env.VITE_RC_CLIENT_ID = 'ring-central-client-id';

vi.mock('rollbar', {
  default: () => {
    return {
      error: vi.fn()
    };
  }
});

vi.mock('@rollbar/react', {
  useRollbar: () => {
    return {
      error: vi.fn()
    };
  }
});

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMediaQuery: () => [[true], [false]],
    Skeleton: ({ children }) => <div data-testid='mock-skeleton'>{children}</div>,
    SkeletonCircle: ({ children }) => <div data-testid='mock-skeleton-circle'>{children}</div>,
    SkeletonText: ({ children }) => <div data-testid='mock-skeleton-text'>{children}</div>
  };
});

vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: vi.fn().mockReturnValue({
    checkGate: () => true
  })
}));

vi.mock('lottie-react', () => ({
  __esModule: true,
  default: () => <div data-testid='lottie-animation'>Lottie Animation</div>
}));

// Mock build-info.json for tests since it's only generated during build
vi.mock('@root/build-helpers/build-info.json', () => ({
  default: {
    Name: 'test-app',
    Version: '1.0.0',
    Branch: 'test-branch',
    'Build Date': '2024-01-01',
    'Build Time': '12:00:00',
    'Commit Hash': 'abc123',
    featureFlagUsage: []
  }
}));

beforeAll(() => server.listen());

beforeEach(() => {
  timezoneMock.register('UTC');
});

afterEach(() => {
  timezoneMock.unregister();
  server.resetHandlers();
});

afterAll(() => server.close());

if (!HTMLElement.prototype.scrollTo) {
  HTMLElement.prototype.scrollTo = () => {};
}
