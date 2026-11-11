import {
  useBreakpointValue as chakraUseBreakpointValue,
  useToast as useChakraToast
} from '@chakra-ui/react';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { assign, throttle } from 'lodash-es';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeviceSelectors } from 'react-device-detect';
import { useUserStore } from '@store/app.store';
import { format } from 'date-fns';
import StyledToast from '@components/general/styled-toast.component';

/**
 * Adds a throttled scroll listener to the document
 *
 * @param {Function} listener - Function to call on scroll events
 * @param {number} [throttleTime=100] - Time in ms to throttle the listener
 */
export function useDocumentScrollListener(listener, throttleTime = 100) {
  const throttledListener = throttle(listener, throttleTime);
  useEffect(() => {
    document.addEventListener('scroll', throttledListener, true);
    return () => document.removeEventListener('scroll', throttledListener, true);
  }, []);
}

/**
 * Tracks scroll position of a referenced element
 *
 * @param {React.RefObject} ref - Reference to DOM element to track
 * @returns {number|null} Current scroll position in pixels
 */
export function useElementScrollPosition(ref) {
  const [scrollPosition, setScrollPosition] = useState(null);
  const currentElement = ref;

  const onScroll = () => {
    if (currentElement.current) {
      setScrollPosition(currentElement.current.scrollTop);
    }
  };

  useDocumentScrollListener(onScroll);

  return scrollPosition;
}

/**
 * Detects if element is in viewport
 *
 * @param {React.RefObject} ref - Reference to DOM element
 * @param {number} [offset=0] - Offset to apply to visibility calculation
 * @returns {boolean} Whether element is visible
 */
export function useIsElementVisible(ref, offset = 0) {
  const [isVisible, setIsVisible] = useState(false);
  const currentElement = ref;

  const onScroll = () => {
    if (!currentElement.current) {
      setIsVisible(false);
      return;
    }
    const top = currentElement.current.getBoundingClientRect().top;
    const nextIsVisible = top + offset >= 0 && top - offset <= window.innerHeight;
    setIsVisible(nextIsVisible);
  };

  useDocumentScrollListener(onScroll, 200);

  return isVisible;
}

/**
 * Hook to set and manage document title with smart fallbacks and priority handling.
 *
 * This hook manages the document title with a priority-based approach:
 * 1. Explicit title provided to the hook (highest priority)
 * 2. URL path-based automatic title
 * 3. Component name from call stack
 * 4. Default 'FORA' fallback (lowest priority)
 *
 * When used in layouts and components simultaneously, component-level titles take precedence.
 * The hook also handles title resetting on component unmount.
 *
 * @example
 * // With no arguments - derives title from URL path or component name
 * useSetDocumentTitle(); // "Settings - FORA" or "Agenda - FORA"
 *
 * @example
 * // With explicit title - highest priority
 * useSetDocumentTitle('My Custom Page - FORA');
 *
 * @example
 * // In a layout component - provides automatic titles for all pages
 * // but won't override explicit titles set by child components
 * function PageLayout() {
 *   useSetDocumentTitle();
 *   // ...
 * }
 *
 * @param {string} [title] - Optional explicit title to set. If omitted, derives title automatically.
 * @param {boolean} [prevailOnUnmount=false] - Whether to keep the title when component unmounts.
 */
export function useSetDocumentTitle(title, prevailOnUnmount = false) {
  const defaultTitle = useRef(document.title);
  const location = useLocation();

  // Use a ref to track if this instance of the hook has set a title explicitly
  const hasExplicitTitle = useRef(!!title && !title.includes('undefined'));

  // Register this instance's explicit title status
  useEffect(() => {
    // Update when the title prop changes
    hasExplicitTitle.current = !!title && !title.includes('undefined');
  }, [title]);

  /**
   * Derives a user-friendly page title from multiple sources with fallbacks.
   * Priority of sources:
   * 1. Special mappings for common routes (like 'Home', 'Settings', etc.)
   * 2. URL path segments converted to Title Case
   * 3. Component name from call stack
   *
   * @returns {string} The derived page title with "- FORA" suffix
   * @private
   */
  const getComponentName = () => {
    // Try using location pathname first as it's more reliable
    try {
      // Special case for root path
      if (location.pathname === '/') {
        return 'Home - FORA';
      }

      // Route name mapping for common paths
      const routeNameMap = {
        settings: 'Settings',
        agenda: 'Agenda',
        meeting: 'Meeting Details',
        lenses: 'Lenses',
        focuses: 'Focuses',
        digests: 'Digests',
        cards: 'Meeting Cards',
        person: 'Person',
        organizations: 'Organization',
        'fora-testing': 'Fora Testing',
        logout: 'Logging Out'
      };

      // Get the first segment of the path for mapping
      const pathSegments = location.pathname.split('/').filter(Boolean);

      if (pathSegments.length > 0) {
        const firstSegment = pathSegments[0];

        // Check if we have a predefined name for this route
        if (routeNameMap[firstSegment]) {
          return `${routeNameMap[firstSegment]} - FORA`;
        }

        // Otherwise, use the last segment for naming
        let lastSegment = pathSegments[pathSegments.length - 1];

        // If it's a path parameter (like an ID), use the previous segment
        const idRegex = /^[0-9a-f-]+$/;
        const idMatch = idRegex.exec(lastSegment);
        if (idMatch) {
          lastSegment =
            pathSegments.length > 1 ? pathSegments[pathSegments.length - 2] : lastSegment;
        }

        // Convert kebab-case to Title Case
        const pathName = lastSegment
          .replace(/[:-]/g, ' ')
          .split(/[-_]/)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' ');

        return `${pathName} - FORA`;
      }
    } catch (e) {
      // Fall back to call stack if location is not available
      console.warn('Failed to determine title from location path:', e);
    }

    // Get the call stack as fallback
    const stack = new Error().stack;

    // Try to find any page component in the call stack
    const pageRegex = /at ([A-Z][a-zA-Z0-9]*)Page/;
    const componentNameMatch = pageRegex.exec(stack);

    if (componentNameMatch?.[1]) {
      // Format component name by removing "Page" suffix and adding spaces between camel case
      const name = componentNameMatch[1].replace(/([a-z])([A-Z])/g, '$1 $2');
      return `${name} - FORA`;
    }

    // Try to find any component-like name if the Page suffix doesn't match
    const componentRegex = /at ([A-Z][a-zA-Z0-9]*Component)/;
    const alternateMatch = componentRegex.exec(stack);
    if (alternateMatch?.[1]) {
      const name = alternateMatch[1].replace(/Component$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
      return `${name} - FORA`;
    }

    return 'FORA';
  };

  // Create a static variable to track which hook instance has set an explicit title
  useSetDocumentTitle.explicitTitleSet = useSetDocumentTitle.explicitTitleSet || false;

  useEffect(() => {
    if (hasExplicitTitle.current) {
      // This instance has an explicit title, so it should set the title
      document.title = title;
      useSetDocumentTitle.explicitTitleSet = true;
    } else if (!useSetDocumentTitle.explicitTitleSet) {
      // No other instance has set an explicit title, so use the automatic one
      document.title = getComponentName();
    }

    // Clean up when unmounting
    return () => {
      if (hasExplicitTitle.current) {
        // If this instance set an explicit title, reset the flag when it unmounts
        useSetDocumentTitle.explicitTitleSet = false;
      }
    };
  }, [title, location.pathname]);

  // Handle unmount title restoration
  useEffect(
    () => () => {
      if (!prevailOnUnmount && !useSetDocumentTitle.explicitTitleSet) {
        document.title = defaultTitle.current;
      }
    },
    []
  );
}

/**
 * Protects routes by tenant, redirecting if user doesn't have access
 *
 * @param {string} tenantId - ID of the tenant to verify access for
 */
export const useProtectTenant = (tenantId) => {
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !tenantId) {
      return;
    }

    if (!user.isGuest && !user?.tenants?.find((t) => t.id === tenantId)) {
      navigate('/');
    }
  }, [user, tenantId, navigate]);
};

/**
 * Creates a function that copies text to clipboard and shows a toast
 *
 * @param {boolean} showToast
 * @returns {Function} Copy function that takes text and optional name
 */
export const useCopyToClipboard = (showToast = true) => {
  const toast = useChakraToast();

  return (text, textName) => {
    navigator.clipboard.writeText(text);
    const prefix = textName ? `${textName} c` : 'C';
    const toastConfig = {
      title: `${prefix}opied to clipboard`,
      status: 'success',
      isClosable: true
    };
    showToast && toast(toastConfig);
  };
};

/**
 * Simple boolean toggle hook
 *
 * @returns {Object} Object with isEnabled state and toggle function
 */
export const useGenericBoolean = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleIsEnabled = () => setIsEnabled(!isEnabled);
  return { isEnabled, toggleIsEnabled };
};

/**
 * Hook that handles clicks outside a referenced element
 *
 * @param {React.RefObject} ref - Reference to DOM element
 * @param {Function} onClickOutside - Function to call when click is outside element
 */
export const useClickOutsideListener = (ref, onClickOutside) => {
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        onClickOutside();
      }
    };
    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [ref]);
};
/*

BREAKPOINTS:

|--------|----|-------------|-------------------------------------------------------------------------------------------|
| Pixels | EM | Chakra Size | Examples                                                                                  |
|--------|----|-------------|-------------------------------------------------------------------------------------------|
|      0 |  0 | base        | iPhone SE (375px), iPhone 12 Pro (390px), iPhone XR (414px), iPhone 14 Pro Max (430px)    |
|    480 | 30 | sm          | Surface Duo (540px)                                                                       |
|    768 | 48 | md          | iPad Mini (768px), iPad Air (820px), Surface Pro 7 (912px)                                |
|    992 | 62 | lg          | iPad Pro (1024px)                                                                         |
|   1280 | 80 | xl          | Macbook Pro, 1440p Resolution/2K (1440px)                                                 |
|   1536 | 96 | 2xl         |                                                                                           |
|--------|----|-------------|-------------------------------------------------------------------------------------------|
*/

/**
 * Wrapper around Chakra's useBreakpointValue that always disables SSR
 *
 * @param {any[] | Partial<Record<string, any>>} val - Responsive values to be resolved based on breakpoint
 * @returns {any} The value for the current breakpoint
 */
export const useBreakpointValue = (val) => {
  return chakraUseBreakpointValue(val, { ssr: false });
};

/**
 * Hook that provides current responsive breakpoint with convenience flags
 * for mobile, tablet, and desktop
 *
 * @returns {{
 *  breakpoint: 'mobile' | 'tablet' | 'desktop';
 *  isMobile: boolean;
 *  isTablet: boolean;
 *  isDesktop: boolean;
 * }} Breakpoint information object
 */
export const useBreakpoints = () => {
  const breakpoint = useBreakpointValue({
    base: 'mobile',
    sm: 'mobile',
    md: 'tablet',
    lg: 'tablet',
    xl: 'desktop'
  });
  return {
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop'
  };
};

/**
 * Hook for email handling that uses click handler based on breakpoint
 *
 * @returns {Function} Click handler for email actions
 */
export const useMailtoFunctionality = () => {
  const shouldCopy = useBreakpointValue({ base: false, xl: true });
  const copyToClipboard = useCopyToClipboard();

  const onClick = (e, email, copyToastText = 'Email') => {
    if (shouldCopy) {
      copyToClipboard(email, copyToastText);
    } else {
      window.location.href = `mailto:${email}`;
      e?.preventDefault();
    }
  };

  return onClick;
};

/**
 * Hook for creating a timeout effect
 *
 * @param {Function} callback - Function to call after timeout
 * @param {number} delay - Delay in milliseconds
 */
export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const id = setTimeout(() => {
      savedCallback.current();
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [delay]);
}

/**
 * Hook to check if current user is of specified types
 *
 * @param {...string} types - User types to check
 * @returns {boolean} Whether user is of specified types
 */
export const useIsUserType = (...types) => {
  const userType = useUserStore((state) => state?.user?.type);
  const allowedTypes = new Set(types);

  return allowedTypes.has(userType);
};

/**
 * Hook to check if current tenant is in supported list
 *
 * @param {string[]} tenantIds - List of supported tenant IDs
 * @returns {boolean} Whether current tenant is supported
 */
export const useIsSupportedTenant = (tenantIds) => {
  const tenantId = useUserStore((state) => state?.tenant?.id);
  return tenantIds.includes(tenantId);
};

/**
 * Workaround for iOS where calc() CSS function doesn't work properly
 * Sets element height to viewport height minus an offset using JavaScript
 *
 * @param {React.RefObject} elRef - Reference to DOM element to modify
 * @param {number} offset - Pixels to subtract from viewport height
 */
export const useSetFullMobileVH = (elRef, offset) => {
  const [selectors] = useDeviceSelectors();

  useLayoutEffect(() => {
    if (selectors.isMobile && elRef.current) {
      elRef.current.style.height = `${window.innerHeight - offset}px`;
    }
  }, [selectors.isMobile, elRef]);
};

/**
 * Hook that provides the current time, updating at regular intervals
 *
 * @param {'p'|'pp'} dateFormat - Date-fns format to use
 * @returns {string} Formatted time string
 */
export const useClock = (dateFormat = 'pp') => {
  const [time, setTime] = useState(format(new Date(), dateFormat));

  useEffect(() => {
    const interval = setInterval(() => setTime(format(new Date(), dateFormat)), 1000);
    return () => clearInterval(interval);
  }, []);

  return time;
};

/**
 * Hook that provides a Date object that updates at regular intervals
 *
 * @param {number} [updateInterval=2000] - Milliseconds between updates
 * @returns {Date} Current date
 */
export const useLiveDate = (updateInterval = 2000) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, updateInterval);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return date;
};

/**
 * Hook that provides a styled toast with improved functionality
 *
 * @returns {import('@chakra-ui/react').CreateToastFnReturn}
 * Enhanced toast function with additional styling capabilities
 */
export const useStyledToast = () => {
  const toast = useChakraToast();

  /**
   * Creates and configures a toast notification with enhanced styling
   *
   * @param {import('@chakra-ui/react').UseToastOptions} options - Toast configuration options
   * @returns {any} Toast instance
   */
  const openToastFn = (options) =>
    toast({
      position: 'bottom',
      duration: 4000,
      // defaults
      render: ({ onClose }) => (
        <StyledToast
          {...options}
          {...toast}
          onClose={onClose}
          zIndex={999999999}
        />
      ),
      ...options
    });

  return assign(openToastFn, toast);
};
