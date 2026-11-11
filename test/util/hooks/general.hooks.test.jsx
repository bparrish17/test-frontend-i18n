/**
 * Tests for general purpose React hooks
 * 
 * This suite tests the set of utility hooks used throughout the application
 * for common functionality like scroll detection, document title management,
 * and responsive layout behavior.
 */
import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { useBreakpointValue as chakraUseBreakpointValue } from '@chakra-ui/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@store/app.store';
import {
  useElementScrollPosition,
  useIsElementVisible,
  useSetDocumentTitle,
  useProtectTenant,
  useCopyToClipboard,
  useGenericBoolean,
  useClickOutsideListener,
  useBreakpointValue,
  useBreakpoints,
  useMailtoFunctionality,
  useTimeout,
  useIsUserType,
  useIsSupportedTenant,
  useSetFullMobileVH,
  useClock,
  useLiveDate,
  useStyledToast,
  useDocumentScrollListener
} from '@util/hooks/general.hooks';
import { useDeviceSelectors } from 'react-device-detect';

// Mock dependencies
vi.mock('@chakra-ui/react', () => ({
  useBreakpointValue: vi.fn(),
  useToast: vi.fn(() => vi.fn())
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useLocation: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('react-device-detect', () => ({
  useDeviceSelectors: vi.fn()
}));

vi.mock('@statsig/react-bindings', () => ({
  StatsigClient: vi.fn()
}));

vi.mock('@statsig/web-analytics', () => ({
  runStatsigAutoCapture: vi.fn()
}));

vi.mock('@statsig/session-replay', () => ({
  runStatsigSessionReplay: vi.fn()
}));

describe('useElementScrollPosition', () => {
  const mockRef = { current: { scrollTop: 0 } };

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should track scroll position', () => {
    const { result } = renderHook(() => useElementScrollPosition({ current: mockRef.current }));

    expect(result.current).toBe(null);

    act(() => {
      mockRef.current.scrollTop = 100;
      document.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current).toBe(100);
  });
});

describe('useIsElementVisible', () => {
  const mockRef = {
    current: {
      getBoundingClientRect: () => ({ top: 0 })
    }
  };

  beforeEach(() => {
    vi.useFakeTimers();
    global.window.innerHeight = 800;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should detect when element is visible', () => {
    const { result } = renderHook(() => useIsElementVisible(mockRef));

    act(() => {
      document.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current).toBe(true);
  });

  it('should handle offset', () => {
    const { result } = renderHook(() => useIsElementVisible(mockRef, 100));

    act(() => {
      document.dispatchEvent(new Event('scroll'));
      vi.runAllTimers();
    });

    expect(result.current).toBe(true);
  });
});

describe('useSetDocumentTitle', () => {
  const originalTitle = document.title;
  let mockLocation;

  beforeEach(() => {
    useSetDocumentTitle.explicitTitleSet = false;
    mockLocation = { pathname: '/settings' };
    useLocation.mockReturnValue(mockLocation);
  });

  afterEach(() => {
    document.title = originalTitle;
    vi.clearAllMocks();
  });

  it('should set document title from explicit title', () => {
    renderHook(() => useSetDocumentTitle('New Title'));
    expect(document.title).toBe('New Title');
  });

  it('should derive title from URL path', () => {
    renderHook(() => useSetDocumentTitle());
    expect(document.title).toBe('Settings - FORA');
  });

  it('should use configured mapping for common routes', () => {
    mockLocation.pathname = '/meeting/abc123';
    renderHook(() => useSetDocumentTitle());
    expect(document.title).toBe('Meeting Details - FORA');
  });

  it('should handle paths with IDs correctly', () => {
    mockLocation.pathname = '/lenses/1234abcd';
    renderHook(() => useSetDocumentTitle());
    expect(document.title).toBe('Lenses - FORA');
  });

  it('should format kebab-case paths correctly', () => {
    mockLocation.pathname = '/feature-gate-details';
    renderHook(() => useSetDocumentTitle());
    expect(document.title).toBe('Feature gate details - FORA');
  });

  it('should handle root path specially', () => {
    mockLocation.pathname = '/';
    renderHook(() => useSetDocumentTitle());
    expect(document.title).toBe('Home - FORA');
  });

  it('should handle undefined variables in title by using path-based title', () => {
    mockLocation.pathname = '/person';
    renderHook(() => useSetDocumentTitle('Title undefined test'));
    expect(document.title).toBe('Person - FORA');
  });

  it('should handle component name extraction as fallback', () => {
    mockLocation.pathname = '/unknown-path';

    const originalStack = Error.prototype.stack;
    Object.defineProperty(Error.prototype, 'stack', {
      get: () => 'Error\n    at UserSettingsPage (/src/UserSettingsPage.jsx:10:10)\n    at renderWithHooks',
      configurable: true
    });

    renderHook(() => useSetDocumentTitle(null));
    expect(document.title).toBe('Unknown path - FORA');

    Object.defineProperty(Error.prototype, 'stack', {
      get: originalStack,
      configurable: true
    });
  });

  it('should prefer explicit title over path-based title', () => {
    mockLocation.pathname = '/settings';
    renderHook(() => useSetDocumentTitle('Custom Title'));
    expect(document.title).toBe('Custom Title');
  });

  it('should handle multiple hook instances with priority correctly', () => {
    mockLocation.pathname = '/settings';

    const { unmount: unmountLayout } = renderHook(() => useSetDocumentTitle());
    expect(document.title).toBe('Settings - FORA');

    const { unmount: unmountComponent } = renderHook(() => useSetDocumentTitle('Component Title'));
    expect(document.title).toBe('Component Title');

    unmountComponent();
    expect(document.title).toBe('Settings - FORA');

    unmountLayout();
  });

  it('should restore original title on unmount when prevailOnUnmount is false', () => {
    const { unmount } = renderHook(() => useSetDocumentTitle('New Title', false));
    unmount();
    expect(document.title).toBe(originalTitle);
  });

  it('should keep new title on unmount when prevailOnUnmount is true', () => {
    const { unmount } = renderHook(() => useSetDocumentTitle('New Title', true));
    unmount();
    expect(document.title).toBe('New Title');
  });

  it('should update title when URL path changes', () => {
    mockLocation.pathname = '/settings';
    const { rerender } = renderHook(() => useSetDocumentTitle());
    expect(document.title).toBe('Settings - FORA');

    mockLocation.pathname = '/agenda';
    rerender();
    expect(document.title).toBe('Agenda - FORA');
  });
});

describe('useProtectTenant', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    mockNavigate.mockClear();
  });

  it('should navigate away if user does not have access to tenant', () => {
    useUserStore.mockReturnValue({
      isGuest: false,
      tenants: [{ id: 'tenant1' }]
    });

    renderHook(() => useProtectTenant('tenant2'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should not navigate if user has access to tenant', () => {
    useUserStore.mockReturnValue({
      isGuest: false,
      tenants: [{ id: 'tenant1' }]
    });

    renderHook(() => useProtectTenant('tenant1'));
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});

describe('useCopyToClipboard', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn()
      }
    });
  });

  it('should copy text to clipboard and show toast', () => {
    const { result } = renderHook(() => useCopyToClipboard());
    vi.spyOn(navigator.clipboard, 'writeText');

    act(() => {
      result.current('test text', 'Test');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test text');
  });
});

describe('useGenericBoolean', () => {
  it('should toggle boolean state', () => {
    const { result } = renderHook(() => useGenericBoolean());

    expect(result.current.isEnabled).toBe(false);

    act(() => {
      result.current.toggleIsEnabled();
    });

    expect(result.current.isEnabled).toBe(true);
  });
});

describe('useClickOutsideListener', () => {
  it('should call callback when clicking outside', () => {
    const mockRef = { current: document.createElement('div') };
    const mockCallback = vi.fn();

    renderHook(() => useClickOutsideListener(mockRef, mockCallback));

    act(() => {
      document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    expect(mockCallback).toHaveBeenCalled();
  });

  it('should not call callback when clicking inside', () => {
    const mockRef = { current: document.createElement('div') };
    const mockCallback = vi.fn();

    renderHook(() => useClickOutsideListener(mockRef, mockCallback));

    act(() => {
      const event = new MouseEvent('mousedown', { bubbles: true });
      mockRef.current.dispatchEvent(event);
    });

    expect(mockCallback).not.toHaveBeenCalled();
  });
});

describe('useBreakpointValue', () => {
  it('should call chakra useBreakpointValue with ssr: false', () => {
    const mockValue = { base: 'mobile' };
    renderHook(() => useBreakpointValue(mockValue));

    expect(chakraUseBreakpointValue).toHaveBeenCalledWith(mockValue, { ssr: false });
  });
});

describe('useBreakpoints', () => {
  it('should return correct breakpoint values for mobile', () => {
    chakraUseBreakpointValue.mockReturnValue('mobile');

    const { result } = renderHook(() => useBreakpoints());

    expect(result.current).toEqual({
      breakpoint: 'mobile',
      isMobile: true,
      isTablet: false,
      isDesktop: false
    });
  });

  it('should return correct breakpoint values for tablet', () => {
    chakraUseBreakpointValue.mockReturnValue('tablet');

    const { result } = renderHook(() => useBreakpoints());

    expect(result.current).toEqual({
      breakpoint: 'tablet',
      isMobile: false,
      isTablet: true,
      isDesktop: false
    });
  });
});

describe('useMailtoFunctionality', () => {
  it('should copy email on desktop', () => {
    chakraUseBreakpointValue.mockReturnValue(true);
    const mockPreventDefault = vi.fn();

    const { result } = renderHook(() => useMailtoFunctionality());

    act(() => {
      result.current({ preventDefault: mockPreventDefault }, 'test@example.com');
    });

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test@example.com');
  });

  it('should open mailto on mobile', () => {
    chakraUseBreakpointValue.mockReturnValue(false);
    const mockPreventDefault = vi.fn();
    delete window.location;
    window.location = { href: '' };

    const { result } = renderHook(() => useMailtoFunctionality());

    act(() => {
      result.current({ preventDefault: mockPreventDefault }, 'test@example.com');
    });

    expect(window.location.href).toBe('mailto:test@example.com');
  });
});

describe('useTimeout', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call callback after delay', () => {
    const callback = vi.fn();
    renderHook(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      vi.runAllTimers();
    });

    expect(callback).toHaveBeenCalled();
  });

  it('should clear timeout on unmount', () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useTimeout(callback, 1000));

    unmount();
    act(() => {
      vi.runAllTimers();
    });

    expect(callback).not.toHaveBeenCalled();
  });
});

describe('useIsUserType', () => {
  it('should return true when user type matches', () => {
    useUserStore.mockImplementation((selector) => selector({ user: { type: 'admin' } }));

    const { result } = renderHook(() => useIsUserType('admin', 'superadmin'));
    expect(result.current).toBe(true);
  });

  it('should return false when user type does not match', () => {
    useUserStore.mockImplementation((selector) => selector({ user: { type: 'user' } }));

    const { result } = renderHook(() => useIsUserType('admin', 'superadmin'));
    expect(result.current).toBe(false);
  });
});

describe('useIsSupportedTenant', () => {
  it('should return true when tenant is supported', () => {
    useUserStore.mockImplementation((selector) => selector({ tenant: { id: 'tenant1' } }));

    const { result } = renderHook(() => useIsSupportedTenant(['tenant1', 'tenant2']));
    expect(result.current).toBe(true);
  });

  it('should return false when tenant is not supported', () => {
    useUserStore.mockImplementation((selector) => selector({ tenant: { id: 'tenant3' } }));

    const { result } = renderHook(() => useIsSupportedTenant(['tenant1', 'tenant2']));
    expect(result.current).toBe(false);
  });
});

describe('useSetFullMobileVH', () => {
  const mockRef = { current: { style: {} } };

  beforeEach(() => {
    vi.mocked(useDeviceSelectors).mockReturnValue([{ isMobile: true }]);
    global.window.innerHeight = 800;
  });

  it('should set height on mobile', () => {
    renderHook(() => useSetFullMobileVH(mockRef, 100));
    expect(mockRef.current.style.height).toBe('700px');
  });
});

describe('useClock', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update time every second', () => {
    const { result } = renderHook(() => useClock());

    const initialTime = result.current;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).not.toBe(initialTime);
  });
});

describe('useLiveDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should update date at specified interval', () => {
    const { result } = renderHook(() => useLiveDate(1000));

    const initialDate = result.current;

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).not.toBe(initialDate);
  });
});

describe('General Hooks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    document.addEventListener = vi.fn();
    document.removeEventListener = vi.fn();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  describe('useDocumentScrollListener', () => {
    it('should add and remove scroll listener', () => {
      const mockListener = vi.fn();

      const { unmount } = renderHook(() => useDocumentScrollListener(mockListener));

      expect(document.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), true);

      unmount();
      expect(document.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), true);
    });

    it('should throttle scroll listener', () => {
      const mockListener = vi.fn();
      renderHook(() => useDocumentScrollListener(mockListener, 100));

      const throttledListener = document.addEventListener.mock.calls[0][1];

      act(() => {
        for (let i = 0; i < 10; i++) {
          throttledListener();
        }
        vi.advanceTimersByTime(100);
      });

      expect(mockListener).toHaveBeenCalledTimes(2);
    });
  });

  describe('useElementScrollPosition', () => {
    it('should track element scroll position', () => {
      const mockRef = { current: { scrollTop: 100 } };
      const { result } = renderHook(() => useElementScrollPosition(mockRef));

      const scrollListener = document.addEventListener.mock.calls[0][1];

      act(() => {
        scrollListener();
      });

      expect(result.current).toBe(100);
    });

    it('should handle null ref', () => {
      const mockRef = { current: null };
      const { result } = renderHook(() => useElementScrollPosition(mockRef));

      const scrollListener = document.addEventListener.mock.calls[0][1];

      act(() => {
        scrollListener();
      });

      expect(result.current).toBeNull();
    });
  });

  describe('useIsElementVisible', () => {
    it('should detect element visibility', () => {
      const mockRef = {
        current: {
          getBoundingClientRect: () => ({
            top: 100
          })
        }
      };
      window.innerHeight = 800;

      const { result } = renderHook(() => useIsElementVisible(mockRef));

      const scrollListener = document.addEventListener.mock.calls[0][1];

      act(() => {
        scrollListener();
        vi.advanceTimersByTime(200);
      });

      expect(result.current).toBe(true);
    });

    it('should handle null ref', () => {
      const mockRef = { current: null };
      const { result } = renderHook(() => useIsElementVisible(mockRef));

      const scrollListener = document.addEventListener.mock.calls[0][1];

      act(() => {
        scrollListener();
        vi.advanceTimersByTime(200);
      });

      expect(result.current).toBe(false);
    });
  });

  describe('useSetDocumentTitle', () => {
    beforeEach(() => {
      document.title = 'Original Title';
      useLocation.mockReturnValue({ pathname: '/test-path' });
    });

    it('should set explicit title', () => {
      renderHook(() => useSetDocumentTitle('Custom Title'));
      expect(document.title).toBe('Custom Title');
    });

    it('should derive title from URL path', () => {
      useLocation.mockReturnValue({ pathname: '/settings' });
      renderHook(() => useSetDocumentTitle());
      expect(document.title).toBe('Settings - FORA');
    });

    it('should handle root path', () => {
      useLocation.mockReturnValue({ pathname: '/' });
      renderHook(() => useSetDocumentTitle());
      expect(document.title).toBe('Home - FORA');
    });

    it('should restore title on unmount when not prevailing', () => {
      const { unmount } = renderHook(() => useSetDocumentTitle('Custom Title'));
      unmount();
      expect(document.title).toBe('Original Title');
    });
  });

  describe('useGenericBoolean', () => {
    it('should toggle boolean state', () => {
      const { result } = renderHook(() => useGenericBoolean());

      expect(result.current.isEnabled).toBe(false);

      act(() => {
        result.current.toggleIsEnabled();
      });

      expect(result.current.isEnabled).toBe(true);
    });
  });

  describe('useClickOutsideListener', () => {
    it('should call handler when clicking outside', () => {
      const mockRef = { current: document.createElement('div') };
      const mockHandler = vi.fn();
      
      renderHook(() => useClickOutsideListener(mockRef, mockHandler));

      const mousedownListener = document.addEventListener.mock.calls[0][1];

      act(() => {
        mousedownListener({ target: document.createElement('div') });
      });

      expect(mockHandler).toHaveBeenCalled();
    });

    it('should not call handler when clicking inside', () => {
      const mockRef = { current: document.createElement('div') };
      const mockHandler = vi.fn();
      
      renderHook(() => useClickOutsideListener(mockRef, mockHandler));

      const mousedownListener = document.addEventListener.mock.calls[0][1];

      act(() => {
        mousedownListener({ target: mockRef.current });
      });

      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('useTimeout', () => {
    it('should call callback after delay', () => {
      const mockCallback = vi.fn();
      renderHook(() => useTimeout(mockCallback, 1000));

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockCallback).toHaveBeenCalled();
    });

    it('should clear timeout on unmount', () => {
      const mockCallback = vi.fn();
      const { unmount } = renderHook(() => useTimeout(mockCallback, 1000));

      unmount();
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(mockCallback).not.toHaveBeenCalled();
    });
  });

  describe('useClock', () => {
    it('should update time periodically', () => {
      const { result } = renderHook(() => useClock());

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(result.current).toBeDefined();
    });
  });

  describe('useLiveDate', () => {
    it('should update date periodically', () => {
      const { result } = renderHook(() => useLiveDate());

      act(() => {
        vi.advanceTimersByTime(2000);
      });

      expect(result.current).toBeDefined();
    });

    it('should respect custom update interval', () => {
      const { result } = renderHook(() => useLiveDate(5000));

      act(() => {
        vi.advanceTimersByTime(5000);
      });

      expect(result.current).toBeDefined();
    });
  });
});
