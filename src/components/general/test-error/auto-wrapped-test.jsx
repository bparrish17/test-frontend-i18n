import React, { useState } from 'react';
import { Box, Button, Heading, Text, useToast } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

/**
 * Test component that demonstrates error boundary auto-wrapping feature.
 * This component is automatically wrapped by the error boundary plugin
 * without manually importing the error boundary component.
 *
 * @returns {JSX.Element} Auto-wrapped test component
 */
function AutoWrappedTest() {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const toast = useToast();

  if (error) {
    throw new Error('Test: Auto-wrapped component error test');
  }

  /**
   * Triggers a toast notification and sets the error state to true,
   * causing the component to throw an error on the next render.
   */
  const triggerError = () => {
    toast({
      title: t('autoWrappedTest.triggeringRenderErrorIn'),
      description: t('autoWrappedTest.thisErrorShouldBe'),
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
      bg='blue.50'
    >
      <Heading
        size='md'
        mb={2}
      >
        {t('autoWrappedTest.autoWrappedTestComponent')}
      </Heading>
      <Text mb={4}>{t('autoWrappedTest.thisComponentDoesnT')}</Text>
      <Button
        colorScheme='blue'
        onClick={triggerError}
      >
        {t('autoWrappedTest.testAutoWrapping')}
      </Button>
    </Box>
  );
}

AutoWrappedTest.displayName = 'AutoWrappedTest';

export default AutoWrappedTest;
