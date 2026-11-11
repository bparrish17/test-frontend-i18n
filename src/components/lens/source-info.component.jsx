import { Flex, Text } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { getFormattedDate, getCardSourceLink } from '@util/helpers';

export default function SourceInfo({ fullCard, showDate = true, titleNoOfLines }) {
  const title = fullCard?.headline || fullCard?.source_data?.title;
  const possLink = getCardSourceLink(fullCard);
  const date = fullCard?.source_data?.start_at || fullCard?.created_at;
  const formattedDate = showDate ? getFormattedDate(date) : null;

  return (
    <Flex
      my={2}
      mx={2}
      px={2}
      borderLeft='reskin'
      alignItems='center'
    >
      <Text noOfLines={titleNoOfLines}>
        {formattedDate && (
          <Text
            as='span'
            variant='label-caps-600-sm'
            color='brandPrimary.primary'
            whiteSpace='nowrap'
            mr={1}
          >
            {formattedDate}
          </Text>
        )}
        {possLink ? (
          <Text
            as={ReactRouterLink}
            to={possLink}
            variant='label-lighter-lg'
            display='inline'
          >
            {title}
          </Text>
        ) : (
          <Text
            as='span'
            variant='label-lighter-lg'
          >
            {title}
          </Text>
        )}
      </Text>
    </Flex>
  );
}
