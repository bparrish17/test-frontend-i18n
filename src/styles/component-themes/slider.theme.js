import { sliderAnatomy as parts } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const sizes = {
  xl: definePartsStyle({
    container: {
      h: '10px'
    },
    thumb: {
      w: 8,
      h: 8
    },
    track: {
      h: '10px'
    },
    filledTrack: {
      h: '10px'
    }
  })
};

const baseStyle = definePartsStyle({
  thumb: {
    bg: 'brandPrimary.onPrimary',
    borderColor: 'surface.outlineVariant'
  },
  track: {
    bg: 'surface.outlineVariant',
    borderRadius: 'full'
  },
  filledTrack: {
    bg: 'brandPrimary.primary',
    borderRadius: 'full'
  }
});

export const sliderTheme = defineMultiStyleConfig({ sizes, baseStyle });
