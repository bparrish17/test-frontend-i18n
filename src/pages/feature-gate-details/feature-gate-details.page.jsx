import React from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import FeatureGatesTable from '@components/general/feature-gates-table/feature-gates-table.component';
import { useTranslation } from 'react-i18next';

/**
 * Feature Gate Details page
 * This page displays all feature gates and their statuses in an interactive table
 *
 * @returns {JSX.Element} Feature Gate Details page
 */
export default function FeatureGateDetailsPage() {
  const { t } = useTranslation();

  return (
    <Container
      maxW='container.lg'
      py={8}
    >
      <VStack
        spacing={6}
        align='stretch'
      >
        <Box>
          <Heading
            as='h1'
            size='xl'
            mb={2}
          >
            {t('featureGateDetailsPage.featureGateDetails')}
          </Heading>
          <Text
            fontSize='lg'
            color='surface.onSurfaceVariant'
            mb={6}
          >
            {t('featureGateDetailsPage.viewAndMonitorAll')}
          </Text>
        </Box>

        <FeatureGatesTable />
      </VStack>
    </Container>
  );
}
