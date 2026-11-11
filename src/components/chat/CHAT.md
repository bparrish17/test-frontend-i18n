# Chat System Documentation

## Overview

The Fora Frontend chat system is a modular, context-aware chat interface built with React and Zustand. It supports multiple chat contexts (meetings, earnings calls, custom summaries) with three distinct UI states: collapsed, floating, and fullscreen views. The system uses a provider pattern for state management and real-time updates via Pusher WebSockets.

## Architecture

### Core Components Structure

```
components/chat/
├── chat-collapsed-views.component.jsx    # Minimized chat UI
├── chat-floating.component.jsx           # Floating panel chat UI
├── chat-fullscreen.component.jsx         # Full-screen chat UI
├── chat-header.component.jsx             # Chat header with controls
├── chat-content.component.jsx            # Message display area
├── chat-input.component.jsx              # Message input section
├── chat-splash-screen.component.jsx      # Initial welcome screen
├── chat-thinking-message.component.jsx   # Loading/thinking indicator
├── chat-artifact-content.component.jsx   # Artifact viewer
└── chat-cot-display.component.jsx        # Chain of Thought display
```

### Store Architecture

```
store/chat/
├── chat.store.jsx              # Context and provider utilities
├── base-chat.store.jsx         # Common chat functionality
├── meeting-chat.store.jsx      # Meeting-specific chat store
├── earnings-call-chat.store.jsx # Earnings call chat store
└── custom-summary-chat.store.jsx # Custom summary chat store
```

## Chat Views and State Management

### Expansion States

The chat system supports three primary UI states controlled by the `expansionState` property:

#### 1. Collapsed View (`collapsed`)

- **Component**: `CollapsedChatView`
- **Purpose**: Minimized chat indicator with basic info
- **Features**:
  - Shows chat availability indicator
  - Displays conversation title/context
  - Click to expand to floating view
  - Responsive design (desktop/mobile variants)

#### 2. Floating View (`floating`)

- **Component**: `FloatingChatView`
- **Purpose**: Floating panel for active chatting
- **Features**:
  - Fixed positioning in bottom-right corner
  - Full chat functionality (input, messages, artifacts)
  - Resizable interface
  - Can expand to fullscreen or collapse

#### 3. Fullscreen View (`fullscreen`)

- **Component**: `FullscreenChatView`
- **Purpose**: Maximum screen real estate for complex conversations
- **Features**:
  - Full viewport coverage
  - Chain of Thought (CoT) reasoning panel
  - Artifact display capabilities
  - Advanced message management

### State Transitions

```javascript
// State transition methods available in all chat stores
const {
  showFloatingChat, // collapsed → floating
  showFullscreenChat, // floating/collapsed → fullscreen
  collapseChat, // floating/fullscreen → collapsed
  minimizeChat // fullscreen → floating
} = useChatStore();
```

## Store System

### Base Store (`base-chat.store.jsx`)

The foundation for all chat implementations, providing:

#### Core State Properties

```javascript
{
  // Conversation data
  conversation: null,           // Current conversation object
  displayMessages: [],         // Messages being displayed

  // UI state
  expansionState: 'collapsed', // 'collapsed' | 'floating' | 'fullscreen'
  isThinking: false,          // AI processing indicator
  isErrorState: false,        // Error state flag

  // Input management
  inputRef: null,             // Reference to input element
  inputValue: '',             // Current input text

  // Specialized features
  activeArtifactIndex: null,  // Currently viewed artifact
  activeChainOfThought: [],   // CoT reasoning steps
  showReasoningPanel: false,  // CoT panel visibility

  // Context data
  initiatorData: null,        // Source object (meeting, earnings call, etc.)
  initiatorType: null,        // Type identifier
  title: null                 // Conversation title
}
```

#### Core Actions

```javascript
{
  // Message handling
  send: async (messageObj, queryClient) => { /* ... */ },
  setDisplayMessages: (messages) => { /* ... */ },

  // UI state management
  showFloatingChat: () => { /* ... */ },
  showFullscreenChat: () => { /* ... */ },
  collapseChat: () => { /* ... */ },

  // Input management
  setInputValue: (value) => { /* ... */ },
  setInputRef: (ref) => { /* ... */ },

  // Artifact management
  setActiveArtifactIndex: (index) => { /* ... */ },

  // Chain of Thought
  appendThoughtToChain: (thought) => { /* ... */ },
  setShowReasoningPanel: (show) => { /* ... */ }
}
```

### Context-Specific Stores

Each chat context extends the base store with specific configurations:

For example, the **Meeting Chat Store**:

```javascript
// store/chat/meeting-chat.store.jsx
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
```

## Usage Patterns

### Basic Implementation

Here's how to implement a chat interface for a specific context:

```jsx
// 1. Create the wrapped component with store access
const MyContextChatWrapped = () => {
  const user = useUserStore((state) => state.user);
  const expansionState = useChatStore((state) => state.expansionState);
  const showFullscreenChat = useChatStore((state) => state.showFullscreenChat);
  const queryClient = useQueryClient();
  const contextData = useChatStore((state) => state.initiatorData);

  // Map expansion states to components
  const expansionStateMap = {
    collapsed: CollapsedView,
    floating: FloatingChatView,
    fullscreen: FullscreenChatView
  };

  const ActiveChatView = expansionStateMap[expansionState] || CollapsedView;

  // Set up conversation hook
  useMyContextConversation({ contextData });

  // Set up real-time events
  const { channel } = usePusherChannel(user?.id);
  usePusherEvent(channel, 'my-context-chat-CoT', (data) => {
    if (data.contextId === contextData.id) {
      appendThoughtToChain(data.thoughtData);
      showFullscreenChat();
      setShowReasoningPanel(true);
    }
  });

  return (
    <Box
      position='fixed'
      right={0}
      bottom={0}
      zIndex='modal'
    >
      <ActiveChatView />
    </Box>
  );
};

// 2. Create the provider wrapper
const MyContextChat = ({ contextData }) => (
  <Portal>
    <MyContextChatProvider initiatorData={contextData}>
      <MyContextChatWrapped />
    </MyContextChatProvider>
  </Portal>
);
```

### Real-time Integration

The chat system integrates with Pusher for real-time updates. Pusher events are either instructions to invalidate the cache, or represent output of the thinking steps the chat agent follows during chain-of-thought reasoning.

For example:

```javascript
// Chain of Thought events
usePusherEvent(channel, 'meeting-chat-CoT', (data) => {
  if (data.meetingId === meeting.id) {
    appendThoughtToChain(data.thoughtData);
    showFullscreenChat();
    setShowReasoningPanel(true);
  }
});

// Conversation refetch events
usePusherEvent(channel, 'refetch-conversation', () => {
  queryClient.invalidateQueries({
    queryKey: ['conversations', 'type-vanilla', meeting?.id]
  });
  setIsThinking(false);
});
```
