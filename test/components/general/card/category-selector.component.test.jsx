import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Menu } from '@chakra-ui/react';

import CategorySelector from '@components/general/card/category-selector.component';

describe('CategorySelector', () => {
  it('renders the initiativeTitle', () => {
    render(
      <Menu>
        <CategorySelector
          initiativeTitle='Test Initiative'
          disclosure={{ onOpen: vi.fn() }}
        />
      </Menu>
    );

    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Test Initiative')).toBeInTheDocument();
    expect(screen.getByText('Change')).toBeInTheDocument();
  });

  it('falls back to "No Category" when initiativeTitle is not provided', () => {
    render(
      <Menu>
        <CategorySelector
          initiativeTitle={null}
          disclosure={{ onOpen: vi.fn() }}
        />
      </Menu>
    );
    expect(screen.getByText('No Category')).toBeInTheDocument();
  });

  it('calls disclosure.onOpen when "Change" is clicked', () => {
    const onOpen = vi.fn();

    render(
      <Menu>
        <CategorySelector
          initiativeTitle='Some Category'
          disclosure={{ onOpen }}
        />
      </Menu>
    );

    const changeLink = screen.getByText('Change');
    fireEvent.click(changeLink);

    expect(onOpen).toHaveBeenCalled();
  });

  it('respects custom titleProps', () => {
    render(
      <Menu>
        <CategorySelector
          initiativeTitle='Some Category'
          disclosure={{ onOpen: vi.fn() }}
          titleProps={{ 'data-testid': 'custom-title' }}
        />
      </Menu>
    );

    expect(screen.getByTestId('custom-title')).toBeInTheDocument();
  });
});
