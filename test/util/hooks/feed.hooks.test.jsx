import * as QueryParams from 'use-query-params';
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, afterEach, beforeEach } from 'vitest';
import { useContentTypeOptions, useFeedPageFilters } from '@util/hooks';
import { find } from 'lodash-es';
import { useStatsigClient } from '@statsig/react-bindings';

vi.mock('use-query-params');

vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: vi.fn()
}));

describe('useContentTypeOptions', () => {
  const expectContentType = (items, item) => expect(find(items, item)).toBeTruthy();

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return standard content types always', () => {
    useStatsigClient.mockReturnValueOnce({ checkGate: () => false });
    const { result } = renderHook(() => useContentTypeOptions());
    expectContentType(result.current, { id: 'Meeting' });
    expectContentType(result.current, { id: 'Channel', sub_sources: ['Email_Thread'] });
    expectContentType(result.current, { id: 'Channel', sub_sources: ['Document_Upload'] });
    expectContentType(result.current, { id: 'Channel', sub_sources: ['Slack_Digest'] });
    expect(find(result.current, { title: 'Earnings Call' })).toBeUndefined();
  });

  it('should return earnings call content type if passes FF', () => {
    useStatsigClient.mockReturnValueOnce({ checkGate: (flag) => flag === 'earnings-calls' });
    const { result } = renderHook(() => useContentTypeOptions());
    expectContentType(result.current, { title: 'Earnings Call' });
    expect(find(result.current, { id: 'Channel', source: 'Teams' })).toBeUndefined();
  });

  it('should return Teams Digest content type if passes FF', () => {
    useStatsigClient.mockReturnValueOnce({ checkGate: (flag) => flag === 'teams-digests' });
    const { result } = renderHook(() => useContentTypeOptions());
    expectContentType(result.current, { id: 'Channel', sub_sources: ['Teams_Digest'] });
    expect(find(result.current, { title: 'Earnings Call' })).toBeUndefined();
  });
});

describe('useFeedPageFilters', () => {
  let mockParams;

  beforeEach(() => {
    // Reset mock params before each test
    mockParams = {
      keyword: ['', vi.fn()],
      saved: [null, vi.fn()],
      archived: [null, vi.fn()],
      shared: [null, vi.fn()],
      participantId: [null, vi.fn()],
      focuses: [[], vi.fn()],
      labels: [[], vi.fn()],
      dateRange: ['All Dates', vi.fn()],
      contentTypeSubSources: [[], vi.fn()],
      createdAtFrom: [null, vi.fn()],
      createdAtTo: [null, vi.fn()]
    };

    QueryParams.useQueryParam = vi.fn((key) => mockParams[key]);
  });

  it('returns default filter values', () => {
    const { result } = renderHook(() => useFeedPageFilters());

    expect(result.current.filters.keyword).toBe('');
    expect(result.current.filters.savedFilter).toBeNull();
    expect(result.current.filters.archivedFilter).toBeNull();
    expect(result.current.filters.sharedFilter).toBeNull();
    expect(result.current.filters.focuses).toEqual([]);
    expect(result.current.filters.labels).toEqual([]);
    expect(result.current.filters.dateRange).toBe('All Dates');
    expect(result.current.filters.createdAtFrom).toBeNull();
    expect(result.current.filters.createdAtTo).toBeNull();
    expect(result.current.filters.participantId).toBeNull();
  });

  it('calls correct setter on handleFilterChange', () => {
    const { result } = renderHook(() => useFeedPageFilters());

    act(() => {
      result.current.handleFilterChange('savedFilter', true);
    });

    expect(mockParams.saved[1]).toHaveBeenCalledWith(true, 'replaceIn');

    act(() => {
      result.current.handleFilterChange('archivedFilter', true);
    });

    expect(mockParams.archived[1]).toHaveBeenCalledWith(true, 'replaceIn');

    act(() => {
      result.current.handleFilterChange('sharedFilter', true);
    });

    expect(mockParams.shared[1]).toHaveBeenCalledWith(true, 'replaceIn');

    act(() => {
      result.current.handleFilterChange('participantId', 'user-1234');
    });

    expect(mockParams.participantId[1]).toHaveBeenCalledWith('user-1234', 'replaceIn');
  });

  it('calls all setters on handleResetFilters', () => {
    const { result } = renderHook(() => useFeedPageFilters());

    act(() => {
      result.current.handleResetFilters();
    });

    expect(mockParams.saved[1]).toHaveBeenCalledWith(null);
    expect(mockParams.archived[1]).toHaveBeenCalledWith(null);
    expect(mockParams.shared[1]).toHaveBeenCalledWith(null);
    expect(mockParams.participantId[1]).toHaveBeenCalledWith(null);
    expect(mockParams.focuses[1]).toHaveBeenCalledWith([]);
    expect(mockParams.labels[1]).toHaveBeenCalledWith([]);
    expect(mockParams.keyword[1]).toHaveBeenCalledWith(null);
    expect(mockParams.contentTypeSubSources[1]).toHaveBeenCalledWith([]);
    expect(mockParams.createdAtFrom[1]).toHaveBeenCalledWith(null);
    expect(mockParams.createdAtTo[1]).toHaveBeenCalledWith(null);
    expect(mockParams.dateRange[1]).toHaveBeenCalledWith(null);
  });

  it('computes active filter counts correctly', () => {
    // Override test data for keyword and createdAtFrom
    mockParams.keyword[0] = 'search';
    mockParams.createdAtFrom[0] = 12345;

    const { result } = renderHook(() => useFeedPageFilters());

    expect(result.current.activeFilterCount).toBe(2); // keyword + createdAtFrom
    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('hasActiveFilters if savedFilter', () => {
    mockParams.saved[0] = true;

    const { result } = renderHook(() => useFeedPageFilters());

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('hasActiveFilters if archivedFilter', () => {
    mockParams.archived[0] = true;

    const { result } = renderHook(() => useFeedPageFilters());

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('hasActiveFilters if sharedFilter', () => {
    mockParams.shared[0] = true;

    const { result } = renderHook(() => useFeedPageFilters());

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('hasActiveFilters if participantId', () => {
    mockParams.participantId[0] = 'user-1234';

    const { result } = renderHook(() => useFeedPageFilters());

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('hasActiveFilters if focuses', () => {
    mockParams.focuses[0] = ['focus-1234'];

    const { result } = renderHook(() => useFeedPageFilters());

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('hasActiveFilters if labels', () => {
    mockParams.labels[0] = ['label-1234'];

    const { result } = renderHook(() => useFeedPageFilters());

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it('computes hasActiveFilters as false with only default values', () => {
    const { result } = renderHook(() => useFeedPageFilters());
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
