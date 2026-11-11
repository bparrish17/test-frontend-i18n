import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PersonCardSkeleton from '@components/person/person-card-skeleton.component';

// Mock Chakra UI components
vi.mock('@chakra-ui/react', async () => {
  const actual = await vi.importActual('@chakra-ui/react');
  return {
    ...actual,
    Skeleton: ({ children, ...props }) => (
      <div data-testid="skeleton-element" {...props}>
        {children}
      </div>
    ),
    Stack: ({ children, ...props }) => (
      <div data-testid="stack" {...props}>
        {children}
      </div>
    )
  };
});

describe('PersonCardSkeleton', () => {
  it('renders skeleton elements', () => {
    render(<PersonCardSkeleton />);
    const skeletons = screen.getAllByTestId('skeleton-element');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders with expected layout structure', () => {
    render(<PersonCardSkeleton />);
    const stacks = screen.getAllByTestId('stack');
    expect(stacks.length).toBeGreaterThan(0);
  });
});
