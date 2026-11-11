import { avatarAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  avatarAnatomy.keys
);

const sizes = {
  xsm: definePartsStyle({
    container: {
      width: '28px',
      height: '28px',
      fontSize: 'xs'
    },
    excessLabel: {
      width: '24px',
      height: '24px',
      fontSize: '2xs',
      bgColor: 'brandPrimary.onContainer',
      color: 'white',
      justifyContent: 'flex-end',
      ml: '-10px',
      pr: '1.5px'
    }
  }),
  sm: definePartsStyle({
    excessLabel: {
      width: 8,
      height: 8,
      fontSize: 'xs',
      bgColor: 'brandPrimary.onContainer',
      color: 'white',
      justifyContent: 'flex-end',
      pr: '3px',
      border: 'solid 1px white'
    }
  }),
  9: definePartsStyle({
    container: {
      width: 9,
      height: 9,
      fontSize: 'sm'
    }
  }),
  10: definePartsStyle({
    container: {
      width: 10,
      height: 10
    }
  }),
  11: definePartsStyle({
    container: {
      width: 11,
      height: 11
    }
  }),
  15: definePartsStyle({
    container: {
      width: 15,
      height: 15,
      fontSize: '2xl'
    }
  })
};

const variants = {
  grayscale: definePartsStyle({
    container: {
      filter: 'grayscale(1)'
    }
  })
};

export const avatarTheme = defineMultiStyleConfig({ sizes, variants });
