import {
  Text,
  useDisclosure,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Box
} from '@chakra-ui/react';

import { SFEllipsisIcon, SFSquareOnSquareIcon } from '@assets/icons';
import { useStyledToast } from '@util/hooks';

export default function CopyTextMenu({
  textToCopy,
  hoverButton = true,
  menuButtonProps = {},
  trackerFn
}) {
  const toast = useStyledToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const copyTextClicked = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast({
          title: 'Copied to clipboard',
          status: 'success',
          duration: 2000,
          isClosable: true
        });
      })
      .catch(() => {
        toast({
          title: 'Copy failed',
          status: 'error',
          duration: 2000,
          isClosable: true
        });
      });
  };

  const onClick = (e) => {
    if (trackerFn) {
      trackerFn();
    }
    return e?.stopPropagation();
  };

  return (
    <Menu
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement='right-start'
    >
      {hoverButton ? (
        <MenuButton
          as={IconButton}
          icon={
            <Box
              rounded
              opacity={0}
              _groupHover={{ opacity: 1 }}
              alignSelf='start'
            >
              <SFEllipsisIcon
                boxSize={4}
                cursor='pointer'
              />
            </Box>
          }
          size='reskin2xs'
          variant='reskinGhost'
          colorScheme='surface'
          onClick={onClick}
          {...menuButtonProps}
        />
      ) : (
        <MenuButton
          as={IconButton}
          rounded='full'
          icon={
            <SFEllipsisIcon
              boxSize={4}
              cursor='pointer'
            />
          }
          variant='reskinGhost'
          colorScheme='surface'
          size='xs'
          onClick={onClick}
          {...menuButtonProps}
        />
      )}
      <MenuList gap={3}>
        <MenuItem
          icon={<SFSquareOnSquareIcon w={5} />}
          onClick={copyTextClicked}
        >
          <Text>Copy Text</Text>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
