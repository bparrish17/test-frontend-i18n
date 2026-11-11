import { Stack, StackDivider, Text } from '@chakra-ui/react';

import { usePeopleStats } from '@services/query-services/meetings.query-service';
import { useUserStore } from '@store/app.store';
import {
  buildOrgLink,
  capitalizeFullString,
  formatDurationWithUnits,
  getOrgDescription,
  pluralized
} from '@util/helpers';
import { SFTwoBuildings } from '@assets/icons';
import { useEnrichedOrganizationsStats } from '@util/hooks';
import { PEOPLE_ORG_STATS_PAGE_SIZE, US_STATE_MAP } from '@util/constants';
import { companiesHeaders, peopleHeaders } from '@components/person/person.shared.component';

import OrganizationStatsInline from './organization-stats-inline.component';
import RecentlyMetWith from '@components/person/recently-met-with.component';
import PersonOrgChart from '@components/org-chart/person-org-chart.component';
import PersonCardHeader from '@components/person/person-card-header.component';

/** @param {{ organization: Organization}} */
export default function OrganizationDetails({ organization, domain, userOrgDomain, isExternal }) {
  const user = useUserStore((state) => state?.user);
  const location = getLocationText(organization);
  const userOrgName = user?.apollo_profile?.organization?.name ?? userOrgDomain;
  const description = getOrgDescription(organization, 'seo');
  const numOfDays = 90;
  const pageSize = PEOPLE_ORG_STATS_PAGE_SIZE;

  const { data: peopleStats, isLoading: isPeopleStatsLoading } = usePeopleStats(
    { domain, days: numOfDays, pageSize },
    {
      enabled: !!domain
    }
  );

  const { organizationStats, allOrganizationsStats, isOrganizationsStatsLoading } =
    useEnrichedOrganizationsStats(domain, pageSize + 1);
  const organizationsStats = allOrganizationsStats?.filter(
    (org) => org?.id !== organizationStats?.id
  );
  const isLoading = isOrganizationsStatsLoading || isPeopleStatsLoading;

  const peopleSection = {
    enabled: peopleStats?.length > 0,
    value: {
      id: 'company-people-section',
      title: isExternal
        ? `Top People From ${organizationStats?.name ?? domain} & ${userOrgName}`
        : 'People',
      type: isExternal ? `${organizationStats?.name} invitee` : 'person',
      items: peopleStats,
      table: {
        title: `Top ${pluralized('people', peopleStats?.length)}`,
        headers: peopleHeaders
      },
      maxItems: 4,
      itemPreview: (person) => ({
        item: {
          ...person,
          name:
            isExternal && person?.company_name
              ? `${person?.name} • ${person?.company_name}`
              : person?.name ?? person?.email
        },
        key: `${person?.email}-${person?.id}`,
        disabled: !person?.id && !person?.email
      })
    }
  };

  const companiesSection = {
    enabled: allOrganizationsStats?.length > 0,
    value: {
      id: 'companies-section',
      title: isExternal ? `Companies that also met with ${organization?.name}` : 'Companies',
      type: 'company',
      items: organizationsStats,
      maxItems: 6,
      table: {
        title: `Top ${pluralized('company', organizationsStats?.length)}`,
        headers: companiesHeaders
      },
      itemPreview: (company) => ({
        avatarVariant: '',
        item: { ...company, title: capitalizeFullString(company?.title) },
        key: `org-${company?.email}`,
        fallbackIcon: <SFTwoBuildings />,
        ...(company?.id
          ? {
              to: buildOrgLink({ id: company?.id, email: company?.email })
            }
          : {
              disabled: !company?.email,
              as: Text,
              color: 'surface.onSurface',
              _hover: {}
            })
      })
    }
  };

  const sections = [
    ...(peopleSection.enabled ? [peopleSection.value] : []),
    ...(companiesSection.enabled ? [companiesSection.value] : [])
  ];

  const recentlyMetWithHeaderTitle = isExternal ? 'Meeting Invitees' : 'Recently Met With';

  const hasStats = !!organizationStats;
  const hasForaData = !!user?.id;
  const canAccessOrgChart = !isExternal && hasForaData;
  const hasPeopleStats = peopleStats?.length > 0 || organizationsStats?.length > 0;
  const hasAnyInfo = hasStats || canAccessOrgChart || hasPeopleStats;

  return (
    <PersonCardHeader
      isOrganization
      websiteUrl={organization?.website_url}
      photoUrl={organization?.logo_url}
      name={organization?.name ?? domain}
      title={capitalizeFullString(organization?.industry)}
      subtitle={location}
      linkedinUrl={organization?.linkedin_url}
      divider={hasAnyInfo && <StackDivider style={{ margin: 0 }} />}
    >
      <Stack
        divider={
          <StackDivider
            style={{ margin: 0 }}
            borderBottom='base'
          />
        }
        py={6}
        gap={8}
      >
        {(hasStats || canAccessOrgChart) && (
          <Stack gap={8}>
            {hasStats && (
              <OrganizationStatsInline
                totalRecordedMeetings={organizationStats?.botted}
                totalTime={formatDurationWithUnits(organizationStats?.duration ?? 0, {
                  minUnit: 'minutes',
                  maxUnit: 'days'
                })}
                numOfDays={numOfDays}
                orgName={organization?.name}
                isExternal={isExternal}
              />
            )}
            {description && isExternal && (
              <Text
                color='surface.onSurfaceVariant'
                fontSize='md'
                lineHeight={6}
              >
                {description}
              </Text>
            )}
            {canAccessOrgChart && <PersonOrgChart personId={user.id} />}
          </Stack>
        )}
        <RecentlyMetWith
          headerTitle={recentlyMetWithHeaderTitle}
          isLoading={isLoading}
          numOfDays={numOfDays}
          sections={sections}
        />
      </Stack>
    </PersonCardHeader>
  );
}

export const getLocationText = (organization) => {
  const { city, state, country } = organization ?? {};
  let location = [city, country];

  if (!country || country === 'United States') {
    location = [city, US_STATE_MAP[state?.toLowerCase()]];
  }

  return location.filter(Boolean).join(', ');
};
