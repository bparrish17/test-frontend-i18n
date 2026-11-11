import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { map, omit } from 'lodash-es';

import { useUserStore } from '@store/app.store';
import { useShareCard } from '@services/query-services/cards.query-service';
import { useStyledToast, useTopicGroupsAndSummaries } from '@util/hooks';
import ShareEarningsCallModal from '@pages/earnings-call/share-earnings-call-modal.component';

const mockSubmitValues = {
  recipients: [{ email: 'gwashington@gmail.com' }, { email: 'troosevelt@yahoo.com' }],
  message: 'hello world',
  guest: true
};

const mockCard = {
  id: '1234',
  headline: 'Fake Card Headline'
};

vi.mock('@components/general/card/reskin-meeting-card/reskin-meeting-card.hooks');
vi.mock('@store/app.store');
vi.mock('@services/query-services/bots.query-service');
vi.mock('@services/query-services/cards.query-service');
vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn(),
  useTopicGroupsAndSummaries: vi.fn(),
  useBreakpoints: () => ({ isMobile: false })
}));
vi.mock('@util/helpers', async (importActual) => ({
  ...(await importActual()),
  meetingIdWithBot: vi.fn()
}));

vi.mock('@components/share-summary/share-summary.component.jsx', () => ({
  default: ({ children, pdfDocument, onSubmit }) => (
    <div>
      <span>Share Summary Component</span>
      {children}
      <div>{pdfDocument}</div>
      <button onClick={() => onSubmit(mockSubmitValues)}>Submit</button>
    </div>
  )
}));

vi.mock('@pages/earnings-call/earnings-call-header-card.component.jsx', () => ({
  default: () => <div>EarningsCallHeaderCard</div>,
  EarningsCallHeaderCardWrapper: () => <div>EarningsCallHeaderCardWrapper</div>
}));

vi.mock('@components/pdf/earnings-call-pdf.component', () => ({
  default: () => <div>EarningsCallPDF</div>
}));

describe('ShareEarningsCallModal', () => {
  const mockTopicGroups = [];
  const mockToast = vi.fn();

  const openModal = () => fireEvent.click(screen.getByText('Share'));

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.mockReturnValue((selector) =>
      selector({ userName: 'Test User', tenantName: 'Test Tenant' })
    );
    useShareCard.mockReturnValue({ mutateAsync: vi.fn(), isSharing: false });
    useTopicGroupsAndSummaries.mockReturnValue({ topicGroups: mockTopicGroups });
  });

  it('renders the component', () => {
    render(<ShareEarningsCallModal buttonStyles={{}} />);
    expect(screen.getByText('Share')).toBeInTheDocument();
  });

  it('renders ShareSummary component with EarningsCallPDF as its pdfDocument', () => {
    render(<ShareEarningsCallModal buttonStyles={{}} />);
    openModal();
    expect(screen.getByText('EarningsCallPDF')).toBeInTheDocument();
  });

  it('renders ShareSummary component with EarningsCallHeaderWrapper as its children', () => {
    render(<ShareEarningsCallModal buttonStyles={{}} />);
    openModal();
    expect(screen.getByText('EarningsCallHeaderCardWrapper')).toBeInTheDocument();
  });

  it('opens the modal when the button is clicked', () => {
    render(<ShareEarningsCallModal buttonStyles={{}} />);
    openModal();
    expect(screen.getByText('Share Summary')).toBeInTheDocument();
  });

  it('shares the meeting with provided values', async () => {
    const mockShareCard = vi.fn().mockResolvedValue();
    useShareCard.mockReturnValue({ mutateAsync: mockShareCard, isSharing: false });
    render(
      <ShareEarningsCallModal
        card={mockCard}
        buttonStyles={{}}
      />
    );
    openModal();
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockShareCard).toHaveBeenCalledWith(
        {
          id: mockCard.id,
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
    const mockShareCard = vi.fn().mockImplementation(mockShareMutation);
    const mockToast = vi.fn();
    useStyledToast.mockReturnValue(mockToast);
    useShareCard.mockReturnValue({ mutateAsync: mockShareCard, isSharing: false });
    render(<ShareEarningsCallModal buttonStyles={{}} />);
    openModal();
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockShareCard).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Successfully shared earnings call',
        status: 'success',
        isClosable: true
      });
    });
  });

  it('handles error on form submission', async () => {
    const mockShareMutation = (_values, { onError }) => Promise.reject('Test Error').catch(onError);
    const mockShareCard = vi.fn().mockImplementation(mockShareMutation);
    const mockToast = vi.fn();
    useStyledToast.mockReturnValue(mockToast);
    useShareCard.mockReturnValue({ mutateAsync: mockShareCard, isSharing: false });
    render(<ShareEarningsCallModal buttonStyles={{}} />);
    openModal();
    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(mockShareCard).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith({
        title: 'Something went wrong while sharing earnings call. Please try again.',
        status: 'error',
        isClosable: true
      });
    });
  });
});
