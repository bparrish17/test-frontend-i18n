import { Stack, StackDivider, Text } from '@chakra-ui/react';
// import { Link as ReactRouterLink } from 'react-router-dom';
import { isEmpty } from 'lodash-es';

import { formatDurationWithUnits, pluralized } from '@util/helpers';
import { PersonSectionHeader } from './person.shared.component';
import PersonInternalVsExternalChart from './person-internal-external-chart.component';
import PersonSummariesStats from './person-summaries-stats.component';
// import { ChevronRightIcon } from '@assets/icons';

const PersonPageRightRailContainer = ({ children }) => (
  <Stack
    divider={
      <StackDivider
        m={0}
        borderBottom='reskin'
      />
    }
    gap={11}
    p={11}
    mb={16}
  >
    {children}
  </Stack>
);

const PersonPageRightRail = ({
  summarySources,
  personStats,
  personExternalMeetings,
  personInternalMeetings,
  firstName,
  isExternal,
  numOfDays,
  isOrganization,
  isLoading
}) => {
  const sectionHeaderProps = {
    firstName,
    showOwnership: (isOrganization && !isExternal) || !isOrganization,
    type: 'Meetings',
    numOfDays
  };

  if (
    !isLoading &&
    !personStats &&
    (isExternal || (isEmpty(personExternalMeetings) && isEmpty(personInternalMeetings))) &&
    isEmpty(summarySources)
  ) {
    return (
      <PersonPageRightRailContainer>
        <Stack gap={4}>
          <PersonSectionHeader {...sectionHeaderProps} />
          <Text color='surface.onSurfaceVariant'>No meetings in past 90 days</Text>
        </Stack>
      </PersonPageRightRailContainer>
    );
  }

  return (
    <PersonPageRightRailContainer>
      <Stack
        id='meetings-stats'
        w='full'
        gap={6}
      >
        <PersonSectionHeader {...sectionHeaderProps} />
        {!isExternal && (
          <PersonInternalVsExternalChart
            personExternalMeetings={personExternalMeetings}
            personInternalMeetings={personInternalMeetings}
            numOfDays={numOfDays}
          />
        )}
        {personStats && (
          <>
            <StatBlock
              title='Total Meetings'
              value={`${pluralized('recorded meeting', personStats?.botted)}`}
            />
            {!isExternal && (
              <StatBlock
                title='Average Meetings Per Day'
                value={`${pluralized(
                  'recorded meeting',
                  (personStats?.botted / numOfDays).toFixed(1)
                )}`}
              />
            )}
            {!isOrganization && (
              <StatBlock
                title='Average Meeting Time'
                value={`${formatDurationWithUnits(
                  personStats?.duration / personStats?.botted || 0,
                  {
                    minUnit: 'minutes',
                    maxUnit: 'days'
                  }
                )}`}
              />
            )}
            {isExternal && (
              <StatBlock
                title={isOrganization ? 'Last Met' : 'Total Meeting Time'}
                value={`${formatDurationWithUnits(personStats?.duration ?? 0, {
                  minUnit: 'minutes',
                  maxUnit: 'days'
                })}${isOrganization ? ' ago' : ''}`}
              />
            )}
          </>
        )}
      </Stack>

      {summarySources?.length > 0 && (
        <PersonSummariesStats
          sectionHeaderProps={sectionHeaderProps}
          summarySources={summarySources}
        />
      )}
    </PersonPageRightRailContainer>
  );
};

const StatBlock = ({ title, value, isHighlighted }) => (
  <Stack gap={1}>
    <Text variant='content-section-header'>{title}</Text>
    <Text
      variant='title-sm'
      fontWeight={600}
      color={isHighlighted ? 'brandPrimary.primary' : 'surface.onSurface'}
    >
      {value}
    </Text>
  </Stack>
);

export default PersonPageRightRail;
