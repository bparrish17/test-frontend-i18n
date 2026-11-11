import { ChatProvider } from '@store/chat/chat.store.jsx';
import { createBaseStoreFunction } from './base-chat.store';

/**
 * Creates the state and actions for the earnings call chat Zustand store.
 * This function extends the base chat store with earnings call-specific functionality.
 * @param {Function} set - Zustand's set function to update the store state.
 * @param {Function} get - Zustand's get function to access the current store state.
 * @param {object} options - Configuration options for the store.
 * @param {object} options.initiatorData - Initial earnings call data to bootstrap the chat store.
 * @returns {object} An object containing the state and actions for the earnings call chat store.
 */
export const createStoreFunction = (set, get, options) => ({
  ...createBaseStoreFunction(set, get, {
    chatType: 'earnings-call-chat',
    trackingEvent: 'Earnings Call Chat Response',
    errorTitle: 'Earnings Call Chat Error',
    queryKey: 'type-earnings-call',
    initiatorType: 'Earnings_Call',
    initiatorData: options?.initiatorData
  })
});

/**
 * Provider component for the Earnings Call Chat store.
 * It utilizes the generic ChatProvider and injects the earnings call chat store logic.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 * @param {object} props.initiatorData - Initial earnings call data to bootstrap the chat store.
 * @returns {JSX.Element} The ChatProvider wrapping the children with the earnings call chat store.
 */
export const EarningsCallChatProvider = ({ children, initiatorData }) => (
  <ChatProvider
    createStoreFunction={(set, get) => createStoreFunction(set, get, { initiatorData })}
  >
    {children}
  </ChatProvider>
);
