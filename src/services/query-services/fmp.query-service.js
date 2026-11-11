import { addMonths, isAfter, isBefore, isSameDay, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { find, useCreate, useFindQuery } from './default.query-service';
import { minutes } from '@util/helpers';

const model = 'fmp';
const DEFAULT_CACHE_OPTIONS = {
  staleTime: minutes(5), // 5 minutes
  cacheTime: minutes(30) // 30 minutes
};

export const useAvailableSymbols = useFindQuery({ model, resource: 'availableSymbols' });
export const usePeriods = useFindQuery({ model, paramName: 'symbol', resource: 'periods' });
export const useRunFmp = useCreate({ model });

/**
 * Processes earnings call periods data to extract last updated and next call dates
 * @param {Array} periodsData - Array of period objects from the API
 * @returns {{lastUpdated: Date, nextCall: Date} | null} Processed dates or null if no data
 */
export const processEarningsCallDates = (periodsData) => {
  if (!periodsData || !Array.isArray(periodsData) || periodsData.length === 0) {
    return null;
  }

  // Parse all dates and add a parsed Date object for easier comparison
  const datesWithParsed = periodsData.map((period) => ({
    ...period,
    parsedDate: parseISO(period.date)
  }));

  // Sort dates in ascending order (oldest to newest)
  const sortedDates = [...datesWithParsed].sort((a, b) => a.parsedDate - b.parsedDate);

  const now = new Date();

  // Find past dates (for last updated) and future dates (for next call)
  const pastDates = sortedDates.filter(
    (d) => isBefore(d.parsedDate, now) || isSameDay(d.parsedDate, now)
  );
  const futureDates = sortedDates.filter((d) => isAfter(d.parsedDate, now));

  let lastUpdatedDate, nextCallDate;

  // Handle Last Updated date
  if (pastDates.length > 0) {
    // Use the most recent past date as the last updated date
    lastUpdatedDate = pastDates[pastDates.length - 1].date;
  } else {
    // If no past dates, use the oldest available date
    lastUpdatedDate = sortedDates[0].date;
  }

  // Handle Next Call date
  if (futureDates.length > 0) {
    // Use the nearest future date as the next call date
    nextCallDate = futureDates[0].date;
  } else if (sortedDates.length > 1) {
    // If no future dates but we have multiple dates,
    // estimate the next call by adding 3 months to the most recent date
    const mostRecentDate = parseISO(sortedDates[sortedDates.length - 1].date);
    nextCallDate = addMonths(mostRecentDate, 3).toISOString().split('T')[0];
  } else {
    // If we only have one date and it's in the past,
    // estimate the next call by adding 3 months to it
    const onlyDate = parseISO(sortedDates[0].date);
    nextCallDate = addMonths(onlyDate, 3).toISOString().split('T')[0];
  }

  // Ensure we don't return the same date for both
  if (isSameDay(parseISO(lastUpdatedDate), parseISO(nextCallDate)) && sortedDates.length > 1) {
    // If we have the same date for both, adjust the next call date by 3 months
    nextCallDate = addMonths(parseISO(nextCallDate), 3).toISOString().split('T')[0];
  }

  return {
    lastUpdated: parseISO(lastUpdatedDate),
    nextCall: parseISO(nextCallDate)
  };
};

/**
 * Base function to fetch periods data for a ticker symbol
 * @param {string} symbol - Ticker symbol to fetch data for
 * @returns {Promise<Object>} Promise resolving to the API response
 */
// const fetchPeriods = (symbol) =>
//   Axios({
//     method: 'GET',
//     url: `/${model}/periods`,
//     params: { symbol }
//   }).then((res) => res?.data);

/**
 * Custom hook to fetch earnings call dates for multiple ticker symbols
 * @param {Array} tickerSymbols - Array of ticker symbols to fetch data for
 * @param {Object} options - Additional options for the query
 * @returns {Object} Object containing earnings call dates and loading state
 */
export const useEarningsCallDates = (tickerSymbols = [], options = {}) => {
  const query = useQuery({
    queryKey: [model, 'periods', tickerSymbols],
    queryFn: async () => {
      if (!tickerSymbols.length) return {};

      const results = await Promise.all(
        tickerSymbols.map(async (symbol) => {
          if (!symbol) return null;
          const data = await find({
            model,
            resource: 'periods',
            paramName: 'symbol',
            term: symbol
          });
          return { symbol, data };
        })
      );

      const earningsCallDates = {};
      results.forEach((result) => {
        if (result?.symbol && result?.data) {
          const dates = processEarningsCallDates(result.data);
          if (dates) {
            earningsCallDates[result.symbol] = dates;
          }
        }
      });

      return earningsCallDates;
    },
    ...DEFAULT_CACHE_OPTIONS,
    ...options,
    enabled: tickerSymbols.length > 0
  });

  return {
    earningsCallDates: query.data || {},
    isLoading: query.isLoading
  };
};
