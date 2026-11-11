import { render } from '@testing-library/react';
import { calculateVisibleLabelsCount } from '@util/helpers';
import { expect, vi } from 'vitest';

describe('calculateVisibleLabelsCount', () => {
  const labels = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it('returns labels.length when containerRef is null', () => {
    const result = calculateVisibleLabelsCount({
      labels,
      containerRef: { current: null }
    });

    expect(result).toBe(3);
  });

  it('counts children in first row', () => {
    const { container } = render(
      <div>
        <span>Label 1</span>
        <span>Label 2</span>
        <span>Label 3</span>
      </div>
    );

    container.firstChild.getBoundingClientRect = vi.fn().mockReturnValue({ top: 100 });

    // 2 children in first row, 1 in second row
    const children = [...container.firstChild.children];
    children[0].getBoundingClientRect = vi.fn().mockReturnValue({ top: 100 }); // first row
    children[1].getBoundingClientRect = vi.fn().mockReturnValue({ top: 100 }); // first row
    children[2].getBoundingClientRect = vi.fn().mockReturnValue({ top: 150 }); // second row

    const result = calculateVisibleLabelsCount({
      labels,
      containerRef: { current: container.firstChild }
    });

    expect(result).toBe(2);
  });
});
