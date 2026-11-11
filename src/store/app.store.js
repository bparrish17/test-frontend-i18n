import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { isAfter } from 'date-fns';
import { omit, pick, set as _set } from 'lodash-es';
import store from 'storejs';

import { authenticate, deleteSession } from '@services/query-services/people.query-service';
import {
  authenticateWithGoogle,
  authenticateWithMicrosoft,
  authenticateWithOkta
} from '@services/oauth.service';
import { getById } from '@services/query-services/default.query-service';
import { createRef } from 'react';
import { makeApolloRequest } from '@services/query-services/apollo.query-service';
import { clearUserFromRollbar, registerUserWithRollbar } from '@util/helpers';
import { clearFeatureGatesCache, initializeFeatureGates } from '@store/feature-gates.store';

const localStorageInterface = store;

/**
 * Zustand store for managing user authentication, session data, and tenant information.
 * It handles various authentication methods (Google, Microsoft, Okta, email/password),
 * session persistence in localStorage, and interactions with Rollbar and feature gates.
 *
 * @property {object|null} user - The current authenticated user object, or null if not authenticated.
 * @property {object|null} tenant - The current tenant object associated with the user, or null.
 * @property {Function} authenticateWithGoogle - Authenticates the user via Google OAuth.
 * @property {Function} authenticateWithMicrosoft - Authenticates the user via Microsoft OAuth.
 * @property {Function} authenticateWithOkta - Authenticates the user via Okta OAuth.
 * @property {Function} authenticate - Authenticates the user with email and password.
 * @property {Function} isAuthenticated - Checks if a valid session exists in localStorage.
 * @property {Function} getFromLocalStorage - Retrieves and validates the session from localStorage.
 * @property {Function} setSessionData - Sets user and tenant data after successful authentication, storing it in localStorage and initializing feature gates.
 * @property {Function} setGuestSessionData - Sets session data for guest users.
 * @property {Function} refreshSessionTenant - Refreshes tenant data within the current session.
 * @property {Function} setFromLocalStorage - Loads user and tenant state from localStorage, registering user with Rollbar.
 * @property {Function} logout - Clears session data, logs out the user, and clears Rollbar/feature gate context.
 * @property {Function} setUser - Updates the user object in the store and localStorage.
 * @property {Function} setScrollPosition - Stores a scroll position in localStorage.
 * @property {Function} getScrollPosition - Retrieves a stored scroll position from localStorage.
 * @property {Function} setGeneratingSummary - Stores data about a summary being generated, with expiration.
 * @property {Function} getGeneratingSummary - Retrieves data about a summary being generated, respecting expiration.
 * @property {Function} removeGeneratingSummary - Removes data about a summary being generated.
 * @property {Function} getSessionId - Retrieves the current session ID from localStorage.
 * @property {boolean} isCustomSummaryModalOpen - State for custom summary modal visibility.
 * @property {Function} setIsCustomSummaryModalOpen - Sets the custom summary modal visibility state.
 * @property {object|null} outageMessageVisibility - State for outage message visibility.
 * @property {Function} getOutageMessageVisibility - Retrieves outage message visibility from localStorage.
 * @property {Function} setOutageMessageVisibility - Sets and stores outage message visibility.
 */
export const useUserStore = create((set, get) => ({
  user: null,
  tenant: null,

  /**
   * Authenticates user with Google OAuth, then sets session data.
   * @param {string} accessToken - Google access token.
   * @async
   */
  authenticateWithGoogle: async (accessToken) => {
    const sessionData = await authenticateWithGoogle(accessToken);
    const isGuest = sessionData?.guest || false;
    if (isGuest) {
      await get().setGuestSessionData(sessionData);
    } else {
      await get().setSessionData(sessionData);
    }
  },

  /**
   * Authenticates user with Microsoft OAuth, then sets session data.
   * @param {string} accessToken - Microsoft access token.
   * @param {string} idToken - Microsoft ID token.
   * @async
   */
  authenticateWithMicrosoft: async (accessToken, idToken) => {
    const sessionData = await authenticateWithMicrosoft(accessToken, idToken);
    const isGuest = sessionData?.guest || false;
    if (isGuest) {
      await get().setGuestSessionData(sessionData);
    } else {
      await get().setSessionData(sessionData);
    }
  },

  /**
   * Authenticates user with Okta OAuth, then sets session data.
   * @param {string} accessToken - Okta access token.
   * @param {string} idToken - Okta ID token.
   * @param {string} domain - Okta domain.
   * @param {string} realm - Okta realm.
   * @async
   */
  authenticateWithOkta: async (accessToken, idToken, domain, realm) => {
    const sessionData = await authenticateWithOkta(accessToken, idToken, domain, realm);
    const isGuest = sessionData?.guest || false;
    if (isGuest) {
      await get().setGuestSessionData(sessionData);
    } else {
      await get().setSessionData(sessionData);
    }
  },

  /**
   * Authenticates user with email/password, then sets session data.
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @async
   */
  authenticate: async (email, password) => {
    const sessionData = await authenticate(email, password);
    await get().setSessionData(sessionData);
  },

  /**
   * Checks if the user is currently authenticated by validating the session in localStorage.
   * A session is valid if it exists and has not expired.
   * @returns {boolean} True if the user is authenticated, false otherwise.
   */
  isAuthenticated: () => {
    const session = get().getFromLocalStorage();
    return !!session;
  },

  /**
   * Retrieves session data from localStorage if it exists and is not expired.
   * If expired, the session is removed from localStorage.
   * @returns {Object|null} Session data object, or null if no valid session is found.
   */
  getFromLocalStorage: () => {
    const session = localStorageInterface.get('session');
    if (!session) {
      return null;
    }

    const expirationDate = new Date(session?.expires_at);
    const now = new Date();
    if (isAfter(now, expirationDate)) {
      localStorageInterface.remove('session');
      localStorageInterface.remove('sessionID');
      return null;
    }

    return session;
  },

  /**
   * Sets the user session data in localStorage and updates the store state.
   * Fetches full tenant and Apollo person details to enrich the session.
   * Initializes feature gates after setting the session.
   * @param {Object} sessionData - Session data received from an authentication process.
   * @async
   */
  setSessionData: async (sessionData) => {
    localStorageInterface.set('sessionID', sessionData.id);
    const tenant = await getById({ model: 'tenants', id: sessionData?.tenants[0]?.id });
    const { value: apolloPerson } = await makeApolloRequest({
      method: 'GET',
      endpoint: '/people/item',
      params: { email: sessionData?.person?.email }
    }).catch((err) => {
      console.warn('failed to get apollo user: ', err);
      return { value: null };
    });

    _set(sessionData, ['person', 'apollo_profile'], apolloPerson);
    _set(sessionData, ['person', 'tenants', 0], tenant);
    _set(sessionData, ['tenants', 0], tenant);
    localStorageInterface.set('session', sessionData);
    get().setFromLocalStorage();

    try {
      await initializeFeatureGates(true);
    } catch (e) {
      console.error('Failed to initialize feature gates after login', e);
    }
  },

  /**
   * Sets guest user session data in localStorage and updates the store state.
   * @param {Object} sessionData - Guest session data.
   * @async
   */
  setGuestSessionData: async (sessionData) => {
    const sessionPersonProps = ['id', 'email', 'name', 'first_name', 'last_name'];
    const person = { ...pick(sessionData, sessionPersonProps), isGuest: true };
    _set(sessionData, ['person'], person);

    localStorageInterface.set('sessionID', sessionData.id);
    localStorageInterface.set('session', sessionData);

    get().setFromLocalStorage();
  },

  /**
   * Refreshes the tenant data within the current session stored in localStorage.
   * @param {string} tenantId - The ID of the tenant to refresh.
   * @async
   */
  refreshSessionTenant: async (tenantId) => {
    const tenant = await getById({ model: 'tenants', id: tenantId });
    const sessionData = localStorageInterface.get('session');

    _set(sessionData, ['person', 'tenants', 0], tenant);
    localStorageInterface.set('session', sessionData);
    get().setFromLocalStorage();
  },

  /**
   * Sets user and tenant state from data stored in localStorage.
   * Also registers the user with Rollbar if a valid session exists.
   * Clears user and tenant state and Rollbar context if no valid session is found.
   */
  setFromLocalStorage: () => {
    try {
      const session = get().getFromLocalStorage();
      if (session === null) {
        set({ user: null, tenant: null });
        clearUserFromRollbar();
        return;
      }
      set({ user: session.person });

      const tenants = session?.person?.tenants;
      if (tenants) {
        set({ tenant: tenants[0] });
      }
      registerUserWithRollbar(session.person);
    } catch (e) {
      console.error('Could not decode session or set user from local storage', e);
      localStorageInterface.remove('session');
      localStorageInterface.remove('sessionID');
      set({ user: null, tenant: null });
      clearUserFromRollbar();
    }
  },

  /**
   * Logs out the current user.
   * Deletes the session from the backend, clears feature gates cache,
   * removes session data from localStorage, and clears user/tenant state and Rollbar context.
   * @async
   */
  logout: async () => {
    const sessionId = localStorageInterface.get('sessionID');
    try {
      if (sessionId) {
        await deleteSession(sessionId);
      }
    } catch (e) {
      console.error('Error deleting session during logout', e);
    }

    try {
      clearFeatureGatesCache();
    } catch (e) {
      console.error('Error clearing feature gates cache during logout', e);
    }

    useUserMSALStore.persist.clearStorage();
    localStorageInterface.remove('session');
    localStorageInterface.remove('sessionID');
    set({ user: null });
    set({ tenant: null });
    clearUserFromRollbar();
  },

  /**
   * Updates the user object in the store and localStorage.
   * @param {Object} newUser - The new user data to set. Tenant information within newUser is omitted.
   */
  setUser: (newUser) => {
    const session = localStorageInterface.get('session');
    const updatedSession = {
      ...session,
      person: { ...session.person, ...omit(newUser, 'tenants') }
    };
    localStorageInterface.set('session', updatedSession);
    set({ user: newUser });
  },

  /**
   * Sets a scroll position value in localStorage and the store state.
   * @param {number} position - The scroll position to store.
   */
  setScrollPosition: (position) => {
    localStorageInterface.set('scrollPosition', position);
    set({ scrollPosition: position });
  },

  /**
   * Retrieves the stored scroll position from localStorage.
   * @returns {number|null} The stored scroll position, or null if not set.
   */
  getScrollPosition: () => {
    return localStorageInterface.get('scrollPosition');
  },

  /**
   * Stores data about a summary generation process with an expiration time (TTL).
   * @param {Object} generatingSummaryData - Data related to the summary generation.
   */
  setGeneratingSummary: (generatingSummaryData) => {
    const ttl = 60 * 1000;
    const data = setWithExpiration('generating-summary-data', generatingSummaryData, ttl);
    set(data);
  },

  /**
   * Retrieves data about an ongoing summary generation, respecting its expiration time.
   * @returns {any|null} The stored summary generation data, or null if expired or not set.
   */
  getGeneratingSummary: () => {
    return getWithExpiration('generating-summary-data');
  },

  /**
   * Removes the data related to summary generation from localStorage.
   */
  removeGeneratingSummary: () => {
    return localStorageInterface.remove('generating-summary-data');
  },

  /**
   * Retrieves the current session ID from localStorage.
   * @returns {string|null} The session ID, or null if not set.
   */
  getSessionId: () => {
    return localStorageInterface.get('sessionID');
  },

  isCustomSummaryModalOpen: false,
  /**
   * Sets the visibility state of the custom summary modal.
   * @param {boolean} isOpen - True to open the modal, false to close.
   */
  setIsCustomSummaryModalOpen: (isOpen) => set({ isCustomSummaryModalOpen: isOpen }),

  outageMessageVisibility: null,
  /**
   * Retrieves the outage message visibility state from localStorage and updates the store.
   */
  getOutageMessageVisibility: () => {
    set({ outageMessageVisibility: localStorageInterface.get('outageMessageVisibility') });
  },

  /**
   * Sets the outage message visibility state in both the store and localStorage.
   * @param {any} outageMessageVisibility - The visibility state to set.
   */
  setOutageMessageVisibility: (outageMessageVisibility) => {
    localStorageInterface.set(
      'outageMessageVisibility',
      JSON.stringify({ outageMessageVisibility })
    );
    set({ outageMessageVisibility });
  }
}));

/**
 * Helper function to store a value in localStorage with an expiration time (Time To Live).
 * @param {string} key - The key under which to store the data in localStorage.
 * @param {any} value - The value to store.
 * @param {number} ttl - The time to live in milliseconds.
 * @returns {object} An object containing the stored value and its expiry timestamp: { value, expiry }.
 */
export const setWithExpiration = (key, value, ttl) => {
  const data = {
    value,
    expiry: new Date().getTime() + ttl
  };
  localStorageInterface.set(key, data);
  return data;
};

/**
 * Helper function to retrieve a value from localStorage that was stored with an expiration time.
 * If the item is expired or not found, it's removed from localStorage and null is returned.
 * @param {string} key - The key of the item to retrieve from localStorage.
 * @returns {any|null} The stored value if found and not expired, otherwise null.
 */
export const getWithExpiration = (key) => {
  const data = localStorageInterface.get(key);

  if (!data) return null;

  const now = new Date().getTime();

  if (now > data.expiry) {
    localStorageInterface.remove(key);
    return null;
  }

  return data.value;
};

/**
 * Zustand store for managing UI references.
 * @property {React.RefObject} mainRef - Ref for the main content area.
 * @property {React.RefObject} agendaMainRef - Ref for the main agenda area.
 * @property {React.RefObject[]} agendaMeetingRefs - Array of refs for individual agenda meeting items.
 * @property {Function} setAgendaMeetingRefs - Setter for agendaMeetingRefs.
 * @property {Function|null} openAttendeesModal - Function to open the attendees modal, or null.
 * @property {Function} setOpenAttendeesModal - Setter for openAttendeesModal.
 * @property {Function|null} openTranscriptModal - Function to open the transcript modal, or null.
 * @property {Function} setOpenTranscriptModal - Setter for openTranscriptModal.
 */
export const useRefStore = create((set) => ({
  mainRef: createRef(),
  agendaMainRef: createRef(),
  agendaMeetingRefs: [],
  /**
   * Sets the array of refs for agenda meeting items.
   * @param {React.RefObject[]} refs - An array of React ref objects.
   */
  setAgendaMeetingRefs: (refs) => set({ agendaMeetingRefs: refs }),
  openAttendeesModal: null,
  /**
   * Sets the function used to open the attendees modal.
   * @param {Function|null} fn - The function to open the modal, or null.
   */
  setOpenAttendeesModal: (fn) => set({ openAttendeesModal: fn }),
  openTranscriptModal: null,
  /**
   * Sets the function used to open the transcript modal.
   * @param {Function|null} fn - The function to open the modal, or null.
   */
  setOpenTranscriptModal: (fn) => set({ openTranscriptModal: fn })
}));

/**
 * Zustand store for managing global search functionality, with persistence for recent searches.
 * @property {React.RefObject} inputRef - Ref for the search input element.
 * @property {string} input - The current search input string.
 * @property {Function} setInput - Setter for the search input string.
 * @property {boolean} isInputFocused - Whether the search input is focused.
 * @property {Function} setIsInputFocused - Setter for the input focus state.
 * @property {boolean} isExpanded - Whether the global search UI is expanded.
 * @property {Function} setIsExpanded - Setter for the search UI expansion state.
 * @property {string[]} recentSearches - Array of recent search terms.
 * @property {Function} pushRecentSearch - Adds a new search term to recent searches (max 5, unique).
 * @property {Function} clearRecentSearches - Clears all recent searches.
 */
export const useGlobalSearchStore = create(
  persist(
    (set, get) => ({
      inputRef: createRef(),
      input: '',
      /**
       * Sets the current search input string.
       * @param {string} newInput - The new search input.
       */
      setInput: (newInput) => set({ input: newInput }),
      isInputFocused: false,
      /**
       * Sets the focus state of the search input.
       * @param {boolean} isInputFocused - True if input is focused, false otherwise.
       */
      setIsInputFocused: (isInputFocused) => set({ isInputFocused }),
      isExpanded: false,
      /**
       * Sets the expansion state of the global search UI.
       * @param {boolean} isExpanded - True if search UI is expanded, false otherwise.
       */
      setIsExpanded: (isExpanded) => set({ isExpanded }),
      recentSearches: [],
      /**
       * Adds a search term to the list of recent searches.
       * Keeps the list unique and limited to the last 5 searches.
       * @param {string} newSearch - The new search term to add.
       */
      pushRecentSearch: (newSearch) => {
        const searches = get().recentSearches;
        const newSearches = [newSearch, ...searches.filter((s) => s !== newSearch)];
        set({ recentSearches: newSearches.slice(0, 5) });
      },
      /**
       * Clears all stored recent searches.
       */
      clearRecentSearches: () => set({ recentSearches: [] })
    }),
    {
      name: 'fora-recent-searches',
      partialize: (state) => ({ recentSearches: state.recentSearches })
    }
  )
);

/**
 * Zustand store for user configuration preferences, with persistence.
 * @property {boolean} hasReceivedWelcome - Whether the user has received/acknowledged a welcome message/flow.
 * @property {Function} setHasReceivedWelcome - Setter for the hasReceivedWelcome state.
 */
export const useUserConfigStore = create(
  persist(
    (set) => ({
      hasReceivedWelcome: false,
      /**
       * Sets the state indicating whether the user has received the welcome message/flow.
       * @param {boolean} hasReceivedWelcome - True if welcome has been received, false otherwise.
       */
      setHasReceivedWelcome: (hasReceivedWelcome) => set({ hasReceivedWelcome })
    }),
    {
      name: 'user-config'
    }
  )
);

/**
 * Zustand store for managing state related to the meeting page UI.
 * @property {object|null} videoDisclosure - Chakra UI disclosure object for video player modal or section.
 * @property {Function} setVideoDisclosure - Setter for the videoDisclosure object.
 */
export const useMeetingPageStore = create((set) => ({
  videoDisclosure: null,
  /**
   * Sets the Chakra UI disclosure object for the video player on the meeting page.
   * @param {object|null} disclosure - The disclosure object from Chakra's useDisclosure hook.
   */
  setVideoDisclosure: (disclosure) => set({ videoDisclosure: disclosure })
}));

/**
 * On Microsoft OAuth flow, store the Access and ID Tokens we get back
 * We will need accessToken for the `microsoft/teams/mine` and `microsoft/teams/{id}/channels/mine`
 * endpoints' X-Fora-Microsoft header
 */
export const useUserMSALStore = create(
  persist(
    (set) => ({
      accessToken: null,
      idToken: null,
      setTokens: (tokens) => set({ ...tokens })
    }),
    {
      name: 'user-msal-config'
    }
  )
);

export const useQueryStore = create((set) => ({
  feedCardsSearchBody: (userId) => ({
    archived: false,
    channel_source: null,
    created_at_from: null,
    created_at_to: null,
    has_source: true,
    pageSize: 8,
    person_id: userId,
    source: null,
    preferred: null,
    initiative_ids: null,
    label_ids: null,
    query: null,
    has_sub_source: null,
    sub_sources: null
  }),
  setFeedCardsSearchBody: (newSearchBody) => set({ feedCardsSearchBody: () => newSearchBody })
}));

export const useExplorerPageStore = create(
  persist(
    (set) => ({
      sources: [],
      setSources: (sources) => set({ sources }),
      isRightRailExpanded: true,
      setIsRightRailExpanded: (isExpanded) => set({ isRightRailExpanded: isExpanded })
    }),
    {
      name: 'explorer-page'
    }
  )
);
