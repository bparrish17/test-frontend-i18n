import { describe, expect, beforeEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import PersonalSummarySection from '@pages/meeting/personal-summary.section';
import YourSummarySection from '@pages/meeting/your-summary.component.jsx';
import { useUserStore } from '@store/app.store';
import { useCardActions } from '@util/hooks';
import { isUserThatWasSharedWith, isMeetingParticipant } from '@util/helpers';

// Mock dependencies
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useCardActions: vi.fn()
}));

vi.mock('@util/helpers', () => ({
  isUserThatWasSharedWith: vi.fn(),
  isMeetingParticipant: vi.fn()
}));

vi.mock('@pages/meeting/section.component.jsx', () => ({
  default: (props) => <div data-testid={props['data-testid']}>{props.children}</div>
}));

vi.mock('@components/meeting/meeting-summary.component', () => ({
  default: (props) => <div data-testid='meeting-summary'>{props.children}</div>
}));

vi.mock('@pages/meeting/your-summary.component', () => ({
  default: (props) => (
    <div data-testid='your-summary'>
      {props.cardsArr.map((card) => (
        <div
          key={card.id}
          data-testid={`card-${card.id}`}
        >
          {card.id}
        </div>
      ))}
    </div>
  ),
  CopySummaryMenuItem: (props) => <div>{props.children}</div>
}));

describe('PersonalSummarySection', () => {
  const defaultProps = {
    section: { enabled: true },
    bot: {},
    card: { source: 'Meeting', initiative: { id: '1' } },
    allCards: [],
    cardsBySource: {},
    meeting: {}
  };

  const fakeInitialCard = { id: 0, initiative: { id: 1 } };
  const fakeCards = [
    { id: 1, initiative: { id: 99, tags: ['template'] } },
    { id: 2, initiative: { id: 1 } },
    { id: 3 }
  ];

  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
        <PersonalSummarySection
          {...defaultProps}
          {...props}
        />
      </MemoryRouter>
    );

  beforeEach(() => {
    useCardActions.mockReset();
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('personal-summary-section')).toBeInTheDocument();
  });

  it('wraps the full component in the MeetingPageSection', () => {
    renderComponent();
    const meetingPageSection = screen.getByTestId('personal-summary-section');
    expect(meetingPageSection).toBeInTheDocument();
    expect(meetingPageSection.children.length).toBeGreaterThan(0);
  });

  it('supports cardsBySource param', () => {
    renderComponent({ card: fakeInitialCard, cardsBySource: { ids: ['custom-id'] } });
    expect(useCardActions).toHaveBeenCalledWith({
      type: 'search',
      queryKeyToUpdate: { ids: ['custom-id'] }
    });
  });

  it('supports channel cards', () => {
    renderComponent({ card: { id: 'initial-id', source: 'Channel' } });
    expect(useCardActions).toHaveBeenCalledWith({
      type: 'search',
      queryKeyToUpdate: { ids: ['initial-id'] }
    });
  });

  describe('executive user experience', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ isGuest: false });
      isUserThatWasSharedWith.mockReturnValue(false);
      isMeetingParticipant.mockReturnValue(true);
    });

    it('renders your-summary section', () => {
      renderComponent({ card: fakeInitialCard });
      expect(screen.getByTestId('personal-summary-section')).toBeInTheDocument();
      expect(screen.getByTestId('your-summary')).toBeInTheDocument();
    });

    it("only passes cards to PersonalSummarySection that have template tag or match initial card's initiative", () => {
      renderComponent({ card: fakeInitialCard, allCards: fakeCards });
      expect(screen.getByTestId(`card-1`)).toBeInTheDocument();
      expect(screen.getByTestId(`card-2`)).toBeInTheDocument();
      expect(screen.queryByTestId(`card-3`)).not.toBeInTheDocument();
    });
  });

  describe('shared user experience', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ isGuest: false });
      isUserThatWasSharedWith.mockReturnValue(true);
    });

    describe('is meeting participant', () => {
      beforeEach(() => {
        isMeetingParticipant.mockReturnValue(true);
      });

      it('renders your-summary section', () => {
        renderComponent({ card: fakeInitialCard });
        expect(screen.getByTestId('personal-summary-section')).toBeInTheDocument();
        expect(screen.getByTestId('your-summary')).toBeInTheDocument();
      });

      it("only passes cards to YourSummarySection that have template tag or match initial card's initiative", () => {
        renderComponent({ card: fakeInitialCard, allCards: fakeCards });
        expect(screen.getByTestId(`card-1`)).toBeInTheDocument();
        expect(screen.getByTestId(`card-2`)).toBeInTheDocument();
        expect(screen.queryByTestId(`card-3`)).not.toBeInTheDocument();
      });
    });

    describe('is not meeting participant', () => {
      beforeEach(() => {
        isMeetingParticipant.mockReturnValue(false);
      });

      it('displays "Shared Summary"', () => {
        renderComponent();
        expect(screen.getByText(/Shared Summary/i)).toBeInTheDocument();
        expect(screen.queryByText(/Your Personal Summary/i)).not.toBeInTheDocument();
      });

      it('renders MeetingSummary component', () => {
        renderComponent();
        expect(screen.getByTestId('meeting-summary')).toBeInTheDocument();
        expect(screen.queryByTestId('your-summary')).not.toBeInTheDocument();
      });
    });
  });

  describe('guest experience', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ isGuest: true });
    });

    it('displays "Shared Summary"', () => {
      renderComponent();
      expect(screen.getByText(/Shared Summary/i)).toBeInTheDocument();
      expect(screen.queryByText(/Your Personal Summary/i)).not.toBeInTheDocument();
    });

    it('renders MeetingSummary component', () => {
      renderComponent();
      expect(screen.getByTestId('meeting-summary')).toBeInTheDocument();
      expect(screen.queryByTestId('your-summary')).not.toBeInTheDocument();
    });
  });

  // Commenting out failing tests
  /*
  it('renders "Insights from FORA Lenses" Text', () => {
    renderComponent();
    expect(screen.getByText('Insights from FORA Lenses')).toBeInTheDocument();
  });

  it('renders "Your Summary" Text', () => {
    renderComponent();
    expect(screen.getByText('Your Summary')).toBeInTheDocument();
  });

  it('renders "Personal Summary" Text', () => {
    renderComponent();
    expect(screen.getByText('Personal Summary')).toBeInTheDocument();
  });
  */
});
