import React from 'react';
import { Box, Container, Divider, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * Internal testing table of contents
 * This page is only accessible to Fora employees and lists all internal testing pages
 *
 * @returns {JSX.Element} Fora testing page
 */
export default function ForaTestingPage() {
  const { t } = useTranslation();

  return (
    <Container
      maxW='container.lg'
      py={8}
    >
      <VStack
        spacing={8}
        align='stretch'
      >
        <Box>
          <Heading
            size='xl'
            mb={4}
          >
            {t('foraTestingPage.foraInternalTestingPages')}
          </Heading>
          <Text
            fontSize='lg'
            color='surface.onSurfaceVariant'
          >
            {t('foraTestingPage.thisPageProvidesAccess')}
          </Text>
        </Box>

        <Divider />

        <SimpleGrid
          columns={{ base: 1, md: 2 }}
          spacing={8}
        >
          <Box
            p={5}
            borderWidth='1px'
            borderRadius='lg'
            shadow='sm'
            transition='all 0.2s'
            _hover={{ shadow: 'md' }}
          >
            <Heading
              as='h2'
              size='md'
              mb={2}
              color='brand.primary'
            >
              <RouterLink to='/component-testing'>
                {t('foraTestingPage.componentTesting')}
              </RouterLink>
            </Heading>
            <Text color='surface.onSurfaceVariant'>{t('foraTestingPage.testAndPreviewUi')}</Text>
          </Box>

          <Box
            p={5}
            borderWidth='1px'
            borderRadius='lg'
            shadow='sm'
            transition='all 0.2s'
            _hover={{ shadow: 'md' }}
          >
            <Heading
              as='h2'
              size='md'
              mb={2}
              color='brand.primary'
            >
              <RouterLink to='/rollbar-testing'>{t('foraTestingPage.rollbarTesting')}</RouterLink>
            </Heading>
            <Text color='surface.onSurfaceVariant'>
              {t('foraTestingPage.testRollbarReportingManual')}
            </Text>
          </Box>

          <Box
            p={5}
            borderWidth='1px'
            borderRadius='lg'
            shadow='sm'
            transition='all 0.2s'
            _hover={{ shadow: 'md' }}
          >
            <Heading
              as='h2'
              size='md'
              mb={2}
              color='brand.primary'
            >
              <RouterLink to='/feature-gate-details'>
                {t('foraTestingPage.featureGateDetails')}
              </RouterLink>
            </Heading>
            <Text color='surface.onSurfaceVariant'>{t('foraTestingPage.viewAndMonitorAll')}</Text>
          </Box>

          <Box
            p={5}
            borderWidth='1px'
            borderRadius='lg'
            shadow='sm'
            transition='all 0.2s'
            _hover={{ shadow: 'md' }}
          >
            <Heading
              as='h2'
              size='md'
              mb={2}
              color='brand.primary'
            >
              <RouterLink to='/in-flux-features'>{t('foraTestingPage.inFluxFeatures')}</RouterLink>
            </Heading>
            <Text color='surface.onSurfaceVariant'>
              {t('foraTestingPage.testAndPreviewFeatures')}
            </Text>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
