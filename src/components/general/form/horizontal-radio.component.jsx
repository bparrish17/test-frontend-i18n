import {
  HStack,
  useRadioGroup,
  useRadio,
  Box,
  StackDivider,
  Center,
  Text,
  VStack
} from '@chakra-ui/react';

export default function HorizontalRadio({ options, ...radioGroupProps }) {
  const { getRootProps, getRadioProps } = useRadioGroup(radioGroupProps);

  return (
    <HStack
      gap={0}
      divider={<StackDivider style={{ margin: 0 }} />}
      border='reskin'
      borderRadius='xl'
      bg='container.surfaceContainerLowest'
      w='fit-content'
      {...getRootProps()}
    >
      {options.map(({ value, label, description }) => (
        <RadioCard
          key={value}
          {...getRadioProps({ value })}
        >
          <VStack gap={0}>
            <Text variant='body-500-md'>{label}</Text>
            <Text variant='label-500-sm'>{description}</Text>
          </VStack>
        </RadioCard>
      ))}
    </HStack>
  );
}

function RadioCard(props) {
  const { getInputProps, getRadioProps } = useRadio(props);

  return (
    <Box
      as='label'
      sx={{
        '&:first-of-type > div': { borderTopLeftRadius: 'xl', borderBottomLeftRadius: 'xl' },
        '&:last-of-type > div': { borderTopRightRadius: 'xl', borderBottomRightRadius: 'xl' }
      }}
    >
      <input {...getInputProps()} />
      <Center
        {...getRadioProps()}
        cursor='pointer'
        color='surface.onSurfaceVariant'
        _checked={{
          bg: 'brandPrimary.primary',
          color: 'brandPrimary.onPrimary'
        }}
        w={40}
        h={16}
      >
        {props.children}
      </Center>
    </Box>
  );
}
