/* eslint-disable camelcase */
import { flatMap, invert, isEmpty, isObject, map, omit, partition, pick, reject } from 'lodash-es';
import { addYears, subDays } from 'date-fns';

import {
  MEETING_SUB_SOURCES,
  SIMILARITY_SCORE_TIER_MAP,
  SUB_SOURCE_FORM_VALUES
} from '@util/constants';

export const convertSubSourceParamsToFormData = (subSources, includeEarningsCall) => {
  let formSubSources = [];

  if (subSources === undefined) {
    formSubSources = includeEarningsCall
      ? SUB_SOURCE_FORM_VALUES
      : reject(SUB_SOURCE_FORM_VALUES, (ssFv) => ssFv === 'Earnings_Call');
  } else {
    const meetingSubsourceSet = new Set(MEETING_SUB_SOURCES);
    formSubSources = subSources.reduce((formSubSourceValues, subSource) => {
      if (meetingSubsourceSet.has(subSource)) {
        if (!formSubSourceValues.includes('Meeting')) {
          formSubSourceValues.push('Meeting');
        }
      } else {
        formSubSourceValues.push(subSource);
      }
      return formSubSourceValues;
    }, []);

    if (includeEarningsCall) {
      formSubSources.push('Earnings_Call');
    }
  }

  return formSubSources;
};

/**
 * @param {('Earnings_Call' | 'Meeting' | 'Slack_Digest' | 'Teams_Digest' | 'Email_Thread')[]} subSourcesFormData
 * @returns {{ sub_sources: string[]; include_earnings_call: boolean }}
 * @description
 * - by default, all sub_sources are selected so we just provide undefined and the backend will not filter at all
 *   4 represents all options presented to the user, so if all are selected then we just give undefined to the backend
 *   if any further get added, we need to update this value
 *
 * - if "Meeting" selected, replace with all meeting sub sources
 */
export const convertSubSourceFormDataToParams = (subSourcesFormData) => {
  const [earningsCallSubSource, otherSubSources] = partition(
    subSourcesFormData,
    (ss) => ss === 'Earnings_Call'
  );
  const earningsCallSelected = earningsCallSubSource?.length > 0;
  let beSubSources = [];

  if (earningsCallSelected && !otherSubSources?.length) {
    beSubSources = earningsCallSubSource;
  } else {
    if (otherSubSources?.length === 4) {
      beSubSources = undefined;
    } else {
      beSubSources = flatMap(otherSubSources, (subSource) =>
        subSource === 'Meeting' ? MEETING_SUB_SOURCES : [subSource]
      );
    }
  }

  return {
    sub_sources: beSubSources,
    include_earnings_call: earningsCallSelected
  };
};

export const prepareFiltersForSubmission = (formData) => {
  const card_filter = {};

  if (formData?.filters?.people) {
    const peopleArray = formatPeopleForApi(formData.filters.people);
    const peopleQueryString = peopleArray.join(',');
    card_filter.query = peopleQueryString;
  } else {
    card_filter.query = null;
  }

  if (!isEmpty(formData?.filters?.participants_domains)) {
    card_filter.participants_domains = formData.filters.participants_domains?.map((d) => '@' + d);
  } else {
    card_filter.participants_domains = null;
  }

  if (formData?.filters?.focus && formData.filters.focus.length > 0) {
    card_filter.initiative_ids = formData.filters.focus.map((f) => (isObject(f) ? f.value : f));
  } else {
    card_filter.initiative_ids = null;
  }

  if (formData?.filters?.labels && formData?.filters?.labels?.length > 0) {
    card_filter.label_ids = formData.filters.labels.map((l) => l.id);
  } else {
    card_filter.label_ids = null;
  }

  const formSubSources = formData?.filters?.sub_sources;

  const { sub_sources, include_earnings_call } = convertSubSourceFormDataToParams(formSubSources);
  card_filter.sub_sources = sub_sources;
  return { card_filter, include_earnings_call };
};

export const prepareDataForSubmission = (formData, user) => {
  const creator = { id: user?.id, name: user?.name };

  let start_at = subDays(new Date().setHours(0, 0, 0, 0), 60);
  let end_at = addYears(new Date().setHours(23, 59, 59, 59), 10);

  const dateFilters = formData?.filters?.date;
  if (dateFilters?.enabled) {
    start_at = dateFilters?.start_at_from;
    end_at = dateFilters?.start_at_to;
  }

  const tiersToSimilarityScoreMap = invert(SIMILARITY_SCORE_TIER_MAP);

  const data = {
    type: 'Lens',
    insight_config: {
      max_cards: 20,
      ...formData?.insight_config
    },
    lens_config: {
      ...formData?.lens_config,
      ...prepareFiltersForSubmission(formData),
      min_similarity_score: tiersToSimilarityScoreMap[formData?.lens_config?.min_similarity_score] // e.g. 25 => 0.285
    },
    creator,
    tenant: {
      id: user?.tenants[0].id
    },
    description: `This is a lens titled "${formData.title}" originally created by ${user.name}.`,
    collaborators: [creator, ...(formData.collaborators ?? [])],
    start_at,
    end_at,
    ...omit(formData, [
      'collaborators',
      'insight_config',
      'filters',
      'start_at',
      'end_at',
      'lens_config'
    ])
  };

  return data;
};

export const patchLensData = (formData) => {
  const dateFilters = formData?.filters?.date;

  // set start_at to midnight and set end_at to 11:59pm
  let start_at = new Date(dateFilters?.start_at_from).setHours(0, 0, 0, 0);
  let end_at = new Date(dateFilters?.start_at_to).setHours(23, 59, 59, 59);
  if (!dateFilters?.enabled) {
    const createdAtDate = new Date(formData.created_at);
    start_at = subDays(new Date(createdAtDate), 60);
    end_at = addYears(new Date(createdAtDate), 10);
  }

  const tiersToSimilarityScoreMap = invert(SIMILARITY_SCORE_TIER_MAP);

  return {
    id: formData.id,
    title: formData.title,
    visibility: formData.visibility,
    color: formData.color,
    icon: formData.icon,
    collaborators: map(formData.collaborators, (c) => pick(c, ['id', 'name'])),
    lens_config: {
      ...formData.lens_config,
      ...prepareFiltersForSubmission(formData),
      min_similarity_score: tiersToSimilarityScoreMap[formData?.lens_config?.min_similarity_score]
    },
    insight_config: {
      max_cards: 20,
      ...formData.insight_config
    },
    start_at,
    end_at
  };
};

export const formatPeopleForApi = (peopleFilterValues) => {
  let emails = [];
  if (peopleFilterValues?.internal) {
    emails = emails.concat(peopleFilterValues.internal.map((val) => val.email));
  }
  if (peopleFilterValues?.external) {
    emails = emails.concat(peopleFilterValues.external);
  }
  return emails;
};
