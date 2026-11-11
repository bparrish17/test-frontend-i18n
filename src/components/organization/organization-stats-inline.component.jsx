import { Text } from '@chakra-ui/react';
import { pluralized } from '@util/helpers';
import { useTranslation } from 'react-i18next';

export default function OrganizationStatsInline({
  totalRecordedMeetings,
  totalTime,
  orgName,
  numOfDays,
  isExternal
}) {
  const { t } = useTranslation();

  const isDurationLastMet = true; // currently duration in org stats means last met

  return (
    <Text
      color='surface.onSurfaceVariant'
      as='span'
      fontWeight={500}
      data-testid='organization-stats-inline'
    >
      <Text
        as='span'
        fontWeight={600}
        color='surface.onSurface'
      >
        {orgName}
      </Text>
      <Text as='span'>{t('organizationStatsInline.hasHad')}</Text>
      <Text
        as='span'
        fontWeight={500}
        color='etc.blackFixed'
      >
        {pluralized('recorded meeting', totalRecordedMeetings)}&nbsp;
      </Text>
      <Text as='span'>
        {isExternal && t('organizationStatsInline.withYourCompany')} in the past {numOfDays} days.
        You {isDurationLastMet ? `last met ${totalTime} ago` : `for a total of ${totalTime}`}.
      </Text>
    </Text>
  );
}
