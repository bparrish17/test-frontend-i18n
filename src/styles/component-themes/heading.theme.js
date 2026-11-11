import { defineStyleConfig } from '@chakra-ui/react';

export const headingTheme = defineStyleConfig({
  // Base style applied to all headings
  baseStyle: {
    fontWeight: 600,
    fontFamily:
      'Suisse Intl, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Open Sans, Helvetica Neue, sans-serif'
  },

  // Size variants from smallest to largest
  sizes: {
    // Extra Small (h6)
    xs: {
      fontSize: 'md' // 14px
    },
    // Small (h5)
    sm: {
      fontSize: 'lg', // 18px
      lineHeight: 1.35
    },
    // Medium (h4)
    md: {
      lineHeight: 1.25 // 20px
    },
    // Large (h3)
    lg: {
      fontSize: '2xl', // 24px
      lineHeight: 1.2
    },
    // Extra Large (h2)
    xl: {
      fontSize: '2.5xl', // 28px
      lineHeight: 1.25
    },
    // 2X Large
    '2xl': {
      fontSize: '32px',
      lineHeight: 1.2
    },
    // 3X Large (h2)
    '3xl': {
      fontSize: '44px',
      lineHeight: 1.1 // 48px
    }
    // Note: 4xl (h1 / 72px) is available in the system but not defined here
  },

  // Style variants
  variants: {
    // Display variants
    'display-sm': () => ({
      fontFamily: '"Suisse Intl"',
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '35.2px',
      letterSpacing: '-0.8px'
    }),
    'display-md': () => ({
      fontFamily: '"Suisse Intl"',
      fontSize: '48px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '110%',
      letterSpacing: '-1.2px'
    }),

    // Weight variants
    'bolder-md': () => ({
      fontFamily: '"Suisse Intl"',
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: 700,
      lineHeight: '32px',
      letterSpacing: '0px'
    }),
    'lighter-md': () => ({
      fontFamily: '"Suisse Intl"',
      fontSize: '20px',
      fontStyle: 'normal',
      fontWeight: 500,
      lineHeight: '32px',
      letterSpacing: '0px'
    }),

    // Special purpose variants
    ppTitle: () => ({
      textOverflow: 'ellipsis',
      fontFamily: 'Suisse Intl',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 600,
      lineHeight: '24px',
      letterSpacing: '0.32px'
    })
  }
});
