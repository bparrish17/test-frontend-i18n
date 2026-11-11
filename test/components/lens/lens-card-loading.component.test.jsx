import React from 'react';
import { vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import LensCardLoading from '@components/lens/lens-card-loading.component';

describe('LensCardLoading', () => {
  it('renders skeleton components in the correct order based on parent', () => {
    render(<LensCardLoading />);

    // Get the parent of the first SkeletonCircle (first stack)
    const circles = screen.getAllByTestId('mock-skeleton-circle');

    // Check the order of elements inside the first stack
    const firstStackChildren = circles[0].parentElement.children;
    expect(firstStackChildren[0]).toHaveAttribute('data-testid', 'mock-skeleton-circle');
    expect(firstStackChildren[1]).toHaveAttribute('data-testid', 'mock-skeleton');
    expect(firstStackChildren[2]).toHaveAttribute('data-testid', 'mock-skeleton');
    expect(firstStackChildren[3]).toHaveAttribute('data-testid', 'mock-skeleton-text');

    // Check the order of elements inside the second stack
    const secondStackChildren = circles[1].parentElement.children;
    expect(secondStackChildren[0]).toHaveAttribute('data-testid', 'mock-skeleton-circle');
    expect(secondStackChildren[1]).toHaveAttribute('data-testid', 'mock-skeleton');
  });
});
