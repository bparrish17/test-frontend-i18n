import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import PersonPreview from '@components/general/avatar-preview/person-preview.component';
import { useUserStore } from '@store/app.store';

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@components/general/avatar-preview/avatar-preview.component', () => ({
  default: ({
    enableAvatarUpload,
    onAvatarUpload,
    isUploadingAvatar,
    photoUrl,
    name,
    ...props
  }) => (
    <div data-testid='avatar-preview'>
      <div data-testid='avatar-photo-url'>{photoUrl}</div>
      <div data-testid='avatar-name'>{name}</div>
      <div data-testid='avatar-upload-enabled'>{enableAvatarUpload ? 'true' : 'false'}</div>
      <div data-testid='avatar-uploading'>{isUploadingAvatar ? 'true' : 'false'}</div>
      {enableAvatarUpload && (
        <button
          data-testid='avatar-upload-trigger'
          onClick={() => onAvatarUpload?.({ target: { files: [new File([], 'test.jpg')] } })}
        >
          Upload Avatar
        </button>
      )}
    </div>
  )
}));

describe('PersonPreview', () => {
  const mockPerson = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar_url: 'https://example.com/avatar.jpg',
    title: 'Software Engineer',
    organizationName: 'Acme Corp'
  };

  const mockUser = {
    email: 'test@example.com',
    isGuest: false
  };

  beforeEach(() => {
    vi.resetAllMocks();
    useUserStore.mockReturnValue(mockUser);
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      person: mockPerson,
      ...props
    };

    return render(
      <MemoryRouter>
        <PersonPreview {...defaultProps} />
      </MemoryRouter>
    );
  };

  it('renders person information correctly', () => {
    renderComponent();

    expect(screen.getByTestId('avatar-name')).toHaveTextContent('John Doe');
    expect(screen.getByTestId('avatar-photo-url')).toHaveTextContent(
      'https://example.com/avatar.jpg'
    );
  });

  it('uses photo_url when both photo_url and avatar_url are present', () => {
    const personWithBothUrls = {
      ...mockPerson,
      photo_url: 'https://example.com/photo.jpg',
      avatar_url: 'https://example.com/avatar.jpg'
    };

    renderComponent({ person: personWithBothUrls });

    expect(screen.getByTestId('avatar-photo-url')).toHaveTextContent(
      'https://example.com/photo.jpg'
    );
  });

  it('does not enable avatar upload by default', () => {
    renderComponent();

    expect(screen.getByTestId('avatar-upload-enabled')).toHaveTextContent('false');
    expect(screen.queryByTestId('avatar-upload-trigger')).not.toBeInTheDocument();
  });

  it('enables avatar upload when enableAvatarUpload is true', () => {
    const mockOnAvatarUpload = vi.fn();

    renderComponent({
      enableAvatarUpload: true,
      onAvatarUpload: mockOnAvatarUpload
    });

    expect(screen.getByTestId('avatar-upload-enabled')).toHaveTextContent('true');
    expect(screen.getByTestId('avatar-upload-trigger')).toBeInTheDocument();
  });

  it('passes uploading state correctly', () => {
    renderComponent({
      enableAvatarUpload: true,
      isUploadingAvatar: true
    });

    expect(screen.getByTestId('avatar-uploading')).toHaveTextContent('true');
  });

  it('calls onAvatarUpload when avatar upload is triggered', () => {
    const mockOnAvatarUpload = vi.fn();

    renderComponent({
      enableAvatarUpload: true,
      onAvatarUpload: mockOnAvatarUpload
    });

    const uploadButton = screen.getByTestId('avatar-upload-trigger');
    uploadButton.click();

    expect(mockOnAvatarUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: expect.arrayContaining([expect.any(File)])
        })
      })
    );
  });

  it('passes all avatar upload props to AvatarPreview component', () => {
    const mockOnAvatarUpload = vi.fn();

    renderComponent({
      enableAvatarUpload: true,
      onAvatarUpload: mockOnAvatarUpload,
      isUploadingAvatar: true
    });

    expect(screen.getByTestId('avatar-upload-enabled')).toHaveTextContent('true');
    expect(screen.getByTestId('avatar-uploading')).toHaveTextContent('true');
    expect(screen.getByTestId('avatar-upload-trigger')).toBeInTheDocument();
  });
});
