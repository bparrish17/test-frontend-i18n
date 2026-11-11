import { Box, Flex, Text, HStack, IconButton, Button, Spinner, Input } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, CopyIcon, SFSquareAndPencil } from '@assets/icons';
import { useChatStore } from '@store/chat/chat.store.jsx';
import { useBreakpoints, useCopyToClipboard, useStyledToast } from '@util/hooks';
import { MessageContent } from './chat-message-content.component';
import { useState } from 'react';
import { useUserStore } from '@store/app.store';
import StyledTabBox from '@components/general/styled-tab-box.component';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useRollbar } from '@rollbar/react';
import { useTranslation } from 'react-i18next';

const ArtifactContent = () => {
  const { isMobile } = useBreakpoints();
  const conversation = useChatStore((state) => state.conversation);
  const activeArtifactIndex = useChatStore((state) => state.activeArtifactIndex);
  return (
    <Box
      w='100%'
      pb={isMobile ? 100 : 3}
      maxW='720px'
    >
      <Flex
        flexDirection='column'
        h={isMobile ? '100%' : '95%'}
        overflowY='auto'
        p={5}
        bg='white'
        borderRadius={8}
        px={10}
      >
        <ArtifactMetadataArea />
        {/* Artifact Content Area */}
        <Box
          flex='1'
          overflowY='auto'
          maxHeight='65vh'
          style={{ scrollbarWidth: 'none' }}
        >
          <MessageContent
            content={
              conversation?.artifacts?.length
                ? conversation?.artifacts[activeArtifactIndex]?.content
                : ''
            }
          />
        </Box>
        <ArtifactActionButtons />
      </Flex>
    </Box>
  );
};

const ArtifactMetadataArea = () => {
  const title = useChatStore((state) => state.title);
  if (!title) return '';
  return (
    <Flex alignItems='center'>
      <ChatTitle />
    </Flex>
  );
};

const ChatTitle = () => {
  const { t } = useTranslation();

  const title = useChatStore((state) => state.title);
  const setTitle = useChatStore((state) => state.setTitle);
  const setIsTitleFormDirty = useChatStore((state) => state.setIsTitleFormDirty);
  const [isEditing, setIsEditing] = useState(false);
  const [editedValue, setEditedValue] = useState(title);

  if (!isEditing) {
    return (
      <StyledTabBox
        bgColor='surface.containerHigh'
        onClick={() => setIsEditing(true)}
      >
        {title}&nbsp;&nbsp;
        <SFSquareAndPencil
          h='12px'
          w='12px'
          mt='3px'
        />{' '}
      </StyledTabBox>
    );
  } else {
    return (
      <Box
        w='100%'
        mb={5}
        p={5}
        bgColor='surface.containerHigh'
        borderRadius='lg'
        display='flex'
      >
        <Input
          value={editedValue}
          onChange={(e) => {
            setEditedValue(e.target.value);
          }}
          type='text'
        />
        &nbsp;&nbsp;
        <Button
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(false);
            setTitle(editedValue);
            setIsTitleFormDirty(true);
          }}
        >
          {t('chatArtifactContent.save')}
        </Button>
        &nbsp;&nbsp;
        <Button
          onClick={(e) => {
            e.preventDefault();
            setIsEditing(false);
          }}
          variant='reskinSecondary'
        >
          {t('chatArtifactContent.cancel')}
        </Button>
      </Box>
    );
  }
};

const ArtifactActionButtons = () => {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const copyToClipboard = useCopyToClipboard();
  const conversation = useChatStore((state) => state.conversation);
  const activeArtifactIndex = useChatStore((state) => state.activeArtifactIndex);
  const setActiveArtifactIndex = useChatStore((state) => state.setActiveArtifactIndex);
  const saveAsTemplate = useChatStore((state) => state.saveAsTemplate);
  const toast = useStyledToast();
  const queryClient = useQueryClient();
  const closeFn = useChatStore((state) => state.closeFn);
  const [isSavingTemplate, setIsSavingTemplate] = useState(false);
  const [, setSearchParams] = useSearchParams();
  const rollbar = useRollbar();

  if (!conversation?.artifacts?.length) return '';

  const saveTemplate = async () => {
    if (!saveAsTemplate) return;
    setIsSavingTemplate(true);
    try {
      const { initiative } = await saveAsTemplate(user);
      await queryClient.invalidateQueries({ queryKey: ['cards'] });
      setSearchParams((searchParams) => {
        searchParams.set('initiativeId', initiative.id);
        return searchParams;
      });
      if (closeFn) {
        closeFn();
      }
      toast({
        title: t('chatArtifactContent.templateSaved'),
        status: 'success',
        isClosable: true
      });
    } catch (e) {
      rollbar?.error('Error saving template', e, { conversationId: conversation?.id });
      toast({
        title: t('chatArtifactContent.templateSaveError'),
        description: `${e}`,
        status: 'error',
        isClosable: true
      });
      setIsSavingTemplate(false);
    }
    setIsSavingTemplate(false);
  };

  return (
    <Box>
      <HStack
        justify='space-between'
        pt={4}
      >
        <HStack>
          <IconButton
            icon={<ChevronLeftIcon />}
            variant='ghost'
            aria-label={t('chatArtifactContent.previousArtifactVersionAriaLabel')}
            size='sm'
            bgColor='surface.containerLow'
            onClick={() => {
              if (activeArtifactIndex > 0) {
                setActiveArtifactIndex(activeArtifactIndex - 1);
              }
            }}
          />
          <Text
            color='surface.onSurfaceVariant'
            fontSize='sm'
          >
            {`Version ${activeArtifactIndex + 1} of ${conversation.artifacts.length}`}
          </Text>
          <IconButton
            icon={<ChevronRightIcon />}
            variant='ghost'
            aria-label={t('chatArtifactContent.nextArtifactVersionAriaLabel')}
            size='sm'
            bgColor='surface.containerLow'
            onClick={() => {
              if (activeArtifactIndex < conversation?.artifacts?.length - 1) {
                setActiveArtifactIndex(activeArtifactIndex + 1);
              }
            }}
          />
        </HStack>

        <HStack spacing={2}>
          <IconButton
            icon={<CopyIcon />}
            variant='ghost'
            aria-label={t('chatArtifactContent.copyAriaLabel')}
            size='sm'
            bgColor='surface.containerLow'
            onClick={() => {
              copyToClipboard(conversation.artifacts[activeArtifactIndex].content);
            }}
          />
          {saveAsTemplate && (
            <Button
              variant='reskinPrimary'
              size='md'
              onClick={() => saveTemplate()}
              disabled={isSavingTemplate || conversation.messages.length < 2}
            >
              {isSavingTemplate && (
                <Spinner
                  size='xs'
                  mr='10px'
                />
              )}
              Save as Template
            </Button>
          )}
        </HStack>
      </HStack>
    </Box>
  );
};

export default ArtifactContent;
