import React, { useState } from 'react';
import { Box, Button, Heading, Text, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

/**
 * Test component that demonstrates automatic error boundary wrapping
 * by the vite-error-boundary-plugin.
 *
 * @returns {JSX.Element} Auto-plugin test component
 */
export function AutoPluginTestComponent() {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const toast = useToast();

  if (error) {
    throw new Error('Test: Auto-Plugin Test: This error should be caught');
  }

  /**
   * Triggers a toast notification and sets the error state to true,
   * causing the component to throw an error on next render.
   */
  const triggerError = () => {
    toast({
      title: t('autoPluginTest.triggeringRenderErrorIn'),
      description: t('autoPluginTest.thisErrorShouldBe'),
      status: 'warning',
      duration: 4000,
      isClosable: true
    });
    setError(true);
  };

  return (
    <Box
      p={4}
      borderWidth='1px'
      borderRadius='md'
      bg='green.50'
    >
      <Heading
        size='md'
        mb={2}
      >
        {t('autoPluginTest.autoPluginErrorBoundary')}
      </Heading>
      <Text mb={4}>{t('autoPluginTest.thisComponentIsAutomatically')}</Text>
      <Button
        colorScheme='green'
        onClick={triggerError}
      >
        {t('autoPluginTest.testAutoErrorBoundary')}
      </Button>
    </Box>
  );
}
