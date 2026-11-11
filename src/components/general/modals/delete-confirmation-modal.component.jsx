import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text
} from '@chakra-ui/react';
import { SFTrashIcon } from '@assets/icons';
import { useTranslation } from 'react-i18next';

export default function DeleteConfirmationModal({
  disclosure,
  headerText = 'Delete Permanently?',
  confirmText = 'Delete Permanently',
  onConfirmDelete,
  isDeleting,
  children
}) {
  const { t } = useTranslation();

  return (
    <Modal
      {...disclosure}
      variant='classic'
      scrollBehavior='inside'
    >
      <ModalOverlay />
      <ModalContent maxW='500px'>
        <ModalHeader>
          <HStack>
            <SFTrashIcon boxSize={6} />
            <Text variant='body-600-md'>{headerText}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody data-testid='delete-confirmation-modal'>
          <Stack
            gap={6}
            p={6}
          >
            {children}
            <HStack
              justifyContent='flex-end'
              mt={5}
            >
              <Button
                variant='reskinSecondary'
                onClick={disclosure.onClose}
              >
                {t('common.cancel')}
              </Button>
              <Button
                data-testid='confirm-delete-button'
                variant='reskinOutline'
                colorScheme='critical'
                onClick={onConfirmDelete}
                isLoading={isDeleting}
              >
                {confirmText}
              </Button>
            </HStack>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
