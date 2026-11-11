import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { act } from 'react-dom/test-utils';
import timezoneMock from 'timezone-mock';

import { useUserStore } from '@store/app.store';
import {
  useCreateMeeting,
  useScheduleBotForMeeting
} from '@services/query-services/meetings.query-service.js';
import CreateMeetingModal from '@components/meeting/create-meeting-modal.component';
import { useStatsigClient } from '@statsig/react-bindings';
import { useInitiativeOptions } from '@services/query-services/initiatives.query-service';

vi.mock('@services/query-services/meetings.query-service.js', () => ({
  useCreateMeeting: vi.fn(),
  useScheduleBotForMeeting: vi.fn()
}));

vi.mock('@services/query-services/initiatives.query-service');

vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn(),
  useBreakpoints: () => ({ isMobile: false })
}));

vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

describe('CreateMeetingModal', () => {
  const disclosure = {
    isOpen: true,
    onClose: vi.fn(),
    onOpen: vi.fn()
  };

  const modalContentProps = {};
  const onClose = vi.fn();

  let createMeetingMock;
  let scheduleBotMock;
  let checkGateMock;

  beforeEach(() => {
    checkGateMock = vi.fn();
    useStatsigClient.mockReturnValue({ checkGate: checkGateMock });
    timezoneMock.register('UTC');

    const mockCurrentDate = new Date(2024, 11, 16, 10, 0);
    vi.setSystemTime(mockCurrentDate);

    createMeetingMock = vi.fn();
    useCreateMeeting.mockReturnValue({
      mutateAsync: createMeetingMock,
      isLoading: false
    });

    scheduleBotMock = vi.fn();
    useScheduleBotForMeeting.mockReturnValue({
      mutateAsync: scheduleBotMock,
      isLoading: false
    });

    checkGateMock.mockReturnValue(true);

    useInitiativeOptions.mockReturnValue({ data: [{ value: 'focus', label: 'Focus' }] });
  });

  afterEach(() => {
    timezoneMock.unregister();
  });

  const renderComponent = () =>
    render(
      <ChakraProvider>
        <CreateMeetingModal
          disclosure={disclosure}
          modalContentProps={modalContentProps}
          onClose={onClose}
        />
      </ChakraProvider>
    );

  describe('FORA user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ id: 'user-1', isGuest: false });
    });

    it('renders NewCreateMeetingModal when "summarize-menu" feature flag is enabled', () => {
      renderComponent();
      expect(screen.getByTestId('create-meeting-modal')).toBeInTheDocument();
      expect(screen.queryByTestId('legacy-create-meeting-modal')).not.toBeInTheDocument();
    });

    it('enables useInitiativeOptions', () => {
      renderComponent();
      expect(useInitiativeOptions).toHaveBeenCalledWith({ type: 'Focus' }, { enabled: true });
    });

    it('renders LegacyCreateMeetingModal when "summarize-menu" feature flag is disabled', () => {
      checkGateMock.mockReturnValue(false);
      renderComponent();
      expect(checkGateMock()).toEqual(false);
      expect(screen.getByTestId('legacy-create-meeting-modal')).toBeInTheDocument();
      expect(screen.queryByTestId('create-meeting-modal')).not.toBeInTheDocument();
    });

    it('renders the modal with all input fields', () => {
      renderComponent();

      // Check that header renders
      expect(screen.getByText('Add FORA to a Meeting')).toBeInTheDocument();

      // Check that form fields are rendered
      expect(screen.getByText('Meeting Name')).toBeInTheDocument();
      expect(screen.getByText('Add Link')).toBeInTheDocument();
      expect(screen.getByText('Meeting Category')).toBeInTheDocument();
    });

    it('validates form fields and shows error messages', async () => {
      renderComponent();

      // Click submit without filling out required fields
      const submitButton = screen.getByText('Add FORA');
      fireEvent.click(submitButton);

      // Wait for validation errors
      await waitFor(() => {
        expect(screen.getByText('Please enter a meeting title.')).toBeInTheDocument();
        expect(
          screen.getByText('Please enter a valid videoconferencing link.')
        ).toBeInTheDocument();
      });
    });

    it('calls onSubmit with correct form values', async () => {
      renderComponent();

      // Fill out form fields
      fireEvent.change(screen.getByTestId('meeting-name-input'), {
        target: { value: 'Test Meeting' }
      });
      fireEvent.change(screen.getByTestId('link-input'), {
        target: { value: 'https://meet.google.com/abc-defg-hij' }
      });

      const meetingCategorySelectInput = screen.getByText('Choose Category');
      fireEvent.focus(meetingCategorySelectInput);
      fireEvent.keyDown(meetingCategorySelectInput, { key: 'ArrowDown', code: 'ArrowDown' });
      await waitFor(() => {
        expect(screen.getByText('Focus')).toBeInTheDocument();
      });
      fireEvent.click(screen.getByText('Focus'));
      const addForaButton = screen.getByRole('button', { name: /Add FORA/i });
      fireEvent.click(addForaButton);

      await waitFor(async () => {
        expect(createMeetingMock).toHaveBeenCalledWith({
          title: 'Test Meeting',
          description: 'https://meet.google.com/abc-defg-hij',
          url: 'https://meet.google.com/abc-defg-hij',
          start_at: 1734343200000,
          end_at: 1734346800000,
          bot_attendee: true,
          initiative: { id: 'focus' },
          attendees: [
            {
              id: 'user-1',
              status: { id: 'a' }
            }
          ]
        });
        expect(scheduleBotMock).toHaveBeenCalled();
      });
    });

    /**
      !!!WARNING!!!

      I have a feeling this is going to lead to some flaky tests. The only
      way I could get this to work was to add a "timeout" between re-renders. If
      this starts causing some issues down the line, feel free to drop this test
      out and we can revisit it.
  */
    it('resets the form when modal is closed', async () => {
      createMeetingMock.mockResolvedValueOnce({ id: '12345' });

      const { rerender } = renderComponent();

      const meetingNameInput = screen.getByTestId('meeting-name-input');

      // should start empty
      expect(meetingNameInput.value).toBe('');

      // Fill out form fields
      fireEvent.change(meetingNameInput, { target: { value: 'Test Meeting' } });

      // Close modal
      rerender(
        <ChakraProvider>
          <CreateMeetingModal
            disclosure={{ ...disclosure, isOpen: false }}
            modalContentProps={modalContentProps}
            onClose={onClose}
          />
        </ChakraProvider>
      );

      await act(async () => {
        // Wait for reset to be triggered
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Allow state to settle
      });

      rerender(
        <ChakraProvider>
          <CreateMeetingModal
            disclosure={{ ...disclosure, isOpen: true }}
            modalContentProps={modalContentProps}
            onClose={onClose}
          />
        </ChakraProvider>
      );

      expect(screen.getByTestId('meeting-name-input').value).toBe('');
    });
  });

  describe('guest user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ id: 'user-1', isGuest: true });
    });

    it('disables useInitiativeOptions', () => {
      renderComponent();
      expect(useInitiativeOptions).toHaveBeenCalledWith({ type: 'Focus' }, { enabled: false });
    });
  });
});
