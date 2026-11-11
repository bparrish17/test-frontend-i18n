import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useState } from 'react';
import { last } from 'lodash-es';

import YourSummaryComponent from '@pages/meeting/your-summary.component';
import { updateURL } from '@util/helpers';
import { useMeetingPageStore } from '@store/app.store';

vi.mock('@util/helpers', () => ({
  updateURL: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn(),
  useMeetingPageStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useCardActions: vi.fn(),
  useCopyToClipboard: vi.fn()
}));

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useState: vi.fn()
  };
});

vi.mock('@components/meeting/generating-custom-summary.component', () => ({
  default: (props) => <div data-testid='generating-custom-summary'>{props.children}</div>
}));

vi.mock('@components/meeting/meeting-summary.component', () => ({
  default: (props) => <div data-testid='meeting-summary'>{props.children}</div>
}));

vi.mock('@components/general/card/reskin-summary-card/reskin-summary-card-menu.component', () => ({
  default: (props) => <div data-testid='reskin-summary-card-menu'>{props.children}</div>
}));

vi.mock('@components/custom-summary/custom-summary-menu.component', () => ({
  default: (props) => <div data-testid='custom-summary-menu'>{props.children}</div>
}));

vi.mock('@components/general/styled-tab-box.component', () => ({
  default: (props) => <div data-testid='styled-tab'>{props.children}</div>
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/test-path', search: '123' })
  };
});

describe('YourSummaryComponent', () => {
  const fakeCardsArr = [
    { id: 1, initiative: { id: 99, title: 'Initiative 1', tags: ['template'] } },
    { id: 2, initiative: { id: 1, title: 'Initiative 2' } },
    { id: 3 }
  ];
  const defaultProps = {
    meeting: {},
    cardsArr: fakeCardsArr,
    lensId: '1',
    initialCard: { initiative: { id: '1' } },
    overallInitiative: {},
    hasCustomSummaries: true,
    cardsSlice: []
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useState.mockReturnValue([2, vi.fn()]);
  });

  it('renders without crashing', () => {
    render(<YourSummaryComponent {...defaultProps} />);
    expect(screen.getByTestId('your-summary')).toBeInTheDocument();
  });

  it('contains CustomSummaryMenu', () => {
    render(<YourSummaryComponent {...defaultProps} />);
    expect(screen.getByTestId('custom-summary-menu')).toBeInTheDocument();
  });

  it('renders GeneratingCustomSummary if "generating-summary" present in cardsArr', () => {
    render(
      <YourSummaryComponent
        {...defaultProps}
        cardsArr={[...fakeCardsArr, { id: 'generating-summary' }]}
      />
    );
    expect(screen.getByTestId('custom-summary-menu')).toBeInTheDocument();
  });

  it('renders generating MeetingSummary for each card in cardsArr that don\'t have ID of "generating-summary"', () => {
    render(
      <YourSummaryComponent
        {...defaultProps}
        cardsArr={[...fakeCardsArr, { id: 'generating-summary' }]}
      />
    );
    expect(screen.getAllByTestId('meeting-summary').length).toEqual(3);
  });

  it('displays the correct pluralized header text of "Your Summary" based on number of cards', () => {
    render(<YourSummaryComponent {...defaultProps} />);
    expect(screen.getByText('Your Summaries')).toBeInTheDocument();
    render(
      <YourSummaryComponent
        {...defaultProps}
        cardsArr={[fakeCardsArr[0]]}
      />
    );
    expect(screen.getByText('Your Summary')).toBeInTheDocument();
  });

  it('renders CustomSummaryMenu with correct props', () => {
    render(<YourSummaryComponent {...defaultProps} />);
    expect(screen.getByTestId('custom-summary-menu')).toBeInTheDocument();
  });

  it('renders LensTab components for each card in cardsSlice, capped by maxLenses state val', () => {
    const cardsArr = Array.from({ length: 7 }, (_, i) => ({ id: i }));
    render(
      <YourSummaryComponent
        {...defaultProps}
        cardsArr={cardsArr}
      />
    );
    const lensTabs = screen.getAllByTestId('styled-tab');
    expect(lensTabs).toHaveLength(3);
  });

  it('renders "+ more" StyledTab for selecting additional cards, if cardsArr > maxLenses length', () => {
    const cardsArr = Array.from({ length: 7 }, (_, i) => ({ id: i }));
    render(
      <YourSummaryComponent
        {...defaultProps}
        cardsArr={cardsArr}
      />
    );
    const lensTabs = screen.getAllByTestId('styled-tab');
    expect(last(lensTabs).textContent).toMatch(/\+\d+ More/);
  });

  it('calls updateURL when tabIndex changes', () => {
    const mockUpdateURL = vi.fn();
    const fakeDisclosure = { videoDisclosure: true };
    useMeetingPageStore.mockReturnValueOnce(fakeDisclosure);
    updateURL.mockImplementationOnce(mockUpdateURL);
    render(<YourSummaryComponent {...defaultProps} />);
    fireEvent.click(screen.getByText(/Initiative 2/i));
    expect(mockUpdateURL).toHaveBeenCalledWith(
      expect.objectContaining({
        tabIndex: expect.any(Number),
        cardsArr: fakeCardsArr,
        location: { pathname: '/test-path', search: '123' },
        videoDisclosure: fakeDisclosure,
        urlParams: new URLSearchParams('123')
      })
    );
  });
});
