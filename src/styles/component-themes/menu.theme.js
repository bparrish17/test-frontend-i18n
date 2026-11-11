import { menuAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  menuAnatomy.keys
);

const base = definePartsStyle({
  list: {
    px: 1.5,
    py: 2,
    boxShadow: '2xl'
  },
  item: {
    h: 8,
    px: 1.5,
    fontSize: 'sm',
    borderRadius: 'md',
    fontWeight: 600,
    color: 'surface.onSurfaceVariant',
    _hover: {
      bg: 'surface.surface'
    },
    _focus: {
      bg: 'none'
    }
  },
  groupTitle: {
    mx: 1.5,
    mb: 1.5,
    lineHeight: 4,
    fontSize: 'xs',
    color: 'surface.onSurfaceVariant',
    textTransform: 'uppercase',
    letterSpacing: 'widest',
    fontWeight: 600
  },
  divider: {
    my: 3,
    mx: 1.5,
    borderColor: 'surface.outlineVariant'
  }
});

const select = definePartsStyle({
  list: {
    p: 2,
    boxShadow: '2xl'
  },
  item: {
    my: 0.5,
    px: 2,
    py: 2,
    display: 'flex',
    gap: 3,
    alignItems: 'center',
    fontSize: '13px',
    borderRadius: 'md',
    fontWeight: 600,
    color: 'surface.onSurfaceVariant',
    _hover: {
      bg: 'surface.onSurfaceDim'
    },
    _focus: {
      bg: 'surface.onSurfaceDim'
    }
  }
});

const variants = {
  base,
  select
};

const defaultProps = {
  variant: 'base'
};

export const menuTheme = defineMultiStyleConfig({ variants, defaultProps });
