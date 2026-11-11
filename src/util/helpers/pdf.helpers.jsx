import { get } from 'lodash-es';
import { semanticTokens } from '@styles/semantic-tokens.theme';
import { colors } from '@styles/colors.theme';
import { Font, StyleSheet } from '@react-pdf/renderer';

/* eslint-disable import/no-absolute-path */
import Inter from '/assets/fonts/Inter/Inter_18pt-Regular.ttf';
import InterMedium from '/assets/fonts/Inter/Inter_18pt-Medium.ttf';
import InterSemiBold from '/assets/fonts/Inter/Inter_18pt-SemiBold.ttf';
import InterBold from '/assets/fonts/Inter/Inter_18pt-Bold.ttf';
/* eslint-enable import/no-absolute-path */

export const getTokenHex = (themeToken) => {
  const colorToken = get(colorTokens, themeToken);
  return get(colors, colorToken?.split('.'));
};

const colorTokens = semanticTokens.colors;

export const registerFonts = () => {
  Font.register({
    family: 'Inter',
    fonts: [
      {
        src: Inter
      },
      {
        src: InterMedium,
        fontWeight: 500
      },
      {
        src: InterSemiBold,
        fontWeight: 600
      },
      {
        src: InterBold,
        fontWeight: 700
      }
    ]
  });
};

export const createStylesheet = () =>
  StyleSheet.create({
    page: {
      fontFamily: 'Inter',
      paddingTop: 80,
      paddingBottom: 112 // 80 + 32px offset from footer
    },
    contentContainer: {
      paddingHorizontal: 80,
      paddingTop: 32,
      display: 'flex',
      flexDirection: 'column',
      gap: '40px'
    }
  });
