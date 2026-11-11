import { createContext, useContext, useRef } from 'react';
import { createStore, useStore } from 'zustand';

// Context to hold the store instance
export const ChatStoreContext = createContext(null);

// Custom hook to use the store with proper type checking
export const useChatStore = (selector) => {
  const store = useContext(ChatStoreContext);
  if (!store) throw new Error('Missing ChatStoreContext.Provider in the tree');
  return useStore(store, selector);
};

// Provider component that creates a new store instance for each chat
export const ChatProvider = ({ children, createStoreFunction }) => {
  const storeRef = useRef();
  if (!storeRef.current) {
    storeRef.current = createStore(createStoreFunction);
  }
  return <ChatStoreContext.Provider value={storeRef.current}>{children}</ChatStoreContext.Provider>;
};
