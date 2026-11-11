# Analytics System Architecture

## Overview

The Fora analytics system provides automated user behavior tracking across multiple platforms (Statsig, Pendo) with intelligent event detection, route-based configuration, and comprehensive debugging tools.

### Core Components
```
analytics.service.js        # Main service API
analytics.config.js         # Configuration management  
analytics.helpers.js        # Utilities and route matching
analytics.constants.js      # Mappings and configurations
```

---

## Quick Start

### Basic Setup
```javascript
// App.jsx - Initialize when Statsig client is ready
import { initializeAnalytics } from '@services/analytics.service';

useEffect(() => {
  if (ssClient && user) {
    initializeAnalytics(ssClient, user, tenant, location);
  }
}, [ssClient, user, tenant, location]);
```

### Manual Tracking
```javascript
import analyticsService from '@services/analytics.service';

// Track button clicks
analyticsService.trackButtonClick('save-template', { 
  templateType: 'meeting' 
});

// Track menu interactions
analyticsService.trackMenuClick('export-menu', { 
  format: 'pdf' 
});

// Track modal events
analyticsService.trackModalOpen('delete-confirmation', {
  itemType: 'meeting'
});
```

---

## Configuration Reference

### AnalyticsConfig Class

#### Core Configuration
```javascript
const config = new AnalyticsConfig({
  logging: {
    level: 'ALL',                    // 'ALL', 'INFO', 'WARN', 'OFF'
    enableConsoleAccess: true
  },
  tracking: {
    captureTypes: ['clicks'],
    ignoreSelectors: [],
    autoTrack: true,
    enableDeferredTracking: true
  },
  platforms: {
    statsig: { enabled: true, useValueField: true },
    pendo: { enabled: true, sendOriginalProperties: true }
  },
  routes: {
    defaultAutoTrack: false
  }
});
```

#### Configuration Methods
```javascript
// Getters
config.getLoggingConfig()
config.getTrackingConfig()
config.getPlatformConfig('statsig')
config.getRouteConfig()

// Updates
config.updateTrackingConfig({ autoTrack: false });
config.updatePlatformConfig('pendo', { enabled: false });

// Validation
const { isValid, errors } = config.validate();
```

### Route Configuration
```javascript
// analytics.constants.js
export const ANALYTICS_ROUTES = {
  '/meeting/:meetingId': {
    autoTrack: true,
    trackingConfig: {
      captureTypes: ['clicks'],
      ignoreSelectors: ['.navigation']
    }
  },
  '/settings/*': {
    autoTrack: false
  }
};
```

---

## API Documentation

### Service Methods

#### Automatic Tracking
- **Auto-enabled** on configured routes
- **Smart element detection** via multiple strategies
- **Route-based control** with ignore selectors

#### Manual Tracking
```javascript
// Button tracking
trackButtonClick(buttonName, properties?)

// Menu tracking  
trackMenuClick(menuName, properties?)

// Modal tracking
trackModalOpen(modalName, properties?)

// Generic events
trackEvent(eventName, properties?)
```

### Helper Functions

#### Logging Control
```javascript
// Runtime log level control
setAnalyticsLogLevel('INFO');    // ALL, INFO, WARN, OFF
getAnalyticsLogLevel();
showAnalyticsLogLevels();

// Available in browser console
window.setAnalyticsLogLevel('ALL');
```

#### Route Utilities
```javascript
// Get route configuration
getAnalyticsConfigForRoute('/meeting/123');
// Returns: { autoTrack: true, trackingConfig: {...}, matchedPattern: '/meeting/:meetingId' }

// Bot failure analysis
getBotFailureReason(bot);
// Returns: { value: 'zoom_local_recording_disabled', description: '...' }
```

---

## Detection Strategies

### Element Detection
The system identifies trackable elements using multiple strategies:

1. **HTML Tags**: `<button>`, `<a>`, `<input>`
2. **ARIA Roles**: `role="button"`
3. **Event Handlers**: Elements with `onclick`
4. **Data Attributes**: `data-action`, `data-testid`, `data-cy`

### Button Name Detection
Priority order for button naming:
1. **Data attributes** (`data-action`)
2. **Text content** (cleaned and sanitized)
3. **ARIA labels** (`aria-label`)
4. **Icon classes** (mapped to actions)
5. **Navigation paths** (URL-based inference)

### Navigation & Icon Mappings
```javascript
// Path mappings
NAVIGATION_PATH_MAPPINGS = {
  '/': 'nav-home',
  '/meeting': 'nav-meetings',
  '/settings': 'nav-settings'
  // ...
}

// Icon mappings
ICON_CLASS_MAPPINGS = {
  'SFTrashIcon': 'delete',
  'SFShareIcon': 'share',
  'plus': 'add'
  // ...
}
```

---

## Event Structure

### Event Properties
Events include organized properties with semantic prefixes:

```javascript
{
  // Action properties
  action_button: 'save-template',
  action_text: 'Save Template',
  action_type: 'button',
  
  // Page properties
  page_name: 'meeting_detail',
  page_path: '/meeting/123',
  page_route: '/meeting/:meetingId',
  
  // Context
  tenant_id: 'tenant_456',
  timestamp: '2025-01-20T10:30:00.000Z'
}
```

### Semantic Event Names
- `Button Clicked` - For button interactions
- `Link Clicked` - For link navigation
- `Menu Item Clicked` - For menu selections
- `Modal Opened` - For modal displays
- `Input Clicked` - For form inputs

---

## Platform Integration

### Statsig
- **Primary platform** for event tracking
- **Value generation** for navigation flow analysis
- **Flat property structure** optimized for metadata display

### Pendo
- **Ready for activation** with complete integration code
- **Flexible configuration** for property handling
- **Event mapping** compatible with Pendo conventions

---

## Development Tools

### Console Commands
```javascript
// Enable debug logging
setAnalyticsLogLevel('ALL');

// Check configuration
getAnalyticsConfigForRoute(pathname);

// Get help
showAnalyticsConsoleHelp();
```

### Debug Output Examples
```
[Analytics] 🛣️ Route changed: /dashboard -> /meeting/123
[Analytics] ✅ Route pattern matched: /meeting/:meetingId
[Analytics] 🖱️ Auto-tracked click: save-changes on meeting_detail
[Analytics] ✅ Sent to Statsig: Button Clicked
```

### Performance Features
- **Route configuration caching** with automatic eviction
- **Duplicate processing prevention** for performance
- **Deferred tracking** for non-blocking event processing
- **Memory management** with automatic cleanup

---

## Testing

The system includes comprehensive test coverage:
- **Service Tests**: 82 tests covering core functionality
- **Config Tests**: 38 tests for configuration management
- **Helpers Tests**: 41 tests for utilities and route matching
- **Total**: 161 tests across all components

---

## Extension Guide

### Adding Route Configuration
```javascript
// Add to ANALYTICS_ROUTES in analytics.constants.js
'/new-feature/:id': {
  autoTrack: true,
  trackingConfig: {
    captureTypes: ['clicks'],
    ignoreSelectors: ['.navigation']
  }
}
```

### Adding Event Types
```javascript
// Add manual event configuration
analyticsService.config.addManualEventConfig('form', {
  dataField: 'form_name',
  semanticEventName: 'Form Submitted'
});
```

### Adding Platform Support
```javascript
// Add platform configuration
analyticsService.config.updatePlatformConfig('newPlatform', {
  enabled: true,
  apiKey: 'platform-key'
});
```

This architecture provides a production-ready analytics foundation with automatic tracking, comprehensive configuration, and robust debugging capabilities. 
