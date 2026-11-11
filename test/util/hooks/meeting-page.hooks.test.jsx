import { describe, it, vi, expect, beforeEach } from 'vitest';
import { faker } from '@faker-js/faker';

import { useCards } from '@services/query-services/cards.query-service';
import {
  useGeneratedCardData,
  usePopulateMeetingAttendees,
  handleMeetingError
} from '@util/hooks/meeting-page.hooks';
import { renderHookWithProviders } from '@test/test.helpers';
import { waitFor } from '@testing-library/react';
import { useUserStore } from '@store/app.store';
import { useMeetingById } from '@services/query-services/meetings.query-service';

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@services/query-services/cards.query-service', () => ({
  useCards: vi.fn()
}));

vi.mock('@services/query-services/insights.query-service', () => ({
  usePrefetchInfiniteInsights: vi.fn()
}));

describe('useGeneratedCardData', () => {
  const mockUseCardsHook = vi.fn();
  // const mockSelectAndSortCards = vi.fn((cards) => cards);
  const card = { source_data: { id: '123' } };
  const meeting = { linked: { id: '456' }, id: '789' };
  const user = { id: 'user1', isGuest: false };
  const getGeneratingSummary = vi.fn();
  const meetingIdWithBot = 'meeting1';

  beforeEach(() => {
    useCards.mockReturnValue({ data: [{ id: 'card1' }, { id: 'card2' }], isLoading: false });
  });

  it('should generate cardsBySource and allCards correctly', () => {
    const { cardsBySource, allCards, isLoading } = useGeneratedCardData(
      card,
      meeting,
      user,
      getGeneratingSummary
    );

    expect(cardsBySource).toEqual({
      source_data_id: '123',
      person_id: 'user1',
      initiative_type: null,
      archived: false,
      pageSize: 50
    });

    expect(useCards).toHaveBeenCalledWith(cardsBySource, {
      enabled: true,
      select: expect.any(Function)
    });

    expect(isLoading).toBe(false);
    expect(allCards).toEqual([{ id: 'card1' }, { id: 'card2' }]);
  });

  it('should handle guest users correctly', () => {
    const guestUser = { ...user, isGuest: true };
    const { cardsBySource, allCards } = useGeneratedCardData(
      card,
      meeting,
      guestUser,
      getGeneratingSummary,
      meetingIdWithBot,
      mockUseCardsHook
    );

    expect(useCards).toHaveBeenCalledWith(cardsBySource, {
      enabled: false,
      select: expect.any(Function)
    });

    expect(allCards).toEqual([card]);
  });
});

describe('handleMeetingError', () => {
  const mockToast = vi.fn();
  mockToast.isActive = vi.fn();
  const mockNavigate = vi.fn();
  const mockRollbar = { error: vi.fn() };

  const meetingId = 'abc123';

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows access denied toast and navigates for 401 error', () => {
    const error = { status: 401, response: { data: 'unauthorized' } };
    mockToast.isActive.mockReturnValue(false);

    handleMeetingError({
      error,
      toast: mockToast,
      navigate: mockNavigate,
      rollbar: mockRollbar,
      meetingId
    });

    expect(mockRollbar.error).toHaveBeenCalledWith(
      'User encountered error loading meeting data',
      'unauthorized',
      { meetingId }
    );
    expect(mockToast).toHaveBeenCalledWith({
      id: 'no-meeting-access',
      status: 'warning',
      title: 'You do not have access to this meeting.'
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows generic error toast and navigates for 403 error', () => {
    const error = { status: 403, response: { data: 'Forbidden' } };
    mockToast.isActive.mockReturnValue(false);

    handleMeetingError({
      error,
      toast: mockToast,
      navigate: mockNavigate,
      rollbar: mockRollbar,
      meetingId
    });

    expect(mockRollbar.error).toHaveBeenCalledWith(
      'User encountered error loading meeting data',
      'Forbidden',
      { meetingId }
    );
    expect(mockToast).toHaveBeenCalledWith({
      id: 'error-loading-meeting',
      status: 'warning',
      title: 'Failed to load meeting data, please try again.'
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows not found error toast and navigates for 404 error', () => {
    const error = { status: 404, response: { data: 'Not Found' } };
    mockToast.isActive.mockReturnValue(false);

    handleMeetingError({
      error,
      toast: mockToast,
      navigate: mockNavigate,
      rollbar: mockRollbar,
      meetingId
    });

    expect(mockRollbar.error).toHaveBeenCalledWith(
      'User encountered error loading meeting data',
      'Not Found',
      { meetingId }
    );
    expect(mockToast).toHaveBeenCalledWith({
      id: 'meeting-not-found',
      status: 'warning',
      title: 'This meeting cannot be found, please try again.'
    });
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('shows generic error toast for non-401 errors', () => {
    const error = { status: 500, response: { data: 'server error' } };
    mockToast.isActive.mockReturnValue(false);

    handleMeetingError({
      error,
      toast: mockToast,
      navigate: mockNavigate,
      rollbar: mockRollbar,
      meetingId
    });

    expect(mockRollbar.error).toHaveBeenCalledWith(
      'User encountered error loading meeting data',
      'server error',
      { meetingId }
    );
    expect(mockToast).toHaveBeenCalledWith({
      id: 'error-loading-meeting',
      status: 'warning',
      title: 'Failed to load meeting data, please try again.'
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does not show toast if already active', () => {
    const error = { status: 500, response: { data: 'server error' } };
    mockToast.isActive.mockReturnValue(true); // already shown

    handleMeetingError({
      error,
      toast: mockToast,
      navigate: mockNavigate,
      rollbar: mockRollbar,
      meetingId
    });

    expect(mockToast).not.toHaveBeenCalledWith(
      expect.objectContaining({ id: 'error-loading-meeting' })
    );
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('does nothing if error is null', () => {
    handleMeetingError({
      error: null,
      toast: mockToast,
      navigate: mockNavigate,
      rollbar: mockRollbar,
      meetingId
    });

    expect(mockRollbar.error).not.toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('usePopulateMeetingAttendees', () => {
  it('should return populated attendees', async () => {
    useUserStore.mockImplementation((selector) => selector({ tenant: { id: '1' }, user: {} }));

    const { result: meetingResult } = renderHookWithProviders(() => useMeetingById('any'));
    await waitFor(() => {
      expect(meetingResult.current.isFetched).toBeTruthy();
    });

    const meeting = {
      ...meetingResult.current.data,
      // since Nylas property isn't described in OpenAPI spec
      nylas: {
        participants: [...new Array(faker.number.int({ min: 1, max: 100 })).keys()].map((_) => ({
          id: faker.string.uuid(),
          name: faker.person.fullName(),
          email: faker.internet.email(),
          title: faker.string.alpha({ length: { min: 0, max: 500 } }),
          company_name: faker.person.fullName(),
          company_type: faker.string.alpha({ length: { min: 0, max: 255 } }),
          company_industry: faker.string.alpha({ length: { min: 0, max: 255 } }),
          avatar_url: faker.internet.url(),
          comment: faker.string.alpha({ length: { min: 0, max: 500 } }),
          status: faker.helpers.arrayElement(['yes', 'no', 'maybe', 'noreply']),
          external: faker.datatype.boolean()
        }))
      }
    };

    const { result } = renderHookWithProviders(() => usePopulateMeetingAttendees([meeting], true));
    await waitFor(() => {
      expect(result.current.populatedAttendees[0]).toHaveProperty('apolloProfile');
    });
  });
});
