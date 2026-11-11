import React from 'react';
import { render, renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';

import { usePusherEvent, usePusherChannel } from '@util/hooks/pusher.hooks';

import PusherService from '@services/pusher.service';

describe('usePusherEvent', () => {
  let mockChannel;

  beforeEach(() => {
    mockChannel = {
      bind: vi.fn(),
      unbind: vi.fn()
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const TestComponent = ({ channel, eventName, callback }) => {
    usePusherEvent(channel, eventName, callback);
    return null;
  };

  test('should bind the event on mount', () => {
    const callback = vi.fn();
    const eventName = 'test-event';

    render(
      <TestComponent
        channel={mockChannel}
        eventName={eventName}
        callback={callback}
      />
    );

    expect(mockChannel.bind).toHaveBeenCalledWith(eventName, expect.any(Function));
  });

  test('should unbind the event on unmount', () => {
    const callback = vi.fn();
    const eventName = 'test-event';

    const { unmount } = render(
      <TestComponent
        channel={mockChannel}
        eventName={eventName}
        callback={callback}
      />
    );

    unmount();

    expect(mockChannel.unbind).toHaveBeenCalledWith(eventName, expect.any(Function));
  });

  test('should call the callback when the event is triggered', () => {
    const callback = vi.fn();
    const eventName = 'test-event';
    let wrappedCallback;

    // Mock `bind` to capture the callback
    mockChannel.bind = vi.fn((_, cb) => {
      wrappedCallback = cb;
    });

    render(
      <TestComponent
        channel={mockChannel}
        eventName={eventName}
        callback={callback}
      />
    );

    // Simulate the event
    const mockData = { id: 123, message: 'Test message' };
    wrappedCallback(mockData);

    expect(callback).toHaveBeenCalledWith(mockData);
  });

  test('should not bind or unbind if channel is null', () => {
    const callback = vi.fn();
    const eventName = 'test-event';

    render(
      <TestComponent
        channel={null}
        eventName={eventName}
        callback={callback}
      />
    );

    expect(mockChannel.bind).not.toHaveBeenCalled();
    expect(mockChannel.unbind).not.toHaveBeenCalled();
  });
});

describe('usePusherChannel', () => {
  let mockSubscribe;
  let mockUnsubscribe;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSubscribe = vi.fn();
    PusherService.prototype.subscribe = mockSubscribe;

    mockUnsubscribe = vi.fn();
    PusherService.prototype.unsubscribe = mockUnsubscribe;
  });

  test('should subscribe to a channel when channelId is provided', () => {
    mockSubscribe.mockReturnValue({ unbind: vi.fn() });

    const { result } = renderHook(() => usePusherChannel('test-channel'));

    expect(mockSubscribe).toHaveBeenCalledWith('test-channel');
    expect(result.current.channel).not.toBeNull();
  });

  test('should unsubscribe and resubscribe when channelId changes', () => {
    const mockChannel = { unbind: vi.fn() };
    mockSubscribe.mockReturnValue(mockChannel);

    const { rerender } = renderHook(({ id }) => usePusherChannel(id), {
      initialProps: { id: 'channel-1' }
    });

    expect(mockSubscribe).toHaveBeenNthCalledWith(1, 'channel-1');

    rerender({ id: 'channel-2' });

    expect(mockChannel.unbind).toHaveBeenCalled();
    expect(mockUnsubscribe).toHaveBeenCalledWith('channel-1');
    expect(mockSubscribe).toHaveBeenNthCalledWith(2, 'channel-2');
  });

  test('should do nothing if channelId is null', () => {
    const { result } = renderHook(() => usePusherChannel(null));

    expect(result.current.channel).toBeNull();
    expect(mockSubscribe).not.toHaveBeenCalled();
  });
});
