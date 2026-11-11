import { Center, HStack, Text, useRadio, useRadioGroup } from '@chakra-ui/react';

export const MEETING_TYPE_OPTIONS = [
  {
    value: 'either',
    label: 'Both'
  },
  {
    value: 'internal',
    label: 'Internal'
  },
  {
    value: 'external',
    label: 'External'
  }
];

export default function MeetingTypeRadioGroup({ ...radioProps }) {
  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'meeting-type',
    ...radioProps
  });

  return (
    <HStack
      p={1}
      {...getRootProps()}
      bgColor='brandPrimary.containerLow'
      borderRadius='xl'
    >
      {MEETING_TYPE_OPTIONS.map((option) => (
        <RadioOption
          key={option.value}
          {...option}
          {...getRadioProps({ value: option.value })}
        />
      ))}
    </HStack>
  );
}

const RadioOption = ({ label, ...props }) => {
  const { getInputProps, getRadioProps } = useRadio(props);

  return (
    <Center
      as='label'
      h={10}
      flex={1}
      borderRadius='xl'
      color='brandPrimary.onContainer'
      _checked={{
        bgColor: 'brandPrimary.onContainer',
        color: 'brandPrimary.onPrimary'
      }}
      cursor='pointer'
      gap={1.5}
      {...getRadioProps()}
    >
      <input {...getInputProps()} />
      <Text
        fontSize='sm'
        fontWeight={500}
      >
        {label}
      </Text>
    </Center>
  );
};
