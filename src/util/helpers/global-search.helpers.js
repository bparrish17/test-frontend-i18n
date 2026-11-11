import { some, values, uniqBy, map, get } from 'lodash-es';

/****************************************************
 * Context Matching Functionality
 ****************************************************/

/**
 * A function for populating a global search result with how it matched to the user-inputted query in Elastic Search
 *
 * Cards match on "headline", “sections.title”, “sections.content”, “source_data.title”
 * Meetings match on "title", "description", “nylas.participants.email”, “nylas.participants.name”
 * Insights match on "headline", “subheadline”, “sections.title”, “sections.content”, “initiative.title”
 *
 * @param {string} query - user-inputted global search query
 * @param {GlobalSearchResponse} globalSearchResponse
 * @returns {GlobalSearchResponse} - same response, except each record in the result has a "context" applied
 * @description
 * For each model in the global search query
 * - iterate over each record in that model and
 *  - check for Elastic Search highlights
 *  - if in highlights, parse into readable string with bolded highlighted keyword
 */
export function addContextToGlobalSearchResults(globalSearchRes, isExecutiveOrAdmin) {
  const { cards, meetings, insights, ...otherResults } = globalSearchRes;

  return {
    cards: populateResultSet(cards, 'source_data.title', [
      'headline',
      'sections.title',
      'sections.content'
    ]),
    meetings: populateResultSet(meetings, 'title', [
      'description',
      'nylas.participants.name',
      'nylas.participants.email'
    ]),
    insights: isExecutiveOrAdmin
      ? populateResultSet(insights, 'headline', [
          'subheadline',
          'initiative.title',
          'sections.title',
          'sections.content'
        ])
      : { total: 0, data: [] },
    ...otherResults
  };
}

/**
 * Adds
 * @param {{
 *  total: number;
 *  data: (Card | Meeting | Insight)[];
 *  highlights: { [resultId: string]: ESHighlight }
 * }} resultSet
 * @param {string} headlineKey
 * @param {string[]} contextKeys
 * @returns {}
 */
function populateResultSet(resultSet, headlineKey, contextKeys) {
  const highlights = resultSet?.highlights ?? [];

  const getHeadlineForRecord = (result, headlineKey) => {
    const recordHighlights = highlights[result?.id];
    if (recordHighlights[headlineKey]) {
      return splitHighlightedStringIntoParts(recordHighlights[headlineKey][0]);
    }

    return [{ value: get(result, headlineKey), isHighlighted: false }];
  };

  const getContextForRecord = (result, contextKeys) => {
    const recordHighlights = highlights[result?.id];

    for (const contextKey of contextKeys) {
      if (recordHighlights[contextKey]) {
        const highestPriorityContext = recordHighlights[contextKey][0];
        const highlightedParts = splitHighlightedStringIntoParts(highestPriorityContext);
        const withShortenedPrefix = shortenKeywordPrefix(highlightedParts);
        const withSuffix = addSuffix(withShortenedPrefix, contextKey);
        return withSuffix;
      }
    }
    return null;
  };

  return {
    ...resultSet,
    data: resultSet?.data?.map((result) => ({
      ...result,
      resultHeadline: getHeadlineForRecord(result, headlineKey),
      resultContext: getContextForRecord(result, contextKeys)
    }))
  };
}

/**
 * Takes elastic search highlights result and splits it into "isHighlighted": true/false sections based on parts of
 * provided string wrapped in <b></b> tags
 * @param {string} htmlString
 * @returns {HighlightedPart[]}
 */
function splitHighlightedStringIntoParts(htmlString, contextKey) {
  const result = [];
  let currentIndex = 0;

  // Regular expression to find <b> tags and their content
  const regex = /<b>(.*?)<\/b>/g;

  // Match all occurrences of <b> tags and their content
  let match;
  while ((match = regex.exec(htmlString)) !== null) {
    // Add non-highlighted text between previous match and current match
    if (match.index > currentIndex) {
      result.push({
        value: htmlString.substring(currentIndex, match.index),
        isHighlighted: false
      });
    }

    // Add highlighted text from current match
    result.push({
      value: match[1], // Content inside <b> tags
      isHighlighted: true
    });

    // Update current index
    currentIndex = regex.lastIndex;
  }

  // Add remaining non-highlighted text after the last match
  if (currentIndex < htmlString.length) {
    result.push({
      value: htmlString.substring(currentIndex),
      isHighlighted: false
    });
  }

  return result?.map((part) => ({ ...part, contextKey }));
}

/**
 * To make result context more readable, we truncate the preceding string to the matched text so that it has an ellipsis at the start
 *
 * @param {HighlightedPart[]} parts - matching field split by keyword match
 * @returns {HighlightedPart[]} provided parts with prefix truncated to desired length
 * @description
 * If the first part in a result is not highlighted, finds the nearest matching space to the max length and replaces with an ellipsis
 *
 * @example
 * shortenKeywordPrefix([
 *  { value: 'this is a long prefix to the results that includes the ', isHighlighted: false },
 *  { value: 'KEYWORD', isHighlighted: true },
 *  { value: ' with text at the end that gets truncated by the html textOverflow prop', isHighlighted: false }
 * ])
 * [
 *  { value: '...that includes the ', isHighlighted: false },
 *  { value: 'KEYWORD', isHighlighted: true },
 *  { value: ' with text at the end that gets truncated by the html textOverflow prop', isHighlighted: false }
 * ]
 */
function shortenKeywordPrefix(parts) {
  const [prefix, nextWord] = parts;
  if (!prefix.isHighlighted && nextWord.isHighlighted) {
    const maxPrefixLength = Math.max(35 - nextWord?.value?.length, 15);

    if (prefix.value.length <= maxPrefixLength) return parts;

    const shortenedPrefix = prefix.value.slice(-maxPrefixLength);
    const firstSpace = shortenedPrefix.indexOf(' ');
    if (firstSpace === -1) {
      return parts;
    } else {
      const truncatedPrefix = shortenedPrefix.slice(firstSpace).replace(/\s/, '...');
      return [{ value: truncatedPrefix, isHighlighted: false }, ...parts.slice(1)];
    }
  }

  return parts;
}

/**
 * Helper for checking for one-off suffixes that need to be added based on matching contextKey
 * @param {HighlightedPart[]} parts
 * @param {string} contextKey
 */
function addSuffix(parts, contextKey) {
  if (contextKey === 'nylas.participants.name' || contextKey === 'nylas.participants.email') {
    return [...parts, { value: ' attended', isHighlighted: false }];
  } else {
    return parts;
  }
}

/****************************************************
 * Other Helpers
 ****************************************************/

export function mergePeople(foraPeople, participants) {
  return map(uniqBy([...foraPeople, ...participants], 'email'), (p) => {
    const params = new URLSearchParams();
    if (p?.id) params.append('id', p?.id);
    if (p?.email) params.append('email', p?.email);
    return { ...p, link: `/person?${params.toString()}` };
  });
}

export function hasAnyResults(globalSearchResult) {
  return some(values(globalSearchResult), (modelResult) => {
    const hasTotal = modelResult?.total > 0;
    const hasValues = modelResult?.values?.length > 0;
    const isArrResultWithLen = Array.isArray(modelResult) && modelResult?.length > 0;
    return hasTotal || hasValues || isArrResultWithLen;
  });
}

/**
 * @typedef {'cards' | 'meetings' | 'insights' | 'organizations' | 'participants' | 'persons'} GlobalSearchResultModel
 *
 * @typedef {object} HighlightedPart
 * @property {string} value
 * @property {boolean} isHighlighted
 *
 * @typedef {{ [sectionKey: string]: string[] }} ESHighlight
 *
 * @typedef {object} FieldMatcher
 * @property {string} key - field on the record that was matched on by Elastic Search
 * @property {() => boolean} matchCondition - function determining how to check that field's value for matching
 * @property {() => any} matchLabel - function to determine how that resulting match will be displayed in the global search result
 * @example
 * {
 *  key: 'headline' // match on field "headline" for that record
 *  matchCondition: (headline) => headline.includes('provided-keyword'),
 *  matchLabel: () => 'This field matched!'
 * }
 *
 */
