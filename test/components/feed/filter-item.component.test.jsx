import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { ChevronDownIcon } from '@assets/icons';

import FilterItem from '@components/feed/feed-filter-item.component';

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe('FilterItem', () => {
  it('renders with text and icon when isToggleable is false', () => {
    renderWithChakra(
      <FilterItem
        text='Labels'
        icon={ChevronDownIcon}
        isToggleable={false}
      >
        <div>Child content</div>
      </FilterItem>
    );

    expect(screen.getByText('Labels')).toBeInTheDocument();
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders toggle button and collapses content by default when isToggleable is true', () => {
    renderWithChakra(
      <FilterItem
        text='Filters'
        icon={ChevronDownIcon}
        isToggleable={true}
      >
        <div data-testid='child-content'>Some content</div>
      </FilterItem>
    );

    // Button should be visible
    expect(screen.queryByTestId('feed-toggle-button')).toBeInTheDocument();
    // Child content should be collapsed initially
    expect(screen.queryByTestId('child-content')).not.toBeVisible();
  });

  it('expands and collapses content on button click', async () => {
    renderWithChakra(
      <FilterItem
        text='Filters'
        icon={ChevronDownIcon}
        isToggleable={true}
      >
        <div data-testid='child-content'>Collapsible content</div>
      </FilterItem>
    );

    const button = screen.queryByTestId('feed-toggle-button');
    const content = screen.getByTestId('child-content');

    expect(content).not.toBeVisible();

    fireEvent.click(button);

    // After clicking, it should be visible
    await waitFor(() => {
      expect(content).toBeVisible();
    });

    fireEvent.click(button);

    // After clicking again, it should collapse
    await waitFor(() => {
      expect(content).not.toBeVisible();
    });
  });

  it('displays toggleCount when greater than 0', () => {
    renderWithChakra(
      <FilterItem
        text='Filters'
        icon={ChevronDownIcon}
        toggleCount={3}
        isToggleable={true}
      >
        <div>Test</div>
      </FilterItem>
    );

    expect(screen.getByText('3 selected')).toBeInTheDocument();
  });

  it('does not display toggleCount when it is 0 or undefined', () => {
    const { rerender } = renderWithChakra(
      <FilterItem
        text='Filters'
        icon={ChevronDownIcon}
        toggleCount={0}
        isToggleable={true}
      >
        <div>Test</div>
      </FilterItem>
    );

    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();

    rerender(
      <ChakraProvider>
        <FilterItem
          text='Filters'
          icon={ChevronDownIcon}
          isToggleable={true}
        >
          <div>Test</div>
        </FilterItem>
      </ChakraProvider>
    );

    expect(screen.queryByText(/selected/)).not.toBeInTheDocument();
  });
});
