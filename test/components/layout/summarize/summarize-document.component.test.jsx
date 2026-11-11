import { useState } from 'react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { useRollbar } from '@rollbar/react';

import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import S3Bucket from '@services/s3bucket.service';

import SummarizeDocument from '@components/layout/summarize/summarize-document.component';

// Mocks
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn()
}));

vi.mock('@rollbar/react', () => ({
  useRollbar: vi.fn()
}));

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
        <SummarizeDocument {...props} />
      </BrowserRouter>
    </QueryClientProvider>
  );
};

vi.mock('@components/layout/summarize/document-dropzone.component', () => {
  return {
    default: ({ file, onFileLoad, onError, helperText }) => {
      const handleFileSelect = () => {
        const newFile = new File(['mock content'], 'test.pdf', {
          type: 'application/pdf'
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

describe('SummarizeDocument', () => {
  let mockToast, mockRollbar, mockUploadFile, mockQueueDocumentParsing;

  beforeEach(() => {
    mockToast = vi.fn();
    mockRollbar = { error: vi.fn() };

    useUserStore.mockImplementation((selector) =>
      selector({ user: { id: 'user-123' }, tenant: { id: 'tenant-abc' } })
    );
    useStyledToast.mockReturnValue(mockToast);
    useRollbar.mockReturnValue(mockRollbar);

    mockUploadFile = vi.fn();
    S3Bucket.prototype.uploadFile = mockUploadFile;

    mockQueueDocumentParsing = vi.fn();
    S3Bucket.prototype.queueDocumentParsing = mockQueueDocumentParsing;
  });

  it('renders modal with expected elements', () => {
    renderComponent({ disclosure: mockDisclosure });

    expect(screen.getByText('Summarize a Document')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /summarize/i })).toBeInTheDocument();

    // test document-dropzone rendering
    const dzHelpHeading = screen.getByTestId('helper-text-heading');
    expect(dzHelpHeading).toHaveTextContent('Drag & drop document files here');

    const dzHelpText = screen.getByTestId('helper-text-subtext');
    expect(dzHelpText).toHaveTextContent('Upload PDF, CSV, TXT, DOC(X), XLS(X) (Max size: 300MB)');
  });

  it('calls upload and queue methods on valid submission', async () => {
    renderComponent({ disclosure: mockDisclosure });

    // Simulate file upload
    fireEvent.click(screen.getByTestId('mock-dropzone'));
    await waitFor(() => {
      expect(screen.getByText('test.pdf')).toBeInTheDocument();
    });

    const submitButton = screen.getByTestId('summarize-document-button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockUploadFile).toHaveBeenCalled();
      expect(mockQueueDocumentParsing).toHaveBeenCalled();
    });
  });
});
