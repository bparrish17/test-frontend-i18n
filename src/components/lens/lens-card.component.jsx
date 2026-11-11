import { Avatar, HStack, Text, Flex, Icon, Stack, Heading, LinkBox } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';

import { getLensIconComponent } from '@util/helpers';
import { useStyledToast } from '@util/hooks';
import { useLatestInsight } from '@services/query-services/insights.query-service';
import LensCardMenu from '@components/lens/lens-card-menu.component';
import LensCardLoading from '@components/lens/lens-card-loading.component';
import { useTranslation } from 'react-i18next';

export default function LensCard({
  lens,
  enableMenu,
  optimisticUpdateConfig,
  enableNavigation = true
}) {
  const { t } = useTranslation();

  const toast = useStyledToast();

  const {
    data: insight,
    isLoading: isInsightLoading,
    isFetched: isInsightFetched
  } = useLatestInsight(lens?.id, 'Lens');

  const onHeadingClick = () => {
    if (!insight && isInsightFetched) {
      toast({
        title: t('lensCard.youDoNotCurrently'),
        status: 'warning',
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <Flex
      direction='column'
      layerStyle='section-card'
      height='100%'
    >
      {isInsightLoading ? (
        <LensCardLoading />
      ) : (
        <LinkBox
          display='flex'
          flexDir='column'
          h='full'
        >
          <Stack
            justifyContent='space-between'
            p={3}
            flex={1}
          >
            <HStack justifyContent='space-between'>
              <Icon
                as={getLensIconComponent(lens)}
                color={lens.color || 'brandPrimary.onContainer'}
                boxSize={6}
                my={1.5}
              />
              {enableMenu && (
                <LensCardMenu
                  lens={lens}
                  optimisticUpdateConfig={optimisticUpdateConfig}
                  insight={insight}
                />
              )}
            </HStack>
            <Heading
              as={enableNavigation ? ReactRouterLink : Heading}
              cursor='pointer'
              to={insight ? `/insights/${insight?.id}` : null}
              fontWeight={700}
              fontSize='sm'
              onClick={onHeadingClick}
              size='sm'
            >
              {lens?.title ?? t('lensCard.untitledLens')}
            </Heading>
            <Text
              fontSize='sm'
              fontWeight={500}
            >
              {lens?.visibility ?? t('lensCard.unset')}
            </Text>
            <Text
              color='surface.onSurfaceVariant'
              fontSize='sm'
              lineHeight='21px'
              noOfLines={5}
              textOverflow='ellipsis'
              minH={105}
            >
              {lens?.lens_config?.match_prompt}
            </Text>
          </Stack>

          <HStack
            borderTop='reskin'
            px={3}
            py={4}
          >
            <Avatar
              key={`${lens?.creator?.name}-avatar`}
              name={lens?.creator?.name}
              size='xs'
            />
            <Text
              fontSize='sm'
              color='brandPrimary.primary'
              fontWeight={500}
            >
              {lens?.creator?.name}
            </Text>
          </HStack>
        </LinkBox>
      )}
    </Flex>
  );
}
