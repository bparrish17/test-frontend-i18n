import { Box, Flex, Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

import ChatContent from '@components/chat/chat-content.component';
import ChatInputSection from '@components/chat/chat-input.component';
import ArtifactContent from '@components/chat/chat-artifact-content.component';
import ChatExplorerSplashScreen from '@components/explorer/explorer-splash.component';
import ExplorerSourcesContent from '@components/explorer/explorer-sources-content.component';
import { useExplorerPageStore } from '@store/app.store';
import { useEffect, useState } from 'react';
import { useChatStore } from '@store/chat/chat.store';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useCardsCleanBody } from '@services/query-services/cards.query-service';
import { useTranslation } from 'react-i18next';

export function CardExplorerChat() {
  const { t } = useTranslation();

  const conversation = useChatStore((state) => state.conversation);
  const inputRef = useChatStore((state) => state.inputRef);
  const send = useChatStore((state) => state.send);
  const isThinking = useChatStore((state) => state.isThinking);
  const setIsThinking = useChatStore((state) => state.setIsThinking);
  const inputValue = useChatStore((state) => state.inputValue);
  const setInputValue = useChatStore((state) => state.setInputValue);
  const displayMessages = useChatStore((state) => state.displayMessages);
  const setDisplayMessages = useChatStore((state) => state.setDisplayMessages);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const sources = useExplorerPageStore((state) => state.sources);
  const [activeTabIndex, setActiveTabIndex] = useState(1);

  const { data: cards } = useCardsCleanBody({
    ids: sources?.map((source) => source.id)
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = {
      role: 'user',
      value: inputValue.trim()
    };

    setDisplayMessages([...displayMessages, userMessage]);

    setInputValue('');

    userMessage.sources =
      cards?.map((card) => ({
        id: card.id,
        title: card.source_data.title,
        type: 'Card'
      })) || sources;

    try {
      const response = await send(userMessage, queryClient);
      if (response?.artifact) {
        // Switch to artifact tab when artifact is generated
        setActiveTabIndex(0);
      }
      if (response) {
        await setDisplayMessages([...displayMessages, userMessage, response]);
      }
      queryClient.invalidateQueries({
        queryKey: ['conversations', { id: conversation?.id }]
      });
      if (response?.conversationId) {
        navigate(`/explorer/${response.conversationId}`, { replace: true });
      }
    } catch (e) {
      console.error('[CardExplorerChat] Error sending message, but maybe thats ok so dont fail');
    }
  };

  const hasArtifacts = conversation?.artifacts?.length > 0;

  useEffect(() => {
    if (hasArtifacts) {
      setActiveTabIndex(0);
    }
    setIsThinking(false);
  }, [conversation]);

  return (
    <Flex
      direction='row'
      height='100%'
      gap={4}
    >
      {/* Chat Area */}
      <Flex
        direction='column'
        flex={1}
        height='100%'
        minHeight={0}
      >
        <Box
          flex={1}
          overflow='auto'
          px={hasArtifacts ? 4 : 0}
          py={hasArtifacts ? 4 : 0}
          minHeight={0}
        >
          <ChatContent customSplashScreen={<ChatExplorerSplashScreen />} />
        </Box>
        <Box
          flexShrink={0}
          px={hasArtifacts ? 4 : 0}
          pb={hasArtifacts ? 4 : 0}
        >
          <ChatInputSection
            handleSubmit={handleSubmit}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isThinking={isThinking}
            inputRef={inputRef}
            disabled={!sources?.length}
          />
        </Box>
      </Flex>

      {/* Tabbed Sources and Artifacts Area */}

      <Flex
        flex={1}
        height='100%'
        direction='column'
        minHeight={0}
        borderLeftColor='gray.200'
        borderLeftWidth='1px'
        borderLeftStyle='solid'
      >
        <Tabs
          index={activeTabIndex}
          onChange={setActiveTabIndex}
          variant='explorer'
          height='100%'
          display='flex'
          flexDirection='column'
          width='100%'
          p={4}
        >
          <TabList
            width='100%'
            bgColor='brandPrimary.container'
            mb={4}
          >
            <Tab
              isDisabled={!hasArtifacts}
              width='50%'
            >
              {t('explorerChat.document')}
            </Tab>

            <Tab width='50%'>Sources ({sources?.length || 0})</Tab>
          </TabList>

          <TabPanels
            flex={1}
            overflow='hidden'
          >
            <TabPanel
              p={0}
              height='100%'
            >
              <Box
                height='100%'
                overflow='auto'
              >
                <ArtifactContent />
              </Box>
            </TabPanel>

            <TabPanel
              p={0}
              height='100%'
            >
              <ExplorerSourcesContent />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Flex>
    </Flex>
  );
}

export default CardExplorerChat;
