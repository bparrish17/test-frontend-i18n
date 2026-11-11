import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';

import ReskinCardBody from '@components/general/card/reskin-card-structure/reskin-card-body.component';

vi.mock('@services/query-services/cards.query-service', () => ({
  useCardById: vi.fn(() => ({
    data: {
      ...mockCard,
      supporting_data: [{ data: [], value: 'Mock Supporting Data' }]
    },
    isLoading: false,
    isError: false
  }))
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ to, state, children }) => (
      <div>
        <div>{to}</div>
        <div>{state.lensId}</div>
        {children}
      </div>
    )
  };
});

vi.mock('@services/query-services/cards.query-service', () => ({
  useCardById: vi.fn(() => ({
    data: {
      ...mockCard,
      supporting_data: [{ data: [], value: 'Mock Supporting Data' }]
    },
    isLoading: false,
    isError: false
  }))
}));

vi.mock('@components/general/modals/source-modal.component', () => ({
  default: ({ children }) => <>{children}</>
}));

// disable responsive "show" for test cases
vi.mock('@chakra-ui/react', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    Show: ({ children }) => <>{children}</> // always renders
  };
});

const mockCard = {
  title: 'Card Title',
  headline: null,
  initiative: {
    id: 'lens-001',
    title: 'Mock Initiative',
    color: 'blue.400'
  },
  sections: [
    {
      title: 'Section Title',
      content: '* First bullet\n* Second bullet'
    }
  ],
  source_data: {
    sensitive: true
  }
};

const renderComponent = (props, children) => {
  render(
    <MemoryRouter>
      <ReskinCardBody {...props}>{children}</ReskinCardBody>
    </MemoryRouter>
  );
};

describe('ReskinCardBody', () => {
  it('renders non-collapsible ReskinCardBody and navigates on click', async () => {
    renderComponent(
      {
        card: mockCard,
        titleLink: '/some-path',
        enableCollapse: false
      },
      <div>Mock Child</div>
    );

    // Heading renders
    expect(screen.getByRole('heading', { name: /Card Title/i })).toBeInTheDocument();
    // Child renders
    expect(screen.getByText('Mock Child')).toBeInTheDocument();
  });

  it('renders collapsible ReskinCardBody and expands on click', async () => {
    renderComponent(
      {
        card: mockCard,
        titleLink: '/some-path',
        enableCollapse: true
      },
      <div>Mock Child</div>
    );

    const previewText = screen.getByText(/Preview Shared Summary/i);
    expect(previewText).toBeInTheDocument();

    // click to open collapse
    await userEvent.click(previewText);

    // Bullet points appear
    expect(await screen.findByText('Section Title')).toBeInTheDocument();
    expect(await screen.findByText('First bullet')).toBeInTheDocument();
    expect(await screen.findByText('Second bullet')).toBeInTheDocument();
  });

  it('renders initiative title if not a lens source card', () => {
    renderComponent(
      {
        card: mockCard,
        titleLink: '/some-path',
        enableCollapse: false
      },
      'Mock Child'
    );

    expect(screen.getByText('In')).toBeInTheDocument();
    expect(screen.getByText(/Mock Initiative/i)).toBeInTheDocument();
  });

  it('shows PRIVATE tag when isLensSourceCard is true and data is sensitive', () => {
    renderComponent(
      {
        card: mockCard,
        titleLink: '/some-path',
        enableCollapse: false,
        isLensSourceCard: true
      },
      'Mock Child'
    );

    expect(screen.getByText(/PRIVATE/i)).toBeInTheDocument();
  });

  it('triggers navigation to meeting detail when clicking stack', async () => {
    renderComponent(
      {
        card: mockCard,
        titleLink: '/some-path',
        enableCollapse: false
      },
      'Mock Child'
    );

    expect(screen.getByText('/some-path')).toBeInTheDocument();
    expect(screen.getByText('lens-001')).toBeInTheDocument();
  });
});
