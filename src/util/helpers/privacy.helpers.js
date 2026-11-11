import { sum, values } from 'lodash-es';

import { formatViewDate } from '@util/helpers/datetime.helpers';

export const totalPeopleWithAccess = (accessStats, isSensitive) => {
  if (isSensitive) {
    return accessStats?.num_of_participants;
  } else {
    return sum(values(accessStats));
  }
};

export const sharingDisabled = (accessStats, isSensitive) => {
  return isSensitive || accessStats?.num_of_shares === 0;
};

export const totalViews = (views) => {
  if (!views) return 0;

  return views?.reduce((total, view) => {
    return total + view.count;
  }, 0);
};

export const viewsAndViewers = (views, sharedEmails, includeShared = false) => {
  if (!views) return [];

  // Filter views to include only non-shared or shared viewers based on `includeShared`
  const filteredViews = views
    ?.filter((call) => {
      const callEmail = call?.id;
      const isSystemEmail = callEmail === 'system@fora.app';
      const isSharedEmail = sharedEmails.includes(callEmail);

      // Use includeShared to determine the filtering logic
      return !isSystemEmail && (includeShared ? isSharedEmail : !isSharedEmail);
    })
    .sort((a, b) => b.created_at - a.created_at);

  // Calculate the total number of unique emails from the filtered calls
  const uniqueEmails = new Set(filteredViews.map((view) => view?.id));

  return {
    views: filteredViews,
    viewsCount: totalViews(filteredViews),
    viewersCount: uniqueEmails.size
  };
};

export const sanitizeView = (view, foraPerson, apolloPerson) => {
  return {
    name: foraPerson?.name || apolloPerson?.name || view?.id,
    avatar_url: view?.avatar_url || foraPerson?.avatar_url || apolloPerson?.photo_url,
    date: formatViewDate(view?.created_at)
  };
};
