import { Box, Flex, Icon, Spacer, Stack, Text } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { SFCalendarIcon } from '@assets/icons';

const sizeConfigs = {
  md: {
    container: {
      p: 3
    },
    icon: {
      boxSize: '15px',
      m: 0.5
    },
    textContainer: {
      gap: 0.5,
      maxW: 'calc(100% - 20px)' // limit text beyond container width less the left element
    },
    title: {
      fontSize: 'md',
      fontWeight: 600
    }
  },
  lg: {
    container: {
      px: 6,
      py: 3
    },
    icon: {
      boxSize: '18px',
      m: 1
    },
    textContainer: {
      gap: 1.5,
      maxW: 'calc(100% - 36px)' // limit text beyond container width less the left element
    },
    title: {
      variant: 'title-md',
      py: 0.5
    }
  }
};

export default function ReskinCardHeader({
  title,
  titleLink,
  headerChildren,
  children,
  leftElement,
  isDocument,
  size = 'md',
  ...containerProps
}) {
  const sizeProps = sizeConfigs[size];

  const ClickableWrapper = ({ children: wrapperChildren, ...wrapperProps }) => {
    if (titleLink) {
      return (
        <Flex
          as={ReactRouterLink}
          cursor='pointer'
          to={titleLink}
          {...wrapperProps}
        >
          {wrapperChildren}
        </Flex>
      );
    }
    return <Flex {...wrapperProps}>{wrapperChildren}</Flex>;
  };

  return (
    <Flex
      gap={2}
      p={3}
      maxW='100%'
      {...sizeProps.container}
      {...containerProps}
    >
      <ClickableWrapper
        flex={1}
        gap={2}
      >
        {leftElement ?? (
          <Icon
            as={SFCalendarIcon}
            color='brandPrimary.onContainer'
            {...sizeProps.icon}
          />
        )}
        <Stack
          justifyContent='center'
          flex={1}
          gap={0.5}
          pr={isDocument && 8}
          {...sizeProps.textContainer}
        >
          <Flex align='flex-start'>
            <Text
              as='span'
              noOfLines={2}
              {...sizeProps.title}
            >
              {title}
            </Text>
            <Spacer />
          </Flex>
          {children}
        </Stack>
      </ClickableWrapper>
      {headerChildren && <Box>{headerChildren}</Box>}
    </Flex>
  );
}
