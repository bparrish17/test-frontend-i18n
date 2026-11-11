import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Box,
  Icon,
  Text,
  ModalHeader,
  ModalCloseButton,
  Stack
} from '@chakra-ui/react';
import LensCard from '@components/lens/lens-card.component';
import LensIcon from '@assets/icons/sf-icons/lens.icon';
import { useTranslation } from 'react-i18next';

export default function CreateLensSuccessModal({ isOpen, onClose, lens = {} }) {
  const { t } = useTranslation();

  return (
    <Modal
      variant='classic'
      isOpen={isOpen}
      onClose={onClose}
      size='2xl'
      border='reskin'
      isCentered
    >
      <ModalOverlay />

      <ModalContent mx={{ base: 4, xl: 'unset' }}>
        <ModalHeader
          bgColor='brandPrimary.onContainer'
          color='brandPrimary.onPrimary'
        >
          <Flex
            justifyContent='flex-start'
            alignItems='center'
            gap={2}
          >
            <Icon as={LensIcon} />
            <Text>{t('createLensSuccessModal.lensCreated')}</Text>
          </Flex>
        </ModalHeader>
        <ModalCloseButton color='white' />
        <Stack
          p={11}
          gap={8}
          direction={{ base: 'column', xl: 'row' }}
          alignItems='center'
        >
          <Box flex={3}>
            <LensCard
              lens={lens}
              enableNavigation={false}
            />
          </Box>
          <Box flex={4}>
            <Text>{t('createLensSuccessModal.yourLensHasBeen')}</Text>
            <Text>
              Your Lens is now{' '}
              <b color='brandPrimary.onContainer'>{t('createLensSuccessModal.active')}</b>. FORA is
              busy analyzing your data and creating an update based on your criteria. You will
              receive your first Lens update within 24 hours.
            </Text>
          </Box>
        </Stack>
      </ModalContent>
    </Modal>
  );
}
