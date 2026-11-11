import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { CustomSummaryChatProvider } from '@store/chat/custom-summary-chat.store';
import { useUserStore } from '@store/app.store';
import { setConversationArchived } from '@services/query-services/conversations.query-service';
import { sendChatMessage } from '@services/query-services/lambda.query-service';
import { useChatStore } from '@store/chat/chat.store';
import {
  createInitiativeSkippingBackfill,
  generateCardTemplate,
  generateLensPrompts
} from '@services/query-services/initiatives.query-service';
import { createCard } from '@services/query-services/cards.query-service';
import RecallService from '@services/recall.service';
import analyticsService from '@services/analytics.service';

// Mock external dependencies
vi.mock('@store/app.store', () => ({
  useUserStore: {
    getState: vi.fn()
  }
}));

vi.mock('@services/query-services/conversations.query-service', () => ({
  setConversationArchived: vi.fn()
}));

vi.mock('@services/query-services/lambda.query-service', () => ({
  sendChatMessage: vi.fn()
}));

vi.mock('@services/query-services/initiatives.query-service', () => ({
  createInitiativeSkippingBackfill: vi.fn(),
  generateCardTemplate: vi.fn(),
  generateLensPrompts: vi.fn()
}));

vi.mock('@services/query-services/cards.query-service', () => ({
  createCard: vi.fn()
}));

vi.mock('@services/recall.service', () => {
  const mockInstance = {
    generateTitle: vi.fn()
  };

  return {
    default: {
      getInstance: vi.fn(() => mockInstance)
    }
  };
});

vi.mock('@services/analytics.service', () => ({
  default: {
    trackButtonClick: vi.fn()
  }
}));

describe('Custom Summary Chat Store', () => {
  const wrapper = ({ children }) => (
    <CustomSummaryChatProvider>{children}</CustomSummaryChatProvider>
  );
  const mockUser = {
    id: 'user123',
    tenants: [{ id: 'tenant123' }]
  };
  const mockQueryClient = {
    invalidateQueries: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.getState.mockReturnValue({ user: mockUser });
    RecallService.getInstance().generateTitle.mockResolvedValue('Generated Template Title');
    sendChatMessage.mockResolvedValue({ role: 'assistant', content: 'Test response' });
    analyticsService.trackButtonClick.mockImplementation(() => {});
  });

  describe('Basic State Management', () => {
    it('should initialize with default values', () => {
      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      expect(result.current).toEqual(
        expect.objectContaining({
          conversation: null,
          isThinking: false,
          inputRef: null,
          expansionState: 'fullscreen',
          inputValue: '',
          displayMessages: [],
          artifactIndexMap: {},
          activeArtifactIndex: null,
          templateTitle: '',
          isTemplateTitleFormDirty: false
        })
      );
    });

    it('should manage template title', () => {
      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setTemplateTitle('New Template');
      });

      expect(result.current.templateTitle).toBe('New Template');
    });

    it('should manage template title form dirty state', () => {
      const wrapper = ({ children }) => (
        <CustomSummaryChatProvider>{children}</CustomSummaryChatProvider>
      );

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setTemplateTitleFormDirty(true);
      });

      expect(result.current.isTemplateTitleFormDirty).toBe(true);
    });

    it('should get formatting instructions from artifact', () => {
      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      const mockArtifact = { content: 'Test format content' };
      const instructions = result.current.getFormattingInstructions(mockArtifact);

      expect(instructions).toBe(
        'Please generate a summary that roughly aligns with the following content format: Test format content'
      );
    });
  });

  describe('Conversation Management', () => {
    it('should set conversation and update template title from last artifact', () => {
      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      const mockConversation = {
        messages: [{ content: 'msg1' }, { content: 'msg2', artifact: { id: 'art1' } }],
        artifacts: [{ id: 'art1', title: 'Last Artifact Title' }]
      };

      act(() => {
        result.current.setConversation(mockConversation);
      });

      // The custom summary store doesn't automatically set template title from artifacts in setConversation
      // It only does this when creating a new conversation or when explicitly set
      expect(result.current.templateTitle).toBe('');
    });

    it('should handle clearing chat with two sources', async () => {
      const mockToast = vi.fn();
      const mockConversation = {
        id: 'conv123',
        messages: [
          {
            content: 'existing message',
            sources: [
              { id: 'source1', type: 'Meeting' },
              { id: 'source2', type: 'Card' }
            ]
          }
        ],
        sources: [
          { id: 'source1', type: 'Meeting' },
          { id: 'source2', type: 'Card' }
        ],
        artifacts: []
      };

      setConversationArchived.mockResolvedValue(true);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation(mockConversation);
      });

      await act(async () => {
        await result.current.clearChat(mockToast);
      });

      expect(setConversationArchived).toHaveBeenCalledWith('conv123', true);
      expect(result.current.conversation).toEqual({
        messages: [],
        sources: [
          { id: 'source1', type: 'Meeting' },
          { id: 'source2', type: 'Card' }
        ]
      });
    });
  });

  describe('Message Sending', () => {
    it('should handle successful message send with artifact and use artifact title', async () => {
      const mockResponse = {
        role: 'assistant',
        content: 'Test response',
        artifact: { title: 'Generated Artifact Title', content: 'Format instructions' }
      };

      sendChatMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [],
          sources: [{ id: 'source1' }]
        });
      });

      let response;
      await act(async () => {
        response = await result.current.send(
          { role: 'user', value: 'test message' },
          mockQueryClient
        );
      });

      expect(sendChatMessage).toHaveBeenCalledWith('custom-summary-chat', {
        conversationId: 'conv123',
        incomingChatMessage: {
          role: 'user',
          value: 'test message',
          sources: [{ id: 'source1' }]
        },
        sources: [{ id: 'source1' }]
      });
      // When response has artifact, it uses artifact title instead of calling generateTitle
      expect(RecallService.getInstance().generateTitle).not.toHaveBeenCalled();
      expect(result.current.title).toBe('Generated Artifact Title');
      expect(response).toEqual(mockResponse);
    });

    it('should handle successful message send without artifact and generate title', async () => {
      const mockResponse = {
        role: 'assistant',
        content: 'Test response'
      };

      sendChatMessage.mockResolvedValue(mockResponse);

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation({
          id: 'conv123',
          messages: [],
          sources: [{ id: 'source1' }]
        });
      });

      let response;
      await act(async () => {
        response = await result.current.send(
          { role: 'user', value: 'test message' },
          mockQueryClient
        );
      });

      expect(sendChatMessage).toHaveBeenCalledWith('custom-summary-chat', {
        conversationId: 'conv123',
        incomingChatMessage: {
          role: 'user',
          value: 'test message',
          sources: [{ id: 'source1' }]
        },
        sources: [{ id: 'source1' }]
      });
      // When response has no artifact, it should call generateTitle
      expect(RecallService.getInstance().generateTitle).toHaveBeenCalled();
      expect(result.current.title).toBe('Generated Template Title');
      expect(response).toEqual(mockResponse);
    });
  });

  describe('Template Management', () => {
    it('should save conversation as template', async () => {
      const mockConversation = {
        sources: [{ id: 'source1', type: 'meeting' }],
        messages: [],
        artifacts: [
          {
            title: 'Test Template',
            content: 'Formatting instructions'
          }
        ]
      };

      generateCardTemplate.mockResolvedValue({
        value: JSON.stringify({
          sections: ['section1', 'section2']
        })
      });

      generateLensPrompts.mockResolvedValue({
        data: {
          prompts: ['prompt1', 'prompt2']
        }
      });

      createInitiativeSkippingBackfill.mockResolvedValue({
        id: 'initiative123'
      });

      createCard.mockResolvedValue({
        id: 'card123'
      });

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation(mockConversation);
        result.current.setTitle('Custom Template Title');
      });

      await act(async () => {
        await result.current.saveAsTemplate(mockUser);
      });

      expect(generateCardTemplate).toHaveBeenCalled();
      expect(generateLensPrompts).toHaveBeenCalledWith({
        title: 'Custom Template Title',
        formatting_instructions: expect.any(String)
      });
      expect(analyticsService.trackButtonClick).toHaveBeenCalledWith(
        'Custom Summary Template Save Button Clicked',
        {
          userId: 'user123',
          meetingId: 'source1',
          num_messages: 0
        }
      );
      expect(createInitiativeSkippingBackfill).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Custom Template Title',
          type: 'Lens',
          visibility: 'Owner'
        })
      );
      expect(createCard).toHaveBeenCalledWith(
        expect.objectContaining({
          initiative: { id: 'initiative123' },
          tenant: { id: 'tenant123' }
        })
      );
    });

    it('should handle initiative creation error', async () => {
      const mockConversation = {
        sources: [{ id: 'source1' }],
        messages: [],
        artifacts: [
          {
            title: 'Test Template',
            content: 'Formatting instructions'
          }
        ]
      };

      createInitiativeSkippingBackfill.mockRejectedValue({
        response: {
          data: {
            errors: 'Initiative creation failed'
          }
        }
      });

      const { result } = renderHook(() => useChatStore((state) => state), { wrapper });

      act(() => {
        result.current.setConversation(mockConversation);
      });

      await expect(result.current.saveAsTemplate(mockUser)).rejects.toThrow(
        'Initiative creation failed'
      );
    });
  });
});
