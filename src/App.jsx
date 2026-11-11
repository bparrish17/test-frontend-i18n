// PWA TODO: https://deanhume.com/displaying-a-new-version-available-progressive-web-app/
// PWA TODO: https://web.dev/customize-install/
// PWA TODO: navigator.share for all sharing dialogs (open native sharing)

import { MsalProvider } from '@azure/msal-react';
import { Security } from '@okta/okta-react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { useIdleTimer } from 'react-idle-timer';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import '@fontsource/inter';
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react'; // <-- Provider imports 'rollbar' for us
import { ReactFlowProvider } from '@xyflow/react';
import { StatsigProvider, useClientAsyncInit } from '@statsig/react-bindings';
import { runStatsigAutoCapture } from '@statsig/web-analytics';
import { runStatsigSessionReplay } from '@statsig/session-replay';

import { useUserStore } from '@store/app.store';
import {
  bootstrapMsalPCA,
  bootstrapPWA,
  buildStatsigUser,
  hours,
  initializeOktaAuth,
  isPWA,
  minutes,
  printBuildInfo,
  rollbarConfig
} from '@util/helpers';
import { OKTA_CONFIG } from '@util/constants';
import { initializeFeatureGates } from '@store/feature-gates.store';
import analyticsService, { initializeAnalytics } from '@services/analytics.service';

// guards and route features
import AuthenticatedUserRoutes from '@routes/authenticated-user.route-guard';
import ReadOnlyBlockedRoutes from '@routes/read-only-user.route-guard';
import ScrollRestoration from '@routes/scroll-restoration.route-addon';
import UserTypeBlockedRoutes from '@routes/user-type.route-guard';

// Import the test components
import PageLayout from '@layouts/page.layout';
import AgendaPage from '@pages/agenda/agenda.page';
import NylasCallbackPage from '@pages/callback/nylas-callback.page';
import SlackCallbackPage from '@pages/callback/slack-callback.page';
import TeamsCallbackPage from '@pages/callback/teams-callback.page';
import OktaCallbackPage from '@pages/callback/okta-callback.page';
import OktaCallbackWebPage from '@pages/callback/okta-callback-web.page';
import ZoomCallbackPage from '@pages/callback/zoom-callback.page';
import SalesforceCallbackPage from '@pages/callback/salesforce-callback.page';
import HubspotCallbackPage from '@pages/callback/hubspot-callback.page';
import RingCentralCallbackPage from '@pages/callback/ringcentral-callback.page';
import CardPage from '@pages/cards/cards.page.jsx';
import DigestPage from '@pages/digest/digest.page';
import ManualDigestPage from '@pages/digest/manual-digest.page';
import CreateFocusPage from '@pages/focus/create-focus.page';
import FocusSettingsPage from '@pages/focus/focus-settings.page';
import FocusesPage from '@pages/focuses/focuses.page';
import HomePage from '@pages/home/home.page';
import CreateLensPage from '@pages/lens/create-lens.page';
import LensesPage from '@pages/lens/lenses.page';
import LoginPage from '@pages/login/login.page';
import GuestLoginPage from '@pages/login/guest-login.page';
import OktaLoginPage from '@pages/login/okta-login.page';
import OktaLoginIdpPage from '@pages/login/okta-login-idp.page';
import LogoutPage from '@pages/logout/logout.page';
import OrganizationPage from '@pages/organization/organization.page';
import PersonPage from '@pages/person/person.page';
import ReadOnlyFeedPage from '@pages/read-only-feed/read-only-feed.page';
import AnalyticsPage from '@pages/settings/analytics/analytics.page';
import AttendedMeetingsPage from '@pages/settings/analytics/attended-meetings.page';
import FailedBotsPage from '@pages/settings/analytics/failed-bots.page';
import CalendarSettingsPage from '@pages/settings/calendar-settings.page';
import ZoomSettingsPage from '@pages/settings/zoom-settings.page';
import DataSourcesPage from '@pages/settings/data-sources.page';
import EmailSubscriptionsPage from '@pages/settings/email-subscriptions.page';
import RecordingPage from '@pages/settings/recording.page';
import SecurityPage from '@pages/settings/security.page';
import SettingsPage from '@pages/settings/settings.page';
import UserPromptsPage from '@pages/settings/user-prompts.page';
import AccountSettingsPage from '@pages/settings/account-settings/account-settings.page';
import ManageUsersPage from '@pages/settings/manage-users/manage-users.page';
import CreateUserPage from '@pages/settings/manage-users/create-user.page';
import UserDetailsPage from '@pages/settings/manage-users/user-details.page';
import ConfigureOktaPage from '@pages/settings/configure-okta.page';
import ManageTemplatesPage from '@pages/settings/manage-templates.page';
import ManageUploadsPage from '@pages/settings/manage-uploads.page';
import ManageTeamsPage from '@pages/settings/manage-teams.page';
import ManageDigestsPage from '@pages/settings/manage-digests.page';
import ManageLabelsPage from '@pages/settings/manage-labels.page';
import MeetingPage from '@pages/meeting/meeting.page';
import ReskinSummariesPage from '@pages/reskin-summaries/reskin-summaries.page';
import EditLensPage from '@pages/lens/edit-lens.page';
import ComponentTestingPage from '@pages/component-testing/component-testing.page';
import GuestMeetingsPage from '@pages/guest/guest-meetings.page';
import LensInsightPage from '@pages/lens/lens-insight.page.jsx';
import EarningsCallDetailPage from '@pages/earnings-call/earnings-call-detail.page';
import EarningsCallsPage from '@pages/settings/earnings-calls.page';
import InDevelopmentRoute from '@routes/in-development.route-guard.jsx';
import RollbarTestingPage from '@pages/rollbar-testing/rollbar-testing.page';
import ForaTestingPage from '@pages/fora-testing/fora-testing.page';
import FeatureGateDetailsPage from '@pages/feature-gate-details/feature-gate-details.page';
import InFluxFeaturesPage from '@pages/in-flux-features/in-flux-features.page';

import Fonts from '@styles/fonts.theme';
import theme from '@styles/theme';
import 'react-datepicker/dist/react-datepicker.css';
import ForaOnlyRoutes from '@routes/fora.route-guard';
import CardExplorerPage from '@pages/explorer/explorer.page';

// const OS_LOCAL_ID = import.meta.env.VITE_OS_LOCAL_ID;
// const OS_PROD_ID = import.meta.env.VITE_OS_PROD_ID;
const STATSIG_KEY = import.meta.env.VITE_STATSIG_KEY;

const chakraTheme = extendTheme(theme);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: minutes(1),
      refetchOnWindowFocus: !import.meta.env.DEV === true
    }
  }
});

/**
 * Main application component.
 * Initializes providers (Rollbar, Statsig, Chakra, Okta, MSAL, React Query, React Flow),
 * sets up idle timer, handles initial data loading, and renders the main page layout and routes.
 * @returns {JSX.Element} The main application structure.
 */
function App() {
  const isDev = import.meta.env.DEV === true;
  const user = useUserStore((state) => state.user);
  const tenant = useUserStore((state) => state.tenant);
  const microsoftTenantId = useUserStore((state) => state.tenant?.teams_config?.access_token);
  const setFromLocalStorage = useUserStore((state) => state.setFromLocalStorage);
  const navigate = useNavigate();
  const location = useLocation();
  const [msalInstance, setMsalInstance] = useState(() =>
    bootstrapMsalPCA(navigate, microsoftTenantId)
  );
  const isUserAuthenticated = useUserStore((state) => state.isAuthenticated);
  const [analyticsInitialized, setAnalyticsInitialized] = useState(false);

  const oktaAuth = initializeOktaAuth({
    clientId: OKTA_CONFIG.clientId,
    issuer: OKTA_CONFIG.issuer
  });

  const { client: ssClient } = useClientAsyncInit(STATSIG_KEY, buildStatsigUser(user));

  useEffect(() => {
    if (ssClient && user) {
      if (!analyticsInitialized) {
        // Initialize only once
        initializeAnalytics(ssClient, user, tenant, location);
        setAnalyticsInitialized(true);
      } else {
        // Handle subsequent route changes
        analyticsService.handleRouteChange(location);
      }
    }
  }, [ssClient, user, tenant, location, analyticsInitialized]);

  useEffect(() => {
    setMsalInstance(bootstrapMsalPCA(navigate, microsoftTenantId));
  }, [microsoftTenantId]);

  useEffect(() => {
    /**
     * Initializes application-wide settings and services on component mount.
     * Prints build info, bootstraps PWA if applicable, loads user data from local storage,
     * initializes feature gates for non-authenticated users, and starts Statsig analytics.
     */
    const onInit = async () => {
      printBuildInfo();

      if (isPWA()) await bootstrapPWA();

      // Get user data from localStorage if not already loaded
      if (!user || !tenant) {
        setFromLocalStorage();
      }

      // Only initialize feature gates here if no user is authenticated
      // For authenticated users, we initialize during login flow
      if (!isUserAuthenticated()) {
        await initializeFeatureGates();
      }

      // todo: add this for pulse images if we go this direction
      // bootstrapRandomPulseImages();

      // bootstrapServiceWorker(isDev, OS_LOCAL_ID, OS_PROD_ID);

      runStatsigAutoCapture(ssClient);
      runStatsigSessionReplay(ssClient);
    };
    onInit();
  }, []);

  useIdleTimer({
    timeout: hours(24),
    onIdle: () => navigate('/logout')
  });

  const pageLayoutExcludedRoutes = [
    '/login',
    '/login/guest',
    '/login/okta',
    '/logout',
    '/callback'
  ];

  /**
   * Callback for Okta authentication to restore the original URI or navigate to home.
   * @param {Object} _oktaAuth - The Okta authentication instance (unused).
   * @param {string} originalUri - The URI to restore after authentication.
   */
  const restoreOriginalUri = async (_oktaAuth, originalUri) => {
    navigate(originalUri || '/');
  };

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <StatsigProvider
          client={ssClient}
          sdkKey={STATSIG_KEY}
        >
          <ChakraProvider theme={chakraTheme}>
            <Fonts />
            <Security
              oktaAuth={oktaAuth}
              restoreOriginalUri={restoreOriginalUri}
            >
              <MsalProvider instance={msalInstance}>
                <QueryClientProvider client={queryClient}>
                  <QueryParamProvider adapter={ReactRouter6Adapter}>
                    <ReactFlowProvider>
                      <PageLayout excludedRoutes={pageLayoutExcludedRoutes}>
                        <ScrollRestoration />
                        <AppRoutes />
                        {isDev && (
                          <ReactQueryDevtools
                            initialIsOpen={false}
                            position='bottom-left'
                            closeButtonProps={{
                              style: {
                                right: 0,
                                left: 'unset'
                              }
                            }}
                          />
                        )}
                      </PageLayout>
                    </ReactFlowProvider>
                  </QueryParamProvider>
                </QueryClientProvider>
              </MsalProvider>
            </Security>
          </ChakraProvider>
        </StatsigProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
}

/**
 * Component responsible for defining all application routes.
 * Includes public routes, authenticated user routes with various guards (read-only, user type),
 * and internal testing routes.
 * @returns {JSX.Element} A Routes component from react-router-dom.
 */
function AppRoutes() {
  return (
    <Routes>
      <Route
        path='/login'
        element={<LoginPage />}
      />
      <Route
        path='/login/guest'
        element={<GuestLoginPage />}
      />
      <Route
        path='/login/okta'
        element={<OktaLoginPage />}
      />
      <Route
        path='/login/okta/idp'
        element={<OktaLoginIdpPage />}
      />
      <Route
        path='/callback/teams'
        element={<TeamsCallbackPage />}
      />
      <Route
        path='/callback/okta'
        element={<OktaCallbackPage />}
      />
      <Route
        path='/callback/login/okta'
        element={<OktaCallbackWebPage />}
      />

      {/* Protected Routes */}
      <Route element={<AuthenticatedUserRoutes />}>
        <Route
          path='/meeting/:meetingId'
          element={<MeetingPage />}
        />
        <Route
          path='/earnings-calls/:botId'
          element={<EarningsCallDetailPage />}
        />
        <Route
          path='/callback/nylas'
          element={<NylasCallbackPage />}
        />
        <Route
          path='/callback/slack'
          element={<SlackCallbackPage />}
        />
        <Route
          path='/zoom/callback'
          element={<ZoomCallbackPage />}
        />
        <Route
          path='/salesforce/callback'
          element={<SalesforceCallbackPage />}
        />
        <Route
          path='/hubspot/callback'
          element={<HubspotCallbackPage />}
        />
        <Route
          path='/ringcentral/callback'
          element={<RingCentralCallbackPage />}
        />
        <Route
          path='/explorer/:conversationId'
          element={<CardExplorerPage />}
        />
        <Route
          path='/explorer'
          element={<CardExplorerPage />}
        />
        <Route
          path='/'
          element={<RootPage />}
        />
        <Route
          path='/insights/:insightId'
          element={<LensInsightPage />}
        />
        <Route
          path='/logout'
          element={<LogoutPage />}
        />
        <Route
          path='/settings'
          element={<SettingsPage />}
        />
        <Route
          path='/settings/security'
          element={<SecurityPage />}
        />
        {/* Read Only Users cannot access these routes */}
        <Route element={<ReadOnlyBlockedRoutes />}>
          <Route
            path='/home'
            element={<HomePage />}
          />
          <Route
            path='/lenses'
            element={<LensesPage />}
          />
          <Route
            path='/lenses/create'
            element={<CreateLensPage />}
          />
          <Route
            path='/lenses/:lensId/edit'
            element={<EditLensPage />}
          />
          <Route
            path='/agenda'
            element={<AgendaPage />}
          />
          <Route
            path='/summaries'
            element={<ReskinSummariesPage />}
          />
          <Route
            path='/focuses'
            element={<FocusesPage />}
          />
          <Route
            path='/person'
            element={<PersonPage />}
          />
          <Route
            path='/organization'
            element={<OrganizationPage />}
          />
          <Route
            path='/digests/manual'
            element={<ManualDigestPage />}
          />
          <Route
            path='/digests/:channelId'
            element={<DigestPage />}
          />
          <Route
            path='/cards/:cardId'
            element={<CardPage />}
          />
          <Route
            path='/settings/prompts'
            element={<UserPromptsPage />}
          />
          <Route
            path='/settings/recording'
            element={<RecordingPage />}
          />
          <Route
            path='/settings/sources'
            element={<DataSourcesPage />}
          />
          <Route
            path='/settings/calendar'
            element={<CalendarSettingsPage />}
          />
          <Route
            path='/settings/zoom'
            element={<ZoomSettingsPage />}
          />
          <Route
            path='/settings/email-subscriptions'
            element={<EmailSubscriptionsPage />}
          />
          <Route
            path='/settings/earnings-calls'
            element={<EarningsCallsPage />}
          />
          <Route
            path='/settings/manage-templates'
            element={<ManageTemplatesPage />}
          />
          <Route
            path='/settings/manage-uploads'
            element={<ManageUploadsPage />}
          />
          <Route
            path='/settings/manage-teams'
            element={<ManageTeamsPage />}
          />
          <Route
            path='/settings/manage-digests'
            element={<ManageDigestsPage />}
          />

          <Route
            element={
              <InDevelopmentRoute
                gateName='user-profile-page'
                fallbackComponent={AgendaPage}
              />
            }
          >
            <Route
              path='/settings/account'
              element={<AccountSettingsPage />}
            />
          </Route>

          {/* Admin Only Routes */}
          <Route element={<UserTypeBlockedRoutes allowedTypes={['Admin']} />}>
            <Route
              path='/settings/manage-labels'
              element={<ManageLabelsPage />}
            />
          </Route>

          {/* Executive Only Routes */}
          <Route element={<UserTypeBlockedRoutes allowedTypes={['Executive']} />}>
            <Route
              path='/lenses'
              element={<LensesPage />}
            />
            <Route
              path='/settings/analytics'
              element={<AnalyticsPage />}
            />
            <Route
              path='/settings/analytics/failed-bots'
              element={<FailedBotsPage />}
            />
            <Route
              path='/settings/analytics/attended-meetings'
              element={<AttendedMeetingsPage />}
            />
          </Route>

          {/* Admin/Executive Only Routes */}
          <Route element={<UserTypeBlockedRoutes allowedTypes={['Admin', 'Executive']} />}>
            <Route
              path='/focuses/create'
              element={<CreateFocusPage />}
            />
            <Route
              path='/focuses/:focusId/settings'
              element={<FocusSettingsPage />}
            />
            <Route
              path='/settings/manage-users'
              element={<ManageUsersPage />}
            />
            <Route
              path='/settings/manage-users/add-user'
              element={<CreateUserPage />}
            />
            <Route
              path='/settings/manage-users/edit-user'
              element={<UserDetailsPage />}
            />
            <Route
              path='/settings/configure-okta'
              element={<ConfigureOktaPage />}
            />
          </Route>
        </Route>
        <Route
          path='*'
          element={<Navigate to='/' />}
        />

        {/* Fora Only Routes - Internal testing and development */}
        <Route element={<ForaOnlyRoutes />}>
          {/* Main testing landing page */}
          <Route
            path='/fora-testing'
            element={<ForaTestingPage />}
          />

          <Route
            path='/component-testing'
            element={<ComponentTestingPage />}
          />

          <Route
            path='/rollbar-testing'
            element={<RollbarTestingPage />}
          />

          <Route
            path='/feature-gate-details'
            element={<FeatureGateDetailsPage />}
          />

          <Route
            path='/in-flux-features'
            element={<InFluxFeaturesPage />}
          />
        </Route>

        <Route
          element={
            <InDevelopmentRoute
              gateName='earnings-calls'
              fallbackComponent={AgendaPage}
            />
          }
        >
          <Route
            path='/earnings-calls'
            element={<EarningsCallsPage />}
          />
        </Route>

        {/* Redirect for typo in URL */}
        <Route
          path='/earning-calls'
          element={
            <Navigate
              to='/earnings-calls'
              replace
            />
          }
        />
      </Route>
    </Routes>
  );
}

/**
 * Component to determine the initial page for a user.
 * If the user is a guest, navigates to the guest meetings page.
 * If the user is a read-only type (Associate), navigates to the read-only feed.
 * Otherwise, navigates to the agenda page.
 * Returns null if user data is not yet available.
 * @returns {JSX.Element|null} A Navigate component or null.
 */
function RootPage() {
  const user = useUserStore((state) => state.user);
  const tenant = useUserStore((state) => state.tenant);
  if (!user) {
    return null;
  }

  const isGuest = !!user?.isGuest;
  const isReadOnlyUser = user?.type === 'Associate';
  if (isReadOnlyUser) {
    return <ReadOnlyFeedPage />;
  }

  if (isGuest) {
    return <GuestMeetingsPage />;
  }

  const homePage = tenant?.fe_config?.home_page || 'agenda';

  return (
    <Navigate
      replace
      to={`/${homePage}`}
    />
  );
}

export default App;
