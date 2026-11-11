import { describe, it, expect, vi } from 'vitest';

import { maxFileSizeBytes, createFileValidator } from '@util/helpers/file.helpers';

describe('maxFileSizeBytes', () => {
  it('converts MB to bytes correctly', () => {
    expect(maxFileSizeBytes(1)).toBe(1_000_000);
    expect(maxFileSizeBytes(0)).toBe(0);
    expect(maxFileSizeBytes(2.5)).toBe(2_500_000);
  });
});

describe('createFileValidator', () => {
  const fileUnderLimit = { name: 'valid.pdf', size: 50_000_000 }; // 50MB
  const fileOverLimit = { name: 'valid.pdf', size: 350_000_000 }; // 350MB

  it('returns null and does not call onError if file is under limit', () => {
    const onError = vi.fn();
    const validator = createFileValidator({ maxSizeMB: 300 });

    const result = validator(fileUnderLimit, onError);

    expect(result).toBeNull();
    expect(onError).toHaveBeenCalledWith(null);
  });

  it('returns error object and calls onError if file is over limit', () => {
    const onError = vi.fn();
    const validator = createFileValidator({ maxSizeMB: 300 });

    const result = validator(fileOverLimit, onError);

    expect(result).toEqual({
      message: 'File size exceeds the maximum limit (300MB)',
      code: 'file-too-large'
    });
    expect(onError).toHaveBeenCalledWith(result);
  });

  it('uses custom error message if provided', () => {
    const onError = vi.fn();
    const validator = createFileValidator({
      maxSizeMB: 300,
      customMessage: 'File too large!'
    });

    const result = validator(fileOverLimit, onError);

    expect(result.message).toBe('File too large!');
    expect(result.code).toBe('file-too-large');
    expect(onError).toHaveBeenCalledWith(result);
  });

  it('handles undefined onError gracefully', () => {
    const validator = createFileValidator({ maxSizeMB: 300 });
    expect(() => validator(fileOverLimit, undefined)).not.toThrow();
  });
});
