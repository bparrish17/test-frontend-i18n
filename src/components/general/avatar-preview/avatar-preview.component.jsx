import { Avatar, Box, Flex, Stack, Text, Input, Icon, Spinner } from '@chakra-ui/react';
import { useRef } from 'react';

import { SFPencilIcon } from '@assets/icons';

const sizeStyleMap = {
  default: {
    avatar: {
      size: 'sm'
    },
    textStack: {
      gap: 0.5
    },
    name: {
      fontSize: 'md',
      lineHeight: '16px'
    },
    title: {
      fontSize: 'xs',
      lineHeight: '14px'
    }
  },
  sm: {
    avatar: {
      size: 'sm'
    },
    textStack: {
      gap: 1.5
    },
    name: {
      fontSize: 'sm',
      lineHeight: '16px'
    },
    title: {
      fontSize: 'xs',
      lineHeight: '14px'
    }
  },
  lg: {
    avatar: {
      size: 10
    },
    textStack: {
      gap: '3px'
    },
    name: {
      fontSize: 'lg',
      lineHeight: '18px'
    },
    title: {
      fontSize: 'sm',
      lineHeight: '19px'
    }
  },
  xl: {
    avatar: {
      size: 11
    },
    textStack: {
      gap: 0,
      justifyContent: 'center'
    },
    name: {
      textStyle: 'body-sm'
    },
    title: {
      textStyle: 'label-lighter-sm'
    }
  },
  '2xl': {
    container: {
      align: 'center'
    },
    avatar: {
      size: 15
    },
    textStack: {
      gap: '3px'
    },
    name: {
      fontSize: '2xl',
      fontWeight: 600,
      lineHeight: 1.25
    },
    title: {
      textStyle: 'label-500-lg',
      fontWeight: 400
    }
  }
};

/**
 * @see {usePopulateMeetingAttendees} for the person interface
 */
export default function AvatarPreview({
  name,
  title,
  photoUrl,
  size = 'default',
  variant = 'default',
  fallbackIcon,
  avatarVariant,
  children,
  additionalText,
  avatarProps = {},
  nameProps = {},
  titleProps = {},
  textStackProps = {},
  titleContainerProps = {},
  avatarBadge,
  enableAvatarUpload = false,
  onAvatarUpload,
  isUploadingAvatar = false,
  ...containerProps
}) {
  const sizeStyles = sizeStyleMap[size];
  const fileInputRef = useRef(null);

  const containerVariantStyles =
    variant === 'card'
      ? {
          size: 'sm',
          p: 3,
          border: 'reskin',
          borderRadius: 'xl'
        }
      : {};

  const handleAvatarClick = (e) => {
    if (enableAvatarUpload) {
      e.preventDefault();
      e.stopPropagation();
      fileInputRef.current?.click();
    }
  };

  return (
    <Flex
      gap={2.5}
      {...(sizeStyles?.container ?? {})}
      {...containerVariantStyles}
      {...containerProps}
    >
      {children ?? (
        <Box
          alignSelf='flex-start'
          position={avatarBadge || enableAvatarUpload ? 'relative' : 'initial'}
        >
          <Box
            position='relative'
            display='inline-block'
            role='group'
            onClick={handleAvatarClick}
          >
            <Avatar
              src={photoUrl}
              size={sizeStyles.avatar.size}
              variant={avatarVariant}
              icon={fallbackIcon}
              cursor={enableAvatarUpload ? 'pointer' : 'default'}
              opacity={isUploadingAvatar ? 0.6 : 1}
              {...avatarProps}
            />

            {/* Hover overlay with icon */}
            {enableAvatarUpload && !isUploadingAvatar && (
              <Box
                data-testid='edit-icon'
                position='absolute'
                inset='0'
                display='flex'
                alignItems='center'
                justifyContent='center'
                opacity='0'
                transition='opacity 0.2s'
                _groupHover={{ opacity: 1 }}
                bg='blackAlpha.400'
                borderRadius='full'
                zIndex='1'
                pointerEvents='none'
              >
                <Icon
                  as={SFPencilIcon}
                  color='white'
                  boxSize={10}
                />
              </Box>
            )}

            {/* Loading spinner overlay */}
            {isUploadingAvatar && (
              <Box
                data-testid='uploading-spinner'
                position='absolute'
                inset='0'
                display='flex'
                alignItems='center'
                justifyContent='center'
                bg='blackAlpha.400'
                borderRadius='full'
                zIndex='2'
              >
                <Spinner color='white' />
              </Box>
            )}
          </Box>
          {avatarBadge}
          {enableAvatarUpload && (
            <Input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              display='none'
              onChange={onAvatarUpload}
            />
          )}
        </Box>
      )}
      <Stack
        align='flex-start'
        {...sizeStyles.textStack}
        {...textStackProps}
      >
        <Text
          color='brandPrimary.primary'
          variant='title-lighter-sm'
          {...sizeStyles.name}
          textOverflow='ellipsis'
          {...nameProps}
        >
          {name}
        </Text>
        <Flex
          color='surface.onSurfaceVariant'
          fontWeight={500}
          w='full'
          {...sizeStyles.title}
          {...titleContainerProps}
        >
          {title && (
            <Text
              as='span'
              {...titleProps}
            >
              {title}
            </Text>
          )}
          {additionalText}
        </Flex>
      </Stack>
    </Flex>
  );
}
