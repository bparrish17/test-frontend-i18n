import {
  Alert,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Skeleton,
  SkeletonText,
  Spacer,
  Stack,
  Text,
  Tooltip
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { useEffect } from 'react';
import { useStatsigClient } from '@statsig/react-bindings';

import { getLensIconComponent, userHasAccessToLens } from '@util/helpers';
import { InfoIcon, SFEllipsisIcon, SFLockIcon, SFPaperPlaneIcon } from '@assets/icons';
import { useUserStore } from '@store/app.store';
import {
  useBreakpoints,
  useFullCards,
  usePusherChannel,
  usePusherEvent,
  useSetDocumentTitle,
  useStyledToast
} from '@util/hooks';
import { useInsightWithFootnotes } from '@services/query-services/insights.query-service';
import { useInitiativeById } from '@services/query-services/initiatives.query-service';

import ColumnedLayout from '@layouts/columned.layout';
import NewInsightRightRail from '@components/lens/new-insight-right-rail.component';
import LensMeta from '@components/lens/lens-meta.component';
import LensInsightSection from '@components/lens/lens-insight-section.component';
import GenericInsightPanel from '@components/lens/generic-insight-panel.component';
import { useTranslation } from 'react-i18next';

export default function LensInsightPage() {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const toast = useStyledToast();
  const toastId = 'insight-generated-toast';
  const { insightId } = useParams();
  const { data: insight, refetch, isLoading } = useInsightWithFootnotes(insightId);
  const { data: lens } = useInitiativeById(insight?.initiative?.id, {
    enabled: !!insight?.initiative?.id
  });
  const { fullCards } = useFullCards(insight);
  const { checkGate } = useStatsigClient();
  const enableSharing = checkGate('insight-sharing');

  useSetDocumentTitle(`${insight?.initiative?.title} Lens Insight - FORA`);

  const sections = {
    intro: insight?.sections?.find((s) => s.type === 'intro'),
    mainContent: insight?.sections?.filter((s) => s.type === 'main_content'),
    conclusion: insight?.sections?.find((s) => s.type === 'conclusion')
  };

  const { isMobile } = useBreakpoints();

  useEffect(() => {
    if (user && insight) {
      const userHasAccess = user?.id === insight?.person.id || userHasAccessToLens(lens, user);

      if (insight?.initiative?.type === 'Lens' && !userHasAccess) {
        toast({
          title: t('lensInsightPage.youDoNotHave'),
          status: 'warning',
          duration: 9000,
          isClosable: true
        });
        navigate('/');
      }
    }
  }, [user, insight]);

  const { channel } = usePusherChannel(user?.id);
  usePusherEvent(channel, 'on_insight_generated', (insight) => {
    if (!toast.isActive(toastId) && insight?.id === insightId) {
      toast({
        id: toastId,
        duration: 6000,
        size: 'lg',
        position: 'bottom',
        title: t('lensInsightPage.thisArticleHasAn'),
        isClosable: true,
        actionText: 'Refresh',
        onActionClick: refetch
      });
    }
  });

  if (isMobile) {
    return (
      <MobileLensInsightPage
        insight={insight}
        lens={lens}
        isLoading={isLoading}
        sections={sections}
      />
    );
  }

  return (
    <ColumnedLayout
      rightRailContent={
        <NewInsightRightRail
          insight={insight}
          lens={lens}
        />
      }
    >
      {isLoading ? (
        <LensInsightSkeleton />
      ) : (
        <Stack
          p={11}
          gap={11}
        >
          <HStack
            justify='space-between'
            w='full'
          >
            <Text
              as='a'
              href='#source-1'
              color='brandPrimary.primary'
              variant='title-md'
              mb={-5}
              cursor='pointer'
              _hover={{ textDecoration: 'underline' }}
            >
              {lens?.title}
            </Text>
            {enableSharing && (
              <Button
                size='md'
                variant='reskinWhite'
                rounded='lg'
                pl={2.5}
                fontWeight={450}
                leftIcon={
                  <SFPaperPlaneIcon
                    boxSize={6}
                    color='brandPrimary.primary'
                  />
                }
              >
                {t('common.share')}
              </Button>
            )}
          </HStack>

          <Stack gap={6}>
            <Heading variant='display-sm'>{insight?.headline}</Heading>

            <Text
              color='surface.onSurface'
              variant='headline-lighter-md'
            >
              {insight?.subheadline}
            </Text>

            {insight?.updated_at && (
              <Text
                color='surface.onSurfaceVariant'
                variant='body-600-md'
                mb={2}
              >
                Last updated on {format(insight?.updated_at, 'ccc, MMM d, yyyy')}
              </Text>
            )}

            <Stack
              my={4}
              gap={6}
            >
              {insight?.sections?.[0] && (
                <LensInsightSection
                  section={insight.sections[0]}
                  insight={insight}
                />
              )}

              {insight?.sections?.slice(1).map((section, index) => {
                return (
                  <LensInsightSection
                    key={`${section?.title}-${index + 1}`}
                    section={section}
                    insight={insight}
                  />
                );
              })}
            </Stack>

            <Stack
              id='insight-sources'
              gap={8}
            >
              <Alert
                w='fit-content'
                display='flex'
                px={2}
                pr={4}
                py='14px'
                gap={3}
                bg='surface.containerLowest'
                borderRadius='lg'
              >
                <SFLockIcon boxSize={7} />
                <Text
                  variant='body-600-md'
                  color='brandPrimary.primary'
                >
                  {t('lensInsightPage.yourInformationIsSecure')}
                </Text>

                <Tooltip label={t('lensInsightPage.privateMeetingsAreOnly')}>
                  <Flex
                    as='span'
                    cursor='pointer'
                    alignItems='center'
                  >
                    <Icon
                      as={InfoIcon}
                      color='brandPrimary.primaryDimmer'
                      boxSize='21px'
                    />
                  </Flex>
                </Tooltip>
              </Alert>
              {insight?.sources?.length > 0 && (
                <GenericInsightPanel
                  items={insight?.sources}
                  fullCards={fullCards}
                  headerText='FORA cited these sources in the above article:'
                  useNumbering
                  showAnalyzeButton
                />
              )}
              {insight?.references?.length > 0 && (
                <GenericInsightPanel
                  items={insight?.references}
                  fullCards={fullCards}
                  headerText='FORA consulted these materials but did not directly cite them:'
                />
              )}
            </Stack>
          </Stack>
        </Stack>
      )}
    </ColumnedLayout>
  );
}

function MobileLensInsightPage({ insight, lens, isLoading, sections }) {
  const { t } = useTranslation();

  const intro = sections?.intro;
  const mainContent = sections?.mainContent;
  const conclusion = sections?.conclusion;
  return (
    <Stack
      p={6}
      gap={6}
    >
      {isLoading ? (
        <LensInsightSkeleton />
      ) : (
        <Stack gap={6}>
          <HStack color={lens?.color ?? 'brandPrimary.primary'}>
            <Icon
              as={getLensIconComponent(lens, 'lens')}
              boxSize={8}
            />
            <Text
              as='span'
              fontWeight={600}
              letterSpacing='tight'
            >
              {lens?.title}
            </Text>
            <Spacer />
            <IconButton
              icon={<SFEllipsisIcon />}
              aria-label={t('lensInsightPage.insightMenuAriaLabel')}
              variant='ghost'
              color='brandPrimary.onContainer'
            />
          </HStack>
          <Stack gap={6}>
            <Heading
              size='2xl'
              letterSpacing='tight'
              lineHeight={1.2}
            >
              {insight?.headline}
            </Heading>
            <Text
              fontSize='lg'
              minH={7}
            >
              <Text
                as='span'
                variant='brand-label'
              >
                {format(insight?.updated_at, 'ccc, LLL d')}
              </Text>
              <Text
                mx={2}
                as='span'
                color='surface.outline'
              >
                •
              </Text>
              <Text
                as='span'
                color='surface.onSurfaceVariant'
                fontWeight={400}
              >
                {insight.subheadline}
              </Text>
            </Text>

            {intro?.content && (
              <Text
                as='span'
                color='surface.onSurfaceVariant'
                fontSize='lg'
                lineHeight={8}
              >
                {intro?.content}
              </Text>
            )}
            {mainContent?.map((section, index) => (
              <LensInsightSection
                key={`${section?.title}-${index}`}
                section={section}
                insight={insight}
              />
            ))}
            <LensInsightSection
              section={{ ...conclusion, title: t('lensInsightPage.conclusion') }}
              insight={insight}
            />
          </Stack>
          <LensMeta lens={lens} />
          <NewInsightRightRail
            insight={insight}
            lens={lens}
          />
          <Text
            fontWeight={600}
            my={5}
          >
            {t('lensInsightPage.priorUpdates', { title: insight?.initiative?.title })}
          </Text>
        </Stack>
      )}
    </Stack>
  );
}

function LensInsightSkeleton() {
  return (
    <Stack
      p={11}
      gap={11}
    >
      <Skeleton
        w='30%'
        h='18px'
      />
      <Skeleton
        w='70%'
        h={5}
      />
      <Skeleton
        w='45%'
        h={3}
      />
      <SkeletonText
        w='80%'
        noOfLines={4}
        skeletonHeight={3}
      />
      <Skeleton
        w='45%'
        h={2}
      />
      <SkeletonText
        w='80%'
        noOfLines={4}
        skeletonHeight={3}
      />
    </Stack>
  );
}
