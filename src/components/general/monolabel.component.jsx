import { Text } from '@chakra-ui/react';

export default function MonoLabel({ children, ...props }) {
  return (
    <Text
      fontSize='xs'
      fontWeight={600}
      textTransform='uppercase'
      fontFamily='mono'
      letterSpacing='widest'
      {...props}
    >
      {children}
    </Text>
  );
}
