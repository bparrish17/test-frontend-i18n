import { useState } from 'react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useRollbar } from '@rollbar/react';
import { format, addMinutes } from 'date-fns';

import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import S3Bucket from '@services/s3bucket.service';
import { useInitiativeOptions } from '@services/query-services/initiatives.query-service';
import { usePostConvertFromVideo } from '@services/query-services/lambda.query-service';

import SummarizeAudioVideo from '@components/layout/summarize/summarize-audio-video.component';

// Mocks
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useBreakpointValue: vi.fn(() => 'bottom-start'),
  useStyledToast: vi.fn()
}));

vi.mock('@services/query-services/lambda.query-service');
vi.mock('@services/query-services/initiatives.query-service');

vi.mock('@components/general/reskin-calendar.component', () => ({
  default: () => <div data-testid='reskin-calendar'>Calendar</div>
}));

vi.mock('@components/general/form/step-with-label.component', () => ({
  default: ({ children }) => <div data-testid='step-with-label'>{children}</div>
}));

vi.mock('@components/general/form/custom-select.component', () => ({
  default: ({ value, onChange }) => (
    <input
      data-testid='custom-select'
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}));

vi.mock('@components/layout/summarize/document-dropzone.component', () => {
  return {
    default: ({ file, onFileLoad, onError, helperText }) => {
      const handleFileSelect = () => {
        const newFile = new File(['mock content'], 'test.mp4', {
          type: 'video/mp4'
        });
        onFileLoad(newFile); // mimic form update
      };

      return (
        <div>
          {file && <p>{file?.name}</p>}
          <span data-testid='helper-text-heading'>{helperText.heading}</span>
          <span data-testid='helper-text-subtext'>{helperText.subtext}</span>
          <button
            data-testid='mock-dropzone'
            onClick={handleFileSelect}
          >
            Mock Upload
          </button>
          <button onClick={() => onError?.({ message: 'Invalid file' })}>Trigger Error</button>
        </div>
      );
    }
  };
});

// Mock Disclosure object
const mockDisclosure = {
  isOpen: true,
  onClose: vi.fn()
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false
    }
  }
});

const renderComponent = (props = {}) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SummarizeAudioVideo {...props} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('SummarizeAudioVideo', () => {
  let mockToast, mockRollbar, mockUploadFile, mockConvertVideoToMeeting;

  beforeEach(() => {
    mockToast = vi.fn();

    useUserStore.mockImplementation((selector) =>
      selector({
        user: { id: 'user-123' },
        tenant: { id: 'tenant-abc' },
        getSessionId: vi.fn(() => 'session-1')
      })
    );
    useStyledToast.mockReturnValue(mockToast);

    mockUploadFile = vi.fn();
    S3Bucket.prototype.uploadFile = mockUploadFile;

    mockConvertVideoToMeeting = vi.fn();
    mockConvertVideoToMeeting.mockResolvedValue({});
    usePostConvertFromVideo.mockReturnValue({
      mutateAsync: mockConvertVideoToMeeting
    });

    useInitiativeOptions.mockReturnValue({
      data: [{ name: 'Initiative 1', value: '12345' }]
    });
  });

  it('renders modal with expected elements', () => {
    renderComponent({ disclosure: mockDisclosure });

    expect(screen.getByText('Summarize Meeting Audio or Video')).toBeInTheDocument();
    expect(screen.getByTestId('upload-file-tab')).toBeInTheDocument();
    expect(screen.getByTestId('add-link-tab')).toBeInTheDocument();
    expect(screen.getByTestId('link-input')).toBeInTheDocument();
    expect(screen.getByTestId('document-tab-panel')).toBeInTheDocument();
    expect(screen.getByTestId('link-tab-panel')).toBeInTheDocument();
    expect(screen.getByTestId('reskin-calendar')).toBeInTheDocument();
    expect(screen.getByTestId('meeting-time-input')).toBeInTheDocument();
    expect(screen.getByTestId('meeting-title-input')).toBeInTheDocument();
    expect(screen.getByTestId('custom-select')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: /summarize/i })).toBeInTheDocument();

    // test document-dropzone rendering
    const dzHelpHeading = screen.getByTestId('helper-text-heading');
    expect(dzHelpHeading).toHaveTextContent('Drag & drop audio or video files here');

    const dzHelpText = screen.getByTestId('helper-text-subtext');
    expect(dzHelpText).toHaveTextContent('Upload MP3 or MP4 (Max size: 2GB)');
  });

  it('shows error if no file or link is uploaded on submit', async () => {
    renderComponent({ disclosure: mockDisclosure });

    // Set other fields first, the step-with-label component handles invalidations
    // within these fields, so not concerned with testing these here, however, these
    // must be set in order for onSubmit to be called
    fireEvent.change(screen.getByTestId('meeting-time-input'), { target: { value: '12:30' } });
    fireEvent.change(screen.getByTestId('meeting-title-input'), { target: { value: 'Title' } });
    fireEvent.change(screen.getByTestId('custom-select'), { target: { value: 'Initiative 1' } });

    const submitButton = screen.getByTestId('summarize-meeting-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Add a file or link/i)).toBeInTheDocument();
    });
  });

  describe('start time validation', () => {
    const fixedNow = Date.now();

    beforeEach(() => {
      vi.useFakeTimers({ toFake: ['Date'] });
      vi.setSystemTime(fixedNow);
    });

    afterEach(() => {
      vi.useRealTimers(); // Reset to real timers after each test
    });

    it('shows error if invalid time provided to onsubmit', async () => {
      renderComponent({ disclosure: mockDisclosure });

      // Step 3: Format as "HH:mm"
      const timeString = format(addMinutes(fixedNow, 5), 'HH:mm');
      // This should set the timeString to 5 minutes in the future, making the form invalid
      fireEvent.change(screen.getByTestId('meeting-time-input'), { target: { value: timeString } });
      fireEvent.change(screen.getByTestId('meeting-title-input'), { target: { value: 'Title' } });
      fireEvent.change(screen.getByTestId('custom-select'), { target: { value: 'Initiative 1' } });

      // Simulate file upload
      fireEvent.click(screen.getByTestId('mock-dropzone'));

      await waitFor(() => {
        expect(screen.getByText('test.mp4')).toBeInTheDocument();
      });

      const submitButton = screen.getByTestId('summarize-meeting-button');
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockUploadFile).not.toHaveBeenCalled();
        expect(mockConvertVideoToMeeting).not.toHaveBeenCalled();
      });
    });
  });

  it('calls upload and queue methods on valid submission', async () => {
    renderComponent({ disclosure: mockDisclosure });

    fireEvent.change(screen.getByTestId('meeting-time-input'), { target: { value: '12:30' } });
    fireEvent.change(screen.getByTestId('meeting-title-input'), { target: { value: 'Title' } });
    fireEvent.change(screen.getByTestId('custom-select'), { target: { value: 'Initiative 1' } });

    // Simulate file upload
    fireEvent.click(screen.getByTestId('mock-dropzone'));
    await waitFor(() => {
      expect(screen.getByText('test.mp4')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('summarize-meeting-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalled();
      expect(mockConvertVideoToMeeting).toHaveBeenCalled({
        session_id: 'session-1',
        name: 'Title',
        start_at: expect.any(String),
        end_at: expect.any(String),
        is_public_url: false,
        tenant_id: 'tenant-abc',
        creator_id: 'user-123',
        initiative_id: undefined,
        file_location: 'tenant-abc/test.mp4'
      }),
        expect.any(Object),
        expect.any(Object);
    });
  });

  it('calls upload and queue methods on valid link submission', async () => {
    renderComponent({ disclosure: mockDisclosure });

    fireEvent.change(screen.getByTestId('link-input'), { target: { value: 'https://test.com' } });
    fireEvent.change(screen.getByTestId('meeting-time-input'), { target: { value: '12:30' } });
    fireEvent.change(screen.getByTestId('meeting-title-input'), { target: { value: 'Title' } });
    fireEvent.change(screen.getByTestId('custom-select'), { target: { value: 'Initiative 1' } });

    const submitButton = screen.getByTestId('summarize-meeting-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUploadFile).not.toHaveBeenCalled();
      expect(mockConvertVideoToMeeting).toHaveBeenCalled({
        session_id: 'session-1',
        name: 'Title',
        start_at: expect.any(String),
        end_at: expect.any(String),
        is_public_url: true,
        tenant_id: 'tenant-abc',
        creator_id: 'user-123',
        initiative_id: undefined,
        file_location: 'https://test.com'
      }),
        expect.any(Object),
        expect.any(Object);
    });
  });
});
