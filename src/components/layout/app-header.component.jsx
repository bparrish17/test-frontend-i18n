import {
  Alert,
  AlertDescription,
  Button,
  Divider,
  Flex,
  HStack,
  IconButton,
  Image,
  Spacer
} from '@chakra-ui/react';
import { useStatsigClient } from '@statsig/react-bindings';
import { useEffect } from 'react';
import { Link as ReactRouterLink, useNavigate } from 'react-router-dom';

import {
  SFExclamationMarkTriangleOutlined,
  SFGearIcon,
  SFQuestionMarkCircleFilled
} from '@assets/icons';
import { ForaLogoWhite } from '@assets/images';
import { useUserStore } from '@store/app.store';
import { useGlobalSettings } from '@services/query-services/global-settings.query-service';
import { evaluateOutageMessageVisibility } from '@util/helpers/global-settings.helpers';
import DesktopGlobalSearch from '@components/global-search/desktop-global-search-wrapper.component';
import Profile from './profile.component';
import SummarizeMenu from './summarize/summarize-menu.component';
import { useTranslation } from 'react-i18next';

export default function AppHeader({ ...containerProps }) {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const outageMessageVisibility = useUserStore((state) => state.outageMessageVisibility);
  const getOutageMessageVisibility = useUserStore((state) => state.getOutageMessageVisibility);
  const setOutageMessageVisibility = useUserStore((state) => state.setOutageMessageVisibility);
  const isGuest = !!user?.isGuest;

  const { checkGate } = useStatsigClient();
  const isSummarizeMenuEnabled = checkGate('summarize-menu');

  const { data: globalSettings } = useGlobalSettings({}, { enabled: !!(user && !isGuest) });

  const hideOutageMessage = () => {
    const outageMessageVisibility = {
      hidden: true,
      lastMessage: globalSettings?.outage_message
    };
    setOutageMessageVisibility(outageMessageVisibility);
  };

  useEffect(() => {
    // gets outageMessageVisibility from local storage
    getOutageMessageVisibility();
  }, []);

  return (
    <>
      {globalSettings?.outage_message &&
        evaluateOutageMessageVisibility(outageMessageVisibility, globalSettings) && (
          <Alert
            status='warning'
            justifyContent='space-between'
          >
            <HStack>
              <SFExclamationMarkTriangleOutlined />
              <AlertDescription>{globalSettings?.outage_message}</AlertDescription>
            </HStack>
            <Button
              size='xs'
              variant='reskinOutline'
              colorScheme='caution'
              onClick={() => hideOutageMessage()}
            >
              {t('appHeader.close')}
            </Button>
          </Alert>
        )}
      <Flex
        as='header'
        w='full'
        position='sticky'
        h={20}
        top={0}
        zIndex={10}
        align='center'
        justify='space-between'
        gap={{ base: 2, xl: 4 }}
        pl={0.5}
        pr={6}
        py='18px'
        bgColor='brandPrimary.onContainer'
        {...containerProps}
      >
        <Image
          src={ForaLogoWhite}
          w='78px'
          h='full'
          px={3}
          alt={t('appHeader.foraBrandLogoAlt')}
          onClick={() => navigate('/')}
          cursor='pointer'
          zIndex='popover'
        />
        <DesktopGlobalSearch />
        <Spacer />
        <Flex gap={3}>
          {!isGuest && (
            <HeaderNavItem
              icon={SFGearIcon}
              to='/settings'
            />
          )}
          <IconButton
            variant='link'
            isRound
            _hover={{ opacity: 0.6 }}
            icon={
              <SFQuestionMarkCircleFilled
                fill='white'
                boxSize={5}
              />
            }
            id='intercom-support'
          />
          <Profile />
        </Flex>
        {isSummarizeMenuEnabled && user && !isGuest && (
          <>
            <Divider
              orientation='vertical'
              borderColor='brandPrimary.fixed'
            />
            <SummarizeMenu />
          </>
        )}
      </Flex>
    </>
  );
}

function HeaderNavItem({ to, icon: NavIcon, ...props }) {
  return (
    <IconButton
      variant='link'
      as={ReactRouterLink}
      isRound
      to={to}
      _hover={{ opacity: 0.6 }}
      icon={
        <NavIcon
          fill='white'
          boxSize={5}
        />
      }
      {...props}
    />
  );
}
