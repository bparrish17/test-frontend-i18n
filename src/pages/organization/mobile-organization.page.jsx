import { Stack, Tabs } from '@chakra-ui/react';

import RecentMeetingSummaries from '@components/person/person-recent-meeting-summaries.component';
import OrganizationDetails from '@components/organization/organization-details.component';

export default function MobileOrganizationPage({
  domain,
  userOrgDomain,
  isExternal,
  organization
}) {
  return (
    <Tabs variant='nav'>
      <Stack
        py={{ base: 0, md: 8 }}
        px={{ base: 0, md: 8 }}
        gap={8}
      >
        <Stack gap={4}>
          <OrganizationDetails
            domain={domain}
            userOrgDomain={userOrgDomain}
            isExternal={isExternal}
            organization={organization}
          />
          <RecentMeetingSummaries
            email={organization?.primary_domain}
            numOfDays={90}
            isOrganization
          />
        </Stack>
      </Stack>
    </Tabs>
  );
}
