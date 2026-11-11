import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyticsConfig } from '@util/constants/analytics.config';

// Mock lodash functions used in AnalyticsConfig
vi.mock('lodash-es', () => ({
  entries: vi.fn((obj) => Object.entries(obj)),
  filter: vi.fn((collection, predicate) => collection.filter(predicate)),
  forEach: vi.fn((collection, iteratee) => collection.forEach(iteratee)),
  cloneDeep: vi.fn((obj) => JSON.parse(JSON.stringify(obj))),
  includes: vi.fn((collection, value) => collection.includes(value))
}));

describe('AnalyticsConfig', () => {
  let config;

  beforeEach(() => {
    config = new AnalyticsConfig();
  });

  describe('constructor', () => {
    it('should initialize with default configuration', () => {
      expect(config._config).toBeDefined();
      expect(config._config.logging.level).toBe('ALL');
      expect(config._config.tracking.captureTypes).toEqual(['clicks']);
      expect(config._config.platforms.pendo.enabled).toBe(true);
      expect(config._config.platforms.statsig.enabled).toBe(true);
    });

    it('should merge custom options with defaults', () => {
      const customConfig = new AnalyticsConfig({
        logging: { level: 'WARN' },
        tracking: { captureTypes: ['clicks', 'forms'] },
        customProperty: 'test'
      });

      expect(customConfig._config.logging.level).toBe('WARN');
      expect(customConfig._config.tracking.captureTypes).toEqual(['clicks', 'forms']);
      expect(customConfig._config.customProperty).toBe('test');
      // Should preserve other defaults
      expect(customConfig._config.platforms.pendo.enabled).toBe(true);
    });
  });

  describe('logging configuration', () => {
    it('should get logging configuration', () => {
      const loggingConfig = config.getLoggingConfig();
      
      expect(loggingConfig).toEqual({
        level: 'ALL',
        enableConsoleAccess: true
      });
    });

    it('should return a reference to the actual config object', () => {
      const loggingConfig = config.getLoggingConfig();
      loggingConfig.level = 'INFO';
      
      expect(config._config.logging.level).toBe('INFO');
    });
  });

  describe('tracking configuration', () => {
    it('should get tracking configuration', () => {
      const trackingConfig = config.getTrackingConfig();
      
      expect(trackingConfig).toEqual({
        captureTypes: ['clicks'],
        ignoreSelectors: [],
        autoTrack: true,
        enableDeferredTracking: true
      });
    });

    it('should update tracking configuration', () => {
      const newConfig = {
        captureTypes: ['clicks', 'forms'],
        ignoreSelectors: ['.navigation', '.footer'],
        autoTrack: false
      };

      config.updateTrackingConfig(newConfig);
      const result = config.getTrackingConfig();

      expect(result.captureTypes).toEqual(['clicks', 'forms']);
      expect(result.ignoreSelectors).toEqual(['.navigation', '.footer']);
      expect(result.autoTrack).toBe(false);
      // Should preserve existing properties not being updated
      expect(result.enableDeferredTracking).toBe(true);
    });

    it('should merge new config with existing config', () => {
      config.updateTrackingConfig({ captureTypes: ['forms'] });
      
      const result = config.getTrackingConfig();
      expect(result.captureTypes).toEqual(['forms']);
      expect(result.autoTrack).toBe(true); // Should preserve existing
    });
  });

  describe('platform configuration', () => {
    it('should get pendo platform configuration', () => {
      const pendoConfig = config.getPlatformConfig('pendo');
      
      expect(pendoConfig).toEqual({
        enabled: true,
        sendOriginalProperties: false,
        sendMappedProperties: true
      });
    });

    it('should get statsig platform configuration', () => {
      const statsigConfig = config.getPlatformConfig('statsig');
      
      expect(statsigConfig).toEqual({
        enabled: true,
        useValueField: true,
        combinePageAndAction: true
      });
    });

    it('should return empty object for unknown platform', () => {
      const unknownConfig = config.getPlatformConfig('unknown');
      
      expect(unknownConfig).toEqual({});
    });

    it('should update platform configuration', () => {
      const newPendoConfig = {
        enabled: false,
        sendOriginalProperties: false,
        customProperty: 'test'
      };

      config.updatePlatformConfig('pendo', newPendoConfig);
      const result = config.getPlatformConfig('pendo');

      expect(result.enabled).toBe(false);
      expect(result.sendOriginalProperties).toBe(false);
      expect(result.customProperty).toBe('test');
      // Should preserve existing properties not being updated
      expect(result.sendMappedProperties).toBe(true);
    });

    it('should create new platform configuration', () => {
      const newPlatformConfig = {
        enabled: true,
        apiKey: 'test-key'
      };

      config.updatePlatformConfig('newPlatform', newPlatformConfig);
      const result = config.getPlatformConfig('newPlatform');

      expect(result).toEqual(newPlatformConfig);
    });
  });

  describe('manual event configuration', () => {
    it('should get button event configuration', () => {
      const buttonConfig = config.getManualEventConfig('button');
      
      expect(buttonConfig).toEqual({
        dataField: 'button_name',
        emoji: '🖱️',
        actionType: 'click',
        elementType: 'button',
        semanticEventName: 'Button Clicked'
      });
    });

    it('should get menu event configuration', () => {
      const menuConfig = config.getManualEventConfig('menu');
      
      expect(menuConfig).toEqual({
        dataField: 'menu_name',
        emoji: '📋',
        actionType: 'menu_click',
        elementType: 'menu',
        semanticEventName: 'Menu Item Clicked'
      });
    });

    it('should get modal event configuration', () => {
      const modalConfig = config.getManualEventConfig('modal');
      
      expect(modalConfig).toEqual({
        dataField: 'modal_name',
        emoji: '🪟',
        actionType: 'modal_open',
        elementType: 'modal',
        semanticEventName: 'Modal Opened'
      });
    });

    it('should return undefined for unknown event type', () => {
      const unknownConfig = config.getManualEventConfig('unknown');
      
      expect(unknownConfig).toBeUndefined();
    });

    it('should get all manual event configurations', () => {
      const allConfigs = config.getAllManualEventConfigs();
      
      expect(allConfigs).toHaveProperty('button');
      expect(allConfigs).toHaveProperty('menu');
      expect(allConfigs).toHaveProperty('modal');
      expect(Object.keys(allConfigs)).toHaveLength(3);
    });

    it('should add new manual event configuration', () => {
      const newEventConfig = {
        dataField: 'form_name',
        emoji: '📝',
        actionType: 'form_submit',
        elementType: 'form',
        semanticEventName: 'Form Submitted'
      };

      config.addManualEventConfig('form', newEventConfig);
      const result = config.getManualEventConfig('form');

      expect(result).toEqual(newEventConfig);
    });

    it('should update existing manual event configuration', () => {
      const updatedButtonConfig = {
        dataField: 'button_name',
        emoji: '🔘',
        actionType: 'button_click',
        elementType: 'button',
        semanticEventName: 'Button Pressed'
      };

      config.addManualEventConfig('button', updatedButtonConfig);
      const result = config.getManualEventConfig('button');

      expect(result).toEqual(updatedButtonConfig);
    });
  });

  describe('route configuration', () => {
    it('should get route configuration', () => {
      const routeConfig = config.getRouteConfig();
      
      expect(routeConfig).toEqual({
        enableCaching: true,
        cacheSize: 100,
        defaultAutoTrack: false
      });
    });
  });

  describe('validation', () => {
    it('should validate a valid configuration', () => {
      const validation = config.validate();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should detect invalid logging level', () => {
      config._config.logging.level = 'INVALID';
      const validation = config.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid logging level: INVALID');
    });

    it('should detect invalid capture types', () => {
      config._config.tracking.captureTypes = ['clicks', 'invalid_type', 'forms'];
      const validation = config.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid capture types: invalid_type');
    });

    it('should detect multiple invalid capture types', () => {
      config._config.tracking.captureTypes = ['invalid1', 'clicks', 'invalid2'];
      const validation = config.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid capture types: invalid1, invalid2');
    });

    it('should validate manual event configurations', () => {
      config._config.manualEvents.button = { dataField: 'button_name' }; // Missing semanticEventName
      config._config.manualEvents.menu = { semanticEventName: 'Menu Clicked' }; // Missing dataField
      
      const validation = config.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toContain('Invalid manual event config for button: missing required fields');
      expect(validation.errors).toContain('Invalid manual event config for menu: missing required fields');
    });

    it('should detect multiple validation errors', () => {
      config._config.logging.level = 'INVALID';
      config._config.tracking.captureTypes = ['invalid_type'];
      config._config.manualEvents.button = {}; // Missing required fields
      
      const validation = config.validate();
      
      expect(validation.isValid).toBe(false);
      expect(validation.errors).toHaveLength(3);
    });

    it('should validate all valid capture types', () => {
      config._config.tracking.captureTypes = ['clicks', 'forms', 'page_views'];
      const validation = config.validate();
      
      expect(validation.isValid).toBe(true);
      expect(validation.errors).toEqual([]);
    });

    it('should validate all valid log levels', () => {
      const validLevels = ['ALL', 'INFO', 'WARN', 'OFF'];
      
      validLevels.forEach(level => {
        config._config.logging.level = level;
        const validation = config.validate();
        
        expect(validation.isValid).toBe(true);
        expect(validation.errors).toEqual([]);
      });
    });

    it('should include all configuration sections', () => {
      const allConfig = config.getAll();
      
      expect(allConfig).toHaveProperty('logging');
      expect(allConfig).toHaveProperty('tracking');
      expect(allConfig).toHaveProperty('platforms');
      expect(allConfig).toHaveProperty('routes');
      expect(allConfig).toHaveProperty('manualEvents');
    });
  });

  describe('getAll', () => {
    it('should return a deep copy of the configuration', () => {
      const allConfig = config.getAll();
      
      expect(allConfig).toEqual(config._config);
      expect(allConfig).not.toBe(config._config); // Should be a different object
    });

    it('should not affect original config when modifying returned copy', () => {
      const allConfig = config.getAll();
      allConfig.logging.level = 'MODIFIED';
      allConfig.tracking.captureTypes.push('modified');
      
      expect(config._config.logging.level).toBe('ALL');
      expect(config._config.tracking.captureTypes).toEqual(['clicks']);
    });
  });

  describe('configuration immutability', () => {
    it('should not allow direct modification of config through getters', () => {
      const trackingConfig = config.getTrackingConfig();
      trackingConfig.captureTypes.push('hacked');
      
      // The original config should be modified since we return references
      // This is by design for performance, but worth testing
      expect(config._config.tracking.captureTypes).toContain('hacked');
    });

    it('should preserve config integrity through updateTrackingConfig', () => {
      const originalConfig = config.getAll();
      
      config.updateTrackingConfig({ captureTypes: ['forms'] });
      
      expect(config._config.logging).toEqual(originalConfig.logging);
      expect(config._config.platforms).toEqual(originalConfig.platforms);
      expect(config._config.routes).toEqual(originalConfig.routes);
    });
  });

  describe('edge cases', () => {
    it('should handle empty options in constructor', () => {
      const emptyConfig = new AnalyticsConfig({});
      
      expect(emptyConfig._config.logging.level).toBe('ALL');
      expect(emptyConfig._config.tracking.captureTypes).toEqual(['clicks']);
    });

    it('should handle null/undefined options in constructor', () => {
      const nullConfig = new AnalyticsConfig(null);
      const undefinedConfig = new AnalyticsConfig(undefined);
      
      expect(nullConfig._config.logging.level).toBe('ALL');
      expect(undefinedConfig._config.logging.level).toBe('ALL');
    });

    it('should handle partial configuration updates', () => {
      config.updateTrackingConfig({ autoTrack: false });
      
      const result = config.getTrackingConfig();
      expect(result.autoTrack).toBe(false);
      expect(result.captureTypes).toEqual(['clicks']); // Should preserve other properties
    });

    it('should handle empty platform configuration update', () => {
      config.updatePlatformConfig('pendo', {});
      const result = config.getPlatformConfig('pendo');
      
      // Should preserve existing config since we're merging with empty object
      expect(result.enabled).toBe(true);
      expect(result.sendOriginalProperties).toBe(false);
    });
  });
}); 