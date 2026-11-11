import { describe, test, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForaLenses from '@pages/meeting/lenses.section';
import { useUserStore } from '@store/app.store';
import { useCards } from '@services/query-services/cards.query-service';
import { ChakraProvider } from '@chakra-ui/react';

vi.mock('@services/query-services/cards.query-service', () => ({
  useCards: vi.fn(() => ({
    mutate: vi.fn() // Mock the mutate function
  }))
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@components/general/modals/source-modal.component', () => ({
  default: ({ children }) => <div data-testid='source-modal'>{children}</div>
}));

// Mock media query hook
vi.mock(import('@chakra-ui/react'), async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useMediaQuery: () => [[true], [false]]
  };
});

describe('ForaLenses Component', () => {
  const mockInitialCard = {
    id: 'card1',
    source_data: { id: 'source1' },
    source: 'Regular',
    initiative: {
      id: 'initiative1',
      title: 'Test Initiative',
      tags: ['active']
    },
    headline: 'Test Headline'
  };

  const mockMeeting = {
    id: 'meeting1',
    linked: { id: 'linked1' }
  };

  const mockSection = {
    id: 'section1',
    enabled: true,
    title: 'Test Section'
  };

  const mockForaCards = [
    {
      id: 'card2',
      initiative: {
        id: 'initiative2',
        title: 'Fora Initiative 1',
        icon: 'lenses',
        tags: ['active']
      },
      headline: 'Fora Headline 1',
      high_priority: true
    },
    {
      id: 'card3',
      initiative: {
        id: 'initiative3',
        title: 'Fora Initiative 2',
        icon: 'custom',
        tags: ['active']
      },
      headline: 'Fora Headline 2',
      high_priority: false
    }
  ];

  beforeEach(() => {
    // Reset all mocks
    vi.resetAllMocks();

    vi.mock(
      '@statsig/react-bindings',
      () => ({
        useStatsigClient: () => ({
          checkGate: () => true
        })
      }),
      { virtual: true }
    );

    useCards.mockReturnValue({
      data: mockForaCards
    });
  });

  describe('guest user', () => {
    beforeEach(() => {
      // Setup default mock implementations
      useUserStore.mockImplementation((selector) => {
        const store = {
          user: { id: 'user1', isGuest: true },
          getGeneratingSummary: () => ({ generating: false })
        };
        return selector(store);
      });
    });

    test('should disable useCards hook', () => {
      useCards.mockReturnValue({ data: [] });

      const { container } = render(
        <ForaLenses
          section={mockSection}
          card={mockInitialCard}
          meeting={mockMeeting}
        />
      );

      expect(useCards).toHaveBeenCalledWith(expect.any(Object), {
        select: expect.any(Function),
        enabled: false
      });
    });
  });

  describe('FORA user', () => {
    beforeEach(() => {
      // Setup default mock implementations
      useUserStore.mockImplementation((selector) => {
        const store = {
          user: { id: 'user1', isGuest: false },
          getGeneratingSummary: () => ({ generating: false })
        };
        return selector(store);
      });
    });

    test('should render nothing when no fora cards are available', () => {
      useCards.mockReturnValue({ data: [] });

      const { container } = render(
        <ForaLenses
          section={mockSection}
          card={mockInitialCard}
          meeting={mockMeeting}
        />
      );

      expect(container.firstChild).toBe(null);
    });

    test('should render fora cards correctly', () => {
      render(
        <ChakraProvider>
          <ForaLenses
            section={mockSection}
            card={mockInitialCard}
            meeting={mockMeeting}
          />
        </ChakraProvider>
      );

      expect(screen.queryByText('Insights from FORA Lenses')).toBeDefined();
      expect(screen.queryByText('Fora Initiative 1')).toBeDefined();
      expect(screen.queryByText('Fora Initiative 2')).toBeDefined();
      expect(screen.queryByText('Fora Headline 1')).toBeDefined();
      expect(screen.queryByText('Fora Headline 2')).toBeDefined();
    });

    test('should handle View More functionality', async () => {
      const manyCards = Array.from({ length: 6 }, (_, i) => ({
        id: `card${i + 2}`,
        initiative: {
          id: `initiative${i + 2}`,
          title: `Fora Initiative ${i + 1}`,
          icon: 'lenses',
          tags: ['active']
        },
        headline: `Fora Headline ${i + 1}`,
        high_priority: false
      }));

      useCards.mockReturnValue({
        data: manyCards
      });

      render(
        <ChakraProvider>
          <ForaLenses
            section={mockSection}
            card={mockInitialCard}
            meeting={mockMeeting}
          />
        </ChakraProvider>
      );

      expect(screen.queryByText('Fora Initiative 5')).not.toBeInTheDocument();
      fireEvent.click(screen.queryByText(/View More/i));
      await waitFor(() => {
        expect(screen.queryByText('Fora Initiative 5')).toBeDefined();
      });
    });

    test('should handle errors in card data', () => {
      useCards.mockReturnValue({
        data: [
          {
            id: 'card2',
            initiative: null, // Missing initiative data
            headline: 'Fora Headline 1'
          },
          {
            id: 'card3',
            initiative: {
              id: 'initiative3',
              // Missing title
              icon: 'custom',
              tags: ['active']
            }
          }
        ]
      });

      // Should render without crashing
      expect(() => {
        render(
          <ForaLenses
            section={mockSection}
            card={mockInitialCard}
            meeting={mockMeeting}
          />
        );
      }).not.toThrow();
    });
  });
});
