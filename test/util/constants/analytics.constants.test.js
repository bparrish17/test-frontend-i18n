import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  NAVIGATION_PATH_MAPPINGS,
  ICON_CLASS_MAPPINGS,
  ANALYTICS_ROUTES,
  ELEMENT_TYPE_MAPPINGS,
  TRACKABLE_ELEMENT_CHECKS,
  SEMANTIC_EVENT_NAMES,
  PROPERTY_MAPPINGS,
  DATA_ATTRIBUTE_SOURCES,
  TEXT_ATTRIBUTE_SOURCES
} from '@util/constants/analytics.constants';
import {
  analyticsLog,
  setAnalyticsLogLevel,
  getAnalyticsLogLevel,
  showAnalyticsLogLevels,
  getAnalyticsConfigForRoute
} from '@util/helpers/analytics.helpers';

describe('Analytics Constants', () => {
  // Mock console methods
  const originalConsole = global.console;
  const mockConsole = {
    log: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    group: vi.fn(),
    groupEnd: vi.fn()
  };

  beforeEach(() => {
    global.console = { ...originalConsole, ...mockConsole };
    // Reset log level to default for each test
    setAnalyticsLogLevel('ALL');
    vi.clearAllMocks();
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  describe('Dynamic Log Level Management', () => {
    it('should set and get log level successfully', () => {
      expect(setAnalyticsLogLevel('INFO')).toBe(true);
      expect(getAnalyticsLogLevel()).toBe('INFO');

      expect(setAnalyticsLogLevel('WARN')).toBe(true);
      expect(getAnalyticsLogLevel()).toBe('WARN');

      expect(setAnalyticsLogLevel('OFF')).toBe(true);
      expect(getAnalyticsLogLevel()).toBe('OFF');
    });

    it('should handle case-insensitive log level setting', () => {
      expect(setAnalyticsLogLevel('info')).toBe(true);
      expect(getAnalyticsLogLevel()).toBe('INFO');

      expect(setAnalyticsLogLevel('Warn')).toBe(true);
      expect(getAnalyticsLogLevel()).toBe('WARN');
    });

    it('should reject invalid log levels', () => {
      expect(setAnalyticsLogLevel('INVALID')).toBe(false);
      expect(getAnalyticsLogLevel()).toBe('ALL'); // Should remain unchanged

      expect(setAnalyticsLogLevel(null)).toBe(false);
      expect(setAnalyticsLogLevel(undefined)).toBe(false);
      expect(setAnalyticsLogLevel('')).toBe(false);
    });

    it('should log level changes', () => {
      setAnalyticsLogLevel('WARN');
      expect(mockConsole.log).toHaveBeenCalledWith(
        '[Analytics] Log level changed from "ALL" to "WARN"'
      );
    });

    it('should warn for invalid log levels', () => {
      setAnalyticsLogLevel('INVALID');
      expect(mockConsole.warn).toHaveBeenCalledWith(
        '[Analytics] Invalid log level: "INVALID". Valid levels are:',
        'ALL, INFO, WARN, OFF'
      );
    });

    it('should display log level information', () => {
      setAnalyticsLogLevel('INFO');
      showAnalyticsLogLevels();

      expect(mockConsole.group).toHaveBeenCalledWith('[Analytics] Log Level Information');
      expect(mockConsole.log).toHaveBeenCalledWith('Current level:', 'INFO');
      expect(mockConsole.log).toHaveBeenCalledWith('Available levels:', 'ALL, INFO, WARN, OFF');
      expect(mockConsole.log).toHaveBeenCalledWith('Usage: setAnalyticsLogLevel("LEVEL")');
      expect(mockConsole.groupEnd).toHaveBeenCalled();
    });
  });

  describe('analyticsLog with Dynamic Log Levels', () => {
    it('should respect ALL log level', () => {
      setAnalyticsLogLevel('ALL');
      analyticsLog('DEBUG', 'Test message');
      expect(mockConsole.log).toHaveBeenCalledWith('Test message');
    });

    it('should respect INFO log level', () => {
      setAnalyticsLogLevel('INFO');
      mockConsole.log.mockClear(); // Clear the log from setAnalyticsLogLevel

      analyticsLog('DEBUG', 'Debug message');
      expect(mockConsole.log).not.toHaveBeenCalledWith('Debug message');

      analyticsLog('INFO', 'Info message');
      expect(mockConsole.info).toHaveBeenCalledWith('Info message');

      analyticsLog('WARN', 'Warn message');
      expect(mockConsole.warn).toHaveBeenCalledWith('Warn message');
    });

    it('should respect WARN log level', () => {
      setAnalyticsLogLevel('WARN');
      mockConsole.log.mockClear(); // Clear the log from setAnalyticsLogLevel

      analyticsLog('DEBUG', 'Debug message');
      expect(mockConsole.log).not.toHaveBeenCalledWith('Debug message');

      analyticsLog('INFO', 'Info message');
      expect(mockConsole.info).not.toHaveBeenCalledWith('Info message');

      analyticsLog('WARN', 'Warn message');
      expect(mockConsole.warn).toHaveBeenCalledWith('Warn message');

      analyticsLog('ERROR', 'Error message');
      expect(mockConsole.error).toHaveBeenCalledWith('Error message');
    });

    it('should respect OFF log level', () => {
      setAnalyticsLogLevel('OFF');
      // Clear the mock call from setAnalyticsLogLevel itself
      mockConsole.log.mockClear();

      analyticsLog('DEBUG', 'Debug message');
      analyticsLog('INFO', 'Info message');
      analyticsLog('WARN', 'Warn message');
      analyticsLog('ERROR', 'Error message');

      expect(mockConsole.log).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.warn).not.toHaveBeenCalled();
      expect(mockConsole.error).not.toHaveBeenCalled();
    });
  });

  describe('Analytics Routes Configuration', () => {
    it('should return correct config for meeting routes', () => {
      const config = getAnalyticsConfigForRoute('/meeting/123');

      expect(config.autoTrack).toBe(true);
      expect(config.trackingConfig.captureTypes).toContain('clicks');
      expect(config.trackingConfig.ignoreSelectors).toContain('.navigation');
      expect(config.matchedPattern).toBe('/meeting/:meetingId');
    });

    it('should return correct config for earnings call routes', () => {
      const config = getAnalyticsConfigForRoute('/earnings-calls/456');

      expect(config.autoTrack).toBe(true);
      expect(config.trackingConfig.captureTypes).toContain('clicks');
      expect(config.trackingConfig.ignoreSelectors).toContain('.navigation');
      expect(config.matchedPattern).toBe('/earnings-calls/:botId');
    });

    it('should return correct config for insights routes', () => {
      const config = getAnalyticsConfigForRoute('/insights/789');

      expect(config.autoTrack).toBe(true);
      expect(config.trackingConfig.captureTypes).toContain('clicks');
      expect(config.trackingConfig.ignoreSelectors).toContain('.navigation');
      expect(config.matchedPattern).toBe('/insights/:insightId');
    });

    it('should disable tracking for settings routes', () => {
      const config = getAnalyticsConfigForRoute('/settings/account');

      expect(config.autoTrack).toBe(false);
      expect(config.matchedPattern).toBe('/settings/*');
    });

    it('should return default config for unmatched routes', () => {
      const config = getAnalyticsConfigForRoute('/some/unknown/route');

      expect(config.autoTrack).toBe(false);
      expect(config.matchedPattern).toBe(null);
    });

    it('should handle route parameters correctly', () => {
      const config1 = getAnalyticsConfigForRoute('/meeting/abc-123');
      const config2 = getAnalyticsConfigForRoute('/meeting/xyz-789');

      expect(config1.autoTrack).toBe(true);
      expect(config2.autoTrack).toBe(true);
      expect(config1.matchedPattern).toBe('/meeting/:meetingId');
      expect(config2.matchedPattern).toBe('/meeting/:meetingId');
    });

    it('should handle wildcard routes correctly', () => {
      const config1 = getAnalyticsConfigForRoute('/settings');
      const config2 = getAnalyticsConfigForRoute('/settings/account');
      const config3 = getAnalyticsConfigForRoute('/settings/security/advanced');

      expect(config1.autoTrack).toBe(false);
      expect(config2.autoTrack).toBe(false);
      expect(config3.autoTrack).toBe(false);
      expect(config1.matchedPattern).toBe('/settings/*');
      expect(config2.matchedPattern).toBe('/settings/*');
      expect(config3.matchedPattern).toBe('/settings/*');
    });

    it('should generate correct page names from patterns', () => {
      // Test the page name generation logic indirectly through route matching
      const meetingConfig = getAnalyticsConfigForRoute('/meeting/123');
      const earningsConfig = getAnalyticsConfigForRoute('/earnings-calls/456');
      const insightsConfig = getAnalyticsConfigForRoute('/insights/789');

      expect(meetingConfig.matchedPattern).toBe('/meeting/:meetingId');
      expect(earningsConfig.matchedPattern).toBe('/earnings-calls/:botId');
      expect(insightsConfig.matchedPattern).toBe('/insights/:insightId');
    });
  });

  describe('Analytics Logging Function', () => {
    it('should log all messages when level is ALL', () => {
      // Note: Default log level should be 'ALL'
      expect(getAnalyticsLogLevel()).toBe('ALL');
      mockConsole.log.mockClear(); // Clear any setup logs

      analyticsLog('DEBUG', 'Debug message', 'arg1', 'arg2');
      analyticsLog('INFO', 'Info message');
      analyticsLog('WARN', 'Warning message');
      analyticsLog('ERROR', 'Error message');

      // Check that appropriate console methods are called
      expect(mockConsole.log).toHaveBeenCalledWith('Debug message', 'arg1', 'arg2');
      expect(mockConsole.info).toHaveBeenCalledWith('Info message');
      expect(mockConsole.warn).toHaveBeenCalledWith('Warning message');
      expect(mockConsole.error).toHaveBeenCalledWith('Error message');
    });
  });

  describe('Mapping Constants', () => {
    describe('NAVIGATION_PATH_MAPPINGS', () => {
      it('should contain expected navigation mappings', () => {
        expect(NAVIGATION_PATH_MAPPINGS['/']).toBe('nav-home');
        expect(NAVIGATION_PATH_MAPPINGS['/home']).toBe('nav-home');
        expect(NAVIGATION_PATH_MAPPINGS['/dashboard']).toBe('nav-dashboard');
        expect(NAVIGATION_PATH_MAPPINGS['/meeting']).toBe('nav-meetings');
        expect(NAVIGATION_PATH_MAPPINGS['/settings']).toBe('nav-settings');
        expect(NAVIGATION_PATH_MAPPINGS['/contacts']).toBe('nav-contacts');
        expect(NAVIGATION_PATH_MAPPINGS['/insights']).toBe('nav-insights');
      });

      it('should be a non-empty object', () => {
        expect(typeof NAVIGATION_PATH_MAPPINGS).toBe('object');
        expect(Object.keys(NAVIGATION_PATH_MAPPINGS).length).toBeGreaterThan(0);
      });
    });

    describe('ICON_CLASS_MAPPINGS', () => {
      it('should contain expected SF icon mappings', () => {
        expect(ICON_CLASS_MAPPINGS.SFTrashIcon).toBe('delete');
        expect(ICON_CLASS_MAPPINGS.SFEllipsisIcon).toBe('overflow-menu');
        expect(ICON_CLASS_MAPPINGS.SFPlusCircleFilledIcon).toBe('add');
        expect(ICON_CLASS_MAPPINGS.SFShareIcon).toBe('share');
        expect(ICON_CLASS_MAPPINGS.SFPencilIcon).toBe('edit');
        expect(ICON_CLASS_MAPPINGS.SFHomeIcon).toBe('nav-home');
      });

      it('should contain expected generic icon mappings', () => {
        expect(ICON_CLASS_MAPPINGS.home).toBe('nav-home');
        expect(ICON_CLASS_MAPPINGS.calendar).toBe('nav-calendar');
        expect(ICON_CLASS_MAPPINGS.plus).toBe('add');
        expect(ICON_CLASS_MAPPINGS.trash).toBe('delete');
        expect(ICON_CLASS_MAPPINGS.edit).toBe('edit');
        expect(ICON_CLASS_MAPPINGS.share).toBe('share');
      });

      it('should be a non-empty object', () => {
        expect(typeof ICON_CLASS_MAPPINGS).toBe('object');
        expect(Object.keys(ICON_CLASS_MAPPINGS).length).toBeGreaterThan(0);
      });
    });

    describe('ELEMENT_TYPE_MAPPINGS', () => {
      it('should map HTML element types to event names', () => {
        expect(ELEMENT_TYPE_MAPPINGS.BUTTON).toBe('Button');
        expect(ELEMENT_TYPE_MAPPINGS.A).toBe('Link');
        expect(ELEMENT_TYPE_MAPPINGS.INPUT).toBe('Input');
        expect(ELEMENT_TYPE_MAPPINGS.FORM).toBe('Form');
        expect(ELEMENT_TYPE_MAPPINGS.SELECT).toBe('Select');
        expect(ELEMENT_TYPE_MAPPINGS.TEXTAREA).toBe('Textarea');
      });

      it('should be a non-empty object', () => {
        expect(typeof ELEMENT_TYPE_MAPPINGS).toBe('object');
        expect(Object.keys(ELEMENT_TYPE_MAPPINGS).length).toBeGreaterThan(0);
      });
    });
  });

  describe('Element Detection Configuration', () => {
    describe('TRACKABLE_ELEMENT_CHECKS', () => {
      it('should be an array of check objects', () => {
        expect(Array.isArray(TRACKABLE_ELEMENT_CHECKS)).toBe(true);
        expect(TRACKABLE_ELEMENT_CHECKS.length).toBeGreaterThan(0);
      });

      it('should have condition functions and descriptions', () => {
        TRACKABLE_ELEMENT_CHECKS.forEach((check) => {
          expect(typeof check.condition).toBe('function');
          expect(typeof check.description).toBe('string');
          expect(check.description.length).toBeGreaterThan(0);
        });
      });

      it('should correctly identify button elements', () => {
        const mockButtonElement = { tagName: 'BUTTON' };
        const buttonCheck = TRACKABLE_ELEMENT_CHECKS.find(
          (check) => check.description === 'BUTTON tag'
        );
        expect(buttonCheck.condition(mockButtonElement)).toBe(true);
      });

      it('should correctly identify link elements', () => {
        const mockLinkElement = { tagName: 'A' };
        const linkCheck = TRACKABLE_ELEMENT_CHECKS.find((check) => check.description === 'A tag');
        expect(linkCheck.condition(mockLinkElement)).toBe(true);
      });
    });

    describe('DATA_ATTRIBUTE_SOURCES', () => {
      it('should be an array of attribute source objects', () => {
        expect(Array.isArray(DATA_ATTRIBUTE_SOURCES)).toBe(true);
        expect(DATA_ATTRIBUTE_SOURCES.length).toBeGreaterThan(0);
      });

      it('should have attr and description properties', () => {
        DATA_ATTRIBUTE_SOURCES.forEach((source) => {
          expect(typeof source.attr).toBe('string');
          expect(typeof source.description).toBe('string');
          expect(source.attr.length).toBeGreaterThan(0);
          expect(source.description.length).toBeGreaterThan(0);
        });
      });

      it('should include expected data attributes', () => {
        const attrs = DATA_ATTRIBUTE_SOURCES.map((source) => source.attr);
        expect(attrs).toContain('data-action');
        expect(attrs).toContain('data-testid');
        expect(attrs).toContain('data-cy');
      });
    });

    describe('TEXT_ATTRIBUTE_SOURCES', () => {
      it('should be an array of text source objects', () => {
        expect(Array.isArray(TEXT_ATTRIBUTE_SOURCES)).toBe(true);
        expect(TEXT_ATTRIBUTE_SOURCES.length).toBeGreaterThan(0);
      });

      it('should have getter functions and descriptions', () => {
        TEXT_ATTRIBUTE_SOURCES.forEach((source) => {
          expect(typeof source.getter).toBe('function');
          expect(typeof source.description).toBe('string');
          expect(typeof source.priority).toBe('number');
          expect(source.description.length).toBeGreaterThan(0);
        });
      });

      it('should extract text content correctly', () => {
        const textSource = TEXT_ATTRIBUTE_SOURCES.find((source) => source.description === 'text');
        const mockElement = { textContent: '  Click me  ' };
        expect(textSource.getter(mockElement)).toBe('Click me');
      });
    });
  });

  describe('Event Name Constants', () => {
    describe('SEMANTIC_EVENT_NAMES', () => {
      it('should contain expected semantic event names', () => {
        expect(SEMANTIC_EVENT_NAMES.BUTTON_CLICKED).toBe('Button Clicked');
        expect(SEMANTIC_EVENT_NAMES.LINK_CLICKED).toBe('Link Clicked');
        expect(SEMANTIC_EVENT_NAMES.INPUT_CLICKED).toBe('Input Clicked');
        expect(SEMANTIC_EVENT_NAMES.ELEMENT_CLICKED).toBe('Element Clicked');
        expect(SEMANTIC_EVENT_NAMES.MENU_ITEM_CLICKED).toBe('Menu Item Clicked');
        expect(SEMANTIC_EVENT_NAMES.MODAL_OPENED).toBe('Modal Opened');
      });

      it('should be a non-empty object', () => {
        expect(typeof SEMANTIC_EVENT_NAMES).toBe('object');
        expect(Object.keys(SEMANTIC_EVENT_NAMES).length).toBeGreaterThan(0);
      });

      it('should use consistent naming pattern', () => {
        Object.values(SEMANTIC_EVENT_NAMES).forEach((eventName) => {
          expect(typeof eventName).toBe('string');
          expect(eventName.length).toBeGreaterThan(0);
          // Should follow "Object(s) Action" pattern - can have multiple words before action
          expect(eventName).toMatch(/^[A-Z][a-zA-Z ]+[A-Z][a-z]+$/);
        });
      });
    });
  });

  describe('Property Mapping Constants', () => {
    describe('PROPERTY_MAPPINGS', () => {
      it('should have all required mapping categories', () => {
        expect(PROPERTY_MAPPINGS.ACTION_PREFIX_MAP).toBeDefined();
        expect(PROPERTY_MAPPINGS.PAGE_PREFIX_MAP).toBeDefined();
        expect(PROPERTY_MAPPINGS.DESTINATION_PREFIX_MAP).toBeDefined();
        expect(PROPERTY_MAPPINGS.CONTEXT_PREFIX_MAP).toBeDefined();
      });

      it('should have correct action prefix mappings', () => {
        expect(PROPERTY_MAPPINGS.ACTION_PREFIX_MAP.button_name).toBe('action_button');
        expect(PROPERTY_MAPPINGS.ACTION_PREFIX_MAP.menu_name).toBe('action_menu');
        expect(PROPERTY_MAPPINGS.ACTION_PREFIX_MAP.modal_name).toBe('action_modal');
        expect(PROPERTY_MAPPINGS.ACTION_PREFIX_MAP.element_text).toBe('action_text');
        expect(PROPERTY_MAPPINGS.ACTION_PREFIX_MAP.element_type).toBe('action_type');
      });

      it('should have correct page prefix mappings', () => {
        expect(PROPERTY_MAPPINGS.PAGE_PREFIX_MAP.page_name).toBe('page_name');
        expect(PROPERTY_MAPPINGS.PAGE_PREFIX_MAP.pathname).toBe('page_path');
        expect(PROPERTY_MAPPINGS.PAGE_PREFIX_MAP.route_pattern).toBe('page_route');
      });

      it('should have correct destination prefix mappings', () => {
        expect(PROPERTY_MAPPINGS.DESTINATION_PREFIX_MAP.destination_path).toBe('destination_path');
        expect(PROPERTY_MAPPINGS.DESTINATION_PREFIX_MAP.destination_url).toBe('destination_url');
      });

      it('should have correct context prefix mappings', () => {
        expect(PROPERTY_MAPPINGS.CONTEXT_PREFIX_MAP.tenant_id).toBe('tenant_id');
        expect(PROPERTY_MAPPINGS.CONTEXT_PREFIX_MAP.timestamp).toBe('timestamp');
      });
    });
  });

  describe('ANALYTICS_ROUTES constant', () => {
    it('should have correct structure', () => {
      expect(typeof ANALYTICS_ROUTES).toBe('object');
      expect(ANALYTICS_ROUTES.default).toBeDefined();
      expect(ANALYTICS_ROUTES.default.autoTrack).toBe(false);
    });

    it('should have tracking enabled routes', () => {
      expect(ANALYTICS_ROUTES['/meeting/:meetingId'].autoTrack).toBe(true);
      expect(ANALYTICS_ROUTES['/earnings-calls/:botId'].autoTrack).toBe(true);
      expect(ANALYTICS_ROUTES['/insights/:insightId'].autoTrack).toBe(true);
    });

    it('should have tracking disabled routes', () => {
      expect(ANALYTICS_ROUTES['/settings/*'].autoTrack).toBe(false);
    });

    it('should have proper tracking configurations', () => {
      const meetingConfig = ANALYTICS_ROUTES['/meeting/:meetingId'];
      expect(meetingConfig.trackingConfig.captureTypes).toContain('clicks');
      expect(meetingConfig.trackingConfig.ignoreSelectors).toContain('.navigation');
      expect(meetingConfig.trackingConfig.ignoreSelectors).toContain('[data-ignore-tracking]');
    });
  });
});
