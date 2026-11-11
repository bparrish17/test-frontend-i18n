import {
  Center,
  Icon,
  Divider,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Text,
  Textarea,
  VStack,
  Link,
  Image,
  Avatar,
  useDisclosure,
  Button
} from '@chakra-ui/react';
import { Fragment, useState } from 'react';
import pluralize from 'pluralize';

import { SearchIcon, EditAltIcon, LinkedinIcon, ShareAltIcon, MailAltIcon } from '@assets/icons';
import { usePeople, useUpdatePrompt } from '@services/query-services/people.query-service';
import { useUserStore } from '@store/app.store';
import { useMutationToast, useSetDocumentTitle } from '@util/hooks';
import SettingsLayout from '@layouts/settings.layout';
import { SlackLogo, TeamsLogo } from '@assets/images';
import CenteredLayout from '@layouts/centered.layout';
import StyledModal from '@components/general/modals/styled-modal.component';
import { useTranslation } from 'react-i18next';

const iconButtonStyles = {
  variant: 'ghost',
  color: 'surface.outline',
  rounded: 'full'
};

function UserPromptsPage() {
  const loggedInUser = useUserStore((state) => state.user);
  const { data: people } = usePeople();
  // todo: usePersonById;
  const person = people?.find((p) => p.id === loggedInUser.id);

  const userPrompts = [person];

  return (
    <SettingsLayout>
      <CenteredLayout gap={6}>
        <HStack>
          <Text fontSize='sm'>
            {userPrompts?.length} {pluralize('prompt', userPrompts?.length)}
          </Text>
          <Spacer />
          <IconButton
            {...iconButtonStyles}
            icon={<SearchIcon size='21px' />}
          />
        </HStack>
        {userPrompts?.map((user) => {
          if (!user) {
            return null;
          }

          return (
            <Fragment key={user?.id}>
              <Divider />
              <UserPromptCard
                userId={user?.id}
                name={user?.name}
                title={user?.title}
                initialContext={user?.context}
              />
            </Fragment>
          );
        })}
      </CenteredLayout>
    </SettingsLayout>
  );
}

function UserPromptCard({ userId, name, title, initialContext }) {
  useSetDocumentTitle('User Prompt - FORA');
  const [context, setContext] = useState(initialContext);
  const profileDisclosure = useDisclosure();

  return (
    <Flex
      flexDir='column'
      w='full'
      gap={2}
    >
      <HStack
        spacing={3}
        w='full'
      >
        <UserInfo
          name={name}
          title={title}
          openProfile={profileDisclosure.onOpen}
        />{' '}
        <Spacer />
        <UserPromptEditModal
          userId={userId}
          name={name}
          title={title}
          context={context}
          setContext={setContext}
        />
      </HStack>
      <Text
        color='surface.onSurfaceVariant'
        whiteSpace='pre-wrap'
        fontSize='sm'
      >
        {context}
      </Text>
      <UserProfileModal
        disclosure={profileDisclosure}
        name={name}
        title={title}
      />
    </Flex>
  );
}

function UserInfo({ name, title, inModal, openProfile }) {
  const openProfileProps = !inModal && {
    cursor: 'pointer',
    onClick: () => openProfile()
  };

  return (
    <HStack
      spacing={3}
      w='full'
      mt={2}
    >
      <Avatar
        bgColor='brandPrimary.primary'
        color='white'
        name={name}
        size={inModal ? 'lg' : 'sm'}
        {...openProfileProps}
      />
      <Flex flexDirection='column'>
        <Text
          fontWeight={700}
          fontSize={inModal ? 'md' : 'sm'}
          _hover={{ textDecor: !inModal && 'underline' }}
          onClick={openProfile}
          {...openProfileProps}
        >
          {name}
        </Text>
        <Text fontSize='sm'>{title}</Text>
      </Flex>
    </HStack>
  );
}

function UserProfileModal({ disclosure, name, title }) {
  const { t } = useTranslation();

  const hardcodedBody = (
    <VStack
      w='full'
      spacing={6}
    >
      <Flex
        w='full'
        gap={4}
      >
        <Center
          bgColor='surface.containerLow'
          boxSize={10}
          minW={10}
          rounded='full'
        >
          <Icon
            as={ShareAltIcon}
            transform='rotate(90deg)'
            boxSize='22px'
          />
        </Center>

        <Text
          fontSize='sm'
          color='surface.onSurfaceVariant'
        >
          Reports to{' '}
          <Text
            as='span'
            fontWeight={500}
          >
            {t('userPromptsPage.arthurPhillips')}
          </Text>
          , Director of Human Resources
        </Text>
      </Flex>

      <Flex
        w='full'
        gap={4}
      >
        <Center
          bgColor='surface.containerLow'
          boxSize={10}
          minW={10}
          rounded='full'
        >
          <Icon
            as={LinkedinIcon}
            fill='black'
            boxSize='20px'
          />
        </Center>

        <VStack align='flex-start'>
          <Text
            fontSize='sm'
            color='surface.onSurfaceVariant'
          >
            {t('userPromptsPage.experiencedTalentAcquisitionSpecialist')}
          </Text>
          <Link href='https://linkedin.com'>
            <Text
              fontWeight={500}
              fontSize='sm'
            >
              {t('userPromptsPage.viewOnLinkedin')}
            </Text>
          </Link>
        </VStack>
      </Flex>
      <Divider />
      <VStack>
        <Text variant='content-section-header'>{t('userPromptsPage.contact')}</Text>
        <HStack>
          <Icon
            as={MailAltIcon}
            fill='brandPrimary.primary'
            rounded='full'
            border='reskin'
            p={2}
            boxSize={10}
          />
          <Image
            src={SlackLogo}
            rounded='full'
            border='reskin'
            p={2}
            boxSize={10}
          />
          <Center
            rounded='full'
            border='reskin'
            p={2}
            boxSize={10}
          >
            <Image src={TeamsLogo} />
          </Center>
        </HStack>
      </VStack>
    </VStack>
  );

  return (
    <StyledModal
      disclosure={disclosure}
      title={t('userPromptsPage.editPrompt')}
      buttonProps={{ variant: 'reskinWhite' }}
      buttonTextVariant='content-section-header'
      buttonText={t('userPromptsPage.viewForaActivity')}
      customWidth='360px'
    >
      <VStack
        spacing={4}
        p={6}
      >
        <UserInfo
          name={name}
          title={title}
          inModal
        />
        <Divider />
        {hardcodedBody}
      </VStack>
    </StyledModal>
  );
}

function UserPromptEditModal({ userId, name, title, context, setContext }) {
  const { t } = useTranslation();

  const [editedContext, setEditedContext] = useState(context);
  const { mutateAsync: updatePrompt } = useUpdatePrompt();
  const { onSuccess, onError } = useMutationToast('prompt', 'update');

  async function submitPrompt() {
    setContext(editedContext);
    await updatePrompt({ personId: userId, newPrompt: editedContext }, { onSuccess, onError });
  }

  return (
    <StyledModal
      title={t('userPromptsPage.editPrompt')}
      openButton={
        <IconButton
          {...iconButtonStyles}
          icon={<EditAltIcon size='21px' />}
        />
      }
      modalContentProps={{ w: '440px' }}
    >
      <VStack
        spacing={4}
        p={6}
      >
        <UserInfo
          name={name}
          title={title}
          inModal
        />
        <Textarea
          resize='none'
          h='345px'
          mt={4}
          value={editedContext}
          whiteSpace='pre-wrap'
          onChange={(e) => setEditedContext(e.target.value)}
        />
        <Button
          size='full'
          variant='reskinPrimary'
          onClick={submitPrompt}
        >
          {t('common.save')}
        </Button>
      </VStack>
    </StyledModal>
  );
}

export default UserPromptsPage;
