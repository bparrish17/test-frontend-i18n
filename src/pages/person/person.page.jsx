import { Stack } from '@chakra-ui/react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQueryParam } from 'use-query-params';
import { useEffect } from 'react';
import { capitalize } from 'lodash-es';

import { useBreakpoints, useSetDocumentTitle, useStyledToast, usePersonData } from '@util/hooks';
import { isExternalToUser } from '@util/helpers';
import { useUserStore } from '@store/app.store';

import PersonCardSkeleton from '@components/person/person-card-skeleton.component';
import PersonCard from '@components/person/person-card.component';
import RecentMeetingSummaries from '@components/person/person-recent-meeting-summaries.component';
import PersonPageRightRail from '@components/person/person-right-rail.component';
import ColumnedLayout from '@layouts/columned.layout';
import LoadingScreenComponent from '@components/general/loading-screen.component';

export default function PersonPage() {
  const user = useUserStore((state) => state.user);

  const { isMobile } = useBreakpoints();
  const navigate = useNavigate();
  const toast = useStyledToast();
  const [email] = useQueryParam('email');
  const [id, setId] = useQueryParam('id');
  const {
    isInvalidPerson,
    // personIsCurrentUser,
    isPersonLoading,
    foraPerson,
    apolloPerson,
    contact,
    // employmentHistoryOrgs,
    organizationsStats,
    personSummarySources,
    peopleStats,
    personStats,
    personInternalMeetings,
    personExternalMeetings,
    isLoading: isPersonDataLoading,
    numOfDays
  } = usePersonData(id, email);

  useSetDocumentTitle(`${apolloPerson?.name ?? foraPerson?.name ?? email} - FORA`);

  useEffect(() => {
    if (isInvalidPerson) {
      toast({ title: `Person with the email "${email}" not found` });
      navigate(-1);
    }
  }, [isInvalidPerson]);

  useEffect(() => {
    if (id === 'undefined') {
      setId(null, 'replaceIn');
    }
  }, [id]);

  const borderStyles = isMobile ? { borderTop: 'none' } : {};
  // const person = foraPerson || apolloPerson || { id, email };
  const apolloName = apolloPerson?.name?.length > 0 ? apolloPerson?.name : apolloPerson?.email;
  const isExternal = isExternalToUser({ user, foraPerson, apolloPerson, email });

  return (
    <AnimatePresence exitBeforeEnter>
      {isPersonDataLoading && (
        <LoadingScreenComponent
          key='loading-screen'
          title={foraPerson?.name ?? apolloName ?? email}
        />
      )}

      <ColumnedLayout
        data-cy='person-page'
        rightRailContent={
          <PersonPageRightRail
            summarySources={personSummarySources}
            personStats={personStats}
            personInternalMeetings={personInternalMeetings}
            personExternalMeetings={personExternalMeetings}
            firstName={
              foraPerson?.name?.split(' ')[0] ??
              apolloName?.split(' ')[0] ??
              personStats?.name?.split(' ')[0] ??
              capitalize(email?.split('@')[0])
            }
            isExternal={isExternal}
            numOfDays={numOfDays}
            isLoading={isPersonDataLoading}
          />
        }
      >
        <Stack
          py={{ base: 0, md: 8, '2xl': 11 }}
          px={{ base: 0, md: 8, '2xl': 20 }}
          gap={4}
        >
          {isPersonLoading ? (
            <PersonCardSkeleton />
          ) : (
            <>
              <PersonCard
                apolloPerson={apolloPerson}
                foraPerson={foraPerson}
                contact={contact}
                fallbackPerson={{ id, email }}
                // employmentHistoryOrgs={employmentHistoryOrgs}
                isExternal={isExternal}
                peopleStats={peopleStats}
                personStats={personStats}
                organizationsStats={organizationsStats}
                isLoading={isPersonDataLoading}
                {...borderStyles}
              />
              {/* <TopicsTable topics={topics} /> */}
              <RecentMeetingSummaries
                foraPerson={foraPerson}
                email={email}
                numOfDays={numOfDays}
              />
            </>
          )}
        </Stack>
      </ColumnedLayout>
    </AnimatePresence>
  );
}
