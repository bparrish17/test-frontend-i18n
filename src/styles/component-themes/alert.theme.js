import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { alertAnatomy } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  alertAnatomy.keys
);

const baseStyle = definePartsStyle((props) => {
  const status = props?.status || 'info';
  const variant = props?.variant || 'solid';
  const statusColorTokenMap = {
    success: 'positive',
    warning: 'caution',
    error: 'critical',
    info: 'brandPrimary'
  };
  const variantBgColorTokenMap = {
    solid: 'primary',
    subtle: 'container'
  };
  const variantColorTokenMap = {
    solid: 'onPrimary',
    subtle: 'onContainer'
  };

  const statusColorToken = statusColorTokenMap[status];
  const textColor = `${statusColorToken}.${variantColorTokenMap[variant]}`; // e.g. caution.onPrimary

  return {
    icon: {
      color: textColor
    },
    title: {
      fontWeight: 500,
      color: textColor
    },
    description: {
      color: textColor
    },
    container: {
      p: 4,
      borderRadius: 'lg',
      bgColor: `${statusColorToken}.${variantBgColorTokenMap[variant]}`,
      color: textColor
    }
  };
});

export const alertTheme = defineMultiStyleConfig({
  baseStyle,
  defaultProps: {
    bgColor: 'brandPrimary.primary',
    color: 'brandPrimary.onPrimary'
  }
});
