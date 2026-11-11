import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { ChakraProvider } from '@chakra-ui/react';
import { useStatsigClient } from '@statsig/react-bindings';

import AppHeader from '@components/layout/app-header.component';
import { useUserStore } from '@store/app.store';
import { useGlobalSettings } from '@services/query-services/global-settings.query-service';

vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@services/query-services/global-settings.query-service');

vi.mock('@components/layout/summarize/summarize-menu.component.jsx', () => ({
  default: () => <div data-testid='summarize-menu' />
}));

vi.mock('@components/global-search/desktop-global-search-wrapper.component', () => ({
  default: () => <div data-testid='global-search-wrapper' />
}));

vi.mock('@store/app.store');

const renderComponent = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const wrapper = ({ children }) => (
    <ChakraProvider>
      <BrowserRouter>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>{' '}
        </QueryParamProvider>
      </BrowserRouter>
    </ChakraProvider>
  );

  return render(<AppHeader />, { wrapper });
};

describe('AppHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useStatsigClient.mockReturnValue({ checkGate: () => false });
    useGlobalSettings.mockReturnValue({ data: {} });
  });

  describe('FORA user', () => {
    beforeEach(() => {
      useUserStore.mockImplementation((selector) => {
        return selector({
          user: {
            id: '123',
            isGuest: false
          },
          outageMessageVisibility: null,
          getOutageMessageVisibility: vi.fn(),
          setOutageMessageVisibility: vi.fn()
        });
      });
    });

    it('should enable useGlobalSettings request', () => {
      renderComponent();
      expect(useGlobalSettings).toHaveBeenCalledWith({}, { enabled: true });
    });

    it('should not render SummarizeMenu when feature flag is disabled', () => {
      useStatsigClient.mockReturnValue({ checkGate: () => false });
      renderComponent();
      expect(screen.queryByTestId('summarize-menu')).not.toBeInTheDocument();
    });

    it('should render SummarizeMenu when feature flag is enabled', () => {
      useStatsigClient.mockReturnValue({
        checkGate: (flag) => (flag === 'summarize-menu' ? true : false)
      });
      renderComponent();
      expect(screen.queryByTestId('summarize-menu')).toBeInTheDocument();
    });
  });

  describe('Guest user', () => {
    beforeEach(() => {
      useUserStore.mockImplementation((selector) => {
        return selector({
          user: {
            id: '123',
            isGuest: true
          },
          outageMessageVisibility: null,
          getOutageMessageVisibility: vi.fn(),
          setOutageMessageVisibility: vi.fn()
        });
      });
    });

    it('should disable useGlobalSettings request', () => {
      renderComponent();
      expect(useGlobalSettings).toHaveBeenCalledWith({}, { enabled: false });
    });

    it('should not render SummarizeMenu for guest user', () => {
      useStatsigClient.mockReturnValue({
        checkGate: (flag) => (flag === 'summarize-menu' ? true : false)
      });
      renderComponent();
      expect(screen.queryByTestId('summarize-menu')).not.toBeInTheDocument();
    });
  });
});
