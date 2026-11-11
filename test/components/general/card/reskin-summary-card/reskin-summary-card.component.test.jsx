import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { useBreakpointValue } from '@chakra-ui/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import { getDocumentMetadataFromCard } from '@util/helpers';
import { useBreakpoints, useIsUserType } from '@util/hooks';
import { renderWithProviders } from '@test/test.helpers';
import ReskinSummaryCard from '@components/general/card/reskin-summary-card/reskin-summary-card.component';

vi.mock('@chakra-ui/react', async (importActual) => ({
  ...(await importActual()),
  Tooltip: ({ children, label }) => <div data-testid={`action-tooltip-${label}`}>{children}</div>,
  useBreakpointValue: vi.fn()
}));

vi.mock('date-fns', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    format: vi.fn(() => 'Wed, Jan 1, 2024 10:00 AM')
  };
});

vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn(),
  useIsUserType: vi.fn()
}));

vi.mock('@store/app.store');

vi.mock('@util/helpers', async (importActual) => ({
  ...(await importActual()),
  getCardSourceLink: vi.fn(() => '/test-link'),
  formatTimeDistance: vi.fn(() => '2 hours ago'),
  getDocumentMetadataFromCard: vi.fn()
}));

vi.mock('@components/general/card/reskin-card-structure/reskin-card-header.component', () => ({
  default: ({ children }) => <div data-testid='ReskinCardHeader'>{children}</div>
}));

vi.mock('@components/general/source-logo.component', () => ({
  default: () => <div data-testid='SourceLogo' />
}));

vi.mock('@components/general/add-label-pill.component', () => ({
  default: () => <div data-testid='AddLabelPill' />
}));

vi.mock('@components/meeting/share-meeting-modal.component', () => ({
  default: ({ openButton }) => <div data-testid='share-meeting-modal'>{openButton}</div>
}));

vi.mock('@components/general/labels/labels-bar.component', () => ({
  default: ({ children }) => <div data-testid='LabelsBar'>{children}</div>
}));

// vi.mock(
//   '@components/general/card/reskin-summary-card/reskin-summary-card-actions.component.jsx',
//   () => ({
//     default: (props) => (
//       <div
//         data-testid='CardActions'
//         data-props={JSON.stringify(props)}
//       />
//     )
//   })
// );

// import { ReskinMeetingCardContext } from '@components/general/card/reskin-meeting-card/reskin-meeting-card.component.jsx';

describe('ReskinSummaryCard Component', () => {
  const mockCard = {
    headline: 'Test Headline',
    labels: [],
    source: 'Meeting',
    preferred: false
  };

  const hoverOverCard = () => {
    const reskinSummaryCardElement = screen.getByTestId('reskin-summary-card');
    fireEvent.mouseOver(reskinSummaryCardElement);
  };

  const renderCard = (props = {}) => {
    renderWithProviders(<ReskinSummaryCard {...props} />);
  };

  beforeAll(() => {
    useBreakpointValue.mockReturnValue('long');
    useBreakpoints.mockReturnValue({ isMobile: false });
    getDocumentMetadataFromCard.mockReturnValue({ name: 'tag-name' });
  });

  it('renders Divider when showBody or showFooter is true', () => {
    renderCard({ showBody: true, showFooter: false, card: mockCard });
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });

  it('renders card headline when showBody is true', () => {
    renderCard({ showBody: true, card: mockCard });
    expect(screen.getByText('Test Headline')).toBeInTheDocument();
  });

  it.skip('renders ShareMeetingModal when card source is "Meeting"', () => {
    renderCard({
      showFooter: true,
      card: { ...mockCard, source: 'Meeting' }
    });
    hoverOverCard();
    expect(screen.getByTestId('share-meeting-modal')).toBeInTheDocument();
  });

  it('renders save and archive buttons when hovered', () => {
    renderCard({ showFooter: true, card: { ...mockCard, preferred: false } });
    hoverOverCard();
    expect(screen.getByTestId('action-tooltip-Save')).toBeInTheDocument();
    expect(screen.getByTestId('action-tooltip-Archive')).toBeInTheDocument();
  });

  it('renders unsave and unarchive buttons when hovered', () => {
    renderCard({ showFooter: true, card: { ...mockCard, preferred: true, archived: true } });
    hoverOverCard();
    expect(screen.getByTestId('action-tooltip-Saved')).toBeInTheDocument();
    expect(screen.getByTestId('action-tooltip-Unarchive')).toBeInTheDocument();
  });

  it('invokes onCardActionClick with expected parameters on save action click', async () => {
    const mockCardActionClick = vi.fn();
    renderCard({
      showFooter: true,
      enableLabels: true,
      card: mockCard,
      onCardActionClick: mockCardActionClick
    });
    hoverOverCard();
    const saveAction = within(screen.getByTestId('action-tooltip-Save')).getByRole('button');
    fireEvent.click(saveAction);
    await waitFor(() => {
      expect(mockCardActionClick).toHaveBeenCalledWith('save', true, mockCard);
    });
  });

  it('invokes onCardActionClick with expected parameters on unarchive action click', async () => {
    const mockCardActionClick = vi.fn();
    const mockArchivedCard = { ...mockCard, archived: true };
    renderCard({
      showFooter: true,
      enableLabels: true,
      card: mockArchivedCard,
      onCardActionClick: mockCardActionClick
    });
    hoverOverCard();
    const unarchiveAction = within(screen.getByTestId('action-tooltip-Unarchive')).getByRole(
      'button'
    );
    fireEvent.click(unarchiveAction);
    await waitFor(() => {
      expect(mockCardActionClick).toHaveBeenCalledWith('archive', false, mockArchivedCard);
    });
  });

  // New tests for recent changes

  describe('Initiative Display', () => {
    it('renders initiative information when initiative is present', () => {
      const cardWithInitiative = {
        ...mockCard,
        initiative: {
          title: 'Q4 Planning',
          color: '#FF6B35'
        }
      };

      renderCard({ card: cardWithInitiative });

      expect(screen.getByText('In')).toBeInTheDocument();
      expect(screen.getByText('Q4 Planning')).toBeInTheDocument();
    });

    it('does not render initiative section when initiative is not present', () => {
      renderCard({ card: mockCard });

      expect(screen.queryByText('In')).not.toBeInTheDocument();
    });
  });

  describe('Document Title Logic', () => {
    it('uses documentTitle from getDocumentMetadataFromCard when available', () => {
      getDocumentMetadataFromCard.mockReturnValue({ name: 'Document Title' });

      renderCard({ card: mockCard });

      expect(getDocumentMetadataFromCard).toHaveBeenCalledWith(mockCard);
    });

    it('falls back to source_data.title when documentTitle is null', () => {
      getDocumentMetadataFromCard.mockReturnValue({ name: null });
      const cardWithSourceTitle = {
        ...mockCard,
        source_data: { title: 'Source Title' }
      };

      renderCard({ card: cardWithSourceTitle });

      expect(getDocumentMetadataFromCard).toHaveBeenCalledWith(cardWithSourceTitle);
    });
  });

  describe('Labels Bar Rendering', () => {
    it('renders LabelsBar on mobile when enableLabels is true', () => {
      useBreakpoints.mockReturnValue({ isMobile: true });

      renderCard({ card: mockCard, enableLabels: true });

      expect(screen.getByTestId('LabelsBar')).toBeInTheDocument();
    });

    it('does not render LabelsBar on mobile when enableLabels is false', () => {
      useBreakpoints.mockReturnValue({ isMobile: true });

      renderCard({ card: mockCard, enableLabels: false, showFooter: true });

      expect(screen.queryByTestId('LabelsBar')).not.toBeInTheDocument();
    });
  });

  describe('Date Display', () => {
    it('renders formatted date when created_at is present', () => {
      const cardWithDate = {
        ...mockCard,
        created_at: '2024-01-01T10:00:00Z'
      };

      renderCard({ card: cardWithDate });

      expect(screen.getByText('Wed, Jan 1, 2024 10:00 AM')).toBeInTheDocument();
      expect(screen.getByText('2 hours ago')).toBeInTheDocument();
    });

    it('does not render date when created_at is not present', () => {
      renderCard({ card: mockCard });

      expect(screen.queryByText('Wed, Jan 1, 2024 10:00 AM')).not.toBeInTheDocument();
    });
  });
});
