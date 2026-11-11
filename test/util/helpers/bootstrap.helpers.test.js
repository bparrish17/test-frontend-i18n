/**
 * @fileoverview Tests for bootstrap helper functions from `src/util/helpers/bootstrap.helpers.js`.
 * This suite validates the application initialization and configuration functions
 * that set up core services like Axios, service workers, authentication clients,
 * and error reporting, including Rollbar transformations and Statsig user object construction.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OktaAuth } from '@okta/okta-auth-js';
import {
  bootstrapServiceWorker,
  bootstrapAxios,
  bootstrapPWA,
  bootstrapMsalPCA,
  bootstrapRandomPulseImages,
  initializeOktaAuth,
  buildStatsigUser,
  rollbarConfig,
  getSimplifiedGatesFromStore,
  removeStatsigClient,
  generateAuthHeader,
  sanitizeValue
} from '@util/helpers/bootstrap.helpers.js';
import OneSignal from 'react-onesignal';
import axios from 'axios';
import store from 'storejs';
import { PublicClientApplication } from '@azure/msal-browser';
import { useFeatureGatesStore } from '@store/feature-gates.store';

vi.mock('@okta/okta-auth-js', () => {
  return {
    OktaAuth: vi.fn()
  };
});

// Mock dependencies
vi.mock('react-onesignal', () => ({
  default: {
    init: vi.fn().mockResolvedValue(undefined)
  }
}));

vi.mock('axios', () => ({
  default: {
    defaults: {
      baseURL: ''
    },
    interceptors: {
      request: {
        use: vi.fn()
      },
      response: {
        use: vi.fn()
      }
    },
    get: vi.fn()
  }
}));

vi.mock('storejs', () => ({
  default: {
    get: vi.fn(),
    remove: vi.fn()
  }
}));

vi.mock('@azure/msal-browser', () => ({
  PublicClientApplication: vi.fn(() => ({
    setNavigationClient: vi.fn()
  })),
  NavigationClient: vi.fn()
}));

vi.mock('@store/feature-gates.store', () => ({
  // Provide a basic mock function initially
  useFeatureGatesStore: vi.fn()
}));

// Mock build info correctly with default export
vi.mock('@root/build-helpers/build-info.json', () => ({
  default: {
    Version: 'test-version',
    Branch: 'test-branch',
    BuildDate: 'test-date',
    BuildTime: 'test-time'
  }
}));

// Mock import.meta.env
vi.mock(
  'virtual:env',
  () => ({
    default: {
      DEV: true,
      VITE_FORA_BACKEND_API: 'http://localhost:3000',
      VITE_LAMBDA_API: 'http://localhost:4000'
    }
  }),
  { virtual: true }
);

/**
 * Mock MSAL configuration for testing
 */
const mockMsalConfig = {
  auth: {
    clientId: 'test-client-id',
    authority: 'test-authority',
    redirectUri: 'test-redirect-uri'
  },
  cache: {
    cacheLocation: 'sessionStorage'
  }
};

vi.mock('@util/constants', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    MICROSOFT_AUTH_APP_CONFIG: () => mockMsalConfig
  };
});

/**
 * Test suite for the `bootstrapServiceWorker` helper function.
 * Validates OneSignal service worker registration and initialization in dev and prod modes,
 * and error handling during registration failure.
 */
describe('bootstrapServiceWorker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    Object.defineProperty(window, 'navigator', {
      value: {
        serviceWorker: {
          register: vi.fn().mockResolvedValue({})
        }
      },
      writable: true
    });
    // Reset console.error mock before each test
    console.error = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should register the service worker and initialize OneSignal in development mode', async () => {
    const isDev = true;
    const OS_LOCAL_ID = 'local-id';
    const OS_PROD_ID = 'prod-id';

    bootstrapServiceWorker(isDev, OS_LOCAL_ID, OS_PROD_ID);

    // Trigger the load event
    window.dispatchEvent(new Event('load'));

    // Wait for promises to resolve
    await vi.runAllTimersAsync();

    expect(window.navigator.serviceWorker.register).toHaveBeenCalledWith('/OneSignalSDKWorker.js', {
      scope: '/'
    });
    expect(OneSignal.init).toHaveBeenCalledWith({
      appId: OS_LOCAL_ID,
      notifyButton: { enable: false },
      allowLocalhostAsSecureOrigin: isDev
    });
  });

  it('should register the service worker and initialize OneSignal in production mode', async () => {
    const isDev = false;
    const OS_LOCAL_ID = 'local-id';
    const OS_PROD_ID = 'prod-id';

    bootstrapServiceWorker(isDev, OS_LOCAL_ID, OS_PROD_ID);

    // Trigger the load event
    window.dispatchEvent(new Event('load'));

    // Wait for promises to resolve
    await vi.runAllTimersAsync();

    expect(window.navigator.serviceWorker.register).toHaveBeenCalledWith('/OneSignalSDKWorker.js', {
      scope: '/'
    });
    expect(OneSignal.init).toHaveBeenCalledWith({
      appId: OS_PROD_ID,
      notifyButton: { enable: false },
      allowLocalhostAsSecureOrigin: isDev
    });
  });

  it('should log an error if service worker registration fails', async () => {
    const isDev = true;
    const OS_LOCAL_ID = 'local-id';
    const OS_PROD_ID = 'prod-id';
    const error = new Error('Registration failed');

    // Mock the registration to fail
    window.navigator.serviceWorker.register.mockRejectedValueOnce(error);

    bootstrapServiceWorker(isDev, OS_LOCAL_ID, OS_PROD_ID);

    // Trigger the load event
    window.dispatchEvent(new Event('load'));

    // Wait for promises to resolve
    await vi.runAllTimersAsync();

    expect(console.error).toHaveBeenCalledWith('Service Worker registration failed:', error);
  });
});

describe('generateAuthHeader', () => {
  const expected = { 'X-Fora-Key': '1234' };

  it(`should return an 'X-Fora-Key' header for most requests`, () => {
    expect(generateAuthHeader('1234', { url: 'initiatives/search' })).toEqual(expected);
    expect(generateAuthHeader('1234', { url: 'meetings/search' })).toEqual(expected);
    expect(generateAuthHeader('1234', { url: 'cards/123456' })).toEqual(expected);
    expect(generateAuthHeader('1234', { url: 'people/123456' })).toEqual(expected);
  });

  it(`should return an 'X-Fora-Key' header for Lambda requests`, () => {
    expect(generateAuthHeader('1234', { url: import.meta.env.VITE_LAMBDA_API })).toEqual(expected);
  });

  test.each([['people/authenticate'], ['oauth/google'], ['oauth/microsoft'], ['oauth/okta']])(
    "should NOT return an 'X-Fora-Key' header for %s request",
    (url) => {
      expect(generateAuthHeader('1234', { url })).toEqual({});
    }
  );

  it(`should NOT return an 'X-Fora-Key' header for non-https requests`, () => {
    expect(generateAuthHeader('1234', { url: 'http://www.addictinggames.com' })).toEqual({});
  });
});

/**
 * Test suite for the `bootstrapAxios` helper function.
 * Validates Axios default baseURL setup for different environments and interceptor behavior,
 * including auth header injection and 403 error handling.
 */
describe('bootstrapAxios', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset axios defaults
    axios.defaults.baseURL = '';

    // Mock window.location
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://app.fora.day', assign: vi.fn() },
      writable: true,
      configurable: true
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should set the correct baseURL in development mode', () => {
    const mockEnv = {
      DEV: true,
      VITE_FORA_BACKEND_API: 'http://localhost:3000',
      VITE_LAMBDA_API: 'http://localhost:4000'
    };
    bootstrapAxios(mockEnv);
    expect(axios.defaults.baseURL).toBe('http://localhost:3000');
  });

  it('should set the correct baseURL in production mode', () => {
    const mockEnv = {
      DEV: false,
      VITE_FORA_BACKEND_API: 'http://localhost:3000',
      VITE_LAMBDA_API: 'http://localhost:4000'
    };
    bootstrapAxios(mockEnv);
    expect(axios.defaults.baseURL).toBe('https://app.fora.day/api/');
  });

  it('should add auth header for lambda requests when sessionID exists', () => {
    const mockSessionId = 'test-session-id';
    store.get.mockReturnValue(mockSessionId);

    bootstrapAxios();

    const requestInterceptor = axios.interceptors.request.use.mock.calls[0][0];
    const config = {
      baseURL: 'http://localhost:4000/api/',
      url: 'test',
      headers: {}
    };

    const result = requestInterceptor(config);
    expect(result.headers['X-Fora-Key']).toBe(mockSessionId);
  });

  it('should handle 403 errors by clearing session data', async () => {
    bootstrapAxios();

    const responseInterceptor = axios.interceptors.response.use.mock.calls[0][1];
    const error = {
      response: {
        status: 403
      }
    };

    await expect(responseInterceptor(error)).rejects.toBe(error);
    expect(store.remove).toHaveBeenCalledWith('sessionID');
    expect(store.remove).toHaveBeenCalledWith('session');
    expect(store.remove).toHaveBeenCalledWith('Bearer');

    expect(window.location.assign).toHaveBeenCalledWith(`${window.location.origin}/login`);
  });
});

/**
 * Test suite for the `bootstrapPWA` helper function.
 * Validates PWA-specific setups like context menu prevention and persistent storage requests.
 */
describe('bootstrapPWA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    console.log = vi.fn();
    console.warn = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should disable right click', () => {
    const preventDefault = vi.fn();
    const mockEvent = { preventDefault };

    document.addEventListener = vi.fn((event, callback) => {
      if (event === 'contextmenu') {
        callback(mockEvent);
      }
    });

    bootstrapPWA();
    expect(preventDefault).toHaveBeenCalled();
  });

  it('should request and log persistent storage status when supported', async () => {
    const mockPersist = vi.fn().mockResolvedValue(true);
    Object.defineProperty(window, 'navigator', {
      value: {
        storage: {
          persist: mockPersist
        }
      },
      writable: true
    });

    await bootstrapPWA();

    expect(mockPersist).toHaveBeenCalled();
    expect(console.log).toHaveBeenCalledWith('Persistent storage granted');
  });

  it('should warn when persistent storage is not supported', async () => {
    Object.defineProperty(window, 'navigator', {
      value: {},
      writable: true
    });

    await bootstrapPWA();

    expect(console.warn).toHaveBeenCalledWith('Persistent storage API not supported');
  });
});

/**
 * Test suite for the `bootstrapMsalPCA` helper function.
 * Validates the creation and configuration of the MSAL PublicClientApplication instance.
 */
describe('bootstrapMsalPCA', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create PCA with default tenant ID', () => {
    const result = bootstrapMsalPCA(mockNavigate);

    expect(PublicClientApplication).toHaveBeenCalledWith(mockMsalConfig);
    expect(result.setNavigationClient).toHaveBeenCalled();
  });

  it('should create PCA with custom tenant ID', () => {
    const customTenantId = 'custom-tenant';
    const result = bootstrapMsalPCA(mockNavigate, customTenantId);

    expect(PublicClientApplication).toHaveBeenCalledWith(mockMsalConfig);
    expect(result.setNavigationClient).toHaveBeenCalled();
  });
});

/**
 * Test suite for the `bootstrapRandomPulseImages` helper function.
 * Validates the preloading and caching of random images.
 */
describe('bootstrapRandomPulseImages', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should fetch and cache random images', async () => {
    const mockResponse = {
      request: {
        responseURL: 'https://example.com/image.jpg'
      }
    };
    axios.get.mockResolvedValue(mockResponse);

    await bootstrapRandomPulseImages();

    expect(axios.get).toHaveBeenCalledTimes(20);
    expect(axios.get.mock.calls[0][1]).toEqual({ maxRedirects: 0 });
  });

  it('should handle 302 redirects when loading images', async () => {
    const mockError = {
      response: {
        status: 302,
        headers: {
          location: 'https://example.com/redirected-image.jpg'
        }
      }
    };
    axios.get.mockRejectedValue(mockError);

    await bootstrapRandomPulseImages();

    expect(axios.get).toHaveBeenCalledTimes(20);
  });
});

/**
 * Test suite for the `initializeOktaAuth` helper function.
 * Validates the correct initialization of the OktaAuth client.
 */
describe('initializeOktaAuth', () => {
  beforeEach(() => {
    OktaAuth.mockReset();
  });

  it('should initialize OktaAuth with the provided configuration', () => {
    const oktaConfig = {
      clientId: 'example-client-id',
      issuer: 'https://example.okta.com/oauth2/default'
    };

    initializeOktaAuth(oktaConfig);

    expect(OktaAuth).toHaveBeenCalledTimes(1);
    expect(OktaAuth).toHaveBeenCalledWith({
      ...oktaConfig,
      redirectUri: import.meta.env.VITE_OKTA_REDIRECT_URI,
      scopes: ['openid', 'profile', 'email']
    });
  });

  it('should allow to override default configuration', () => {
    const oktaConfig = {
      clientId: 'example-client-id',
      issuer: 'https://example.okta.com/oauth2/default',
      redirectUri: 'https://some-other-redirect.com',
      scopes: ['different', 'scopes']
    };

    // Call the function
    initializeOktaAuth(oktaConfig);

    // Assert that OktaAuth was called with the correct merged config
    expect(OktaAuth).toHaveBeenCalledTimes(1);
    expect(OktaAuth).toHaveBeenCalledWith({
      clientId: 'example-client-id',
      issuer: 'https://example.okta.com/oauth2/default',
      redirectUri: 'https://some-other-redirect.com',
      scopes: ['different', 'scopes']
    });
  });
});

/**
 * Test suite for the `buildStatsigUser` helper function.
 * Validates the construction of the Statsig user object for different user types (logged out, guest, regular).
 */
describe('buildStatsigUser', () => {
  it('should handle logged out users (null/undefined user)', () => {
    const result = buildStatsigUser(null);
    expect(result.userID.indexOf('LOGGED_OUT-')).toBeGreaterThan(-1);
  });

  it('should handle guest users', () => {
    const guestUser = {
      isGuest: true,
      id: 'guest-123',
      email: 'guest@example.com'
    };

    const result = buildStatsigUser(guestUser);
    expect(result).toEqual({
      userID: 'guest-123',
      email: 'guest@example.com',
      custom: {
        tenant: 'guest',
        isGuest: true
      }
    });
  });

  it('should handle regular users with all fields', () => {
    const regularUser = {
      id: 'user-123',
      email: 'user@example.com',
      name: 'Test User',
      tenants: [{ name: 'acme' }],
      role: 'admin',
      preferences: { theme: 'dark' },
      nylas_account_id: 'nylas-123',
      apollo_profile: 'apollo-123'
    };

    const result = buildStatsigUser(regularUser);
    expect(result).toEqual({
      userID: 'user-123',
      email: 'user@example.com',
      name: 'Test User',
      custom: {
        tenant: 'acme',
        role: 'admin',
        preferences: { theme: 'dark' }
      }
    });
  });

  it('should handle minimal regular user data', () => {
    const minimalUser = {
      id: 'user-456',
      tenants: [{ name: 'simple' }]
    };

    const result = buildStatsigUser(minimalUser);
    expect(result).toEqual({
      userID: 'user-456',
      custom: {
        tenant: 'simple'
      }
    });
  });
});

describe('removeStatsigClient', () => {
  it('should do nothing if payload.custom is not defined', () => {
    const payload = {};
    const result = removeStatsigClient(payload);
    expect(result).toEqual({ custom: {} });
  });

  it('should remove statsigClient from componentProps', () => {
    const payload = {
      custom: {
        componentProps: {
          statsigClient: 'some-client',
          otherProp: true
        }
      }
    };
    const result = removeStatsigClient(payload);
    expect(result.custom.componentProps.statsigClient).toBeUndefined();
    expect(result.custom.componentProps.otherProp).toBe(true);
  });

  it('should remove statsigClient from other custom keys', () => {
    const payload = {
      custom: {
        componentProps: {},
        anotherKey: {
          statsigClient: 'client-value',
          other: 123
        }
      }
    };
    const result = removeStatsigClient(payload);
    expect(result.custom.anotherKey.statsigClient).toBeUndefined();
    expect(result.custom.anotherKey.other).toBe(123);
  });

  it('should remove statsigClient from extraArgs and delete extraArgs', () => {
    const payload = {
      custom: {
        extraArgs: {
          a: { statsigClient: 'clientA' },
          b: { value: 5, statsigClient: 'clientB' }
        }
      }
    };
    const result = removeStatsigClient(payload);
    expect(result.custom.extraArgs).toBeUndefined();
  });
});

/**
 * Test suite for the `transform` function within the `rollbarConfig` object.
 * This suite validates the various data transformations applied to the Rollbar payload
 * before it is sent, such as adding build info, sanitizing data, removing sensitive information,
 * truncating long strings, and deduplicating telemetry.
 */
describe('bootstrap.helpers', () => {
  describe('rollbarConfig.transform', () => {
    /**
     * Mocks window.location before each test in this suite.
     */
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { hostname: 'localhost' },
        writable: true,
        configurable: true
      });
    });

    /**
     * Resets the window.location mock after each test in this suite.
     */
    afterEach(() => {
      Object.defineProperty(window, 'location', {
        value: undefined,
        writable: true,
        configurable: true
      });
    });

    it('should add buildInfo and extraArgs to payload', () => {
      const payload = {
        custom: {
          extraArgs: {
            0: {
              someData: 'value'
            }
          }
        },
        body: { trace: { extra: {} } }
      };

      const transformed = rollbarConfig.transform(payload);

      expect(transformed.custom.buildInfo).toBeDefined();
      expect(transformed.custom.someData).toBe('value');
    });

    it('should remove statsigClient properties', () => {
      const payload = {
        custom: {
          componentProps: {
            statsigClient: {
              someProperty: 'value',
              anotherProperty: 'value2'
            }
          }
        },
        body: { trace: { extra: {} } }
      };

      const transformed = rollbarConfig.transform(payload);

      expect(transformed.custom.componentProps.statsigClient).toBeUndefined();
    });

    it('should remove duplicate context keys from body.trace.extra', () => {
      const payload = {
        custom: {
          key1: 'value1',
          key2: 'value2',
          featureFlags: { someFlag: true }
        },
        body: {
          trace: {
            extra: {
              key1: 'duplicateValue1',
              key2: 'duplicateValue2',
              featureFlags: { someFlag: true },
              onlyInExtra: 'extraValue'
            }
          }
        }
      };

      const transformed = rollbarConfig.transform(payload);

      if (transformed.body && transformed.body.trace && transformed.body.trace.extra) {
        expect(transformed.body.trace.extra.key1).toBeUndefined();
        expect(transformed.body.trace.extra.key2).toBeUndefined();
        expect(transformed.body.trace.extra.featureFlags).toBeUndefined();
        expect(transformed.body.trace.extra.onlyInExtra).toBe('extraValue');
      } else {
        expect(transformed.body?.trace?.extra).toBeDefined();
        expect(transformed.body?.trace?.extra?.key1).toBeUndefined();
        expect(transformed.body?.trace?.extra?.key2).toBeUndefined();
        expect(transformed.body?.trace?.extra?.featureFlags).toBeUndefined();
        expect(transformed.body?.trace?.extra?.onlyInExtra).toBe('extraValue');
      }
    });

    it('should correctly remove all duplicate keys and the extra object if it becomes empty', () => {
      const payload = {
        custom: {
          key1: 'value1',
          key2: 'value2'
        },
        body: {
          trace: {
            extra: {
              key1: 'duplicateValue1',
              key2: 'duplicateValue2'
            }
          }
        }
      };
      const transformed = rollbarConfig.transform(payload);
      expect(transformed.body?.trace?.extra).toBeUndefined();
    });

    it('should truncate long componentStack strings', () => {
      const longStack = 'a'.repeat(500);
      const payload = {
        custom: {
          componentStack: longStack
        },
        body: { trace: { extra: {} } }
      };

      const transformed = rollbarConfig.transform(payload);

      expect(transformed.custom.componentStack.length).toBeLessThan(500);
      expect(transformed.custom.componentStack).toContain('... (truncated)');
    });

    it('should deduplicate telemetry entries', () => {
      const payload = {
        custom: {},
        body: {
          telemetry: [
            { type: 'error', body: { message: 'Error 1', stack: 'stack1\nline2\nline3' } },
            { type: 'error', body: { message: 'Error 1', stack: 'stack1\nline2\nline3' } },
            { type: 'error', body: { message: 'Error 2', stack: 'stack2\nline2\nline3' } },
            { type: 'error', body: { message: 'Error 2', stack: 'stack2\nline2\nline3' } },
            { type: 'error', body: { message: 'Error 3', stack: 'stack3\nline2\nline3' } }
          ],
          trace: { extra: {} }
        }
      };

      const transformed = rollbarConfig.transform(payload);

      expect(transformed.body.telemetry).toHaveLength(3);
    });

    it('should handle missing or undefined properties gracefully', () => {
      const payload = {
        custom: undefined,
        body: undefined
      };

      const transformed = rollbarConfig.transform(payload);

      expect(transformed).toBeDefined();
      expect(transformed.custom).toBeDefined();
      expect(transformed.custom.buildInfo).toBeDefined();
    });
  });
});

const REDACTED_PLACEHOLDER = '[REDACTED]';
const MAX_VALUE_LENGTH = 2048; // Use actual value if different
const SENSITIVE_KEYS = [
  'password',
  'token',
  'secret',
  'apikey',
  'api_key',
  'auth',
  'authorization',
  'cookie',
  'set-cookie',
  'email',
  'creditcard',
  'credit_card',
  'ccnum',
  'cvv',
  'ssn'
];

describe('sanitizeValue', () => {
  it('should return value as-is if null or non-object', () => {
    expect(sanitizeValue(null)).toBe(null);
    expect(sanitizeValue(123)).toBe(123);
    expect(sanitizeValue(true)).toBe(true);
  });

  it('should redact emails in strings', () => {
    const input = 'Contact me at hello@example.com';
    const output = sanitizeValue(input);
    expect(output).toBe(`Contact me at ${REDACTED_PLACEHOLDER}`);
  });

  it('should truncate long strings', () => {
    const longString = 'a'.repeat(MAX_VALUE_LENGTH + 10);
    const output = sanitizeValue(longString);
    expect(output).toBe('a'.repeat(MAX_VALUE_LENGTH) + '...[TRUNCATED]');
  });

  it('should redact sensitive keys in objects', () => {
    const input = {
      password: 'mypassword',
      email: 'john@example.com'
    };
    const output = sanitizeValue(input);
    expect(output.password).toBe(REDACTED_PLACEHOLDER);
    expect(output.email).toBe(REDACTED_PLACEHOLDER);
  });

  it('should sanitize nested objects and arrays', () => {
    const input = {
      user: {
        email: 'jane@company.com',
        profile: {
          token: 'abc123'
        },
        tags: ['contact@foo.com', 'safeString']
      }
    };
    const output = sanitizeValue(input);
    expect(output.user.email).toContain(REDACTED_PLACEHOLDER);
    expect(output.user.profile.token).toBe(REDACTED_PLACEHOLDER);
    expect(output.user.tags[0]).toBe(REDACTED_PLACEHOLDER);
    expect(output.user.tags[1]).toBe('safeString');
  });

  it('should handle circular references', () => {
    const obj = { name: 'test' };
    obj.self = obj;
    const output = sanitizeValue(obj);
    expect(output.self).toBe('[CIRCULAR_REFERENCE]');
  });

  it('should handle arrays of objects with sensitive data', () => {
    const input = [{ password: '1234' }, { token: 'abcd' }, { email: 'user@domain.com' }];
    const output = sanitizeValue(input);
    expect(output[0].password).toBe(REDACTED_PLACEHOLDER);
    expect(output[1].token).toBe(REDACTED_PLACEHOLDER);
    expect(output[2].email).toContain(REDACTED_PLACEHOLDER);
  });
});
