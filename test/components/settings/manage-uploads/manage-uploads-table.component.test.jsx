import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import ManageUploadsTable from '@components/settings/manage-uploads/manage-uploads-table.component';

// Mock all child components so we can check they’re called
vi.mock('@components/general/table/accordion-table.component', () => ({
  default: ({ tableData, headers }) => (
    <div data-testid='mock-accordion-table'>
      <div data-testid='table-data'>{JSON.stringify(tableData)}</div>
      <div data-testid='header-count'>{headers.length}</div>
    </div>
  )
}));

describe('ManageUploadsTable', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders nothing when uploads is null', () => {
    const { container } = render(
      <ManageUploadsTable
        uploads={null}
        cards={[]}
        type='Document'
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders the heading with correct count and type', () => {
    const uploads = [{ id: 1 }, { id: 2 }];
    render(
      <ManageUploadsTable
        uploads={uploads}
        cards={[]}
        type='Meeting'
      />
    );

    expect(screen.getByText('2 Meetings')).toBeInTheDocument();
  });

  it('renders with the provided data and headers', () => {
    const uploads = [{ id: 1, created_at: '2023-01-01', status: 'ok', title: 'Doc' }];

    render(
      <ManageUploadsTable
        uploads={uploads}
        cards={[]}
        type='Document'
      />
    );

    expect(screen.getByText('1 Document')).toBeInTheDocument();

    // AccordionTable rendered with our data
    expect(screen.getByTestId('mock-accordion-table')).toBeInTheDocument();
    expect(screen.getByTestId('table-data')).toHaveTextContent(JSON.stringify(uploads));

    // Should include all headers
    expect(screen.getByTestId('header-count')).toHaveTextContent('5');
  });
});
