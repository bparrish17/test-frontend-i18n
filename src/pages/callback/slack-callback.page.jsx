import { Flex, Container, Spinner } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { usePatchTenantAsAppUser } from '@services/query-services/tenants.query-service';
import { makeSlackRequest } from '@services/query-services/slack.query-service';
import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import { useRollbar } from '@rollbar/react';
import { formatRollbarTitle } from '@util/helpers/error-boundary.helpers.jsx';

/**
 * Extracts the 'code' parameter from a URL query string.
 * @param {string} s - The URL query string (e.g., location.search).
 * @returns {string|null} The value of the 'code' parameter, or null if not found.
 */
function getCodeFromQueryString(s) {
  const params = new URLSearchParams(s);
  return params.get('code');
}

const SLACK_CLIENT_ID = import.meta.env.VITE_SLACK_CLIENT_ID;
const SLACK_CLIENT_SECRET = import.meta.env.VITE_SLACK_CLIENT_SECRET;

/**
 * Exchanges an authorization code for a Slack access token.
 * Makes a POST request to Slack's oauth.v2.access endpoint.
 * @param {string} code - The authorization code received from Slack.
 * @returns {Promise<string|undefined>} A promise that resolves to the access token, or undefined on failure.
 * @async
 */
async function getAccessToken(code) {
  const response = await makeSlackRequest({
    method: 'POST',
    endpoint: 'oauth.v2.access',
    data: {
      code,
      client_id: SLACK_CLIENT_ID,
      client_secret: SLACK_CLIENT_SECRET,
      redirect_uri: `${window.location.origin}/callback/slack`
    },
    includeToken: false
  });
  return response?.access_token || response?.data?.access_token;
}

/**
 * Authorizes the Slack integration by obtaining an access token and patching the tenant configuration.
 * Displays success or error toasts and navigates the user accordingly.
 * @param {string} code - The authorization code from Slack.
 * @param {Function} patchTenantAsAppUser - Mutation function to update tenant data.
 * @param {string} tenantId - The ID of the current tenant.
 * @param {Function} toast - Function to display toast notifications.
 * @param {Function} navigate - React Router navigate function.
 * @param {Object} rollbar - Rollbar instance for error reporting.
 * @async
 */
async function authorize(code, patchTenantAsAppUser, tenantId, toast, navigate, rollbar) {
  try {
    const accessToken = await getAccessToken(code);
    patchTenantAsAppUser(
      { id: tenantId, slack_config: { access_token: accessToken, alert_channel: 'fora-alerts' } },
      {
        onError: () => {
          throw new Error();
        }
      }
    );
    toast({
      title: 'Slack connected successfully.',
      status: 'success'
    });
    navigate('/');
  } catch (e) {
    rollbar?.error(formatRollbarTitle('Manual', 'Slack Auth Error | Backend'), e);
    toast({
      title: 'Something went wrong. You might already have Slack connected.',
      status: 'error'
    });
  }
}

/**
 * Page component for handling the Slack OAuth callback.
 * Extracts the authorization code, exchanges it for an access token,
 * updates the tenant with Slack configuration, and navigates the user.
 * Displays a loading spinner during the process.
 * @returns {JSX.Element} The SlackCallbackPage component.
 */
function SlackCallbackPage() {
  const { mutateAsync: patchTenantAsAppUser } = usePatchTenantAsAppUser();
  const userStore = useUserStore();
  const user = userStore.user;

  const { search } = useLocation();
  const code = getCodeFromQueryString(search);
  const navigate = useNavigate();
  const toast = useStyledToast();
  const rollbar = useRollbar();

  const containerStyles = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh'
  };

  useEffect(() => {
    if (code && user) {
      authorize(code, patchTenantAsAppUser, user.tenants[0].id, toast, navigate, rollbar);
    }
  }, [code, user]);

  return (
    <Flex
      data-cy='slack-callback-page'
      flexDirection='column'
      w='full'
      h='auto'
      bgColor='surface.containerLowest'
    >
      <Container
        maxW='8xl'
        minW='8xl'
        {...containerStyles}
      >
        <Spinner size='xl' />
      </Container>
    </Flex>
  );
}

export default SlackCallbackPage;
