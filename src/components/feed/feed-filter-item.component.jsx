import { Box, Button, Collapse, Flex, Spacer, Text, useDisclosure } from '@chakra-ui/react';

import { ChevronDownIcon } from '@assets/icons';
import { MotionBox } from '@components/general/motion-box.component';

export default function FilterItem({ text, toggleCount, isToggleable, children, ...props }) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: !isToggleable });
  const toggleButtonProps = isToggleable
    ? { as: 'button', cursor: 'pointer', onClick: onToggle }
    : {};

  return (
    <Box
      w='full'
      color='surface.onSurfaceVariant'
      {...props}
    >
      <Flex
        mb={2}
        h='18px'
        align='center'
        gap={3}
        {...toggleButtonProps}
      >
        <Text
          fontSize='xs'
          fontWeight={600}
        >
          {text}
        </Text>
      </Flex>
      {isToggleable && (
        <Button
          pr={0}
          border='surface.outlineVariant'
          variant='reskinWhite'
          borderWidth='2px'
          borderBottom={isOpen ? 'none' : '2px solid surface.outlineVariant'}
          borderTopLeftRadius='md'
          borderTopRightRadius='md'
          borderBottomRightRadius={isOpen ? '0' : 'md'}
          borderBottomLeftRadius={isOpen ? '0' : 'md'}
          w='full'
          data-testid='feed-toggle-button'
          {...toggleButtonProps}
        >
          <Flex
            w='full'
            alignItems='center'
          >
            <Text
              color='surface.outline'
              textStyle='body-500-sm'
            >
              {text}
            </Text>
            <Spacer />
            {toggleCount > 0 && (
              <Text
                fontWeight={100}
                fontSize='xs'
                mr={2}
              >
                {toggleCount} selected
              </Text>
            )}
            <MotionBox
              animate={{ rotate: isOpen ? 180 : 0 }}
              mr={3}
            >
              <ChevronDownIcon />
            </MotionBox>
          </Flex>
        </Button>
      )}
      <Collapse
        in={isOpen}
        style={{ overflow: 'visible' }}
      >
        <Box
          border='surface.outlineVariant'
          bgColor='surface.containerLowest'
          color='surface.onSurfaceVariant'
        >
          {children}
        </Box>
      </Collapse>
    </Box>
  );
}
