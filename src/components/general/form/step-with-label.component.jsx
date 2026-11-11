import { HStack, Stack, Text } from '@chakra-ui/react';

export default function StepWithLabelComponent({
  label,
  name,
  fieldState,
  labelChildren,
  children,
  stackProps = {}
}) {
  return (
    <Stack {...stackProps}>
      <HStack>
        <Text
          as='label'
          htmlFor={name}
          textStyle='body-700-sm'
          color={fieldState?.invalid ? 'critical.onContainer' : 'surface.onSurface'}
        >
          {label}
        </Text>
        {labelChildren}
      </HStack>
      {children}
      {fieldState?.error && (
        <Text
          color='critical.onContainer'
          variant='label-reg-md'
        >
          {fieldState.error?.message}
        </Text>
      )}
    </Stack>
  );
}
