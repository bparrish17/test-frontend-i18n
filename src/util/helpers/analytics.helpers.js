import { ANALYTICS_ROUTES } from '@util/constants/analytics.constants';

/**
 * Analytics logging configuration
 * Can be changed dynamically using setAnalyticsLogLevel() function
 * Available levels:
 * 'ALL' - Show all logs (development/debugging)
 * 'INFO' - Show important operations only (staging)
 * 'WARN' - Show warnings and errors only (production)
 * 'OFF' - No analytics logs (silent mode)
 */
let ANALYTICS_LOG_LEVEL = 'OFF';

/**
 * Valid log levels for analytics
 */
const VALID_LOG_LEVELS = ['ALL', 'INFO', 'WARN', 'OFF'];

/**
 * Set analytics log level dynamically
 * @param {string} level - New log level ('ALL', 'INFO', 'WARN', 'OFF')
 * @returns {boolean} Success status
 */
export function setAnalyticsLogLevel(level) {
  const upperLevel = level?.toString().toUpperCase();

  if (!VALID_LOG_LEVELS.includes(upperLevel)) {
    console.warn(
      `[Analytics] Invalid log level: "${level}". Valid levels are:`,
      VALID_LOG_LEVELS.join(', ')
    );
    return false;
  }

  const previousLevel = ANALYTICS_LOG_LEVEL;
  ANALYTICS_LOG_LEVEL = upperLevel;

  console.log(`[Analytics] Log level changed from "${previousLevel}" to "${upperLevel}"`);
  return true;
}

/**
 * Get current analytics log level
 * @returns {string} Current log level
 */
export function getAnalyticsLogLevel() {
  return ANALYTICS_LOG_LEVEL;
}

/**
 * Show available log levels and current level
 */
export function showAnalyticsLogLevels() {
  console.group('[Analytics] Log Level Information');
  console.log('Current level:', ANALYTICS_LOG_LEVEL);
  console.log('Available levels:', VALID_LOG_LEVELS.join(', '));
  console.log('Usage: setAnalyticsLogLevel("LEVEL")');
  console.groupEnd();
}

/**
 * Standalone logging function for analytics
 * @param {string} level - 'DEBUG', 'INFO', 'WARN', or 'ERROR'
 * @param {string} message - Log message
 * @param {...any} args - Additional arguments
 */
export function analyticsLog(level, message, ...args) {
  if (ANALYTICS_LOG_LEVEL === 'OFF') return;

  const shouldLog =
    ANALYTICS_LOG_LEVEL === 'ALL' ||
    (ANALYTICS_LOG_LEVEL === 'INFO' && ['INFO', 'WARN', 'ERROR'].includes(level)) ||
    (ANALYTICS_LOG_LEVEL === 'WARN' && ['WARN', 'ERROR'].includes(level));

  if (shouldLog) {
    // Use appropriate console method based on level
    switch (level) {
      case 'ERROR':
        console.error(message, ...args);
        break;
      case 'WARN':
        console.warn(message, ...args);
        break;
      case 'INFO':
        console.info(message, ...args);
        break;
      default:
        console.log(message, ...args);
        break;
    }
  }
}

/**
 * Get analytics configuration for a given pathname
 * @param {string} pathname - The current pathname
 * @returns {Object} Analytics configuration object with matched pattern
 */
export function getAnalyticsConfigForRoute(pathname) {
  analyticsLog('DEBUG', '[AnalyticsRoutes] 🔍 Getting config for pathname:', pathname);
  analyticsLog(
    'DEBUG',
    '[AnalyticsRoutes] 📋 Available route patterns:',
    Object.keys(ANALYTICS_ROUTES)
  );

  // Check for exact matches first
  for (const [routePattern, config] of Object.entries(ANALYTICS_ROUTES)) {
    if (routePattern === 'default') continue;

    analyticsLog('DEBUG', '[AnalyticsRoutes] 🔍 Checking pattern:', routePattern);

    // Convert route pattern to regex
    let regexPattern = routePattern
      .replace(/:[^/]+/g, '[^/]+') // Replace :param with regex
      .replace(/\*/g, '.*'); // Replace * with regex

    // Special handling for wildcard patterns to match both base path and sub-paths
    if (routePattern.endsWith('/*')) {
      const basePath = routePattern.slice(0, -2); // Remove /*
      regexPattern = `^${basePath.replace(/:[^/]+/g, '[^/]+').replace(/\*/g, '.*')}(?:/.*)?$`;
    } else {
      regexPattern = `^${regexPattern}$`;
    }

    const regex = new RegExp(regexPattern);

    analyticsLog(
      'DEBUG',
      '[AnalyticsRoutes] 🔍 Testing regex:',
      regex.source,
      'against:',
      pathname
    );

    if (regex.test(pathname)) {
      analyticsLog('DEBUG', '[AnalyticsRoutes] ✅ Route pattern matched:', routePattern);
      analyticsLog('DEBUG', '[AnalyticsRoutes] 📋 Returning config:', config);
      return {
        ...config,
        matchedPattern: routePattern
      };
    }
  }

  analyticsLog('DEBUG', '[AnalyticsRoutes] ❌ No route pattern matched, returning default config');
  return {
    ...ANALYTICS_ROUTES.default,
    matchedPattern: null
  };
}

// Make analytics logging functions available on window for console access
if (typeof window !== 'undefined') {
  window.setAnalyticsLogLevel = setAnalyticsLogLevel;
  window.getAnalyticsLogLevel = getAnalyticsLogLevel;
  window.showAnalyticsLogLevels = showAnalyticsLogLevels;

  // Add a helper function to show all available analytics console commands
  window.showAnalyticsConsoleHelp = function () {
    console.group('[Analytics] Console Commands');
    console.log('setAnalyticsLogLevel(level) - Set log level (ALL, INFO, WARN, OFF)');
    console.log('getAnalyticsLogLevel() - Get current log level');
    console.log('showAnalyticsLogLevels() - Show level information');
    console.log('showAnalyticsConsoleHelp() - Show this help');
    console.groupEnd();
  };
}

export const failedBotStatusCodes = [
  'in_call_not_recording',
  'recording_permission_denied',
  'in_waiting_room',
  'call_ended',
  'fatal'
];

export const failedBotStatusSubCodes = [
  'zoom_local_recording_disabled',
  'zoom_local_recording_request_disabled_by_host',
  'zoom_host_not_present',
  'zoom_local_recording_request_denied_by_host',
  'zoom_local_recording_grant_not_supported',
  'timeout_exceeded_waiting_room',
  'bot_kicked_from_call',
  'bot_kicked_from_waiting_room',
  'bot_received_leave_call',
  'call_ended_by_platform_waiting_room_timeout',
  'bot_errored',
  'meeting_not_found',
  'meeting_not_started',
  'meeting_requires_sign_in',
  'meeting_link_expired',
  'meeting_link_invalid',
  'meeting_password_incorrect',
  'meeting_locked',
  'meeting_full',
  'meeting_ended',
  'google_meet_sign_in_missing_login_credentials',
  'google_meet_sign_in_failed',
  'google_meet_sign_in_captcha_failed',
  'google_meet_video_error',
  'google_meet_meeting_room_not_ready',
  'zoom_email_blocked_by_admin',
  'zoom_registration_required',
  'zoom_captcha_required',
  'zoom_account_blocked',
  'zoom_invalid_signature',
  'zoom_internal_error',
  'zoom_join_timeout',
  'zoom_email_required',
  'zoom_web_disallowed',
  'microsoft_teams_call_dropped'
];

const statusMap = {
  in_call_not_recording: {
    value: 'in_call_not_recording',
    description: 'Bot joined the call but was never explicitly given permission to record'
  },
  recording_permission_denied: {
    zoom_local_recording_disabled: {
      value: 'zoom_local_recording_disabled',
      description:
        'The meeting host has disabled local recording for the meeting. (meeting host is not presented with recording consent popup)'
    },
    zoom_local_recording_request_disabled_by_host: {
      value: 'zoom_local_recording_request_disabled_by_host',
      description:
        'The meeting host has disabled participants from requesting local recording permission or has denied all future requests. (meeting host is not presented with recording consent popup)'
    },
    zoom_host_not_present: {
      value: 'zoom_host_not_present',
      description:
        'Meeting host never showed up and as a result could not grant recording permission'
    },
    zoom_local_recording_request_denied_by_host: {
      value: 'zoom_local_recording_request_denied_by_host',
      description:
        // prettier-ignore
        'The host denied the bot\'s local recording request. (meeting host is presented with recording consent popup)'
    },
    zoom_local_recording_grant_not_supported: {
      value: 'zoom_local_recording_grant_not_supported',
      description:
        'The meeting host is using Zoom Web client to host the meeting which does not support local recording permission.'
    },
    value: 'recording_permission_denied',
    description: 'Bot joined the call but was explicitly denied permission to record'
  },
  in_waiting_room: {
    value: 'in_waiting_room',
    description: 'Bot never left the waiting room'
  },
  call_ended: {
    timeout_exceeded_waiting_room: {
      value: 'timeout_exceeded_waiting_room',
      description:
        'Bot sat in the waiting room for too long and was automatically kicked by the platform'
    },
    bot_kicked_from_call: {
      value: 'bot_kicked_from_call',
      description:
        'Bot was explicitly kicked from the call by the meeting host using the videoconference platform'
    },
    bot_kicked_from_waiting_room: {
      value: 'bot_kicked_from_waiting_room',
      description:
        'Bot was explicitly kicked from the waiting room by the meeting host using the videoconference platform'
    },
    bot_received_leave_call: {
      value: 'bot_received_leave_call',
      description:
        'Bot was kicked from the call via API (e.g. someone used the FORA app to get someone to leave)'
    },
    call_ended_by_platform_waiting_room_timeout: {
      value: 'call_ended_by_platform_waiting_room_timeout',
      description: 'Bot was sitting in the waiting room when the call ended'
    }
  },
  fatal: {
    bot_errored: {
      value: 'bot_errored',
      description: '"unexpected" error message (akin to a "500 internal server error)'
    },
    meeting_not_found: {
      value: 'meeting_not_found',
      description: 'No meeting was found at the given link.'
    },
    meeting_not_started: {
      value: 'meeting_not_started',
      description: 'Bot tried to join too far in advance of the start time'
    },
    meeting_requires_sign_in: {
      value: 'meeting_requires_sign_in',
      description: 'The meeting can only be joined by signed in users'
    },
    meeting_link_expired: {
      value: 'meeting_link_expired',
      description: 'The meeting does not exist or the link is invalid.'
    },
    meeting_password_incorrect: {
      value: 'meeting_password_incorrect',
      description: 'The meeting password is incorrect.'
    },
    meeting_locked: {
      value: 'meeting_locked',
      description: 'The meeting is locked.'
    },
    meeting_full: {
      value: 'meeting_full',
      description: 'The meeting is full.'
    },
    meeting_ended: {
      value: 'meeting_ended',
      description: 'The meeting has ended.'
    },
    google_meet_sign_in_missing_login_credentials: {
      value: 'google_meet_sign_in_missing_login_credentials',
      description:
        'The bot was not able to sign in to google because login credentials were not configured.'
    },
    google_meet_sign_in_failed: {
      value: 'google_meet_sign_in_failed',
      description: 'The bot was not able to sign in to google.'
    },
    google_meet_sign_in_captcha_failed: {
      value: 'google_meet_sign_in_captcha_failed',
      description: 'The bot was not able to sign in to google because of captcha.'
    },
    google_meet_video_error: {
      value: 'google_meet_video_error',
      description: 'The bot was not able to join the call due to Google Meet video error.'
    },
    google_meet_meeting_room_not_ready: {
      value: 'google_meet_meeting_room_not_ready',
      description: 'The bot was not able to join the call as the meeting room was not ready.'
    },
    zoom_email_blocked_by_admin: {
      value: 'zoom_email_blocked_by_admin',
      description:
        'The Zoom account this bot is joining from has been disallowed to join this meeting by the Zoom workspace administrator.'
    },
    zoom_registration_required: {
      value: 'zoom_registration_required',
      description: 'The bot failed to join because registration is required for this Zoom meeting.'
    },
    zoom_captcha_required: {
      value: 'zoom_captcha_required',
      description: 'The bot failed to join because captcha is required for this Zoom meeting.'
    },
    zoom_account_blocked: {
      value: 'zoom_account_blocked',
      description: 'The account this bot is joining from has been blocked by Zoom.'
    },
    zoom_invalid_signature: {
      value: 'zoom_invalid_signature',
      description:
        'The Zoom SDK was not able to generate a valid meeting-join signature. This could mean that the meeting link is malformed, or the Zoom SDK credentials provided are invalid.'
    },
    zoom_internal_error: {
      value: 'zoom_internal_error',
      description: 'The bot failed to join due to an internal Zoom error.'
    },
    zoom_join_timeout: {
      value: 'zoom_join_timeout',
      description: 'The request to join the Zoom meeting timed out.'
    },
    zoom_email_required: {
      value: 'zoom_email_required',
      description:
        'The bot failed to join because providing an email is required to join this Zoom meeting.'
    },
    zoom_web_disallowed: {
      value: 'zoom_web_disallowed',
      description:
        'The Zoom meeting host has disallowed joining from the web which prevents the bot from joining the meeting.'
    },
    microsoft_teams_call_dropped: {
      value: 'microsoft_teams_call_dropped',
      description:
        'The bot got call dropped error from MS Teams and was unable to re-join the call.'
    },
    value: 'fatal',
    description: 'Bot encountered a fatal error'
  }
};

/** @returns {{value: string, description: string}} */
export function getBotFailureReason(bot) {
  if (!bot?.status_changes) {
    return;
  }

  const statusChanges = bot.status_changes;

  let value = '-';
  let description = '';

  const lastTwoStatusChanges = statusChanges.slice(statusChanges.length - 2);

  lastTwoStatusChanges.forEach((statusChange) => {
    const { code, sub_code: subCode } = statusChange;
    const statusChangeValue = statusMap[code]?.[subCode]?.value ?? statusMap[code]?.value;
    const statusChangeDescription =
      statusMap[code]?.[subCode]?.description ?? statusMap[code]?.description;

    if (statusChangeValue) {
      value = statusChangeValue;
    }

    if (statusChangeDescription) {
      description = statusChangeDescription;
    }
  });

  return { value, description };
}
