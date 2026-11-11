import { HStack, Image, Stack, StackDivider, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { isEmpty } from 'lodash-es';

import {
  buildOrgLink,
  capitalizeFullString,
  emailToInt,
  formatDurationWithUnits,
  pluralized
} from '@util/helpers';
import { APOLLO_AVATAR_PLACEHOLDER_URL, BG_COLORS } from '@util/constants';
import { ApolloLogo } from '@assets/images';
import { companiesHeaders, peopleHeaders } from '@components/person/person.shared.component.jsx';
import PersonCardHeader from '@components/person/person-card-header.component';
import PersonOrgChart from '@components/org-chart/person-org-chart.component';
import RecentlyMetWith from './recently-met-with.component';
import PersonStatsInline from './person-stats-inline.component';
import ContactSourceIcon from '@components/general/contact-source-icon.component';
import { useTranslation } from 'react-i18next';

export default function PersonCard({
  foraPerson,
  contact,
  apolloPerson,
  fallbackPerson,
  isExternal,
  peopleStats,
  personStats,
  organizationsStats,
  isLoading,
  ...cardProps
}) {
  const email = foraPerson?.email ?? apolloPerson?.email ?? contact?.email ?? fallbackPerson?.email;
  const seedInt = useMemo(() => emailToInt(email), [email]);
  const bgColor = BG_COLORS[seedInt % BG_COLORS.length];
  const apolloPhotoUrl = !apolloPerson?.photo_url?.includes(APOLLO_AVATAR_PLACEHOLDER_URL)
    ? apolloPerson?.photo_url
    : null;
  const apolloName = apolloPerson?.name.length > 0 ? apolloPerson?.name : apolloPerson?.email;
  const organizationName =
    foraPerson?.tenants[0]?.name ??
    apolloPerson?.organization?.name ??
    contact?.company?.name ??
    personStats?.company_name;
  const firstName =
    foraPerson?.name?.split(' ')[0] ??
    apolloName?.split(' ')[0] ??
    personStats?.name?.split(' ')[0] ??
    email;

  const sections = [
    {
      title: `Top People ${firstName} Met`,
      type: 'person',
      items: peopleStats,
      maxItems: 4,
      table: {
        title: `Top ${pluralized('person', peopleStats?.length)}`,
        headers: peopleHeaders
      },
      itemPreview: (person) => ({
        item: { ...person, internalId: person?.id },
        key: person?.email ?? person?.name ?? person?.id,
        disabled: !person?.id && !person?.email
      })
    },
    {
      title: `Top Companies ${firstName} Met`,
      type: 'company',
      items: organizationsStats,
      maxItems: 6,
      table: {
        title: `Top ${pluralized('companies', organizationsStats?.length)}`,
        headers: companiesHeaders
      },
      itemPreview: (company) => ({
        avatarVariant: '',
        item: { ...company, title: capitalizeFullString(company?.title) },
        key: company?.email ?? company?.name ?? company?.id,
        ...(company?.email
          ? {
              to: buildOrgLink({ id: company?.id, email: company?.email })
            }
          : {
              disabled: true,
              as: Text,
              color: 'surface.onSurface',
              _hover: {}
            })
      })
    }
  ];

  const hasStats = !!personStats;
  const hasForaData = !!foraPerson?.id;
  const canAccessOrgChart = !isExternal && hasForaData;
  const hasPeopleStats = peopleStats?.length > 0 || organizationsStats?.length > 0;
  const hasAnyInfo = hasStats || canAccessOrgChart || hasPeopleStats;

  return (
    <PersonCardHeader
      email={email}
      photoUrl={
        foraPerson?.avatar_url ?? contact?.avatar_url ?? apolloPhotoUrl ?? personStats?.avatar_url
      }
      name={
        foraPerson?.name ??
        apolloName ??
        contact?.name ??
        personStats?.name ??
        fallbackPerson?.email
      }
      title={foraPerson?.title ?? contact?.title ?? apolloPerson?.title ?? personStats?.title}
      organizationName={organizationName}
      linkedinUrl={apolloPerson?.linkedin_url}
      bgColor={bgColor}
      divider={hasAnyInfo && <StackDivider style={{ margin: 0 }} />}
      {...cardProps}
    >
      {hasAnyInfo && (
        <Stack
          divider={
            <StackDivider
              style={{ margin: 0 }}
              borderBottom='reskin'
            />
          }
          py={6}
          gap={8}
        >
          {(hasStats || canAccessOrgChart) && (
            <Stack gap={8}>
              {personStats && (
                <PersonStatsInline
                  firstName={
                    foraPerson?.name?.split(' ')[0] ??
                    apolloName?.split(' ')[0] ??
                    personStats?.name?.split(' ')[0] ??
                    email
                  }
                  orgId={apolloPerson?.organization?.id}
                  orgName={organizationName}
                  orgDomain={personStats?.email?.split('@')[1]}
                  orgLogoUrl={apolloPerson?.organization?.logo_url}
                  isExternal={isExternal}
                  totalRecordedMeetings={personStats?.botted}
                  totalTime={formatDurationWithUnits(personStats?.duration ?? 0, {
                    minUnit: 'minutes',
                    maxUnit: 'days'
                  })}
                  numOfDays={90}
                />
              )}
              {canAccessOrgChart && <PersonOrgChart personId={foraPerson?.id} />}
            </Stack>
          )}
          {hasPeopleStats && (
            <RecentlyMetWith
              numOfDays={90}
              isLoading={isLoading}
              sections={sections}
            />
          )}
        </Stack>
      )}
    </PersonCardHeader>
  );
}

/**
 * currently unused, will be added back when external profiles are populated with more salesforce and apollo data
 */
export function ImportDataLabel({ apolloPerson, contact }) {
  const { t } = useTranslation();

  const hasApolloData = !!apolloPerson && !isEmpty(apolloPerson);
  const hasContactData = !!contact && !isEmpty(contact);

  if (!hasApolloData && !hasContactData) {
    return null;
  }

  return (
    <HStack
      gap={1}
      mb={6}
    >
      {hasContactData && (
        <ContactSourceIcon
          contact={contact}
          boxSize={8}
          p={1}
        />
      )}
      {hasApolloData && (
        <Image
          boxSize={8}
          p={1}
          src={ApolloLogo}
          rounded='md'
        />
      )}
      <Text
        variant='label-reg-md'
        color='surface.outline'
      >
        Importing live data from {hasContactData && t('personCard.salesforce')}
        {hasContactData && hasApolloData && ' & '}
        {hasApolloData && 'Apollo.io'}
      </Text>
    </HStack>
  );
}
