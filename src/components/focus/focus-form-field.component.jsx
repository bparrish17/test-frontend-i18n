import { Stack, Text } from '@chakra-ui/react';

// reskin todo: remove this
export default function FocusFormField({ label, children }) {
  return (
    <Stack gap={4}>
      <Text fontWeight={600}>{label}</Text>
      {children}
    </Stack>
  );
}
