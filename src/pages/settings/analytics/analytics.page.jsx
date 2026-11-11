import { Flex, HStack, Heading, Icon, Text } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { TableIcon } from '@assets/icons';
import SettingsLayout from '@layouts/settings.layout';
import CenteredLayout from '@layouts/centered.layout';
import { useSetDocumentTitle } from '@util/hooks';
import { useTranslation } from 'react-i18next';

export default function AnalyticsPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Analytics - FORA');
  return (
    <SettingsLayout dataCy='analytics-page'>
      <CenteredLayout gap={6}>
        <Link to='/settings/analytics/attended-meetings'>
          <Flex
            layerStyle='nav-card'
            gap={4}
          >
            <HStack gap={4}>
              <Icon
                as={TableIcon}
                boxSize={6}
                color='brandPrimary.primary'
              />
              <Heading fontSize='xl'>{t('analyticsPage.attendedMeetings')}</Heading>
            </HStack>
            <Text fontSize='sm'>{t('analyticsPage.thisTableShowsAll')}</Text>
            <Text
              fontSize='14'
              color='surface.onSurfaceVariant'
            >
              {t('analyticsPage.updated5MinAgo')}
            </Text>
          </Flex>
        </Link>
        <Link to='/settings/analytics/failed-bots'>
          <Flex
            layerStyle='nav-card'
            gap={4}
          >
            <HStack gap={4}>
              <Icon
                as={TableIcon}
                boxSize={6}
                color='brandPrimary.primary'
              />
              <Heading fontSize='xl'>{t('analyticsPage.failedBots')}</Heading>
            </HStack>
            <Text fontSize='sm'>{t('analyticsPage.thisTableShowsThe')}</Text>
            <Text
              fontSize='14'
              color='surface.onSurfaceVariant'
            >
              {t('analyticsPage.updated5MinAgo')}
            </Text>
          </Flex>
        </Link>
      </CenteredLayout>
    </SettingsLayout>
  );
}
