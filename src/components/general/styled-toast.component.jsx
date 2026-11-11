import { Button, HStack, Icon, IconButton, Spacer, Stack, Text } from '@chakra-ui/react';
import {
  CloseIcon,
  SFCheckmark,
  SFExclamationMarkTriangleFilled,
  SFExclamationMarkTriangleOutlined
} from '@assets/icons';
import { mapValues } from 'lodash-es';

const getVariantColors = (status, variant) => {
  const statusIconMap = {
    success: SFCheckmark,
    warning: SFExclamationMarkTriangleOutlined,
    error: SFExclamationMarkTriangleFilled,
    info: null
  };
  const statusColorTokenMap = {
    success: 'positive',
    warning: 'caution',
    error: 'critical',
    info: 'brandPrimary'
  };
  const variantColorTokenMap = {
    solid: {
      color: 'onPrimary',
      bgColor: 'primary',
      bgColorDim: 'primaryDim'
    },
    subtle: {
      color: 'onContainer',
      bgColor: 'container',
      bgColorDim: 'containerHigh'
    }
  };

  const statusColorToken = statusColorTokenMap[status];

  return {
    // returns semantic-token e.g. `positive.onContainer`
    ...mapValues(variantColorTokenMap[variant], (val) => `${statusColorToken}.${val}`),
    statusColorToken,
    icon: statusIconMap[status]
  };
};

const sizePropsMap = (isClosable) => ({
  sm: {
    icon: {
      boxSize: 4
    },
    container: {
      p: '14px',
      ml: isClosable && -0.5
    },
    title: {
      fontSize: 'md'
    },
    titleContainer: {
      ml: 1
    },
    description: {
      fontSize: 'sm'
    },
    actionButton: {
      size: 'reskinXs',
      px: 3
    },
    closeButton: {
      size: 'sm',
      my: -1
    }
  },
  lg: {
    icon: {
      boxSize: 5
    },
    container: {
      p: 4,
      ml: isClosable && -1
    },
    titleContainer: {
      ml: 2
    },
    title: {
      fontSize: 'lg'
    },
    description: {
      fontSize: 'md'
    },
    actionButton: {
      size: 'reskinMd'
    },
    closeButton: {
      size: 'smd',
      my: -0.5
    }
  }
});

/**
 *
 * @param {import('@chakra-ui/react').ToastProps} param0
 * @returns
 */
export default function StyledToast({
  // chakra ToastProps
  status = 'info',
  variant = 'solid',
  title,
  description,
  isClosable,
  onClose,

  // custom component props
  size = 'sm',
  actionText,
  onActionClick,
  containerProps = {
    zIndex: 9999999999
  },
  titleProps = {}
}) {
  const {
    color: textColor,
    bgColor,
    bgColorDim,
    statusColorToken,
    icon
  } = getVariantColors(status, variant);
  const sizeProps = sizePropsMap(isClosable)[size];

  return (
    <HStack
      bgColor={bgColor}
      color={textColor}
      maxW='466px'
      w={{ base: '90vw', lg: '466px' }}
      shadow='lg'
      rounded='lg'
      {...sizeProps.container}
      {...containerProps}
    >
      {icon && (
        <Icon
          as={icon}
          {...sizeProps.icon}
        />
      )}
      <Stack
        align='start'
        gap={1}
        {...sizeProps.titleContainer}
        onClick={onActionClick}
        cursor={onActionClick ? 'pointer' : 'default'}
      >
        <Text
          fontWeight={500}
          fontSize={sizeProps.title.fontSize}
          {...titleProps}
        >
          {title}
        </Text>
        {description && <Text>{description}</Text>}
      </Stack>
      <Spacer />
      {actionText ? (
        <Button
          variant='reskinOutline'
          colorScheme={statusColorToken}
          color={textColor}
          _hover={{ bgColor: bgColorDim }}
          _active={{ bgColor: bgColorDim }}
          borderColor={`${statusColorToken}.primaryFixedDim`}
          {...sizeProps.actionButton}
          onClick={() => {
            onActionClick();
            onClose();
          }}
        >
          {actionText}
        </Button>
      ) : null}
      {isClosable && (
        <IconButton
          isRound
          variant='reskinGhost'
          colorScheme={statusColorToken}
          color={textColor}
          _hover={{ bgColor: bgColorDim }}
          _active={{ bgColor: bgColorDim }}
          onClick={onClose}
          icon={<CloseIcon fontSize='18px' />}
          {...sizeProps.closeButton}
        />
      )}
    </HStack>
  );
}
