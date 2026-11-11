import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import { BrowserRouter, MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';
import { useStatsigClient } from '@statsig/react-bindings';
import { vi } from 'vitest';
import { format, subMinutes, addMinutes } from 'date-fns';

import AddMenu from '@components/layout/add-menu.component'; // Assuming AddMenu.js is in the same directory or adjust path
import { useUserStore } from '@store/app.store'; // Adjust path as needed
import {
  useAgendaMeetings,
  useInvalidateMeetingQueries
} from '@services/query-services/meetings.query-service';
import {
  useLiveDate,
  useMailtoFunctionality,
  useMeetingBotStatuses,
  useMeetingManagementActions,
  useUpdateBotFromPusherEvent
} from '@util/hooks';

// --- Mocks ---

// Statsig
vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: vi.fn()
}));

// Chakra UI useDisclosure
vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useDisclosure: vi.fn(() => ({
      isOpen: false,
      onOpen: vi.fn(),
      onClose: vi.fn()
    }))
  };
});

// Custom Hooks and Services
vi.mock('@services/query-services/meetings.query-service', () => ({
  useAgendaMeetings: vi.fn(),
  useInvalidateMeetingQueries: vi.fn(() => vi.fn())
}));

vi.mock('@util/hooks', () => ({
  useLiveDate: vi.fn(),
  useMailtoFunctionality: vi.fn(() => vi.fn()),
  useMeetingBotStatuses: vi.fn(),
  useMeetingManagementActions: vi.fn(),
  useUpdateBotFromPusherEvent: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@components/meeting/create-meeting-modal.component', () => ({
  default: ({ disclosure }) => (
    <div data-testid='create-meeting-modal'>{disclosure.isOpen && <span>Modal Open</span>}</div>
  )
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const renderComponent = () => {
  return render(
    <ChakraProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <QueryParamProvider adapter={ReactRouter6Adapter}>
            <AddMenu />
          </QueryParamProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ChakraProvider>
  );
};

const mockCheckGate = vi.fn();
const mockUseAgendaMeetings = vi.fn();
const mockUseLiveDate = vi.fn();
const mockUseMeetingBotStatuses = vi.fn();
const mockUseMeetingManagementActions = vi.fn();
const mockUseUserStore = vi.fn();
const mockOnOpenForModal = vi.fn();
const mockOnCloseForModal = vi.fn();
const mockUseDisclosure = useDisclosure;

describe('AddMenu', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useStatsigClient.mockReturnValue({ checkGate: mockCheckGate });
    mockUseAgendaMeetings.mockReturnValue({ data: [], isLoading: false, isError: false });
    useAgendaMeetings.mockImplementation(mockUseAgendaMeetings);

    const now = new Date();
    mockUseLiveDate.mockReturnValue(now);
    useLiveDate.mockImplementation(mockUseLiveDate);

    mockUseMeetingBotStatuses.mockReturnValue({ isLive: false, wasSummarized: false });
    useMeetingBotStatuses.mockImplementation(mockUseMeetingBotStatuses);

    mockUseMeetingManagementActions.mockReturnValue({
      showAddForaButton: true,
      showAddForaBackButton: false,
      startMeetingAndRecording: vi.fn().mockResolvedValue(true)
    });
    useMeetingManagementActions.mockImplementation(mockUseMeetingManagementActions);

    mockUseUserStore.mockReturnValue({ tenant: {} });
    useUserStore.mockImplementation((selector) => selector(mockUseUserStore));

    const disclosureMockResult = {
      isOpen: false,
      onOpen: mockOnOpenForModal,
      onClose: mockOnCloseForModal
    };
    mockUseDisclosure.mockImplementation(() => disclosureMockResult);
  });

  const openMenu = async (variant) => {
    let testId = 'add-menu-button';
    let expectedText = 'Record Live Meeting';
    if (variant === 'legacy') {
      testId = 'legacy-' + testId;
      expectedText = 'Add FORA to a Meeting';
    }
    const menuButton = screen.queryByTestId(testId);
    await waitFor(() => {
      expect(menuButton).toBeInTheDocument();
    });
    fireEvent.click(menuButton);
    await waitFor(() => {
      expect(screen.queryByText(expectedText)).toBeInTheDocument();
    });
  };

  describe('Feature Flag Logic', () => {
    it('should render NewAddMenu when "summarize-menu" feature flag is enabled', async () => {
      mockCheckGate.mockImplementation((flag) => flag === 'summarize-menu');
      renderComponent(<AddMenu />);
      await openMenu();
      expect(screen.getByText('Record Live Meeting')).toBeInTheDocument();
      expect(screen.getByText('Paste conference link')).toBeInTheDocument();
      expect(screen.queryByText('Add FORA to a Meeting')).not.toBeInTheDocument();
    });

    it('should render LegacyAddMenu when "summarize-menu" feature flag is disabled', async () => {
      mockCheckGate.mockReturnValue(false);
      renderComponent(<AddMenu />);
      await openMenu('legacy');
      expect(screen.getByText('Add FORA to a Meeting')).toBeInTheDocument();
      expect(screen.queryByText('Record Live Meeting')).not.toBeInTheDocument();
    });
  });

  describe('NewAddMenu (summarize-menu enabled)', () => {
    const now = new Date(2024, 4, 27, 10, 0, 0); // May 27, 2024, 10:00:00 AM

    const liveMeeting = {
      id: 'meeting-1',
      title: 'Live Now Meeting',
      url: 'http://zoom.us/live1',
      start_at: subMinutes(now, 10).toISOString(), // Started 10 mins ago
      end_at: addMinutes(now, 20).toISOString(), // Ends in 20 mins
      bot: { id: 'bot-1', status: 'idle' }
    };

    beforeEach(() => {
      mockCheckGate.mockReturnValue(true);
      mockUseLiveDate.mockReturnValue(now);
      useLiveDate.mockImplementation(mockUseLiveDate);
    });

    it('should display "Record Live Meeting" and "Paste conference link"', async () => {
      mockUseAgendaMeetings.mockReturnValue({ data: [], isLoading: false });
      renderComponent(<AddMenu />);
      await openMenu();
      expect(screen.getByText('Record Live Meeting')).toBeInTheDocument();
      expect(screen.getByText('Paste conference link')).toBeInTheDocument();
    });

    it('should not display a meeting if it was already summarized', async () => {
      mockUseMeetingBotStatuses.mockImplementation((bot) => {
        if (bot?.id === liveMeeting.bot.id)
          return {
            isLive: true,
            wasSummarized: true,
            showAddForaButton: true,
            showAddForaBackButton: false
          };
        return {
          isLive: false,
          wasSummarized: false,
          showAddForaButton: true,
          showAddForaBackButton: false
        };
      });

      mockUseAgendaMeetings.mockReturnValue({
        data: [liveMeeting],
        isLoading: false
      });
      renderComponent(<AddMenu />);
      await openMenu();
      expect(screen.queryByText(liveMeeting.title)).not.toBeInTheDocument();
    });

    describe('LegacyAddMenu (summarize-menu disabled)', () => {
      const mockMailto = vi.fn();

      beforeEach(() => {
        mockCheckGate.mockReturnValue(false);
        useMailtoFunctionality.mockReturnValue(mockMailto);
      });

      it('should display "Add FORA to a Meeting" and email forward note', async () => {
        renderComponent(<AddMenu />);
        await openMenu('legacy');
        expect(screen.getByText('Add FORA to a Meeting')).toBeInTheDocument();
        expect(screen.getByText(/Note: Forward email threads to/i)).toBeInTheDocument();
        expect(screen.getByText('feed@fora.day')).toBeInTheDocument();
      });

      it('should call mailto function when email forward note is clicked', async () => {
        renderComponent(<AddMenu />);
        await openMenu('legacy');
        const emailNote = screen.getByText('feed@fora.day'); // or the surrounding MenuItem
        fireEvent.click(emailNote.closest('button')); // Click the MenuItem
        expect(mockMailto).toHaveBeenCalledWith(
          expect.anything(),
          'feed@fora.day',
          "Fora's email address"
        );
      });
    });
  });
});
