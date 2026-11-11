import {
  Box,
  StackDivider,
  Text,
  useRadioGroup,
  useRadio,
  HStack,
  Icon,
  Stack
} from '@chakra-ui/react';
import { useController } from 'react-hook-form';
import { CheckIcon } from '@assets/icons';

export default function StackRadio({ name, control, options, ...containerProps }) {
  const { field } = useController({ name, control });
  const { getRootProps, getRadioProps } = useRadioGroup({ ...field });

  return (
    <Stack
      border='reskin'
      borderRadius='lg'
      bgColor='surface.container'
      divider={<StackDivider style={{ margin: 0 }} />}
      {...getRootProps()}
      {...containerProps}
    >
      {options.map(({ value, label }) => {
        return (
          <RadioOption
            key={value}
            label={label}
            {...getRadioProps({ value })}
          />
        );
      })}
    </Stack>
  );
}

function RadioOption({ label, ...props }) {
  const { state, getInputProps, getRadioProps } = useRadio(props);

  return (
    <Box
      as='label'
      w='full'
    >
      <HStack
        gap={3}
        w='full'
        px={4}
        py={2}
        fontSize='sm'
        cursor='pointer'
        {...getRadioProps()}
        _checked={{
          fontWeight: 600,
          color: 'brandPrimary.primary'
        }}
      >
        {state.isChecked ? (
          <Icon
            as={CheckIcon}
            boxSize={4}
          />
        ) : (
          <Box
            w={4}
            h={4}
          />
        )}
        <input {...getInputProps()} />
        <Text pt='1px'>{label}</Text>
      </HStack>
    </Box>
  );
}
