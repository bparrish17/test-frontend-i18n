import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { useUserStore } from '@store/app.store';
import ManageUploadsPage from '@pages/settings/manage-uploads.page';
import { useSetDocumentTitle, useDocumentUploads, useMeetingUploads } from '@util/hooks';

vi.mock('@util/hooks', () => ({
  useSetDocumentTitle: vi.fn(),
  useDocumentUploads: vi.fn(),
  useMeetingUploads: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@layouts/settings.layout', () => ({
  default: ({ children, pageTitle }) => (
    <div
      data-testid='mock-settings-layout'
      data-page-title={pageTitle}
    >
      {children}
    </div>
  )
}));

vi.mock('@layouts/centered.layout', () => ({
  default: ({ children }) => <div data-testid='mock-centered-layout'>{children}</div>
}));

vi.mock('@components/settings/manage-uploads/manage-uploads-table.component', () => ({
  __esModule: true,
  default: ({ uploads, cards, type }) => (
    <div data-testid='mock-uploads-table'>
      <div data-testid='uploads-prop'>{JSON.stringify(uploads)}</div>
      <div data-testid='cards-prop'>{JSON.stringify(cards)}</div>
      <div data-testid='type-prop'>{type}</div>
    </div>
  )
}));

describe('ManageUploadsPage', () => {
  const mockUser = { id: 'test-user' };

  beforeEach(() => {
    vi.resetAllMocks();

    useUserStore.mockImplementation((selector) => {
      const state = { user: mockUser };
      return selector(state);
    });
  });

  it('sets the document title on mount', () => {
    useDocumentUploads.mockReturnValue({ batches: null, cards: null });
    useMeetingUploads.mockReturnValue({ meetings: null, cards: null });

    render(<ManageUploadsPage />);

    expect(useSetDocumentTitle).toHaveBeenCalledWith('Manage Uploads - FORA');
  });

  it('renders ManageUploadsTable for Document and Meeting data', () => {
    const documentData = { batches: [{ id: 1 }], cards: [{ id: 'doc1' }] };
    const meetingData = { meetings: [{ id: 2 }], cards: [{ id: 'meet1' }] };

    useDocumentUploads.mockReturnValue(documentData);
    useMeetingUploads.mockReturnValue(meetingData);

    render(<ManageUploadsPage />);

    expect(useDocumentUploads).toHaveBeenCalledWith({ user: mockUser });
    expect(useMeetingUploads).toHaveBeenCalled();

    const tables = screen.getAllByTestId('mock-uploads-table');
    expect(tables).toHaveLength(2);

    // First table (Documents)
    const [docTable, meetTable] = tables;
    expect(within(docTable).getByTestId('uploads-prop')).toHaveTextContent(
      JSON.stringify(documentData.batches)
    );
    expect(within(docTable).getByTestId('cards-prop')).toHaveTextContent(
      JSON.stringify(documentData.cards)
    );
    expect(within(docTable).getByTestId('type-prop')).toHaveTextContent('Document');

    // Second table (Meetings)
    expect(within(meetTable).getByTestId('uploads-prop')).toHaveTextContent(
      JSON.stringify(meetingData.meetings)
    );
    expect(within(meetTable).getByTestId('cards-prop')).toHaveTextContent(
      JSON.stringify(meetingData.cards)
    );
    expect(within(meetTable).getByTestId('type-prop')).toHaveTextContent('Meeting');
  });

  it('renders no table if batches/cards or meetings/cards are missing', () => {
    useDocumentUploads.mockReturnValue({ batches: null, cards: null });
    useMeetingUploads.mockReturnValue({ meetings: [{ id: 2 }], cards: null });

    render(<ManageUploadsPage />);

    // Should NOT render any tables
    expect(screen.queryByTestId('mock-uploads-table')).not.toBeInTheDocument();
  });

  it('wraps content with SettingsLayout and CenteredLayout', () => {
    useDocumentUploads.mockReturnValue({ batches: [], cards: [] });
    useMeetingUploads.mockReturnValue({ meetings: [], cards: [] });

    render(<ManageUploadsPage />);

    expect(screen.getByTestId('mock-settings-layout')).toBeInTheDocument();
    expect(screen.getByTestId('mock-centered-layout')).toBeInTheDocument();

    // Verify page title is passed correctly
    expect(screen.getByTestId('mock-settings-layout')).toHaveAttribute(
      'data-page-title',
      'Manage Uploads'
    );
  });
});
