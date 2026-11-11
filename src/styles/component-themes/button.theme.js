import { defineStyle, defineStyleConfig } from '@chakra-ui/react';

const reskinOutline = defineStyle(({ colorScheme }) => ({
  bgColor: 'inherit',
  color: colorScheme === 'surface' ? `${colorScheme}.onSurfaceVariant` : `${colorScheme}.primary`,
  border: 'solid 1px',
  borderColor:
    colorScheme === 'surface' ? `${colorScheme}.outlineVariant` : `${colorScheme}.primary`,
  _hover: {
    bgColor: 'surface.surface',
    textDecor: 'none'
  }
}));

const reskinGhost = defineStyle(({ colorScheme }) => {
  const color = colorScheme === 'surface' ? 'surface.onSurfaceVariant' : `${colorScheme}.primary`;
  const hoverBg = `${colorScheme}.container`;
  return {
    color,
    border: 'none',
    bgColor: 'transparent',
    _hover: {
      bgColor: hoverBg,
      textDecor: 'none'
    },
    _active: {
      bgColor: hoverBg
    }
  };
});

export const buttonTheme = defineStyleConfig({
  sizes: {
    // Reskin Theming: https://www.figma.com/design/ivKzvIcNj3u98amA95iA2s/FORA-Design-System?node-id=26-49152&t=QjBC5slRWjV8ialW-0
    reskin2xs: {
      px: 1.5,
      h: 5,
      fontSize: '2xs'
    },
    reskinXs: {
      px: '9px',
      h: 6,
      fontSize: '11px'
    },
    reskinSm: {
      px: 3,
      h: 7,
      fontSize: 'xs'
    },
    reskinMd: {
      px: '14px',
      h: 8,
      fontSize: 'xs'
    },
    reskinLg: {
      px: 5,
      h: 10,
      fontSize: 'sm'
    },
    reskinXl: {
      px: 6,
      h: 12,
      fontSize: 'md'
    },
    reskin2Xl: {
      px: 7,
      h: 16,
      fontSize: 'xl'
    },
    // deprecated? Still in use in 2 places
    full: {
      w: 'full',
      p: 4
    }
  },
  variants: {
    outline: reskinOutline,
    // Reskin Theming: https://www.figma.com/design/ivKzvIcNj3u98amA95iA2s/FORA-Design-System?node-id=26-49152&t=QjBC5slRWjV8ialW-0
    reskinPrimary: ({ colorScheme }) => ({
      bgColor: `${colorScheme}.primary`,
      color: `${colorScheme}.onPrimary`,
      border: 'none',
      _hover: {
        bgColor: `${colorScheme}.primaryDim`,
        textDecor: 'none',
        _disabled: {
          background: `${colorScheme}.primary` // make sure doesn't go white
        }
      }
    }),
    reskinSecondary: ({ colorScheme }) => ({
      bgColor: `${colorScheme}.container`,
      color: `${colorScheme}.onContainer`,
      border: 'none',
      _hover: {
        bgColor: `${colorScheme}.containerHigh`,
        textDecor: 'none',
        _disabled: {
          background: `${colorScheme}.container` // make sure doesn't go white
        }
      }
    }),
    reskinWhite: () => ({
      bgColor: 'surface.containerLowest',
      color: 'surface.onSurfaceVariant',
      border: 'reskin',
      iconSpacing: 2,
      _hover: {
        bgColor: 'surface.surface',
        textDecor: 'none'
      }
    }),
    reskinOutline,
    reskinGhost,
    reskinLink: {
      ...reskinOutline({ colorScheme: 'surface' }),
      size: { base: 'reskinMd', md: 'reskinLg' },
      colorScheme: 'surface',
      px: 4,
      fontWeight: 500
      // https://github.com/chakra-ui/chakra-ui/issues/7189
      // as: 'a',
      // target: '_blank'
    }
  },
  defaultProps: {
    colorScheme: 'brandPrimary',
    variant: 'reskinPrimary'
  }
});

/*
reskinLink: (props) => ({
  fontWeight: 500,
  color: 'surface.onSurfaceVariant',
  letterSpacing: 'tight',
  _hover: {
    bgColor: `${colorScheme}.primaryDim`
  }
}),
*/
