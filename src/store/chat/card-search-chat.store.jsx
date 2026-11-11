import { ChatProvider } from '@store/chat/chat.store.jsx';
import { createBaseStoreFunction } from './base-chat.store';

/**
 * Creates the state and actions for the card search chat chat Zustand store.
 * This function extends the base chat store with card search chat-specific functionality.
 * @param {Function} set - Zustand's set function to update the store state.
 * @param {Function} get - Zustand's get function to access the current store state.
 * @param {object} options - Configuration options for the store.
 * @param {object} options.initiatorData - Initial card search chat data to bootstrap the chat store.
 * @returns {object} An object containing the state and actions for the card search chat chat store.
 */
export const createStoreFunction = (set, get, options) => ({
  ...createBaseStoreFunction(set, get, {
    chatType: 'card-search-chat',
    trackingEvent: 'Card Search Chat Response',
    errorTitle: 'Card Search Error',
    queryKey: 'type-card-search',
    initiatorType: 'Global',
    initiatorData: options?.initiatorData,
    closeFn: options?.closeFn
  })
});

/**
 * Provider component for the card search chat Chat store.
 * It utilizes the generic ChatProvider and injects the card search chat chat store logic.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 * @param {object} props.initiatorData - Initial card search chat data to bootstrap the chat store.
 * @returns {JSX.Element} The ChatProvider wrapping the children with the meeting chat store.
 */
export const CardSearchChatProvider = ({ children, initiatorData, closeFn }) => (
  <ChatProvider
    createStoreFunction={(set, get) => createStoreFunction(set, get, { initiatorData, closeFn })}
  >
    {children}
  </ChatProvider>
);
