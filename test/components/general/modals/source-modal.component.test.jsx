import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SourceModal from '@components/general/modals/source-modal.component';
import { Modal, ModalOverlay, ModalContent, ModalBody, ModalCloseButton } from '@chakra-ui/react';

// Mock useInsights hook
vi.mock('@services/query-services/insights.query-service', () => ({
  useInsights: () => ({
    data: [
      {
        id: 'test-insight-id'
      }
    ],
    isSuccess: true
  })
}));

// Mock StyledModal component
vi.mock('@components/general/modals/styled-modal.component', () => ({
  default: ({ children, customHeader, ...props }) => (
    <div data-testid='styled-modal'>
      <Modal
        isOpen={true}
        onClose={() => {}}
      >
        <ModalOverlay />
        <ModalContent>
          {customHeader}
          <ModalCloseButton data-testid='modal-close-button' />
          <ModalBody>{children}</ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}));

// Mock ICON_MAPPING
vi.mock('@util/constants', () => ({
  ICON_MAPPING: {
    lens: {
      icon: () => <div data-testid='lens-icon'>LensIcon</div>
    }
  },
  PUSHER_APP_CONFIG: {
    cluster: 'test',
    forceTLS: true
  }
}));

// Mock icons
vi.mock('@assets/icons', () => ({
  ChevronRightIcon: () => <div data-testid='chevron-right-icon'>ChevronRightIcon</div>,
  SFBoltFillIcon: () => <div data-testid='bolt-icon'>BoltIcon</div>,
  SFEllipsisIcon: ({ children, ...props }) => (
    <div
      data-testid='ellipsis-icon'
      {...props}
    >
      {children}
    </div>
  ),
  SFSquareOnSquareIcon: ({ children, ...props }) => (
    <div
      data-testid='square-on-square-icon'
      {...props}
    >
      {children}
    </div>
  )
}));

// Mock ReactRouterLink
vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  Link: ({ children, ...props }) => (
    <a
      data-testid='router-link'
      {...props}
    >
      {children}
    </a>
  ),
  BrowserRouter: ({ children }) => <div data-testid='browser-router'>{children}</div>
}));

describe('SourceModal', () => {
  const mockCard = {
    initiative: {
      icon: 'lens',
      title: 'Test Initiative',
      id: 'test-initiative-id'
    },
    source_data: {
      title: 'Source Title'
    },
    headline: 'Test Headline'
  };

  const renderComponent = (props = {}) => {
    const queryClient = new QueryClient();
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <SourceModal
            card={mockCard}
            {...props}
          />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  it('renders basic modal structure', () => {
    renderComponent();
    expect(screen.getByTestId('styled-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
  });

  it('renders header content when provided', () => {
    const headerContent = <div data-testid='custom-header'>Custom Header</div>;
    renderComponent({ headerContent });
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByText('Custom Header')).toBeInTheDocument();
  });

  it('renders subheader content when provided', () => {
    const subheaderContent = <div data-testid='custom-subheader'>Custom Subheader</div>;
    renderComponent({ subheaderContent });
    expect(screen.getByTestId('custom-subheader')).toBeInTheDocument();
    expect(screen.getByText('Custom Subheader')).toBeInTheDocument();
  });

  it('renders both header and subheader content when provided', () => {
    const headerContent = <div data-testid='custom-header'>Custom Header</div>;
    const subheaderContent = <div data-testid='custom-subheader'>Custom Subheader</div>;
    renderComponent({ headerContent, subheaderContent });
    expect(screen.getByTestId('custom-header')).toBeInTheDocument();
    expect(screen.getByTestId('custom-subheader')).toBeInTheDocument();
  });

  it('renders title from card data', () => {
    renderComponent();
    expect(screen.getByText('Test Initiative')).toBeInTheDocument();
  });

  it('renders forced title when provided', () => {
    const mockCardWithDate = {
      ...mockCard,
      source_data: {
        title: 'Source Title',
        start_at: '2024-01-01T00:00:00Z'
      }
    };
    renderComponent({ forceTitle: true, card: mockCardWithDate });
    expect(screen.getByText('Source Title - January 1, 2024')).toBeInTheDocument();
  });

  it('renders bolt icon when useBoltIcon is true', () => {
    const mockCardWithSections = {
      ...mockCard,
      sections: [
        {
          title: 'Test Section',
          content: 'Test Content'
        }
      ],
      initiative: {
        ...mockCard.initiative,
        type: 'Lens'
      }
    };
    renderComponent({ useBoltIcon: true, card: mockCardWithSections });
    expect(screen.getByTestId('bolt-icon')).toBeInTheDocument();
  });
});
