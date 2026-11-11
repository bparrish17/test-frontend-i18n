import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Text,
  Heading,
  Button
} from '@chakra-ui/react';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

export default function FollowersChangeAlertDialog({ disclosure, onClose }) {
  const { t } = useTranslation();

  const { isOpen: isFollowersAlertOpen, onClose: onCloseFollowersAlert } = disclosure;
  const followersAlertCancelRef = useRef();

  return (
    <AlertDialog
      isOpen={isFollowersAlertOpen}
      isCentered
      leastDestructiveRef={followersAlertCancelRef}
      onClose={() => {
        onClose();
        onCloseFollowersAlert();
      }}
    >
      <AlertDialogOverlay>
        <AlertDialogContent
          pt={3}
          pb={1}
          borderRadius='lg'
        >
          <AlertDialogHeader>
            <Heading size='md'>{t('followersChangeAlertDialog.lensFollowerWarning')}</Heading>
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{t('followersChangeAlertDialog.followersWillHaveAccess')}</Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button
              size='reskinLg'
              variant='reskinSecondary'
              colorScheme='critical'
              ref={followersAlertCancelRef}
              onClick={() => {
                onClose();
                onCloseFollowersAlert();
              }}
              ml={3}
            >
              {t('followersChangeAlertDialog.confirm')}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
