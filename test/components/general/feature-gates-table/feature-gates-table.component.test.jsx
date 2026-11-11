/**
 * Tests for the FeatureGatesTable component
 * 
 * This suite tests the various states and behaviors of the component
 * including loading, error, and data display conditions.
 */
import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import { vi } from 'vitest';
import FeatureGatesTable from '@components/general/feature-gates-table/feature-gates-table.component';

/**
 * Mock setup section
 */

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  const { InfoIcon, ExternalLinkIcon } = await import('@assets/icons');
  
  return {
    ...actual,
    Button: ({ children, onClick, isLoading, isDisabled, leftIcon, ...props }) => (
      <button data-testid="button" onClick={onClick} disabled={isDisabled || isLoading} {...props}>
        {!isLoading && leftIcon}
        {children}
      </button>
    ),
    Icon: ({ as: IconComponent, boxSize, ...props }) => {
      // Check if it's one of our specific icons
      if (IconComponent === InfoIcon) {
        return <span data-testid="info-icon" {...props}>Info</span>;
      }
      if (IconComponent === ExternalLinkIcon) {
        return <span data-testid="external-link-icon" {...props}>ExternalLink</span>;
      }
      return <span data-testid="icon" {...props}>Icon</span>;
    },
    Spinner: () => <span data-testid="spinner">Loading...</span>
  };
});

vi.mock('@components/general/table/accordion-table.component', () => {
  const MockAccordionTable = vi.fn(({ tableName, tableData, headers, panelChildren }) => (
    <div data-testid={`accordion-table-${tableName}`}>
      <h4>Headers: {headers.map(h => h.title).join(', ')}</h4>
      {tableData.map((row, index) => (
        <div key={row.name || index} data-testid={`table-row-${row.name || index}`}>
          {headers.map(header => (
            <div key={`${row.name}-${header.title}`}>{header.render(row)}</div>
          ))}
          {panelChildren && <div data-testid={`panel-${row.name}`}>{panelChildren(row)}</div>}
        </div>
      ))}
    </div>
  ));
  return {
    default: MockAccordionTable
  };
});

vi.mock('date-fns', () => ({
  formatDistanceToNow: vi.fn((date) => {
    if (typeof date === 'number' && date > 0) return `${date} ms ago`;
    if (date instanceof Date) return `${date.getTime()} ms ago`;
    return 'Invalid Date';
  }),
  formatISO: vi.fn((date) => {
    if (typeof date === 'number' && date > 0) return new Date(date).toISOString();
    if (date instanceof Date) return date.toISOString();
    return 'Invalid ISO Date';
  })
}));

vi.mock('@assets/icons', () => {
  const InfoIcon = () => <span data-testid="info-icon">Info</span>;
  const ChevronDownIcon = () => <span data-testid="chevron-down-icon">ChevronDown</span>;
  const ChevronUpIcon = () => <span data-testid="chevron-up-icon">ChevronUp</span>;
  const ExternalLinkIcon = () => <span data-testid="external-link-icon">ExternalLink</span>;
  
  return {
    InfoIcon,
    ChevronDownIcon,
    ChevronUpIcon,
    ExternalLinkIcon
  };
});

const mockRefreshGates = vi.fn();
vi.mock('@store/feature-gates.store', () => ({
  useFeatureGatesWithAccess: vi.fn(),
  getFeatureGatesFromCache: vi.fn()
}));

const { useFeatureGatesWithAccess: mockUseFeatureGatesWithAccess } = await import('@store/feature-gates.store');

vi.stubEnv('VITE_STATSIG_CONSOLE_KEY', 'test-api-key');

describe('FeatureGatesTable Component', () => {
  let mockGateData;

  beforeEach(() => {
    vi.clearAllMocks();

    mockGateData = {
      'gate-1': {
        name: 'gate-1',
        type: 'TEMPORARY',
        isEnabled: true,
        status: 'Enabled Status',
        checksPerHour: 120,
        lastModifiedTime: new Date().getTime() - 100000,
        yourAccess: true,
        description: 'Description for gate 1',
        rules: [
          {
            name: 'Rule 1-1',
            passPercentage: 100,
            conditions: [{ type: 'public' }]
          },
          {
            name: 'Rule 1-2',
            passPercentage: 50,
            conditions: [{ type: 'user_id', targetValue: ['user1', 'user2'] }]
          }
        ],
        createdTime: new Date().getTime() - 200000,
        creatorName: 'Creator One',
        version: 2,
        idType: 'userID'
      },
      'gate-2': {
        name: 'gate-2',
        type: 'STALE',
        typeReason: 'STALE_ALL_TRUE',
        isEnabled: false,
        status: 'Disabled Status',
        checksPerHour: 0,
        lastModifiedTime: new Date().getTime() - 500000,
        yourAccess: false,
        description: null,
        rules: [],
        createdTime: new Date().getTime() - 600000,
        creatorName: 'Creator Two',
        version: 1,
        idType: 'stableID'
      },
      'gate-3': {
        name: 'gate-3',
        type: '',
        isEnabled: true,
        status: '',
        checksPerHour: 10,
        lastModifiedTime: new Date().getTime() - 5000,
        yourAccess: false,
        description: 'Gate 3 Desc',
        rules: [
          {
            name: 'Rule 3-1',
            passPercentage: 0,
            conditions: []
          }
        ],
        createdTime: new Date().getTime() - 10000,
        creatorName: 'Creator Three',
        version: 3,
        idType: 'userID'
      }
    };

    mockUseFeatureGatesWithAccess.mockReturnValue({
      data: mockGateData,
      isLoading: false,
      error: null,
      refetch: mockRefreshGates
    });
  });

  it('should render loading state', () => {
    mockUseFeatureGatesWithAccess.mockReturnValueOnce({
      data: null,
      isLoading: true,
      error: null,
      refetch: mockRefreshGates
    });
    render(<FeatureGatesTable />);
    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('accordion-table-featureGates')).not.toBeInTheDocument();
  });

  it('should render error state', () => {
    const errorMsg = 'Failed to fetch gates';
    mockUseFeatureGatesWithAccess.mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: errorMsg,
      refetch: mockRefreshGates
    });
    render(<FeatureGatesTable />);
    expect(screen.getByText(`Error: ${errorMsg}`)).toBeInTheDocument();
    expect(screen.queryByTestId('accordion-table-featureGates')).not.toBeInTheDocument();
  });

  it('should render empty state when no gates are found', () => {
    mockUseFeatureGatesWithAccess.mockReturnValueOnce({
      data: {},
      isLoading: false,
      error: null,
      refetch: mockRefreshGates
    });
    render(<FeatureGatesTable />);
    expect(screen.getByText(/No feature gates found/i)).toBeInTheDocument();
    expect(screen.queryByTestId('accordion-table-featureGates')).not.toBeInTheDocument();
  });

  it('should render the table with correct data when gates are loaded', () => {
    render(<FeatureGatesTable />);

    expect(screen.getByTestId('accordion-table-featureGates')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent(
      'Headers: Name, Status, Code Usage, Activity, Last Modified, Your Access'
    );

    expect(screen.getByTestId('table-row-gate-1')).toBeInTheDocument();
    expect(screen.getByText('gate-1')).toBeInTheDocument();
    expect(screen.getByText('Enabled Status')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getAllByText(/\d+ ms ago/)[0]).toBeInTheDocument();
    expect(screen.getAllByText('Enabled')[0]).toBeInTheDocument();

    expect(screen.getByTestId('table-row-gate-2')).toBeInTheDocument();
    expect(screen.getByText('gate-2')).toBeInTheDocument();
    expect(screen.getByText('Disabled Status')).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getAllByText('Disabled')[0]).toBeInTheDocument();

    expect(screen.getByText(/Total Gates: 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Data refreshed by Statsig hourly/i)).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('should render panel content correctly when a row is expanded', () => {
    render(<FeatureGatesTable />);

    const panelGate1 = screen.getByTestId('panel-gate-1');
    expect(panelGate1).toBeInTheDocument();
    expect(within(panelGate1).getByText('Description for gate 1')).toBeInTheDocument();

    // Assertions for Rule 1-1 in panelGate1
    const rule1NameElement = within(panelGate1).getByText('Rule 1-1');
    const rule1HeaderElement = rule1NameElement.parentElement; // HStack for name and badge
    expect(within(rule1HeaderElement).getByText('100% Pass')).toBeInTheDocument();
    const rule1ContainerElement = rule1HeaderElement.parentElement; // Box for the entire rule content
    expect(within(rule1ContainerElement).getByText('Type:')).toBeInTheDocument();
    expect(within(rule1ContainerElement).getByText('public')).toBeInTheDocument();

    // Assertions for Rule 1-2 in panelGate1
    const rule2NameElement = within(panelGate1).getByText('Rule 1-2');
    const rule2HeaderElement = rule2NameElement.parentElement; // HStack for name and badge
    expect(within(rule2HeaderElement).getByText('50% Pass')).toBeInTheDocument();
    const rule2ContainerElement = rule2HeaderElement.parentElement; // Box for the entire rule content
    expect(within(rule2ContainerElement).getByText('Type:')).toBeInTheDocument(); // This should be the "Type:" for user_id
    expect(within(rule2ContainerElement).getByText('user_id')).toBeInTheDocument();
    expect(within(rule2ContainerElement).getByText('Target:')).toBeInTheDocument();
    expect(within(rule2ContainerElement).getByText('user1, user2')).toBeInTheDocument();
    
    // Assertions for other details in panelGate1
    expect(within(panelGate1).getByText('Creator One')).toBeInTheDocument();

    const versionLabel = within(panelGate1).getByText('Version:');
    const versionBox = versionLabel.parentElement; // The Box containing the label and value
    expect(within(versionBox).getByText('2')).toBeInTheDocument();

    const idTypeLabel = within(panelGate1).getByText('ID Type:');
    const idTypeBox = idTypeLabel.parentElement; // The Box containing the label and value
    expect(within(idTypeBox).getByText('userID')).toBeInTheDocument();

    // Assertions for panelGate2
    const panelGate2 = screen.getByTestId('panel-gate-2');
    expect(panelGate2).toBeInTheDocument();
    expect(within(panelGate2).queryByText('Description:')).not.toBeInTheDocument();
    expect(within(panelGate2).getByText('No rules defined')).toBeInTheDocument();
    expect(within(panelGate2).getByText('Creator Two')).toBeInTheDocument();
    expect(within(panelGate2).getByText('ID Type:')).toBeInTheDocument();
    expect(within(panelGate2).getByText('stableID')).toBeInTheDocument();
  });

  it('should call refreshGates when refresh button is clicked', () => {
    render(<FeatureGatesTable />);
    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    expect(refreshButton).toBeEnabled();
    fireEvent.click(refreshButton);
    expect(mockRefreshGates).toHaveBeenCalledTimes(1);
  });

  it('should display API key warning and disable refresh if key is missing', () => {
    vi.stubEnv('VITE_STATSIG_CONSOLE_KEY', '');
    render(<FeatureGatesTable />);

    expect(
      screen.getByText(/No Statsig Console API key found/i)
    ).toBeInTheDocument();

    const refreshButton = screen.getByRole('button', { name: /Refresh/i });
    expect(refreshButton).toBeDisabled();
  });
}); 
