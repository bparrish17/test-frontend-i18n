import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ChatProvider, useChatStore } from '@store/chat/chat.store.jsx';
import React from 'react';

describe('Chat Store', () => {
  // Mock store structure for testing
  const initialState = {
    messages: [],
    addMessage: vi.fn()
  };

  const createMockStore = (set) => ({
    ...initialState,
    addMessage: (message) =>
      set((state) => ({
        messages: [...state.messages, message]
      }))
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ChatProvider', () => {
    it('should create a store instance', () => {
      const wrapper = ({ children }) => (
        <ChatProvider createStoreFunction={createMockStore}>{children}</ChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state.messages), { wrapper });

      expect(result.current).toEqual([]);
    });

    it('should maintain store instance across re-renders', () => {
      const wrapper = ({ children }) => (
        <ChatProvider createStoreFunction={createMockStore}>{children}</ChatProvider>
      );

      const { result, rerender } = renderHook(() => useChatStore((state) => state), { wrapper });

      // Add a message
      act(() => {
        result.current.addMessage('test message');
      });

      // Re-render the component
      rerender();

      // Check if the state persists
      expect(result.current.messages).toEqual(['test message']);
    });

    it('should create separate stores for different providers', () => {
      const Wrapper1 = ({ children }) => (
        <ChatProvider createStoreFunction={createMockStore}>{children}</ChatProvider>
      );

      const Wrapper2 = ({ children }) => (
        <ChatProvider createStoreFunction={createMockStore}>{children}</ChatProvider>
      );

      const { result: result1 } = renderHook(() => useChatStore((state) => state), {
        wrapper: Wrapper1
      });

      const { result: result2 } = renderHook(() => useChatStore((state) => state), {
        wrapper: Wrapper2
      });

      // Add message to first store
      act(() => {
        result1.current.addMessage('message 1');
      });

      // Check if stores are independent
      expect(result1.current.messages).toEqual(['message 1']);
      expect(result2.current.messages).toEqual([]);
    });
  });

  describe('useChatStore', () => {
    it('should throw error when used outside provider', () => {
      expect(() => {
        renderHook(() => useChatStore((state) => state));
      }).toThrow('Missing ChatStoreContext.Provider in the tree');
    });

    it('should select and update state correctly', () => {
      const wrapper = ({ children }) => (
        <ChatProvider createStoreFunction={createMockStore}>{children}</ChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.addMessage('test message 1');
        result.current.addMessage('test message 2');
      });

      expect(result.current.messages).toEqual(['test message 1', 'test message 2']);
    });

    it('should handle selective state updates', () => {
      const wrapper = ({ children }) => (
        <ChatProvider createStoreFunction={createMockStore}>{children}</ChatProvider>
      );

      const { result } = renderHook(
        () => ({
          messages: useChatStore((state) => state.messages),
          addMessage: useChatStore((state) => state.addMessage)
        }),
        { wrapper }
      );

      act(() => {
        result.current.addMessage('test message');
      });

      expect(result.current.messages).toEqual(['test message']);
    });
  });
});
