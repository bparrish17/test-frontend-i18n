import { screen } from '@testing-library/react';
import { expect } from 'vitest';

import { renderWithProviders } from '@test/test.helpers';
import LabelsBar from '@components/general/labels/labels-bar.component';
import { useUserStore } from '@store/app.store';
import { useInitiatives } from '@services/query-services/initiatives.query-service';
import { useBreakpoints } from '@util/hooks';

// Mock ResizeObserver
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Set up ResizeObserver mock globally
beforeAll(() => {
  global.ResizeObserver = ResizeObserverMock;
  window.ResizeObserver = ResizeObserverMock;
});

// Mocks
vi.mock('@store/app.store');
vi.mock('@services/query-services/initiatives.query-service');
vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn()
}));

describe('LabelsBar', () => {
  const mockLabels = [
    {
      id: 'label-1',
      title: 'Manual Label',
      match: 'Manual'
    },
    {
      id: 'label-2',
      title: 'Auto Label',
      match: 'Auto'
    }
  ];

  const mockLabelsBarProps = {
    meeting: { labels: mockLabels }
  };

  describe('FORA user', () => {
    beforeEach(() => {
      useUserStore.mockImplementation((selector) => {
        return selector({
          user: {
            id: '111',
            isGuest: false
          }
        });
      });

      useBreakpoints.mockReturnValue({ isDesktop: true });
      useInitiatives.mockReturnValue(mockLabels);
    });

    it('renders labels', () => {
      renderWithProviders(<LabelsBar {...mockLabelsBarProps} />);
      expect(screen.queryByTestId('labels-container')).toBeInTheDocument();
      expect(screen.queryByText('Add a label')).not.toBeInTheDocument();
    });

    it("renders 'Add a label' if no labels were applied", () => {
      renderWithProviders(
        <LabelsBar
          {...mockLabelsBarProps}
          meeting={{ labels: undefined }}
        />
      );
      expect(screen.getByText('Add a label')).toBeInTheDocument();
    });
  });

  describe('Guest user', () => {
    beforeEach(() => {
      useUserStore.mockImplementation((selector) => {
        return selector({
          user: {
            isGuest: true
          }
        });
      });
    });

    it('does not render labels', () => {
      const { container } = renderWithProviders(<LabelsBar {...mockLabelsBarProps} />);

      expect(container.firstChild).toBeNull();
      expect(screen.queryByTestId('labels-bar')).not.toBeInTheDocument();
    });
  });
});
