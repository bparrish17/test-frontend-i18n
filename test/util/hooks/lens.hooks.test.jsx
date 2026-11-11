import { vi } from 'vitest';
import { filter } from 'lodash-es';

import { getInitialValues } from '@util/hooks/lens.hooks';
import { lensIsUsingDefaultTimestamps } from '@util/helpers/datetime.helpers'; // Mock this function
import { MEETING_SUB_SOURCES, SUB_SOURCE_FORM_VALUES } from '@util/constants';

vi.mock('@util/helpers/datetime.helpers', () => ({
  lensIsUsingDefaultTimestamps: vi.fn()
}));

describe('getInitialValues', () => {
  const nonECSubSources = filter(SUB_SOURCE_FORM_VALUES, (ss) => ss !== 'Earnings_Call');
  const mockTemplate = {
    title: 'Test Template',
    start_at: new Date('2025-01-01').getTime(),
    end_at: new Date('2035-01-01').getTime(),
    created_at: new Date('2025-03-01').getTime(),
    lens_config: {
      min_similarity_score: 0.4,
      card_filter: {
        query: 'test1,test2',
        initiative_ids: [1, 2, 3],
        participants_domains: ['test1@example.com', 'test2@domain.com']
      },
      include_earnings_call: false
    }
  };

  test('should return correct values when isEdit is true and dates are default', () => {
    lensIsUsingDefaultTimestamps.mockReturnValue(true); // Simulating default timestamps

    const result = getInitialValues(mockTemplate, true);
    expect(result).toEqual({
      values: {
        ...mockTemplate,
        lens_config: {
          ...mockTemplate.lens_config,
          min_similarity_score: 75
        },
        filters: {
          people: {
            external: ['test1', 'test2']
          },
          date: {
            enabled: false // Because dates are default
          },
          labels: [],
          focus: [1, 2, 3],
          participants_domains: ['example.com', 'domain.com'],
          sub_sources: nonECSubSources
        }
      }
    });
  });

  test('should return correct values when isEdit is true and dates are NOT default', () => {
    lensIsUsingDefaultTimestamps.mockReturnValue(false); // Simulating modified timestamps

    const result = getInitialValues(mockTemplate, true);

    expect(result).toEqual({
      values: {
        ...mockTemplate,
        lens_config: {
          ...mockTemplate.lens_config,
          min_similarity_score: 75
        },
        filters: {
          people: {
            external: ['test1', 'test2']
          },
          date: {
            start_at_from: mockTemplate.start_at,
            start_at_to: mockTemplate.end_at,
            enabled: true // Dates are modified, so enabled should be true
          },
          labels: [],
          focus: [1, 2, 3],
          participants_domains: ['example.com', 'domain.com'],
          sub_sources: nonECSubSources
        }
      }
    });
  });

  test('should return correct default values when isEdit is false', () => {
    const result = getInitialValues(mockTemplate, false);

    expect(result).toEqual({
      defaultValues: {
        title: 'Test Template',
        visibility: 'Collaborators',
        color: '#2563EB',
        icon: 'lens',
        filters: {
          date: {
            enabled: false
          },
          sub_sources: nonECSubSources
        },
        lens_config: {
          ...mockTemplate.lens_config,
          min_similarity_score: 75
        },
        insight_config: {
          duration_days: 7
        }
      }
    });
  });

  test('should return expected sub_sources mapped from sub_source and include_earnings_call params', () => {
    const result = getInitialValues(
      {
        ...mockTemplate,
        lens_config: {
          card_filter: { sub_sources: ['Slack_Digest', ...MEETING_SUB_SOURCES] },
          include_earnings_call: true
        }
      },
      true
    );

    expect(result.values.filters.sub_sources).toEqual(
      expect.arrayContaining(['Slack_Digest', 'Meeting', 'Earnings_Call'])
    );
  });

  test('should return all sub_sources as checked except for Earnings_Call on creation', () => {
    const result = getInitialValues(mockTemplate, false);
    expect(result.defaultValues.filters.sub_sources).toEqual(
      expect.arrayContaining(filter(SUB_SOURCE_FORM_VALUES, (ss) => ss !== 'Earnings_Call'))
    );
    expect(result.defaultValues.filters.sub_sources).toEqual(
      expect.not.arrayContaining(['Earnings_Call'])
    );
  });

  test('should return min_similarity_score default to 50 if undefined in template', () => {
    const modifiedTemplate = {
      ...mockTemplate,
      lens_config: {
        ...mockTemplate.lens_config,
        min_similarity_score: undefined // Missing value
      }
    };

    const result = getInitialValues(modifiedTemplate, false);

    expect(result.defaultValues.lens_config.min_similarity_score).toBe(50);
  });

  test('should return mapped labels, if provided', () => {
    const mockLabels = [
      { value: '123', label: 'Label 1' },
      { value: '345', label: 'Label 2' }
    ];
    const result = getInitialValues(mockTemplate, true, mockLabels);
    expect(result.values.filters.labels).toEqual(mockLabels);
  });
});
