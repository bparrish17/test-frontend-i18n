import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Suspense } from 'react';

import MeetingPageRightRail from '@pages/meeting/right-rail.component';
import { useUserStore } from '@store/app.store';
import { useMeetingManagementActions } from '@util/hooks';

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@util/helpers', async (importOriginal) => ({
  ...(await importOriginal()),
  getSpeakerTimesMap: () => new Map()
}));

vi.mock('@util/hooks', () => ({
  useMeetingManagementActions: vi.fn()
}));

// Setup mocks for the sub-components, those should have their own tests
vi.mock('@components/meeting/meeting-chat.component', () => ({
  default: () => <div data-testid='chat-component'>Chat Component</div>
}));

vi.mock('@pages/meeting/video-thumbnail.component', () => ({
  default: () => <div data-testid='video-thumbnail'>Video Thumbnail</div>
}));

vi.mock('@components/general/reskin-people-stack.component', () => ({
  default: () => <div data-testid='reskin-people-stack'>People Stack</div>
}));

vi.mock('@components/general/reskin-organization-stack.component', () => ({
  default: () => <div data-testid='reskin-organization-stack'>Organization Stack</div>
}));

vi.mock('@pages/meeting/section-navigation.component', () => ({
  default: () => <div data-testid='section-navigation'>Section Navigation</div>
}));

vi.mock('@components/general/fora-banner.component', () => ({
  default: () => <div data-testid='fora-banner'>Fora Banner</div>
}));

describe('MeetingPageRightRail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the component with default props', () => {
    useUserStore.mockReturnValue({ isGuest: false });
    useMeetingManagementActions.mockReturnValue({ showViewVideoButton: false });

    render(
      <MemoryRouter>
        <MeetingPageRightRail
          sections={[]}
          attendees={null}
          organizations={null}
          meeting={{}}
          bot={{}}
          thumbnailQueryResult={{}}
          askEnabled={true}
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.getByRole('radiogroup')).toBeInTheDocument();

    // Either there must be an active section, or the showViewVideoButton must be true
    // for this stack to render
    expect(screen.queryByTestId('overview-stack')).not.toBeInTheDocument();
  });

  it('shows video thumbnail when showViewVideoButton is true', () => {
    useUserStore.mockReturnValue({ isGuest: false });
    useMeetingManagementActions.mockReturnValue({ showViewVideoButton: true });

    render(
      <MemoryRouter>
        <MeetingPageRightRail
          sections={[]}
          attendees={null}
          organizations={null}
          meeting={{}}
          bot={{}}
          thumbnailQueryResult={{}}
          askEnabled={true}
          isLoading={false}
        />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('overview-stack')).toBeInTheDocument();
    expect(screen.getByTestId('video-thumbnail')).toBeInTheDocument();
  });

  it('shows section navigation when sections are enabled', () => {
    useUserStore.mockReturnValue({ isGuest: false });
    useMeetingManagementActions.mockReturnValue({ showViewVideoButton: false });

    render(
      <MeetingPageRightRail
        sections={[
          {
            enabled: true,
            name: `Your Summary`,
            order: 0
          }
        ]}
        attendees={null}
        organizations={null}
        meeting={{}}
        bot={{}}
        thumbnailQueryResult={{}}
        askEnabled={true}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('overview-stack')).toBeInTheDocument();
    expect(screen.getByTestId('section-navigation')).toBeInTheDocument();
  });

  it('shows ReskinPeopleStack when attendees are present', () => {
    useUserStore.mockReturnValue({ isGuest: false });

    render(
      <MeetingPageRightRail
        sections={[]}
        attendees={[{ email: 'user@example.com' }]}
        organizations={null}
        meeting={{}}
        bot={{}}
        thumbnailQueryResult={{}}
        askEnabled={true}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('reskin-people-stack')).toBeInTheDocument();
  });

  it('shows ReskinOrganizationStack when organizations are present', () => {
    useUserStore.mockReturnValue({ isGuest: false });

    render(
      <MeetingPageRightRail
        sections={[]}
        attendees={null}
        organizations={[{ name: 'Test Org' }]}
        meeting={{}}
        bot={{}}
        thumbnailQueryResult={{}}
        askEnabled={true}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('reskin-organization-stack')).toBeInTheDocument();
  });

  it('shows ForaBanner when the user is a guest', () => {
    useUserStore.mockReturnValue({ isGuest: true });

    render(
      <MeetingPageRightRail
        sections={[]}
        attendees={null}
        organizations={null}
        meeting={{}}
        bot={{}}
        thumbnailQueryResult={{}}
        askEnabled={true}
        isLoading={false}
      />
    );

    expect(screen.getByTestId('fora-banner')).toBeInTheDocument();
  });

  it('renders the Chat component for non-guest users when askEnabled is true and not loading', async () => {
    useUserStore.mockReturnValue({ isGuest: false });

    render(
      <Suspense fallback={null}>
        <MeetingPageRightRail
          sections={[]}
          attendees={null}
          organizations={null}
          meeting={{}}
          bot={{}}
          thumbnailQueryResult={{}}
          askEnabled={true}
          isLoading={false}
        />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByTestId('chat-component')).toBeInTheDocument();
    });
  });

  it('does not render the Chat component when askEnabled is false', () => {
    useUserStore.mockReturnValue({ isGuest: false });

    render(
      <MeetingPageRightRail
        sections={[]}
        attendees={null}
        organizations={null}
        meeting={{}}
        bot={{}}
        thumbnailQueryResult={{}}
        askEnabled={false}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
  });

  it('does not render the Chat component when the user is a guest', () => {
    useUserStore.mockReturnValue({ isGuest: true });

    render(
      <MeetingPageRightRail
        sections={[]}
        attendees={null}
        organizations={null}
        meeting={{}}
        bot={{}}
        thumbnailQueryResult={{}}
        askEnabled={true}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('chat-component')).not.toBeInTheDocument();
  });

  it('allows changing the meeting filter state', () => {
    useUserStore.mockReturnValue({ isGuest: false });

    render(
      <MeetingPageRightRail
        sections={[]}
        attendees={[{ email: 'user@example.com' }]}
        organizations={[{ name: 'Test Org' }]}
        meeting={{}}
        bot={{}}
        thumbnailQueryResult={{}}
        askEnabled={true}
        isLoading={false}
      />
    );

    const radioGroup = screen.getByRole('radiogroup');
    fireEvent.click(screen.getByLabelText('People')); // Simulating user clicking the radio button

    expect(radioGroup).toBeInTheDocument();
    expect(screen.queryByTestId('reskin-organization-stack')).not.toBeInTheDocument();
  });
});
