import { switchAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  switchAnatomy.keys
);

// define the base component styles
const baseStyle = definePartsStyle({
  track: {
    p: '4px',
    bgColor: '#E9EBEF',
    border: '1px solid',
    borderColor: '#C3CBD9',
    _checked: {
      bgColor: 'brandPrimary.primary',
      borderColor: 'brandPrimary.primary'
    }
  },
  thumb: {}
});

const defaultProps = defineStyle({
  size: 'md'
});

const sizes = {
  sm: definePartsStyle({
    track: {
      p: '3px'
    }
  }),
  md: definePartsStyle({
    track: {
      p: '3px'
    }
  })
};

const variants = {
  live: definePartsStyle({
    track: {
      _checked: {
        bgColor: 'brandPrimary.onPrimary'
      },
      _unchecked: {
        bgColor: 'brandPrimary.onPrimary'
      }
    },
    thumb: {
      _checked: {
        bgColor: 'live.primary'
      },
      _unchecked: {
        bgColor: 'live.inversePrimary'
      }
    }
  })
};

export const switchTheme = defineMultiStyleConfig({ baseStyle, sizes, variants, defaultProps });
