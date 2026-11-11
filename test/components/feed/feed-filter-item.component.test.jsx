import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import FilterItem from '@components/feed/feed-filter-item.component';

describe('FilterItem', () => {
  it('renders the filter text and children when not toggleable', () => {
    render(
      <FilterItem
        text='Status'
        isToggleable={false}
      >
        <div data-testid='child'>Child Content</div>
      </FilterItem>
    );

    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.queryByTestId('feed-toggle-button')).not.toBeInTheDocument();
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders toggle button when isToggleable is true', () => {
    render(
      <FilterItem
        text='Status'
        isToggleable
        toggleCount={0}
      >
        <div>Child Content</div>
      </FilterItem>
    );

    expect(screen.getByTestId('feed-toggle-button')).toBeInTheDocument();
  });

  it('displays toggleCount when greater than 0', () => {
    render(
      <FilterItem
        text='Category'
        isToggleable
        toggleCount={3}
      >
        <div>Child Content</div>
      </FilterItem>
    );

    expect(screen.getByText('3 selected')).toBeInTheDocument();
  });

  it('does not display toggleCount when 0', () => {
    render(
      <FilterItem
        text='Type'
        isToggleable
        toggleCount={0}
      >
        <div>Child Content</div>
      </FilterItem>
    );

    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });

  it('toggles collapse content when button is clicked', async () => {
    render(
      <FilterItem
        text='Toggle Me'
        isToggleable
        toggleCount={0}
      >
        <div data-testid='child'>Togglable Content</div>
      </FilterItem>
    );

    const toggleButton = screen.getByTestId('feed-toggle-button');
    const childContent = () => screen.queryByTestId('child');

    // Initially collapsed
    expect(childContent()).not.toBeVisible();

    // Open it
    fireEvent.click(toggleButton);
    await waitFor(() => expect(childContent()).toBeVisible());

    fireEvent.click(toggleButton);
    await waitFor(() => expect(childContent()).not.toBeVisible());
  });
});
