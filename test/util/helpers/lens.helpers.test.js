import { vi } from 'vitest';
import { subDays, addYears } from 'date-fns';
import { reject } from 'lodash-es';

import {
  prepareFiltersForSubmission,
  prepareDataForSubmission,
  patchLensData,
  formatPeopleForApi,
  convertSubSourceFormDataToParams,
  convertSubSourceParamsToFormData
} from '@util/helpers/lens.helpers';
import { MEETING_SUB_SOURCES, SUB_SOURCE_FORM_VALUES } from '@util/constants';

describe('convertSubSourceParamsToFormData', () => {
  it('should return all possible sub source form values when subSources is undefined and includeEarningsCall is true', () => {
    const result = convertSubSourceParamsToFormData(undefined, true);
    expect(result).toEqual(SUB_SOURCE_FORM_VALUES);
  });

  it('should return all non-EC sub source form values when subSources is undefined and includeEarningsCall is false', () => {
    const result = convertSubSourceParamsToFormData(undefined, false);
    expect(result).toEqual(reject(SUB_SOURCE_FORM_VALUES, (ssFv) => ssFv === 'Earnings_Call'));
  });

  it('should convert meeting sub sources to "Meeting"', () => {
    const subSources = ['Google_Meeting', 'Teams_Meeting', 'Webex_Meeting'];
    const result = convertSubSourceParamsToFormData(subSources);
    expect(result).toEqual(['Meeting']);
  });

  it('should handle non-meeting sub sources', () => {
    const subSources = ['Slack_Digest', 'Email_Thread'];
    const result = convertSubSourceParamsToFormData(subSources);
    expect(result).toEqual(['Slack_Digest', 'Email_Thread']);
  });

  it('should handle mixed meeting and non-meeting sub sources', () => {
    const subSources = ['Google_Meeting', 'Slack_Digest'];
    const result = convertSubSourceParamsToFormData(subSources);
    expect(result).toEqual(['Meeting', 'Slack_Digest']);
  });

  it('should return Earnings_Call subsource if includeEarningsCall argument is true', () => {
    const subSources = ['Google_Meeting', 'Slack_Digest'];
    const result = convertSubSourceParamsToFormData(subSources, true);
    expect(result).toEqual(['Meeting', 'Slack_Digest', 'Earnings_Call']);
  });
});

describe('convertSubSourceFormDataToParams', () => {
  const allSubSources = SUB_SOURCE_FORM_VALUES;
  it('should return include_earnings_call: boolean based on subSources "Earnings_Call" presence', () => {
    const hasEarningsCall = convertSubSourceFormDataToParams([
      'Earnings_Call',
      'Slack_Digest',
      'Teams_Digest'
    ]);
    const noEarningsCall = convertSubSourceFormDataToParams(['Slack_Digest', 'Meeting']);
    expect(hasEarningsCall.include_earnings_call).toBe(true);
    expect(noEarningsCall.include_earnings_call).toBe(false);
  });

  it('[case: empty non-EC sources, Earnings_Call checked] should return { sub_sources: ["Earnings_Call"] }', () => {
    const result = convertSubSourceFormDataToParams(['Earnings_Call']);
    expect(result).toEqual({ sub_sources: ['Earnings_Call'], include_earnings_call: true });
  });

  it('[case: all non-EC sources selected, Earnings_Call checked] should return { sub_sources: undefined } ', () => {
    const result = convertSubSourceFormDataToParams(allSubSources);
    expect(result).toEqual({ sub_sources: undefined, include_earnings_call: true });
  });

  it('[case: some non-EC sources, Earnings_Call checked] should return sub_sources without Earnings_Call', () => {
    const subSources = ['Earnings_Call', 'Slack_Digest', 'Email_Thread'];
    const result = convertSubSourceFormDataToParams(subSources);
    expect(result).toEqual({
      sub_sources: reject(subSources, (ss) => ss === 'Earnings_Call'),
      include_earnings_call: true
    });
  });

  it('[case: all non-EC sources selected, Earnings_Call unchecked] should return { sub_sources: undefined', () => {
    const result = convertSubSourceFormDataToParams(
      reject(allSubSources, (ss) => ss === 'Earnings_Call')
    );
    expect(result).toEqual({ sub_sources: undefined, include_earnings_call: false });
  });

  it('should extract "Meeting" UI sub source value into expected backend values', () => {
    const result = convertSubSourceFormDataToParams(['Meeting', 'Email_Thread']);
    expect(result).toEqual(
      expect.objectContaining({
        sub_sources: [...MEETING_SUB_SOURCES, 'Email_Thread']
      })
    );
  });
});

describe('prepareFiltersForSubmission', () => {
  const fakeFormData = (filters) => ({ filters });
  it('uses formatPeopleForApi to create query string of provided people', () => {
    const formData = fakeFormData({
      people: {
        internal: [{ email: 'person1@internal.com' }, { email: 'person2@internal.com' }],
        external: ['person3@gmail.com', 'person4@yahoo.com']
      }
    });
    const result = prepareFiltersForSubmission(formData);
    expect(result.card_filter.query).toBe(
      'person1@internal.com,person2@internal.com,person3@gmail.com,person4@yahoo.com'
    );
  });

  it('provides people.query value of null if no people provided in filtering options', () => {
    const formData = fakeFormData({});
    const result = prepareFiltersForSubmission(formData);
    expect(result.card_filter.query).toBeNull();
  });

  it('handles participants_domains filter', () => {
    const formData = fakeFormData({
      participants_domains: ['att.com', 'homedepot.com']
    });
    const result = prepareFiltersForSubmission(formData);
    expect(result.card_filter.participants_domains).toEqual(['@att.com', '@homedepot.com']);
  });

  it('handles focus filter', () => {
    const formData = fakeFormData({
      focus: [
        { value: 'focus1', label: 'Focus 1' },
        { value: 'focus2', label: 'Focus 2' }
      ]
    });
    const result = prepareFiltersForSubmission(formData);
    expect(result.card_filter.initiative_ids).toEqual(['focus1', 'focus2']);
  });

  it('handles labels filter', () => {
    const formData = fakeFormData({
      labels: [
        { id: 'label1', title: 'Label 1' },
        { id: 'label2', title: 'Label 2' }
      ]
    });
    const result = prepareFiltersForSubmission(formData);
    expect(result.card_filter.label_ids).toEqual(['label1', 'label2']);
  });

  it('breaks out "Meeting" UI sub source value into expected backend values', () => {
    const formData = fakeFormData({
      sub_sources: ['Meeting', 'Slack_Digest']
    });
    const result = prepareFiltersForSubmission(formData);
    expect(result.card_filter.sub_sources).toEqual([
      'Google_Meeting',
      'Teams_Meeting',
      'Webex_Meeting',
      'Zoom_Meeting',
      'Slack_Digest'
    ]);
  });

  it('returns undefined card_filter.sub_sources if all 4 sub_sources are selected', () => {
    const formData = fakeFormData({
      sub_sources: ['Meeting', 'Slack_Digest', 'Teams_Digest', 'Email_Thread']
    });
    const result = prepareFiltersForSubmission(formData);
    expect(result.card_filter.sub_sources).toBeUndefined();
  });

  it('returns include_earnings_call value', () => {
    const formData = fakeFormData({ sub_sources: ['Earnings_Call'] });
    const result = prepareFiltersForSubmission(formData);
    expect(result.include_earnings_call).toEqual(true);
  });

  it('handles case where filters are not provided', () => {
    const formData = {};
    const { card_filter } = prepareFiltersForSubmission(formData);
    expect(card_filter.query).toBeNull();
    expect(card_filter.participants_domains).toBeNull();
    expect(card_filter.initiative_ids).toBeNull();
    expect(card_filter.sub_sources).toEqual([]);
  });
});

describe('prepareDataForSubmission', () => {
  const mockUser = {
    id: 'user-123',
    name: 'John Doe',
    tenants: [{ id: 'tenant-456' }]
  };

  beforeEach(() => {
    // mock to Feb, 18 2025
    const mockCurrentDate = new Date(2025, 1, 18, 10, 0);
    vi.setSystemTime(mockCurrentDate);
  });

  it('should return formatted data with required fields', () => {
    const formData = {
      title: 'Test Lens',
      filters: {
        date: {
          start_at_from: 1739491200000,
          start_at_to: 2055455999059,
          enabled: true
        },
        sub_sources: ['Earnings_Call', 'Slack_Digest', 'Teams_Digest']
      },
      insight_config: { max_cards: 10, duration_days: 7 },
      lens_config: {
        min_similarity_score: 50,
        match_prompt: 'Test match prompt',
        explanatory_prompt: 'Test explanatory_prompt'
      }
    };

    const result = prepareDataForSubmission(formData, mockUser);

    expect(result).toEqual({
      title: 'Test Lens',
      type: 'Lens',
      insight_config: {
        max_cards: 10,
        duration_days: 7
      },
      lens_config: {
        min_similarity_score: '0.36',
        card_filter: {
          query: null,
          participants_domains: null,
          initiative_ids: null,
          label_ids: null,
          sub_sources: ['Slack_Digest', 'Teams_Digest']
        },
        include_earnings_call: true,
        match_prompt: 'Test match prompt',
        explanatory_prompt: 'Test explanatory_prompt'
      },
      creator: { id: 'user-123', name: 'John Doe' },
      tenant: { id: 'tenant-456' },
      description: 'This is a lens titled "Test Lens" originally created by John Doe.',
      collaborators: [{ id: 'user-123', name: 'John Doe' }],
      start_at: 1739491200000,
      end_at: 2055455999059
    });
  });

  it('should handle default date filter correctly', () => {
    const formData = {
      title: 'Test Lens',
      filters: {
        date: {
          enabled: false
        }
      },
      lens_config: { min_similarity_score: 100 }
    };

    const result = prepareDataForSubmission(formData, mockUser);

    // should be 60 days in past and 10 years in future
    expect(result.start_at).toEqual(new Date('2024-12-20T05:00:00.000Z'));
    expect(result.end_at).toEqual(new Date('2035-02-19T04:59:59.059Z'));
  });

  it('should handle people filters correctly', () => {
    const formData = {
      title: 'Test Lens',
      filters: {
        people: {
          internal: [
            { email: 'alice@fora.day', name: 'Alice' },
            { email: 'bob@fora.day', name: 'Bob' }
          ]
        }
      },
      lens_config: { min_similarity_score: 100 }
    };

    const result = prepareDataForSubmission(formData, mockUser);

    expect(result.lens_config.card_filter.query).toBe('alice@fora.day,bob@fora.day');
  });

  it('should handle participants domains correctly', () => {
    const formData = {
      title: 'Test Lens',
      filters: {
        participants_domains: ['example.com', 'test.com']
      },
      lens_config: { min_similarity_score: 25 }
    };

    const result = prepareDataForSubmission(formData, mockUser);

    expect(result.lens_config.card_filter.participants_domains).toEqual([
      '@example.com',
      '@test.com'
    ]);
  });

  it('should handle initiative_ids correctly', () => {
    const formData = {
      title: 'Test Lens',
      filters: {
        focus: [{ value: 'initiative-1' }, { value: 'initiative-2' }]
      },
      lens_config: { min_similarity_score: 50 }
    };

    const result = prepareDataForSubmission(formData, mockUser);

    expect(result.lens_config.card_filter.initiative_ids).toEqual(['initiative-1', 'initiative-2']);
  });

  it('should handle collaborators correctly', () => {
    const formData = {
      title: 'Test Lens',
      filters: {},
      collaborators: [{ id: 'user-456', name: 'Jane Doe' }],
      lens_config: { min_similarity_score: 50 }
    };

    const result = prepareDataForSubmission(formData, mockUser);

    expect(result.collaborators).toEqual([
      { id: 'user-123', name: 'John Doe' },
      { id: 'user-456', name: 'Jane Doe' }
    ]);
  });

  it('should default filters to null when they are not provided, include_earnings_call to false and sub_sources to []', () => {
    const formData = {
      title: 'Test Lens',
      filters: {},
      lens_config: { min_similarity_score: 25 }
    };

    const result = prepareDataForSubmission(formData, mockUser);

    expect(result.lens_config.card_filter).toEqual({
      query: null,
      participants_domains: null,
      initiative_ids: null,
      label_ids: null,
      sub_sources: []
    });
    expect(result.lens_config.include_earnings_call).toBe(false);
  });
});

describe('patchLensData', () => {
  const mockFormData = {
    id: 'lens-123',
    title: 'Test Lens',
    visibility: 'public',
    color: 'blue',
    icon: 'star',
    created_at: '2023-01-01T12:00:00Z',
    collaborators: [{ id: 'user-1', name: 'Alice' }],
    filters: {
      date: {
        start_at_from: 1739491200000,
        start_at_to: 2055455999059,
        enabled: true
      },
      sub_sources: ['Slack_Digest', 'Earnings_Call']
    },
    lens_config: {
      min_similarity_score: 50,
      match_prompt: 'Test match prompt',
      explanatory_prompt: 'Test explanatory_prompt'
    },
    insight_config: { max_cards: 10, duration_days: 14 }
  };

  it('should return formatted data with required fields', () => {
    const result = patchLensData(mockFormData);

    expect(result).toEqual({
      id: 'lens-123',
      title: 'Test Lens',
      visibility: 'public',
      color: 'blue',
      icon: 'star',
      collaborators: [{ id: 'user-1', name: 'Alice' }],
      lens_config: {
        min_similarity_score: '0.36',
        card_filter: {
          query: null,
          participants_domains: null,
          initiative_ids: null,
          label_ids: null,
          sub_sources: ['Slack_Digest']
        },
        include_earnings_call: true,
        match_prompt: 'Test match prompt',
        explanatory_prompt: 'Test explanatory_prompt'
      },
      insight_config: {
        max_cards: 20, // Overwritten to default value
        ...mockFormData.insight_config
      },
      start_at: 1739491200000,
      end_at: 2055455999059
    });
  });

  it('should override start_at and end_at if dateFilters.enabled is false', () => {
    const formData = {
      ...mockFormData,
      filters: {
        date: { enabled: false }
      }
    };

    const expectedStartAt = subDays(new Date(formData.created_at), 60);
    const expectedEndAt = addYears(new Date(formData.created_at), 10);

    const result = patchLensData(formData);

    expect(result.start_at).toEqual(expectedStartAt);
    expect(result.end_at).toEqual(expectedEndAt);
  });

  it('should handle people filters correctly', () => {
    const formData = {
      ...mockFormData,
      filters: {
        people: {
          internal: [
            { email: 'alice@fora.day', name: 'Alice' },
            { email: 'bob@fora.day', name: 'Bob' }
          ]
        }
      }
    };

    const result = patchLensData(formData);

    expect(result.lens_config.card_filter.query).toBe('alice@fora.day,bob@fora.day');
  });

  it('should handle participants domains correctly', () => {
    const formData = {
      ...mockFormData,
      filters: {
        participants_domains: ['example.com', 'test.com']
      }
    };

    const result = patchLensData(formData);

    expect(result.lens_config.card_filter.participants_domains).toEqual([
      '@example.com',
      '@test.com'
    ]);
  });

  it('should handle initiative_ids correctly', () => {
    const formData = {
      ...mockFormData,
      filters: {
        focus: [{ value: 'initiative-1' }, 'initiative-2']
      }
    };

    const result = patchLensData(formData);

    expect(result.lens_config.card_filter.initiative_ids).toEqual(['initiative-1', 'initiative-2']);
  });

  it('should default filters to null (or expected defaults) if not provided', () => {
    const formData = {
      ...mockFormData,
      filters: {}
    };

    const result = patchLensData(formData);

    // ignoring sub_sources since at least one selection is required
    expect(result.lens_config.card_filter).toEqual(
      expect.objectContaining({
        query: null,
        participants_domains: null,
        initiative_ids: null
      })
    );
  });

  it('should map similarity score correctly', () => {
    const formData = {
      ...mockFormData,
      lens_config: { min_similarity_score: 50 }
    };

    const result = patchLensData(formData);

    expect(result.lens_config.min_similarity_score).toBe('0.36');
  });
});

describe('formatPeopleForApi', () => {
  it('should return an empty array when given an empty object', () => {
    expect(formatPeopleForApi({})).toEqual([]);
  });

  it('should return an empty array when given null or undefined', () => {
    expect(formatPeopleForApi(null)).toEqual([]);
    expect(formatPeopleForApi(undefined)).toEqual([]);
  });

  it('should correctly extract emails from internal people', () => {
    const input = {
      internal: [{ email: 'user1@example.com' }, { email: 'user2@example.com' }]
    };

    expect(formatPeopleForApi(input)).toEqual(['user1@example.com', 'user2@example.com']);
  });

  it('should correctly handle external emails', () => {
    const input = {
      external: ['external1@example.com', 'external2@example.com']
    };

    expect(formatPeopleForApi(input)).toEqual(['external1@example.com', 'external2@example.com']);
  });

  it('should merge internal and external emails correctly', () => {
    const input = {
      internal: [{ email: 'user1@example.com' }, { email: 'user2@example.com' }],
      external: ['external1@example.com', 'external2@example.com']
    };

    expect(formatPeopleForApi(input)).toEqual([
      'user1@example.com',
      'user2@example.com',
      'external1@example.com',
      'external2@example.com'
    ]);
  });

  it('should handle cases where internal or external fields are missing', () => {
    const input1 = { internal: [{ email: 'user1@example.com' }] };
    expect(formatPeopleForApi(input1)).toEqual(['user1@example.com']);

    const input2 = { external: ['external1@example.com'] };
    expect(formatPeopleForApi(input2)).toEqual(['external1@example.com']);
  });

  it('should return an empty array if internal and external lists are empty', () => {
    const input = {
      internal: [],
      external: []
    };

    expect(formatPeopleForApi(input)).toEqual([]);
  });
});
