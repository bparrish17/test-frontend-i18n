import { describe, it, expect } from 'vitest';
import { isCustomSummary } from '@util/helpers/initiatives.helpers';

describe('isCustomSummary', () => {
  it('should return false when initiative is undefined', () => {
    const result = isCustomSummary(undefined);
    expect(result).toBe(false);
  });

  it('should return false when initiative does not have a tags property', () => {
    const result = isCustomSummary({ id: 'value' });
    expect(result).toBe(false);
  });

  it('should return false when tags is an empty array', () => {
    const result = isCustomSummary({ tags: [] });
    expect(result).toBe(false);
  });

  it('should return false when tags does not contain "template"', () => {
    const result = isCustomSummary({ tags: ['anotherTag'] });
    expect(result).toBe(false);
  });

  it('should return true when tags contains "template"', () => {
    const result = isCustomSummary({ tags: ['template', 'otherTag'] });
    expect(result).toBe(true);
  });

  it('should return false when tags is null or undefined', () => {
    const resultNull = isCustomSummary({ tags: null });
    const resultUndefined = isCustomSummary({ tags: undefined });

    expect(resultNull).toBe(false);
    expect(resultUndefined).toBe(false);
  });
});
