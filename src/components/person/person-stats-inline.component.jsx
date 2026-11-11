import { Image, Text } from '@chakra-ui/react';
import StyledLink from '@components/general/styled-link.component';
import { buildOrgLink, pluralized } from '@util/helpers';
import { useTranslation } from 'react-i18next';

const PersonStatsInline = ({
  firstName,
  isExternal,
  totalRecordedMeetings,
  totalTime,
  orgId,
  orgName,
  orgDomain,
  orgLogoUrl,
  numOfDays
}) => {
  const { t } = useTranslation();

  return (
    <Text
      data-testid='person-stats-inline'
      color='surface.onSurfaceVariant'
      as='span'
    >
      <Text
        as='span'
        fontWeight={600}
        color='surface.onSurface'
      >
        {firstName}
      </Text>
      {orgDomain && (
        <>
          <Text as='span'> {t('personStatsInline.from')} </Text>
          <StyledLink
            to={buildOrgLink({ id: orgId, domain: orgDomain })}
            mr={0.5}
          >
            {orgLogoUrl && (
              <Image
                display='inline'
                mb={-0.5}
                mx={1}
                boxSize={4}
                src={orgLogoUrl}
              />
            )}
            <Text as='span'>{orgName ?? orgDomain}</Text>
          </StyledLink>
        </>
      )}
      <Text as='span'>{t('personStatsInline.hasHad')}</Text>
      <Text
        as='span'
        fontWeight={500}
        color='etc.blackFixed'
      >
        {pluralized('recorded meeting', totalRecordedMeetings)}&nbsp;
      </Text>
      <Text as='span'>
        {isExternal && t('personStatsInline.withYourCompany')} in the past {numOfDays ?? 90} days,
        meeting for a total of {totalTime}.
      </Text>
    </Text>
  );
};

export default PersonStatsInline;
