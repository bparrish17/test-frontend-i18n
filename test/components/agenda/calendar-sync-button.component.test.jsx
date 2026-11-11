import { expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@test/test.helpers';
import CalendarSyncButton from '@components/agenda/calendar-sync-button.component';
import { useSyncNylasAccount } from '@services/query-services/nylas.query-service';
import { useStyledToast, usePusherChannel, usePusherEvent } from '@util/hooks';

vi.mock('@util/hooks');
vi.mock('@services/query-services/nylas.query-service');

describe('CalendarSyncButton', () => {
  const mockSyncNylasAccount = vi.fn();
  const mockToastFn = vi.fn();
  const mockToastClose = vi.fn();
  const mockChannel = { bind: vi.fn(), unbind: vi.fn() };
  let pusherEventCallback = null;
  let onSuccessCallback = null;

  beforeEach(() => {
    vi.clearAllMocks();
    pusherEventCallback = null;
    onSuccessCallback = null;

    mockToastFn.mockReturnValue('toast-id-123');
    mockToastFn.close = mockToastClose;

    useStyledToast.mockImplementation(() => mockToastFn);

    mockSyncNylasAccount.mockImplementation(async () => {
      const result = { id: 'test-nylas-account-id' };
      if (onSuccessCallback) {
        onSuccessCallback(result);
      }
      return result;
    });

    useSyncNylasAccount.mockImplementation((options) => {
      onSuccessCallback = options?.onSuccess;
      return { mutateAsync: mockSyncNylasAccount };
    });

    usePusherChannel.mockImplementation(() => ({
      channel: mockChannel
    }));

    usePusherEvent.mockImplementation((channel, event, callback) => {
      if (channel && event === 'on_completion') {
        pusherEventCallback = callback;
      }
    });
  });

  it('calls sync nylas account endpoint on click', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CalendarSyncButton />);

    const button = screen.getByRole('button');
    await user.click(button);

    expect(mockSyncNylasAccount).toHaveBeenCalled();
  });

  it('binds to pusher event after sync call', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CalendarSyncButton />);

    await user.click(screen.getByRole('button'));

    await vi.waitFor(() => {
      expect(usePusherEvent).toHaveBeenCalledWith(
        mockChannel,
        'on_completion',
        expect.any(Function)
      );
    });
  });

  it('displays success toast after pusher event is triggered', async () => {
    const user = userEvent.setup();

    renderWithProviders(<CalendarSyncButton />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockToastFn).toHaveBeenCalledWith({
        title: 'Syncing Calendar...',
        status: 'info',
        duration: 9000,
        isClosable: true
      });
    });

    await vi.waitFor(() => {
      expect(pusherEventCallback).toBeTruthy();
    });

    pusherEventCallback();

    expect(mockToastClose).toHaveBeenCalledWith('toast-id-123');
    expect(mockToastFn).toHaveBeenCalledWith({
      title: 'Calendar Sync Complete.',
      status: 'success',
      duration: 9000,
      isClosable: true
    });
  });

  it('shows loading state during sync', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CalendarSyncButton />);

    const button = screen.getByRole('button');
    await user.click(button);

    await waitFor(() => {
      expect(mockToastFn).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Syncing Calendar...',
          status: 'info'
        })
      );
    });

    await waitFor(() => {
      expect(button).toBeDisabled();
    });
  });

  it('clears loading state after pusher completion event', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CalendarSyncButton />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(pusherEventCallback).toBeTruthy();
    });

    pusherEventCallback();

    await waitFor(() => {
      const button = screen.getByRole('button');
      expect(button).not.toBeDisabled();
    });
  });
});
