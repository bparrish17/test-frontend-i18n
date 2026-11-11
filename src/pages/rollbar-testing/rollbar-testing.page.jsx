import React, { useState } from 'react';
import {
  Box,
  Button,
  Code,
  Divider,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  useToast,
  VStack
} from '@chakra-ui/react';
import axios from 'axios'; // Import axios to make API calls
import { useRollbar } from '@rollbar/react'; // Import useRollbar for manual reporting example
// Import existing error boundary test components
import { AutoPluginTestComponent } from '@components/general/test-error/auto-plugin-test';
import AutoWrappedTest from '@components/general/test-error/auto-wrapped-test';
import { formatRollbarTitle, withErrorBoundary } from '@util/helpers/error-boundary.helpers';
import ErrorBoundaryWrapper from '@components/general/error-boundary/error-boundary.component';
import MeetingCardSkeleton from '@components/general/card/meeting-card/meeting-card-skeleton.component';
import ThreeDotLoader from '@components/general/loader/three-dot-loader.component';
import { useTranslation } from 'react-i18next';

/**
 * Component that throws an error on demand for boundary testing.
 * @param {object} props - Component props.
 * @param {string} [props.testName] - A name for the test instance, used in the error message.
 * @returns {JSX.Element}
 */
function ErrorThrowingComponent({ testName }) {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const toast = useToast();

  if (error) {
    // Add component name to error for easier identification if boundary fails
    throw new Error(`Test: Error from ${testName || 'ErrorThrowingComponent'}`);
  }

  /**
   * Displays a toast and sets the error state to true, causing a render error.
   */
  const triggerError = () => {
    toast({
      title: `Triggering Render Error in ${testName || 'ErrorThrowingComponent'}`,
      description: t('rollbarTestingPage.thisErrorShouldBe'),
      status: 'warning',
      duration: 4000,
      isClosable: true
    });
    setError(true);
  };

  return (
    <Button
      colorScheme='red'
      size='sm'
      onClick={triggerError}
    >
      {t('rollbarTestingPage.triggerRenderError')}
    </Button>
  );
}

/**
 * Component to test API error reporting via Axios interceptor.
 * It provides buttons to trigger various failing API requests (GET, POST)
 * and a specific test for data sanitization in Rollbar payloads.
 * @returns {JSX.Element}
 */
function ApiErrorInterceptorTest() {
  const { t } = useTranslation();

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [triggerGetStatus, setTriggerGetStatus] = useState(null);
  const [triggerPostStatus, setTriggerPostStatus] = useState(false);
  const [triggerSanitizationTest, setTriggerSanitizationTest] = useState(false);
  const toast = useToast();

  /**
   * Triggers an API request designed to fail, to test Axios interceptor reporting.
   * @param {'GET'|'POST'} method - The HTTP method for the request.
   * @param {number} [status] - The expected failure status (e.g., 404, 500). If POST, status is usually 404 for a non-existent path.
   * @async
   */
  const triggerApiRequest = async (method, status) => {
    setLoading(true);
    setApiError(null);
    setTriggerGetStatus(method === 'GET' ? status : null);
    setTriggerPostStatus(method === 'POST');

    const url =
      status === 404 || method === 'POST'
        ? '/api/this-path-does-not-exist'
        : '/api/trigger-server-error';
    const requestDesc = `${method} ${url} (expecting ${status || 'Network Error'})`;

    const samplePayload =
      method === 'POST'
        ? {
            userId: 'user-123',
            description: t('rollbarTestingPage.thisIsATest'),
            sensitiveData: {
              email: 'test.user@example.com',
              password: 'supersecretpassword!',
              apiKey: 'abc-123-xyz-789'
            },
            nestedArray: [1, { token: 'nested-token-value' }, 3]
          }
        : undefined;

    const sampleHeaders =
      method === 'POST'
        ? {
            'Content-Type': 'application/json',
            Authorization: 'Bearer sensitive-jwt-token-abc.123.xyz',
            'X-Custom-ID': 'test-post-request-id',
            Cookie: 'sessionid=secret-session-value; other=data;'
          }
        : undefined;

    try {
      if (method === 'POST') {
        await axios.post(url, samplePayload, { headers: sampleHeaders });
      } else {
        await axios.get(url);
      }
      setLoading(false);
      toast({
        title: t('rollbarTestingPage.unexpectedSuccess'),
        description: `${requestDesc} succeeded unexpectedly.`,
        status: 'warning'
      });
    } catch (err) {
      const errorStatus = err.response?.status || 'Network Error';
      console.info(`${requestDesc} failed as expected, caught in component:`, err);
      setApiError(err);
      setLoading(false);
      toast({
        title: `API Error Triggered (${method} ${errorStatus})`,
        description: `Check Rollbar for item titled like "API Error: ${method} ${url} - Status ${errorStatus}". Context should include SANITIZED details if applicable.`,
        status: 'error',
        duration: 10000,
        isClosable: true
      });
    } finally {
      setTriggerGetStatus(null);
      setTriggerPostStatus(false);
    }
  };

  /**
   * Triggers a POST request with a comprehensive payload and headers containing various sensitive data patterns.
   * This is used to test the sanitization logic in the Rollbar transform pipeline.
   * @async
   */
  const triggerSanitizationCheck = async () => {
    setLoading(true);
    setApiError(null);
    setTriggerSanitizationTest(true);

    const url = '/api/this-path-does-not-exist';
    const requestDesc = `POST ${url} with comprehensive sensitive data`;

    // Create a comprehensive payload with various sensitive data patterns
    const complexPayload = {
      user: {
        id: 'user-456',
        name: 'Test User',
        email: 'sensitive.user@company.com',
        profile: {
          password: 'SuperSecretP@ssw0rd!',
          address: '123 Main St, City, State 12345',
          preferences: {
            newsletter: true,
            marketing: false,
            token: 'user-preference-token-abc-123'
          }
        },
        security: {
          apiKey: 'sk_live_abcdef123456789',
          secretQuestion: 'What is your pet name?',
          secretAnswer: 'Fluffy'
        }
      },
      payment: {
        creditCard: '4111-1111-1111-1111',
        cvv: '123',
        expiryDate: '12/25',
        billingInfo: {
          ssn: '123-45-6789',
          taxId: '12-3456789'
        }
      },
      auth: {
        refreshToken: 'refresh_token_xyz_987654321',
        accessToken:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
        sessionId: 'session_id_123456'
      },
      metadata: {
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        emails: ['john.doe@example.com', 'jane.smith@company.org'],
        tags: ['test', 'sanitization', 'rollbar']
      },
      arrayWithSensitiveItems: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2', secret: 'secret-value-for-item2' },
        { id: 3, email: 'item3@example.com', token: 'item3-token' }
      ]
    };

    // Comprehensive sensitive headers
    const complexHeaders = {
      'Content-Type': 'application/json',
      Authorization:
        'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaXNzIjoiRm9yYSIsImV4cCI6MTcxODczOTYwMCwiaWF0IjoxNzE4NzM2MDAwfQ.signature',
      'X-Api-Key': 'apk_123456789abcdef',
      'X-Fora-Key': 'fora_key_prod_987654321',
      Cookie: 'session=abc123; auth=xyz789; preferences=theme:dark',
      'Proxy-Authorization': 'Basic dXNlcm5hbWU6cGFzc3dvcmQ=',
      'Set-Cookie': 'token=sensitive-cookie-value; Path=/; Secure; HttpOnly',
      'X-Custom-Header': 'This contains an email: test.email@domain.com and password: testpass123'
    };

    try {
      await axios.post(url, complexPayload, { headers: complexHeaders });
      setLoading(false);
      toast({
        title: t('rollbarTestingPage.unexpectedSuccess'),
        description: `${requestDesc} succeeded unexpectedly.`,
        status: 'warning'
      });
    } catch (err) {
      console.info(`${requestDesc} failed as expected, caught in component:`, err);
      setApiError(err);
      setLoading(false);
      toast({
        title: t('rollbarTestingPage.sanitizationTestTriggered'),
        description: t('rollbarTestingPage.checkRollbarForA'),
        status: 'success',
        duration: 10000,
        isClosable: true
      });
    } finally {
      setTriggerSanitizationTest(false);
    }
  };

  return (
    <Box
      p={4}
      borderWidth='1px'
      borderRadius='md'
      bg='gray.50'
    >
      <Heading
        size='md'
        mb={3}
      >
        {t('rollbarTestingPage.axiosInterceptorReporting')}
      </Heading>
      <Text
        mb={4}
        fontSize='sm'
      >
        These buttons trigger API calls designed to fail. The global Axios interceptor (
        <Code>bootstrap.helpers.js</Code>) should catch these errors and report them to Rollbar with
        specific context (<Code>{t('rollbarTestingPage.apirequestmethod')}</Code>,{' '}
        <Code>{t('rollbarTestingPage.apiurl')}</Code>,{' '}
        <Code>{t('rollbarTestingPage.isapierrorTrue')}</Code>, etc.). The POST test includes
        payload/header sanitization.
      </Text>
      <VStack
        spacing={3}
        align='start'
      >
        <Button
          colorScheme='orange'
          size='sm'
          onClick={() => triggerApiRequest('GET', 404)}
          isLoading={loading && triggerGetStatus === 404}
          disabled={loading}
        >
          {t('rollbarTestingPage.triggerGet404')}
        </Button>
        <Button
          colorScheme='red'
          size='sm'
          onClick={() => triggerApiRequest('GET', 500)}
          isLoading={loading && triggerGetStatus === 500}
          disabled={loading}
        >
          {t('rollbarTestingPage.triggerGet500Requires')}
        </Button>
        <Button
          colorScheme='purple'
          size='sm'
          onClick={() => triggerApiRequest('POST', 404)} // 404 is expected for non-existent path
          isLoading={loading && triggerPostStatus}
          disabled={loading}
        >
          {t('rollbarTestingPage.triggerPost404With')}
        </Button>
        <Divider my={2} />
        <Button
          colorScheme='blue'
          size='sm'
          onClick={triggerSanitizationCheck}
          isLoading={loading && triggerSanitizationTest}
          disabled={loading}
        >
          {t('rollbarTestingPage.testComprehensiveSanitization')}
        </Button>
        <Text
          fontSize='xs'
          color='gray.600'
        >
          {t('rollbarTestingPage.sendsARequestWith')}
        </Text>
      </VStack>
      {loading && (
        <Spinner
          size='sm'
          mt={2}
        />
      )}
      {apiError && !loading && (
        <Text
          mt={2}
          fontSize='xs'
          color='red.600'
        >
          {t('rollbarTestingPage.apiCallFailedIn')}
        </Text>
      )}
    </Box>
  );
}

/**
 * Component to test manual Rollbar reporting.
 * Provides a button to throw and catch an error, then manually report it to Rollbar.
 * @returns {JSX.Element}
 */
function ManualErrorReportingTest() {
  const { t } = useTranslation();

  const toast = useToast();
  const rollbar = useRollbar();

  /**
   * Throws an error, catches it, and manually reports it to Rollbar with custom context.
   * Also displays a toast notification.
   */
  const triggerManualError = () => {
    try {
      throw new Error('Manually reported Rollbar error from button click.');
    } catch (err) {
      rollbar.error(formatRollbarTitle('Manual', 'Manual Rollbar Test Error'), err, {
        source: 'RollbarTestingPage',
        action: 'triggerManualErrorButton'
      }); // Use helper
      toast({
        title: t('rollbarTestingPage.manualRollbarErrorSent'),
        description: t('rollbarTestingPage.checkRollbarForManual'),
        status: 'info',
        duration: 5000,
        isClosable: true
      });
    }
  };

  return (
    <Box
      p={4}
      borderWidth='1px'
      borderRadius='md'
      bg='gray.50'
    >
      <Heading
        size='md'
        mb={3}
      >
        {t('rollbarTestingPage.manualReporting')}
        <Code>{t('rollbarTestingPage.rollbarError')}</Code>)
      </Heading>
      <Text
        mb={4}
        fontSize='sm'
      >
        This button calls <Code>{t('rollbarTestingPage.rollbarError')}</Code> directly (using the{' '}
        <Code>{t('rollbarTestingPage.userollbar')}</Code> hook). Useful for errors caught in event
        handlers, async callbacks, or other places outside the React render cycle.
      </Text>
      <Button
        colorScheme='teal'
        size='sm'
        onClick={triggerManualError}
      >
        {t('rollbarTestingPage.triggerManualReport')}
      </Button>
    </Box>
  );
}

/**
 * Component to demonstrate an error-throwing loader.
 * This component is intended to test scenarios where a loader/skeleton component,
 * typically excluded from automatic error boundary wrapping, throws an error.
 * @returns {JSX.Element}
 */
function ErrorThrowingLoader() {
  const { t } = useTranslation();

  const [error, setError] = useState(false);
  const toast = useToast();

  if (error) {
    throw new Error('Test: Loader component error test (will crash if not caught higher up)');
  }

  /**
   * Displays a toast and sets the error state to true, causing a render error in the loader component.
   */
  const triggerLoaderError = () => {
    toast({
      title: t('rollbarTestingPage.triggeringRenderErrorIn'),
      description: t('rollbarTestingPage.thisErrorMightCrash'),
      status: 'error',
      duration: 5000,
      isClosable: true
    });
    setError(true);
  };

  return (
    <Box
      p={4}
      borderWidth='1px'
      borderRadius='md'
      // Keep background neutral or slightly different, red is used for the main excluded section box
      bg='orange.50'
    >
      <Heading
        size='md'
        mb={2}
      >
        {t('rollbarTestingPage.errorThrowingLoaderTest')}
      </Heading>
      <Text
        mb={4}
        fontSize='sm'
      >
        {t('rollbarTestingPage.thisFakeLoaderComponent')}
      </Text>
      <ThreeDotLoader />
      <Button
        mt={4}
        colorScheme='red'
        onClick={triggerLoaderError}
      >
        {t('rollbarTestingPage.triggerErrorInLoader')}
      </Button>
    </Box>
  );
}

/**
 * Main Rollbar testing page component.
 * This page provides a collection of tests for Rollbar integration and error boundary behavior,
 * including direct reporting, component error boundaries, and testing of excluded components.
 * @returns {JSX.Element}
 */
export default function RollbarTestingPage() {
  const { t } = useTranslation();

  // Wrapped version of the error throwing component for HOC test
  const WrappedErrorComponent = withErrorBoundary(ErrorThrowingComponent, {
    componentName: 'ErrorThrowingHOC'
  });

  return (
    <Box
      p={6}
      maxW='container.xl'
      mx='auto'
    >
      <Heading
        as='h1'
        size='xl'
        mb={4}
        textAlign='center'
      >
        {t('rollbarTestingPage.rollbarErrorBoundaryTesting')}
      </Heading>
      <Text
        mb={8}
        color='gray.600'
        textAlign='center'
      >
        {t('rollbarTestingPage.testVariousRollbarReporting')}
      </Text>

      <VStack
        spacing={10}
        align='stretch'
        divider={<Divider />}
      >
        {/* === Section 1: Direct Rollbar Reporting === */}
        <Box>
          <Heading
            size='lg'
            mb={4}
            fontWeight='semibold'
          >
            {t('rollbarTestingPage.directRollbarReporting')}
          </Heading>
          <Text
            mb={5}
            fontSize='md'
            color='gray.700'
          >
            Verify errors reported directly via the Axios interceptor or manual{' '}
            <Code>{t('rollbarTestingPage.rollbarError')}</Code> calls. These reports typically lack
            detailed React component context.
          </Text>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={6}
          >
            <ApiErrorInterceptorTest />
            <ManualErrorReportingTest />
          </SimpleGrid>
        </Box>

        {/* === Section 2: Component Error Boundaries === */}
        <Box>
          <Heading
            size='lg'
            mb={4}
            fontWeight='semibold'
          >
            {t('rollbarTestingPage.componentErrorBoundaries')}
          </Heading>
          <Text
            mb={5}
            fontSize='md'
            color='gray.700'
          >
            {t('rollbarTestingPage.verifyReactComponentRender')}
          </Text>

          {/* Boundary Implementation Methods */}
          <Heading
            size='md'
            mb={4}
            fontWeight='medium'
          >
            {t('rollbarTestingPage.boundaryImplementationMethods')}
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            spacing={6}
            mb={6}
          >
            {/* Test Case: Auto Plugin Wrapping */}
            <Box
              p={4}
              borderWidth='1px'
              borderRadius='md'
              bg='gray.50'
            >
              <Heading
                size='sm'
                mb={3}
              >
                {t('rollbarTestingPage.n1AutomaticWrappingPlugin')}
              </Heading>
              <Text
                mb={4}
                fontSize='sm'
              >
                Components automatically wrapped by the Vite plugin. Uses{' '}
                <Code>{t('rollbarTestingPage.autoplugintestcomponent')}</Code>.
              </Text>
              <AutoPluginTestComponent /> {/* Contains its own error trigger */}
            </Box>

            {/* Test Case: Auto-Wrapped (like HOC) */}
            <Box
              p={4}
              borderWidth='1px'
              borderRadius='md'
              bg='gray.50'
            >
              <Heading
                size='sm'
                mb={3}
              >
                {t('rollbarTestingPage.n2AutomaticWrappingNo')}
              </Heading>
              <Text
                mb={4}
                fontSize='sm'
              >
                Component is also auto-wrapped, but doesnt import the boundary itself. Uses{' '}
                <Code>{t('rollbarTestingPage.autowrappedtest')}</Code>.
              </Text>
              <AutoWrappedTest /> {/* Contains its own error trigger */}
            </Box>

            {/* Test Case: Direct Usage */}
            <Box
              p={4}
              borderWidth='1px'
              borderRadius='md'
              bg='gray.50'
            >
              <Heading
                size='sm'
                mb={3}
              >
                {t('rollbarTestingPage.n3ManualWrappingDirect')}
              </Heading>
              <Text
                mb={4}
                fontSize='sm'
              >
                Using <Code>{t('rollbarTestingPage.errorboundarywrapper')}</Code> directly in JSX
                around <Code>{t('rollbarTestingPage.errorthrowingcomponent')}</Code>.
              </Text>
              <ErrorBoundaryWrapper componentName='ErrorThrowingDirect'>
                <ErrorThrowingComponent testName='ErrorThrowingDirect' />
              </ErrorBoundaryWrapper>
            </Box>

            {/* Test Case: HOC Usage */}
            <Box
              p={4}
              borderWidth='1px'
              borderRadius='md'
              bg='gray.50'
            >
              <Heading
                size='sm'
                mb={3}
              >
                {t('rollbarTestingPage.n4ManualWrappingHoc')}
              </Heading>
              <Text
                mb={4}
                fontSize='sm'
              >
                Using the <Code>{t('rollbarTestingPage.witherrorboundary')}</Code> HOC on{' '}
                <Code>{t('rollbarTestingPage.errorthrowingcomponent')}</Code>.
              </Text>
              <WrappedErrorComponent testName='ErrorThrowingHOC' />
            </Box>
          </SimpleGrid>

          {/* Excluded Components */}
          <Box mt={6}>
            <Heading
              size='md'
              mb={4}
              fontWeight='medium'
            >
              {t('rollbarTestingPage.excludedComponents')}
            </Heading>
            <Box
              p={4}
              borderWidth='1px'
              borderRadius='md'
              bg='red.50'
            >
              <Text
                mb={4}
                fontSize='sm'
              >
                Loading/skeleton components are typically excluded from automatic error boundary
                wrapping (via Vite plugin config). Errors triggered within these might&apos; crash
                the app if not caught by a higher-level boundary. The component below (
                <Code>{t('rollbarTestingPage.errorthrowingloader')}</Code>) explicitly tests this
                crash behavior.
              </Text>
              {/* Display excluded components without individual triggers */}
              <SimpleGrid
                columns={{ base: 1, sm: 2, md: 3 }}
                spacing={4}
                mb={4}
              >
                <Box
                  p={2}
                  borderWidth='1px'
                  borderRadius='md'
                  bg='white'
                >
                  <Text
                    fontWeight='bold'
                    mb={1}
                    fontSize='sm'
                  >
                    {t('rollbarTestingPage.meetingcardskeleton')}
                  </Text>
                  <MeetingCardSkeleton />
                  {/* Removed trigger button */}
                </Box>
                <Box
                  p={2}
                  borderWidth='1px'
                  borderRadius='md'
                  bg='white'
                >
                  <Text
                    fontWeight='bold'
                    mb={1}
                    fontSize='sm'
                  >
                    {t('rollbarTestingPage.threedotloader')}
                  </Text>
                  <ThreeDotLoader />
                  {/* Removed trigger button */}
                </Box>
                <Box
                  p={2}
                  borderWidth='1px'
                  borderRadius='md'
                  bg='white'
                  minH='60px'
                >
                  <Text
                    fontWeight='bold'
                    mb={1}
                    fontSize='sm'
                  >
                    {t('rollbarTestingPage.loadingscreen')}
                  </Text>
                  <Text fontSize='xs'>{t('rollbarTestingPage.componentOmittedForVisibility')}</Text>
                  {/* Removed trigger button */}
                </Box>
              </SimpleGrid>
              {/* Add the explicit error throwing loader component */}
              <ErrorThrowingLoader />
            </Box>
          </Box>
        </Box>
      </VStack>
    </Box>
  );
}
