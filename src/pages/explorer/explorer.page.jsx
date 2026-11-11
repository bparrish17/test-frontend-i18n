import { CardExplorerChatProvider } from '@store/chat/card-explorer-chat.store';
import { useConversationById } from '@services/query-services/conversations.query-service';
import { useUserStore } from '@store/app.store';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router-dom';
import { usePusherChannel, usePusherEvent } from '@util/hooks';
import CardExplorerPageContent from './explorer-content.page';

export default function CardExplorerPage() {
  const { conversationId } = useParams();
  const { data: conversation } = useConversationById(conversationId);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state?.user);

  const { channel } = usePusherChannel(user?.id);

  usePusherEvent(channel, 'refetch-conversation', (data) => {
    if (!conversationId && data.conversationId) {
      console.log('no conversationId in url, but got one from pusher event, navigating');
      navigate(`/explorer/${data.conversationId}`, { replace: true });
      queryClient.invalidateQueries({
        queryKey: ['conversations', { id: data.conversationId }]
      });
    }
  });

  return (
    <CardExplorerChatProvider initiatorData={conversation?.sources}>
      <CardExplorerPageContent conversation={conversation} />
    </CardExplorerChatProvider>
  );
}
