import { Icon, Stack, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

import { getLensIconComponent } from '@util/helpers';

export default function LensTemplateCard({ lens }) {
  // In newer versions of React Router (v6+), the state property is no longer passed through the to prop of the Link component in the way we're trying to use it.
  const navigate = useNavigate();
  const handleClick = (e) => {
    e.preventDefault();
    navigate('/lenses/create', { state: { template: lens } });
  };

  return (
    <Stack
      onClick={handleClick}
      layerStyle='section-card'
      gap={4}
      p={5}
      _hover={{ borderColor: 'brandPrimary.primary' }}
      cursor='pointer'
    >
      <LensTemplateCardHeader lens={lens} />
      <Text
        color='surface.onSurfaceVariant'
        fontSize='sm'
        lineHeight='21px'
        noOfLines={5}
        textOverflow='ellipsis'
      >
        {lens?.description}
      </Text>
    </Stack>
  );
}

function LensTemplateCardHeader({ lens }) {
  return (
    <Stack gap={2}>
      <Icon
        as={getLensIconComponent(lens)}
        color='brandPrimary.primary'
        boxSize={6}
        my={1.5}
      />
      <Text
        color='brandPrimary.primary'
        fontWeight={600}
        fontSize='lg'
      >
        {lens?.lens_title ?? 'Untitled Lens'}
      </Text>
    </Stack>
  );
}
