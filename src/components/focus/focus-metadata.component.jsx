import { HStack, Text } from '@chakra-ui/react';
import { formatTimeDistance } from '@util/helpers';
import { omit } from 'lodash-es';
import { useTranslation } from 'react-i18next';

function getRulesCount(matchRules) {
  if (!matchRules) {
    return 0;
  }

  const rules = omit(matchRules, ['schedule']);
  const rulesArrays = Object.values(rules);

  return rulesArrays.reduce((acc, curr) => acc + curr.length, 0);
}

export default function FocusMetadata({ focus }) {
  const { t } = useTranslation();

  const followersCount = focus?.collaborators?.length ?? 0;
  const rulesCount = getRulesCount(focus?.match_rules);
  const color = focus?.archived_at ? 'surface.outline' : 'surface.onSurface';

  return (
    <HStack
      gap={3}
      alignItems='center'
      fontSize='sm'
      fontWeight={500}
    >
      <Text color={color}>{t('focusMetadata.followers', { followersCount })}</Text>
      <Text color={color}>{t('focusMetadata.rules', { rulesCount })}</Text>
      <Text
        color={color}
        fontWeight={400}
      >
        Updated {formatTimeDistance(focus?.updated_at, true)}
      </Text>
    </HStack>
  );
}
