import { Icon, Center, Text, Stack, HStack, StackDivider, Button } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useBreakpointValue } from '@util/hooks';

export default function GlobalSearchResultSet({
  icon,
  iconBgColor,
  iconColor,
  label,
  labelButton,
  idProp = 'id',
  getLink,
  handleItemClick,
  results,
  children
}) {
  const breakpointProps = useBreakpointValue({
    base: {
      divider: <StackDivider />,
      gap: 3,
      pl: 4,
      py: 5
    },
    lg: {
      gap: 0,
      pl: 3,
      py: 4
    }
  });

  return (
    <Stack
      pr={4}
      {...breakpointProps}
    >
      <HStack mb={{ lg: 2 }}>
        <Center
          borderRadius='full'
          w={6}
          h={6}
          bgColor={iconBgColor}
        >
          <Icon
            as={icon}
            color={iconColor}
          />
        </Center>
        <Text
          fontSize='xs'
          textTransform='uppercase'
          fontWeight={600}
        >
          {label}
        </Text>
        {labelButton}
      </HStack>
      {results.map((record) => (
        <GlobalSearchResultLink
          key={record[idProp]}
          getLink={getLink}
          record={record}
          handleItemClick={handleItemClick}
        >
          {children}
        </GlobalSearchResultLink>
      ))}
    </Stack>
  );
}

function GlobalSearchResultLink({ record, getLink, handleItemClick, children, ...props }) {
  const breakpointProps = useBreakpointValue({
    base: {
      rounded: 'xl',
      py: 2,
      mx: -2,
      minW: 'full',
      whiteSpace: 'normal',
      h: 'unset'
    },
    lg: {
      rounded: 'full',
      ml: '22px',
      maxW: 'fit-content'
    }
  });

  return (
    <Button
      as={ReactRouterLink}
      to={getLink(record)}
      variant='ghost'
      _hover={{ bgColor: 'surface.surface' }}
      size='sm'
      color='surface.onSurface'
      lineHeight={4}
      justifyContent='flex-start'
      onClick={handleItemClick}
      {...breakpointProps}
      {...props}
    >
      {children(record)}
    </Button>
  );
}
