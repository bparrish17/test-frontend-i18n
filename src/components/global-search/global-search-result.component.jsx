import { Box, Text, Stack } from '@chakra-ui/react';

const textResultStyles = { as: 'span', fontSize: 'sm' };

export default function ResultWithContext({ title, context, children }) {
  return (
    <Stack
      direction={{ base: 'column', lg: 'row' }}
      gap={{ base: 0, lg: 3 }}
      align={{ base: 0, lg: 'center' }}
      maxW='full'
    >
      {children}
      <Box
        flex={3}
        maxW='max-content'
        fontWeight={400}
        lineHeight={{ base: 1.5, lg: 'normal' }}
        py={{ base: 1, lg: 0 }}
        mt={{ base: 1, lg: 0 }}
        layerStyle='ellipsis-text'
      >
        <Text {...textResultStyles}>
          {title?.map((titleSubstr, i) => (
            <Text
              as='span'
              key={`${titleSubstr.value}-${i}`}
              fontWeight={titleSubstr.isHighlighted ? 700 : 'initial'}
            >
              {titleSubstr.value}
            </Text>
          ))}
        </Text>
      </Box>
      {context && (
        <Box
          flex={2}
          maxW='max-content'
          layerStyle='ellipsis-text'
        >
          <Text
            as='span'
            fontSize='xs'
            fontStyle='italic'
            color='light_material.800'
            lineHeight={{ base: 2, lg: 'normal' }}
            fontWeight={400}
            mr={0.5}
          >
            {context.map((contextSubstr, i) => (
              <Text
                as='span'
                key={`${contextSubstr.value}-${i}`}
                fontWeight={contextSubstr.isHighlighted ? 700 : 'initial'}
              >
                {contextSubstr.value}
              </Text>
            ))}
          </Text>
        </Box>
      )}
    </Stack>
  );
}
