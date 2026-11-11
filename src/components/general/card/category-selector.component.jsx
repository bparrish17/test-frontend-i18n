import { Text, MenuGroup, Flex, Box } from '@chakra-ui/react';

export default function CategorySelector({ initiativeTitle, disclosure, titleProps = {} }) {
  return (
    <MenuGroup
      title={
        <Flex
          as='span'
          justifyContent='space-between'
          mb={2.5}
          {...titleProps}
        >
          <Text
            as='span'
            fontSize='xs'
            color='surface.onSurfaceVariant'
            textTransform='uppercase'
            letterSpacing='widest'
            fontWeight={600}
          >
            Category
          </Text>
          <Text
            data-testid='category-selector'
            as='span'
            fontSize='xs'
            color='brandPrimary.primary'
            cursor='pointer'
            textTransform='none'
            letterSpacing='normal'
            _hover={{ textDecoration: 'underline' }}
            onClick={disclosure.onOpen}
          >
            Change
          </Text>
        </Flex>
      }
    >
      <Box
        px={2}
        py={1}
        borderRadius='xl'
        bgColor='surface.surface'
        color='surface.onSurfaceVariant'
      >
        <Text
          fontSize='xs'
          textAlign='center'
          layerStyle='ellipsis-text'
          fontWeight={500}
        >
          {initiativeTitle || 'No Category'}
        </Text>
      </Box>
    </MenuGroup>
  );
}
