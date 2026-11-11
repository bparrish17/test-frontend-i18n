import { tableAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  tableAnatomy.keys
);

const rounded = definePartsStyle(() => {
  return {
    tr: {
      borderTopLeftRadius: 'lg',
      'th:first-child': {
        borderTopLeftRadius: 'lg'
      },
      'th:last-child': {
        borderTopRightRadius: 'lg'
      },
      'td:first-child': {
        borderBottomLeftRadius: 'lg'
      },
      'td:last-child': {
        borderBottomRightRadius: 'lg'
      }
    },
    thead: {
      th: {
        px: 3,
        '&:first-of-type': {
          pl: 6
        },
        '&:last-of-type': {
          pr: 6
        }
      },
      tr: {
        bg: 'surface.containerLow',
        borderBottom: 'reskin',
        th: {
          textTransform: 'none',
          letterSpacing: 'tight',
          textStyle: 'unset',
          '.header-text': {
            textTransform: 'uppercase',
            textStyle: 'label-caps-600-md',
            color: 'surface.onSurfaceVariant'
          }
        }
      }
    },
    tbody: {
      tr: {
        bg: 'surface.containerLowest',
        borderTop: 'reskin',
        '&:first-of-type': {
          borderTop: 'none'
        },
        '&.row-expanded': {
          borderTop: 'none',
          td: {
            py: 0
          }
        }
      },
      td: {
        py: 3,
        px: 3,
        '&:first-of-type': {
          pl: 6
        },
        '&:last-of-type': {
          pr: 6
        }
      }
    },
    tfoot: {
      tr: {
        '&:last-of-type': {
          th: { borderBottomWidth: 0 }
        }
      }
    }
  };
});

export const tableTheme = defineMultiStyleConfig({
  variants: { rounded }
});
