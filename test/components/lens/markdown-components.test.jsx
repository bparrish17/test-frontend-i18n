import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { code, p, sourcebutton } from '@components/lens/markdown-components';

// Mock dependencies
vi.mock('@util/hooks', () => ({
  useFullCards: () => ({ fullCards: {} }),
  usePrefetchInfiniteSearchQuery: () => () => Promise.resolve()
}));

vi.mock('@services/query-services/insights.query-service', () => ({
  useInsights: () => ({
    data: [],
    isSuccess: false
  })
}));

vi.mock('@assets/icons', () => ({
  ChevronRightIcon: () => <span data-testid='chevron-right-icon' />,
  SFBoltFillIcon: () => <span data-testid='bolt-fill-icon' />
}));

vi.mock('@assets/icons/sf-icons/exclamation-mark-circle-filled.icon', () => ({
  default: () => <span data-testid='exclamation-mark-circle-filled-icon' />
}));

vi.mock('@components/general/modals/styled-modal.component', () => ({
  default: ({ children, openButton }) => (
    <div data-testid='styled-modal'>
      {openButton}
      {children}
    </div>
  )
}));

vi.mock('@util/constants', () => ({
  ICON_MAPPING: {
    lens: { icon: () => <span data-testid='lens-icon' /> }
  }
}));

vi.mock('@components/lens/source-info.jsx', () => ({
  default: () => <div data-testid='source-info' />
}));

vi.mock('@chakra-ui/react', () => ({
  chakra: (v) => v,
  Box: ({ children, ...props }) => (
    <div
      data-testid='box'
      {...props}
    >
      {children}
    </div>
  ),
  Button: ({ children, ...props }) => (
    <button
      data-testid='source-button'
      {...props}
    >
      {children}
    </button>
  ),
  Text: ({ children, ...props }) => (
    <span
      data-testid='text'
      {...props}
    >
      {children}
    </span>
  ),
  VStack: ({ children }) => <div data-testid='vstack'>{children}</div>,
  HStack: ({ children }) => <div data-testid='hstack'>{children}</div>,
  Modal: ({ children }) => <div data-testid='modal'>{children}</div>,
  ModalOverlay: ({ children }) => <div data-testid='modal-overlay'>{children}</div>,
  ModalContent: ({ children }) => <div data-testid='modal-content'>{children}</div>,
  ModalHeader: ({ children }) => <div data-testid='modal-header'>{children}</div>,
  ModalBody: ({ children }) => <div data-testid='modal-body'>{children}</div>,
  ModalCloseButton: () => <button data-testid='modal-close'>Close</button>,
  TagLeftIcon: ({ children, as: Icon }) => (
    <span data-testid='tag-left-icon'>
      {Icon && <Icon />}
      {children}
    </span>
  ),
  useDisclosure: () => ({
    isOpen: false,
    onOpen: vi.fn(),
    onClose: vi.fn()
  }),
  Circle: ({ children }) => <div data-testid='circle'>{children}</div>,
  Icon: ({ as: Icon }) => <span data-testid='icon'>{Icon && <Icon />}</span>,
  Stack: ({ children }) => <div data-testid='stack'>{children}</div>,
  Spacer: () => <div data-testid='spacer' />,
  UnorderedList: ({ children }) => <ul data-testid='unordered-list'>{children}</ul>,
  ListItem: ({ children }) => <li data-testid='list-item'>{children}</li>
}));

describe('Markdown Components', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const renderComponent = (Component, props = {}) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Component {...props} />
        </BrowserRouter>
      </QueryClientProvider>
    );
  };

  describe('code component', () => {
    it('renders code with correct styling', () => {
      const props = {
        children: ['console.log("test")']
      };
      renderComponent(code, props);
      const codeElement = screen.getByTestId('text');
      expect(codeElement).toBeInTheDocument();
      expect(codeElement).toHaveTextContent('console.log("test")');
    });

    it('handles multiline code', () => {
      const props = {
        children: ['const x = 1;\nconsole.log(x);']
      };
      renderComponent(code, props);
      const codeElement = screen.getByTestId('text');
      expect(codeElement).toBeInTheDocument();
      expect(codeElement).toHaveTextContent('const x = 1; console.log(x);');
    });
  });

  describe('p component', () => {
    it('renders paragraph with correct styling', () => {
      const props = {
        children: ['Test paragraph']
      };
      renderComponent(p, props);
      const paragraphElement = screen.getByTestId('text');
      expect(paragraphElement).toBeInTheDocument();
      expect(paragraphElement).toHaveTextContent('Test paragraph');
    });

    it('handles multiple text nodes', () => {
      const props = {
        children: ['First part', ' and ', 'second part']
      };
      renderComponent(p, props);
      const paragraphElement = screen.getByTestId('text');
      expect(paragraphElement).toHaveTextContent('First part and second part');
    });
  });

  describe('sourcebutton component', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('renders source button with correct number', () => {
      const props = {
        children: ['1']
      };
      renderComponent(sourcebutton, props);
      const buttonElement = screen.getByTestId('source-button');
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('1');
    });

    it('renders source button with bracketed number', () => {
      const props = {
        children: ['[1]']
      };
      renderComponent(sourcebutton, props);
      const buttonElement = screen.getByTestId('source-button');
      expect(buttonElement).toHaveTextContent('[1]');
    });
  });
});
