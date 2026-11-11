/**
 * Navigation path mappings for link detection
 * Maps URL patterns to analytics action names
 */
export const NAVIGATION_PATH_MAPPINGS = {
  // Exact matches
  '/': 'nav-home',
  '/home': 'nav-home',
  '/dashboard': 'nav-dashboard',

  // Prefix matches (use startsWith)
  '/meeting': 'nav-meetings',
  '/lens': 'nav-lens',
  '/calendar': 'nav-calendar',
  '/settings': 'nav-settings',
  '/contacts': 'nav-contacts',
  '/tools': 'nav-tools',
  '/insights': 'nav-insights',
  '/earnings-calls': 'nav-earnings',
  '/channels': 'nav-channels',
  '/cards': 'nav-cards'
};

/**
 * Icon class mappings for button detection
 * Maps icon class patterns to analytics action names
 */
export const ICON_CLASS_MAPPINGS = {
  // SF Icons (specific)
  SFTrashIcon: 'delete',
  SFEllipsisIcon: 'overflow-menu',
  SFPlusCircleFilledIcon: 'add',
  SFShareIcon: 'share',
  SFPencilIcon: 'edit',
  SFHomeIcon: 'nav-home',
  SFCalendarIcon: 'nav-calendar',
  SFClockIcon: 'nav-clock',
  SFSettingsIcon: 'nav-settings',
  SFContactsIcon: 'nav-contacts',
  SFToolsIcon: 'nav-tools',

  // Generic patterns (partial matches)
  home: 'nav-home',
  calendar: 'nav-calendar',
  clock: 'nav-clock',
  lens: 'nav-lens',
  plus: 'add',
  trash: 'delete',
  delete: 'delete',
  edit: 'edit',
  pencil: 'edit',
  share: 'share',
  menu: 'menu',
  dots: 'menu',
  settings: 'nav-settings',
  contacts: 'nav-contacts',
  tools: 'nav-tools'
};

/**
 * Analytics route configuration
 * Defines which routes should have auto-tracking enabled and their specific configurations
 */
export const ANALYTICS_ROUTES = {
  // Meeting detail pages - enable tracking
  '/meeting/:meetingId': {
    autoTrack: true,
    trackingConfig: {
      captureTypes: ['clicks'],
      ignoreSelectors: ['.navigation', '[data-ignore-tracking]']
    }
  },

  '/earnings-calls/:botId': {
    autoTrack: true,
    trackingConfig: {
      captureTypes: ['clicks'],
      ignoreSelectors: ['.navigation', '[data-ignore-tracking]']
    }
  },

  '/insights/:insightId': {
    autoTrack: true,
    trackingConfig: {
      captureTypes: ['clicks'],
      ignoreSelectors: ['.navigation', '[data-ignore-tracking]']
    }
  },

  '/settings/*': {
    autoTrack: false
  },

  // Default configuration for unmatched routes
  default: {
    autoTrack: false
  }
};

/**
 * Element type mappings for semantic event naming
 * Maps HTML element types to analytics event object names
 */
export const ELEMENT_TYPE_MAPPINGS = {
  BUTTON: 'Button',
  A: 'Link',
  INPUT: 'Input',
  FORM: 'Form',
  SELECT: 'Select',
  TEXTAREA: 'Textarea'
};

/**
 * Trackable element checks for determining if an element should be tracked
 * Each check has a condition function and description for logging
 */
export const TRACKABLE_ELEMENT_CHECKS = [
  { condition: (el) => el.tagName === 'BUTTON', description: 'BUTTON tag' },
  { condition: (el) => el.getAttribute?.('role') === 'button', description: 'role=button' },
  { condition: (el) => el.tagName === 'A', description: 'A tag' },
  { condition: (el) => !!el.onclick, description: 'has onclick handler' }
];

/**
 * Data attribute sources for button name detection
 * Ordered by preference - first match wins
 */
export const DATA_ATTRIBUTE_SOURCES = [
  { attr: 'data-action', description: 'data-action' },
  { attr: 'data-testid', description: 'test ID' },
  { attr: 'data-cy', description: 'test ID' }
];

/**
 * Text attribute sources for button name detection
 * Ordered by priority - higher priority wins
 */
export const TEXT_ATTRIBUTE_SOURCES = [
  { getter: (el) => el.textContent?.trim(), maxLength: 50, description: 'text', priority: 1 },
  { getter: (el) => el.getAttribute?.('aria-label'), description: 'aria-label', priority: 2 },
  { getter: (el) => el.getAttribute?.('title'), description: 'title', priority: 3 }
];

/**
 * Semantic event names used by the analytics service
 * Centralized to ensure consistency across the application
 */
export const SEMANTIC_EVENT_NAMES = {
  BUTTON_CLICKED: 'Button Clicked',
  LINK_CLICKED: 'Link Clicked',
  INPUT_CLICKED: 'Input Clicked',
  ELEMENT_CLICKED: 'Element Clicked',
  MENU_ITEM_CLICKED: 'Menu Item Clicked',
  MODAL_OPENED: 'Modal Opened'
};

// Constants for property organization mappings
export const PROPERTY_MAPPINGS = {
  ACTION_PREFIX_MAP: {
    button_name: 'action_button',
    menu_name: 'action_menu',
    modal_name: 'action_modal',
    element_text: 'action_text',
    element_type: 'action_type'
  },
  PAGE_PREFIX_MAP: {
    page_name: 'page_name',
    pathname: 'page_path',
    route_pattern: 'page_route'
  },
  DESTINATION_PREFIX_MAP: {
    destination_path: 'destination_path',
    destination_url: 'destination_url'
  },
  CONTEXT_PREFIX_MAP: {
    tenant_id: 'tenant_id',
    timestamp: 'timestamp'
  }
};
