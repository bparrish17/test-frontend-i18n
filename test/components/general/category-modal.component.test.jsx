import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import CategoryModal from '@components/general/card/category-modal.component';
import { useUserStore } from '@store/app.store';
import { useInitiatives } from '@services/query-services/initiatives.query-service';

vi.mock('@store/app.store');
vi.mock('@services/query-services/initiatives.query-service');

describe('CategoryModal', () => {
  const defaultDisclosure = {
    isOpen: true,
    onClose: vi.fn(),
    onOpen: vi.fn()
  };

  const mockFocuses = [
    { id: '1', title: 'Focus A' },
    { id: '2', title: 'Focus B' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    useInitiatives.mockReturnValue({ data: mockFocuses });
  });

  describe('FORA user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ isGuest: false });
    });

    it('renders the modal with title and icon', () => {
      render(
        <CategoryModal
          disclosure={defaultDisclosure}
          initialValue='1'
          title='Change Meeting Type'
          handleCategoryUpdated={vi.fn()}
        />
      );

      expect(screen.getByText('Change Meeting Type')).toBeInTheDocument();
      expect(screen.getByText('Focus A')).toBeInTheDocument();
      expect(screen.getByText('Focus B')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Update')).toBeInTheDocument();
    });

    it('enables initiative query', () => {
      render(
        <CategoryModal
          disclosure={defaultDisclosure}
          initialValue='1'
          title='Change Meeting Type'
          handleCategoryUpdated={vi.fn()}
        />
      );

      expect(useInitiatives).toHaveBeenCalledWith({ type: 'Focus' }, { enabled: true });
    });

    it('conditionally renders the description text if provided', () => {
      render(
        <CategoryModal
          disclosure={defaultDisclosure}
          initialValue='1'
          descriptionText='This is a test description'
          handleCategoryUpdated={vi.fn()}
        />
      );

      expect(screen.getByText('This is a test description')).toBeInTheDocument();
    });

    it('calls handleCategoryUpdated with selected category on update click', () => {
      const handleCategoryUpdated = vi.fn();

      render(
        <CategoryModal
          disclosure={defaultDisclosure}
          initialValue='1'
          handleCategoryUpdated={handleCategoryUpdated}
        />
      );

      // Select the second focus
      fireEvent.click(screen.getByTestId('focus-2'));
      fireEvent.click(screen.getByText('Update'));

      expect(handleCategoryUpdated).toHaveBeenCalledWith({
        id: '2',
        title: 'Focus B'
      });
    });

    it('calls disclosure.onClose when Cancel is clicked', () => {
      render(
        <CategoryModal
          disclosure={defaultDisclosure}
          initialValue='1'
          handleCategoryUpdated={vi.fn()}
        />
      );

      fireEvent.click(screen.getByText('Cancel'));

      expect(defaultDisclosure.onClose).toHaveBeenCalled();
    });

    it('does not render radio options if no focuses returned', () => {
      useInitiatives.mockReturnValue({ data: [] });

      render(
        <CategoryModal
          disclosure={defaultDisclosure}
          initialValue='1'
          handleCategoryUpdated={vi.fn()}
        />
      );

      expect(screen.queryByRole('radio')).not.toBeInTheDocument();
    });
  });

  describe('Guest user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({ isGuest: true });
    });

    it('disables initiative query', () => {
      render(
        <CategoryModal
          disclosure={defaultDisclosure}
          initialValue='1'
          title='Change Meeting Type'
          handleCategoryUpdated={vi.fn()}
        />
      );

      expect(useInitiatives).toHaveBeenCalledWith({ type: 'Focus' }, { enabled: false });
    });
  });
});
