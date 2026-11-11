import { renderHook } from '@testing-library/react';

import { useSourceAndReferenceCards } from '@util/helpers/insight.helpers';

describe('useSourceAndReferenceCards', () => {
  it('returns an empty array when insight is null', () => {
    const { result } = renderHook(() => useSourceAndReferenceCards(null, {}));
    expect(result.current).toEqual([]);
  });

  it('returns an empty array when insight is undefined', () => {
    const { result } = renderHook(() => useSourceAndReferenceCards(undefined, {}));
    expect(result.current).toEqual([]);
  });

  it('returns an empty array when insight has no sources or references', () => {
    const { result } = renderHook(() => useSourceAndReferenceCards({}, {}));
    expect(result.current).toEqual([]);
  });

  it('returns an array of mapped cards in order from sources and references', () => {
    const insight = {
      sources: [{ id: '1' }, { id: '2' }],
      references: [{ id: '3' }]
    };

    const fullCards = {
      1: { id: '1', title: 'Card 1' },
      2: { id: '2', title: 'Card 2' },
      3: { id: '3', title: 'Card 3' }
    };

    const { result } = renderHook(() => useSourceAndReferenceCards(insight, fullCards));
    expect(result.current).toEqual([
      { id: '1', title: 'Card 1' },
      { id: '2', title: 'Card 2' },
      { id: '3', title: 'Card 3' }
    ]);
  });

  it('filters out missing or undefined cards', () => {
    const insight = {
      sources: [{ id: '1' }, { id: '2' }],
      references: [{ id: '3' }]
    };

    const fullCards = {
      1: { id: '1', title: 'Card 1' },
      3: { id: '3', title: 'Card 3' }
    };

    const { result } = renderHook(() => useSourceAndReferenceCards(insight, fullCards));
    expect(result.current).toEqual([
      { id: '1', title: 'Card 1' },
      { id: '3', title: 'Card 3' }
    ]);
  });

  it('Handles undefined sources', () => {
    const insight = {
      sources: [{ id: '1' }, undefined],
      references: [{ id: '3' }]
    };

    const fullCards = {
      1: { id: '1', title: 'Card 1' },
      2: { id: '2', title: 'Card 2' },
      3: { id: '3', title: 'Card 3' }
    };

    const { result } = renderHook(() => useSourceAndReferenceCards(insight, fullCards));
    expect(result.current).toEqual([
      { id: '1', title: 'Card 1' },
      { id: '3', title: 'Card 3' }
    ]);
  });

  it('Handles undefined references', () => {
    const insight = {
      sources: [{ id: '1' }, { id: '3' }],
      references: [undefined]
    };

    const fullCards = {
      1: { id: '1', title: 'Card 1' },
      2: { id: '2', title: 'Card 2' },
      3: { id: '3', title: 'Card 3' }
    };

    const { result } = renderHook(() => useSourceAndReferenceCards(insight, fullCards));
    expect(result.current).toEqual([
      { id: '1', title: 'Card 1' },
      { id: '3', title: 'Card 3' }
    ]);
  });

  it('returns an empty array if no matching cards exist', () => {
    const insight = {
      sources: [{ id: '1' }],
      references: [{ id: '2' }]
    };

    const fullCards = {}; // No matching cards

    const { result } = renderHook(() => useSourceAndReferenceCards(insight, fullCards));
    expect(result.current).toEqual([]);
  });

  it('maintains the correct order of sources and references', () => {
    const insight = {
      sources: [{ id: '2' }, { id: '1' }],
      references: [{ id: '3' }]
    };

    const fullCards = {
      1: { id: '1', title: 'Card 1' },
      2: { id: '2', title: 'Card 2' },
      3: { id: '3', title: 'Card 3' }
    };

    const { result } = renderHook(() => useSourceAndReferenceCards(insight, fullCards));
    expect(result.current).toEqual([
      { id: '2', title: 'Card 2' },
      { id: '1', title: 'Card 1' },
      { id: '3', title: 'Card 3' }
    ]);
  });
});
