import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CardActions from '@components/general/card/reskin-summary-card/reskin-summary-card-actions.component';
import { useBreakpoints } from '@util/hooks';

// Mock external dependencies
vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn()
}));

vi.mock('@components/meeting/share-meeting-modal.component', () => ({
  default: ({ openButton, meeting, bot }) => (
    <div data-testid='share-modal'>
      {openButton}
      <span data-testid='meeting-id'>{meeting?.id}</span>
      <span data-testid='bot-id'>{bot?.id}</span>
    </div>
  )
}));

// Mock icons
vi.mock('@assets/icons', () => ({
  SFBookmarkFilledIcon: () => <span data-testid='saved-icon' />,
  SFBookmarkIcon: () => <span data-testid='save-icon' />,
  SFEyeIcon: () => <span data-testid='unarchive-icon' />,
  SFEyeSlashIcon: () => <span data-testid='archive-icon' />,
  SFSquareArrowUp: () => <span data-testid='share-icon' />
}));

describe('CardActions', () => {
  const defaultProps = {
    card: {
      id: '1',
      preferred: false,
      archived: false,
      source: 'Document'
    },
    onCardActionClick: vi.fn(),
    isHovering: false,
    isMobile: false,
    showBody: true,
    shareMeetingDisclosure: { isOpen: false, onOpen: vi.fn(), onClose: vi.fn() }
  };

  beforeEach(() => {
    vi.clearAllMocks();
    // Default to desktop
    useBreakpoints.mockReturnValue({ isMobile: false });
  });

  describe('Visibility Logic', () => {
    it('shows actions when hovering on desktop', () => {
      render(
        <CardActions
          {...defaultProps}
          isHovering={true}
        />
      );

      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
      expect(screen.getByTestId('archive-icon')).toBeInTheDocument();
    });

    it('shows actions on mobile regardless of hover state', () => {
      render(
        <CardActions
          {...defaultProps}
          isMobile={true}
          isHovering={false}
        />
      );

      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
      expect(screen.getByTestId('archive-icon')).toBeInTheDocument();
    });

    it('shows actions when not mobile and showBody is false', () => {
      render(
        <CardActions
          {...defaultProps}
          isMobile={false}
          showBody={false}
          isHovering={false}
        />
      );

      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
      expect(screen.getByTestId('archive-icon')).toBeInTheDocument();
    });

    it('hides actions when not hovering on desktop with showBody true', () => {
      render(
        <CardActions
          {...defaultProps}
          isHovering={false}
          isMobile={false}
          showBody={true}
        />
      );

      expect(screen.queryByTestId('save-icon')).not.toBeInTheDocument();
      expect(screen.queryByTestId('archive-icon')).not.toBeInTheDocument();
    });
  });

  describe('Action Icons', () => {
    it('shows filled bookmark when card is preferred', () => {
      const card = { ...defaultProps.card, preferred: true };
      render(
        <CardActions
          {...defaultProps}
          card={card}
          isHovering={true}
        />
      );

      expect(screen.getByTestId('saved-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('save-icon')).not.toBeInTheDocument();
    });

    it('shows empty bookmark when card is not preferred', () => {
      render(
        <CardActions
          {...defaultProps}
          isHovering={true}
        />
      );

      expect(screen.getByTestId('save-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('saved-icon')).not.toBeInTheDocument();
    });

    it('shows eye icon when card is archived', () => {
      const card = { ...defaultProps.card, archived: true };
      render(
        <CardActions
          {...defaultProps}
          card={card}
          isHovering={true}
        />
      );

      expect(screen.getByTestId('unarchive-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('archive-icon')).not.toBeInTheDocument();
    });

    it('shows eye-slash icon when card is not archived', () => {
      render(
        <CardActions
          {...defaultProps}
          isHovering={true}
        />
      );

      expect(screen.getByTestId('archive-icon')).toBeInTheDocument();
      expect(screen.queryByTestId('unarchive-icon')).not.toBeInTheDocument();
    });
  });

  describe('Share Meeting Feature', () => {
    it('shows share button for meeting cards', () => {
      const meetingCard = {
        ...defaultProps.card,
        source: 'Meeting',
        source_data: { id: 'meeting-123', bot_id: 'bot-456' }
      };

      render(
        <CardActions
          {...defaultProps}
          card={meetingCard}
          isHovering={true}
        />
      );

      expect(screen.getByTestId('share-modal')).toBeInTheDocument();
      expect(screen.getByTestId('share-icon')).toBeInTheDocument();
    });

    it('does not show share button for non-meeting cards', () => {
      render(
        <CardActions
          {...defaultProps}
          isHovering={true}
        />
      );

      expect(screen.queryByTestId('share-modal')).not.toBeInTheDocument();
      expect(screen.queryByTestId('share-icon')).not.toBeInTheDocument();
    });
  });

  describe('Click Handlers', () => {
    it('calls onCardActionClick with correct parameters for save action', () => {
      render(
        <CardActions
          {...defaultProps}
          isHovering={true}
        />
      );

      const saveButton = screen.getByTestId('save-icon').closest('button');
      fireEvent.click(saveButton);

      expect(defaultProps.onCardActionClick).toHaveBeenCalledWith(
        'save',
        true, // !card.preferred (false -> true)
        defaultProps.card
      );
    });

    it('calls onCardActionClick with correct parameters for archive action', () => {
      render(
        <CardActions
          {...defaultProps}
          isHovering={true}
        />
      );

      const archiveButton = screen.getByTestId('archive-icon').closest('button');
      fireEvent.click(archiveButton);

      expect(defaultProps.onCardActionClick).toHaveBeenCalledWith(
        'archive',
        true, // !card.archived (false -> true)
        defaultProps.card
      );
    });

    it('calls onCardActionClick with correct parameters when unsaving preferred card', () => {
      const preferredCard = { ...defaultProps.card, preferred: true };
      render(
        <CardActions
          {...defaultProps}
          card={preferredCard}
          isHovering={true}
        />
      );

      const saveButton = screen.getByTestId('saved-icon').closest('button');
      fireEvent.click(saveButton);

      expect(defaultProps.onCardActionClick).toHaveBeenCalledWith(
        'save',
        false, // !card.preferred (true -> false)
        preferredCard
      );
    });
  });
});
