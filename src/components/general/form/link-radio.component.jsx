import { Box, Text, useRadioGroup, useRadio, HStack } from '@chakra-ui/react';

export default function LinkRadio({
  name,
  options,
  containerProps = {},
  radioOptionProps = {},
  ...radioProps
}) {
  const { getRootProps, getRadioProps } = useRadioGroup({ name, ...radioProps });

  return (
    <HStack
      gap={8}
      {...getRootProps()}
      {...containerProps}
    >
      {options.map(({ value, label }) => {
        return (
          <RadioOption
            key={value}
            label={label}
            cssProps={radioOptionProps}
            {...getRadioProps({ value })}
          />
        );
      })}
    </HStack>
  );
}

function RadioOption({ label, cssProps, ...props }) {
  const { getInputProps, getRadioProps } = useRadio(props);

  return (
    <Box
      as='label'
      cursor='pointer'
      color='surface.onSurfaceVariant'
      fontWeight={500}
      letterSpacing='tight'
      _checked={{
        color: 'brandPrimary.onContainer',
        textDecor: 'underline',
        textUnderlineOffset: '4px'
      }}
      {...getRadioProps()}
      {...cssProps}
    >
      <input {...getInputProps()} />
      <Text as='span'>{label}</Text>
    </Box>
  );
}
