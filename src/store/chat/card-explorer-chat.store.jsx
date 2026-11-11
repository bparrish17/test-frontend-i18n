import { ChatProvider } from '@store/chat/chat.store.jsx';
import { createBaseStoreFunction } from './base-chat.store';

/**
 * Creates the state and actions for the card explorer chat Zustand store.
 * This function extends the base chat store with card explorer-specific functionality.
 * @param {Function} set - Zustand's set function to update the store state.
 * @param {Function} get - Zustand's get function to access the current store state.
 * @param {object} options - Configuration options for the store.
 * @param {object} options.initiatorData - Initial card explorer data to bootstrap the chat store.
 * @returns {object} An object containing the state and actions for the card explorer chat store.
 */
export const createStoreFunction = (set, get, options) => ({
  ...createBaseStoreFunction(set, get, {
    chatType: 'card-explorer-chat',
    trackingEvent: 'Card Explorer Chat Response',
    errorTitle: 'Card Explorer Error',
    queryKey: 'type-card-explorer',
    initiatorType: 'Global',
    initiatorData: options?.initiatorData
  })
});

/**
 * Provider component for the card explorer Chat store.
 * It utilizes the generic ChatProvider and injects the card explorer chat store logic.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 * @param {object} props.initiatorData - Initial card explorer data to bootstrap the chat store.
 * @returns {JSX.Element} The ChatProvider wrapping the children with the meeting chat store.
 */
export const CardExplorerChatProvider = ({ children, initiatorData }) => (
  <ChatProvider
    createStoreFunction={(set, get) => createStoreFunction(set, get, { initiatorData })}
  >
    {children}
  </ChatProvider>
);
