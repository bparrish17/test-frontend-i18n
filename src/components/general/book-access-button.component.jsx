import { Button } from '@chakra-ui/react';
import { MARKETING_SITE_BASE_URL } from '@util/constants';

export default function BookAccessButton({ size = 'md', text = 'Book a Consult', ...props }) {
  const sizeMap = {
    h: {
      sm: { base: '36px', xl: '48px' },
      md: { base: '48px', xl: '64px' }
    },
    w: {
      sm: { base: '', xl: '150px' },
      md: { base: '', xl: '201px' }
    },
    fontSize: {
      sm: { base: '', xl: '16px' },
      md: { base: '', xl: '20px' }
    }
  };

  return (
    <Button
      px={4}
      py={2}
      h={sizeMap.h[size]}
      w={sizeMap.w[size]}
      borderRadius='8px'
      onClick={() => {
        window.open(`${MARKETING_SITE_BASE_URL}/book-access`, '_blank');
      }}
      fontWeight={500}
      fontSize={sizeMap.fontSize[size]}
      {...props}
    >
      {text}
    </Button>
  );
}
