import { Link as ChakraLink } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

/**
 * @typedef {object} StyledLinkProps
 * @property {React.ReactNode} children
 * @property {import("@chakra-ui/react").LinkProps | import("react-router-dom").LinkProps} linkProps
 *
 * @param {StyledLinkProps} props
 * @returns {JSX.Element}
 */
export default function StyledLink({ children, ...linkProps }) {
  return (
    <ChakraLink
      as={ReactRouterLink}
      color='brandPrimary.primary'
      fontWeight={500}
      textDecor='none'
      {...linkProps}
    >
      {children}
    </ChakraLink>
  );
}
