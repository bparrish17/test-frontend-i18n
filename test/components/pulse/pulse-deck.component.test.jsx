import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act } from '@testing-library/react';
import { useUpdate } from 'ahooks/es';
import { useReadCard } from '@services/query-services/cards.query-service.js';

vi.mock('@services/query-services/cards.query-service.js', () => ({
  useReadCard: vi.fn()
}));

vi.mock('ahooks/es', () => ({
  useUpdate: vi.fn()
}));

vi.mock('@components/pulse/pulse.store.js', () => ({
  __esModule: true,
  default: vi.fn()
}));

describe('onStoryStart', () => {
  let readCard;
  let update;
  let visibleIndex;
  let meeting;

  beforeEach(() => {
    readCard = vi.fn();
    update = vi.fn();
    visibleIndex = { current: 0 };
    meeting = { id: 'meeting-123', read_at: null };

    useReadCard.mockReturnValue({ mutate: readCard });
    useUpdate.mockReturnValue(update);
  });

  const onStoryStart = (index) => {
    if (!meeting.read_at) {
      readCard({ id: meeting?.id, value: true });
    }
    visibleIndex.current = index;
    update();
  };

  it('marks the card as read and updates the visible index', () => {
    act(() => {
      onStoryStart(1);
    });

    expect(readCard).toHaveBeenCalledWith({ id: 'meeting-123', value: true });
    expect(visibleIndex.current).toBe(1);
    expect(update).toHaveBeenCalled();
  });

  it('does not mark the card as read if already read', () => {
    meeting.read_at = '2023-01-01';

    act(() => {
      onStoryStart(1);
    });

    expect(readCard).not.toHaveBeenCalled();
    expect(visibleIndex.current).toBe(1);
    expect(update).toHaveBeenCalled();
  });
});
