import { Center, VStack, Image, Flex, Text, Spinner } from '@chakra-ui/react';
import { useCalendars } from '@services/query-services/calendars.query-service';
import NylasService from '@services/nylas.service';
import { connectZoomAccount } from '@services/zoom.service';
import { connectSFAccount } from '@services/salesforce.service';
import { connectHubspotAccount } from '@services/hubspot.service';
import { connectRingCentralAccount } from '@services/ringcentral.service';
import { authorizeMicrosoftAsAdmin } from '@services/query-services/teams.query-service';
import { authorizeSlack } from '@services/query-services/slack.query-service';
import { useUserStore } from '@store/app.store';
import SettingsLayout from '@layouts/settings.layout';
import CenteredLayout from '@layouts/centered.layout';
import { useSetDocumentTitle } from '@util/hooks';

import {
  SlackLogo,
  TeamsLogo,
  ZoomLogo,
  SalesforceLogo,
  CalendarTodayLogo,
  HubspotLogo,
  RingCentralLogo
} from '@assets/images';
import { useStatsigClient } from '@statsig/react-bindings/src';

const nylasService = NylasService.getInstance();

async function launchNylas(user) {
  await nylasService.connectNylasAccount(user);
}

function buildSources(calendars, user, enableHubspot) {
  return [
    {
      type: 'Calendar',
      icon: CalendarTodayLogo,
      isConnected: calendars?.length > 0,
      states: {
        connected: {
          title: 'Calendar',
          description: 'Calendar Connected - click to reauthorize',
          onClick: () => launchNylas(user)
        },
        notConnected: {
          title: 'Calendar',
          description: 'Calendar not connected - click to connect',
          onClick: () => launchNylas(user)
        }
      }
    },
    {
      type: 'Slack',
      icon: SlackLogo,
      isConnected: !!user?.tenants[0].slack_config?.access_token,
      states: {
        connected: {
          title: 'Slack',
          description: 'Slack Connected',
          onClick: authorizeSlack
        },
        notConnected: {
          title: 'Slack',
          description: 'Slack not connected - click to connect',
          onClick: authorizeSlack
        }
      }
    },
    {
      type: 'Teams',
      icon: TeamsLogo,
      isConnected: !!user?.tenants[0].teams_config?.access_token,
      states: {
        connected: {
          title: 'Teams',
          description: 'Teams Connected'
        },
        notConnected: {
          title: 'Teams',
          description: 'Teams not connected - click to connect',
          onClick: authorizeMicrosoftAsAdmin
        }
      }
    },
    {
      type: 'Zoom',
      icon: ZoomLogo,
      isConnected: !!user?.tenants[0].recall_config?.zoom_oauth_credential_id,
      states: {
        connected: {
          title: 'Zoom',
          description: 'Zoom Connected - click to reauthorize',
          onClick: connectZoomAccount
        },
        notConnected: {
          title: 'Zoom',
          description: 'Zoom not connected - click to connect',
          onClick: connectZoomAccount
        }
      }
    },
    {
      type: 'Salesforce',
      icon: SalesforceLogo,
      isConnected: !!user?.tenants[0]?.salesforce_config,
      states: {
        connected: {
          title: 'Salesforce',
          description: 'Salesforce Connected'
        },
        notConnected: {
          title: 'Salesforce',
          description: 'Salesforce not connected - click to connect',
          onClick: connectSFAccount
        }
      }
    },
    {
      type: 'HubSpot',
      icon: HubspotLogo,
      hidden: !enableHubspot,
      isConnected: !!user?.tenants[0]?.hubspot_config,
      states: {
        connected: {
          title: 'HubSpot',
          description: 'HubSpot Connected'
        },
        notConnected: {
          title: 'HubSpot',
          description: 'HubSpot not connected - click to connect',
          onClick: connectHubspotAccount
        }
      }
    },
    {
      type: 'Ring Central',
      icon: RingCentralLogo,
      isConnected: !!user?.tenants[0]?.ring_central_config,
      states: {
        connected: {
          title: 'RingCentral',
          description: 'RingCentral Connected'
        },
        notConnected: {
          title: 'RingCentral',
          description: 'RingCentral not connected - click to connect',
          onClick: connectRingCentralAccount
        }
      }
    }
  ];
}

function DataSourceCard({ source }) {
  const currentState = source.isConnected ? source.states.connected : source.states.notConnected;
  return (
    <Flex
      hidden={source.hidden || false}
      layerStyle='nav-card'
      w='400px'
      onClick={currentState.onClick ?? (() => {})}
    >
      <Center
        bgColor='surface.containerLow'
        rounded='full'
        boxSize={10}
      >
        <Image
          src={source.icon}
          boxSize={6}
        />
      </Center>
      <Text
        fontWeight={700}
        fontSize='xl'
        mt={2}
      >
        {currentState.title}
      </Text>
      <Text
        color='surface.onSurfaceVariant'
        fontSize='sm'
      >
        {currentState.description}
      </Text>
    </Flex>
  );
}

export default function DataSourcesPage() {
  useSetDocumentTitle('Data Sources - FORA');
  const tenant = useUserStore((state) => state?.tenant);
  const user = useUserStore((state) => state.user);
  // FORA only
  const { checkGate } = useStatsigClient();
  const enableHubspot = checkGate('hubspot-data-source');

  const { data: dataSources, isLoading } = useCalendars(
    { creator_id: user?.id },
    {
      enabled: !!user && !!tenant,
      select: (calendars) => buildSources(calendars, user, enableHubspot)
    }
  );

  return (
    <SettingsLayout>
      <CenteredLayout>
        {isLoading ? (
          <Spinner />
        ) : (
          <VStack
            w='full'
            spacing={6}
          >
            {dataSources.map((source) => (
              <DataSourceCard
                key={source.type}
                source={source}
              />
            ))}
          </VStack>
        )}
      </CenteredLayout>
    </SettingsLayout>
  );
}
