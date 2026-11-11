import { Stack, HStack, Text, Heading, Flex, Tag } from '@chakra-ui/react';

export default function CreateLensStepWrapper({
  title,
  description,
  children,
  section,
  isOptional = false,
  ...props
}) {
  const { ref } = section;
  return (
    <Stack
      layerStyle='section-card'
      px={{ base: 4, lg: 11 }}
      py={{ base: 8, lg: 11 }}
      gap={3}
      ref={ref}
      {...props}
    >
      <HStack justify='space-between'>
        <Heading
          as='h2'
          fontSize='2xl'
          lineHeight={6}
        >
          {title}
        </Heading>
        {isOptional && <Tag variant='label'>Optional</Tag>}
      </HStack>
      <Text fontSize={18}>{description}</Text>
      <Flex>{children}</Flex>
    </Stack>
  );
}
