import { defineStyleConfig } from '@chakra-ui/react';

export const progressTheme = defineStyleConfig({
  variants: {
    onPrimary: {
      filledTrack: {
        bgColor: 'brandPrimary.onPrimary'
      },
      track: {
        bgColor: 'brandPrimary.primaryDim'
      }
    },
    onSecondary: {
      filledTrack: {
        bgColor: 'brandPrimary.onSecondary'
      },
      track: {
        bgColor: 'brandPrimary.secondaryDim'
      }
    },
    onSurface: {
      filledTrack: {
        bgColor: 'surface.outline'
      },
      track: {
        bgColor: 'surface.outlineVariant'
      }
    },
    onSurfaceVariant: {
      filledTrack: {
        bgColor: 'brandPrimary.primary'
      },
      track: {
        bgColor: 'brandPrimary.container'
      }
    }
  }
});
