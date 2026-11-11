import { MemoryRouter, useNavigate } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { ChakraProvider } from '@chakra-ui/react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeAll, vi } from 'vitest';
import React from 'react';
import CustomSummaryMenu from '@components/custom-summary/custom-summary-menu.component';
import { useUserStore } from '@store/app.store';

import {
  useInitiatives,
  useGenerateCardTemplate,
  useGenerateImprovedFormattingInstructions,
  useGenerateLensPrompts,
  useCreateInitiative,
  usePatchInitiative,
  useDeleteInitiative
} from '@services/query-services/initiatives.query-service';
import {
  useCardById,
  useCardsCleanBody,
  useDeleteCard
} from '@services/query-services/cards.query-service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBreakpointValue } from '@util/hooks';

vi.mock('@store/app.store');

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

vi.mock('@services/query-services/initiatives.query-service', () => ({
  useInitiatives: vi.fn(),
  useGenerateCardTemplate: vi.fn(),
  getLensPromptSuggestion: vi.fn(),
  useGenerateImprovedFormattingInstructions: vi.fn(),
  useGenerateLensPrompts: vi.fn(),
  useCreateInitiative: vi.fn(),
  usePatchInitiative: vi.fn(),
  useDeleteInitiative: vi.fn(),
  useInitiativeById: vi.fn(() => ({
    data: {}
  }))
}));

// Add this to your mock section at the top of the test file
vi.mock('@components/custom-summary/custom-summary-chat.component', () => ({
  default: () => (
    <div data-testid='custom-summary-chat'>
      <div>Write Your Template</div>
    </div>
  )
}));

vi.mock('@util/hooks', () => ({
  useBreakpointValue: vi.fn()
}));

const Providers = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,
        refetchOnWindowFocus: !import.meta.env.DEV === true
      }
    }
  });

  return (
    <ChakraProvider>
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <QueryParamProvider adapter={ReactRouter6Adapter}>{children}</QueryParamProvider>
        </QueryClientProvider>
      </MemoryRouter>
    </ChakraProvider>
  );
};

describe('CustomSummaryMenu', () => {
  beforeAll(() => {
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // Deprecated
      removeListener: vi.fn(), // Deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn()
    }));
  });

  beforeEach(() => {
    useUserStore.mockReturnValue({
      id: 1,
      email: 'test@example.com',
      isGuest: false
    });
  });

  const mockMeeting = {
    id: 'meeting123',
    title: 'Test Meeting',
    start_at: 1738089000000,
    linked: {
      id: 'linked123'
    }
  };

  it('renders the menu and lens tabs correctly', async () => {
    const mockLenses = [
      {
        id: 1,
        title: 'Lens 1'
      },
      {
        id: 2,
        title: 'Lens 2'
      }
    ];

    const mockCards = [
      {
        id: 1,
        initiative: { id: 3 }
      }
    ];

    useInitiatives.mockReturnValue({ data: mockLenses });

    render(
      <Providers>
        <CustomSummaryMenu
          meeting={mockMeeting}
          allCards={mockCards}
        />
      </Providers>
    );

    const menuButton = screen.getByRole('button', { name: /Templates/i });
    expect(menuButton).toBeInTheDocument();
    for (const lens of mockLenses) {
      expect(screen.getByText(lens.title)).toBeInTheDocument();
    }
  });

  it('passes the correct parameters to useInitiatives', async () => {
    const mockLenses = [
      {
        id: 1,
        title: 'Lens 1'
      },
      {
        id: 2,
        title: 'Lens 2'
      }
    ];

    const mockCards = [
      {
        id: 1,
        initiative: { id: 1 }
      }
    ];

    useInitiatives.mockReturnValue({ data: mockLenses });
    render(
      <Providers>
        <CustomSummaryMenu
          meeting={mockMeeting}
          allCards={mockCards}
        />
      </Providers>
    );

    expect(useInitiatives).toHaveBeenCalledWith({
      type: 'Lens',
      tags: ['template'],
      creator_id: 1
    });
  });

  it('opens and closes the menu on click', async () => {
    const mockLenses = [
      {
        id: 1,
        title: 'Lens 1'
      }
    ];
    const mockCards = [
      {
        id: 1,
        initiative: { id: 1 }
      }
    ];
    useInitiatives.mockReturnValue({ data: mockLenses });

    const { getByRole } = render(
      <Providers>
        <CustomSummaryMenu
          meeting={mockMeeting}
          allCards={mockCards}
        />
      </Providers>
    );

    const menuButton = getByRole('button', { name: /Templates/i });
    fireEvent.click(menuButton);

    const menu = await screen.findByRole('menu');
    menu.scrollTo = vi.fn();

    await waitFor(() => expect(menu).toBeVisible());

    fireEvent.click(menuButton);
    await waitFor(() => expect(menu).not.toBeVisible());
  });

  it('handles button click in menu', async () => {
    const mockLenses = [
      {
        id: 1,
        title: 'Lens 1'
      }
    ];
    const mockCards = [
      {
        id: 1,
        initiative: { id: 1 }
      }
    ];
    useInitiatives.mockReturnValue({ data: mockLenses });
    render(
      <Providers>
        <CustomSummaryMenu
          meeting={mockMeeting}
          allCards={mockCards}
        />
      </Providers>
    );
    fireEvent.click(screen.getByRole('button', { name: /Templates/i }));
    fireEvent.click(screen.getByText(/Chat to Create/i));
    expect(screen.getByText(/Write Your Template/i)).toBeInTheDocument();
  });

  it('handles Manage Templates button click in menu', async () => {
    useBreakpointValue.mockReturnValue('Manage Templates');
    const navigateMock = vi.fn();
    useNavigate.mockReturnValue(navigateMock);

    const mockLenses = [
      {
        id: 1,
        title: 'Lens 1'
      },
      {
        id: 2,
        title: 'Lens 2'
      }
    ];
    const mockCards = [
      {
        id: 1,
        initiative: { id: 1 }
      }
    ];
    useInitiatives.mockReturnValue({ data: mockLenses });
    render(
      <Providers>
        <CustomSummaryMenu
          meeting={mockMeeting}
          allCards={mockCards}
        />
      </Providers>
    );
    fireEvent.click(screen.getByRole('button', { name: /Templates/i }));
    fireEvent.click(screen.getByText(/Manage Templates/i));
    expect(navigateMock).toHaveBeenCalledWith('/settings/manage-templates?templatesSort=1|desc');
  });

  it('Shows "Manage" on smaller screens', async () => {
    // mock small screen
    useBreakpointValue.mockReturnValue('Manage');

    const mockLenses = [
      {
        id: 1,
        title: 'Lens 1'
      },
      {
        id: 2,
        title: 'Lens 2'
      }
    ];
    const mockCards = [
      {
        id: 1,
        initiative: { id: 1 }
      }
    ];
    useInitiatives.mockReturnValue({ data: mockLenses });
    render(
      <Providers>
        <CustomSummaryMenu
          meeting={mockMeeting}
          allCards={mockCards}
        />
      </Providers>
    );

    expect(screen.getByText(/Manage$/)).toBeInTheDocument();
  });

  it('displays the "Create a template" section', async () => {
    const mockLenses = [
      {
        id: 1,
        title: 'Lens 1'
      }
    ];
    const mockCards = [
      {
        id: 1,
        initiative: { id: 1 }
      }
    ];
    useInitiatives.mockReturnValue({ data: mockLenses });
    render(
      <Providers>
        <CustomSummaryMenu
          meeting={mockMeeting}
          allCards={mockCards}
        />
      </Providers>
    );
    fireEvent.click(screen.getByRole('button', { name: /Templates/i }));
    expect(screen.getByText(/Create a template/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Chat with FORA to build a template for this and similar meetings/i)
    ).toBeInTheDocument();
  });

  it('displays the "Apply a template" section', async () => {
    const mockLenses = [
      {
        id: 1,
        title: 'Lens 1'
      }
    ];
    const mockCards = [
      {
        id: 1,
        initiative: { id: 2 }
      }
    ];
    useInitiatives.mockReturnValue({ data: mockLenses });
    render(
      <Providers>
        <CustomSummaryMenu
          meeting={mockMeeting}
          allCards={mockCards}
        />
      </Providers>
    );
    fireEvent.click(screen.getByRole('button', { name: /Templates/i }));
    expect(screen.getByText(/Apply a template/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Use a saved template to quickly format your meeting summary/i)
    ).toBeInTheDocument();
  });

  it('hides the "Apply a template" section', async () => {
    const mockLenses = [
      {
        id: 1,
        title: 'Lens 1'
      }
    ];
    const mockCards = [
      {
        id: 1,
        initiative: { id: 1 }
      }
    ];

    useInitiatives.mockReturnValue({ data: mockLenses });
    render(
      <Providers>
        <CustomSummaryMenu
          meeting={mockMeeting}
          allCards={mockCards}
        />
      </Providers>
    );
    fireEvent.click(screen.getByRole('button', { name: /Templates/i }));

    const divider = document.querySelector('.chakra-divider');
    expect(divider).toHaveAttribute('hidden');

    const text = screen.queryByText('Apply a template');
    const hiddenAncestor = text.closest('[hidden]');
    expect(hiddenAncestor).toBeInTheDocument();
    expect(hiddenAncestor).toHaveAttribute('hidden');
  });
});
