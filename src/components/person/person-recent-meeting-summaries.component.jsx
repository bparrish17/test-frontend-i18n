import {
  Box,
  Text,
  StackDivider,
  HStack,
  Icon,
  Stack,
  Tag,
  Skeleton,
  useConst,
  Button
} from '@chakra-ui/react';
import 'chartjs-adapter-date-fns';
import { format, isToday, subDays } from 'date-fns';

import { useInfiniteCards } from '@services/query-services/cards.query-service';
import { getMeetingSource, getNumberArray } from '@util/helpers';
import { SFLockIcon } from '@assets/icons';
import CalendarIcon from '@assets/icons/sf-icons/calendar.icon';
import StyledLink from '@components/general/styled-link.component';
import { useTranslation } from 'react-i18next';

const RecentMeetingSummaries = ({ email, numOfDays, foraPerson, isOrganization }) => {
  const { t } = useTranslation();

  const today = useConst(new Date());
  const pageSize = 10;

  const emailFilters = [email];
  if (foraPerson?.groups) {
    foraPerson?.groups?.forEach((g) => emailFilters.push(g));
  }

  const {
    data: infiniteRecentCards,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useInfiniteCards({
    pageSize,
    source: 'Meeting',
    ...(isOrganization
      ? { participants_domains: emailFilters }
      : { participants_emails: emailFilters }),
    created_at_from: subDays(today, numOfDays).getTime(),
    created_at_to: today.getTime(),
    initiative_type: 'Focus'
  });

  if (infiniteRecentCards?.pages[0]?.total === 0) {
    return null;
  }

  return (
    <Stack
      layerStyle='reskin-card'
      divider={<StackDivider />}
      w='full'
      spacing={4}
    >
      <HStack
        w='full'
        pt={6}
        pb={3}
        gap={2}
        px={6}
      >
        <Icon
          as={CalendarIcon}
          boxSize={4}
          color='brandPrimary.primary'
        />
        <Text
          fontWeight={600}
          fontSize='xl'
          lineHeight='28px'
        >
          {t('personRecentMeetingSummaries.recentMeetingSummaries')}
        </Text>
      </HStack>
      <Stack
        divider={<StackDivider />}
        mx={12}
        spacing={4}
      >
        {/* <MeetingTimeline id={id} email={email} numOfDays={numOfDays} /> */}
        <Stack
          id='recent-summaries'
          gap={6}
          pb={8}
          w='full'
        >
          {infiniteRecentCards?.pages?.map((page) => {
            return page?.data?.map((card) => (
              <MeetingInlineCard
                key={card?.id}
                card={card}
                meeting={card?.source_data}
              />
            ));
          })}
          {(isFetchingNextPage || isLoading) &&
            getNumberArray(pageSize).map((i) => (
              <Stack
                key={`skeleton-${i}`}
                w='full'
                gap={2}
              >
                <Skeleton
                  h={5}
                  w='100%'
                />
                <Skeleton
                  h={5}
                  w='50%'
                />
              </Stack>
            ))}
          {hasNextPage && (
            <ViewMoreButton
              onClick={fetchNextPage}
              isLoading={isLoading || isFetchingNextPage}
            />
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};

const ViewMoreButton = ({ onClick, isLoading }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <Skeleton
        w={20}
        h={4}
      />
    );
  }

  return (
    <Button
      alignSelf='start'
      variant='link'
      onClick={onClick}
      fontSize='sm'
    >
      {t('personRecentMeetingSummaries.viewMore')}
    </Button>
  );
};

const MeetingInlineCard = ({ meeting, card }) => {
  const { t } = useTranslation();

  const source = getMeetingSource(meeting);
  // contentTypeOptions.find(
  //    (opt) => opt.id === card?.source && opt.source === card?.source_data?.source
  //  );
  return (
    <Stack
      key={meeting?.id}
      w='full'
      gap={1}
    >
      <HStack align='start'>
        {!source?.icon || !card ? (
          <Icon
            mt={0.5}
            as={CalendarIcon}
            boxSize={4}
            color='brandPrimary.primary'
          />
        ) : (
          <Icon
            mt={0.5}
            as={source?.icon}
            boxSize={source?.iconSize}
          />
        )}
        <StyledLink to={`/meeting/${meeting?.id}`}>
          <Text
            variant='title-bolder-sm'
            color='brandPrimary.primary'
            fontWeight={600}
          >
            {meeting?.title}
          </Text>
        </StyledLink>
        {meeting?.sensitive && (
          <Tag
            alignSelf='center'
            color='brandPrimary.primary'
            rounded='lg'
            minW='fit-content'
            py={1}
            px={1.5}
            ml={2}
          >
            <HStack gap={0.5}>
              <SFLockIcon boxSize={4} />
              <Text
                variant='content-section-header'
                fontSize='xs'
                color='brandPrimary.primary'
                lineHeight={4}
              >
                {t('personRecentMeetingSummaries.private')}
              </Text>
            </HStack>
          </Tag>
        )}
      </HStack>
      <Box w='full'>
        <HStack
          display='inline-block'
          align='start'
          w='full'
          borderLeft='reskin'
          ml={2}
          pl={4}
          gap={3}
        >
          <Text
            as='span'
            variant='content-section-header'
            color='brandPrimary.primary'
            whiteSpace='nowrap'
            fontSize='xs'
          >
            {isToday(meeting?.start_at ?? 0)
              ? t('personRecentMeetingSummaries.today')
              : format(meeting?.start_at ?? 0, 'EEE, MMM dd')}
          </Text>
          <Text
            as='span'
            variant='body-reg-md'
            fontSize='xs'
            fontWeight={400}
            ml={2}
            color={card ? 'surface.onSurfaceVariant' : 'surface.outline'}
          >
            {card ? card?.headline : t('personRecentMeetingSummaries.notRecorded')}
          </Text>
        </HStack>
      </Box>
    </Stack>
  );
};

export default RecentMeetingSummaries;
