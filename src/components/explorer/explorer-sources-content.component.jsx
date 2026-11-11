import {
  Stack,
  Text,
  Heading,
  Icon,
  Box,
  Button,
  Center,
  VStack,
  useDisclosure,
  Flex
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { useExplorerPageStore } from '@store/app.store';
import { SFClockIcon } from '@assets/icons';
import { useChatStore } from '@store/chat/chat.store';
import { useCardsCleanBody } from '@services/query-services/cards.query-service';

import ReskinSummaryCard from '@components/general/card/reskin-summary-card/reskin-summary-card.component';
import CardSearchModal from '@components/search/card-search-modal.component';
import Lottie from 'lottie-react';
import animation from '@assets/animations/lottie/home-page-empty-no-insights.json';
import { useStyledToast } from '@util/hooks';
import { useTranslation } from 'react-i18next';

function ExplorerSourcesContent() {
  const { t } = useTranslation();

  const activeConversation = useChatStore((state) => state?.conversation);
  const toast = useStyledToast();
  const {
    isOpen: isSearchModalOpen,
    onOpen: onSearchModalOpen,
    onClose: onSearchModalClose
  } = useDisclosure();

  const sourcesFromLocalstorage = useExplorerPageStore((state) => state?.sources);
  const setSourcesInLocalstorage = useExplorerPageStore((state) => state?.setSources);

  const [sources, setSources] = useState([]);

  const { data: cards, isLoading } = useCardsCleanBody({
    ids: sources?.map((source) => source.id)
  });

  function clearSources() {
    setSourcesInLocalstorage([]);
    setSources([]);
  }

  function removeFn(sourceId) {
    const updatedSources = sources.filter((source) => source.id !== sourceId);
    setSources(updatedSources);
    setSourcesInLocalstorage(updatedSources);
    toast({
      title: t('explorerSourcesContent.sourceRemoved'),
      status: 'info',
      duration: 1000,
      isClosable: true
    });
  }

  function addSubmitFn(cardIds) {
    const newSources = cardIds
      .filter((id) => !sources.some((source) => source.id === id))
      .map((id) => ({
        id,
        type: 'Card'
      }));
    const updatedSources = [...sources, ...newSources];
    setSources(updatedSources);
    setSourcesInLocalstorage(updatedSources);
    toast({
      title: t('explorerSourcesContent.sourcesAdded'),
      status: 'success',
      duration: 1000,
      isClosable: true
    });
  }

  useEffect(() => {
    if (!activeConversation) {
      setSources(sourcesFromLocalstorage || []);
    } else if (activeConversation?.sources?.length) {
      setSources(activeConversation?.sources);
    }
  }, [activeConversation]);

  return (
    <Stack
      gap={6}
      p={6}
      height='100%'
      overflow='auto'
    >
      {!!sources.length && (
        <Heading
          size='lg'
          color='surface.onSurface'
          display='flex'
          justifyContent='space-between'
          alignItems='center'
        >
          {t('explorerSourcesContent.selectedSummaries')}
          <Flex gap={2}>
            <Button
              variant='reskinPrimary'
              size='md'
              px={8}
              onClick={onSearchModalOpen}
            >
              {t('explorerSourcesContent.add')}
            </Button>
            <Button
              variant='reskinSecondary'
              size='md'
              px={8}
              onClick={clearSources}
            >
              {t('explorerSourcesContent.clear')}
            </Button>
          </Flex>
        </Heading>
      )}
      {!!sources?.length && isLoading && !cards?.length && <Lottie animationData={animation} />}
      {!!sources?.length &&
        cards &&
        cards?.length > 0 &&
        cards?.map((source) => (
          <ReskinSummaryCard
            key={source.id}
            card={source}
            showBody={false}
            showFooter={false}
            isExplorerRightRailCard
            navigateOnClick={false}
            removeFn={() => removeFn(source.id)}
          />
        ))}

      {!sources?.length && (
        <Box
          layerStyle='section-card'
          borderRadius='md'
          p={12}
          textAlign='center'
        >
          <VStack gap={6}>
            <Center>
              <Icon
                as={SFClockIcon}
                boxSize={12}
                color='brandPrimary.primary'
              />
            </Center>

            <Heading
              size='lg'
              color='brandPrimary.primary'
            >
              {t('explorerSourcesContent.noSelectedSummaries')}
            </Heading>

            <Text color='surface.onSurfaceVariant'>
              {t('explorerSourcesContent.startByAddingSummaries')}
            </Text>

            <Button
              variant='reskinPrimary'
              size='md'
              px={8}
              onClick={onSearchModalOpen}
            >
              {t('explorerSourcesContent.add')}
            </Button>
          </VStack>
        </Box>
      )}
      <CardSearchModal
        disclosure={{
          isOpen: isSearchModalOpen,
          onOpen: onSearchModalOpen,
          onClose: onSearchModalClose
        }}
        submitFn={addSubmitFn}
      />
    </Stack>
  );
}

export default ExplorerSourcesContent;
