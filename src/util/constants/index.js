import { LogLevel } from '@azure/msal-browser';
import ZoomLogo from '@assets/images/zoom-title-logo.svg';
import SlackLogo from '@assets/images/slack-logo.svg';
import SalesforceLogo from '@assets/images/salesforce-logo.svg';
import CalendarTodayLogo from '@assets/images/calendar-today-logo.svg';
import OutlookLogo from '@assets/images/outlook-logo.svg';
import GoogleCalendarLogo from '@assets/images/google-calendar-logo.svg';
import GmailLogo from '@assets/images/gmail-logo.svg';
import GoogleMeetLogo from '@assets/images/google-meet-logo.png';
import HubspotLogo from '@assets/images/hubspot-logo.svg';
import TeamsLogo from '@assets/images/teams-logo.svg';
import { SFDollarSignCircleIcon, SFEnvelopeOutlined } from '@assets/icons';

export * from './lens.constants';
export * from './feed.constants';

export const PUSHER_APP_CONFIG = {
  cluster: 'us2'
};

/**
 * Get Microsoft Authentication Library (MSAL) Configuration for logging in non-admin users
 * - This allows us to fetch Teams and Channels belonging to the user from the Microsoft Graph API
 * - Instantiates in App.jsx without a microsoftTenantId, which will just let a user sign in from any organization
 *   When the microsoftTenantId is provided they'll only see the account related to this organization
 * @param {string} [microsoftTenantId=common]
 * @see {@link https://learn.microsoft.com/en-us/graph/auth-v2-user?tabs=http} Authenticate on Behalf of User Docs
 * @see {@link https://learn.microsoft.com/en-us/azure/active-directory/develop/tutorial-single-page-app-react-sign-in-users} React MSAL Library Docs
 */
export const MICROSOFT_AUTH_APP_CONFIG = (microsoftTenantId = 'common') => {
  const msalLoggingEnabled = false; // turn this on for testing
  const isDev = import.meta.env.DEV === true;
  const redirectHost = isDev ? 'http://localhost:5173' : window.location.origin;
  return {
    auth: {
      clientId: import.meta.env.VITE_MICROSOFT_CLIENT_ID,
      authority: `https://login.microsoftonline.com/${microsoftTenantId}`,
      redirectUri: `${redirectHost}/callback/teams`
    },
    cache: {
      cacheLocation: 'localStorage', // This configures where your cache will be stored
      storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
    },
    system: {
      loggerOptions: {
        loggerCallback: (level, message, containsPii) => {
          if (!isDev || !msalLoggingEnabled || containsPii) {
            return;
          }
          switch (level) {
            case LogLevel.Error:
              console.error(message);
              return;
            case LogLevel.Info:
              console.info(message);
              return;
            case LogLevel.Verbose:
              console.debug(message);
              return;
            case LogLevel.Warning:
              console.warn(message);
          }
        }
      }
    }
  };
};

/**
 * @constant
 * @type {import('@azure/msal-browser').RedirectRequest}
 */
export const MICROSOFT_AUTH_LOGIN_REQUEST = {
  scopes: ['email', 'profile', 'user.read', 'openid']
};

/**
 * @see {@link https://github.com/summarizator/fora-backend/blob/master/platform-model/src/app/fora/platform/type/TimeZones.java#L19}
 * These timezone ids are in the POSIX Time Zone specification formats
 * @see {@link https://www.postgresql.org/docs/current/datetime-posix-timezone-specs.html#:~:text=A%20POSIX%20time%20zone%20specification,standard%2Dtime%20offset%20from%20UTC.}
 * @see {@link https://en.wikipedia.org/wiki/List_of_tz_database_time_zones}
 * And apparently they can't be converted to the normal IANA format expected by javascript date objects?
 * So we're just gonna set these to their respective expected timezones
 **/
export const FORA_TIMEZONE_IDS = ['EST5EDT', 'CST6CDT', 'MST7MDT', 'PST8PDT'];

export const BACKEND_ID_TO_IANA_MAP = {
  // Provided in user code's FORA_TIMEZONE_MAP (Corrected to IANA)
  EST5EDT: 'America/New_York', // Eastern Time (US & Canada)
  CST6CDT: 'America/Chicago', // Central Time (US & Canada)
  MST7MDT: 'America/Denver', // Mountain Time (US & Canada)
  PST8PDT: 'America/Los_Angeles', // Pacific Time (US & Canada)
  'SystemV/AST4ADT': 'America/Halifax', // Atlantic Standard Time (Likely Canada/Atlantic)
  AST: 'America/Anchorage', // Alaska Standard Time
  'US/Aleutian': 'America/Adak', // Hawaii-Aleutian Standard Time (Aleutian Islands)
  MIT: 'Pacific/Apia', // Apia Standard Time (Midway Islands Time - Samoa)
  NST: 'Pacific/Auckland', // New Zealand Standard Time
  SST: 'Pacific/Guadalcanal', // Solomon Islands Time
  AET: 'Australia/Sydney', // Australian Eastern Standard Time
  ROK: 'Asia/Seoul', // Korean Standard Time (Republic of Korea)
  JST: 'Asia/Tokyo', // Japan Standard Time
  ACT: 'Australia/Darwin', // Australian Central Standard Time
  CTT: 'Asia/Shanghai', // China Standard Time
  VST: 'Asia/Ho_Chi_Minh', // Indochina Time (Vietnam Standard Time)
  BST: 'Asia/Dhaka', // Bangladesh Standard Time
  PLT: 'Asia/Karachi', // Pakistan Standard Time (Pakistan La Hore Time)
  IST: 'Asia/Kolkata', // India Standard Time
  NET: 'Asia/Yerevan', // Armenia Standard Time (Near East Time)
  EAT: 'Africa/Nairobi', // East Africa Time
  EET: 'Europe/Helsinki', // Eastern European Time
  CET: 'Europe/Paris', // Central European Time
  WET: 'Europe/Lisbon', // Western European Time
  CNT: 'America/St_Johns' // Newfoundland Standard Time (Canada Newfoundland Time)
};

// POSIX time zone IDs mapped to their browser-friendly IANA formats
// setting these to non-EDT supported US timezones so that we don't double up the daylight savings calculation on the backend
// this was changed because during daylight savings times digests were being received an hour early. BE requested that we send
// whole-year-universal values
export const FORA_TIMEZONE_MAP = {
  EST5EDT: 'EST',
  CST6CDT: 'CST',
  MST7MDT: 'MST',
  PST8PDT: 'PST',
  'SystemV/AST4ADT': 'AST', // Atlantic Standard Time
  AST: 'AKST', // Alaska Standard Time
  'US/Aleutian': 'HST' // Hawaii-Aleutian Standard Time
};

export const US_STATE_MAP = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY'
};

export const PRIOR_MEETING_SCORE_THRESHOLD = 2;

export const APOLLO_AVATAR_PLACEHOLDER_URL = 'https://static.licdn.com/aero-v1/';
export const BOT_ATTENDEE_EMAILS = [
  'googlemeet@join.fora.day',
  'teams@fora.tools',
  'c_1884o6jojv9nmj8bhsk0bijih1fh2@resource.calendar.google.com'
];

export const FOCUS_COLORS = [
  '#E53935', // Red
  '#D81B60', // Pink
  '#8E24AA', // Purple
  '#5E35B1CC', // Deep Purple
  '#3949AB', // Indigo
  '#1E88E5', // Blue
  '#039BE5', // Light Blue
  '#00A5CC', // Fora Blue
  '#00897B', // Teal
  '#43A047', // Green
  '#7CB342', // Light Green
  '#C0CA33', // Lime
  '#E2C12C', // Yellow
  '#FFB300', // Amber
  '#FB8C00', // Orange
  '#6D4C41', // Brown
  '#757575', // Grey
  '#546E7A', // Blue Grey
  '#3F3F3F', // Dark Grey
  '#000000' // Black
];

export const BG_COLORS = FOCUS_COLORS.slice(0, 9);

export const GUEST_ALLOWED_ROUTES = ['/', '/meeting', '/logout'];

export const PAGE_HEADER_HEIGHT = 77;

const notionBaseUrl = 'https://foraday.notion.site';

export const NOTION_SUPPORT_URL = `${notionBaseUrl}/FORA-Support-Knowledge-Base-Home-58c7ed0b5e3a4bea96000389bcf10461`;
export const NOTION_GLOBAL_SEARCH_URL = `${notionBaseUrl}/Global-Search-at-FORA-f66c91712f0d4902807d93cecbbd035f`;

export const TEMPLATE_EXAMPLES_URL =
  'https://intercom.help/fora/en/articles/10297299-example-templates';

export const REAL_FORA_APOLLO_ID = '65b43856d2741c01c660a1ff';
export const FAKE_FORA_APOLLO_ID = '62a38ffd87d50800de255c02';

export const RECALL_STATUS_CODE_MAP = {
  zoom_local_recording_disabled: 'Zoom Local Recording must be enabled',
  zoom_local_recording_request_disabled: 'Recording requests are disabled by the host',
  zoom_local_recording_request_disabled_by_host: 'Recording requests are disabled by the host',
  zoom_bot_in_waiting_room: 'The bot was unable to join the meeting and was in the waiting room',
  zoom_host_not_present: 'Host did not join to grant recording permission',
  zoom_local_recording_request_denied_by_host: "Host denied FORA's recording request",
  zoom_local_recording_denied: 'Recording requests were denied by the user',
  zoom_local_recording_grant_not_supported:
    'Host is using Zoom Web client, which does not support recording permission',
  zoom_sdk_key_blocked_by_host_admin:
    "The Zoom SDK key used by the bot is blocked by the Zoom user's workspace admin.",
  call_ended_by_host: 'FORA was unable to summarize due to lack of content',
  call_ended_by_platform_idle:
    'The call has been ended by the meeting platform, because it was idle',
  call_ended_by_platform_max_length:
    'The call has been ended by the meeting platform because it reached the maximum meeting length',
  call_ended_by_platform_waiting_room_timeout:
    'FORA stayed in the waiting room and was not admitted',
  timeout_exceeded_waiting_room: 'FORA stayed in the waiting room and was not admitted',
  timeout_exceeded_noone_joined: 'The bot left the call because nobody joined',
  timeout_exceeded_everyone_left: 'FORA was unable to summarize due to lack of content',
  timeout_exceeded_silence_detected: 'FORA was unable to summarize due to lack of content',
  timeout_exceeded_only_bots_detected_using_participant_names:
    'FORA was unable to summarize due to lack of content',
  timeout_exceeded_only_bots_detected_using_participant_events:
    'FORA was unable to summarize due to lack of content',
  timeout_exceeded_only_bots_in_call: 'FORA was unable to summarize due to lack of content',
  timeout_exceeded_in_call_not_recording: 'FORA was unable to summarize due to lack of content',
  timeout_exceeded_max_duration: 'FORA was unable to summarize due to lack of content',
  bot_kicked_from_call: 'FORA was removed from the call by the host',
  bot_kicked_from_waiting_room: 'FORA was removed from the waiting room by the host',
  bot_received_leave_call: 'A user requested FORA be removed from the call',
  bot_errored: 'FORA could not join this meeting. FORA team has been notified',
  meeting_not_found: 'No meeting found at the provided link',
  meeting_not_started: 'FORA tried to join too early',
  meeting_requires_sign_in: 'Only signed-in users can join this meeting',
  meeting_link_expired: 'Meeting link has expired',
  meeting_link_invalid: 'Meeting link is invalid or the meeting does not exist',
  meeting_password_incorrect: 'Meeting password is incorrect',
  meeting_locked: 'Meeting is locked',
  meeting_full: 'Meeting is full',
  meeting_ended: 'Meeting has ended',
  google_meet_internal_error:
    'The bot was unable to join the call due to a Google Meet internal error',
  google_meet_sign_in_failed: 'FORA could not sign in to Google',
  google_meet_sign_in_captcha_failed: 'FORA could not sign in to Google due to CAPTCHA',
  google_meet_sign_in_missing_login_credentials:
    "FORA's Google account credentials were not set up",
  google_meet_sign_in_missing_recovery_credentials:
    'FORA Google account credentials were not set up',
  google_meet_sso_sign_in_failed: 'The bot was not able to sign in to Google with SSO',
  google_meet_sso_sign_in_missing_login_credentials:
    'The bot was not able to sign in to Google with SSO because login credentials were not configured',
  google_meet_sso_sign_in_missing_totp_secret: 'The bot was not able to sign in to Google with SSO',
  google_meet_video_error: 'FORA encountered a Google Meet video error',
  google_meet_meeting_room_not_ready: 'Meeting room was not ready',
  google_meet_login_not_available: 'FORA could not join this meeting. FORA team has been notified',
  zoom_sdk_credentials_missing: 'FORA could not join this meeting. FORA team has been notified',
  zoom_sdk_update_required: 'FORA could not join this meeting. FORA team has been notified',
  zoom_sdk_app_not_published: 'FORA could not join this meeting. FORA team has been notified',
  zoom_email_blocked_by_admin: "FORA's Zoom account is blocked by the admin",
  zoom_registration_required: 'Registration is required for this Zoom meeting',
  zoom_captcha_required: 'CAPTCHA is required for this Zoom meeting',
  zoom_account_blocked: "FORA's Zoom account is blocked",
  zoom_invalid_signature: 'Invalid Zoom meeting link or credentials',
  zoom_internal_error: 'Internal Zoom error',
  zoom_join_timeout: 'Zoom meeting join request timed out',
  zoom_email_required: 'Email is required to join this Zoom meeting',
  zoom_web_disallowed: 'Joining from the web is disallowed by the Zoom host',
  zoom_meeting_not_accessible: 'FORA could not join this meeting. FORA team has been notified',
  microsoft_teams_call_dropped: "FORA was disconnected from MS Teams and couldn't reconnect",
  microsoft_teams_sign_in_credentials_missing:
    'FORA could not join this meeting. FORA team has been notified',
  webex_join_meeting_error: 'FORA could not join this meeting. FORA team has been notified',
  azure_transcription: 'FORA was unable to summarize'
};

export const MARKETING_SITE_BASE_URL = 'https://fora.day';

const toOption = (val) => ({ value: val, label: val, text: val });
export const userTypeOptions = [toOption('Full'), toOption('Executive'), toOption('Admin')];

export const OKTA_CONFIG = {
  clientId: import.meta.env.VITE_OKTA_CLIENT_ID,
  issuer: import.meta.env.VITE_OKTA_ISSUER,
  redirectUri: import.meta.env.VITE_OKTA_REDIRECT_URI,
  scopes: ['openid', 'profile', 'email']
};

export const SOURCE_TYPE_TO_LOGO_MAP = {
  Meeting: ZoomLogo,
  Zoom_Meeting: ZoomLogo,
  Slack: SlackLogo,
  Channel: SlackLogo,
  Email: SFEnvelopeOutlined,
  Salesforce: SalesforceLogo,
  Calendar: CalendarTodayLogo,
  Outlook: OutlookLogo,
  'Google Calendar': GoogleCalendarLogo,
  Gmail: GmailLogo,
  'Google Meet': GoogleMeetLogo,
  Google_Meeting: GoogleMeetLogo,
  Hubspot: HubspotLogo,
  Teams: TeamsLogo,
  Earnings_Call: SFDollarSignCircleIcon
};

export const THINKING_STEP_DISPLAY_MAP = {
  problem_definition: 'Understanding query',
  information_needs: 'Gathering information',
  solution: 'Finalizing response'
};
export const PEOPLE_ORG_STATS_PAGE_SIZE = 15;

export const MAX_AV_FILE_SIZE_MB = 2000;
export const ACCEPTED_AV_FILE_FORMATS = {
  'video/mp4': ['.mp4'],
  'audio/mpeg': ['.mp3']
};

export const MAX_DOC_FILE_SIZE_MB = 300;
export const ACCEPTED_DOC_FILE_FORMATS = {
  'application/pdf': ['.pdf'],
  'application/msword': ['.doc'],
  'application/vnd.openxmlformats-officedocumet.wordprocessingml.document': ['.docx'],
  'application/vnd.ms-excel': ['.xls'],
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
  'text/csv': ['.csv'],
  'text/plain': ['.txt']
};
