import { useConversations } from '@services/query-services/conversations.query-service';
import { useUserStore } from '@store/app.store';
import { useChatStore } from '@store/chat/chat.store';
import { find } from 'lodash-es';

const useConversationWithArtifacts = ({ sourceId, tag, initialConversation, queryKey }) => {
  const user = useUserStore((state) => state.user);
  const setConversation = useChatStore((state) => state.setConversation);
  const activeArtifactIndex = useChatStore((state) => state.activeArtifactIndex);
  const setActiveArtifactIndex = useChatStore((state) => state.setActiveArtifactIndex);

  const conversationSearchBody = {
    creator_id: user?.id,
    source_ids: [sourceId],
    has_archived_at: false,
    sort: 'created_at',
    asc: false,
    tags: [tag]
  };

  return useConversations(conversationSearchBody, {
    select: (conversations) => {
      if (conversations.length) {
        return conversations[0];
      }
    },
    queryKey,
    onSuccess: (data) => {
      if (data) {
        setConversation(data);
        // ALWAYS: if the latest message has a new artifact, scroll the user to that artifact
        // otherwise, only change the active artifact if the user hasnt touched it yet
        const latestMessage = data.messages[data.messages.length - 1];
        if (latestMessage.artifact || activeArtifactIndex === null) {
          setActiveArtifactIndex(data.artifacts?.length - 1);
        }
      }
    },
    placeholderData: () => {
      setTimeout(() => {
        setConversation(initialConversation);
      }, 0);
      return initialConversation;
    }
  });
};

export const useMeetingChatConversation = ({ meeting }) => {
  const initialConversation = {
    messages: [],
    tags: ['type-vanilla'],
    sources: [{ id: meeting?.id, title: meeting?.title, type: 'Meeting' }]
  };

  useConversationWithArtifacts({
    sourceId: meeting?.id,
    tag: 'type-vanilla',
    initialConversation,
    queryKey: ['conversations', 'type-vanilla', meeting?.id]
  });
};

export const useEarningsCallConversation = ({ bot }) => {
  const initialConversation = {
    messages: [],
    tags: ['type-earnings-call'],
    sources: [
      {
        id: bot?.id,
        title: `Q${bot?.earnings_call?.quarter} ${bot?.earnings_call?.year} ${bot?.earnings_call?.company_name} Earnings Call`,
        type: 'Bot'
      }
    ]
  };

  useConversationWithArtifacts({
    sourceId: bot?.id,
    tag: 'type-earnings-call',
    initialConversation,
    queryKey: ['conversations', 'type-earnings-call', bot?.id]
  });
};

export const useCustomSummaryConversation = ({ initialSourceData }) => {
  const user = useUserStore((state) => state.user);

  const meeting = find(initialSourceData, { type: 'Meeting' });

  const conversationSearchBody = {
    creator_id: user.id,
    source_ids: [meeting.id],
    has_archived_at: false,
    sort: 'created_at',
    asc: false,
    tags: ['type-custom-summary']
  };

  const { data: conversation } = useConversations(conversationSearchBody, {
    select: (conversations) => {
      if (conversations.length) {
        return conversations[0];
      }
    },
    queryKey: ['conversations', 'type-custom-summary', meeting.id]
  });

  return conversation;
};

// export const useCardExplorerConversations = () => {
//   const user = useUserStore((state) => state?.user);
//   const conversationSearchBody = {
//     creator_id: user?.id,
//     has_archived_at: false,
//     sort: 'updated_at',
//     asc: false,
//     tags: ['type-card-explorer']
//   };

//   return useConversations(conversationSearchBody);
// };
