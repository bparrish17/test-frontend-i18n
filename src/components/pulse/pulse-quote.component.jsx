import { Flex, Box, Text } from '@chakra-ui/react';

function PulseQuote({
  lineColor,
  textColor = '#FEFFFF',
  text,
  align = 'left',
  noOfLines = [2, 3, 4]
}) {
  return (
    <Flex
      gap='16px'
      zIndex={2}
      flexDirection={align === 'left' ? 'row' : 'row-reverse'}
    >
      <Box
        bg={lineColor}
        h='auto'
        w='3px'
      />
      <Text
        align={align}
        noOfLines={noOfLines}
        zIndex={2}
        color={textColor}
        variant='body-reg'
      >
        {text}
      </Text>
    </Flex>
  );
}

export default PulseQuote;
