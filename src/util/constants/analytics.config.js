import { entries, filter, forEach, cloneDeep, includes } from 'lodash-es';
import { SEMANTIC_EVENT_NAMES } from './analytics.constants';

/**
 * Centralized configuration management for analytics
 */
export class AnalyticsConfig {
  constructor(options = {}) {
    this._config = {
      // Logging configuration
      logging: {
        level: 'ALL', // 'ALL', 'INFO', 'WARN', 'OFF'
        enableConsoleAccess: true
      },

      // Tracking configuration
      tracking: {
        captureTypes: ['clicks'],
        ignoreSelectors: [],
        autoTrack: true,
        enableDeferredTracking: true
      },

      // Platform configuration
      platforms: {
        pendo: {
          enabled: true,
          sendOriginalProperties: false,
          sendMappedProperties: true
        },
        statsig: {
          enabled: true,
          useValueField: true,
          combinePageAndAction: true
        }
      },

      // Route configuration
      routes: {
        enableCaching: true,
        cacheSize: 100,
        defaultAutoTrack: false
      },

      // Manual event type configuration
      manualEvents: {
        button: {
          dataField: 'button_name',
          emoji: '🖱️',
          actionType: 'click',
          elementType: 'button',
          semanticEventName: SEMANTIC_EVENT_NAMES.BUTTON_CLICKED
        },
        menu: {
          dataField: 'menu_name',
          emoji: '📋',
          actionType: 'menu_click',
          elementType: 'menu',
          semanticEventName: SEMANTIC_EVENT_NAMES.MENU_ITEM_CLICKED
        },
        modal: {
          dataField: 'modal_name',
          emoji: '🪟',
          actionType: 'modal_open',
          elementType: 'modal',
          semanticEventName: SEMANTIC_EVENT_NAMES.MODAL_OPENED
        }
      },

      ...options
    };
  }

  /**
   * Get logging configuration
   * @returns {Object} Logging config
   */
  getLoggingConfig() {
    return this._config.logging;
  }

  /**
   * Get tracking configuration
   * @returns {Object} Tracking config
   */
  getTrackingConfig() {
    return this._config.tracking;
  }

  /**
   * Get platform configuration
   * @param {string} platform - Platform name ('pendo', 'statsig')
   * @returns {Object} Platform config
   */
  getPlatformConfig(platform) {
    return this._config.platforms[platform] || {};
  }

  /**
   * Get manual event configuration
   * @param {string} eventType - Event type ('button', 'menu', 'modal')
   * @returns {Object} Manual event config
   */
  getManualEventConfig(eventType) {
    return this._config.manualEvents[eventType];
  }

  /**
   * Get all manual event configurations
   * @returns {Object} All manual event configs
   */
  getAllManualEventConfigs() {
    return this._config.manualEvents;
  }

  /**
   * Get route configuration settings
   * @returns {Object} Route config
   */
  getRouteConfig() {
    return this._config.routes;
  }

  /**
   * Update tracking configuration
   * @param {Object} trackingConfig - New tracking configuration
   */
  updateTrackingConfig(trackingConfig) {
    this._config.tracking = {
      ...this._config.tracking,
      ...trackingConfig
    };
  }

  /**
   * Update platform configuration
   * @param {string} platform - Platform name
   * @param {Object} platformConfig - New platform configuration
   */
  updatePlatformConfig(platform, platformConfig) {
    this._config.platforms[platform] = {
      ...this._config.platforms[platform],
      ...platformConfig
    };
  }

  /**
   * Add or update manual event type configuration
   * @param {string} eventType - Event type name
   * @param {Object} eventConfig - Event configuration
   */
  addManualEventConfig(eventType, eventConfig) {
    this._config.manualEvents[eventType] = eventConfig;
  }

  /**
   * Validate configuration
   * @returns {Object} Validation result with isValid and errors
   */
  validate() {
    const errors = [];

    // Validate logging level
    const validLogLevels = ['ALL', 'INFO', 'WARN', 'OFF'];
    if (!includes(validLogLevels, this._config.logging.level)) {
      errors.push(`Invalid logging level: ${this._config.logging.level}`);
    }

    // Validate tracking capture types
    const validCaptureTypes = ['clicks', 'forms', 'page_views'];
    const invalidCaptureTypes = filter(
      this._config.tracking.captureTypes,
      (type) => !includes(validCaptureTypes, type)
    );
    if (invalidCaptureTypes.length > 0) {
      errors.push(`Invalid capture types: ${invalidCaptureTypes.join(', ')}`);
    }

    // Validate manual event configs
    forEach(entries(this._config.manualEvents), ([eventType, config]) => {
      if (!config.dataField || !config.semanticEventName) {
        errors.push(`Invalid manual event config for ${eventType}: missing required fields`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get a deep copy of the entire configuration
   * @returns {Object} Complete configuration
   */
  getAll() {
    return cloneDeep(this._config);
  }
}

export default AnalyticsConfig;
