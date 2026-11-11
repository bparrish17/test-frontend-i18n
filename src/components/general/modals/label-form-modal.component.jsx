import {
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text
} from '@chakra-ui/react';

import { SFApplePencil, SFPlusIcon } from '@assets/icons';
import LabelForm from '@components/settings/manage-labels/label-form.component';
import { useTranslation } from 'react-i18next';

const LabelFormModal = ({ disclosure, isEditing, refetch, selectedLabel, onCreateLabel }) => {
  const { t } = useTranslation();

  return (
    <Modal
      {...disclosure}
      variant='classic'
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent maxW='440px'>
        <ModalHeader>
          <HStack>
            {isEditing ? <SFApplePencil /> : <SFPlusIcon />}
            <Text variant='body-600-md'>
              {isEditing ? t('labelFormModal.edit') : t('labelFormModal.new')} Label
            </Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody data-testid='label-form-modal'>
          <LabelForm
            disclosure={disclosure}
            refetch={refetch}
            isEditing={isEditing}
            selectedLabel={selectedLabel}
            onCreateLabel={onCreateLabel}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LabelFormModal;
