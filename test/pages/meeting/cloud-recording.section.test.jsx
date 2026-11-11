import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import CloudRecordingSection from '@pages/meeting/cloud-recording.section';

import { useUserStore } from '@store/app.store';
import { useMeetingTimeStatus, useStyledToast } from '@util/hooks';
import { extractZoomMeetingId, zoomHelpText } from '@util/helpers';
import {
  useZoomMeetingRecordingStatus,
  usePostZoomDownloadMeetingRecording
} from '@services/query-services/lambda.query-service';

const checkGate = vi.fn();
vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: () => ({
    checkGate
  })
}));

vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    useToast: () => vi.fn()
  };
});

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

// Mocks for store + helpers + hooks
vi.mock('@store/app.store');
vi.mock('@util/hooks');
vi.mock('@services/query-services/lambda.query-service');
vi.mock('@util/helpers', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    extractZoomMeetingId: vi.fn(),
    zoomHelpText: vi.fn()
  };
});

describe('CloudRecordingSection', () => {
  const mockMeeting = {
    id: 'abc-123',
    url: 'https://zoom.us/j/1234567890?pwd=secret'
  };

  const mockUser = { id: 'user-1', name: 'Test User' };

  beforeEach(() => {
    vi.clearAllMocks();

    useUserStore.mockImplementation((fn) =>
      fn({ tenant: { recall_config: { zoom_oauth_credential_id: 'zoom-id' } }, user: mockUser })
    );

    extractZoomMeetingId.mockReturnValue('1234567890');
    useMeetingTimeStatus.mockReturnValue('done');
    zoomHelpText.mockReturnValue({
      header: 'Summarize This Meeting',
      subtext: 'This meeting has a Zoom Cloud Recording available. Summarize it now.'
    });

    useZoomMeetingRecordingStatus.mockReturnValue({
      data: { code: 200 },
      isLoading: false
    });

    usePostZoomDownloadMeetingRecording.mockReturnValue({
      mutateAsync: vi.fn().mockResolvedValue({})
    });

    useStyledToast.mockReturnValue(vi.fn());

    checkGate.mockReturnValue(true);
  });

  it('should not render if bot is present', () => {
    render(
      <CloudRecordingSection
        meeting={mockMeeting}
        bot={true}
      />,
      { wrapper }
    );
    expect(screen.queryByText(/Summarize This Meeting/i)).not.toBeInTheDocument();
    expect(useZoomMeetingRecordingStatus).toHaveBeenCalledWith(
      'zoom-id',
      '1234567890',
      mockMeeting?.id,
      false
    );
  });

  it('should not render if enableCloudRecording is false', () => {
    checkGate.mockReturnValue(false);

    // No bot, but behind feature flag
    render(
      <CloudRecordingSection
        meeting={mockMeeting}
        bot={undefined}
      />,
      { wrapper }
    );
    expect(screen.queryByText(/Summarize This Meeting/i)).not.toBeInTheDocument();
    expect(useZoomMeetingRecordingStatus).toHaveBeenCalledWith(
      'zoom-id',
      '1234567890',
      mockMeeting?.id,
      false
    );
  });

  it('should not render if not a zoom meeting', () => {
    // No bot, FF is good, but not a zoom meeting
    extractZoomMeetingId.mockReturnValue(null);

    render(
      <CloudRecordingSection
        meeting={{
          id: 'abc-123',
          url: 'https://meet.google.com/1234567890'
        }}
        bot={undefined}
      />,
      { wrapper }
    );
    expect(screen.queryByText(/Summarize This Meeting/i)).not.toBeInTheDocument();
    expect(useZoomMeetingRecordingStatus).toHaveBeenCalledWith('zoom-id', null, 'abc-123', false);
  });

  it('should not render if meeting is upcoming', () => {
    // No bot, FF is good, is a zoom meeting, but meeting is upcoming
    useMeetingTimeStatus.mockReturnValue('upcoming');

    render(
      <CloudRecordingSection
        meeting={mockMeeting}
        bot={undefined}
      />,
      { wrapper }
    );
    expect(screen.queryByText(/Summarize This Meeting/i)).not.toBeInTheDocument();
    expect(useZoomMeetingRecordingStatus).toHaveBeenCalledWith(
      'zoom-id',
      '1234567890',
      mockMeeting?.id,
      false
    );
  });

  it('should not render if meeting is live', () => {
    // No bot, FF is good, is a zoom meeting, but meeting is live
    useMeetingTimeStatus.mockReturnValue('live');

    render(
      <CloudRecordingSection
        meeting={mockMeeting}
        bot={undefined}
      />,
      { wrapper }
    );
    expect(screen.queryByText(/Summarize This Meeting/i)).not.toBeInTheDocument();
    expect(useZoomMeetingRecordingStatus).toHaveBeenCalledWith(
      'zoom-id',
      '1234567890',
      mockMeeting?.id,
      false
    );
  });

  it('should render helper text and button when requirements are met', () => {
    render(
      <CloudRecordingSection
        meeting={mockMeeting}
        bot={undefined}
      />,
      { wrapper }
    );

    expect(screen.getByText('Summarize This Meeting')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Summarize Now' })).toBeInTheDocument();
    expect(useZoomMeetingRecordingStatus).toHaveBeenCalledWith(
      'zoom-id',
      '1234567890',
      mockMeeting?.id,
      true
    );
  });

  it('should disable the button if recording status is invalid', () => {
    useZoomMeetingRecordingStatus.mockReturnValue({});

    render(
      <CloudRecordingSection
        meeting={mockMeeting}
        bot={false}
      />,
      { wrapper }
    );

    const button = screen.getByRole('button', { name: 'Summarize Now' });
    expect(button).toBeDisabled();
  });

  it('calls downloadMeetingRecording and shows toast on click', async () => {
    const mutateAsync = vi.fn().mockResolvedValue({});
    const toast = vi.fn();

    usePostZoomDownloadMeetingRecording.mockReturnValue({
      mutateAsync
    });

    useStyledToast.mockReturnValue(toast);

    render(
      <CloudRecordingSection
        meeting={mockMeeting}
        bot={false}
      />,
      { wrapper }
    );

    const button = screen.getByRole('button', { name: 'Summarize Now' });

    fireEvent.click(button);

    await waitFor(() => {
      expect(mutateAsync).toHaveBeenCalledWith(
        {
          meeting_id: '1234567890',
          person: mockUser,
          fora_meeting: mockMeeting
        },
        expect.any(Object)
      );
    });
  });
});
