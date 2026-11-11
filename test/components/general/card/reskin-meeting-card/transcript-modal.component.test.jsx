import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

import { useCopyToClipboard } from '@util/hooks';
import { renderWithProviders } from '@test/test.helpers';
import { useBotAsVTT } from '@services/query-services/bots.query-service';
import TranscriptModal from '@components/general/card/reskin-meeting-card/transcript-modal.component';

vi.mock('@services/query-services/bots.query-service', () => ({
  useBotAsVTT: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useMeetingManagementActions: vi.fn(() => ({
    pauseResume: vi.fn()
  })),
  useCopyToClipboard: vi.fn()
}));

vi.mock('@components/general/modals/styled-modal.component', () => ({
  default: ({ children, title, customHeader, customFooter, modalBodyProps }) => (
    <div>
      <h1>{title}</h1>
      {customHeader}
      {customFooter}
      <div {...modalBodyProps}>{children}</div>
    </div>
  )
}));

vi.mock('@components/meeting/section-header.component', () => ({
  default: ({ headline, meeting }) => (
    <div data-testid='section-header'>
      {headline} and meeting {meeting?.name}
    </div>
  )
}));

vi.mock('@components/meeting/transcripts.component', () => ({
  default: ({ bot, transcriptRef }) => (
    <div
      ref={transcriptRef}
      data-testid='transcripts'
    >
      Bot: {bot}
    </div>
  )
}));

describe('TranscriptModal', () => {
  const disclosureMock = { isOpen: true, onClose: vi.fn() };
  const meetingMock = { id: '123', name: 'Test Meeting' };
  const botMock = 'Test Bot';
  useBotAsVTT.mockReturnValue({ data: 'WEBVTT' });

  it('renders the modal with correct title and content', async () => {
    renderWithProviders(
      <TranscriptModal
        disclosure={disclosureMock}
        meeting={meetingMock}
        bot={botMock}
      />
    );

    // Check modal title
    expect(screen.getByText('Transcript')).toBeInTheDocument();

    // Check custom header
    expect(screen.getByTestId('section-header')).toHaveTextContent(
      'Transcript and meeting Test Meeting'
    );

    // Check Transcripts content
    expect(screen.getByTestId('transcripts')).toHaveTextContent('Bot: Test Bot');
  });

  it('copies vtt to clipboard', async () => {
    const user = userEvent.setup();
    const copyToClipboard = vi.fn();
    useCopyToClipboard.mockReturnValue(copyToClipboard);

    renderWithProviders(
      <TranscriptModal
        disclosure={disclosureMock}
        meeting={meetingMock}
        bot={botMock}
      />
    );

    const copyButton = screen.getByText('Copy Transcript');
    expect(copyButton).toBeInTheDocument();
    await user.click(copyButton);

    expect(copyToClipboard).toHaveBeenCalledWith('WEBVTT');
  });
});
