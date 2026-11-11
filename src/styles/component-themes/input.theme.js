import { inputAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  inputAnatomy.keys
);

const getFloatingLabelStyle = ({ size }) => {
  const fieldSm = defineStyle({
    pt: 4
  });

  const fieldMd = defineStyle({
    pt: 4
  });

  const fieldLg = defineStyle({
    pt: 4
  });

  const fieldSizes = { sm: fieldSm, md: fieldMd, lg: fieldLg };

  return definePartsStyle({
    label: defineStyle({
      transform: 'translateY(-6px) scale(0.75)',
      transformOrigin: 'top left',
      color: 'surface.onSurfaceVariant',
      px: 2,
      bg: 'surface.containerLowest',
      ml: 2,
      zIndex: 1
    }),
    field: defineStyle({
      rounded: 'lg',
      border: 'reskin',
      bg: 'white',
      _hover: { bg: 'white' },
      _placeholder: { color: 'surface.onSurfaceVariant', opacity: 1 },
      _focusVisible: {
        bgColor: 'surface.containerLowest',
        borderWidth: '1px',
        borderColor: 'surface.outline'
      },
      ...fieldSizes[size]
    })
  });
};

const outlineCustom = {
  field: {
    rounded: 'lg',
    border: 'reskin',
    bg: 'surface.containerLowest',
    _hover: {
      bg: 'surface.containerLowest'
    },
    _placeholder: {
      color: 'surface.outline',
      fontWeight: 450
    },
    _focus: {
      bg: 'surface.containerLowest',
      borderWidth: '1px',
      borderColor: 'surface.outline'
    }
  }
};

const sm = definePartsStyle({
  field: {
    minH: '40px',
    px: 3,
    _placeholder: {
      fontSize: '14px'
    }
  }
});

const md = definePartsStyle({
  field: {
    minH: '50px',
    px: 4,
    _placeholder: {
      fontSize: '16px'
    }
  }
});

const lg = definePartsStyle({
  field: {
    minH: '60px',

    px: 6,
    _placeholder: {
      fontSize: '18px'
    }
  }
});

const sizes = {
  sm,
  md,
  lg
};

const variants = {
  floatingLabel: getFloatingLabelStyle,
  outlineCustom
};

const defaultProps = {
  size: 'sm',
  variant: 'outlineCustom'
};

export const inputTheme = defineMultiStyleConfig({ variants, sizes, defaultProps });
