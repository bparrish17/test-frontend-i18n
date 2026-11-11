import { Text, useDisclosure, IconButton } from '@chakra-ui/react';
import { SFTrashIcon } from '@assets/icons';
import { useDeleteChannel } from '@services/query-services/channels.query-service';
import { useStyledToast } from '@util/hooks';
import { getAPIError } from '@util/helpers';
import DeleteConfirmationModal from '@components/general/modals/delete-confirmation-modal.component';

export default function DeleteDigestModal({ digest }) {
  const disclosure = useDisclosure();
  const toast = useStyledToast();
  const { mutateAsync: deleteChannel, isLoading } = useDeleteChannel();

  const handleDeleteClick = async () => {
    await deleteChannel(digest?.id, {
      onSuccess: () => {
        toast({ status: 'success', title: `"${digest?.name}" Deleted Successfully` });
        disclosure.onClose();
      },
      onError: (res) =>
        toast({
          status: 'error',
          title: getAPIError(
            res,
            `Something went wrong while deleting "${digest?.name}". Please try again.`
          )
        })
    });
  };

  return (
    <>
      <IconButton
        variant='reskinOutline'
        colorScheme='critical'
        size='reskinMd'
        px={2}
        rounded='lg'
        icon={<SFTrashIcon boxSize={4} />}
        onClick={() => disclosure.onOpen()}
      />
      <DeleteConfirmationModal
        headerText='Deactivate Digest?'
        confirmText='Deactivate'
        isDeleting={isLoading}
        disclosure={disclosure}
        onConfirmDelete={handleDeleteClick}
      >
        <Text color='surface.onSurfaceVariant'>
          No more summaries will be generated for this digest. Previously created summaries will
          remain.
        </Text>
      </DeleteConfirmationModal>
    </>
  );
}
