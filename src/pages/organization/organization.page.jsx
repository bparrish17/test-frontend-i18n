import { Stack, useConst } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { useQueryParam } from 'use-query-params';

import { useApolloOrganizationsByIds } from '@services/query-services/apollo.query-service';
import { useEnrichedOrganizationsStats, useSetDocumentTitle } from '@util/hooks';
import { useMeetings } from '@services/query-services/meetings.query-service';
import { subDays } from 'date-fns';
import { useUserStore } from '@store/app.store';
import { useCardSubSources } from '@services/query-services/cards.query-service';

import ColumnedLayout from '@layouts/columned.layout';
import MobileOrganizationPage from './mobile-organization.page';
import OrganizationDetails from '@components/organization/organization-details.component';
import PersonPageRightRail from '@components/person/person-right-rail.component';
import RecentMeetingSummaries from '@components/person/person-recent-meeting-summaries.component';

export default function OrganizationPage() {
  const [domain] = useQueryParam('domain');
  const [id] = useQueryParam('id');
  const numOfDays = 90;

  // when navigating to organization page from any page, make sure to navigate with the organization from that page
  // in navigation state so we have a fallback in case they refresh and lost the value stored in query cache
  const { state: fallbackOrganization } = useLocation();

  const { data: organization } = useApolloOrganizationsByIds([id], {
    enabled: !!id,
    select: (organizations) => (organizations?.length > 0 ? organizations[0] : fallbackOrganization)
  });

  useSetDocumentTitle(`${organization?.name} - FORA`);

  const today = useConst(new Date());
  const user = useUserStore((state) => state?.user);
  const userOrgDomain = user?.email?.split('@')[1];
  const isCurrentUsersOrg = userOrgDomain && userOrgDomain === domain;
  const { organizationStats, isOrganizationsStatsLoading } = useEnrichedOrganizationsStats(domain);

  const { data: cardSubSources, isInitialLoading: isCardSubSourcesLoading } = useCardSubSources({
    domain
  });

  const { data: organizationMeetings, isInitialLoading: isOrganizationMeetingsLoading } =
    useMeetings(
      {
        start_at_from: subDays(today, numOfDays),
        start_at_to: today.getTime(),
        domains: [domain],
        pageSize: 100
      },
      { enabled: !!domain && isCurrentUsersOrg }
    );

  const organizationExternalMeetings = organizationMeetings?.filter(
    (meeting) => meeting?.domains?.length > 1
  );

  const organizationInternalMeetings = organizationMeetings?.filter(
    (meeting) => meeting?.domains?.[0] === domain
  );

  const isLoading =
    isOrganizationMeetingsLoading || isCardSubSourcesLoading || isOrganizationsStatsLoading;

  return (
    <ColumnedLayout
      rightRailContent={
        <PersonPageRightRail
          summarySources={cardSubSources}
          personStats={organizationStats}
          numOfDays={numOfDays}
          firstName={isCurrentUsersOrg ? 'Your Company' : organization?.name ?? domain}
          isExternal={!isCurrentUsersOrg}
          personInternalMeetings={organizationInternalMeetings}
          personExternalMeetings={organizationExternalMeetings}
          isOrganization
          isLoading={isLoading}
        />
      }
      mobileContent={
        <MobileOrganizationPage
          domain={domain}
          userOrgDomain={userOrgDomain}
          isExternal={!isCurrentUsersOrg}
          organization={organization}
        />
      }
    >
      <Stack
        py={11}
        px={{ base: 3, md: 11 }}
        gap={11}
      >
        <OrganizationDetails
          domain={domain}
          userOrgDomain={userOrgDomain}
          isExternal={!isCurrentUsersOrg}
          organization={organization}
        />
        <RecentMeetingSummaries
          email={domain}
          numOfDays={numOfDays}
          isOrganization
        />
      </Stack>
    </ColumnedLayout>
  );
}
