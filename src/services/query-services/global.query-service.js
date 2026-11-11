import { useConst } from '@chakra-ui/react';
import { useQuery } from '@tanstack/react-query';
import { roundToNearestMinutes, sub } from 'date-fns';

import { search } from './default.query-service';
import { addContextToGlobalSearchResults } from '@util/helpers/global-search.helpers';
import { useIsUserType } from '@util/hooks';

const model = 'global';

/** @type {useSearchQuery<GlobalSearchRequest, GlobalSearchResponse>} */
export const useGlobalSearch = (query, queryOptions) => {
  const today = useConst(
    roundToNearestMinutes(new Date(), { nearestTo: 5, roundingMethod: 'floor' })
  );
  const isExecutiveOrAdmin = useIsUserType('Executive', 'Admin');

  return useQuery({
    queryKey: [model, query],
    queryFn: () =>
      search({
        model,
        body: {
          query,
          start_at_to: today,
          start_at_from: sub(today, { weeks: 3 }),
          sort: 'created_at',
          asc: false,
          insight_type: isExecutiveOrAdmin ? 'Lens' : 'Focus'
        },
        includeTotal: true
      }).then((results) => addContextToGlobalSearchResults(results, isExecutiveOrAdmin)),
    ...queryOptions
  });
};
