import { Badge, Image } from '@chakra-ui/react';
import { ForaLogoBlue } from '@assets/images';

const ForaBadge = () => (
  <Badge
    data-testid='fora-badge'
    w='fit-content'
    bg='brandPrimary.container'
    color='brandPrimary.primary'
    fontSize='xs'
    p={2}
    borderRadius='lg'
  >
    <Image
      src={ForaLogoBlue}
      h={2}
    />
  </Badge>
);

export default ForaBadge;
