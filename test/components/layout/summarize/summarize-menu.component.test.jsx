import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { ChakraProvider } from '@chakra-ui/react';
import { useStatsigClient } from '@statsig/react-bindings';

import { useUserStore } from '@store/app.store';
import SummarizeMenu from '@components/layout/summarize/summarize-menu.component';

// Mocks

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: vi.fn()
}));

vi.mock('@components/digest/slack-digest-modal.component', () => ({
  default: () => <div data-testid='slack-digest'>Slack Digest Modal</div>
}));

vi.mock('@components/digest/teams-digest-modal.component', () => ({
  default: () => <div data-testid='teams-digest'>Teams Digest Modal</div>
}));

vi.mock('@components/layout/summarize/summarize-audio-video.component.jsx', () => ({
  default: () => <div data-testid='audio-video-modal'>Audio Video Modal</div>
}));

vi.mock('@components/layout/summarize/summarize-earnings-calls.component.jsx', () => ({
  default: () => <div data-testid='earnings-call-modal'>EC Modal</div>
}));

vi.mock('@components/layout/summarize/summarize-document.component.jsx', () => ({
  default: () => <div data-testid='Document Modal'>Doc Modal</div>
}));

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

  return render(<SummarizeMenu />, { wrapper });
};

describe('SummarizeMenu', () => {
  describe('all options enabled', () => {
    beforeEach(() => {
      useStatsigClient.mockReturnValue({ checkGate: () => true });

      useUserStore.mockImplementation((selector) =>
        selector({
          user: { type: 'Admin' },
          tenant: {
            id: 'tenant-abc',
            slack_config: { access_token: 'slack-token' },
            teams_config: { access_token: 'teams-token' }
          }
        })
      );
    });

    it('renders the component without crashing', () => {
      renderComponent();
      expect(screen.getByTestId('summarize-menu')).toBeInTheDocument();
    });

    it('displays summary options', () => {
      renderComponent();
      expect(screen.getByText(/Summarize/i)).toBeInTheDocument();
    });

    it('shows dropdown options when clicked', async () => {
      renderComponent();
      const menuButton = screen.getByText(/Summarize/i);
      menuButton.click();

      expect(await screen.findByText(/Audio & Video/i)).toBeInTheDocument();
      expect(await screen.findByText(/Document/i)).toBeInTheDocument();
      expect(await screen.findByText(/Earnings Call/i)).toBeInTheDocument();
      expect(await screen.findByText(/Slack Channels/i)).toBeInTheDocument();
      expect(await screen.findByText(/Teams Channels/i)).toBeInTheDocument();

      const link = await screen.findByRole('link', { name: /Manage Uploads/i });
      expect(link).toBeInTheDocument();
      expect(link.getAttribute('href')).toBe('/settings/manage-uploads');
    });

    it('shows plus icon for normal items and hides it for Manage Uploads', async () => {
      renderComponent();
      const menuButton = screen.getByText(/Summarize/i);
      act(() => fireEvent.click(menuButton));

      const documentButton = await screen.findByRole('button', { name: /Document/i });
      expect(within(documentButton).getByTestId('plus-icon')).toBeInTheDocument();

      const manageUploadsLink = await screen.findByRole('link', { name: /Manage Uploads/i });
      expect(within(manageUploadsLink).queryByTestId('plus-icon')).not.toBeInTheDocument();
    });
  });

  describe('enableAudioVideo is disabled', () => {
    beforeEach(() => {
      useUserStore.mockImplementation((selector) =>
        selector({
          user: { type: 'Admin' },
          tenant: {
            id: 'tenant-abc',
            slack_config: { access_token: 'slack-token' },
            teams_config: { access_token: 'teams-token' }
          }
        })
      );
    });

    it('shows dropdown options when clicked', async () => {
      useStatsigClient.mockReturnValue({ checkGate: () => false });
      renderComponent();
      const menuButton = screen.getByText(/Summarize/i);
      menuButton.click();

      expect(await screen.queryByText(/Audio & Video/i)).not.toBeInTheDocument();
      expect(await screen.findByText(/Document/i)).toBeInTheDocument();
      expect(await screen.findByText(/Earnings Call/i)).toBeInTheDocument();
      expect(await screen.findByText(/Slack Channels/i)).toBeInTheDocument();
      expect(await screen.queryByText(/Teams Channels/i)).not.toBeInTheDocument();
    });
  });

  describe('earnings calls', () => {
    it('displays Earnings Calls menu item only for Admins and Executives', async () => {
      // Admin
      useUserStore.mockImplementation((selector) => selector({ user: { type: 'Admin' } }));
      const { rerender } = renderComponent();

      const menuButton = screen.getByText(/Summarize/i);
      act(() => fireEvent.click(menuButton));

      expect(await screen.findByText(/Earnings Call/i)).toBeInTheDocument();

      // Exec
      useUserStore.mockImplementation((selector) => selector({ user: { type: 'Executive' } }));

      rerender(<SummarizeMenu />);
      act(() => fireEvent.click(menuButton));

      expect(screen.queryByText(/Earnings Call/i)).toBeInTheDocument();

      // Full
      useUserStore.mockImplementation((selector) => selector({ user: { type: 'Full' } }));

      rerender(<SummarizeMenu />);
      act(() => fireEvent.click(menuButton));

      expect(screen.queryByText(/Earnings Call/i)).not.toBeInTheDocument();
    });
  });

  describe('teams digest', () => {
    it('shows Teams options only when configured', async () => {
      useStatsigClient.mockReturnValue({ checkGate: (gate) => gate === 'teams-digests' });
      renderComponent();
      const menuButton = screen.getByText(/Summarize/i);
      menuButton.click();
      expect(await screen.findByText(/Teams Channels/i)).toBeInTheDocument();
    });
  });
});
