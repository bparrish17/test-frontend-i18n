export const textTheme = {
  baseStyle: {
    fontFamily: 'Suisse Intl'
  },
  variants: {
    // Special variants
    aeonik: {
      fontFamily: 'Aeonik Fono'
    },
    'brand-label': {
      textTransform: 'uppercase',
      color: 'brandPrimary.primary',
      letterSpacing: 'wider',
      fontFamily: 'Aeonik Fono',
      fontWeight: 500
    },
    'content-section-header': {
      fontSize: 'sm',
      color: 'surface.onSurfaceVariant',
      textTransform: 'uppercase',
      letterSpacing: '2.5px',
      fontWeight: 500
    },
    'page-header': {
      as: 'h1',
      color: 'surface.onSurface',
      fontWeight: 600,
      letterSpacing: 'tight',
      lineHeight: 'normal'
    },

    // Display variants
    'display-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '35.2px',
      letterSpacing: '-0.8px'
    },

    // Headline variants
    'headline-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '20px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '125%'
    },
    'headline-lighter-lg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '28px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '36px',
      letterSpacing: '0px'
    },
    'headline-lighter-md': {
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '32px',
      letterSpacing: '0px'
    },
    'headline-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '125%'
    },

    // Title variants
    'title-bolder-sm': {
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '21.6px',
      letterSpacing: '0px'
    },
    'title-lighter-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '135%',
      letterSpacing: '0px'
    },
    'title-lighter-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '135%',
      letterSpacing: '0px'
    },
    'title-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '135%'
    },
    'title-600-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '135%'
    },
    'title-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '135%'
    },

    // Body variants
    'body-500-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '150%',
      letterSpacing: '0.28px'
    },
    'body-600-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '150%',
      letterSpacing: '0.28px'
    },
    'body-700-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '150%',
      letterSpacing: '0.28px'
    },
    'body-500-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '150%',
      letterSpacing: '0.32px'
    },
    'body-600-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '150%',
      letterSpacing: '0.32px'
    },
    'body-700-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '0.32px'
    },
    'body-600-lg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '0.32px'
    },
    'body-reg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '28px',
      letterSpacing: '0.36px'
    },
    'body-reg-lg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '175%',
      letterSpacing: '0.36px',
      fontFeatureSettings: "'calt' off"
    },
    'body-500-lg': {
      color: 'surface.onSurfaceVariant',
      fontFamily: '"Suisse Intl"',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '175%',
      letterSpacing: '0.36px',
      fontFeatureSettings: "'calt' off"
    },
    'body-reg-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '20px',
      letterSpacing: '0.28px'
    },
    'body-reg-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '24px',
      letterSpacing: '0.32px'
    },
    'body-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '0.28px'
    },
    'body-lighter-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '150%',
      letterSpacing: '0.32px'
    },
    'body-lighter-lg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '18px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '155%',
      letterSpacing: '0px'
    },
    'body-caps-lighter-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '20px',
      letterSpacing: '2.8px',
      textTransform: 'uppercase'
    },

    // Label variants
    'label-500-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '11px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '150%',
      letterSpacing: '0.22px'
    },
    'label-500-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '150%',
      letterSpacing: '0.24px'
    },
    'label-600-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '11px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '0.22px'
    },
    'label-600-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '0.24px'
    },
    'label-600-lg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '13px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '150%',
      letterSpacing: '2%'
    },
    'label-lighter-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '10px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '14px',
      letterSpacing: '0.36px'
    },
    'label-lighter-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '11px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '16px',
      letterSpacing: '0.42px'
    },
    'label-lighter-lg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '18px',
      letterSpacing: '0.48px'
    },
    'label-caps-600-lg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '13px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '2.6px',
      textTransform: 'uppercase'
    },
    'label-caps-600-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '2.1px',
      textTransform: 'uppercase'
    },
    'label-caps-600-sm': {
      fontFamily: '"Suisse Intl"',
      fontSize: '11px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '150%',
      letterSpacing: '2.2px',
      textTransform: 'uppercase'
    },
    'label-lg': {
      textOverflow: 'ellipsis',
      fontFamily: '"Suisse Intl"',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '18px',
      letterSpacing: '0.48px'
    },
    'label-md': {
      fontFamily: '"Suisse Intl"',
      textOverflow: 'ellipsis',
      fontSize: '11px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '16px',
      letterSpacing: '0.42px'
    },
    'label-reg-md': {
      fontFamily: '"Suisse Intl"',
      fontSize: '11px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '18px',
      letterSpacing: '0.48px'
    },
    'label-reg-lg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '18px',
      letterSpacing: '0.48px'
    },
    'label-500-lg': {
      fontFamily: '"Suisse Intl"',
      fontSize: '13px',
      fontStyle: 'normal',
      fontWeight: 400,
      lineHeight: '150%',
      letterSpacing: '0.26px'
    }
  }
};
