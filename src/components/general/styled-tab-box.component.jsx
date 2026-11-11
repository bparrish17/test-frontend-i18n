import { Box } from '@chakra-ui/react';
import { forwardRef } from 'react';

const StyledTabBox = forwardRef(
  ({ tabProps, bgColor, color, children, onClick, ...props }, ref) => (
    <Box
      ref={ref}
      borderRadius='lg'
      fontSize='xs'
      fontWeight={500}
      m='0 10px 10px 0'
      p='5px 10px 22px'
      bgColor={bgColor}
      color={color}
      cursor='pointer'
      h={6}
      display='inline-flex'
      alignContent='center'
      justifyContent='center'
      whiteSpace='nowrap'
      onClick={onClick}
      verticalAlign='top'
      {...tabProps}
      {...props}
    >
      {children}
    </Box>
  )
);

export default StyledTabBox;
