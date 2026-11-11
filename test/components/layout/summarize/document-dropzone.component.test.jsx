import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';

import { maxFileSizeBytes, createFileValidator } from '@util/helpers';
import DocumentDropzone from '@components/layout/summarize/document-dropzone.component';

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();
const createFile = (name, size, type = 'application/pdf') =>
  new File(['a'.repeat(size)], name, { type });

const MAX_FILE_SIZE_MB = 1;
const validateFile = createFileValidator({ maxSizeMB: MAX_FILE_SIZE_MB });

// Use this to simulate actual file upload behavior
function WrapperComponent({ initialFile = null, onError = () => {} }) {
  const [file, setFile] = useState();

  return (
    <DocumentDropzone
      file={file}
      onFileLoad={(f) => setFile(f)}
      onFileRemove={vi.fn()}
      onError={onError}
      validateFile={validateFile}
      maxFileSize={maxFileSizeBytes(MAX_FILE_SIZE_MB)}
      helperText={{
        heading: 'Drag & drop document files here',
        subtext: 'Upload PDF, CSV, TXT, DOC(X), XLS(X) (Max size: 300MB)'
      }}
      accept={{ 'application/pdf': ['.pdf'] }}
    />
  );
}

describe('DocumentDropzone', () => {
  it('renders upload button and instructions', () => {
    render(
      <DocumentDropzone
        onFileLoad={vi.fn()}
        onError={vi.fn()}
        validateFile={validateFile}
        maxFileSize={maxFileSizeBytes(MAX_FILE_SIZE_MB)}
        helperText={{
          heading: 'Drag & drop document files here',
          subtext: 'Upload PDF, CSV, TXT, DOC(X), XLS(X) (Max size: 300MB)'
        }}
        accept={{ 'application/pdf': ['.pdf'] }}
      />
    );
    expect(screen.getByText(/Drag & drop document files here/i)).toBeInTheDocument();
    const helpText = screen.getByTestId('dropzone-help-text');
    screen.getByText('Upload PDF, CSV, TXT, DOC(X), XLS(X) (Max size: 300MB)', {
      normalizer: normalizeText
    });
  });

  it('calls onFileLoad when a valid file is dropped', async () => {
    const file = createFile('test.pdf', 1000);
    const onFileLoad = vi.fn();
    const onError = vi.fn();
    render(
      <DocumentDropzone
        onFileLoad={onFileLoad}
        onError={onError}
        validateFile={validateFile}
        maxFileSize={maxFileSizeBytes(MAX_FILE_SIZE_MB)}
        helperText={{
          heading: 'Drag & drop document files here',
          subtext: 'Upload PDF, CSV, TXT, DOC(X), XLS(X) (Max size: 300MB)'
        }}
        accept={{ 'application/pdf': ['.pdf'] }}
      />
    );
    const input = screen.getByTestId('dropzone-input');
    await waitFor(() => {
      fireEvent.change(input, {
        target: { files: [file] }
      });
    });
    await waitFor(() => {
      expect(onFileLoad).toHaveBeenCalledWith(file);
      expect(onError).toHaveBeenCalledWith(null); // No error
    });
  });

  it('calls onError when file is too large', async () => {
    const largeFile = createFile('big.pdf', 2 * 1_000_000); // 2MB
    const onFileLoad = vi.fn();
    const onError = vi.fn();
    render(
      <DocumentDropzone
        onFileLoad={onFileLoad}
        onError={onError}
        validateFile={validateFile}
        maxFileSize={maxFileSizeBytes(MAX_FILE_SIZE_MB)}
        accept={{ 'application/pdf': ['.pdf'] }}
      />
    );

    const input = screen.getByTestId('dropzone-input');
    fireEvent.change(input, {
      target: { files: [largeFile] }
    });

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith({
        message: `File size exceeds the maximum limit (${MAX_FILE_SIZE_MB}MB)`,
        code: 'file-too-large'
      });
    });
  });

  it('resets when close button is clicked', async () => {
    const file = createFile('test.pdf', 1000);
    const onError = vi.fn();

    render(<WrapperComponent onError={onError} />);
    const input = screen.getByTestId('dropzone-input');
    fireEvent.change(input, {
      target: { files: [file] }
    });

    await waitFor(() => {
      expect(screen.getByText(/upload complete/i)).toBeInTheDocument();
      expect(screen.getByText(/test\.pdf/i)).toBeInTheDocument();
    });

    // Click the close button to reset
    const closeButton = screen.getByTestId('dropzone-close-button');
    fireEvent.click(closeButton);
    await waitFor(() => {
      expect(screen.queryByText(/upload complete/i)).not.toBeInTheDocument();
    });
  });
});
