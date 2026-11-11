import {
  Text,
  SimpleGrid,
  Spacer,
  Stack,
  Flex,
  HStack,
  Button,
  Icon,
  useDisclosure,
  Divider,
  Heading
} from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import { keyBy, map, partition, uniqueId } from 'lodash-es';
import { useEffect, useState, useMemo } from 'react';

import { useUserStore } from '@store/app.store';
import { useSetDocumentTitle } from '@util/hooks';
import { getLensIconComponent, isUserACollaborator } from '@util/helpers';
import { useInitiatives } from '@services/query-services/initiatives.query-service';
import { useInsights } from '@services/query-services/insights.query-service';
import { SFPlusIcon } from '@assets/icons';
import { LENS_TEMPLATES } from '@util/constants';

import LensCard from '@components/lens/lens-card.component';
import StyledModal from '@components/general/modals/styled-modal.component';
import LensTemplateCard from '@components/lens/lens-template-card.component';
import CreateLensSuccessModal from '@components/create-lens/create-lens-success-modal.component';
import LinkRadio from '@components/general/form/link-radio.component';
import StyledLink from '@components/general/styled-link.component';
import { useTranslation } from 'react-i18next';

const activeOrInactiveOptions = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
];

const activeOrInactiveFilters = {
  active: {
    has_archived_at: false
  },
  inactive: {
    has_archived_at: true
  }
};

export default function LensesPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Lenses - FORA');
  const user = useUserStore((state) => state.user);
  const { state: locationState } = useLocation();
  const [currentLensActivityView, setCurrentLensActivityView] = useState('active');
  const lensSearchBody = {
    type: 'Lens',
    pageSize: 500,
    has_tags: false,
    ...activeOrInactiveFilters[currentLensActivityView]
  };
  const { data: initiatives } = useInitiatives(lensSearchBody, { refetchOnMount: true });
  const allLenses = useMemo(
    () => initiatives?.filter((i) => !i?.tags?.includes('template')),
    [initiatives]
  );
  const [userLenses, organizationLenses] = partition(
    allLenses ?? [],
    (l) => l.creator?.id === user?.id
  );
  const { data: insightsByLens, isSuccess: isInsightsFetched } = useInsights(
    {
      initiative_type: 'Lens',
      initiative_ids: map(allLenses, 'id'),
      person_id: user?.id
    },
    {
      enabled: allLenses?.length > 0,
      initialData: [],
      select: (insights) => keyBy(insights, 'initiative.id')
    }
  );

  const disclosure = useDisclosure();
  const { isOpen: isSuccessModalOpen, onOpen, onClose: onSuccessModalClose } = useDisclosure();
  useEffect(() => {
    if (locationState?.isLensCreated) {
      onOpen();
    }
  }, [locationState]);

  // plebs don't get to create lenses
  const isDisabled = ['Associate', 'Full'].includes(user?.type);

  return (
    <Stack
      p={11}
      gap={11}
    >
      <HStack gap={4}>
        {/* reskin todo: add 'context-header' variant to text for all of these */}
        <Text
          variant='page-header'
          alignSelf='flex-end'
        >
          {t('lensesPage.lenses')}
        </Text>
        <Spacer />
        <LinkRadio
          name='showActiveOrInactiveLensesRadio'
          options={activeOrInactiveOptions}
          value={currentLensActivityView}
          onChange={setCurrentLensActivityView}
        />
        <LensTemplateSelectionModal
          disclosure={disclosure}
          isDisabled={isDisabled}
        />
      </HStack>
      {userLenses?.length && isInsightsFetched && (
        <>
          <Divider />
          <Heading size='sm'>{t('lensesPage.yourLenses')}</Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2, xl: 4 }}
            spacing={10}
          >
            {userLenses.map((lens) => (
              <LensCard
                key={lens?.id}
                lens={lens}
                insight={insightsByLens[lens?.id]}
                enableMenu
                optimisticUpdateConfig={{
                  enabled: true,
                  type: 'search',
                  queryKeyToUpdate: lensSearchBody
                }}
              />
            ))}
          </SimpleGrid>
        </>
      )}
      {organizationLenses?.length && isInsightsFetched && (
        <OrganizationLenses
          organizationLenses={organizationLenses}
          insightsByLens={insightsByLens}
          lensSearchBody={lensSearchBody}
        />
      )}

      <CreateLensSuccessModal
        isOpen={isSuccessModalOpen}
        onClose={onSuccessModalClose}
        lens={locationState?.lens}
      />
    </Stack>
  );
}

function OrganizationLenses({ organizationLenses, insightsByLens, lensSearchBody }) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const [followingTab, setFollowingTab] = useState('following');
  const showFollowingOptions = [
    { value: 'following', label: t('lensesPage.following') },
    { value: 'not-following', label: t('lensesPage.notFollowing') }
  ];
  const filterOrganizationLensesByFollowingStatus = (lens) => {
    return followingTab === 'following'
      ? isUserACollaborator(lens, user)
      : !isUserACollaborator(lens, user);
  };

  const orgHasLenses = organizationLenses?.length > 0;
  const filteredLenses = organizationLenses?.filter(filterOrganizationLensesByFollowingStatus);

  return (
    <>
      <Divider />
      <Flex justifyContent='space-between'>
        <Heading size='sm'>{t('lensesPage.yourOrganizationSLenses')}</Heading>
        {orgHasLenses && (
          <LinkRadio
            name='showFollowingOrNotRadio'
            options={showFollowingOptions}
            value={followingTab}
            onChange={setFollowingTab}
          />
        )}
      </Flex>
      {orgHasLenses && filteredLenses?.length > 0 ? (
        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 4 }}
          spacing={10}
        >
          {filteredLenses?.map((lens) => (
            <LensCard
              key={lens?.id}
              lens={lens}
              insight={insightsByLens[lens?.id]}
              enableMenu
              // enableNavigation={false}
              optimisticUpdateConfig={{
                enabled: true,
                type: 'search',
                queryKeyToUpdate: lensSearchBody
              }}
            />
          ))}
        </SimpleGrid>
      ) : (
        <EmptyState
          orgHasLenses={orgHasLenses}
          followingTab={followingTab}
          setFollowingTab={setFollowingTab}
        />
      )}
    </>
  );
}

function EmptyState({ orgHasLenses, followingTab, setFollowingTab }) {
  const { t } = useTranslation();

  if (!orgHasLenses) {
    return (
      <Text>
        Your organization does not have any lenses.&nbsp;
        <StyledLink to='/lenses/create'>{t('lensesPage.createANewOne')}</StyledLink> to begin.
      </Text>
    );
  } else if (followingTab === 'following') {
    return (
      <Text>
        You are not following any lenses. Click&nbsp;
        <StyledLink onClick={() => setFollowingTab('not-following')}>
          {t('lensesPage.here')}
        </StyledLink>{' '}
        to see if there are any you can follow.
      </Text>
    );
  } else if (followingTab === 'not-following') {
    return (
      <Text>
        You are currently following all lenses in your organization. Click&nbsp;
        <StyledLink onClick={() => setFollowingTab('following')}>
          {t('lensesPage.here')}
        </StyledLink>{' '}
        to see them.
      </Text>
    );
  }
}

function LensTemplateSelectionModal({ disclosure, isDisabled }) {
  const { t } = useTranslation();

  return (
    <StyledModal
      disclosure={disclosure}
      title={
        <HStack>
          <Icon
            as={getLensIconComponent('lens')}
            color='white'
            boxSize={8}
          />
          <Text>{t('lensesPage.createALens')}</Text>
        </HStack>
      }
      modalProps={{ scrollBehavior: 'inside' }}
      modalContentProps={{ minW: { '2xl': '1102px' }, maxH: '80%' }}
      modalBodyProps={{ p: { base: 4, lg: 11 } }}
      modalCloseButtonProps={{ color: 'white', mt: 1, rounded: 'full' }}
      openButton={
        <Button
          size='reskinMd'
          variant='reskinPrimary'
          iconSpacing={1}
          rightIcon={<SFPlusIcon style={{ paddingRight: 0 }} />}
          isDisabled={isDisabled}
        >
          {t('lensesPage.newLens')}
        </Button>
      }
      // buttonText="Create Rule"
      // buttonProps={{ type: 'submit', form: 'add-rules-form' }}
    >
      <Stack gap={6}>
        <Text
          fontSize='lg'
          color='surface.onSurfaceVariant'
          lineHeight={1.75}
          fontWeight={500}
        >
          {t('lensesPage.whatKindOfLens')}
        </Text>
        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 3 }}
          spacing={{ base: 8, xl: 11 }}
        >
          {/* reskin todo: add rest of templates here, for now just start blank */}
          {LENS_TEMPLATES.map((lens) => (
            <LensTemplateCard
              key={uniqueId()}
              lens={lens}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </StyledModal>
  );
}
