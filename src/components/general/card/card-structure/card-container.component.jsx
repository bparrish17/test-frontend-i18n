import { Card as ChakraCard } from '@chakra-ui/react';
import { noop } from 'lodash-es';

/**
 * @param {React.ReactNode} children
 * @param {function} setIsHovered
 * @param {import("@chakra-ui/react").CardProps} [props]
 * @returns {JSX.Element}
 */
export function Card({ children, setIsHovered = noop, ...props }) {
  return (
    <ChakraCard
      layerStyle='card'
      flexDir='column'
      shadow='none'
      _hover={{ shadow: 'xl' }}
      transition='box-shadow 0.2s ease-in-out'
      {...props}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </ChakraCard>
  );
}
