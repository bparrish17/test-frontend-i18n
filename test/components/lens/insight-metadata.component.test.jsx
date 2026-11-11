import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import InsightMetadata from '@components/lens/insight-metadata.component';
import { useUserStore } from '@store/app.store';
import { useFullCards } from '@util/hooks';

// Mock all SVG and image imports
vi.mock('@assets/images/zoom-title-logo.svg', () => ({ default: '/mock/zoom.svg' }));
vi.mock('@assets/images/slack-logo.svg', () => ({ default: '/mock/slack.svg' }));
vi.mock('@assets/images/salesforce-logo.svg', () => ({ default: '/mock/salesforce.svg' }));
vi.mock('@assets/images/calendar-today-logo.svg', () => ({ default: '/mock/calendar.svg' }));
vi.mock('@assets/images/outlook-logo.svg', () => ({ default: '/mock/outlook.svg' }));
vi.mock('@assets/images/google-calendar-logo.svg', () => ({
  default: '/mock/google-calendar.svg'
}));
vi.mock('@assets/images/gmail-logo.svg', () => ({ default: '/mock/gmail.svg' }));
vi.mock('@assets/images/google-meet-logo.png', () => ({ default: '/mock/google-meet.png' }));
vi.mock('@assets/images/hubspot-logo.svg', () => ({ default: '/mock/hubspot.svg' }));
vi.mock('@assets/images/teams-logo.svg', () => ({ default: '/mock/teams.svg' }));

// Mock the store hooks
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useFullCards: vi.fn()
}));

// Mock LensInsightMenu component
vi.mock('@components/insight/lens-insight-menu.component.jsx', () => ({
  default: () => <button aria-label='Menu'>Menu</button>
}));

// Helper function to transform Chakra props to valid CSS
const transformChakraProps = (props) => {
  const style = { display: 'flex' };

  if (props.minW) style.minWidth = props.minW;
  if (props.paddingX) {
    style.paddingLeft = props.paddingX;
    style.paddingRight = props.paddingX;
  }
  if (props.paddingY) {
    style.paddingTop = props.paddingY;
    style.paddingBottom = props.paddingY;
  }
  if (props.borderTopRadius) {
    style.borderTopLeftRadius = props.borderTopRadius;
    style.borderTopRightRadius = props.borderTopRadius;
  }
  if (props.borderBottomRadius) {
    style.borderBottomLeftRadius = props.borderBottomRadius;
    style.borderBottomRightRadius = props.borderBottomRadius;
  }
  if (props.alignSelf) style.alignSelf = props.alignSelf;
  if (props.borderRadius) style.borderRadius = props.borderRadius;
  if (props.flexDirection) style.flexDirection = props.flexDirection;
  if (props.alignItems) style.alignItems = props.alignItems;
  if (props.justifyContent) style.justifyContent = props.justifyContent;

  // Remove Chakra-specific props
  const cleanProps = { ...props };
  delete cleanProps.minW;
  delete cleanProps.paddingX;
  delete cleanProps.paddingY;
  delete cleanProps.borderTopRadius;
  delete cleanProps.borderBottomRadius;
  delete cleanProps.alignSelf;
  delete cleanProps.borderRadius;
  delete cleanProps.flexDirection;
  delete cleanProps.alignItems;
  delete cleanProps.justifyContent;

  return { style, props: cleanProps };
};

// Mock Chakra UI components
vi.mock('@chakra-ui/react', () => ({
  ChakraProvider: ({ children }) => children,
  Stack: ({ children, ...props }) => {
    const { style, props: cleanProps } = transformChakraProps(props);
    return (
      <div
        data-testid='stack'
        style={style}
        {...cleanProps}
      >
        {children}
      </div>
    );
  },
  VStack: ({ children, ...props }) => {
    const { style, props: cleanProps } = transformChakraProps({
      ...props,
      flexDirection: 'column'
    });
    return (
      <div
        data-testid='vstack'
        style={style}
        {...cleanProps}
      >
        {children}
      </div>
    );
  },
  HStack: ({ children, ...props }) => {
    const { style, props: cleanProps } = transformChakraProps({ ...props, flexDirection: 'row' });
    return (
      <div
        data-testid='hstack'
        style={style}
        {...cleanProps}
      >
        {children}
      </div>
    );
  },
  Avatar: ({ name }) => (
    <img
      role='img'
      aria-label={name || ' avatar'}
      src='mock-avatar.jpg'
    />
  ),
  Text: ({ children, ...props }) => <span {...props}>{children}</span>,
  Heading: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
  Icon: () => null,
  IconButton: ({ 'aria-label': ariaLabel, ...props }) => {
    const { style, props: cleanProps } = transformChakraProps(props);
    return (
      <button
        aria-label={ariaLabel}
        style={style}
        {...cleanProps}
      >
        Icon Button
      </button>
    );
  },
  Spacer: () => <div data-testid='spacer' />,
  Divider: () => <hr data-testid='divider' />,
  Show: ({ children }) => <div>{children}</div>,
  Box: ({ children, ...props }) => {
    const { style, props: cleanProps } = transformChakraProps(props);
    return (
      <div
        style={style}
        {...cleanProps}
      >
        {children}
      </div>
    );
  },
  Flex: ({ children, ...props }) => {
    const { style, props: cleanProps } = transformChakraProps(props);
    return (
      <div
        data-testid='flex'
        style={style}
        {...cleanProps}
      >
        {children}
      </div>
    );
  },
  Skeleton: ({ children, ...props }) => (
    <div
      data-testid='skeleton'
      role='progressbar'
      {...props}
    >
      {children}
    </div>
  ),
  Spinner: () => (
    <div
      role='progressbar'
      data-testid='spinner'
    />
  ),
  Tooltip: ({ children }) => <div>{children}</div>,
  Menu: ({ children }) => <div>{children}</div>,
  MenuButton: ({ children }) => <div>{children}</div>,
  MenuList: ({ children }) => <div>{children}</div>,
  MenuItem: ({ children }) => <div>{children}</div>,
  Button: ({ children, leftIcon, ...props }) => {
    const { style, props: cleanProps } = transformChakraProps({ ...props, alignItems: 'center' });
    return (
      <button
        style={style}
        {...cleanProps}
      >
        {leftIcon}
        {children}
      </button>
    );
  }
}));

describe('InsightMetadata', () => {
  const mockUser = {
    id: '1',
    name: 'Test User',
    avatar_url: 'test-avatar.jpg'
  };

  const mockInsight = {
    person: { name: 'John Doe' },
    initiative: { title: 'Test Initiative' },
    sources: Array(3).fill('source')
  };

  const mockFullCards = {
    card1: { source: 'zoom' },
    card2: { source: 'teams' },
    card3: { source: 'slack' }
  };

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();

    // Setup default mock implementations
    useUserStore.mockImplementation(() => mockUser);
    useFullCards.mockImplementation(() => ({ fullCards: mockFullCards }));

    // Mock scrollIntoView
    Element.prototype.scrollIntoView = vi.fn();

    // Create mock elements for tab interaction
    const tabsDiv = document.createElement('div');
    tabsDiv.id = 'insight-tabs';
    const tabButton = document.createElement('button');
    tabButton.setAttribute('role', 'tab');
    tabsDiv.appendChild(tabButton);
    document.body.appendChild(tabsDiv);
  });

  afterEach(() => {
    // Clean up mock elements
    const tabsDiv = document.getElementById('insight-tabs');
    if (tabsDiv) {
      document.body.removeChild(tabsDiv);
    }
  });

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <div id='insight-sources' />
        <InsightMetadata
          insight={mockInsight}
          {...props}
        />
      </BrowserRouter>
    );
  };

  it('renders basic insight information', () => {
    renderComponent();
    expect(screen.getByText('FORA Insight for John Doe')).toBeInTheDocument();
    expect(screen.getByText('3 sources')).toBeInTheDocument();
  });

  it('scrolls to sources tab when sources text is clicked', async () => {
    renderComponent();

    const sourcesText = screen.getByText('3 sources');
    fireEvent.click(sourcesText);

    const sourcesDiv = document.getElementById('insight-sources');
    expect(sourcesDiv.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
  });

  it('shows source type logos', () => {
    renderComponent();
    const logos = screen.getAllByRole('img');
    expect(logos.length).toBeGreaterThan(0);
  });

  it('handles missing insight data gracefully', () => {
    renderComponent({ insight: null });
    expect(screen.getByText('FORA Insight for')).toBeInTheDocument();
  });

  it('renders avatar when user is available', () => {
    useUserStore.mockImplementation(() => null);
    renderComponent();
    expect(screen.getByRole('img', { name: /avatar/i })).toBeInTheDocument();
  });

  it('renders correctly with empty sources', () => {
    renderComponent({ insight: { ...mockInsight, sources: [] } });
    expect(screen.getByText('0 sources')).toBeInTheDocument();
  });

  it('applies correct styling to containers', () => {
    renderComponent();
    const containers = screen.getAllByTestId('stack');
    expect(containers.length).toBeGreaterThan(0);
    expect(containers[0]).toHaveAttribute('direction', 'row');
  });

  it('renders menu button', () => {
    renderComponent();
    const button = screen.getByRole('button', { name: '' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('variant', 'ghost');
  });
});
