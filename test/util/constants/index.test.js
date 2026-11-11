import {
  MICROSOFT_AUTH_APP_CONFIG,
  userTypeOptions,
  OKTA_CONFIG,
  RECALL_STATUS_CODE_MAP
} from '@util/constants';

describe('MICROSOFT_AUTH_APP_CONFIG', () => {
  beforeEach(() => {
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      writable: true,
      value: { origin: 'https://production-site.com' }
    });
  });

  test('returns correct config in development environment', () => {
    // Set DEV to true to simulate development environment
    import.meta.env.DEV = true;

    const config = MICROSOFT_AUTH_APP_CONFIG();

    expect(config.auth.clientId).toBe('test-client-id');
    expect(config.auth.authority).toBe('https://login.microsoftonline.com/common');
    expect(config.auth.redirectUri).toBe('http://localhost:5173/callback/teams');
  });

  test('returns correct config in production environment', () => {
    // Set DEV to false to simulate production environment
    import.meta.env.DEV = false;

    const config = MICROSOFT_AUTH_APP_CONFIG();

    expect(config.auth.clientId).toBe('test-client-id');
    expect(config.auth.authority).toBe('https://login.microsoftonline.com/common');
    expect(config.auth.redirectUri).toBe('https://production-site.com/callback/teams');
  });

  test('uses provided microsoftTenantId in authority URL', () => {
    const tenantId = 'custom-tenant-id';
    const config = MICROSOFT_AUTH_APP_CONFIG(tenantId);

    expect(config.auth.authority).toBe(`https://login.microsoftonline.com/${tenantId}`);
  });
});

describe('userTypeOptions', () => {
  it('should correctly convert values into option objects', () => {
    const expectedOptions = [
      { value: 'Full', label: 'Full', text: 'Full' },
      { value: 'Executive', label: 'Executive', text: 'Executive' },
      { value: 'Admin', label: 'Admin', text: 'Admin' }
    ];

    expect(userTypeOptions).toEqual(expectedOptions);
  });

  it('should include exactly three options', () => {
    expect(userTypeOptions).toHaveLength(3);
  });

  it('should have unique values for each option', () => {
    const values = userTypeOptions.map((option) => option.value);
    const uniqueValues = new Set(values);

    expect(uniqueValues.size).toBe(userTypeOptions.length);
  });
});

describe('OKTA_CONFIG', () => {
  it('should return config', () => {
    expect(OKTA_CONFIG.clientId).toEqual(import.meta.env.VITE_OKTA_CLIENT_ID);
    expect(OKTA_CONFIG.issuer).toEqual(import.meta.env.VITE_OKTA_ISSUER);
    expect(OKTA_CONFIG.redirectUri).toEqual(import.meta.env.VITE_OKTA_REDIRECT_URI);
    expect(OKTA_CONFIG.scopes).toEqual(['openid', 'profile', 'email']);
  });
});

describe('RECALL_STATUS_CODE_MAP', () => {
  test('should be an object', () => {
    expect(typeof RECALL_STATUS_CODE_MAP).toBe('object');
  });

  test('should have correct mappings', () => {
    const testCases = [
      ['zoom_local_recording_disabled', 'Zoom Local Recording must be enabled'],
      ['zoom_local_recording_request_disabled', 'Recording requests are disabled by the host'],
      [
        'zoom_bot_in_waiting_room',
        'The bot was unable to join the meeting and was in the waiting room'
      ],
      ['bot_kicked_from_call', 'FORA was removed from the call by the host'],
      ['meeting_not_found', 'No meeting found at the provided link'],
      [
        'zoom_sdk_credentials_missing',
        'FORA could not join this meeting. FORA team has been notified'
      ],
      ['zoom_internal_error', 'Internal Zoom error'],
      [
        'microsoft_teams_call_dropped',
        "FORA was disconnected from MS Teams and couldn't reconnect"
      ],
      ['webex_join_meeting_error', 'FORA could not join this meeting. FORA team has been notified'],
      ['call_ended_by_host', 'FORA was unable to summarize due to lack of content'],
      [
        'timeout_exceeded_only_bots_detected_using_participant_names',
        'FORA was unable to summarize due to lack of content'
      ]
    ];

    testCases.forEach(([key, expectedValue]) => {
      expect(RECALL_STATUS_CODE_MAP[key]).toBe(expectedValue);
    });
  });

  test('should return undefined for unknown keys', () => {
    expect(RECALL_STATUS_CODE_MAP.unknown_key).toEqual(undefined);
  });
});
