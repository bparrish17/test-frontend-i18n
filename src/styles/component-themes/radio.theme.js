import { radioAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  radioAnatomy.keys
);

const xs = definePartsStyle({
  control: defineStyle({
    boxSize: '24px'
  })
});

const sm = definePartsStyle({
  control: defineStyle({
    boxSize: '28px'
  })
});

const md = definePartsStyle({
  control: defineStyle({
    boxSize: '32px'
  })
});

const lg = definePartsStyle({
  control: defineStyle({
    boxSize: '40px'
  })
});

const xl = definePartsStyle({
  control: defineStyle({
    boxSize: '50px'
  })
});

const sizes = {
  xs,
  sm,
  md,
  lg,
  xl
};

const primary = definePartsStyle({
  control: defineStyle({
    _checked: {
      bgColor: 'brandPrimary.primary',
      borderColor: 'brandPrimary.primary',
      _hover: {
        bgColor: 'brandPrimary.primary',
        borderColor: 'brandPrimary.primary'
      }
    }
  })
});

const secondary = definePartsStyle({
  control: defineStyle({
    _checked: {
      color: 'surface.onSurfaceVariant',
      bgColor: 'surface.containerHigh',
      _hover: {
        bgColor: 'surface.containerHigh'
      }
    }
  })
});

const variants = {
  primary,
  secondary
};

const baseStyle = definePartsStyle({
  control: defineStyle({
    bgColor: 'surface.containerHigh',
    borderColor: 'surface.outlineVariant',
    _checked: {
      borderColor: 'surface.outlineVariant',
      _hover: {
        borderColor: 'surface.outlineVariant'
      }
    }
  })
});

const defaultProps = {
  size: 'xs',
  variant: 'primary'
};

export const radioTheme = defineMultiStyleConfig({ sizes, variants, defaultProps, baseStyle });
