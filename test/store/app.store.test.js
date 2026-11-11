import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import store from 'storejs';
import { setWithExpiration, getWithExpiration } from '@store/app.store';

// Mock storejs
vi.mock('storejs', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    default: {
      set: vi.fn(),
      get: vi.fn(),
      remove: vi.fn()
    }
  };
});

describe('setWithExpiration', () => {
  const key = 'test-key';
  const value = 'test-value';
  const ttl = 5 * 60 * 1000; // 5 minutes in ms

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers(); // Use fake timers for controlled time behavior
    vi.spyOn(store, 'set');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should store the value with expiry time', () => {
    const fakeNow = new Date().getTime();
    vi.setSystemTime(fakeNow); // Freeze time

    const returnedData = setWithExpiration(key, value, ttl);

    // Expected stored data
    const expectedData = {
      value,
      expiry: fakeNow + ttl
    };

    expect(store.set).toHaveBeenCalledWith(key, expectedData);
    expect(returnedData).toEqual(expectedData);
  });
});

describe('getWithExpiration', () => {
  const key = 'test-key';
  const value = 'test-value';
  let fakeNow;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    fakeNow = new Date().getTime();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return the value if it has not expired', () => {
    // Mock the store.get response with unexpired data
    store.get.mockReturnValue({
      value,
      expiry: fakeNow + 1000 // 1 second in the future
    });

    vi.setSystemTime(fakeNow); // Freeze time
    const result = getWithExpiration(key);

    expect(result).toBe(value);
    expect(store.remove).not.toHaveBeenCalled();
  });

  it('should return null and remove the key if it has expired', () => {
    // Mock the store.get response with expired data
    store.get.mockReturnValue({
      value,
      expiry: fakeNow - 1000 // 1 second in the past
    });

    vi.setSystemTime(fakeNow); // Freeze time
    const result = getWithExpiration(key);

    expect(result).toBeNull();
    expect(store.remove).toHaveBeenCalledWith(key);
  });

  it('should return null if the key does not exist', () => {
    store.get.mockReturnValue(null); // Key does not exist

    const result = getWithExpiration(key);

    expect(result).toBeNull();
    expect(store.remove).not.toHaveBeenCalled();
  });
});
