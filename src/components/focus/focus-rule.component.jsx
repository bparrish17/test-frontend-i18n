import { Text, Stack, HStack, Spacer } from '@chakra-ui/react';
import { getRuleTypeLabel } from '@util/helpers';
import pluralize from 'pluralize';
import { useTranslation } from 'react-i18next';

export default function FocusRule({ ruleset, children }) {
  const { t } = useTranslation();

  const { value, type, required, min_occurrences: invitees } = ruleset;
  const ruleTypeLabel = getRuleTypeLabel(type);
  const isAlwaysRequired = type === 'never_domains' || type === 'only_domains';

  return (
    <HStack>
      <Stack gap={2}>
        <Text variant='body-700-md'>{value}</Text>
        <HStack gap={5}>
          <Text
            fontSize='sm'
            color='surface.onSurfaceVariant'
          >
            {ruleTypeLabel}
          </Text>
          <Text
            fontSize='sm'
            color='surface.onSurfaceVariant'
          >
            {required || isAlwaysRequired ? t('focusRule.required') : t('focusRule.notRequired')}
          </Text>
          {invitees && (
            <Text
              fontSize='sm'
              color='surface.onSurfaceVariant'
            >
              {invitees ? `${invitees} ${pluralize('Invitee', invitees)}` : ''}
            </Text>
          )}
        </HStack>
      </Stack>
      <Spacer />
      {children}
    </HStack>
  );
}
