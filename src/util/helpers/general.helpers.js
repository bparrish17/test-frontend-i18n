import {
  capitalize,
  first,
  get,
  isEmpty,
  isNull,
  isUndefined,
  random,
  shuffle,
  some
} from 'lodash-es';
import buildInfo from '@root/build-helpers/build-info.json';
import pluralize from 'pluralize';

export const httpStatusCodesByName = {
  Continue: 100,
  'Switching Protocols': 101,
  Processing: 102,
  'Early Hints': 103,
  OK: 200,
  Created: 201,
  Accepted: 202,
  'Non-Authoritative Information': 203,
  'No Content': 204,
  'Reset Content': 205,
  'Partial Content': 206,
  'Multi-Status': 207,
  'Already Reported': 208,
  'IM Used': 226,
  'Multiple Choices': 300,
  'Moved Permanently': 301,
  Found: 302,
  'See Other': 303,
  'Not Modified': 304,
  'Use Proxy': 305,
  'Temporary Redirect': 307,
  'Permanent Redirect': 308,
  'Bad Request': 400,
  Unauthorized: 401,
  'Payment Required': 402,
  Forbidden: 403,
  'Not Found': 404,
  'Method Not Allowed': 405,
  'Not Acceptable': 406,
  'Proxy Authentication Required': 407,
  'Request Timeout': 408,
  Conflict: 409,
  Gone: 410,
  'Length Required': 411,
  'Precondition Failed': 412,
  'Payload Too Large': 413,
  'URI Too Long': 414,
  'Unsupported Media Type': 415,
  'Range Not Satisfiable': 416,
  'Expectation Failed': 417,
  // eslint-disable-next-line
  "I'm a teapot": 418,
  'Misdirected Request': 421,
  'Unprocessable Entity': 422,
  Locked: 423,
  'Failed Dependency': 424,
  'Too Early': 425,
  'Upgrade Required': 426,
  'Precondition Required': 428,
  'Too Many Requests': 429,
  'Request Header Fields Too Large': 431,
  'Unavailable For Legal Reasons': 451,
  'Internal Server Error': 500,
  'Not Implemented': 501,
  'Bad Gateway': 502,
  'Service Unavailable': 503,
  'Gateway Timeout': 504,
  'HTTP Version Not Supported': 505,
  'Variant Also Negotiates': 506,
  'Insufficient Storage': 507,
  'Loop Detected': 508,
  'Not Extended': 510,
  'Network Authentication Required': 511
};

export const httpStatusCodesByNumber = {
  100: 'Continue',
  101: 'Switching Protocols',
  102: 'Processing',
  103: 'Early Hints',
  200: 'OK',
  201: 'Created',
  202: 'Accepted',
  203: 'Non-Authoritative Information',
  204: 'No Content',
  205: 'Reset Content',
  206: 'Partial Content',
  207: 'Multi-Status',
  208: 'Already Reported',
  226: 'IM Used',
  300: 'Multiple Choices',
  301: 'Moved Permanently',
  302: 'Found',
  303: 'See Other',
  304: 'Not Modified',
  305: 'Use Proxy',
  306: 'Switch Proxy',
  307: 'Temporary Redirect',
  308: 'Permanent Redirect',
  400: 'Bad Request',
  401: 'Unauthorized',
  402: 'Payment Required',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Authentication Required',
  408: 'Request Timeout',
  409: 'Conflict',
  410: 'Gone',
  411: 'Length Required',
  412: 'Precondition Failed',
  413: 'Payload Too Large',
  414: 'URI Too Long',
  415: 'Unsupported Media Type',
  416: 'Range Not Satisfiable',
  417: 'Expectation Failed',
  // eslint-disable-next-line
  418: `I'm a teapot`,
  421: 'Misdirected Request',
  422: 'Unprocessable Entity',
  423: 'Locked',
  424: 'Failed Dependency',
  425: 'Too Early',
  426: 'Upgrade Required',
  428: 'Precondition Required',
  429: 'Too Many Requests',
  431: 'Request Header Fields Too Large',
  451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error',
  501: 'Not Implemented',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  505: 'HTTP Version Not Supported',
  506: 'Variant Also Negotiates',
  507: 'Insufficient Storage',
  508: 'Loop Detected',
  510: 'Not Extended',
  511: 'Network Authentication Required'
};

/*
 * Calendar card colors within current design have two specific properties:
 * - they are evenly spaced and distinct
 * - they follow the same slightly desaturated pattern
 *
 * Accepts n as number of colors to be generated to ensure they are evenly spaced.
 */
export function generateColorsArray(n, saturation = 50, lightness = 50) {
  const hueRange = 360;
  const colors = [];

  for (let i = 0; i < n; i++) {
    const hue = (i * hueRange) / n;
    const HSLString = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

    colors.push(HSLString);
  }

  return colors;
}

export function generateRandomImageURL(height, width) {
  // List of 20 generic background image keywords
  const imageKeywords = [
    'nature', // Image of nature
    'cityscape', // Image of a cityscape
    'abstract', // Abstract art image
    'technology', // Image related to technology
    'landscape', // Scenic landscape image
    'architecture', // Architectural design image
    'ocean', // Ocean view image
    'forest', // Forest scenery image
    'mountains', // Mountain view image
    'desert', // Desert landscape image
    'sky', // Image of the sky
    'flowers', // Floral image
    'night', // Night scene image
    'sunset', // Sunset view image
    'waterfall', // Waterfall scene image
    'beach', // Beach view image
    'urban', // Urban setting image
    'vintage', // Vintage style image
    'minimalist', // Minimalist design image
    'space' // Outer space image
  ];

  // Choose a random keyword from the list
  const randomKeyword = imageKeywords[random(0, imageKeywords.length - 1)];

  // Construct the Unsplash URL with the specified height, width, and random keyword
  const url = `https://picsum.photos/seed/${randomKeyword}/${width}/${height}`;

  return url;
}

export function toSelectOptions(valueProp, labelProp, shouldKeepBody = false) {
  return (arr) =>
    arr && Array.isArray(arr)
      ? arr?.map((val) => ({
          label: get(val, labelProp),
          value: get(val, valueProp),
          ...(shouldKeepBody && { ...val })
        }))
      : arr;
}

/**
 * Applies exponential backoff to useQuery retry count
 * @param {number} retryAttempt
 * @param {*} _error
 * @returns {number} ms backoff time
 */
export function backoffRetries(retryAttempt) {
  return Math.min(retryAttempt > 1 ? 2 ** retryAttempt * 1000 : 1000, 30 * 1000);
}

export function createDownloadTag(url, fileName) {
  const element = document.createElement('a');
  element.href = url;
  element.download = `${fileName}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}

// just for fiddling with feature changes to simulate api calls
export function fakeApiCall(timeout = 1000, fakeResponse = { data: { hello: 'world' } }) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(fakeResponse);
    }, timeout);
  });
}

export function getEmailDomain(email) {
  return email?.split('@')[1] ?? '';
}

/**
 * Adds commas to large number
 * @param {number} number
 * @returns {string}
 * @example numberToDisplayString(72000) => '72,000'
 */
export function numberToDisplayString(number) {
  if (typeof number !== 'number') return '';
  return number.toLocaleString();
}

export function capitalizeFullString(inputString = '') {
  return inputString
    ?.split(/(\W+)/)
    .map((word) => capitalize(word))
    .join('');
}

export function getNumberArray(n) {
  return Array.from({ length: n }, (_, index) => index);
}

/**
 * @typedef {Object} ScrollOptions
 * @property {number} [top=0]
 * @property {'auto' | 'smooth'} [behavior="smooth"]
 * @property {'start' | 'center' | 'end' | 'nearest'} [block="start"]
 * @property {'start' | 'center' | 'end' | 'nearest'} [inline="nearest"]
 *
 * @param {React.RefObject} ref
 * @param {ScrollOptions} [options]
 */
export function scrollRefIntoView(ref, options = {}) {
  const el = ref.current;
  if (!el) {
    return;
  }

  const defaultOptions = {
    top: 0,
    behavior: 'smooth',
    block: 'start',
    inline: 'nearest'
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options
  };

  const position = el.style.position;
  const top = el.style.top;
  el.style.position = 'relative';
  el.style.top = `${mergedOptions.top}px`;

  ref.current?.scrollIntoView({
    behavior: mergedOptions.behavior,
    block: mergedOptions.block,
    inline: mergedOptions.inline
  });

  el.style.position = position;
  el.style.top = top;
}

/**
 * @param {string} input
 * @returns {{text: string, bold: boolean}[]}
 */
export function getBoldSlices(input) {
  if (!input) {
    return [];
  }

  // regex that captures text between two asterisks
  const slices = input.split(/\*([^*]+)\*/);

  return slices.map((text, i) => ({ text, bold: i % 2 === 1 }));
}

/**
 * @param {number} sec
 * @returns {number} time in milliseconds
 */
export function seconds(sec) {
  return sec * 1000;
}

/**
 * @param {number} min
 * @returns {number} time in milliseconds
 */
export function minutes(min) {
  return min * seconds(60);
}

export function hours(hrs) {
  return hrs * minutes(60);
}

export function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function uuidToInt(uuid) {
  return parseInt(uuid ? uuid.split('-').join('') : 1, 16);
}

export function emailToInt(email) {
  let result = 0;
  for (let i = 0; i < email?.length; i++) {
    result += email.charCodeAt(i);
  }
  return result;
}

// only retry query if condition is met and we haven't hit max retry count
export function retryQueryWhen(maxCount, condition = () => false) {
  return (count, err) => {
    const matchCondition = some(err?.response?.data?.errors, condition);
    return matchCondition && count < maxCount;
  };
}

export async function fetchBlobAs(url, type) {
  const response = await fetch(url);
  const data = await response.blob();
  return new Blob([data], { type });
}

export function getAllStartIndicesOfCharacter(character, text) {
  const result = [];
  for (let charIndex = 0; charIndex < text.length; charIndex++) {
    if (text[charIndex] === character) {
      result.push(charIndex);
    }
  }
  return result;
}

export function generateLoremIpsum({ wordCount, range }) {
  const loremIpsum =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
  const words = loremIpsum.split(' ');

  if (!wordCount) {
    if (range?.min && range?.max) {
      wordCount = Math.floor(random() * (range.max - range.min + 1)) + range.min;
    } else {
      wordCount = Math.floor(random() * 300) + 1;
    }
  }

  const shuffledWords = shuffle(words);
  return shuffledWords.slice(0, wordCount).join(' ');
}

export function isFalsy(value) {
  return isUndefined(value) || isNull(value) || isEmpty(value);
}

export function filterForaEmailsInOtherTenants(people) {
  return people.filter((person) => {
    // Filter out "admin user" from options by filtering out FORA emails
    // FORA tenant is the exception
    if (person.tenants[0].id === '8cff9346-a5fe-42e6-bd20-de3731fe3bfe') return true;
    return !person.email.includes('@fora.day');
  });
}

export function printBuildInfo() {
  const colors = [
    'color: red',
    'color: green',
    'color: blue',
    'color: brown',
    'color: magenta',
    'color: darkorange'
  ];

  console.log('%c========================================', 'color: purple;');
  const buildInfoEntries = Object.entries(buildInfo);
  buildInfoEntries.forEach(([key, value], index) => {
    if (key === 'featureFlagUsage') {
      return;
    }
    const color = colors[index % colors.length];
    console.log(`%c${key}: ${value}`, color);
  });
  console.log('%c========================================', 'color: purple;');
}

export const isSafariMobile = (ua = navigator.userAgent) => {
  const ios = !!/iP(ad|od|hone)/.exec(ua);
  const appleWebkit = !!/WebKit/i.exec(ua);
  const iosChrome = !!/CriOS/i.exec(ua);

  return ios && appleWebkit && !iosChrome;
};

export const pluralized = (noun, count, { struct = false } = {}) => {
  const pluralizedNoun = pluralize(noun, count);

  let res = `${count} ${pluralizedNoun}`;

  if (struct) {
    res = {
      count,
      noun: pluralizedNoun
    };
  }

  return res;
};

export const getAPIError = (res, fallbackErr) => {
  return first(res?.response?.data?.errors) ?? fallbackErr;
};

export const findObjectArrayDiff = (initial, newArray, key = 'id') => {
  const initialIds = new Set(initial.map((item) => item[key]));
  const newIds = new Set(newArray.map((item) => item[key]));

  return {
    added: newArray.filter((item) => !initialIds.has(item[key])),
    removed: initial.filter((item) => !newIds.has(item[key]))
  };
};
