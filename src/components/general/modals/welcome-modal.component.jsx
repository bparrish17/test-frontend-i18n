import {
  Button,
  Heading,
  HStack,
  Icon,
  Link,
  ListItem,
  Modal,
  ModalContent,
  ModalOverlay,
  Stack,
  Tag,
  Text,
  UnorderedList
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useRef } from 'react';
import { useUserConfigStore } from '@store/app.store';
import { LightningFillThickIcon } from '@assets/icons';
import { useTranslation } from 'react-i18next';

const featureItems = [
  {
    label: 'User Prompts',
    text: 'Instruct FORA on what you care about most to cut through the noise and get the most relevant insights.'
  },
  {
    label: 'Email Updates',
    text: 'Stay updated with morning meeting preparation and end-of-day summaries.'
  },
  {
    label: (
      <>
        <Tag
          variant='new'
          size='sm'
          mr={1.5}
        >
          New
        </Tag>
        Per User Auto-Scheduling
      </>
    ),
    text: 'Automatically schedule the FORA notetaker to join your future videoconference calls'
  }
];

export default function WelcomeModal({ disclosure }) {
  const { t } = useTranslation();

  const setHasReceivedWelcome = useUserConfigStore((state) => state.setHasReceivedWelcome);
  const ctaRef = useRef(null);

  const handleClose = () => {
    setHasReceivedWelcome(true);
    disclosure.onClose();
  };

  return (
    <Modal
      size='lg'
      variant='classic'
      isOpen={disclosure.isOpen}
      onClose={handleClose}
      initialFocusRef={ctaRef}
      my={0}
    >
      <ModalOverlay bgColor='rgba(17, 22, 31, 0.7)' />
      <ModalContent p={{ base: 6, xl: 11 }}>
        <Stack>
          <Heading
            size='lg'
            letterSpacing='tight'
          >
            {t('welcomeModal.welcomeBack')}
          </Heading>
          <Text
            fontSize='sm'
            mt={2}
          >
            Update&nbsp;
            <Link
              as={ReactRouterLink}
              to='/settings/account'
              color='brandPrimary.primaryDim'
              fontWeight={600}
              onClick={handleClose}
            >
              {t('welcomeModal.yourSettings')}
            </Link>
            &nbsp;so FORA&apos;s summaries and insights are more tailored for you.
          </Text>
          <HStack mt={4}>
            <Icon
              as={LightningFillThickIcon}
              color='brandPrimary.primary'
            />
            <Text variant='body-600-lg'>{t('welcomeModal.whatSNew')}</Text>
          </HStack>
          <UnorderedList spacing={2}>
            {featureItems.map(({ label, text }) => (
              <ListItem
                key={label}
                fontSize='sm'
              >
                <Text
                  fontWeight={600}
                  as='span'
                >
                  {label}
                </Text>
                <Text as='span'>&nbsp;—&nbsp;{text}</Text>
              </ListItem>
            ))}
          </UnorderedList>
          <HStack mt={8}>
            <Button
              variant='reskinWhite'
              onClick={handleClose}
            >
              {t('welcomeModal.dismiss')}
            </Button>
            <Button
              ref={ctaRef}
              as={ReactRouterLink}
              variant='reskinPrimary'
              to='/settings/account'
              onClick={handleClose}
            >
              {t('welcomeModal.goToProfileSettings')}
            </Button>
          </HStack>
        </Stack>
      </ModalContent>
    </Modal>
  );
}
