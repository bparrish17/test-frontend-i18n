import { Text, HStack, Avatar, Spacer } from '@chakra-ui/react';

import { useApolloPerson } from '@services/query-services/apollo.query-service';
import { usePeople } from '@services/query-services/people.query-service';
import { sanitizeView } from '@util/helpers/privacy.helpers';

export default function ViewsShareCard({ view }) {
  const viewerEmail = view?.id;
  const { data: apolloPerson } = useApolloPerson(viewerEmail, {
    enabled: !!viewerEmail,
    retry: false
  });

  const { data: foraPeople } = usePeople(
    { email_x: viewerEmail },
    {
      enabled: !!viewerEmail,
      retry: false
    }
  );

  const cleanedView = sanitizeView(view, foraPeople?.[0], apolloPerson);

  return (
    <HStack>
      <HStack layerStyle='ellipsis-text'>
        <Avatar
          src={cleanedView?.avatar_url}
          size='sm'
          avatarvariant='grayscale'
        />
        <Text
          color='surface.onSurface'
          fontWeight={500}
          letterSpacing='tight'
          fontSize='sm'
          lineHeight='16px'
          layerStyle='ellipsis-text'
          maxW={{ base: '130px', md: '135px' }}
        >
          {cleanedView?.name}
        </Text>
      </HStack>
      <Spacer />
      <Text
        color='surface.onSurfaceVariant'
        fontWeight={400}
        letterSpacing='tight'
        fontSize='sm'
        lineHeight='16px'
      >
        {cleanedView?.date}
      </Text>
    </HStack>
  );
}
