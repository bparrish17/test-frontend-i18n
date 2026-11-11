import { toSelectOptions } from '@util/helpers';
import { useDelete, useSearchQuery, useSetAttribute } from './default.query-service';

const model = 'calendars';
const defaultBody = { sort: 'created_at', asc: false };

/** @type {useSearchQuery<CalendarsSearchRequest, Calendars>} */
export const useCalendars = useSearchQuery({ model, defaultBody });

/** @type {useSearchQuery<CalendarsSearchRequest, Calendars>} */
export const useCalendarOptions = useSearchQuery({
  model,
  defaultBody,
  defaultQueryOptions: {
    select: toSelectOptions('id', 'name')
  }
});

/** @type {useSetAttribute<Calendars>} */
export const useSetCalendarActive = useSetAttribute({ model, attribute: 'active' });

/** @type {useDelete<Calendars>} */
export const useRemoveCalendar = useDelete({ model });
