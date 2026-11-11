import { Button, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { SFTrashIcon } from '@assets/icons';
import StyledModal from '@components/general/modals/styled-modal.component';
import { useTranslation } from 'react-i18next';

export default function DeactivateTemplateModal({ disclosure, onConfirm }) {
  const { t } = useTranslation();

  return (
    <StyledModal
      disclosure={disclosure}
      title={
        <HStack alignItems='center'>
          <Icon
            as={SFTrashIcon}
            color='brandPrimary.onPrimary'
            boxSize='24px'
          />
          <Text fontSize='md'>{t('deactivateTemplateModal.deleteTemplatePermanently')}</Text>
        </HStack>
      }
      modalProps={{ scrollBehavior: 'inside' }}
      modalContentProps={{ w: '540px' }}
      modalBodyProps={{ p: '25' }}
      modalHeaderProps={{
        bgColor: 'brandPrimary.primary',
        color: 'brandPrimary.onPrimary'
      }}
      modalCloseButtonProps={{ color: 'brandPrimary.onPrimary' }}
    >
      <Stack>
        <Text>{t('deactivateTemplateModal.ifYouDeleteThis')}</Text>
        <HStack
          justifyContent='flex-end'
          mt={5}
        >
          <Button
            variant='reskinSecondary'
            onClick={disclosure.onClose}
          >
            {t('deactivateTemplateModal.cancel')}
          </Button>
          <Button
            type='submit'
            variant='reskinOutline'
            colorScheme='critical'
            onClick={onConfirm}
          >
            {t('deactivateTemplateModal.deletePermanently')}
          </Button>
        </HStack>
      </Stack>
    </StyledModal>
  );
}
