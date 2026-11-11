import { Box, Show, Hide, useDisclosure, useMediaQuery } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMsal } from '@azure/msal-react';
import { useStatsigClient } from '@statsig/react-bindings';

import {
  usePusherCardNotifications,
  usePusherLogout,
  useSetFullMobileVH,
  useSetDocumentTitle
} from '@util/hooks';
import { useRefStore, useUserConfigStore, useUserMSALStore, useUserStore } from '@store/app.store';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import { PAGE_HEADER_HEIGHT } from '@util/constants';
import AppHeader from '@components/layout/app-header.component';
import MobileHeader from '@components/layout/mobile-header.component';
import Sider from '@components/layout/sider.component';
import WelcomeModal from '@components/general/modals/welcome-modal.component';

/**
 * Main application layout with header, sidebar, and content area
 *
 * @typedef {Object} PageLayoutProps
 * @property {React.ReactNode} children - Child components to render in the main content area
 * @property {string[]} excludedRoutes - List of routes that should not use this layout
 *
 * @param {PageLayoutProps} props
 * @returns {JSX.Element} Page layout component
 */
export default function PageLayout({ children, excludedRoutes }) {
  useSetDocumentTitle();
  const mainRef = useRefStore((state) => state.mainRef);
  const hasReceivedWelcome = useUserConfigStore((state) => state.hasReceivedWelcome);
  const welcomeDisclosure = useDisclosure();
  const isAuthenticated = useUserStore((state) => state.isAuthenticated());
  const mainHeight = `calc(100vh - ${PAGE_HEADER_HEIGHT}px)`;
  const location = useLocation();
  const { checkGate } = useStatsigClient();
  const welcomeModalEnabled = checkGate('welcome-modal');
  const [isDesktopAndAbove] = useMediaQuery('(min-width: 1024px)', { ssr: false });

  // agenda-page specific layout listeners for header

  useSetFullMobileVH(mainRef, PAGE_HEADER_HEIGHT);
  usePusherCardNotifications();
  useMicrosoftLoginCheck();
  usePusherLogout();

  useEffect(() => {
    if (welcomeModalEnabled && !hasReceivedWelcome && !welcomeDisclosure.isOpen) {
      welcomeDisclosure.onOpen();
    }
  }, [welcomeModalEnabled, welcomeDisclosure.isOpen, welcomeDisclosure.onOpen, hasReceivedWelcome]);

  if (excludedRoutes?.some((route) => location.pathname.includes(route))) {
    return children;
  }

  return (
    <Box
      w='full'
      position='relative'
    >
      {/* Desktop Page Layout lg+ (inclusive) */}
      <Show
        above='lg'
        ssr={false}
      >
        <AppHeader />
        {isAuthenticated && <Sider />}
      </Show>
      <Hide
        above='lg'
        ssr={false}
      >
        <MobileHeader />
      </Hide>
      <Box
        as='main'
        ref={mainRef}
        position='relative'
        h={mainHeight}
        w='100vw'
        pl={{ base: 0, lg: 20 }}
        flexGrow={1}
        bgColor='surface.containerLow'
        overflowY={isDesktopAndAbove ? 'visible' : 'scroll'}
        overflowX='clip'
        sx={HIDE_SCROLLBAR}
      >
        {isDesktopAndAbove ? (
          <Box
            overflowY='scroll'
            h='full'
            sx={HIDE_SCROLLBAR}
          >
            {children}
          </Box>
        ) : (
          children
        )}
      </Box>
      {welcomeDisclosure.isOpen && <WelcomeModal disclosure={welcomeDisclosure} />}
    </Box>
  );
}

/**
 * Hook to handle Microsoft login events and authentication
 */
function useMicrosoftLoginCheck() {
  const { instance: msalInstance } = useMsal();
  const setTokens = useUserMSALStore((state) => state.setTokens);
  const navigate = useNavigate();
  const authenticateWithMicrosoft = useUserStore((state) => state.authenticateWithMicrosoft);

  useEffect(() => {
    msalInstance.addEventCallback(async (message) => {
      if (
        message.eventType === 'msal:loginSuccess' ||
        message.eventType === 'msal:acquireTokenSuccess'
      ) {
        const accessToken = message?.payload?.accessToken;
        const idToken = message?.payload?.idToken;
        setTokens({ accessToken, idToken });
        await authenticateWithMicrosoft(accessToken, idToken);
        navigate('/');
      }
    });
  }, [msalInstance]);
}
