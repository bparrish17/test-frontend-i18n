import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider, useDisclosure } from '@chakra-ui/react';

import MobileHeader from '@components/layout/mobile-header.component';
import { useUserStore } from '@store/app.store';
import { useGlobalSettings } from '@services/query-services/global-settings.query-service';

vi.mock('@chakra-ui/react', async (importActual) => ({
  ...(await importActual()),
  useDisclosure: vi.fn()
}));

vi.mock('@store/app.store', () => {
  return {
    useUserStore: vi.fn(),
    useGlobalSearchStore: vi.fn(() => ({ inputRef: { current: { focus: vi.fn() } } }))
  };
});

vi.mock('@util/hooks', () => ({
  useIsUserType: vi.fn(() => true),
  useSetFullMobileVH: vi.fn()
}));

vi.mock('@util/hooks/global-search.hooks', () => ({
  useGlobalSearchState: vi.fn(() => ({
    globalSearchQuery: '',
    handleViewAllClick: vi.fn(),
    globalSearchQueryResult: [],
    pushQueryToRecentSearches: vi.fn()
  }))
}));

vi.mock('@services/query-services/global-settings.query-service', () => ({
  useGlobalSettings: vi.fn(() => ({ data: {} }))
}));

vi.mock('@util/helpers/global-settings.helpers', () => ({
  evaluateOutageMessageVisibility: vi.fn(() => true)
}));

vi.mock('@components/meeting/create-meeting-modal.component', () => ({
  default: () => <div data-testid='create-meeting-modal' />
}));

vi.mock('@components/global-search/global-search-input.component', () => ({
  default: () => <input data-testid='global-search-input' />
}));

vi.mock('@components/global-search/global-search-results.component', () => ({
  default: () => <div data-testid='global-search-results' />
}));

vi.mock('@components/general/fora-banner.component', () => ({
  default: () => <div data-testid='fora-banner' />
}));

const mockUserStore = (overrides = {}) => {
  const defaultStore = {
    user: { first_name: 'Test', type: 'Executive', isGuest: false },
    tenant: {},
    outageMessageVisibility: {},
    getOutageMessageVisibility: vi.fn(),
    setOutageMessageVisibility: vi.fn()
  };

  const store = { ...defaultStore, ...overrides };
  useUserStore.mockImplementation((selector) => selector(store));
};

const renderMobileHeader = () => {
  return render(
    <ChakraProvider>
      <MemoryRouter>
        <MobileHeader />
      </MemoryRouter>
    </ChakraProvider>
  );
};

describe('MobileHeader', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useDisclosure.mockReturnValue({ isOpen: true });
  });

  describe('FORA user', () => {
    describe('default FE config', () => {
      beforeEach(() => {
        mockUserStore();
      });

      it('renders nav items for a logged-in user (filters out disabled)', () => {
        renderMobileHeader();

        const menuButtons = screen.queryAllByTestId('menu-button');
        const hrefs = menuButtons.map((btn) => btn.getAttribute('href'));

        expect(hrefs).toContain('/home');
        expect(hrefs).toContain('/lenses');
        expect(hrefs).toContain('/agenda');
        expect(hrefs).toContain('/summaries');

        const addForaButton = menuButtons.find((btn) => btn.textContent.includes('Add FORA'));
        expect(addForaButton).toBeInTheDocument();
      });

      it('renders outage message banner when globalSettings has a message', () => {
        useGlobalSettings.mockReturnValue({ data: { outage_message: 'System Down' } });
        renderMobileHeader();

        expect(screen.getByText('System Down')).toBeInTheDocument();
      });
    });

    describe('custom FE config', () => {
      beforeEach(() => {
        mockUserStore({
          tenant: {
            fe_config: {
              home_enabled: false,
              lenses_enabled: false,
              agenda_enabled: false,
              summaries_enabled: false,
              add_menu_enabled: false
            }
          }
        });
      });

      it('filters out disabled nav items based on fe_config', () => {
        renderMobileHeader();

        const menuButtons = screen.queryAllByTestId('menu-button');
        const hrefs = menuButtons.map((btn) => btn.getAttribute('href'));

        expect(hrefs).not.toContain('/home');
        expect(hrefs).not.toContain('/lenses');
        expect(hrefs).not.toContain('/agenda');
        expect(hrefs).not.toContain('/summaries');

        const addForaButton = menuButtons.find((btn) => btn.textContent.includes('Add FORA'));
        expect(addForaButton).toBe(undefined);
      });
    });
  });

  describe('Guest user', () => {
    beforeEach(() => {
      mockUserStore({ user: { isGuest: true } });
    });

    it('renders only guest nav items when user is guest', () => {
      renderMobileHeader();

      const menuButtons = screen.queryAllByTestId('menu-button');
      const hrefs = menuButtons.map((btn) => btn.getAttribute('href'));

      expect(hrefs).toContain('/'); // home for guest user
      expect(hrefs).not.toContain('/lenses');
      expect(hrefs).not.toContain('/agenda');
      expect(hrefs).not.toContain('/summaries');

      const addForaButton = menuButtons.find((btn) => btn.textContent.includes('Add FORA'));
      expect(addForaButton).toBe(undefined);
    });
  });
});
