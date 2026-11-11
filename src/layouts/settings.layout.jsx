import { Flex, Divider, Center, Box, Heading, VStack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useSetDocumentTitle } from '@util/hooks';

/**
 * Layout component for settings pages with consistent styling
 *
 * @typedef {object} SettingsLayoutProps
 * @property {string} [dataCy] - Data attribute for cypress testing
 * @property {string} [pageTitle] - Title to display at the top of the page
 * @property {React.ReactNode} children - Content to render in the settings layout
 * @property {import('@chakra-ui/react').BoxProps} [titleContainerProps] - Props for the title container
 * @property {import('@chakra-ui/react').FlexProps} [props] - Additional Flex props for the container
 * @returns {JSX.Element} Settings layout component
 */
function SettingsLayout({ dataCy, pageTitle, children, titleContainerProps, ...props }) {
  useSetDocumentTitle();
  const { state } = useLocation();
  const containerStyles = {
    py: 12,
    px: 12,
    flexDir: 'column',
    w: 'full',
    h: 'full',
    align: 'center',
    gap: 6,
    ...props
  };

  return (
    <Box data-cy={dataCy}>
      <Flex {...containerStyles}>
        <VStack
          w='full'
          gap={6}
          {...titleContainerProps}
        >
          <Center w='full'>
            <Heading size='md'>{pageTitle ?? state?.title}</Heading>
          </Center>
          <Divider color='surface.outline' />
        </VStack>
        {children}
      </Flex>{' '}
    </Box>
  );
}

export default SettingsLayout;
