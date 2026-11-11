import {
  format,
  add,
  isWeekend,
  nextMonday,
  startOfTomorrow,
  startOfMonth,
  formatDuration,
  intervalToDuration,
  isSameYear,
  set,
  fromUnixTime,
  getYear,
  getDate,
  differenceInDays,
  getMinutes,
  addSeconds,
  isYesterday,
  isToday,
  subDays,
  addYears,
  startOfDay,
  isEqual,
  formatDistanceToNowStrict
} from 'date-fns';
import { getTimezoneOffset, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';
import { isArray, isNil, reduce } from 'lodash-es';

import { hours } from './general.helpers';
import { BACKEND_ID_TO_IANA_MAP } from '@util/constants';

const UNIT_ORDER = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds'];
const TIME_UNITS = {
  years: { ms: 31536000000, label: 'years', symbol: 'y' },
  months: { ms: 2592000000, label: 'months', symbol: 'mo' },
  weeks: { ms: 604800000, label: 'weeks', symbol: 'w' },
  days: { ms: 86400000, label: 'days', symbol: 'd' },
  hours: { ms: 3600000, label: 'hours', symbol: 'h' },
  minutes: { ms: 60000, label: 'minutes', symbol: 'm' },
  seconds: { ms: 1000, label: 'seconds', symbol: 's' }
};

/** @typedef {'short-mmm-d' | 'short-P' | 'short-hmm' | 'long'} DateTimeVariant */
/** @typedef {'single' | 'short' | 'long'} FormattedDurationVariant */
/**
 *
 * @param {*} time
 * @param {FormattedDurationVariant} variant
 * @returns
 */
export const formatTimeDistance = (time, variant = 'long') =>
  time
    ? `${formatDistanceToNowStrict(new Date(time), {
        locale: getCommonDurationLocale(variant)
      })} ago` // for some reason `addSuffix` doesn't work with a custom locale and there's no token to replace it with in the custom locale
    : '';

/**
 * Converts meeting start/end times to readable meeting time
 * @param {Partial<{ start_at: number; end_at: number }>} meeting
 * @param {DateTimeVariant} variant
 * @returns {string}
 *
 * todo: add "truncateZeroes" option here for whether or not you want to shorten 10:00 => 10
 */
export const formatMeetingDateTime = (meeting, variant = 'long') => {
  const startAt = meeting?.start_at;
  const endAt = meeting?.end_at;
  if (!startAt || !endAt) {
    return '';
  }

  const samePeriod = format(startAt, 'a') === format(endAt, 'a');
  const startFormats = {
    'short-mmm-d': 'MMM d, ', // Dec 10, 10-10:30 AM
    'short-P': 'P, ', // 12/10/2023, 10-10:30 AM,
    'short-hmm': '', // 10-10:30 AM
    'short-p': '', // 10:00-10:30 AM
    long: 'ccc PP, ' // Sun Dec 10, 2023, 10:00 AM - 10:45 AM
  };
  let startAtFormat;
  let endAtFormat;

  if (variant === 'short-p') {
    startAtFormat = 'p';
    endAtFormat = 'p';
  } else {
    startAtFormat = `${startFormats[variant]}h${getMinutes(startAt) !== 0 ? ':mm' : ''}${
      samePeriod ? '' : ' a'
    }`;
    endAtFormat = `h${getMinutes(endAt) !== 0 ? ':mm' : ''} a`;
  }

  const hyphen = variant === 'long' || variant === 'long-hmm' ? ' - ' : '–';

  return meeting?.start_at && meeting?.end_at
    ? `${format(startAt, startAtFormat)}${hyphen}${format(endAt, endAtFormat)}`
    : '';
};

/**
 * Shared function for getting shortened format for date-fns duration functions
 *
 * date-fns's formatDuration doesn't offer custom formats like regular format so we have to create a custom locale
 * for "short" format on the duration
 * @param {'single' | 'short' | 'long'} variant
 */
export const getCommonDurationLocale = (variant) => {
  /**
   *
   * @param {{ [key: FormatDistanceToken]: string } formatLocale
   * @see {@link https://date-fns.org/v4.1.0/docs/formatDistanceToNow#types/FormatDistanceToken/2326}
   * @returns
   */
  const getLocale = (formatLocale) => ({
    formatDistance: (token, count) => {
      return formatLocale[token] ? formatLocale[token].replace('{{count}}', count) : count;
    }
  });

  const formatLocales = {
    single: getLocale({
      xSeconds: '{{count}}s',
      xMinutes: '{{count}}m',
      xHours: '{{count}}h',
      xDays: '{{count}}d',
      xWeeks: '{{count}}w',
      xMonths: '{{count}} months'
    }),
    short: getLocale({
      xSeconds: '{{count}} sec',
      xMinutes: '{{count}} min',
      xHours: '{{count}} hr',
      xDays: '{{count}} days',
      xWeeks: '{{count}} weeks',
      xMonths: '{{count}} months'
    }),
    long: undefined
  };

  return formatLocales[variant];
};

/**
 *
 * @param {Partial<{ start_at: number; end_at: number }>} meeting
 * @param {FormattedDurationVariant} variant
 * @returns {string} Meeting duration formatted in hours/minutes
 * variants
 * - short: "1h 30m"
 * - long: "1 hour 30 minutes"
 */
export const formatMeetingDuration = (startAt, endAt, variant = 'single') => {
  if (startAt && endAt) {
    const duration = intervalToDuration({
      start: new Date(startAt),
      end: new Date(endAt)
    });
    return formatTimeDuration(duration, variant);
  }
  return null;
};

/**
 * Helper to allow us to do durations with custom text formats. Workaround for date-fns limitation
 * @param {import('date-fns').Duration} duration
 * @param {FormattedDurationVariant} variant
 * @see {@link https://github.com/date-fns/date-fns/issues/2134}
 */
export const formatTimeDuration = (duration, variant = 'single', options = {}) => {
  return formatDuration(duration, {
    format: ['hours', 'minutes', 'seconds'],
    locale: getCommonDurationLocale(variant),
    ...options
  });
};

/**
 * Generates duration from a value past zero, rather than two dates
 * @param {number} elapsedTime - elapsedTime in milliseconds
 * @param {FormattedDurationVariant} variant
 * @returns {string} formatted duration
 */
export const formatTimeDurationFromZero = (elapsedTime, variant = 'single') => {
  if (!elapsedTime) {
    return '';
  }

  const duration = intervalToDuration({ start: 0, end: elapsedTime });
  return formatDuration(duration, {
    format: ['hours', 'minutes', 'seconds'],
    locale: getCommonDurationLocale(variant)
  });
};

export const formatMeetingTime = (meeting) =>
  meeting?.start_at && meeting?.end_at
    ? `${format(new Date(meeting?.start_at), 'hh:mm')}-${format(new Date(meeting?.end_at), 'p')}`
    : '';

export const formatCardCreatedTime = (card) =>
  card?.created_at &&
  `${format(new Date(card.created_at), 'P')} at ${format(new Date(card.created_at), 'p')}`;

export const getNextWeekday = (date) => {
  const tomorrow = add(date, { days: 1 });
  return isWeekend(tomorrow) ? nextMonday(date) : tomorrow;
};
/**
 *
 * @param {'daily' | 'weekdays' | 'weekly' | 'monthly'} cadence
 * @returns {string} cron schedule string
 * @example daily - returns "0 0 * * *" (Every day at 00:00)
 * @example weekly - returns "0 0 * * 0" (Every monday at 00:00)
 * @example monthly - returns "0 0 1 * *" (1st day of every month at 00:00)
 */
export const formatCadenceToCron = (cadence, timezone) => {
  const duration = timezone
    ? intervalToDuration({
        start: 0,
        end: getTimezoneOffset(timezone)
      })
    : { hours: 0, minutes: 0 };

  let dayOfMonth;
  let dayOfWeek;
  if (cadence === 'daily') {
    dayOfMonth = '*';
    dayOfWeek = '*';
  } else if (cadence === 'weekdays') {
    dayOfMonth = '*';
    dayOfWeek = '1-5';
  } else if (cadence === 'weekly') {
    dayOfMonth = '*';
    dayOfWeek = '1';
  } else if (cadence === 'monthly') {
    dayOfMonth = '1';
    dayOfWeek = '*';
  }
  return `${duration.minutes} ${duration.hours} ${dayOfMonth} * ${dayOfWeek}`;
};

export const formatCronToCadence = (cronExpr) => {
  if (!cronExpr) {
    return null;
  }

  const cronParts = cronExpr.split(' ');
  const dayOfMonth = cronParts[2];
  const dayOfWeek = cronParts[4];

  if (dayOfMonth === '*' && dayOfWeek === '*') {
    return 'daily';
  }
  if (dayOfWeek !== '*') {
    return 'weekly';
  }
  return 'monthly';
};

/**
 * @param {string} cronExpr - cron schedule string
 * @param {number} nextRunTimestamp - date object
 * @returns {string} human readable string
 * @desc Accounts only for daily, weekly, and monthly cadences
 */
export const formatCronToHumanReadable = (cronExpr, nextRunTimestamp) => {
  if (!cronExpr || !nextRunTimestamp) {
    return '';
  }

  let date;
  try {
    date = new Date(nextRunTimestamp);
  } catch (error) {
    return '';
  }

  const cronParts = cronExpr.split(' ');
  const [minute, hour] = cronParts;
  const dayOfMonth = cronParts[2];
  const dayOfWeek = cronParts[4];

  let cadence;
  let day;

  if (dayOfMonth === '*' && dayOfWeek === '*') {
    cadence = 'daily';
    day = '';
  } else if (dayOfWeek !== '*') {
    cadence = 'weekly';
    day = ` on ${format(date, 'EEEE')}`;
  } else {
    cadence = 'monthly';
    day = ` on ${format(date, 'do')}`;
  }

  const timeDate = new Date();
  timeDate.setHours(hour === '*' ? 0 : parseInt(hour));
  timeDate.setMinutes(minute === '*' ? 0 : parseInt(minute));
  const time = format(timeDate, 'h:mm a');

  return `${cadence}${day} at ${time}`;
};

/**
 * @param {"daily" | "weekly" | "monthly"} cadenceInterval
 * @param {string} - timezone in IANA format (America/Los_Angeles)
 * @returns {Date | null} nextRunAt
 */
export const getNextRunAt = (cadenceInterval, timezone) => {
  let nextRunAt;
  if (cadenceInterval === 'daily') {
    nextRunAt = startOfTomorrow();
  } else if (cadenceInterval === 'weekly') {
    nextRunAt = startOfDay(nextMonday(new Date()));
  } else if (cadenceInterval === 'monthly') {
    nextRunAt = startOfMonth(add(new Date(), { months: 1 }));
  } else {
    return null;
  }

  // convert from default browser timezone to configured timezone on user or tenant record
  return zonedTimeToUtc(nextRunAt, timezone);
};

// created since the "ceil" arg for "roundingMethod" in date-fns.roundToNearestMinutes
// rounds above the next interval if above 50% of that interval
export const roundUpToNearestMin = (date, interval) => {
  const minutes = date.getMinutes();
  const nearestInterval = Math.ceil(minutes / interval) * interval;
  date.setMinutes(nearestInterval);
  return date;
};

// format for descriptive date in calendar
// Wednesday, Jan 3 (if date is current year)
// Wednesday, Jan 3, 2022 (if date is not current year)
export const formatCalendarDate = (date) => {
  const today = new Date();
  const dateFormat = isSameYear(date, today) ? 'EEEE, MMM d' : 'EEEE, MMM d, yyyy';
  return format(date, dateFormat);
};

/**
 * Format for descriptive date in 'Views' section
 *
 * i.e.
 *
 * Today, 11:00 am
 * Wed, Nov 6, 11:00 am
 *
 * @param {String} timestamp, ex: 1732648517931
 * @returns {String} human readable date string
 */
export const formatViewDate = (timestamp) => {
  // Convert timestamp to Date object
  const viewDate = timestamp ? new Date(Number(timestamp)) : null;

  // Safeguard against invalid dates
  if (!viewDate || isNaN(viewDate)) {
    return null;
  }

  // Define date formats
  const timeFormat = 'h:mm a';
  const fullDateFormat = isSameYear(viewDate, new Date()) ? 'E, MMM d' : 'E, MMM d, yyyy';

  // Determine what to display
  const datePrefix = isToday(viewDate) ? 'Today, ' : format(viewDate, fullDateFormat) + ', ';
  return datePrefix + format(viewDate, timeFormat);
};

const toMinutesAfterMidnight = (hours, minutes) => Number(hours) * 60 + Number(minutes);

/**
 * Number of minutes from 12:00 AM midnight
 * @param {string} hhmm - e.g. 12:20, 02:09
 * @returns {number} - 0 < 1439
 */
export const hhmmToMinutes = (hhmm) => {
  const [hours, minutes] = hhmm.split(':');
  return toMinutesAfterMidnight(hours, minutes);
};

/**
 * Converts minutes since midnight to the hours/minutes of that time
 * @param {number} durationInMinutes - 0 < 1439
 * @returns {string} - e.g. 12:20
 */
export const minutesToHHMM = (durationInMinutes) => {
  if (durationInMinutes === 0) {
    return '00:00';
  }
  if (!durationInMinutes) {
    return '';
  }

  const hours = Math.floor(durationInMinutes / 60);
  const minutes = durationInMinutes % 60;
  const addZero = (val) => (val < 10 ? `0${val}` : val);
  return `${addZero(hours)}:${addZero(minutes)}`;
};

/**
 * Normalizes provided Date/Timezone to UTC minutes after midnight
 * @param {string} time - time string in hh:mm format
 * @param {string} timezone - IANA timeZone, e.g. America/New_York, Pacific/Tahiti, Europe/Berlin
 * @returns {number} - number of minutes after midnight UTC for that timezone
 * @example hhmmToUTCMinutes('08:00', 'America/Los_Angeles') => 960 ('16:00 UTC')
 * @example hhmmToUTCMinutes('16:30', 'Europe/Paris') => 930 ('15:30 UTC')
 */
export function hhmmToUTCMinutes(time, timeZone) {
  if (!time || !timeZone) {
    return null;
  }

  const [hours, minutes] = time.split(':').map(Number);
  const localTime = set(new Date(), { hours: hours === 0 ? 24 : hours, minutes });
  const utcTime = zonedTimeToUtc(localTime, timeZone);
  return toMinutesAfterMidnight(utcTime.getUTCHours(), utcTime.getUTCMinutes());
}

/**
 * Normalizes provided Date/Timezone to UTC minutes after midnight
 * @param {number} minutesAfterMidnight - # of minutes since UTC 00:00:00
 * @param {string} timezone - IANA timeZone, e.g. America/New_York, Pacific/Tahiti, Europe/Berlin
 * @returns {string} - hh:mm in provided timezone
 * @example utcMinutesToHHMM(960, 'America/Los_Angeles') => '08:00' ('16:00 UTC')
 * @example utcMinutesToHHMM(930, 'Europe/Paris') => '16:30' ('15:30 UTC')
 */
export function utcMinutesToHHMM(minutesAfterMidnight, timeZone) {
  if (isNil(minutesAfterMidnight)) {
    return '';
  }
  const hours = Math.floor(minutesAfterMidnight / 60);
  const minutes = minutesAfterMidnight % 60;
  const utcTime = new Date();
  utcTime.setUTCHours(hours);
  utcTime.setUTCMinutes(minutes);

  const adjustedTzTime = utcToZonedTime(utcTime.toISOString(), timeZone);
  const utcMinutesAfterMidnight = toMinutesAfterMidnight(
    adjustedTzTime.getHours(),
    adjustedTzTime.getMinutes()
  );
  return minutesToHHMM(utcMinutesAfterMidnight);
}

/**
 * @param {string} timeZone - Iana timezone format, e.g. America/New_york
 * @returns {string} - string format in timezone abbreviation, e.g. EST, CST, CEST
 */
export const ianaTzToAbbreviation = (timeZone) => {
  const usTZs = new Set(['EST', 'CST', 'MST', 'PST']);
  if (usTZs.has(timeZone)) return timeZone;

  return new Intl.DateTimeFormat('en', {
    timeZone,
    timeZoneName: 'short'
  })
    .formatToParts(new Date())
    .find((part) => part.type === 'timeZoneName').value;
};

export function getIanaTzName(id) {
  return BACKEND_ID_TO_IANA_MAP[id] || id;
}

export const getBrowserTimezone = () => Intl.DateTimeFormat().resolvedOptions().timeZone;

export const addMeetingDurations = (meetings) => {
  const { hours, minutes } = reduce(
    meetings,
    (acc, meeting) => {
      const startAt = new Date(meeting?.start_at);
      const endAt = new Date(meeting.end_at);
      const duration = intervalToDuration({ start: startAt, end: endAt });
      return {
        hours: acc.hours + duration.hours,
        minutes: acc.minutes + duration.minutes
      };
    },
    { hours: 0, minutes: 0 }
  );

  const formattedMinutes = minutes % 60;
  const formattedHours = hours + Math.floor(minutes / 60);

  return { hours: formattedHours, minutes: formattedMinutes };
};

export const intervalToFormattedDuration = (startDate, endDate, format) => {
  try {
    const duration = intervalToDuration({ start: startDate, end: endDate });
    return formatDuration(duration, { format });
  } catch (e) {
    return null;
  }
};
export function today(formatStr = 'LL/dd/yyyy') {
  return format(new Date(), formatStr);
}

export function getDayInfo(date) {
  const difference = differenceInDays(date, new Date());
  const dateNames = {
    YESTERDAY: 'Yesterday',
    TODAY: 'Today',
    TOMORROW: 'Tomorrow'
  };
  const extractFromDate = {
    day: (date) => getDate(date),
    weekday: (date) => format(date, 'EEEE'),
    month: (date) => format(date, 'LLLL'),
    year: (date) => getYear(date),
    fromUnix: (date) => fromUnixTime(date)
  };

  if (difference === 0 && date <= new Date()) {
    return dateNames.TODAY;
  } else if (extractFromDate.year(date) !== extractFromDate.year(new Date())) {
    return format(date, 'LLL d, yyyy');
  } else {
    return format(date, 'LLL d');
  }
}

/**
 * Formats time to video-style hh:mm:ss duration
 * e.g. 65 min * 20 sec * 1000ms = 1:05:20
 * e.g. 12 min * 30 sec * 1000ms = 12:30
 * @param {number} time
 * @returns {string}
 */
export function formatToStopwatchDuration(time) {
  const zeroPad = (num) => String(num).padStart(2, '0');

  if (time > hours(1)) {
    const duration = intervalToDuration({ start: 0, end: time });
    return formatTimeDuration(duration, 'time', {
      delimiter: ':',
      zero: true,
      locale: {
        formatDistance: (_token, count) => {
          if (_token === 'xHours') {
            if (count > 0) {
              return count;
            }
          } else {
            return zeroPad(count);
          }
        }
      }
    });
  } else {
    return format(time, 'm:ss');
  }
}

export function secondsToMMSS(totalSeconds) {
  const baseDate = new Date(0);
  const targetDate = addSeconds(baseDate, totalSeconds);
  return format(targetDate, 'mm:ss');
}

// converts 10-digit timestamp to 13-digit timestamp if needed
export function normalizeTimestamp(timestamp) {
  return timestamp.toString().length === 10 ? timestamp * 1000 : timestamp;
}

/**
 * Formats the current time and video duration into 'mm:ss' format.
 * @param {number} time - Current time in seconds.
 * @param {number} videoDuration - Video duration in seconds.
 * @returns {string} - Formatted string in 'mm:ss / mm:ss' format.
 */
export function formatVideoTime(time, videoDuration) {
  // Convert seconds to duration object
  const formatTimeString = (seconds) => {
    const duration = intervalToDuration({
      start: 0,
      end: seconds * 1000 // convert to milliseconds
    });

    // Format as HH:MM:SS or MM:SS based on duration
    const parts = [];
    if (duration.hours > 0) {
      if (duration.hours < 10) {
        parts.push(`${String(duration.hours).padStart(2, '0')}`);
      } else {
        parts.push(`${duration.hours}`);
      }
    }
    parts.push(`${String(duration.minutes).padStart(2, '0')}`);
    parts.push(`${String(duration.seconds).padStart(2, '0')}`);

    return parts.join(':');
  };

  const formattedDuration = formatTimeString(videoDuration);

  if (!time) {
    return `${formattedDuration}`;
  }

  const formattedTime = formatTimeString(time);
  return `${formattedTime} / ${formattedDuration}`;
}

/**
 * Formats a date to show TODAY, YESTERDAY, or the date in format "FRI, FEB 7"
 * @param {Date | number | string} date - The date to format
 * @returns {string | null} The formatted date string or null if no date provided
 */
export function getFormattedDate(date) {
  if (!date) return null;

  const dateObj = new Date(date);

  if (isToday(dateObj)) {
    return 'TODAY';
  }

  if (isYesterday(dateObj)) {
    return 'YESTERDAY';
  }

  return format(dateObj, 'ccc, LLL d').toUpperCase();
}

/**
 *
 * @param {number} milliseconds - The duration to format in milliseconds
 * @param {Object} [options] - Configuration options
 * @param {'years'|'months'|'weeks'|'days'|'hours'|'minutes'|'seconds'} [options.maxUnit='years'] - The maximum unit to display
 * @param {'years'|'months'|'weeks'|'days'|'hours'|'minutes'|'seconds'} [options.minUnit='seconds'] - The minimum unit to display
 * @param {'symbol'|'full'} [options.formatType='short'] - The format type to use for units
 * @returns {string} A formatted string representing the duration (e.g., "1 year 3 months 2 weeks")
 *
 * @throws {Error} If maxUnit or minUnit are invalid
 * @throws {Error} If maxUnit is smaller than minUnit
 *
 * @example
 * // Convert to a specific range of units
 * formatDurationWithUnits(34962035955, { maxUnit: 'hours', minUnit: 'minutes' })
 * // => "10955 hours 35 minutes"
 *
 * @example
 * // Include zero values in the output
 * formatDurationWithUnits(1000, { maxUnit: 'hours', minUnit: ['minutes', 'seconds'] })
 * // if minutes not available show seconds => "1s"
 *
 * @example
 * // Use full range of units
 * formatDurationWithUnits(34962035955)
 * // => "1 year 3 months 2 weeks 6 days 10 hours 35 minutes 55 seconds"
 */
export function formatDurationWithUnits(milliseconds, options = {}) {
  let { maxUnit = 'years', minUnit = 'seconds', formatType = 'short' } = options;
  let minUnitArray = [];

  if (isArray(minUnit)) {
    minUnitArray = minUnit?.sort((a, b) => UNIT_ORDER.indexOf(a) - UNIT_ORDER.indexOf(b));
    minUnit = UNIT_ORDER[Math.max(...minUnit.map((unit) => UNIT_ORDER.indexOf(unit)))];
  }

  if (!UNIT_ORDER.includes(maxUnit)) {
    throw new Error('Invalid maxUnit specified');
  }

  if (!UNIT_ORDER.includes(minUnit)) {
    throw new Error('Invalid minUnit specified');
  }

  if (UNIT_ORDER.indexOf(maxUnit) > UNIT_ORDER.indexOf(minUnit)) {
    throw new Error('maxUnit cannot be smaller than minUnit');
  }

  let remainingMs = milliseconds;
  let parts = [];
  let startConverting = false;

  for (const unit of UNIT_ORDER) {
    if (unit === maxUnit) {
      startConverting = true;
    }
    if (!startConverting) {
      continue;
    }

    if (UNIT_ORDER.indexOf(unit) > UNIT_ORDER.indexOf(minUnit)) {
      break;
    }

    const { ms, label, symbol } = TIME_UNITS[unit];
    const value = Math.floor(remainingMs / ms);
    remainingMs %= ms;

    let formattedValue;
    if (formatType === 'full') {
      const formattedLabel = value === 1 ? label.slice(0, -1) : label;
      formattedValue = `${value} ${formattedLabel}`;
    } else {
      formattedValue = `${value}${symbol}`;
    }

    if (value > 0) {
      parts.push({ value: formattedValue, numericalValue: value, unit });
    }
  }

  for (let i = 0; i < minUnitArray?.length; i++) {
    const part = parts.find((p) => p.unit === minUnitArray[i]);
    if (part && part.numericalValue > 0) {
      const unitsToRemove = minUnitArray.slice(i + 1);
      parts = parts.filter((p) => !unitsToRemove.includes(p.unit));
      break;
    }
    if (part && part.numericalValue === 0) {
      parts = parts.filter((p) => p.unit === part.unit);
    }
  }

  return parts.map((p) => p.value).join(' ');
}

export function lensIsUsingDefaultTimestamps(lens) {
  if (!lens.start_at && !lens.end_at) return true;

  const createdAtDate = new Date(lens.created_at);
  const defaultStartAt = startOfDay(subDays(createdAtDate, 60));
  const defaultEndAt = startOfDay(addYears(createdAtDate, 10));

  const startAtDate = startOfDay(new Date(lens.start_at));
  const endAtDate = startOfDay(new Date(lens.end_at));

  return isEqual(startAtDate, defaultStartAt) && isEqual(endAtDate, defaultEndAt);
}

export function formatTemplateTimestamp(timestamp) {
  return format(new Date(timestamp), 'MMM dd, yyyy');
}
