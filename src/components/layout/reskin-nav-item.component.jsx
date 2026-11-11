import { Flex, Icon } from '@chakra-ui/react';
import { forwardRef } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

function ReskinNavItem({ to, title, icon, isActive, iconProps = {}, ...props }, ref) {
  return (
    <Flex
      as={ReactRouterLink}
      ref={ref}
      gap={1}
      h={20}
      justify='center'
      align='center'
      to={to}
      title={title}
      w='full'
      color={isActive ? 'brandPrimary.primary' : 'surface.onSurfaceVariant'}
      pr={0.5}
      borderLeft='solid 2px'
      bgColor={isActive ? 'surface.surfaceBright' : 'unset'}
      borderRightRadius='md'
      borderColor={isActive ? 'brandPrimary.primary' : 'transparent'}
      _hover={{ bgColor: 'surface.containerHigh' }}
      {...props}
    >
      <Icon
        as={icon}
        boxSize={6}
        {...iconProps}
      />
    </Flex>
  );
}

export default forwardRef(ReskinNavItem);
