import { Stack, Text, MenuList } from '@chakra-ui/react';

import ViewsShareCard from '@components/privacy/views-share-card.component';
import { viewsAndViewers } from '@util/helpers/privacy.helpers';
import { useTranslation } from 'react-i18next';

export default function ViewsMenuList({ views, meeting }) {
  const { t } = useTranslation();

  const sharedEmails = meeting?.shares?.map((share) => share?.email) || [];
  const appViews = viewsAndViewers(views, sharedEmails);
  const sharedViews = viewsAndViewers(views, sharedEmails, true);

  // fake these if it's the first user
  const totalViews = appViews?.viewsCount || 1;
  const nonSharedViewers = appViews?.viewersCount || 1;
  const sharedViewersCount = sharedViews?.viewersCount || 0;

  return (
    <MenuList
      p={0}
      w='full'
      maxW='350px'
      placement='bottom-start'
    >
      <Stack gap={0}>
        <Stack p={3}>
          <Text
            variant='content-section-header'
            color='surface.onSurfaceVariant'
            fontSize='xs'
            fontWeight={500}
          >
            {t('viewsMenuList.views')}
          </Text>
          <Text
            color='surface.onSurfaceVariant'
            fontSize='xs'
            fontWeight={400}
          >
            {totalViews} {totalViews === 1 ? t('viewsMenuList.view') : t('viewsMenuList.views2')}{' '}
            from {nonSharedViewers}{' '}
            {nonSharedViewers === 1 ? t('viewsMenuList.person') : t('viewsMenuList.people')} with
            org access
          </Text>
          <Text
            color='surface.onSurfaceVariant'
            fontSize='xs'
            fontWeight={400}
            hidden={!sharedViewersCount}
          >
            {sharedViews.viewsCount}{' '}
            {sharedViews.viewsCount === 1 ? t('viewsMenuList.view') : t('viewsMenuList.views2')}{' '}
            from {sharedViewersCount}{' '}
            {sharedViewersCount === 1 ? t('viewsMenuList.person') : t('viewsMenuList.people')} with
            sharing access
          </Text>
        </Stack>
      </Stack>
      <Text
        variant='content-section-header'
        color='surface.onSurfaceVariant'
        fontSize='xs'
        fontWeight={500}
        p={3}
        hidden={!sharedViewersCount}
      >
        {t('viewsMenuList.recentViewsFromSharing')}
      </Text>
      <Stack
        p={2}
        ml={3}
        mr={3}
        mb={3}
        rounded='md'
        bgColor='surface.containerLow'
        hidden={!sharedViewersCount}
      >
        {sharedViews?.views?.map((view, index) => (
          <ViewsShareCard
            view={view}
            key={index}
          />
        ))}
      </Stack>
    </MenuList>
  );
}
