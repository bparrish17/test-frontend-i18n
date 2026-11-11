import { modalAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  modalAnatomy.keys
);

const classicVariant = definePartsStyle(({ colorScheme }) => {
  if (!colorScheme) colorScheme = 'brandPrimary';
  return {
    header: {
      textAlign: 'center',
      fontSize: 'md',
      borderBottom: '1px solid',
      borderColor: 'surface.outlineVariant',
      bgColor: `${colorScheme}.onContainer`,
      color: `${colorScheme}.onPrimary`,
      py: 4
    },
    closeButton: {
      top: 3,
      color: `${colorScheme}.onPrimary`
    },
    body: {
      p: 0,
      bgColor: 'surface.containerLow'
    },
    dialog: {
      rounded: { base: 'unset', lg: '2xl' },
      overflow: 'hidden',
      my: 'auto'
    }
  };
});

const variants = {
  classic: classicVariant
};

const sizes = {
  '2xl': definePartsStyle({
    dialog: {
      maxW: '720px',
      minW: '400px'
    }
  }),
  '3xl': definePartsStyle({
    dialog: {
      maxW: '848px',
      minW: '400px'
    }
  })
};

export const modalTheme = defineMultiStyleConfig({
  variants,
  sizes,
  // todo: set classic as default variant here
  defaultProps: { size: '3xl' }
});
