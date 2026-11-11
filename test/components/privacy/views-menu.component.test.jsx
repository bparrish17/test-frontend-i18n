import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';
import ViewsMenu from '@components/privacy/views-menu.component';
import { useMeetingViews, useMeetingById } from '@services/query-services/meetings.query-service';

// Mock hooks
vi.mock('@services/query-services/meetings.query-service', () => ({
  useMeetingViews: vi.fn(),
  useMeetingById: vi.fn()
}));

// Mock child components
vi.mock('@components/privacy/views-menu-list.component', () => ({
  default: () => <div data-testid='views-menu-list'></div>
}));

vi.mock('@components/privacy/views-menu-button.component', () => ({
  default: ({ disclosure, isLoading }) => (
    <button
      data-testid='views-menu-button'
      onClick={disclosure.onOpen}
      disabled={isLoading}
    >
      Button
    </button>
  )
}));

describe('ViewsMenu', () => {
  const mockMeeting = { id: 1, sensitive: true, bot_attendee: true };

  beforeEach(() => {
    const mockViews = [
      {
        id: 'zack@fora.day',
        name: 'Zack Elias',
        avatar_url:
          'https://lh3.google.com/ao/AHP4FtkloTguZHutZlebR1y5dXkjYpb-ouBXuVq_LGigG1UKcyzYrYBntImoSe1E6og_Vi8c=s96-c',
        count: 4,
        created_at: 1734708575015
      },
      {
        id: 'vinnie@fora.day',
        name: 'Vinnie Vendemia',
        avatar_url:
          'https://lh3.googleusercontent.com/a/ACg8ocLKIfZNxrfZq05I7i3vFlZedJNgt4ZJsp5CM1gt48x3Ct_nIaM=s96-c',
        count: 2,
        created_at: 1734709328350
      },
      {
        id: 'test@fora.day',
        name: 'Jeff Lebowski',
        count: 2,
        created_at: 1
      },
      {
        id: 'test2@fora.day',
        count: 2,
        name: 'The Dude',
        created_at: 2
      }
    ];
    vi.mocked(useMeetingViews).mockReturnValue({
      data: mockViews,
      isLoading: false
    });
    vi.mocked(useMeetingById).mockReturnValue(mockMeeting);
  });

  it('renders ViewsMenuButton, ViewsMenuList', () => {
    render(<ViewsMenu meeting={mockMeeting} />);

    expect(screen.getByTestId('views-menu-button')).toBeInTheDocument();
    expect(screen.getByTestId('views-menu-list')).toBeInTheDocument();

    expect(useMeetingViews).toHaveBeenCalled();
    expect(useMeetingById).toHaveBeenCalled();
  });
});
