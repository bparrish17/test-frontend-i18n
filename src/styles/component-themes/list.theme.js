import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system';
import { listAnatomy as parts } from '@chakra-ui/anatomy';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys);

const variants = {
  numbered: definePartsStyle(() => ({
    container: {
      listStyleType: 'none',
      counterReset: 'list-counter'
    },
    item: {
      position: 'relative',
      counterIncrement: 'list-counter',
      paddingLeft: '52px', // 40px + 12px space
      marginBottom: '24px',
      '&::before': {
        content: 'counter(list-counter)',
        position: 'absolute',
        left: '0',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        backgroundColor: '#1353EC',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '16px',
        fontWeight: 'bold'
      }
    }
  }))
};

export const listTheme = defineMultiStyleConfig({ variants });
