import { Stack, Text, Button, HStack, Icon } from '@chakra-ui/react';

import { SFExclamationMarkTriangleOutlined } from '@assets/icons';
import StyledModal from '@components/general/modals/styled-modal.component';

export default function ConfirmAccessModal({ disclosure, accessStats, toggleMeetingSensitivity }) {
  return (
    <StyledModal
      disclosure={disclosure}
      title={
        <HStack>
          <Icon
            as={SFExclamationMarkTriangleOutlined}
            color='white'
          />
          <Text fontWeight={400}>Confirm Access Change</Text>
        </HStack>
      }
      modalContentProps={{ w: { base: '660px', '2xl': '900px' } }}
      modalBodyProps={{ p: '5' }}
      modalHeaderProps={{
        bgColor: 'brandPrimary.onContainer',
        color: 'brandPrimary.container'
      }}
      modalCloseButtonProps={{ color: 'brandPrimary.onPrimary' }}
    >
      <Stack>
        <Text
          color='surface.onSurface'
          fontWeight={800}
        >
          This will remove access for{' '}
          {accessStats?.num_of_collaborators +
            accessStats?.num_of_managers +
            accessStats?.num_of_shares}{' '}
          people
        </Text>
        <Text color='surface.onSurfaceVariant'>
          This can be undone, but sharing recipients will need to be added back manually.
        </Text>
        <HStack w='full'>
          <Button
            variant='reskinWhite'
            mt={5}
            w='full'
            fontWeight={500}
            onClick={disclosure.onClose}
          >
            Cancel
          </Button>
          <Button
            variant='reskinPrimary'
            mt={5}
            w='full'
            fontWeight={500}
            onClick={toggleMeetingSensitivity}
          >
            Remove Access
          </Button>
        </HStack>
      </Stack>
    </StyledModal>
  );
}
