import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { useQueryClient } from '@tanstack/react-query';

import {
  useSetDocumentTitle,
  useListRefs,
  useDocumentScrollListener,
  useAvatarUpload
} from '@util/hooks';
import { useUserStore } from '@store/app.store';
import AccountSettingsPage from '@pages/settings/account-settings/account-settings.page';

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useSetDocumentTitle: vi.fn(),
  useListRefs: vi.fn(),
  useDocumentScrollListener: vi.fn(),
  useAvatarUpload: vi.fn()
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useQueryClient: vi.fn()
  };
});

vi.mock('@layouts/columned.layout', () => ({
  default: ({ rightRailContent, children }) => (
    <div>
      <div>{rightRailContent}</div>
      {children}
    </div>
  )
}));

vi.mock('@components/general/avatar-preview/person-preview.component', () => ({
  default: ({ person, enableAvatarUpload, onAvatarUpload, isUploadingAvatar }) => (
    <div data-testid='person-preview'>
      {person.avatar_url}
      {person.name}
      {enableAvatarUpload && (
        <input
          data-testid='avatar-upload-input'
          type='file'
          onChange={onAvatarUpload}
          disabled={isUploadingAvatar}
        />
      )}
    </div>
  )
}));

vi.mock('@pages/settings/account-settings/your-prompt.section', () => ({
  default: () => <div data-testid='your-prompt-section'>YourPromptSection</div>
}));

vi.mock('@pages/settings/account-settings/email-subscriptions.section', () => ({
  default: () => <div data-testid='email-subscriptions-section'>EmailSubscriptionsSection</div>
}));

vi.mock('@pages/settings/account-settings/auto-scheduling.section', () => ({
  default: () => <div data-testid='auto-scheduling-section'>AutoSchedulingSection</div>
}));

vi.mock('@pages/settings/account-settings/timezone.section', () => ({
  default: () => <div data-testid='timezone-section'>TimezoneSection</div>
}));

vi.mock('@util/hooks');

const checkGate = vi.fn();

vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: () => ({ checkGate })
}));

describe('AccountSettingsPage', () => {
  const mockUser = { email: 'test@example.com', id: '123', name: 'Alan Grant' };
  const mockHandleScrollToRef = vi.fn();
  const mockAvatarUpload = {
    isUploading: false,
    handleFileSelect: vi.fn()
  };
  const renderPage = () =>
    render(
      <MemoryRouter>
        <AccountSettingsPage />
      </MemoryRouter>
    );

  beforeEach(() => {
    vi.resetAllMocks();
    checkGate.mockReturnValue(true);
    useUserStore.mockReturnValue(() => ({ user: mockUser }));
    useSetDocumentTitle.mockImplementation(() => {});
    useListRefs.mockReturnValue({
      refs: { current: [null, null, null] },
      handleScrollToRef: mockHandleScrollToRef,
      getClosestRefIndex: vi.fn()
    });
    useDocumentScrollListener.mockImplementation(() => {});
    useAvatarUpload.mockReturnValue(mockAvatarUpload);
    useQueryClient.mockReturnValue({});
  });

  it('renders without crashing', () => {
    renderPage();
    expect(screen.getByText('Profile Settings')).toBeInTheDocument();
  });

  it('sets the document title', () => {
    renderPage();
    expect(useSetDocumentTitle).toHaveBeenCalledWith('Profile Settings');
  });

  it('renders the "Contents" section with items matching the sections', () => {
    renderPage();
    expect(screen.getByText('Contents')).toBeInTheDocument();
    expect(screen.queryAllByText('Your Prompt').length).toEqual(2);
    expect(screen.queryAllByText('Email Subscriptions').length).toEqual(2);
    expect(screen.queryAllByText('Auto Scheduling').length).toEqual(2);
    expect(screen.queryAllByText('Timezone').length).toEqual(2);
  });

  it("renders user's profile in the header", () => {
    useUserStore.mockReturnValueOnce(mockUser);
    renderPage();
    const personPreview = screen.getByTestId('person-preview');
    expect(personPreview).toBeInTheDocument();
    expect(personPreview).toHaveTextContent(mockUser.name);
  });

  it('renders the "View Your Profile" button with correct link', () => {
    useUserStore.mockReturnValueOnce(mockUser);
    renderPage();
    const linkButton = screen.getByRole('link', { name: /view your profile/i });
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('href', `/person?email=${mockUser.email}&id=${mockUser.id}`);
  });

  it('renders all sections', () => {
    renderPage();
    expect(screen.getByTestId('Your Prompt-section')).toBeInTheDocument();
    expect(screen.getByTestId('Email Subscriptions-section')).toBeInTheDocument();
    expect(screen.getByTestId('Timezone-section')).toBeInTheDocument();
    expect(screen.getByTestId('auto-scheduling-section')).toBeInTheDocument();
  });

  it('does not render auto scheduling section if user-auto-scheduling ff is off', () => {
    checkGate.mockReturnValue(false);
    renderPage();
    expect(screen.queryByTestId('auto-scheduling-section')).not.toBeInTheDocument();
  });

  it('handles Table of Contents item click', () => {
    renderPage();
    const tocButton = screen.getByRole('button', { name: 'Auto Scheduling' });
    fireEvent.click(tocButton);
    expect(mockHandleScrollToRef).toHaveBeenCalledWith(2);
  });

  it('renders avatar upload functionality when enabled', () => {
    useUserStore.mockReturnValueOnce(mockUser);
    renderPage();

    const avatarUploadInput = screen.getByTestId('avatar-upload-input');
    expect(avatarUploadInput).toBeInTheDocument();
    expect(avatarUploadInput).toHaveAttribute('type', 'file');
  });

  it('calls useAvatarUpload hook with queryClient', () => {
    renderPage();
    expect(useAvatarUpload).toHaveBeenCalledWith({});
  });

  it('passes avatar upload props to PersonPreview component', () => {
    useUserStore.mockReturnValueOnce(mockUser);
    renderPage();

    const personPreview = screen.getByTestId('person-preview');
    expect(personPreview).toBeInTheDocument();

    const avatarUploadInput = screen.getByTestId('avatar-upload-input');
    expect(avatarUploadInput).not.toBeDisabled();
  });

  it('disables avatar upload input when uploading', () => {
    const uploadingMock = { ...mockAvatarUpload, isUploading: true };
    useAvatarUpload.mockReturnValue(uploadingMock);
    useUserStore.mockReturnValueOnce(mockUser);

    renderPage();

    const avatarUploadInput = screen.getByTestId('avatar-upload-input');
    expect(avatarUploadInput).toBeDisabled();
  });

  it('triggers file selection when avatar upload input changes', () => {
    useUserStore.mockReturnValueOnce(mockUser);
    renderPage();

    const avatarUploadInput = screen.getByTestId('avatar-upload-input');
    const mockFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

    fireEvent.change(avatarUploadInput, { target: { files: [mockFile] } });

    expect(mockAvatarUpload.handleFileSelect).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          files: [mockFile]
        })
      })
    );
  });
});
