import AddTickerModal from '@components/settings/add-ticker-modal.component';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useAvailableSymbols } from '@services/query-services/fmp.query-service';
import { useSubscribeToEarningsCalls } from '@services/query-services/channels.query-service';
import { ChakraProvider } from '@chakra-ui/react';
import timezoneMock from 'timezone-mock';

vi.mock('@services/query-services/channels.query-service.js', () => ({
  useSubscribeToEarningsCalls: vi.fn()
}));

vi.mock('@services/query-services/fmp.query-service.js', () => ({
  useAvailableSymbols: vi.fn()
}));

describe('AddTickerModal', () => {
  const renderModal = () =>
    // todo: can remove chakraprovider?
    render(
      <ChakraProvider>
        <AddTickerModal disclosure={{ isOpen: true, onOpen: vi.fn(), onToggle: vi.fn() }} />
      </ChakraProvider>
    );

  beforeAll(() => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));
  });

  beforeEach(() => {
    timezoneMock.register('UTC');
    const mockCurrentDate = new Date(2024, 11, 16, 10, 0);
    vi.setSystemTime(mockCurrentDate);
    useSubscribeToEarningsCalls.mockReturnValue({ data: [] });
    useAvailableSymbols.mockReturnValue({ data: [] });
  });

  afterEach(() => {
    timezoneMock.unregister();
  });

  it('renders the modal information as expected', () => {
    renderModal();
    const heading = screen.getByText('Subscribe to Earnings Calls');
    expect(heading).toBeInTheDocument();

    // Check that the subtext is rendered
    const description = screen.getByText(
      'Add stock tickers from a major exchange (eg NYSE, NASDAQ) to give your team access to their earnings call summaries.'
    );
    expect(description).toBeInTheDocument();
    const tooltip = screen.getByText(
      'If you don’t specify a date, FORA will generate a summary of the most recent earnings call and all future earnings calls.'
    );
    expect(tooltip).toBeInTheDocument();
  });

  it('renders a custom select with placeholder "Enter a stock ticker"', () => {
    renderModal();
    const placeholder = screen.getByText('Enter a stock ticker');
    // todo: add check for input
    expect(placeholder).toBeInTheDocument();
  });

  it('renders a subscribe button that is disabled by default', () => {
    renderModal();
    const button = screen.getByText('Subscribe');
    expect(button).toBeInTheDocument();
    // todo: get button disabled prop here
  });
});
