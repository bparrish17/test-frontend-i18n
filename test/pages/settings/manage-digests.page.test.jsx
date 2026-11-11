import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { useChannels } from '@services/query-services/channels.query-service';
import ManageDigestsPage from '@pages/settings/manage-digests.page';

vi.mock('date-fns', async (importActual) => ({
  ...(await importActual()),
  format: vi.fn()
}));

vi.mock('@components/digest/delete-digest-modal.component', () => ({
  default: () => <div data-testid='delete-modal' />
}));

vi.mock('@components/digest/slack-digest-modal.component.jsx', () => ({
  default: () => <div data-testid='slack-digest-modal' />
}));

vi.mock('@components/digest/teams-digest-modal.component.jsx', () => ({
  default: () => <div data-testid='teams-digest-modal' />
}));

vi.mock('@components/general/table/accordion-table.component', () => ({
  default: ({ headers, tableData }) => (
    <div data-testid='accordion-table'>
      {headers.map((hdr) => (
        <div
          key={hdr.title ?? hdr.key}
          data-testid={hdr.title}
        >
          {hdr.title}
        </div>
      ))}
      {tableData.map((tableRow) => (
        <div key={`row-${tableRow?.name}`}>
          {headers.map((hdr) => (
            <div key={`row-${hdr.title ?? hdr.key}-${tableRow?.name}`}>{hdr.render(tableRow)}</div>
          ))}
        </div>
      ))}
    </div>
  )
}));

vi.mock('@services/query-services/channels.query-service', () => ({
  useChannels: vi.fn()
}));

vi.mock('@assets/icons', async (importActual) => ({
  ...(await importActual()),
  SFBoxWithPencil: vi.fn(() => <div data-testid='box-with-pencil' />)
}));

describe('ManageDigestsPage', () => {
  const renderPage = () =>
    render(
      <MemoryRouter>
        <ManageDigestsPage />
      </MemoryRouter>
    );

  beforeAll(() => {
    useChannels.mockReturnValue({
      data: [
        { id: 1, name: 'Channel 1', source: 'Slack' },
        { id: 1, name: 'Channel 2', source: 'Slack' },
        { id: 1, name: 'Channel 3', source: 'Teams' }
      ]
    });
  });

  it('renders "Manage Digests" page title, number of channels, and accordion table', () => {
    renderPage();
    expect(screen.getByText('Manage Digests')).toBeInTheDocument();
    expect(screen.getByText('3 Items')).toBeInTheDocument();
    expect(screen.getByTestId('accordion-table')).toBeInTheDocument();
  });

  it('renders digest name, created_at, frequency, and source columns', () => {
    renderPage();
    expect(screen.getByTestId('Name')).toBeInTheDocument();
    expect(screen.getByTestId('Source')).toBeInTheDocument();
    expect(screen.getByTestId('Frequency')).toBeInTheDocument();
    expect(screen.getByTestId('Date Created')).toBeInTheDocument();
  });
});
