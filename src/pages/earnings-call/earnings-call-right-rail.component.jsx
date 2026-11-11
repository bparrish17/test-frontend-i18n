import { Link as ReactRouterLink } from 'react-router-dom';
import { Box, Stack, Text } from '@chakra-ui/react';
import { first, get, keyBy } from 'lodash-es';
import { Suspense } from 'react';

import { useApolloOrganizationsByDomains } from '@services/query-services/apollo.query-service';
import { useCards } from '@services/query-services/cards.query-service';
import { useUserStore } from '@store/app.store';
import { capitalizeFullString, lazyWithRetry } from '@util/helpers';
import { SFDollarSignCircleIcon } from '@assets/icons';
import AvatarPreview from '@components/general/avatar-preview/avatar-preview.component';
import TableOfContents from '@components/general/table-of-contents.component';
import GenericInsightPanel from '@components/lens/generic-insight-panel.component';

const EarningsCallChat = lazyWithRetry(() =>
  import('@pages/earnings-call/earnings-call-chat.component')
);

const apolloLinkProps = (apolloOrg) => ({
  as: ReactRouterLink,
  to: `/organizations/${apolloOrg?.id}`,
  state: apolloOrg,
  _hover: { textDecor: 'underline' },
  color: 'brandPrimary.primary'
});

export default function EarningsCallRightRail({
  bot,
  closestRefIndex,
  sections,
  onSectionClick,
  askEnabled = true
}) {
  const botEarningsCall = bot?.earnings_call;
  const {
    company_name: companyName,
    domain,
    symbol = 'ZM',
    released_at: releasedAt
  } = botEarningsCall;
  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;

  const { data: apolloOrg } = useApolloOrganizationsByDomains([domain], {
    enabled: !!domain,
    select: first
  });

  const { data: priorEarningsCallCards } = useCards(
    {
      person_id: user?.id,
      source: 'Bot',
      sub_sources: ['Earnings_Call'],
      tags: [symbol],
      sort: 'created_at',
      asc: true
    },
    {
      select: (cards) => {
        return cards?.filter(
          (card) => get(card, ['source_data', 'earnings_call', 'released_at']) < releasedAt
        );
      }
    }
  );

  const viewMoreUrl = `/summaries?contentTypeSubSources=Earnings_Call&keyword=${symbol}`;

  return (
    <Stack
      px={11}
      pt={28}
      gap={11}
    >
      <EarningsCallRightRailSection sectionTitle='Table of Contents'>
        <TableOfContents
          sections={sections}
          closestRefIndex={closestRefIndex}
          onSectionClick={onSectionClick}
        />
      </EarningsCallRightRailSection>
      <EarningsCallRightRailSection
        sectionTitle='Organization'
        gap={3}
      >
        <AvatarPreview
          name={apolloOrg?.name ?? companyName}
          title={capitalizeFullString(apolloOrg?.industry)}
          photoUrl={apolloOrg?.logo_url}
          gap='15px'
          titleProps={{ variant: 'label-500-lg' }}
          avatarProps={{ mt: '5px', borderRadius: 'lg' }}
          nameProps={{
            fontSize: 'md',
            fontWeight: 500,
            lineHeight: 1.5,
            ...(apolloOrg?.id ? apolloLinkProps(apolloOrg) : { color: 'surface.onSurface' })
          }}
        />
      </EarningsCallRightRailSection>
      <EarningsCallRightRailSection sectionTitle={`PRIOR EARNINGS CALLS (${symbol})`}>
        <PriorEarningsCallsSection
          displayCalls={priorEarningsCallCards}
          viewMoreUrl={viewMoreUrl}
        />
      </EarningsCallRightRailSection>
      {!isGuest && askEnabled && (
        <Suspense fallback={null}>
          <EarningsCallChat bot={bot} />
        </Suspense>
      )}
    </Stack>
  );
}

function PriorEarningsCallsSection({ displayCalls, viewMoreUrl }) {
  return (
    <Box
      mb={6}
      ml={7}
      mt={-9}
    >
      {!displayCalls || displayCalls.length === 0 ? (
        <Text
          color='surface.onSurfaceVariant'
          variant='body-600-md'
          mt={10}
        >
          No prior earnings calls available
        </Text>
      ) : (
        <Stack spacing={4}>
          <GenericInsightPanel
            items={displayCalls}
            fullCards={keyBy(displayCalls || [], 'id')}
            customIcon={
              <SFDollarSignCircleIcon
                boxSize='18px'
                color='brandPrimary.primary'
                p='1px'
              />
            }
            titleNoOfLines={3}
            forceHideShowMore
            shouldLinkToSource
            showDate={false}
          />
          {displayCalls.length > 3 && (
            <Text
              variant='body-600-md'
              ml={-6}
              as={ReactRouterLink}
              to={viewMoreUrl}
              color='brandPrimary.primary'
              cursor='pointer'
              fontSize='sm'
              fontWeight={500}
              _hover={{ textDecoration: 'underline' }}
            >
              View All
            </Text>
          )}
        </Stack>
      )}
    </Box>
  );
}

function EarningsCallRightRailSection({ sectionTitle, children, ...props }) {
  return (
    <Stack
      gap={6}
      {...props}
    >
      <Text variant='content-section-header'>{sectionTitle}</Text>
      {children}
    </Stack>
  );
}
