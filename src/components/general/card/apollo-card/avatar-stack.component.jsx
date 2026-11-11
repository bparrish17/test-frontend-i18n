import { Stack, Flex, Avatar, Text } from '@chakra-ui/react';
import StyledLink from '@components/general/styled-link.component';
import { memo } from 'react';

// Reskin Todo: Would love to sit down with Josh and nail down the variants/sizes for this
// Would help make more clear and let us reuse it more easily

function AvatarStack({
  photoUrl,
  name,
  title,
  subtitle,
  link,
  size,
  bgColor = 'light_material.400'
}) {
  const sizes = {
    md: {
      avatarProps: {
        size: 9
      }
    },
    lg: {
      stackProps: {
        pt: '3.5px',
        pb: 2,
        gap: '3px'
      },
      avatarProps: {
        size: { base: 'lg', md: 15 }
      },
      nameProps: {
        fontSize: '2xl',
        lineHeight: 1.25
      }
    }
  };

  const { avatarProps, stackProps, nameProps } = sizes[size];

  return (
    <AvatarStackWrapper link={link}>
      <Avatar
        src={photoUrl}
        name={size === 'lg' ? name : null}
        borderRadius='full'
        bgColor={bgColor}
        color='white'
        {...avatarProps}
        loading='lazy'
      />
      <Stack
        gap={1.5}
        justify='center'
        {...stackProps}
      >
        <Text
          fontWeight={600}
          lineHeight='normal'
          {...nameProps}
        >
          {name}
        </Text>
        <Text
          fontSize='13px'
          color='surface.onSurfaceVariant'
        >
          {title}
        </Text>
        {subtitle && (
          <Text
            fontSize='13px'
            color='surface.onSurfaceVariant'
          >
            {subtitle}
          </Text>
        )}
      </Stack>
    </AvatarStackWrapper>
  );
}

function AvatarStackWrapper({ link, children }) {
  return link ? (
    <StyledLink
      display='flex'
      gap={2.5}
      to={link}
      color='inherit'
      textDecoration='none'
    >
      {children}
    </StyledLink>
  ) : (
    <Flex gap={2.5}>{children}</Flex>
  );
}

export default memo(AvatarStack);
