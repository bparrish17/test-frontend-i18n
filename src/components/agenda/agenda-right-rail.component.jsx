import { Stack } from '@chakra-ui/react';
import { uniqBy } from 'lodash-es';
import { memo } from 'react';
import { StringParam, useQueryParam, withDefault } from 'use-query-params';

import ReskinOrganizationStack from '@components/general/reskin-organization-stack.component';
import ReskinPeopleStack from '@components/general/reskin-people-stack.component';
import LinkRadio from '@components/general/form/link-radio.component';
import AgendaStats from './agenda-stats.component';
import AgendaRightRailSkeleton from './right-rail-skeleton.component';

const agendaFilterOptions = [
  { value: 'overview', label: 'Overview' },
  { value: 'people', label: 'People' },
  { value: 'organizations', label: 'Orgs' }
];

function AgendaRightRail({
  meetings,
  isAttendeesPopulating,
  populatedAttendees,
  populatedOrganizations
}) {
  const [agendaFilter, setAgendaFilter] = useQueryParam(
    'tab',
    withDefault(StringParam, 'overview')
  );

  if (isAttendeesPopulating) {
    return <AgendaRightRailSkeleton />;
  }

  return (
    <Stack
      gap={11}
      p={11}
    >
      <LinkRadio
        name='agenda-sidebar-filter'
        options={agendaFilterOptions}
        value={agendaFilter}
        onChange={setAgendaFilter}
        containerProps={{ alignSelf: 'flex-start' }}
      />
      {agendaFilter === 'overview' && <AgendaStats meetings={meetings} />}
      {agendaFilter !== 'organizations' && (
        <ReskinPeopleStack people={uniqBy(populatedAttendees, 'email')} />
      )}
      {agendaFilter !== 'people' && (
        <ReskinOrganizationStack organizations={populatedOrganizations} />
      )}
    </Stack>
  );
}

export default memo(AgendaRightRail);
