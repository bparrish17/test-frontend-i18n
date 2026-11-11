import {
  Box,
  Text,
  Button,
  IconButton,
  HStack,
  Switch,
  useDisclosure,
  Stack
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';

import { CloseIcon } from '@assets/icons';
import { convertRuleFormValuesToRuleset } from '@util/helpers';
import FocusRule from '@components/focus/focus-rule.component';
import FocusFormField from '@components/focus/focus-form-field.component';
import ControlledTooltip from '@components/general/controlled-tooltip.component';
import StyledModal from '@components/general/modals/styled-modal.component';
import StackRadio from '@components/general/form/radio.component';
import FocusRuleForm from './focus-rule-form.component';
import { useTranslation } from 'react-i18next';

const defaultValues = {
  titles: [{ value: '' }],
  domains: [{ invitees: 1, value: '' }],
  only_domains: [{ value: '' }],
  not_domains: [{ invitees: 1, value: '' }],
  never_domains: [{ value: '' }],
  emails: [{ value: '' }],
  organizers: [{ value: '' }]
};

export default function FocusEditRules({
  isAddToMeetingsChecked,
  handleAddToMeetingCheck,
  isSensitiveChecked,
  handleIsSensitiveCheck,
  rulesets,
  addRulesets,
  removeRuleset,
  visibility,
  handleVisibilityChange
}) {
  const { t } = useTranslation();

  const disclosure = useDisclosure();
  const ruleForm = useForm({ defaultValues, reValidateMode: 'onBlur' });
  const visibilityForm = useForm({ values: { visibility }, reValidateMode: 'onBlur' });

  const addRule = (formValues) => {
    const newRulesets = convertRuleFormValuesToRuleset(formValues);
    addRulesets(newRulesets);
    ruleForm.reset(defaultValues);
    disclosure.onClose();
  };

  const visibilityOptions = [
    { value: 'Owner', label: t('focusEditRules.justMe') },
    { value: 'Collaborators', label: t('focusEditRules.anyoneFollowingThisFocus') },
    { value: 'Tenant', label: t('focusEditRules.anyoneAtTheCompany') }
  ];

  return (
    <>
      <FocusFormField label={t('focusEditRules.automation')}>
        <HStack
          gap={3}
          align='flex-start'
        >
          <Switch
            mt={1}
            isChecked={rulesets?.length && isAddToMeetingsChecked}
            onChange={handleAddToMeetingCheck}
            disabled={rulesets?.length === 0}
          />
          <Box mb={0}>
            <Text
              fontWeight={600}
              mb={-1}
            >
              {t('focusEditRules.automaticallyAddForaTo')}
            </Text>
            <Text
              as='i'
              fontSize='xs'
            >
              {t('focusEditRules.requiresAtLeastOne')}
            </Text>
          </Box>
        </HStack>

        <HStack gap={3}>
          <Switch
            isChecked={isSensitiveChecked}
            onChange={handleIsSensitiveCheck}
          />
          <Text fontWeight={600}>
            Mark all meetings assigned to this category as{' '}
            <ControlledTooltip
              label={
                <Text>
                  <Text as='b'>{t('focusEditRules.sensitive')}</Text>
                  {t('focusEditRules.meetingsWillOnlyGenerate')}
                </Text>
              }
            >
              {(tooltipProps) => (
                <Text
                  as='b'
                  textDecor='underline'
                  {...tooltipProps}
                >
                  {t('focusEditRules.sensitive2')}
                </Text>
              )}
            </ControlledTooltip>
          </Text>
        </HStack>
      </FocusFormField>

      <FocusFormField label={t('focusEditRules.visibility')}>
        <Stack gap={3}>
          <StackRadio
            name='visibility'
            width='100%'
            control={visibilityForm?.control}
            options={visibilityOptions}
          />
          <Button
            type='submit'
            form='visibility'
            variant='reskinWhite'
            onClick={visibilityForm.handleSubmit(({ visibility }) => {
              handleVisibilityChange(visibility);
            })}
          >
            {t('focusEditRules.setVisibility')}
          </Button>
        </Stack>
      </FocusFormField>

      <FocusFormField label={t('focusEditRules.rules')}>
        {rulesets?.length > 0 ? (
          rulesets.map((ruleset, i) => (
            <FocusRule
              key={`rule-${ruleset?.type}-${ruleset?.value}`}
              ruleset={ruleset}
            >
              <IconButton
                icon={<CloseIcon fontSize='18px' />}
                isRound
                variant='ghost'
                size='sm'
                onClick={() => removeRuleset(i, ruleset)}
              />
            </FocusRule>
          ))
        ) : (
          <Text fontSize='sm'>{t('focusEditRules.noAutomationRulesCreated')}</Text>
        )}
        <StyledModal
          disclosure={{
            ...disclosure,
            onOpen: () => {
              ruleForm.reset(defaultValues);
              disclosure.onOpen();
            }
          }}
          title={t('focusEditRules.createAnAutomationRule')}
          modalProps={{ scrollBehavior: 'inside' }}
          modalContentProps={{ minH: { base: '660px', '2xl': '95vh' } }}
          openButton={
            <Button variant='reskinWhite'>{t('focusEditRules.addNewAutomationRule')}</Button>
          }
          buttonText={t('focusEditRules.createRule')}
          buttonProps={{ type: 'submit', form: 'add-rules-form' }}
        >
          <Stack
            px={8}
            pb={8}
          >
            <FocusRuleForm form={ruleForm} />
            <Button
              type='submit'
              form='add-rules-form'
              variant='reskinPrimary'
              onClick={ruleForm.handleSubmit((values) => {
                ruleForm.reset(defaultValues);
                addRule(values);
              })}
            >
              {t('focusEditRules.createRule')}
            </Button>
          </Stack>
        </StyledModal>
      </FocusFormField>
    </>
  );
}
