import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import PrivacyMenu from '@components/privacy/privacy-menu.component';
import { useGetAccessStats, useMeetingById } from '@services/query-services/meetings.query-service';
import { useUserStore } from '@store/app.store';

// Mock hooks
vi.mock('@services/query-services/meetings.query-service', () => ({
  useGetAccessStats: vi.fn(),
  useMeetingById: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useManageMeetingSensitivity: vi.fn(),
  useManageMeetingShares: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

// Mock child components
vi.mock('@components/privacy/privacy-menu-list.component', () => ({
  default: () => <div data-testid='privacy-menu-list'></div>
}));

vi.mock('@components/privacy/privacy-menu-button.component', () => ({
  default: ({ disclosure, isLoading }) => (
    <button
      data-testid='privacy-menu-button'
      onClick={disclosure.onOpen}
      disabled={isLoading}
    >
      Button
    </button>
  )
}));

vi.mock('@components/privacy/confirm-access-modal.component', () => ({
  default: () => <div data-testid='confirm-access-modal'></div>
}));

describe('PrivacyMenu', () => {
  const mockMeeting = {
    id: 1,
    sensitive: true,
    nylas: { participants: [{ email: 'keanu@fora.day' }] }
  };

  beforeEach(() => {
    const mockAccessStats = { num_of_participants: 10 };
    vi.mocked(useGetAccessStats).mockReturnValue({
      data: mockAccessStats,
      isLoading: false
    });

    vi.mocked(useMeetingById).mockReturnValue({
      data: mockMeeting,
      isLoading: false
    });

    vi.mocked(useUserStore).mockReturnValue({
      user: { email: 'keanu@fora.day', type: 'Full' }
    });
  });

  it('renders PrivacyMenuButton, PrivacyMenuList, and ConfirmAccessModal', () => {
    render(<PrivacyMenu meeting={mockMeeting} />);

    expect(screen.getByTestId('privacy-menu-button')).toBeInTheDocument();
    expect(screen.getByTestId('privacy-menu-list')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-access-modal')).toBeInTheDocument();
  });
});
