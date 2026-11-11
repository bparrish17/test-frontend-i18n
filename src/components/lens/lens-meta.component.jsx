import React from 'react';
import { Text } from '@chakra-ui/react';
import StyledLink from '@components/general/styled-link.component';
import { useUserStore } from '@store/app.store';
import { usePersonById } from '@services/query-services/people.query-service';
import { useTranslation } from 'react-i18next';

function LensMeta({ lens }) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state?.user);
  const { data: lensCreator } = usePersonById(lens?.creator?.id, { enabled: !!lens?.creator?.id });

  return (
    <Text
      color='surface.onSurfaceVariant'
      lineHeight={1.5}
    >
      <Text as='span'>{t('lensMeta.thisPageOfInsights')}</Text>
      <StyledLink to={`/person?email=${user?.email}&id=${user?.id}`}>{user?.name}</StyledLink>
      <Text as='span'>
        {t('lensMeta.accordingToSPersonalization', { first_name: user?.first_name })}
      </Text>
      <StyledLink to={`/lenses/${lens?.id}/edit`}>{lens?.title}</StyledLink>
      <Text as='span'>{t('lensMeta.wasCreatedBy')}</Text>
      <StyledLink to={`/person?email=${lensCreator?.email}&id=${lensCreator?.id}`}>
        {lensCreator?.name}
      </StyledLink>
      .
    </Text>
  );
}

export default LensMeta;
