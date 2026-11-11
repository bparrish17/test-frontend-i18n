import { tagAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { textTheme } from './text.theme';

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(tagAnatomy.keys);

export const tagTheme = defineMultiStyleConfig({
  variants: {
    label: definePartsStyle({
      container: definePartsStyle({
        bgColor: 'surface.surface',
        color: 'surface.onSurfaceVariant'
      })
    }),
    new: ({ size }) =>
      definePartsStyle({
        container: {
          bgColor: 'caution.primary',
          color: 'caution.onPrimary',
          pl: 1.5,
          pr: '3px',
          pt: '1px',
          ...textTheme.variants[`label-caps-600-${size}`]
        }
      }),
    subtle: ({ colorScheme }) => ({
      container: {
        bgColor: `${colorScheme}.container`,
        color: `${colorScheme}.onContainer`
      }
    }),
    solid: ({ colorScheme }) => ({
      container: {
        bgColor: `${colorScheme}.primary`,
        color: `${colorScheme}.onPrimary`
      }
    })
  },
  sizes: {
    xl: {
      container: {
        py: '5px',
        px: '12px',
        fontSize: '13px',
        rounded: 'full'
      }
    },
    md: {
      container: {
        minW: 'unset'
      }
    }
  },
  defaultProps: {
    size: 'xl' // todo: this should stay 'md' by default, but need to check all instances of xl
  }
});
