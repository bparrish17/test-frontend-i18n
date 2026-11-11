import { Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { getUploadName, getUploadLink } from '@util/helpers';

export default function UploadName({ upload, cards, type }) {
  const link = getUploadLink(upload, cards, type);

  return (
    <Text
      fontSize='sm'
      fontWeight={500}
      textAlign='left'
      whiteSpace='nowrap'
      isTruncated
      maxW={{ base: '70px', sm: '150px', md: '500px' }}
      as={Link}
      to={link}
      _hover={{
        color: 'brandPrimary.primary'
      }}
    >
      {getUploadName(upload)}
    </Text>
  );
}
