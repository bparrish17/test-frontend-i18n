import {
  Modal,
  ModalOverlay,
  ModalContent,
  Heading,
  VStack,
  Box,
  Divider,
  HStack,
  Text
} from '@chakra-ui/react';
import { size } from 'lodash-es';
import { CheckIconCircle } from '@assets/icons';
import { useTranslation } from 'react-i18next';

export default function CreateFocusSuccessModal({ isOpen, onClose, focus = {} }) {
  const { t } = useTranslation();

  if (size(focus) <= 0) return null;

  const { title, collaborators, rules } = focus;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
      isCentered
    >
      <ModalOverlay bg='none' />
      <ModalContent
        borderRadius='xl'
        border='reskin'
      >
        <Box
          px={52}
          py={16}
        >
          <VStack gap={4}>
            <CheckIconCircle
              width='96px'
              height='96px'
            />
            <Heading size='md'>{t('createFocusSuccessModal.newCategoryCreated')}</Heading>
            <Box w={20}>
              <Divider />
            </Box>
            <Text>{title}</Text>
            <HStack gap={4}>
              <Text>{t('createFocusSuccessModal.followers', { collaborators })}</Text>
              <Text>{t('createFocusSuccessModal.rules', { rules })}</Text>
            </HStack>
          </VStack>
        </Box>
      </ModalContent>
    </Modal>
  );
}
