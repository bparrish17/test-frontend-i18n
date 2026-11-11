import { forwardRef } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, vi, expect } from 'vitest';
import AvatarPreview from '@components/general/avatar-preview/avatar-preview.component';

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Avatar: ({ src, onClick, cursor, opacity, _hover, ...props }) => (
      <div
        data-testid='avatar'
        data-src={src}
        data-cursor={cursor}
        data-opacity={opacity}
        data-hover-opacity={_hover?.opacity}
        onClick={onClick}
        {...props}
      />
    ),
    Input: forwardRef(({ type, accept, display, onChange, ...props }, ref) => (
      <input
        data-testid='file-input'
        type={type}
        accept={accept}
        style={{ display }}
        onChange={onChange}
        ref={ref}
        {...props}
      />
    ))
  };
});

describe('AvatarPreview - Avatar Upload Functionality', () => {
  const defaultProps = {
    name: 'John Doe',
    photoUrl: 'https://example.com/avatar.jpg'
  };

  it('renders avatar without upload functionality by default', () => {
    render(<AvatarPreview {...defaultProps} />);

    const avatar = screen.getByTestId('avatar');
    expect(avatar).toHaveAttribute('data-cursor', 'default');
    expect(screen.queryByTestId('file-input')).not.toBeInTheDocument();
    expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
  });

  it('enables avatar upload functionality when enableAvatarUpload is true', () => {
    render(
      <AvatarPreview
        {...defaultProps}
        enableAvatarUpload={true}
        onAvatarUpload={vi.fn()}
      />
    );

    const avatar = screen.getByTestId('avatar');
    const fileInput = screen.getByTestId('file-input');

    expect(avatar).toHaveAttribute('data-cursor', 'pointer');
    expect(fileInput).toBeInTheDocument();
    expect(fileInput).toHaveAttribute('type', 'file');
    expect(fileInput).toHaveAttribute('accept', 'image/*');
    expect(fileInput).toHaveStyle({ display: 'none' });

    expect(screen.getByTestId('edit-icon')).toBeInTheDocument();
    expect(screen.queryByTestId('uploading-spinner')).not.toBeInTheDocument();
  });

  it('applies uploading state styling when isUploadingAvatar is true', () => {
    render(
      <AvatarPreview
        {...defaultProps}
        enableAvatarUpload={true}
        onAvatarUpload={vi.fn()}
        isUploadingAvatar={true}
      />
    );

    expect(screen.queryByTestId('uploading-spinner')).toBeInTheDocument();
    expect(screen.queryByTestId('edit-icon')).not.toBeInTheDocument();
  });

  it('calls file input click when avatar is clicked (handleAvatarClick)', () => {
    // mock .click on all input elements
    const mockClick = vi.fn();
    Object.defineProperty(HTMLInputElement.prototype, 'click', {
      value: mockClick,
      writable: true
    });

    render(
      <AvatarPreview
        {...defaultProps}
        enableAvatarUpload
      />
    );

    // get the avatar
    const avatar = screen.getByTestId('avatar');

    // click it
    fireEvent.click(avatar);

    // assert input.click was triggered
    expect(mockClick).toHaveBeenCalled();
  });

  it('calls onAvatarUpload when file input changes', () => {
    const mockOnAvatarUpload = vi.fn();

    render(
      <AvatarPreview
        {...defaultProps}
        enableAvatarUpload={true}
        onAvatarUpload={mockOnAvatarUpload}
      />
    );

    const fileInput = screen.getByTestId('file-input');
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    expect(mockOnAvatarUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: [mockFile]
        })
      })
    );
  });

  it('does not render file input when enableAvatarUpload is false', () => {
    render(
      <AvatarPreview
        {...defaultProps}
        enableAvatarUpload={false}
        onAvatarUpload={vi.fn()}
      />
    );

    expect(screen.queryByTestId('file-input')).not.toBeInTheDocument();
  });
});
