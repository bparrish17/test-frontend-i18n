import { Image, Spinner, VStack } from '@chakra-ui/react';
import { ForaLogo } from '@assets/images';
import { useTranslation } from 'react-i18next';

export default function FullPageLoader({ children }) {
  const { t } = useTranslation();

  return (
    <VStack
      h='100vh'
      justify='center'
      gap={4}
      pb={32}
    >
      <Image
        src={ForaLogo}
        alt={t('fullPageLoader.logoAlt')}
        maxBlockSize={6}
      />
      <Spinner
        size='lg'
        thickness='3px'
        speed='0.75s'
        mt={4}
        mb={6}
      />
      {children}
    </VStack>
  );
}
