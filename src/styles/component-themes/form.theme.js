import { formAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers, defineStyle } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  formAnatomy.keys
);

function getActiveLabelStyles({ scale = 0.7, translateY = -1, translateX = 0 }) {
  const activeLabelStyles = defineStyle({
    transformOrigin: 'top left',
    transform: `scale(${scale}) translateY(${translateY}px) translateX(${translateX}px)`,
    opacity: 1
  });

  return {
    _focusWithin: { label: activeLabelStyles },
    'input:not(:placeholder-shown) + label, .chakra-select__wrapper + label, textarea:not(:placeholder-shown) ~ label':
      {
        ...activeLabelStyles
      }
  };
}

const floatingLabel = definePartsStyle({
  container: defineStyle({
    position: 'relative',
    label: defineStyle({
      position: 'absolute',
      opacity: 0.5,
      color: 'surface.onSurfaceVariant',
      fontSize: '16px',
      fontWeight: 'medium',
      transform: 'translateY(50%)'
    }),
    field: defineStyle({
      border: 'reskin'
    })
  })
});

const variants = {
  floatingLabel
};

const sm = definePartsStyle({
  container: defineStyle({
    label: defineStyle({
      top: -1,
      left: 3
    }),
    ...getActiveLabelStyles({ translateY: 10 })
  })
});

const md = definePartsStyle({
  container: defineStyle({
    label: defineStyle({
      fontSize: 'md',
      top: 0,
      left: 4
    }),
    ...getActiveLabelStyles({ translateY: 8 })
  })
});

const lg = definePartsStyle({
  container: defineStyle({
    label: defineStyle({
      fontSize: 'lg',
      top: 1,
      left: 6
    }),
    ...getActiveLabelStyles({ translateY: 6 })
  })
});

const sizes = {
  sm,
  md,
  lg
};

const defaultProps = {
  variant: 'floatingLabel'
};

export const formTheme = defineMultiStyleConfig({ variants, defaultProps, sizes });
