import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useUserStore } from '@store/app.store';
import { useSetMeetingConfig } from '@services/query-services/people.query-service';
import { useStyledToast } from '@util/hooks';
import AutoSchedulingSection from '@pages/settings/account-settings/auto-scheduling.section';

// Mock dependencies
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@services/query-services/people.query-service', () => ({
  useSetMeetingConfig: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn()
}));

describe('AutoSchedulingSection', () => {
  const mockSetUser = vi.fn();
  const mockSetMeetingConfig = vi.fn();
  const mockToast = vi.fn();

  const mockUserStore = (userAutoSchedule, tenantAutoSchedule) => {
    useUserStore.mockImplementation((selector) =>
      selector({
        user: { id: '123', meeting_config: { auto_schedule: userAutoSchedule } },
        setUser: mockSetUser,
        tenant: { meeting_config: { auto_schedule: tenantAutoSchedule } }
      })
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUserStore(true, true);
    useSetMeetingConfig.mockReturnValue({
      mutateAsync: mockSetMeetingConfig,
      isLoading: false
    });

    useStyledToast.mockReturnValue(mockToast);
  });

  it('renders a switch component', () => {
    render(<AutoSchedulingSection />);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('sets the switch to tenant value if user value is null', () => {
    mockUserStore(null, true);
    render(<AutoSchedulingSection />);
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toBeChecked();
  });

  it('sets the switch to user value if user value is defined', () => {
    mockUserStore(false, true);
    render(<AutoSchedulingSection />);
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).not.toBeChecked();
  });

  it('calls handleAutoScheduleChange when the switch is toggled', async () => {
    mockUserStore(false, false);
    mockSetMeetingConfig.mockImplementationOnce((_body, { onSuccess }) => onSuccess());
    render(<AutoSchedulingSection />);
    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);
    await waitFor(() => {
      expect(mockSetMeetingConfig).toHaveBeenCalledWith(
        {
          id: '123',
          body: { auto_schedule: true }
        },
        expect.any(Object)
      );
    });
    expect(mockSetUser).toHaveBeenCalledWith({
      id: '123',
      meeting_config: { auto_schedule: true }
    });
  });

  it('disables the switch when isSetting is true', () => {
    useSetMeetingConfig.mockReturnValueOnce({
      mutateAsync: mockSetMeetingConfig,
      isLoading: true
    });
    render(<AutoSchedulingSection />);
    const switchElement = screen.getByRole('checkbox');
    expect(switchElement).toBeDisabled();
  });

  it('shows an error toast when the mutation fails', async () => {
    mockSetMeetingConfig.mockImplementationOnce((_body, { onError }) => onError());
    render(<AutoSchedulingSection />);
    const switchElement = screen.getByRole('checkbox');
    fireEvent.click(switchElement);
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Something went wrong while updating auto scheduling, please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true
      });
    });
  });
});
