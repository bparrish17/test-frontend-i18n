import { HStack, Text } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

export default function TermsAndConditions() {
  return (
    <HStack pb={4}>
      <Text
        fontSize='sm'
        color='surface.onSurfaceVariant'
        fontWeight={400}
        as={ReactRouterLink}
        to='https://fora.day/terms'
        target='_blank'
      >
        Terms & Conditions
      </Text>
      <Text
        fontWeight={400}
        color='surface.onSurfaceVariant'
      >
        •
      </Text>
      <Text
        fontSize='sm'
        color='surface.onSurfaceVariant'
        fontWeight={400}
        as={ReactRouterLink}
        to='https://fora.day/privacy'
        target='_blank'
      >
        Privacy Policy
      </Text>
    </HStack>
  );
}
