import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ShareSummary from '@components/share-summary/share-summary.component';
import { useBreakpoints } from '@util/hooks';
import { usePDF } from '@react-pdf/renderer';
import analyticsService from '@services/analytics.service';

vi.mock('@util/hooks');
vi.mock('@react-pdf/renderer');
vi.mock('@services/analytics.service');

vi.mock('@chakra-ui/react', async (importActual) => ({
  ...(await importActual()),
  Tooltip: ({ children }) => children
}));

vi.mock('@components/share-summary/share-summary-form.component.jsx', () => ({
  default: ({ children, onSubmit, attendees }) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <span>Form Fields</span>
      <div data-testid='attendees-mock'>{JSON.stringify(attendees)}</div>
      {children}
    </form>
  )
}));

vi.mock('@components/share-summary/share-type-radio-group.component.jsx', () => ({
  default: ({ onChange }) => (
    <div>
      <button onClick={() => onChange('web')}>web</button>
      <button onClick={() => onChange('email')}>email</button>
      <button onClick={() => onChange('pdf')}>pdf</button>
    </div>
  )
}));

describe('ShareSummary', () => {
  const mockAttendees = [{ email: 'test@example.com' }];

  const mockDisclosure = { onClose: vi.fn() };
  const mockOnSubmit = vi.fn();
  const mockPdfDocument = {};
  const mockPdfTitle = 'Test PDF';

  beforeEach(() => {
    vi.clearAllMocks();
    useBreakpoints.mockReturnValue({ isMobile: false });
    usePDF.mockReturnValue([{ url: 'test.pdf', loading: false }]);
  });

  it('renders correctly with given props', () => {
    render(
      <ShareSummary
        isSensitive={false}
        disclosure={mockDisclosure}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        pdfDocument={mockPdfDocument}
        pdfTitle={mockPdfTitle}
      >
        <div>Child Content</div>
      </ShareSummary>
    );

    expect(screen.getByText('Child Content')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Send')).toBeInTheDocument();
    expect(screen.getByTestId('attendees-mock')).toHaveTextContent('[]');
  });

  it('passes attendees to ShareSummaryForm', () => {
    render(
      <ShareSummary
        isSensitive={false}
        attendees={mockAttendees}
        disclosure={mockDisclosure}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        pdfDocument={mockPdfDocument}
        pdfTitle={mockPdfTitle}
      >
        <div>Child Content</div>
      </ShareSummary>
    );

    expect(screen.getByTestId('attendees-mock')).toHaveTextContent(JSON.stringify(mockAttendees));
  });

  it('calls disclosure.onClose when Cancel button is clicked', () => {
    render(
      <ShareSummary
        isSensitive={false}
        disclosure={mockDisclosure}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        pdfDocument={mockPdfDocument}
        pdfTitle={mockPdfTitle}
      >
        <div>Child Content</div>
      </ShareSummary>
    );

    fireEvent.click(screen.getByText('Cancel'));
    expect(mockDisclosure.onClose).toHaveBeenCalled();
  });

  it('calls onSubmit with correct values when Send button is clicked', () => {
    render(
      <ShareSummary
        isSensitive={false}
        disclosure={mockDisclosure}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        pdfDocument={mockPdfDocument}
        pdfTitle={mockPdfTitle}
      >
        <div>Child Content</div>
      </ShareSummary>
    );

    fireEvent.click(screen.getByText('Send'));
    expect(mockOnSubmit).toHaveBeenCalledWith({ guest: true });
  });

  it('renders Download button when selectedShareType is pdf', () => {
    render(
      <ShareSummary
        isSensitive={false}
        disclosure={mockDisclosure}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        pdfDocument={mockPdfDocument}
        pdfTitle={mockPdfTitle}
      >
        <div>Child Content</div>
      </ShareSummary>
    );

    fireEvent.click(screen.getByText('pdf'));
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('does not disable Download button when pdf and isSensitive', () => {
    render(
      <ShareSummary
        isSensitive
        disclosure={mockDisclosure}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        pdfDocument={mockPdfDocument}
        pdfTitle={mockPdfTitle}
      >
        <div>Child Content</div>
      </ShareSummary>
    );

    fireEvent.click(screen.getByText('pdf'));
    expect(screen.getByText('Download')).toBeInTheDocument();
    expect(screen.getByText('Download')).not.toBeDisabled();
  });

  it('calls analytics service with expected event when send is clicked', () => {
    render(
      <ShareSummary
        isSensitive={false}
        disclosure={mockDisclosure}
        onSubmit={mockOnSubmit}
        isSubmitting={false}
        pdfDocument={mockPdfDocument}
        pdfTitle={mockPdfTitle}
      >
        <div>Child Content</div>
      </ShareSummary>
    );

    fireEvent.click(screen.getByText('email'));
    fireEvent.click(screen.getByText('Send'));
    expect(analyticsService.trackButtonClick).toHaveBeenCalledWith(
      'Meeting Detail | Share Modal | Email Share',
      {
        shareType: 'email',
        route: window.location.pathname
      }
    );
  });
});
