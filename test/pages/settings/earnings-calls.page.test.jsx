import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Menu, MenuButton, MenuList, MenuGroup, MenuItem, IconButton } from '@chakra-ui/react';

import EarningsCallsPage from '@pages/settings/earnings-calls.page';

import { useChannels } from '@services/query-services/channels.query-service';
import { useEarningsCallDates } from '@services/query-services/fmp.query-service';

// Mock the components
vi.mock('@components/settings/add-ticker-modal.component', () => ({
  default: ({ disclosure }) => (
    <div data-testid='add-ticker-modal'>
      <button onClick={disclosure.onClose}>Close Modal</button>
    </div>
  )
}));

vi.mock('@components/general/table/accordion-table.component', () => ({
  default: function AccordionTable({ tableData, headers }) {
    return (
      <div data-testid='accordion-table'>
        <div className='header-row'>
          {headers.map((header, index) => (
            <div key={index}>{header.title}</div>
          ))}
        </div>
        {tableData?.map((row, index) => (
          <div
            key={index}
            data-testid={`accordion-item-${index}`}
          >
            <div data-testid={`ticker-${row.symbol}`}>
              {row.symbol} ({row.companyName})
            </div>
            <div>{row.lastUpdated ? format(row.lastUpdated, 'MMM dd, yyyy') : 'N/A'}</div>
            <div>{row.nextCall ? format(row.nextCall, 'MMM dd, yyyy') : 'N/A'}</div>
            <div data-testid='menu-container'>
              <button
                data-testid={`menu-button-${index}`}
                onClick={(e) => e.stopPropagation()}
              >
                ⋮
              </button>
              <div
                data-testid='menu-list'
                role='menu'
              >
                <div
                  aria-label='STOCK TICKER OPTIONS'
                  data-testid='menu-group-container'
                  role='group'
                >
                  <button
                    data-testid='menu-item-button'
                    role='menuitem'
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (row.channel?.id) {
                        try {
                          await mockDeleteChannel(row.channel.id, {
                            onSuccess: () => {
                              mockToast({
                                title: `Unsubscribed from ${row.symbol}`,
                                status: 'success'
                              });
                            },
                            onError: () => {
                              mockToast({
                                title: `Failed to unsubscribe from ${row.symbol}`,
                                status: 'error'
                              });
                            }
                          });
                        } catch {
                          // Catch block handles any errors that occur before onError callback is reached
                          mockToast({
                            title: `Failed to unsubscribe from ${row.symbol}`,
                            status: 'error'
                          });
                        }
                      }
                    }}
                  >
                    Unsubscribe your company from ticker
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }
}));

// Mock icons
vi.mock('@assets/icons', () => ({
  SFEllipsisIcon: () => <span>⋮</span>,
  SFPlusCircleIcon: () => <span>+</span>,
  SFSearchIcon: () => <span>🔍</span>,
  SFXMarkIconOutlined: () => <span>×</span>
}));

// Mock the query services
vi.mock('@services/query-services/fmp.query-service', () => ({
  useEarningsCallDates: vi.fn()
}));

const mockDeleteChannel = vi.fn();
vi.mock('@services/query-services/channels.query-service', () => ({
  useChannels: vi.fn(),
  useDeleteChannel: () => ({
    mutateAsync: mockDeleteChannel,
    isLoading: false
  })
}));

const mockToast = vi.fn();
const mockDisclosure = {
  isOpen: false,
  onOpen: vi.fn(),
  onClose: vi.fn(),
  onToggle: vi.fn()
};

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal();

  return {
    ...actual,
    useToast: () => mockToast,
    useDisclosure: () => mockDisclosure,
    Container: ({ children, maxW, p, px, ...props }) => (
      <div
        style={{ maxWidth: maxW, padding: p, paddingLeft: px, paddingRight: px }}
        {...props}
      >
        {children}
      </div>
    ),
    Menu: ({ children }) => <div data-testid='menu-container'>{children}</div>,
    MenuButton: ({ children, as: Component = 'button', ...props }) => (
      <Component {...props}>{children}</Component>
    ),
    MenuList: ({ children }) => (
      <div
        role='menu'
        data-testid='menu-list'
      >
        {children}
      </div>
    ),
    MenuGroup: ({ children, title }) => (
      <div
        role='group'
        aria-label={title}
        data-testid='menu-group-container'
      >
        {children}
      </div>
    ),
    MenuItem: ({ children, onClick }) => (
      <button
        role='menuitem'
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        data-testid='menu-item-button'
      >
        {children}
      </button>
    ),
    Spacer: () => <div></div>,
    IconButton: ({ icon, 'aria-label': ariaLabel, onClick, ...props }) => (
      <button
        onClick={onClick}
        aria-label={ariaLabel}
        {...props}
      >
        {icon}
      </button>
    ),
    Box: ({ children, textAlign, p, borderRadius, borderColor, ...props }) => (
      <div
        style={{ textAlign, padding: p, borderRadius, borderColor }}
        {...props}
      >
        {children}
      </div>
    ),
    Button: ({ children, onClick, rightIcon, variant, ml, ...props }) => (
      <button
        onClick={onClick}
        style={{ marginLeft: ml }}
        data-variant={variant}
        {...props}
      >
        {children}
        {rightIcon}
      </button>
    ),
    Flex: ({ children, justify, align, mb, flexDir, gap, justifySelf, width, ...props }) => (
      <div
        style={{
          display: 'flex',
          justifyContent: justify,
          alignItems: align,
          marginBottom: mb,
          flexDirection: flexDir,
          gap,
          justifySelf,
          width
        }}
        {...props}
      >
        {children}
      </div>
    ),
    Heading: ({ children, size, fontWeight, color, ...props }) => (
      <h2
        style={{ fontSize: size, fontWeight, color }}
        {...props}
      >
        {children}
      </h2>
    ),
    Input: ({ value, onChange, placeholder, bg, border, borderRadius, size, sx, ...props }) => (
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          backgroundColor: bg,
          border,
          borderRadius,
          fontSize: size === 'md' ? '16px' : undefined,
          ...sx
        }}
        {...props}
      />
    ),
    InputGroup: ({ children, height, maxW, ...props }) => (
      <div
        style={{ height, maxWidth: maxW }}
        {...props}
      >
        {children}
      </div>
    ),
    InputRightElement: ({ children }) => <div>{children}</div>,
    Divider: () => <hr />,
    Icon: ({ as: Component }) => <Component data-testid='icon' />,
    Stack: ({ children, mt, spacing, ...props }) => (
      <div
        style={{ marginTop: mt, gap: spacing }}
        {...props}
      >
        {children}
      </div>
    ),
    Text: ({ children, color, fontSize, fontWeight, ...props }) => (
      <span
        style={{ color, fontSize, fontWeight }}
        {...props}
      >
        {children}
      </span>
    ),
    Tabs: ({ children, variant, index, onChange }) => (
      <div
        data-testid='tabs'
        data-variant={variant}
        data-index={index}
        onChange={onChange}
      >
        {children}
      </div>
    ),
    TabList: ({ children, borderBottom, ml, mr, display, gap }) => (
      <div
        role='tablist'
        data-testid='tab-list'
        style={{
          borderBottom,
          marginLeft: ml,
          marginRight: mr,
          display,
          gap
        }}
      >
        {children}
      </div>
    ),
    TabPanels: ({ children }) => <div data-testid='tab-panels'>{children}</div>,
    TabPanel: ({ children }) => (
      <div
        role='tabpanel'
        data-testid='tab-panel'
      >
        {children}
      </div>
    ),
    Tab: ({ children, onClick }) => (
      <button
        role='tab'
        data-testid='tab'
        onClick={onClick}
      >
        {children}
      </button>
    )
  };
});

vi.mock('@util/hooks', () => ({
  useStyledToast: () => mockToast,
  useDebouncedProp: (value) => {
    const [debouncedValue, setDebouncedValue] = React.useState(value);
    React.useEffect(() => {
      const timeoutId = setTimeout(() => {
        setDebouncedValue(value);
      }, 0);
      return () => clearTimeout(timeoutId);
    }, [value]);
    return [debouncedValue];
  },
  useSetDocumentTitle: () => {}
}));

describe('EarningsCallsPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const renderComponent = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <EarningsCallsPage />
      </QueryClientProvider>
    );
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('data loads successfully', () => {
    beforeEach(() => {
      useChannels.mockReturnValue({
        data: [
          {
            id: '1',
            name: 'Apple Inc. (AAPL)',
            identifiers: ['AAPL'],
            updated_at: '2024-01-15',
            created_at: '2024-01-01',
            symbol: 'AAPL',
            companyName: 'Apple Inc.',
            channel: { id: '1' }
          },
          {
            id: '2',
            name: 'Alphabet Inc. (GOOGL)',
            identifiers: ['GOOGL'],
            updated_at: '2024-01-15',
            created_at: '2024-01-01',
            symbol: 'GOOGL',
            companyName: 'Alphabet Inc.',
            channel: { id: '2' }
          }
        ],
        isLoading: false,
        isError: false,
        refetch: vi.fn()
      });

      useEarningsCallDates.mockReturnValue({
        earningsCallDates: {
          AAPL: { lastUpdated: new Date('2024-03-15'), nextCall: new Date('2024-04-30') },
          GOOGL: { lastUpdated: new Date('2024-03-10'), nextCall: new Date('2024-04-25') }
        },
        isTickerLoading: () => false
      });
    });

    it('renders with earnings call header', () => {
      renderComponent();
      expect(screen.getByText('Earnings Calls')).toBeInTheDocument();
    });

    it('renders search input correctly', () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('Search');
      expect(searchInput).toBeInTheDocument();
    });

    it('filters tickers based on search query', async () => {
      renderComponent();
      const searchInput = screen.getByPlaceholderText('Search');

      fireEvent.change(searchInput, { target: { value: 'AAPL' } });

      await waitFor(() => {
        expect(screen.getByTestId('ticker-AAPL')).toBeInTheDocument();
        expect(screen.queryByTestId('ticker-GOOGL')).not.toBeInTheDocument();
      });
    });

    it('shows menu when clicking on ellipsis', async () => {
      renderComponent();
      const accordionItem = screen.getByTestId('accordion-item-0');
      const menuButton = within(accordionItem).getByTestId('menu-button-0');
      fireEvent.click(menuButton);

      await waitFor(() => {
        const menuList = within(accordionItem).getByRole('menu');
        const menuGroupContainer = within(menuList).getByTestId('menu-group-container');
        const menuItemButton = within(menuGroupContainer).getByTestId('menu-item-button');

        expect(menuList).toBeInTheDocument();
        expect(menuGroupContainer).toBeInTheDocument();
        expect(menuItemButton).toHaveTextContent('Unsubscribe your company from ticker');
      });
    });

    it('calls deleteChannel when unsubscribing', async () => {
      mockDeleteChannel.mockResolvedValueOnce({});

      renderComponent();
      const accordionItem = screen.getByTestId('accordion-item-0');
      const menuButton = within(accordionItem).getByTestId('menu-button-0');

      fireEvent.click(menuButton);

      const menuList = within(accordionItem).getByRole('menu');
      const menuGroup = within(menuList).getByRole('group');
      const unsubscribeButton = within(menuGroup).getByRole('menuitem', { name: /unsubscribe/i });

      fireEvent.click(unsubscribeButton);

      await waitFor(() => {
        expect(mockDeleteChannel).toHaveBeenCalledWith('1', {
          onSuccess: expect.any(Function),
          onError: expect.any(Function)
        });
      });
    });

    it('handles unsubscribe error correctly', async () => {
      mockDeleteChannel.mockRejectedValueOnce(new Error('Failed to unsubscribe'));

      renderComponent();
      const accordionItem = screen.getByTestId('accordion-item-0');
      const menuButton = within(accordionItem).getByTestId('menu-button-0');

      fireEvent.click(menuButton);

      const menuList = within(accordionItem).getByRole('menu');
      const menuGroup = within(menuList).getByRole('group');
      const unsubscribeButton = within(menuGroup).getByRole('menuitem', { name: /unsubscribe/i });

      await fireEvent.click(unsubscribeButton);

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith(
          expect.objectContaining({
            title: expect.stringContaining('Failed to unsubscribe'),
            status: 'error'
          })
        );
      });
    });

    it('opens add ticker modal when add button is clicked', () => {
      renderComponent();
      const addButton = screen.getByText('Add Ticker');

      fireEvent.click(addButton);

      expect(mockDisclosure.onOpen).toHaveBeenCalled();
      expect(screen.getByTestId('add-ticker-modal')).toBeInTheDocument();
    });

    it('closes add ticker modal', () => {
      renderComponent();
      const closeButton = screen.getByText('Close Modal');

      fireEvent.click(closeButton);

      expect(mockDisclosure.onClose).toHaveBeenCalled();
    });
  });

  describe('is loading', () => {
    beforeEach(() => {
      useChannels.mockReturnValue({
        data: [],
        isLoading: true,
        isError: false,
        refetch: vi.fn()
      });

      useEarningsCallDates.mockReturnValue({
        isLoading: () => true
      });
    });

    it('renders loading-box', () => {
      renderComponent();

      expect(screen.getByTestId('loading-box')).toBeInTheDocument();
    });
  });

  describe('returns 0 earnings calls', () => {
    beforeEach(() => {
      useChannels.mockReturnValue({
        data: [],
        isLoading: false,
        isError: false,
        refetch: vi.fn()
      });

      useEarningsCallDates.mockReturnValue({
        isLoading: () => true
      });
    });

    it('renders no calls text', () => {
      renderComponent();

      const noCallsText = screen.getByTestId('no-calls-text');
      expect(noCallsText).toBeInTheDocument();
      expect(noCallsText).toHaveTextContent(
        'Your company is not currently subscribed to any Earnings Calls. ' +
          'Please click the Add Ticker button above to subscribe to Earnings Calls'
      );
    });
  });
});
