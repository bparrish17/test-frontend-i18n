import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

export const selectTheme = defineStyleConfig({
  sizes: {
    reskinXs: {
      field: {
        textIndent: 'unset',
        fontSize: 'xs',
        lineHeight: 3,
        px: 3,
        py: 2,
        borderRadius: 'md'
      }
    },
    reskinMd: {
      field: {
        textIndent: 'unset',
        fontSize: 'sm',
        lineHeight: 4,
        px: 3,
        py: 2,
        borderRadius: 'lg'
      }
    },
    reskinLg: {
      field: {
        textIndent: 'unset',
        pl: 3,
        pr: 5,
        py: '13.5px',
        borderRadius: 'lg'
      },
      icon: defineStyle({
        fontSize: '3xl',
        color: 'surface.onSurfaceVariant'
      })
    }
  },
  variants: {
    // todo: update "outline", "flushed", and "unstyled" variants based on figma, if applicable
    // rn this is just a container-colorscheme need, there's no designs for other color scheme'd selects, but can expand
    // if needed
    reskinOutline: {
      field: {
        bgColor: 'container.surfaceContainerLowest',
        color: 'surface.onSurfaceVariant',
        border: 'reskin'
      }
    },
    reskinFilled: {
      field: {
        bgColor: 'surface.containerLow',
        color: 'surface.onSurfaceVariant',
        border: 'reskin'
      }
    }
  },
  defaultProps: {
    colorScheme: 'surface'
  }
});
