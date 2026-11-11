import { Button, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { SFLensIcon, SFExclamationMarkTriangleFilled } from '@assets/icons/sf-icons';
import StyledModal from '@components/general/modals/styled-modal.component';

export const DeactivateLensModal = ({ disclosure, onConfirm }) => {
  return (
    <StyledModal
      disclosure={disclosure}
      title={
        <HStack>
          <Icon
            as={SFExclamationMarkTriangleFilled}
            color='caution.onPrimary'
            boxSize={8}
          />
          <Text>Deactivate this Lens?</Text>
        </HStack>
      }
      modalProps={{ scrollBehavior: 'inside' }}
      modalContentProps={{ w: { base: '660px', '2xl': '900px' } }}
      modalBodyProps={{ p: '25' }}
      modalHeaderProps={{
        bgColor: 'caution.primary',
        color: 'caution.onPrimary'
      }}
      modalCloseButtonProps={{ color: 'caution.onPrimary' }}
    >
      <Stack>
        <Text fontWeight={500}>Deactivate this Lens?</Text>
        <Text>
          Disabling this lens will stop FORA from updating you and all followers based on its
          contents. Your organization will be credited one additional active lens. Any content
          previously generated will still be accessible.
        </Text>
        <Button
          variant='reskinPrimary'
          colorScheme='caution'
          mt={5}
          onClick={() => {
            onConfirm();
            disclosure.onClose();
          }}
        >
          Confirm
        </Button>
      </Stack>
    </StyledModal>
  );
};

export const ReactivateLensModal = ({ disclosure, onConfirm }) => {
  return (
    <StyledModal
      disclosure={disclosure}
      title={
        <HStack>
          <Icon
            as={SFLensIcon}
            color='white'
            boxSize={8}
          />
          <Text>Reactivate this Lens?</Text>
        </HStack>
      }
      modalProps={{ scrollBehavior: 'inside' }}
      modalContentProps={{ w: { base: '660px', '2xl': '900px' } }}
      modalBodyProps={{ p: '25' }}
      modalHeaderProps={{
        bgColor: 'brandPrimary.onContainer',
        color: 'brandPrimary.container'
      }}
      modalCloseButtonProps={{ color: 'brandPrimary.onPrimary' }}
    >
      <Stack>
        <Text>Reactivate this Lens?</Text>
        <Text>
          Reactivating this Lens ensures that you and all followers on this lens will once again
          receive updates based on its contents. This will use up one of your active lenses.
        </Text>
        <Button
          variant='reskinPrimary'
          color='caution.primary'
          onClick={() => {
            onConfirm();
            disclosure.onClose();
          }}
        >
          Confirm
        </Button>
      </Stack>
    </StyledModal>
  );
};
