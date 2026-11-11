import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';

import Sider from '@components/layout/sider.component';
import { useUserStore } from '@store/app.store';

vi.mock('@store/app.store', () => {
  return {
    useUserStore: vi.fn(),
    useGlobalSearchStore: vi.fn(() => ({ setInput: vi.fn() })),
    useRefStore: vi.fn(() => ({ agendaMainRef: { current: { scrollTop: 0 } } }))
  };
});

vi.mock('@util/hooks', () => ({
  usePrefetchAgendaMeetings: vi.fn(() => vi.fn()),
  usePrefetchFeedCards: vi.fn(() => vi.fn()),
  usePrefetchFeedInsights: vi.fn(() => vi.fn())
}));

vi.mock('@components/layout/reskin-nav-item.component', () => ({
  default: (props) => (
    <div
      data-testid='nav-item'
      {...props}
    >
      {props.title}
    </div>
  )
}));

vi.mock('@components/layout/add-menu.component', () => ({
  default: () => <div data-testid='add-menu'>AddMenu</div>
}));

const mockUserStore = (overrides = {}) => {
  const defaultUser = {
    user: { type: 'Executive', isGuest: false },
    tenant: {}
  };

  const finalStore = { ...defaultUser, ...overrides };
  useUserStore.mockImplementation((selector) => selector(finalStore));
};

const renderSider = (initialPath = '/home') => {
  return render(
    <ChakraProvider>
      <MemoryRouter initialEntries={[initialPath]}>
        <Sider />
      </MemoryRouter>
    </ChakraProvider>
  );
};

describe('Sider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FORA user', () => {
    describe('default FE config', () => {
      beforeEach(() => {
        mockUserStore();
      });

      it('renders user navigation items by default', () => {
        renderSider('/home');

        const navItems = screen.getAllByTestId('nav-item');
        expect(navItems).toHaveLength(4);
        expect(navItems[0]).toHaveTextContent('home');
        expect(navItems[1]).toHaveTextContent('lenses');
        expect(navItems[2]).toHaveTextContent('agenda');
        expect(navItems[3]).toHaveTextContent('recent');
      });

      it('renders AddMenu if enabled', () => {
        renderSider('/home');
        expect(screen.getByTestId('add-menu')).toBeInTheDocument();
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

      it('Removes disabled navigation items', () => {
        renderSider('/home');

        const navItems = screen.queryAllByTestId('nav-item');
        expect(navItems).toHaveLength(0);
      });

      it('removes AddMenu if disabled', () => {
        renderSider('/home');
        expect(screen.queryByTestId('add-menu')).not.toBeInTheDocument();
      });
    });
  });

  describe('Guest user', () => {
    beforeEach(() => {
      mockUserStore({ user: { isGuest: true } });
    });

    it('renders guest navigation items when user is guest', () => {
      renderSider('/');

      const navItems = screen.getAllByTestId('nav-item');
      expect(navItems).toHaveLength(2); // home, info
      expect(navItems[1]).toHaveTextContent('info');
    });

    it('does not render AddMenu for guests', () => {
      renderSider('/');
      expect(screen.queryByTestId('add-menu')).toBeNull();
    });
  });

  // it('calls setGlobalSearchInput when a nav item is clicked and is not active', () => {
  //   const setInputMock = vi.fn();
  //   require('@store/app.store').useGlobalSearchStore.mockImplementation(() => ({
  //     setInput: setInputMock
  //   }));

  //   mockUserStore();
  //   renderSider('/home');

  //   const recentItem = screen.getAllByTestId('nav-item').find((el) => el.textContent === 'recent');
  //   fireEvent.click(recentItem);

  //   expect(setInputMock).toHaveBeenCalledWith('');
  // });

  // it('does not call setGlobalSearchInput when clicking the active nav item', () => {
  //   const setInputMock = vi.fn();
  //   require('@store/app.store').useGlobalSearchStore.mockImplementation(() => ({
  //     setInput: setInputMock
  //   }));

  //   mockUserStore();
  //   renderSider('/home');

  //   const homeItem = screen.getAllByTestId('nav-item').find((el) => el.textContent === 'home');
  //   fireEvent.click(homeItem);

  //   expect(setInputMock).not.toHaveBeenCalled();
  // });
});
