import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AccordionTable from '@components/general/table/accordion-table.component';
import { Text } from '@chakra-ui/react';

// Mock window.pendo
const mockTrack = vi.fn();
window.pendo = { track: mockTrack };

// Mock location URL
delete window.location;
window.location = new URL('http://localhost');

const mockHeaders = [
  {
    title: 'Topics',
    orderBy: 'title',
    dir: 'asc',
    render: (topic) => <div>{topic?.title}</div>
  },
  {
    title: 'Type',
    orderBy: 'strategic_vs_tactical',
    dir: 'asc',
    render: (topic) => <div>{topic?.strategic_vs_tactical}</div>
  },
  {
    title: 'Sentiment',
    orderBy: 'sentiment',
    dir: 'asc',
    render: (topic) => <div>{topic?.sentiment}</div>
  }
];

const mockTableData = [
  {
    title: 'First Topic',
    strategic_vs_tactical: 'tactical',
    sentiment: 'positive',
    details: 'Details about first topic'
  },
  {
    title: 'Second Topic',
    strategic_vs_tactical: 'strategic',
    sentiment: 'negative',
    details: 'Details about second topic'
  },
  {
    title: 'Third Topic',
    strategic_vs_tactical: 'balanced',
    sentiment: 'neutral',
    details: 'Details about third topic'
  },
  {
    title: 'Fourth Topic',
    strategic_vs_tactical: 'foo',
    sentiment: 'slightly positive',
    details: 'Details about fourth topic'
  },
  {
    title: 'Fifth Topic',
    strategic_vs_tactical: 'bar',
    sentiment: 'slightly negative',
    details: 'Details about fifth topic'
  }
];

describe('AccordionTable', () => {
  beforeEach(() => {
    window.location = new URL('http://localhost');
    vi.clearAllMocks();
  });

  const renderTable = (props = {}) =>
    render(
      <AccordionTable
        tableData={mockTableData}
        headers={mockHeaders}
        enableExpansion
        panelChildren={(topic) => topic?.details}
        {...props}
      />
    );

  it('renders table headers', () => {
    renderTable();
    expect(screen.getByTestId('header-Topics')).toBeInTheDocument();
    expect(screen.getByTestId('header-Type')).toBeInTheDocument();
    expect(screen.getByTestId('header-Sentiment')).toBeInTheDocument();
  });

  it('renders all table data initially', () => {
    renderTable();

    // Ensure each topic title is rendered
    mockTableData.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Ensure each strategic_vs_tactical value is rendered
    mockTableData.forEach(({ strategic_vs_tactical }) => {
      expect(screen.getByText(strategic_vs_tactical)).toBeInTheDocument();
    });

    // Ensure each sentiment value is rendered
    mockTableData.forEach(({ sentiment }) => {
      expect(screen.getByText(sentiment)).toBeInTheDocument();
    });
  });

  it('re-renders table when tableData changes', async () => {
    const { rerender } = renderTable();

    // Ensure the initial table renders all mock data
    mockTableData.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Define a subset of the original data
    const subsetTableData = mockTableData.slice(0, 2); // Only first two rows

    // Rerender with the new subset of data
    rerender(
      <AccordionTable
        tableData={subsetTableData}
        headers={mockHeaders}
      />
    );

    // Ensure only the subset data is present
    subsetTableData.forEach(({ title }) => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });

    // Ensure the removed rows are NOT in the document anymore
    const removedRows = mockTableData.slice(2); // Rows that were removed
    removedRows.forEach(({ title }) => {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
    });
  });

  it('renders all tableData rows if no maxItems provided', () => {
    renderTable();
    const items = screen.getAllByTestId(/accordion-item-/);
    expect(items).toHaveLength(mockTableData.length);
  });

  it('renders tableData limited by maxItems by default, if provided', () => {
    renderTable({ maxItems: 4 });
    const items = screen.getAllByTestId(/accordion-item-/);
    expect(items).toHaveLength(4);
  });

  it('shows view more button when there are more than 4 tableData', () => {
    renderTable({ maxItems: 4 });
    expect(screen.getByTestId('view-more')).toBeInTheDocument();
  });

  it('expands to show all tableData when view more is clicked if number of tableData rows is > maxItems', () => {
    renderTable({ maxItems: 2 });
    fireEvent.click(screen.getByTestId('view-more'));
    const items = screen.getAllByTestId(/accordion-item-/);
    expect(items).toHaveLength(mockTableData.length);
  });

  it('hides the sort icon if disableSort is true', () => {
    renderTable({
      headers: [
        {
          title: 'Topics',
          orderBy: 'title',
          dir: 'asc',
          disableSort: true,
          render: (topic) => <div>{topic?.title}</div>
        }
      ]
    });
    expect(screen.getByTestId('header-Topics')).toBeInTheDocument();
    expect(screen.getByTestId('header-sort-icon')).toHaveAttribute('hidden');
  });

  it('includes components when enableExpansion and panelChildren are set', () => {
    renderTable();

    // should have the expand all icon
    expect(screen.getByTestId('expand')).toBeInTheDocument();

    // Should have 5 expand icons and 5 expand panels
    const accordionIcons = screen.getAllByTestId('accordion-icon-expand');
    expect(accordionIcons.length).toEqual(5);

    const accordionPanels = screen.getAllByTestId('accordion-panel-expand');
    expect(accordionPanels.length).toEqual(5);
  });

  it('Hides components when enableExpansion is false', () => {
    // override default prop
    renderTable({ enableExpansion: false });

    // should have the expand all icon
    expect(screen.queryByTestId('expand')).not.toBeInTheDocument();
    expect(screen.queryByTestId('accordion-icon-expand')).not.toBeInTheDocument();
    expect(screen.queryByTestId('accordion-panel-expand')).not.toBeInTheDocument();
  });

  it('Hides components when panelChildren is null', () => {
    // override default prop
    renderTable({ panelChildren: null });

    screen.debug(null, Infinity);

    // should have the expand all icon
    expect(screen.queryByTestId('expand')).not.toBeInTheDocument();
    expect(screen.queryByTestId('accordion-icon-expand')).not.toBeInTheDocument();
    expect(screen.queryByTestId('accordion-panel-expand')).not.toBeInTheDocument();
  });

  it.todo('sorts column when clicking on header', () => {
    renderTable();
    const topicsHeader = screen.getByTestId('header-Topics');
    fireEvent.click(topicsHeader);

    const buttons = screen.getAllByRole('button');
    expect(within(buttons[0]).getByText('First Topic')).toBeTruthy();
    expect(within(buttons[1]).getByText('Second Topic')).toBeTruthy();

    fireEvent.click(topicsHeader);
    expect(within(buttons[0]).getByText('Second Topic')).toBeTruthy();
    expect(within(buttons[1]).getByText('First Topic')).toBeTruthy();
  });
});
