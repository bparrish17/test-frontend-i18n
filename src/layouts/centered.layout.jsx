import { Flex } from '@chakra-ui/react';
import { useSetDocumentTitle } from '@util/hooks';

/**
 * Layout component that centers content horizontally with a maximum width
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render
 * @returns {JSX.Element} Centered layout component
 */
export default function CenteredLayout({ children, ...props }) {
  useSetDocumentTitle();
  return (
    <Flex
      w='full'
      flexDir='column'
      maxW={{ lg: 'centered-page' }}
      mx='auto'
      {...props}
    >
      {children}
    </Flex>
  );
}
