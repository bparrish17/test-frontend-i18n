import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const variants = defineStyle({
  outline: defineStyle({
    border: 'reskin',
    borderColor: 'surface.outlineVariant',
    h: 12,
    rounded: 'lg',
    bg: 'surface.containerLowest',
    _hover: {
      bg: 'surface.containerLowest'
    },
    _placeholder: { color: 'surface.outline', opacity: 0.5, fontWeight: 400 },
    _focus: {
      bg: 'surface.containerLowest',
      boxShadow: 'none',
      borderWidth: '1px',
      borderColor: 'surface.outline'
    }
  }),
  filled: defineStyle({
    border: 'reskin',
    borderColor: 'surface.outlineVariant',
    rounded: 'lg',
    bg: 'surface.containerLow',
    _placeholder: { color: 'surface.outline', fontWeight: 400 },
    _focus: {
      bg: 'surface.containerLowest',
      boxShadow: 'none',
      borderWidth: '1px',
      borderColor: 'surface.outline'
    }
  })
});

const sm = defineStyle({
  h: 10,
  px: 3,
  _placeholder: { fontSize: '14px' }
});

const md = defineStyle({
  h: 12,
  px: 4,
  pt: 3,
  _placeholder: { fontSize: '16px' }
});

const lg = defineStyle({
  h: 14,
  px: 6,
  pt: 4,
  _placeholder: { fontSize: '18px' }
});

const sizes = {
  sm,
  md,
  lg
};

const defaultProps = {
  variant: 'outline'
};

export const textareaTheme = defineStyleConfig({
  variants,
  sizes,
  defaultProps
});
