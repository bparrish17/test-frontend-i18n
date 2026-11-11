import { renderHook, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  useMeetingChatConversation,
  useEarningsCallConversation,
  useCustomSummaryConversation
} from '@util/hooks/chat.hooks';

// Mock dependencies
vi.mock('@services/query-services/conversations.query-service', () => ({
  useConversations: vi.fn()
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

vi.mock('@store/chat/chat.store', () => ({
  useChatStore: vi.fn()
}));

vi.mock('lodash-es', () => ({
  find: vi.fn()
}));

// Mock setTimeout
vi.mock('timers', () => ({
  setTimeout: vi.fn()
}));

global.setTimeout = vi.fn();

import { useConversations } from '@services/query-services/conversations.query-service';
import { useUserStore } from '@store/app.store';
import { useChatStore } from '@store/chat/chat.store';
import { find } from 'lodash-es';

const createMockUser = (overrides = {}) => ({
  id: 'user_123',
  email: 'test@example.com',
  ...overrides
});

const createMockMeeting = (overrides = {}) => ({
  id: 'meeting_123',
  title: 'Test Meeting',
  ...overrides
});

const createMockBot = (overrides = {}) => ({
  id: 'bot_123',
  earnings_call: {
    quarter: 'Q1',
    year: '2024',
    company_name: 'Test Company'
  },
  ...overrides
});

const createMockConversation = (overrides = {}) => ({
  id: 'conversation_123',
  messages: [
    {
      id: 'message_1',
      content: 'Test message',
      artifact: null
    }
  ],
  artifacts: [],
  tags: ['type-vanilla'],
  sources: [{ id: 'meeting_123', title: 'Test Meeting', type: 'Meeting' }],
  ...overrides
});

describe('useMeetingChatConversation', () => {
  let mockSetConversation;
  let mockSetActiveArtifactIndex;
  let mockUseConversations;

  beforeEach(() => {
    mockSetConversation = vi.fn();
    mockSetActiveArtifactIndex = vi.fn();
    mockUseConversations = vi.fn();

    useUserStore.mockReturnValue(createMockUser());
    useChatStore.mockImplementation((selector) => {
      const state = {
        setConversation: mockSetConversation,
        activeArtifactIndex: null,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });
    useConversations.mockImplementation(mockUseConversations);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call useConversations with correct search parameters', () => {
    const mockMeeting = createMockMeeting();
    const mockUser = createMockUser();

    renderHook(() => useMeetingChatConversation({ meeting: mockMeeting }));

    expect(useConversations).toHaveBeenCalledWith(
      {
        creator_id: mockUser.id,
        source_ids: [mockMeeting.id],
        has_archived_at: false,
        sort: 'created_at',
        asc: false,
        tags: ['type-vanilla']
      },
      expect.objectContaining({
        queryKey: ['conversations', 'type-vanilla', mockMeeting.id],
        select: expect.any(Function),
        onSuccess: expect.any(Function),
        placeholderData: expect.any(Function)
      })
    );
  });

  it('should select first conversation from conversations array', () => {
    const conversations = [
      createMockConversation({ id: 'conv_1' }),
      createMockConversation({ id: 'conv_2' })
    ];

    renderHook(() => useMeetingChatConversation({ meeting: createMockMeeting() }));

    const selectFn = useConversations.mock.calls[0][1].select;
    const result = selectFn(conversations);

    expect(result).toEqual(conversations[0]);
  });

  it('should return undefined when no conversations exist', () => {
    renderHook(() => useMeetingChatConversation({ meeting: createMockMeeting() }));

    const selectFn = useConversations.mock.calls[0][1].select;
    const result = selectFn([]);

    expect(result).toBeUndefined();
  });

  it('should call setConversation and setActiveArtifactIndex on success with artifact', () => {
    const mockConversation = createMockConversation({
      messages: [
        {
          id: 'message_1',
          content: 'Test message',
          artifact: { id: 'artifact_1' }
        }
      ],
      artifacts: [{ id: 'artifact_1' }, { id: 'artifact_2' }]
    });

    renderHook(() => useMeetingChatConversation({ meeting: createMockMeeting() }));

    const onSuccessFn = useConversations.mock.calls[0][1].onSuccess;
    onSuccessFn(mockConversation);

    expect(mockSetConversation).toHaveBeenCalledWith(mockConversation);
    expect(mockSetActiveArtifactIndex).toHaveBeenCalledWith(1); // artifacts.length - 1
  });

  it('should call setConversation and setActiveArtifactIndex when activeArtifactIndex is null', () => {
    const mockConversation = createMockConversation({
      messages: [
        {
          id: 'message_1',
          content: 'Test message',
          artifact: null
        }
      ],
      artifacts: [{ id: 'artifact_1' }]
    });

    useChatStore.mockImplementation((selector) => {
      const state = {
        setConversation: mockSetConversation,
        activeArtifactIndex: null,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });

    renderHook(() => useMeetingChatConversation({ meeting: createMockMeeting() }));

    const onSuccessFn = useConversations.mock.calls[0][1].onSuccess;
    onSuccessFn(mockConversation);

    expect(mockSetConversation).toHaveBeenCalledWith(mockConversation);
    expect(mockSetActiveArtifactIndex).toHaveBeenCalledWith(0); // artifacts.length - 1
  });

  it('should not call setActiveArtifactIndex when no artifact and activeArtifactIndex is not null', () => {
    const mockConversation = createMockConversation({
      messages: [
        {
          id: 'message_1',
          content: 'Test message',
          artifact: null
        }
      ],
      artifacts: []
    });

    useChatStore.mockImplementation((selector) => {
      const state = {
        setConversation: mockSetConversation,
        activeArtifactIndex: 0,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });

    renderHook(() => useMeetingChatConversation({ meeting: createMockMeeting() }));

    const onSuccessFn = useConversations.mock.calls[0][1].onSuccess;
    onSuccessFn(mockConversation);

    expect(mockSetConversation).toHaveBeenCalledWith(mockConversation);
    expect(mockSetActiveArtifactIndex).not.toHaveBeenCalled();
  });

  it('should create initial conversation with placeholderData', () => {
    const mockMeeting = createMockMeeting();

    renderHook(() => useMeetingChatConversation({ meeting: mockMeeting }));

    const placeholderDataFn = useConversations.mock.calls[0][1].placeholderData;
    const result = placeholderDataFn();

    expect(result).toEqual({
      messages: [],
      tags: ['type-vanilla'],
      sources: [{ id: mockMeeting.id, title: mockMeeting.title, type: 'Meeting' }]
    });

    // Verify setTimeout was called to set conversation
    expect(global.setTimeout).toHaveBeenCalled();
  });
});

describe('useEarningsCallConversation', () => {
  let mockSetConversation;
  let mockSetActiveArtifactIndex;
  let mockUseConversations;

  beforeEach(() => {
    mockSetConversation = vi.fn();
    mockSetActiveArtifactIndex = vi.fn();
    mockUseConversations = vi.fn();

    useUserStore.mockReturnValue(createMockUser());
    useChatStore.mockImplementation((selector) => {
      const state = {
        setConversation: mockSetConversation,
        activeArtifactIndex: null,
        setActiveArtifactIndex: mockSetActiveArtifactIndex
      };
      return selector(state);
    });
    useConversations.mockImplementation(mockUseConversations);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call useConversations with correct search parameters for earnings call', () => {
    const mockBot = createMockBot();
    const mockUser = createMockUser();

    renderHook(() => useEarningsCallConversation({ bot: mockBot }));

    expect(useConversations).toHaveBeenCalledWith(
      {
        creator_id: mockUser.id,
        source_ids: [mockBot.id],
        has_archived_at: false,
        sort: 'created_at',
        asc: false,
        tags: ['type-earnings-call']
      },
      expect.objectContaining({
        queryKey: ['conversations', 'type-earnings-call', mockBot.id],
        select: expect.any(Function),
        onSuccess: expect.any(Function),
        placeholderData: expect.any(Function)
      })
    );
  });

  it('should create initial conversation with earnings call data in placeholderData', () => {
    const mockBot = createMockBot();

    renderHook(() => useEarningsCallConversation({ bot: mockBot }));

    const placeholderDataFn = useConversations.mock.calls[0][1].placeholderData;
    const result = placeholderDataFn();

    expect(result).toEqual({
      messages: [],
      tags: ['type-earnings-call'],
      sources: [
        {
          id: mockBot.id,
          title: `Q${mockBot.earnings_call.quarter} ${mockBot.earnings_call.year} ${mockBot.earnings_call.company_name} Earnings Call`,
          type: 'Bot'
        }
      ]
    });
  });

  it('should handle bot with missing earnings_call data', () => {
    const mockBot = { id: 'bot_123', earnings_call: null };

    renderHook(() => useEarningsCallConversation({ bot: mockBot }));

    const placeholderDataFn = useConversations.mock.calls[0][1].placeholderData;

    // Should not throw an error
    expect(() => placeholderDataFn()).not.toThrow();
  });
});

describe('useCustomSummaryConversation', () => {
  let mockUseConversations;

  beforeEach(() => {
    mockUseConversations = vi.fn().mockReturnValue({ data: undefined });

    useUserStore.mockReturnValue(createMockUser());
    useConversations.mockImplementation(mockUseConversations);
    find.mockImplementation((data, criteria) => {
      return data.find((item) => item.type === criteria.type);
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call useConversations with correct search parameters for custom summary', () => {
    const mockMeeting = createMockMeeting();
    const mockUser = createMockUser();
    const initialSourceData = [
      { id: 'meeting_123', type: 'Meeting', title: 'Test Meeting' },
      { id: 'doc_123', type: 'Document', title: 'Test Document' }
    ];

    find.mockReturnValue(mockMeeting);

    renderHook(() => useCustomSummaryConversation({ initialSourceData }));

    expect(find).toHaveBeenCalledWith(initialSourceData, { type: 'Meeting' });
    expect(useConversations).toHaveBeenCalledWith(
      {
        creator_id: mockUser.id,
        source_ids: [mockMeeting.id],
        has_archived_at: false,
        sort: 'created_at',
        asc: false,
        tags: ['type-custom-summary']
      },
      expect.objectContaining({
        queryKey: ['conversations', 'type-custom-summary', mockMeeting.id],
        select: expect.any(Function)
      })
    );
  });

  it('should return conversation data from useConversations', () => {
    const mockConversation = createMockConversation({
      tags: ['type-custom-summary']
    });
    const mockMeeting = createMockMeeting();
    const initialSourceData = [mockMeeting];

    find.mockReturnValue(mockMeeting);
    useConversations.mockReturnValue({ data: mockConversation });

    const { result } = renderHook(() => useCustomSummaryConversation({ initialSourceData }));

    expect(result.current).toEqual(mockConversation);
  });

  it('should handle when no meeting is found in initialSourceData', () => {
    const initialSourceData = [{ id: 'doc_123', type: 'Document', title: 'Test Document' }];

    find.mockReturnValue(undefined);

    expect(() => {
      renderHook(() => useCustomSummaryConversation({ initialSourceData }));
    }).toThrow('Cannot read properties of undefined');
  });

  it('should select first conversation when multiple conversations exist', () => {
    const conversations = [
      createMockConversation({ id: 'conv_1', tags: ['type-custom-summary'] }),
      createMockConversation({ id: 'conv_2', tags: ['type-custom-summary'] })
    ];
    const mockMeeting = createMockMeeting();
    const initialSourceData = [mockMeeting];

    find.mockReturnValue(mockMeeting);

    renderHook(() => useCustomSummaryConversation({ initialSourceData }));

    const selectFn = useConversations.mock.calls[0][1].select;
    const result = selectFn(conversations);

    expect(result).toEqual(conversations[0]);
  });

  it('should return undefined when no conversations exist', () => {
    const mockMeeting = createMockMeeting();
    const initialSourceData = [mockMeeting];

    find.mockReturnValue(mockMeeting);

    renderHook(() => useCustomSummaryConversation({ initialSourceData }));

    const selectFn = useConversations.mock.calls[0][1].select;
    const result = selectFn([]);

    expect(result).toBeUndefined();
  });
});
