import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  HStack
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function TeamDeleteDialog({ team, onCancel, onConfirm }) {
  const { t } = useTranslation();
  const cancelRef = useRef();

  return (
    <AlertDialog
      isOpen={!!team}
      leastDestructiveRef={cancelRef}
      onClose={onCancel}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader>{t('common.delete')}</AlertDialogHeader>
          <AlertDialogBody>
            {t('manageTeams.deleteTeamConfirm', { name: team?.name })}
          </AlertDialogBody>
          <AlertDialogFooter>
            <HStack>
              <Button
                ref={cancelRef}
                variant='reskinSecondary'
                onClick={onCancel}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant='reskinOutline'
                colorScheme='critical'
                onClick={onConfirm}
              >
                {t('common.delete')}
              </Button>
            </HStack>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
