import { Flex, HStack, Icon, Stack, Text } from '@chakra-ui/react';
import { CloseIcon } from '@assets/icons';

export default function InfoBlurb({
  title,
  icon,
  iconWrapperProps = {},
  children,
  footer,
  onCloseClick
}) {
  return (
    <Stack
      p={3}
      gap={3}
      bgColor='brandPrimary.container'
      color='brandPrimary.primary'
      borderRadius='lg'
    >
      <HStack
        justify='space-between'
        py={0.5}
      >
        <Text variant='label-caps-600-sm'>{title}</Text>
        <Icon
          as={CloseIcon}
          cursor='pointer'
          fill='surface.outline'
          _hover={{ fill: 'brandPrimary.onContainer' }}
          onClick={onCloseClick}
        />
      </HStack>
      <Flex gap={3}>
        <Flex
          minW={12}
          h={12}
          justify='center'
          align='center'
          borderRadius='md'
          {...iconWrapperProps}
        >
          {icon}
        </Flex>
        <Text
          color='brandPrimary.onContainer'
          variant='body-500-sm'
        >
          {children}
        </Text>
      </Flex>
      {footer}
    </Stack>
  );
}
