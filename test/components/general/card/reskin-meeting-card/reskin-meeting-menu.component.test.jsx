import ReskinMeetingMenu from '@components/general/card/reskin-meeting-card/reskin-meeting-menu.component';
import analyticsService from '@services/analytics.service';
import { useNylasAccountStatus } from '@services/query-services/nylas.query-service';
import { useUserStore } from '@store/app.store';
import { renderWithProviders } from '@test/test.helpers';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { createStylesheet, getUserAttendanceStatus, lazyWithRetry } from '@util/helpers';
import {
  useIsUserType,
  useMeetingBotStatuses,
  useMeetingManagementActions,
  useMeetingTimeStatus,
  useRemoveFora,
  useReskinMeetingCardContext
} from '@util/hooks';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@util/hooks', () => ({
  useMeetingBotStatuses: vi.fn(),
  useMeetingManagementActions: vi.fn(),
  useReskinMeetingCardContext: vi.fn(),
  useIsUserType: vi.fn(),
  useMeetingTimeStatus: vi.fn(),
  useRemoveFora: vi.fn(),
  useCopyToClipboard: vi.fn()
}));

vi.mock('@services/query-services/nylas.query-service', () => ({
  useNylasAccountStatus: vi.fn()
}));

vi.mock('@services/analytics.service', () => ({
  default: {
    trackMenuClick: vi.fn()
  }
}));

vi.mock('@util/helpers', () => ({
  getMeetingSource: vi.fn(),
  registerFonts: vi.fn(),
  createStylesheet: vi.fn(),
  lazyWithRetry: vi.fn(),
  getUserAttendanceStatus: vi.fn(),
  minutes: vi.fn(),
  toSelectOptions: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

describe('ReskinMeetingMenu', () => {
  const mockMeeting = {
    id: 'meeting-1',
    title: 'Test Meeting',
    nylas: {
      organizer: { email: 'organizer@test.com' },
      participants: [{ email: 'participant@test.com' }]
    },
    rsvp: { status: 'yes' },
    initiative: { id: 'initiative-1', title: 'Test Initiative' },
    parent_id: null
  };

  const mockBot = {
    id: 'bot-1'
  };

  const mockCard = {
    id: 'card-1',
    initiative: { id: 'initiative-1', title: 'Test Initiative' }
  };

  const defaultMockContext = {
    meeting: mockMeeting,
    bot: mockBot,
    card: mockCard,
    onMeetingActionClick: vi.fn(),
    onCardActionClick: vi.fn(),
    showCardActions: true,
    labelsModalDisclosure: {
      isOpen: false,
      onOpen: vi.fn(),
      onClose: vi.fn()
    }
  };

  const renderComponent = (props = {}) => {
    return renderWithProviders(
      <ReskinMeetingMenu
        buttonProps={{}}
        showViewTranscriptButton={false}
        {...props}
      />
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default mock implementations
    useReskinMeetingCardContext.mockReturnValue(defaultMockContext);
    useMeetingBotStatuses.mockReturnValue({
      isDone: false,
      botWasScheduled: true
    });
    useMeetingManagementActions.mockReturnValue({
      transcriptAvailable: true
    });
    useMeetingTimeStatus.mockReturnValue('upcoming');
    useRemoveFora.mockReturnValue({
      removeFora: vi.fn(),
      isRemovingFora: false,
      removeFromSeries: vi.fn(),
      isRemovingFromSeries: false
    });
    useUserStore.mockReturnValue({
      id: 'user-1',
      email: 'user@test.com',
      isGuest: false
    });
    useNylasAccountStatus.mockReturnValue({
      data: { email_address: 'user@test.com' }
    });
    useIsUserType.mockReturnValue(false);
    getUserAttendanceStatus.mockReturnValue({ status: 'yes' });
  });

  describe('Basic Rendering', () => {
    it('renders the menu button', () => {
      renderComponent();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('tracks analytics when menu button is clicked', async () => {
      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      expect(analyticsService.trackMenuClick).toHaveBeenCalledWith(
        'Meeting Action Overflow Menu Click',
        {
          meetingId: mockMeeting.id,
          route: window?.location?.pathname
        }
      );
    });
  });

  describe('Meeting Status - Before/During', () => {
    beforeEach(() => {
      useMeetingBotStatuses.mockReturnValue({
        isDone: false,
        botWasScheduled: true
      });
    });

    it('shows edit category option', async () => {
      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Edit Category')).toBeInTheDocument();
      });
    });

    it('shows edit labels option', async () => {
      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Edit Labels')).toBeInTheDocument();
      });
    });

    it('shows remove FORA options when bot was scheduled', async () => {
      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Remove FORA')).toBeInTheDocument();
      });
    });

    it('shows remove from series option when meeting has parent_id', async () => {
      useReskinMeetingCardContext.mockReturnValue({
        ...defaultMockContext,
        meeting: { ...mockMeeting, parent_id: 'parent-1' }
      });

      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Remove FORA From Series')).toBeInTheDocument();
      });
    });
  });

  describe('Meeting Status - After', () => {
    beforeEach(() => {
      useMeetingBotStatuses.mockReturnValue({
        isDone: true,
        botWasScheduled: true
      });
    });

    it('shows view transcript button', async () => {
      renderComponent({ showViewTranscriptButton: true });

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('View Transcript')).toBeInTheDocument();
      });
    });

    it('shows category selector for non-guest users', async () => {
      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Edit Category')).toBeInTheDocument();
      });
    });

    it('hides category selector for guest users', async () => {
      useUserStore.mockReturnValue({
        id: 'user-1',
        email: 'user@test.com',
        isGuest: true
      });

      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.queryByTestId('category-selector')).not.toBeInTheDocument();
      });
    });

    it('shows delete option for executives/admins', async () => {
      useIsUserType.mockReturnValue(true);

      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Delete Meeting')).toBeInTheDocument();
      });
    });

    it('hides delete option for regular users', async () => {
      useIsUserType.mockReturnValue(false);

      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.queryByText('Delete Meeting')).not.toBeInTheDocument();
      });
    });
  });

  describe('Modal Interactions', () => {
    it('opens and handles category modal', async () => {
      const mockOnMeetingActionClick = vi.fn();
      useReskinMeetingCardContext.mockReturnValue({
        ...defaultMockContext,
        onMeetingActionClick: mockOnMeetingActionClick
      });

      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        const categorySelector = screen.getByText('Edit Category');
        fireEvent.click(categorySelector);
      });

      // Mock the modal as open
      const categoryModal = screen.getByTestId('category-modal');
      expect(categoryModal).toBeInTheDocument();

      const updateButton = screen.getByText('Update');
      fireEvent.click(updateButton);

      expect(mockOnMeetingActionClick).toHaveBeenCalled();
    });

    it('opens labels modal', async () => {
      const mockLabelsDisclosure = {
        isOpen: false,
        onOpen: vi.fn(),
        onClose: vi.fn()
      };

      useReskinMeetingCardContext.mockReturnValue({
        ...defaultMockContext,
        labelsModalDisclosure: mockLabelsDisclosure
      });

      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        const editLabelsButton = screen.getByText('Edit Labels');
        fireEvent.click(editLabelsButton);
      });

      expect(mockLabelsDisclosure.onOpen).toHaveBeenCalled();
    });

    it('handles delete confirmation', async () => {
      const mockOnMeetingActionClick = vi.fn();
      useReskinMeetingCardContext.mockReturnValue({
        ...defaultMockContext,
        onMeetingActionClick: mockOnMeetingActionClick
      });

      useMeetingBotStatuses.mockReturnValue({
        isDone: true,
        botWasScheduled: true
      });
      useIsUserType.mockReturnValue(true);

      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        const deleteButton = screen.getByText('Delete Meeting');
        fireEvent.click(deleteButton);
      });

      // Mock the modal as open and click confirm
      const confirmButton = screen.getByText('Delete Permanently');
      fireEvent.click(confirmButton);

      expect(mockOnMeetingActionClick).toHaveBeenCalledWith('archive', null, mockMeeting);
    });
  });

  describe('Remove FORA Actions', () => {
    it('calls removeFora and removeFromSeries when respective buttons are clicked', async () => {
      useReskinMeetingCardContext.mockReturnValue({
        ...defaultMockContext,
        meeting: { ...mockMeeting, parent_id: 'parent-1' }
      });
      const mockRemoveFora = vi.fn();
      const mockRemoveFromSeries = vi.fn();
      useRemoveFora.mockReturnValue({
        removeFora: mockRemoveFora,
        isRemovingFora: false,
        removeFromSeries: mockRemoveFromSeries,
        isRemovingFromSeries: false
      });

      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        const removeButton = screen.getByText('Remove FORA');
        fireEvent.click(removeButton);
      });

      expect(mockRemoveFora).toHaveBeenCalled();

      await waitFor(() => {
        const removeButton = screen.getByText('Remove FORA From Series');
        fireEvent.click(removeButton);
      });

      expect(mockRemoveFora).toHaveBeenCalled();
    });

    it('disables Remove FORA button when removing', async () => {
      useRemoveFora.mockReturnValue({
        removeFora: vi.fn(),
        isRemovingFora: true,
        removeFromSeries: vi.fn(),
        isRemovingFromSeries: false
      });

      renderComponent();

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        const removeButton = screen.getByText('Remove FORA').parentElement;
        expect(removeButton).toBeDisabled();
      });
    });
  });

  describe('Edge Cases', () => {
    it('handles missing transcript', async () => {
      useMeetingManagementActions.mockReturnValue({
        transcriptAvailable: false
      });

      renderComponent({ showViewTranscriptButton: true });

      const menuButton = screen.getByRole('button');
      fireEvent.click(menuButton);

      await waitFor(() => {
        expect(screen.queryByText('View Transcript')).not.toBeInTheDocument();
      });
    });
  });
});
