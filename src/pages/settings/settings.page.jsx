import {
  Icon,
  Text,
  Stack,
  Heading,
  Image,
  Flex,
  Avatar,
  Grid,
  GridItem,
  Divider
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { partition, reject } from 'lodash-es';
import { useStatsigClient } from '@statsig/react-bindings/src';

import {
  SFPieChartIcon,
  SFChatBubblesIconOutlined,
  SFCalendarIcon,
  SFRecordCircleIcon,
  SFClipboardIcon,
  SFFocusIcon,
  SFPersonIconOutlined,
  SFEnvelopeIcon,
  SFLineChartIcon,
  ZoomLogoIcon,
  SFThreePersonIconOutlined,
  SFBookPagesOutlinedIcon,
  SFDollarSignCircleIcon,
  SFSliderHorizontalIcon,
  LabelIcon,
  SFBoltFillIcon
} from '@assets/icons';
import { BlackOktaAura } from '@assets/images';
import { useIsUserType, useSetDocumentTitle } from '@util/hooks';
import { useUserStore } from '@store/app.store';
import { useTranslation } from 'react-i18next';

const basePath = '/settings';

const LabelRouteIcon = () => (
  <Icon
    as={LabelIcon}
    boxSize={6}
    color='brandPrimary.primary'
  />
);

function SubRouteCard({ icon, iconType = 'svg', title, headerChildren, description }) {
  const { t } = useTranslation();

  return (
    <Stack
      layerStyle='section-card'
      gap={3}
      p={4}
      height='250px'
      data-testid={title}
    >
      <Flex justify='space-between'>
        {iconType === 'avatar' ? (
          <Avatar
            size={15}
            src={icon}
          />
        ) : (
          <Flex
            align='center'
            w={9}
            h={9}
          >
            {iconType === 'png' && (
              <Image
                src={icon}
                alt={t('settingsPage.oktaLogoAlt')}
                boxSize='30px'
              />
            )}
            {iconType === 'svg' && (
              <Icon
                as={icon}
                boxSize={6}
                color='brandPrimary.onContainer'
              />
            )}
          </Flex>
        )}
        {headerChildren}
      </Flex>
      <Heading
        size='sm'
        lineHeight={5}
      >
        {title}
      </Heading>
      <Text
        color='surface.onSurfaceVariant'
        fontSize='sm'
        lineHeight='21px'
        noOfLines={5}
        textOverflow='ellipsis'
      >
        {description}
      </Text>
    </Stack>
  );
}

export default function SettingsPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Settings - FORA');
  const userPhoto = useUserStore(
    (state) => state?.user?.avatar_url || state?.user?.apollo_profile?.photo_url
  );
  const tenant = useUserStore((state) => state?.tenant);
  const isAdmin = useIsUserType('Admin');
  const isExecutive = useIsUserType('Executive');
  const isAssociate = useIsUserType('Associate');

  const { checkGate } = useStatsigClient();
  const enableComponentTesting = checkGate('component-testing-page');
  const enableZoomSettings = checkGate('zoom-settings-page');
  const enableEarningsCalls = checkGate('earnings-calls');
  const enableUserProfilePage = checkGate('user-profile-page');

  const subRoutes = [
    {
      hidden: !enableUserProfilePage,
      path: '/account',
      iconType: 'avatar',
      icon: userPhoto,
      title: t('settingsPage.yourProfileSettings'),
      description: t('settingsPage.reviewAndAddSettings'),
      colSpan: 2
    },
    {
      hidden: isAssociate || enableUserProfilePage,
      path: '/prompts',
      icon: SFClipboardIcon,
      title: t('settingsPage.userPrompt'),
      description: t('settingsPage.trainForaToUnderstand')
    },
    {
      hidden: isAssociate,
      path: '/sources',
      icon: SFPieChartIcon,
      title: t('settingsPage.dataSources'),
      description: t('settingsPage.manageExternalSourcesOf')
    },
    {
      hidden: !isAdmin,
      path: '/manage-labels',
      icon: LabelRouteIcon,
      title: t('settingsPage.manageLabels'),
      description: t('settingsPage.addManageLabelsFor'),
      isAdmin: true
    },
    {
      hidden: !(isAdmin || isExecutive),
      path: '/focuses',
      isGlobalPath: true,
      icon: SFFocusIcon,
      title: t('settingsPage.categories'),
      description: t('settingsPage.helpForaCategorizeMeetings'),
      isAdmin: true
    },
    {
      hidden: !(isExecutive || isAdmin),
      path: '/manage-users',
      icon: SFThreePersonIconOutlined,
      title: t('settingsPage.manageUsers'),
      description: t('settingsPage.addRemoveUsers'),
      isAdmin: true
    },
    {
      hidden: !isExecutive,
      path: '/analytics',
      icon: SFLineChartIcon,
      title: t('settingsPage.analytics'),
      description: t('settingsPage.viewDataOnFora'),
      isAdmin: true
    },
    {
      hidden: true,
      path: '/security',
      icon: SFPersonIconOutlined,
      title: t('settingsPage.signInSecurity'),
      description: t('settingsPage.secureYourAccountAnd')
    },
    {
      hidden: isAssociate,
      path: '/calendar',
      icon: SFCalendarIcon,
      title: t('settingsPage.calendar'),
      description: t('settingsPage.addRemoveCalendarsAnd')
    },
    {
      hidden:
        !(tenant?.slack_config?.access_token || tenant?.teams_config?.access_token) || isAssociate,
      path: '/manage-digests',
      icon: SFChatBubblesIconOutlined,
      title: t('settingsPage.slackTeamsDigests'),
      description: t('settingsPage.manageHowForaSummarizes')
    },
    {
      hidden: isAssociate || enableUserProfilePage,
      path: '/email-subscriptions',
      icon: SFEnvelopeIcon,
      title: t('settingsPage.emailSubscriptions'),
      description: t('settingsPage.specifyWhichEmailSubscriptions')
    },
    {
      hidden: !enableEarningsCalls || !(isAdmin || isExecutive),
      path: '/earnings-calls',
      icon: SFDollarSignCircleIcon,
      title: t('settingsPage.earningsCalls'),
      description: t('settingsPage.addStockTickersTo')
    },
    {
      hidden: !isAdmin,
      path: '/recording',
      icon: SFRecordCircleIcon,
      title: t('settingsPage.recording'),
      description: t('settingsPage.manageRecordingSettingsIncluding'),
      isAdmin: true
    },
    {
      hidden: !enableZoomSettings,
      path: '/zoom',
      icon: ZoomLogoIcon,
      title: t('settingsPage.zoomAdmin'),
      description: t('settingsPage.manageZoomAccountSettings'),
      isAdmin: true
    },
    {
      path: '/manage-templates?templatesSort=1|desc',
      icon: SFBookPagesOutlinedIcon,
      title: t('settingsPage.manageTemplates'),
      description: t('settingsPage.manageYourSummaryTemplates')
    },
    {
      path: '/manage-uploads?templatesSort=2|desc',
      icon: SFBoltFillIcon,
      title: t('settingsPage.manageUploads'),
      description: t('settingsPage.manageYourUploadedMeetings')
    },
    {
      path: '/manage-teams',
      icon: SFThreePersonIconOutlined,
      title: t('manageTeams.pageTitle'),
      description: t('manageTeams.manageYourTeams')
    },
    {
      hidden: true, // TODO: Eventually we will allow users to configure this
      path: '/configure-okta',
      icon: BlackOktaAura,
      iconType: 'png',
      title: t('settingsPage.configureOkta'),
      description: t('settingsPage.configureYourTenantFor'),
      isAdmin: true
    },
    {
      hidden: !enableComponentTesting,
      path: '/component-testing',
      isGlobalPath: true,
      icon: SFSliderHorizontalIcon,
      title: t('settingsPage.componentTesting'),
      description: t('settingsPage.previewComponents')
    }
  ];

  const filteredSubroutes = reject(subRoutes, 'hidden');
  const [adminSubRoutes, userSubroutes] = partition(filteredSubroutes, 'isAdmin');

  return (
    <Stack
      p={11}
      gap={{ base: 6, xl: 11 }}
    >
      <Heading size='lg'>{t('settingsPage.settings')}</Heading>
      <SettingsGrid subRoutes={userSubroutes} />

      {(isAdmin || isExecutive) && (
        <>
          <Divider />
          <Heading size='lg'>{t('settingsPage.adminSettings')}</Heading>
          <SettingsGrid subRoutes={adminSubRoutes} />
        </>
      )}
    </Stack>
  );
}

function SettingsGrid({ subRoutes }) {
  return (
    <Grid
      templateColumns={{
        base: 'repeat(1, 1fr)',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)',
        xl: 'repeat(4, 1fr)'
      }}
      gap={{ base: 4, md: 6, lg: 8, xl: 11 }}
    >
      {subRoutes.map((subRoute) => {
        const path = subRoute.isGlobalPath ? subRoute.path : basePath + subRoute.path;
        return (
          <GridItem
            as={Link}
            to={!subRoute.disabled && path}
            key={path}
            state={{ title: subRoute.title, description: subRoute.description }}
            colSpan={{ base: 1, md: subRoute.colSpan ?? 1 }}
          >
            <SubRouteCard
              icon={subRoute.icon}
              iconType={subRoute.iconType}
              title={subRoute.title}
              description={subRoute.description}
              headerChildren={subRoute.headerChildren}
              props={subRoute.props}
            />
          </GridItem>
        );
      })}
    </Grid>
  );
}
