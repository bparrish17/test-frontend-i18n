import React from 'react';
import { HStack, Icon, Spacer, Stack, Text } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { getLensIconComponent } from '@util/helpers';
import LensCardMenu from '@components/lens/lens-card-menu.component.jsx';
import { useTranslation } from 'react-i18next';

export default function AboutThisLens({ lens }) {
  const { t } = useTranslation();

  const LensIcon = getLensIconComponent(lens);
  const creatorName = lens?.creator?.name || 'John Shine';
  const creatorId = lens?.creator?.id;

  return (
    <Stack
      layerStyle='section-card'
      p={6}
      gap={4}
    >
      <HStack gap={3}>
        <Icon
          as={LensIcon}
          color={lens?.color || 'brandPrimary.primary'}
          boxSize={7}
        />
        <Text
          as={ReactRouterLink}
          to={`/lenses/${lens?.id}/edit`}
          variant='title-md'
          color='inherit'
          _hover={{ textDecoration: 'none' }}
        >
          {lens?.title || t('aboutThisLens.competitiveIntelligence')}
        </Text>
        <Spacer />
        <LensCardMenu
          lens={lens}
          optimisticUpdateConfig={{ enabled: true, type: 'id' }}
        />
      </HStack>
      <Text
        color='surface.onSurfaceVariant'
        variant='body-500-md'
        noOfLines={5}
        textOverflow='ellipsis'
      >
        {lens?.understanding || ''}
      </Text>
      <Text
        variant='body-600-sm'
        color='surface.onSurfaceVariant'
      >
        Created by{' '}
        {creatorId ? (
          <Text
            to={`/person?id=${creatorId}`}
            as={ReactRouterLink}
            color='brandPrimary.primary'
          >
            {creatorName}
          </Text>
        ) : (
          creatorName
        )}
      </Text>
    </Stack>
  );
}
