import { ChatProvider } from '@store/chat/chat.store.jsx';
import { createBaseStoreFunction } from './base-chat.store';

/**
 * Creates the state and actions for the meeting chat Zustand store.
 * This function extends the base chat store with meeting-specific functionality.
 * @param {Function} set - Zustand's set function to update the store state.
 * @param {Function} get - Zustand's get function to access the current store state.
 * @param {object} options - Configuration options for the store.
 * @param {object} options.initiatorData - Initial meeting data to bootstrap the chat store.
 * @returns {object} An object containing the state and actions for the meeting chat store.
 */
export const createStoreFunction = (set, get, options) => ({
  ...createBaseStoreFunction(set, get, {
    chatType: 'meeting-chat',
    trackingEvent: 'Meeting Chat Response',
    errorTitle: 'Meeting Chat Error',
    queryKey: 'type-vanilla',
    initiatorType: 'Meeting',
    initiatorData: options?.initiatorData
  })
});

/**
 * Provider component for the Meeting Chat store.
 * It utilizes the generic ChatProvider and injects the meeting chat store logic.
 * @param {object} props - Component props.
 * @param {React.ReactNode} props.children - Child components to be wrapped by the provider.
 * @param {object} props.initiatorData - Initial meeting data to bootstrap the chat store.
 * @returns {JSX.Element} The ChatProvider wrapping the children with the meeting chat store.
 */
export const MeetingChatProvider = ({ children, initiatorData }) => (
  <ChatProvider
    createStoreFunction={(set, get) => createStoreFunction(set, get, { initiatorData })}
  >
    {children}
  </ChatProvider>
);
