import {
  defer,
  find,
  forOwn,
  get,
  kebabCase,
  keys,
  includes,
  entries,
  reduce,
  values,
  filter,
  forEach,
  random
} from 'lodash-es';
import {
  ELEMENT_TYPE_MAPPINGS,
  ICON_CLASS_MAPPINGS,
  NAVIGATION_PATH_MAPPINGS,
  PROPERTY_MAPPINGS,
  TRACKABLE_ELEMENT_CHECKS
} from '@util/constants/analytics.constants';
import { AnalyticsConfig } from '@util/constants/analytics.config';
import { analyticsLog, getAnalyticsConfigForRoute } from '@util/helpers/analytics.helpers';

// Cache for route configurations to prevent duplicate lookups
const routeConfigCache = new Map();

/**
 * Generate page name from route pattern dynamically
 * @param {string} pathname - Current pathname
 * @param {string} routePattern - Matched route pattern
 * @returns {string} Generated page name
 */
function generatePageName(pathname, routePattern) {
  if (routePattern) {
    // Generate from route pattern: '/meeting/:meetingId' → 'meeting_detail'
    const pageName = routePattern
      .replace(/^\//, '') // Remove leading slash
      .replace(/\/:[^/]+/g, '_detail') // Replace params with '_detail'
      .replace(/\//g, '_') // Replace remaining slashes with underscores
      .replace(/\*/g, 'wildcard'); // Handle wildcards

    analyticsLog(
      'DEBUG',
      `[Analytics] 🏷️ Generated page name: ${pathname} (${routePattern}) -> ${pageName}`
    );
    return pageName;
  }

  // Fallback to pathname-based generation
  if (pathname === '/') return 'dashboard';

  const pageName = pathname
    .replace(/^\//, '') // Remove leading slash
    .replace(/\/[^/]*$/g, '_detail') // Replace last segment if it looks like an ID
    .replace(/\//g, '_') // Replace slashes with underscores
    .replace(/\W/g, '') // Remove special characters (non-word characters)
    .toLowerCase();

  analyticsLog(
    'DEBUG',
    `[Analytics] 🏷️ Generated page name from pathname: ${pathname} -> ${pageName}`
  );
  return pageName || 'unknown';
}

/**
 * Determine if element is trackable
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} Whether element should be tracked
 */
function isTrackableElement(element) {
  const trackableCheck = find(TRACKABLE_ELEMENT_CHECKS, (check) => {
    return check.condition(element);
  });

  return !!trackableCheck;
}

/**
 * Analytics service for tracking events across platforms
 */
class AnalyticsService {
  constructor(configOptions = {}) {
    // Initialize centralized configuration
    this.config = new AnalyticsConfig(configOptions);

    // Validate configuration
    const validation = this.config.validate();
    if (!validation.isValid) {
      console.warn('[Analytics] Configuration validation failed:', validation.errors);
    }

    // Initialize service properties
    this.isEnabled = false;
    this.trackedPages = new Set();
    this.statsigClient = null;
    this.userContext = null;
    this.routeContext = null;
    this.isInitialized = false;

    this.log('DEBUG', '[Analytics] 🚀 Service instance created');
  }

  /**
   * Smart logging that respects ANALYTICS_LOG_LEVEL
   * @param {string} level - 'DEBUG', 'INFO', 'WARN', or 'ERROR'
   * @param {string} message - Log message
   * @param {...any} args - Additional arguments
   */
  log(level, message, ...args) {
    analyticsLog(level, message, ...args);
  }

  /**
   * Initialize analytics service with Statsig client
   * @param {Object} statsigClient - Statsig client from React Provider
   */
  initialize(statsigClient) {
    if (this.isInitialized) {
      this.log('WARN', '[Analytics] Already initialized, skipping...');
      return;
    }

    if (!statsigClient) {
      this.log('WARN', '[Analytics] No Statsig client provided, skipping initialization');
      return;
    }

    this.statsigClient = statsigClient;
    this.setupGlobalListener();
    this.isInitialized = true;
    this.log('INFO', '[Analytics] ✅ Service initialized successfully');
  }

  /**
   * Update route context from React Router
   * @param {Object} location - React Router location object
   * @param {string} matchedPattern - Matched route pattern from analytics config
   */
  updateRouteContext(location, matchedPattern = null) {
    const newRouteContext = {
      location: {
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
        state: location.state
      },
      routePattern: matchedPattern,
      pageName: generatePageName(location.pathname, matchedPattern)
    };

    if (this.routeContext?.location?.pathname !== newRouteContext.location.pathname) {
      this.log(
        'INFO',
        `[Analytics] 🛣️ Route changed: ${this.routeContext?.location?.pathname} -> ${newRouteContext.location.pathname} (${newRouteContext.pageName})`
      );
    }

    this.routeContext = newRouteContext;
  }

  /**
   * Set tracking configuration
   * @param {Object} trackingConfig - Tracking configuration
   */
  setTrackingConfig(trackingConfig) {
    this.config.updateTrackingConfig(trackingConfig);
  }

  /**
   * Get current tracking configuration
   * @returns {Object} Current tracking configuration
   */
  getTrackingConfig() {
    return this.config.getTrackingConfig();
  }

  /**
   * Enable tracking for current route
   */
  enableForRoute() {
    const pageName = this.routeContext?.pageName || 'unknown';
    this.isEnabled = true;
    this.trackedPages.add(pageName);
    this.log(
      'INFO',
      `[Analytics] ✅ Auto-tracking enabled for page: ${pageName} (total: ${this.trackedPages.size})`
    );
  }

  /**
   * Setup global click listener
   */
  setupGlobalListener() {
    if (this.hasGlobalListener) {
      this.log('WARN', '[Analytics] Global listener already set up');
      return;
    }

    const trackingConfig = this.config.getTrackingConfig();
    if (!includes(trackingConfig.captureTypes, 'clicks')) {
      this.log('DEBUG', '[Analytics] Click tracking disabled in configuration');
      return;
    }

    document.addEventListener(
      'click',
      (event) => {
        // Capture the current state immediately when click happens, before any route changes
        const clickContext = {
          isEnabled: this.isEnabled,
          currentPage: this.routeContext?.pageName,
          isPageTracked: this.trackedPages.has(this.routeContext?.pageName),
          routeContext: this.routeContext
        };

        this.handleClick(event, clickContext);
      },
      true
    ); // Use capture phase

    this.hasGlobalListener = true;
    this.log('DEBUG', '[Analytics] 👂 Global click listener set up');
  }

  /**
   * Handle click events
   * @param {Event} event - Click event
   * @param {Object} clickContext - Context captured at click time
   */
  handleClick(event, clickContext) {
    const element = event.target;
    const isLink = element.tagName === 'A';

    // Use the captured context from when the click happened
    const {
      isEnabled: isCurrentlyTracking,
      currentPage,
      isPageTracked,
      routeContext
    } = clickContext;

    if (!isCurrentlyTracking || !routeContext || !isPageTracked) {
      return;
    }

    // Check if element should be ignored based on config
    if (this.shouldIgnoreElement(element)) {
      return;
    }

    if (!isTrackableElement(element)) {
      return;
    }

    // Extract event data - capture destination if it's a link
    const detectedButtonName = this._detectButtonName(element);
    const eventData = {
      button_name: detectedButtonName,
      element_text: element.textContent?.trim() || '',
      element_type: element.tagName.toLowerCase(),
      page_name: currentPage || 'unknown',
      pathname: routeContext.location.pathname,
      route_pattern: routeContext.routePattern,
      tenant_id: this.userContext?.tenant?.id,
      timestamp: new Date().toISOString(),
      // Add essential fields only - remove duplicates to reduce payload size
      client: 'web',
      action_type: 'click',
      context: this.userContext?.tenant?.name || 'unknown',
      event_id: `${Date.now()}_${random(0, 1, true).toString(36).substring(2, 11)}` // Generate unique event ID
    };

    // If it's a link, capture the destination
    if (isLink && element.href) {
      try {
        const url = new URL(element.href);
        eventData.destination_path = url.pathname;
        eventData.destination_url = element.href;
      } catch (error) {
        // Log the specific error for debugging
        this.log('WARN', '[Analytics] ⚠️ Invalid URL format:', element.href, error.message);
        eventData.destination_url = element.href;
      }
    }

    this.log(
      'DEBUG',
      `[Analytics] 🖱️ Auto-tracked click: ${eventData.button_name} on ${currentPage || 'unknown'}${
        isLink ? ' (link from tracked page)' : ''
      }`
    );

    // Track with semantic event name based on element type and context
    const eventName = this.generateSemanticEventName(element);

    // Use defer if enabled in configuration
    const trackingConfig = this.config.getTrackingConfig();
    if (trackingConfig.enableDeferredTracking) {
      defer(() => {
        this.trackEvent(eventName, eventData);
      });
    } else {
      this.trackEvent(eventName, eventData);
    }
  }

  /**
   * Generate semantic event name based on element and action
   * @param {HTMLElement} element - Clicked element
   * @returns {string} Semantic event name
   */
  generateSemanticEventName(element) {
    // Determine object type using element type mapping
    const objectType =
      get(ELEMENT_TYPE_MAPPINGS, element.tagName) ||
      (element.getAttribute('role') === 'button' ? 'Button' : 'Element');

    // Use object-action pattern: "[Object] [Action]"
    return `${objectType} Clicked`;
  }

  /**
   * Check if element should be ignored based on configuration
   * @param {HTMLElement} element - Element to check
   * @returns {boolean} Whether element should be ignored
   */
  shouldIgnoreElement(element) {
    const trackingConfig = this.config.getTrackingConfig();
    if (!trackingConfig.ignoreSelectors || trackingConfig.ignoreSelectors.length === 0) {
      return false;
    }

    // Check if element or any parent matches ignore selectors
    let currentElement = element;
    while (currentElement && currentElement !== document.body) {
      for (const selector of trackingConfig.ignoreSelectors) {
        try {
          if (currentElement.matches?.(selector)) {
            return true;
          }
        } catch (error) {
          this.log('WARN', '[Analytics] Invalid selector:', selector, error);
        }
      }
      currentElement = currentElement.parentElement;
    }

    return false;
  }

  /**
   * Send event to analytics platforms with consistent formatting
   * @param {string} eventName - Event name
   * @param {Object} properties - Event properties
   */
  trackEvent(eventName, properties) {
    try {
      // Organize properties for different services
      const organizedProperties = this.organizeEventProperties(properties);

      // Clean properties (remove undefined/null values)
      const cleanedProperties = reduce(
        entries(organizedProperties),
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = value;
          }
          return acc;
        },
        {}
      );

      // Send to platforms based on configuration
      this.sendToPlatforms(eventName, properties, cleanedProperties);
    } catch (error) {
      this.log('ERROR', '[Analytics] ❌ Error tracking event:', error);
    }
  }

  /**
   * Send event to configured platforms
   * @param {string} eventName - Event name
   * @param {Object} originalProperties - Original event properties
   * @param {Object} cleanedProperties - Cleaned and organized properties
   */
  sendToPlatforms(eventName, originalProperties, cleanedProperties) {
    // Send to Pendo if enabled
    const pendoConfig = this.config.getPlatformConfig('pendo');
    if (pendoConfig.enabled && window?.pendo?.track) {
      let pendoProperties = {};

      if (pendoConfig.sendOriginalProperties) {
        pendoProperties = { ...pendoProperties, ...originalProperties };
      }

      if (pendoConfig.sendMappedProperties) {
        pendoProperties = { ...pendoProperties, ...cleanedProperties };
      }

      this.log('DEBUG', '[Analytics] 📤 Sending to Pendo:', {
        eventName,
        properties: pendoProperties,
        propertyCount: keys(pendoProperties).length
      });

      window.pendo.track(eventName, pendoProperties);
      this.log('DEBUG', `[Analytics] ✅ Sent to Pendo: ${eventName}`);
    }

    // Send to Statsig if enabled
    const statsigConfig = this.config.getPlatformConfig('statsig');
    if (statsigConfig.enabled && this.statsigClient?.logEvent) {
      let eventValue = eventName;

      if (statsigConfig.combinePageAndAction) {
        const pageName = cleanedProperties.page_name || 'unknown';
        const actionName =
          cleanedProperties.action_button ||
          cleanedProperties.action_menu ||
          cleanedProperties.action_modal ||
          'unknown';
        eventValue = `${pageName}:${actionName}`;
      }

      if (statsigConfig.useValueField) {
        this.log('DEBUG', '[Analytics] 📤 Sending to Statsig:', {
          eventName,
          eventValue,
          properties: cleanedProperties,
          propertyCount: keys(cleanedProperties).length
        });

        this.statsigClient.logEvent(eventName, eventValue, cleanedProperties);
      } else {
        this.log('DEBUG', '[Analytics] 📤 Sending to Statsig:', {
          eventName,
          properties: cleanedProperties,
          propertyCount: keys(cleanedProperties).length
        });

        this.statsigClient.logEvent(eventName, cleanedProperties);
      }

      this.log('DEBUG', `[Analytics] ✅ Sent to Statsig: ${eventName} (${eventValue})`);
    }
  }

  /**
   * Organize event properties into logical groups and remove redundant data
   * @param {Object} properties - Raw event properties
   * @returns {Object} Organized properties with semantic prefixes
   */
  organizeEventProperties(properties) {
    const organized = {};

    // Process all property mappings in a single loop
    const mappingSections = [
      PROPERTY_MAPPINGS.ACTION_PREFIX_MAP,
      PROPERTY_MAPPINGS.PAGE_PREFIX_MAP,
      PROPERTY_MAPPINGS.DESTINATION_PREFIX_MAP,
      PROPERTY_MAPPINGS.CONTEXT_PREFIX_MAP
    ];

    forEach(mappingSections, (mappingSection) => {
      forOwn(mappingSection, (targetKey, sourceKey) => {
        if (properties[sourceKey]) {
          organized[targetKey] = properties[sourceKey];
        }
      });
    });

    return organized;
  }

  /**
   * Manual tracking methods for explicit calls
   */

  /**
   * Track a manual event with unified handling
   * @param {string} type - Event type ('button', 'menu', 'modal')
   * @param {string} name - Element identifier
   * @param {Object} additionalProps - Additional properties
   */
  trackManualEvent(type, name, additionalProps = {}) {
    const eventConfig = this.config.getManualEventConfig(type);

    if (!eventConfig) {
      this.log('WARN', `[Analytics] ⚠️ Unknown manual event type: ${type}`);
      return;
    }

    const specificData = { [eventConfig.dataField]: name };
    const eventData = this._createManualEventData(specificData, additionalProps);

    this.log(
      'DEBUG',
      `[Analytics] ${eventConfig.emoji} Manual ${type} ${eventConfig.actionType}: ${name}`
    );
    this.trackEvent(eventConfig.semanticEventName, eventData);
  }

  /**
   * Create event data for manual tracking with common context
   * @param {Object} specificData - Event-specific data (button_name, menu_name, etc.)
   * @param {Object} additionalProps - Additional properties
   * @returns {Object} Complete event data
   */
  _createManualEventData(specificData, additionalProps = {}) {
    const eventType = this._determineEventType(specificData);
    const eventConfig = this.config.getManualEventConfig(eventType);
    const actionValue = values(specificData)[0] || 'unknown';

    return {
      ...specificData,
      ...additionalProps,
      ...this._getContextProperties(),
      ...this._getPendoCompatibilityFields(actionValue, eventConfig, eventType)
    };
  }

  /**
   * Determine event type from specific data keys
   * @param {Object} specificData - Event-specific data
   * @returns {string} Event type
   * @private
   */
  _determineEventType(specificData) {
    if (specificData.button_name) return 'button';
    if (specificData.menu_name) return 'menu';
    if (specificData.modal_name) return 'modal';
    return 'unknown';
  }

  /**
   * Get common context properties for events
   * @returns {Object} Context properties
   * @private
   */
  _getContextProperties() {
    return {
      page_name: this.routeContext?.pageName || 'unknown',
      pathname: this.routeContext?.location.pathname,
      route_pattern: this.routeContext?.routePattern,
      tenant_id: this.userContext?.tenant?.id,
      timestamp: new Date().toISOString(),
      client: 'web',
      context: this.userContext?.tenant?.name || 'unknown'
    };
  }

  /**
   * Get Pendo compatibility fields
   * @param {string} actionValue - Action value
   * @param {Object} eventConfig - Event configuration
   * @param {string} eventType - Event type
   * @returns {Object} Pendo compatibility fields
   * @private
   */
  _getPendoCompatibilityFields(actionValue, eventConfig, eventType) {
    return {
      element_text: actionValue,
      element_type: eventConfig?.elementType || eventType,
      action_type: eventConfig?.actionType || 'unknown'
    };
  }

  /**
   * Track a button click event
   * @param {string} buttonName - Button identifier
   * @param {Object} additionalProps - Additional properties
   */
  trackButtonClick(buttonName, additionalProps = {}) {
    this.trackManualEvent('button', buttonName, additionalProps);
  }

  /**
   * Track a menu item click event
   * @param {string} menuName - Menu identifier
   * @param {Object} additionalProps - Additional properties
   */
  trackMenuClick(menuName, additionalProps = {}) {
    this.trackManualEvent('menu', menuName, additionalProps);
  }

  /**
   * Track a modal open event
   * @param {string} modalName - Modal identifier
   * @param {Object} additionalProps - Additional properties
   */
  trackModalOpen(modalName, additionalProps = {}) {
    this.trackManualEvent('modal', modalName, additionalProps);
  }

  /**
   * Handle route changes from React Router
   * @param {Object} location - React Router location object
   */
  handleRouteChange(location) {
    this.log('INFO', '[Analytics] 🛣️ Route change detected:', location.pathname);

    if (!this.isInitialized) {
      this.log('DEBUG', '[Analytics] Service not initialized, ignoring route change');
      return;
    }

    // Get analytics configuration for the new route
    const routeConfig = this.config.getRouteConfig();
    let analyticsRouteConfig = null;

    if (routeConfig.enableCaching) {
      analyticsRouteConfig = routeConfigCache.get(location.pathname);
    }

    if (!analyticsRouteConfig) {
      analyticsRouteConfig = getAnalyticsConfigForRoute(location.pathname);

      if (routeConfig.enableCaching) {
        // Manage cache size
        if (routeConfigCache.size >= routeConfig.cacheSize) {
          const firstKey = routeConfigCache.keys().next().value;
          routeConfigCache.delete(firstKey);
        }
        routeConfigCache.set(location.pathname, analyticsRouteConfig);
      }
    }

    // Update route context
    this.updateRouteContext(location, analyticsRouteConfig.matchedPattern);

    // Configure tracking for this route
    if (analyticsRouteConfig.autoTrack) {
      if (analyticsRouteConfig.trackingConfig) {
        this.setTrackingConfig(analyticsRouteConfig.trackingConfig);
      }
      this.enableForRoute();
    } else {
      this.disableTracking();
    }
  }

  /**
   * Disable tracking for the current route
   */
  disableTracking() {
    this.log('DEBUG', '[Analytics] ❌ Disabling tracking for current route');
    this.isEnabled = false;
  }

  /**
   * Detect button name from text content
   * @param {HTMLElement} element - Element to analyze
   * @returns {string|null} Button name or null if not found
   * @private
   */
  _detectFromTextContent(element) {
    const text = get(element, 'textContent', '').trim();
    if (text && text.length < 50) {
      const buttonName = kebabCase(text);
      analyticsLog('DEBUG', `[Analytics] ✅ Button name from text: "${text}" -> ${buttonName}`);
      return buttonName;
    }
    return null;
  }

  /**
   * Detect button name from ARIA label
   * @param {HTMLElement} element - Element to analyze
   * @returns {string|null} Button name or null if not found
   * @private
   */
  _detectFromAriaLabel(element) {
    const ariaLabel = element.getAttribute('aria-label');
    if (ariaLabel) {
      const buttonName = kebabCase(ariaLabel);
      analyticsLog('DEBUG', `[Analytics] ✅ Button name from aria-label: ${buttonName}`);
      return buttonName;
    }
    return null;
  }

  /**
   * Detect button name from title attribute
   * @param {HTMLElement} element - Element to analyze
   * @returns {string|null} Button name or null if not found
   * @private
   */
  _detectFromTitle(element) {
    const title = element.getAttribute('title');
    if (title) {
      const buttonName = kebabCase(title);
      analyticsLog('DEBUG', `[Analytics] ✅ Button name from title: ${buttonName}`);
      return buttonName;
    }
    return null;
  }

  /**
   * Detect button name from navigation/link patterns
   * @param {HTMLElement} element - Element to analyze
   * @returns {string|null} Button name or null if not found
   * @private
   */
  _detectFromNavigation(element) {
    if (element.tagName !== 'A' || !element.href) {
      return null;
    }

    try {
      const url = new URL(element.href);
      const pathname = url.pathname;

      // Check exact matches first using lodash get
      const exactMatch = get(NAVIGATION_PATH_MAPPINGS, pathname);
      if (exactMatch) {
        analyticsLog('DEBUG', `[Analytics] ✅ Navigation link (exact): ${exactMatch}`);
        return exactMatch;
      }

      // Check prefix matches using lodash find
      const prefixMatch = find(keys(NAVIGATION_PATH_MAPPINGS), (pathPrefix) => {
        return pathPrefix !== '/' && pathname.startsWith(pathPrefix);
      });

      if (prefixMatch) {
        const actionName = NAVIGATION_PATH_MAPPINGS[prefixMatch];
        analyticsLog('DEBUG', `[Analytics] ✅ Navigation link (prefix): ${actionName}`);
        return actionName;
      }

      // Generic path-based name for other links
      const pathSegments = filter(pathname.split('/'), Boolean);
      if (pathSegments.length > 0) {
        const linkName = `nav-${pathSegments[0]}`;
        analyticsLog('DEBUG', `[Analytics] ✅ Link name from path: ${linkName}`);
        return linkName;
      }
    } catch (error) {
      analyticsLog('WARN', '[Analytics] ⚠️ Could not parse link URL:', element.href, error.message);
    }

    return null;
  }

  /**
   * Detect button name from icon classes
   * @param {HTMLElement} element - Element to analyze
   * @returns {string|null} Button name or null if not found
   * @private
   */
  _detectFromIcon(element) {
    const icon = element.querySelector('[class*="SF"], [class*="icon"], [class*="Icon"]');
    if (!icon) {
      return null;
    }

    const iconClass = get(icon, 'className', '');
    const matchedIconPattern = find(keys(ICON_CLASS_MAPPINGS), (iconPattern) => {
      return includes(iconClass, iconPattern);
    });

    if (matchedIconPattern) {
      const actionName = ICON_CLASS_MAPPINGS[matchedIconPattern];
      analyticsLog('DEBUG', `[Analytics] ✅ Icon match: ${actionName}`);
      return actionName;
    }

    return null;
  }

  /**
   * Detect button name from data attributes
   * @param {HTMLElement} element - Element to analyze
   * @returns {string|null} Button name or null if not found
   * @private
   */
  _detectFromDataAttributes(element) {
    // Check data-action first
    const dataAction = element.getAttribute('data-action');
    if (dataAction) {
      const buttonName = kebabCase(dataAction);
      analyticsLog('DEBUG', `[Analytics] ✅ Button name from data-action: ${buttonName}`);
      return buttonName;
    }

    // Check test IDs
    const dataTestId = element.getAttribute('data-testid') || element.getAttribute('data-cy');
    if (dataTestId) {
      const buttonName = kebabCase(dataTestId);
      analyticsLog('DEBUG', `[Analytics] ✅ Button name from test ID: ${buttonName}`);
      return buttonName;
    }

    return null;
  }

  /**
   * Detect button name from element type (fallback)
   * @param {HTMLElement} element - Element to analyze
   * @returns {string} Button name (always returns a fallback)
   * @private
   */
  _detectFromElementType(element) {
    if (element.tagName === 'BUTTON') {
      analyticsLog('DEBUG', '[Analytics] ⚠️ Fallback to generic button name');
      return 'button';
    }
    if (element.getAttribute('role') === 'button') {
      analyticsLog('DEBUG', '[Analytics] ⚠️ Fallback to generic button name (role=button)');
      return 'button';
    }
    if (element.tagName === 'A') {
      analyticsLog('DEBUG', '[Analytics] ⚠️ Fallback to generic link name');
      return 'link';
    }
    return 'unknown-element';
  }

  /**
   * Detect button name using fallback hierarchy
   * @param {HTMLElement} element - Clicked element
   * @returns {string} Button name
   * @private
   */
  _detectButtonName(element) {
    analyticsLog('DEBUG', `[Analytics] 🔍 Detecting button name for: ${element.tagName}`);

    // Try each detection method in order of reliability
    const detectionMethods = [
      () => this._detectFromTextContent(element),
      () => this._detectFromAriaLabel(element),
      () => this._detectFromTitle(element),
      () => this._detectFromNavigation(element),
      () => this._detectFromIcon(element),
      () => this._detectFromDataAttributes(element),
      () => this._detectFromElementType(element)
    ];

    for (const detectMethod of detectionMethods) {
      const result = detectMethod();
      if (result) {
        return result;
      }
    }

    analyticsLog('WARN', '[Analytics] ⚠️ Could not detect button name, using fallback');
    return 'unknown-element';
  }
}

// Global singleton
const analyticsService = new AnalyticsService();

/**
 * Initialize analytics service with Statsig client
 * @param {Object} statsigClient - Statsig client instance
 * @param {Object} user - User object from store
 * @param {Object} tenant - Tenant object from store
 * @param {Object} location - React Router location object (optional for initial route)
 */
export function initializeAnalytics(statsigClient, user, tenant, location = null) {
  analyticsLog('INFO', '[AnalyticsService] 🚀 Initializing analytics service');

  if (!statsigClient) {
    analyticsLog('WARN', '[AnalyticsService] ⚠️ No Statsig client provided');
    return;
  }

  // Initialize the service with the client
  analyticsService.initialize(statsigClient);

  // Set user context
  analyticsService.userContext = { user, tenant };

  // Set initial route context if location is provided
  if (location) {
    analyticsService.handleRouteChange(location);
  }

  analyticsLog('INFO', '[AnalyticsService] ✅ Analytics service initialized successfully');
}

export default analyticsService;
