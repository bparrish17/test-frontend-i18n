import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { map, omit } from 'lodash-es';
import { useDisclosure } from '@chakra-ui/react';
import { useRollbar } from '@rollbar/react';

import { useUserStore } from '@store/app.store';
import {
  useAllMeetingContentById,
  useShareMeeting
} from '@services/query-services/meetings.query-service';
import { useStyledToast, useTopicGroupsAndSummaries } from '@util/hooks';
import { meetingIdWithBot } from '@util/helpers';
import ShareMeetingModal from '@components/meeting/share-meeting-modal.component';

const mockSubmitValues = {
  recipients: [{ email: 'gwashington@gmail.com' }, { email: 'troosevelt@yahoo.com' }],
  message: 'hello world',
  guest: true
};

vi.mock('@components/general/card/reskin-meeting-card/reskin-meeting-card.hooks');
vi.mock('@store/app.store');
vi.mock('@services/query-services/bots.query-service');
vi.mock('@services/query-services/meetings.query-service');
vi.mock('@util/hooks', () => ({
  useReskinMeetingCardContext: vi.fn(),
  useStyledToast: vi.fn(),
  useTopicGroupsAndSummaries: vi.fn(),
  useBreakpoints: () => ({ isMobile: false })
}));
vi.mock('@util/helpers', async (importActual) => ({
  ...(await importActual()),
  meetingIdWithBot: vi.fn()
}));
vi.mock('@rollbar/react', () => ({
  useRollbar: vi.fn()
}));

vi.mock('@components/share-summary/share-summary.component.jsx', () => ({
  default: ({ children, pdfDocument, onSubmit, attendees }) => (
    <div>
      <span>Share Summary Component</span>
      {children}
      <div>{pdfDocument}</div>
      <div data-testid='mock-attendees'>{JSON.stringify(attendees)}</div>
      <button onClick={() => onSubmit(mockSubmitValues)}>Submit</button>
    </div>
  )
}));

vi.mock('@components/general/card/reskin-meeting-card/reskin-meeting-card.component', () => ({
  default: ({ children }) => (
    <div>
      <span>ReskinMeetingCard</span>
      {children}
    </div>
  )
}));

vi.mock('@components/pdf/meeting-pdf.component', () => ({
  default: () => <div>Meeting PDF</div>
}));

vi.mock('@chakra-ui/react', async (importActual) => ({
  ...(await importActual()),
  useDisclosure: vi.fn()
}));

describe('ShareMeetingModal', () => {
  const mockMeeting = {
    id: '12345',
    title: 'Test Meeting',
    start_at: new Date(),
    sensitive: false,
    attendees: [{ id: '1', email: 'test@example.com' }]
  };
  const mockBot = { id: 'bot1', transcripts: [], recap: 'MOCK RECAP' };
  const mockCard = {};
  const mockUser = { name: 'Test User' };
  const mockTenant = { name: 'Test Tenant' };
  const mockTopicGroups = [];
  const mockToast = vi.fn();
  const mockShareMeeting = vi.fn();

  const openModal = () => fireEvent.click(screen.getByText('Share'));

  let mockRollbar;
  beforeEach(() => {
    vi.clearAllMocks();

    mockRollbar = { error: vi.fn() };
    useRollbar.mockReturnValue(mockRollbar);

    useUserStore.mockReturnValue((selector) => selector({ user: mockUser, tenant: mockTenant }));
    meetingIdWithBot.mockImplementation((m) => m?.id);
    useAllMeetingContentById.mockReturnValue({ data: { bot: mockBot } });
    useShareMeeting.mockReturnValue({ mutateAsync: mockShareMeeting, isSharing: false });
    useStyledToast.mockReturnValue(mockToast);
    useTopicGroupsAndSummaries.mockReturnValue({ topicGroups: mockTopicGroups });
    useDisclosure.mockReturnValue({ isOpen: true, onClose: vi.fn() });
  });

  const renderDefault = (props = {}) => {
    render(
      <ShareMeetingModal
        meeting={mockMeeting}
        bot={mockBot}
        card={mockCard}
        buttonStyles={{}}
        {...props}
      />
    );
  };

  describe('when bot has sufficient data', () => {
    it('renders the component', () => {
      renderDefault();
      expect(screen.getByText('Share')).toBeInTheDocument();
    });

    it('disables the useAllMeetingContentById query', () => {
      renderDefault();
      expect(useAllMeetingContentById).toHaveBeenCalledWith(mockMeeting?.id, false, {
        enabled: false
      });
    });

    it('renders ShareSummary component with MeetingPDF as its pdfDocument', () => {
      renderDefault();
      openModal();
      expect(screen.getByText('Meeting PDF')).toBeInTheDocument();
    });

    it('renders ShareSummary component with attendees', () => {
      renderDefault();
      openModal();

      expect(screen.getByTestId('mock-attendees')).toHaveTextContent(
        JSON.stringify(mockMeeting.attendees)
      );
    });

    it('renders ShareSummary component with nylas participants', () => {
      // override the mock meeting, passing in nylas participants.
      // We prefer participants over attendees in the ShareSummary
      renderDefault({
        meeting: {
          ...mockMeeting,
          nylas: { participants: [{ id: '2', email: 'test2@example.com' }] }
        }
      });
      openModal();

      expect(screen.getByTestId('mock-attendees')).toHaveTextContent(
        JSON.stringify([{ id: '2', email: 'test2@example.com' }])
      );
    });

    it('renders ShareSummary component with ReskinMeetingCard as its children', () => {
      renderDefault();
      openModal();
      expect(screen.getByText('ReskinMeetingCard')).toBeInTheDocument();
    });

    it('opens the modal when the button is clicked', () => {
      renderDefault();
      openModal();
      expect(screen.getByText('Share Summary')).toBeInTheDocument();
    });

    it('shares the meeting with provided values', async () => {
      const mockShareMeeting = vi.fn().mockResolvedValue();
      useShareMeeting.mockReturnValue({ mutateAsync: mockShareMeeting, isSharing: false });
      renderDefault();
      openModal();
      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(mockShareMeeting).toHaveBeenCalledWith(
          {
            id: expect.any(String),
            body: {
              ...omit(mockSubmitValues, 'recipients'),
              emails: map(mockSubmitValues?.recipients, 'email')
            }
          },
          expect.any(Object)
        );
      });
    });

    it('informs user with toast on share success', async () => {
      const mockShareMutation = (_values, { onSuccess }) => Promise.resolve().then(onSuccess);
      const mockShareMeeting = vi.fn().mockImplementation(mockShareMutation);
      useShareMeeting.mockReturnValue({ mutateAsync: mockShareMeeting, isSharing: false });
      renderDefault();
      openModal();
      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(mockShareMeeting).toHaveBeenCalled();
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Successfully shared meeting',
          status: 'success',
          isClosable: true
        });
      });
    });

    it('handles error on form submission', async () => {
      const mockShareMutation = (_values, { onError }) =>
        Promise.reject('Test Error').catch(onError);
      const mockShareMeeting = vi.fn().mockImplementation(mockShareMutation);
      useShareMeeting.mockReturnValue({ mutateAsync: mockShareMeeting, isSharing: false });
      renderDefault();
      openModal();
      fireEvent.click(screen.getByText('Submit'));

      await waitFor(() => {
        expect(mockShareMeeting).toHaveBeenCalled();
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Something went wrong while sharing meeting. Please try again.',
          status: 'error',
          isClosable: true
        });
      });
    });
  });

  describe('when bot is missing transcripts', () => {
    it('renders the component', () => {
      renderDefault({ bot: { id: 'bot1', recap: 'MOCK RECAP' } });
      expect(screen.getByText('Share')).toBeInTheDocument();
    });

    it('enables the useAllMeetingContentById query', () => {
      renderDefault({ bot: { id: 'bot1', recap: 'MOCK RECAP' } });
      expect(useAllMeetingContentById).toHaveBeenCalledWith(mockMeeting?.id, false, {
        enabled: true
      });
    });
  });

  describe('when bot is missing recap', () => {
    it('renders the component', () => {
      renderDefault({ bot: { id: 'bot1', transcripts: [] } });
      expect(screen.getByText('Share')).toBeInTheDocument();
    });

    it('enables the useAllMeetingContentById query', () => {
      renderDefault({ bot: { id: 'bot1', transcripts: [] } });
      expect(useAllMeetingContentById).toHaveBeenCalledWith(mockMeeting?.id, false, {
        enabled: true
      });
    });
  });

  describe('when meeting doesnt have the bot assigned to it or a linked meeting available', () => {
    it('renders the component', () => {
      renderDefault({ bot: null });
      expect(screen.getByText('Share')).toBeInTheDocument();
    });

    it('enables the useAllMeetingContentById query', () => {
      renderDefault({ bot: null });
      expect(useAllMeetingContentById).toHaveBeenCalledWith(mockMeeting?.id, false, {
        enabled: true
      });
    });

    it('shares valid meeting ID on share', async () => {
      renderDefault({ bot: null });
      fireEvent.click(screen.getByText('Submit'));
      await waitFor(() => {
        expect(mockShareMeeting).toHaveBeenCalledWith(
          expect.objectContaining({ id: expect.any(String) }),
          expect.any(Object)
        );
      });
    });
  });
});
