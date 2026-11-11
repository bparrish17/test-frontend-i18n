import {
  Flex,
  Text,
  Input,
  Box,
  InputGroup,
  Button,
  Stack,
  HStack,
  Switch,
  InputLeftAddon,
  Spacer,
  Tooltip
} from '@chakra-ui/react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { isEmail, isURL } from 'validator';

import { CloseIcon } from '@assets/icons';
import { getRuleTypeLabel } from '@util/helpers';
import StackRadio from '@components/general/form/radio.component';
import { useTranslation } from 'react-i18next';

const addOnProps = {
  h: 'inherit',
  bgColor: 'surface.containerHigh',
  border: 'reskin',
  color: 'surface.onSurfaceVariant',
  borderTopLeftRadius: 'lg',
  borderBottomLeftRadius: 'lg'
};

export default function FocusRuleForm({ form }) {
  const { t } = useTranslation();

  const { control, formState, register } = form;
  const titleFieldArray = useFieldArray({ control, name: 'titles' });
  const domainFieldArray = useFieldArray({ control, name: 'domains' });
  const onlyDomainFieldArray = useFieldArray({ control, name: 'only_domains' });
  const notDomainFieldArray = useFieldArray({ control, name: 'not_domains' });
  const neverDomainFieldArray = useFieldArray({ control, name: 'never_domains' });
  const emailFieldArray = useFieldArray({ control, name: 'emails' });

  const { automateBy } = useWatch({ control });
  const automationOptions = [
    { value: 'titles', label: t('focusRuleForm.meetingTitle') },
    { value: 'domains', label: t('focusRuleForm.organizationIs') },
    { value: 'only_domains', label: t('focusRuleForm.organizationCanOnlyBe') },
    { value: 'not_domains', label: t('focusRuleForm.organizationIsNot') },
    { value: 'never_domains', label: t('focusRuleForm.organizationCanNeverBe') },
    { value: 'emails', label: t('focusRuleForm.meetingAttendeeEmailIs') },
    { value: 'organizers', label: t('focusRuleForm.meetingOrganizerEmailIs') }
  ];

  const lockRequiredOption = automateBy === 'never_domains' || automateBy === 'only_domains';

  return (
    <form id='add-rules-form'>
      <Flex
        flexDir='column'
        gap={8}
        mt={2}
        py={2}
      >
        <Tooltip
          label={t('focusRuleForm.organizationCanNeverBe2')}
          isDisabled={!lockRequiredOption}
        >
          <Stack
            gap={3}
            opacity={lockRequiredOption ? 0.3 : 1}
            cursor={lockRequiredOption ? 'pointer' : 'initial'}
          >
            <Text fontWeight={600}>{t('focusRuleForm.setAsRequired')}</Text>
            <Switch
              display='flex'
              alignItems='center'
              fontSize='sm'
              {...register('isRequired')}
            >
              {t('focusRuleForm.thisRuleMustBe')}
            </Switch>
          </Stack>
        </Tooltip>
        <Stack gap={3}>
          <Text fontWeight={600}>{t('focusRuleForm.automateBy')}</Text>
          <StackRadio
            name='automateBy'
            control={control}
            options={automationOptions}
          />
        </Stack>
        {automateBy === 'titles' && (
          <FieldWrapper
            label={t('focusRuleForm.meetingTitle')}
            buttonLabel='keyword'
            fields={titleFieldArray.fields}
            onAddClick={() => titleFieldArray.append({ value: '' })}
            onRemoveClick={(index) => titleFieldArray.remove(index)}
          >
            {(_field, index) => (
              <Input
                placeholder={t('focusRuleForm.enterMeetingTitleKeywordPlaceholder')}
                {...register(`titles.${index}.value`, {
                  required: 'Must Not Be Empty'
                })}
              />
            )}
          </FieldWrapper>
        )}
        {automateBy === 'domains' && (
          <FieldWrapper
            label={t('focusRuleForm.organization')}
            buttonLabel='organization'
            fields={domainFieldArray.fields}
            onAddClick={() => domainFieldArray.append({ invitees: 1, value: '' })}
            onRemoveClick={(index) => domainFieldArray.remove(index)}
          >
            {(_field, index) => (
              <>
                <Text>{t('focusRuleForm.meetingHasAtLeast')}</Text>
                <Input
                  w={12}
                  type='number'
                  min={1}
                  {...register(`domains.${index}.invitees`, {
                    min: { value: 1, message: t('focusRuleForm.mustHaveAtLeast') }
                  })}
                />
                <Text>{t('focusRuleForm.inviteesFrom')}</Text>
                <InputGroup w={64}>
                  <InputLeftAddon {...addOnProps}>@</InputLeftAddon>
                  <Input
                    placeholder='acmeinc.com'
                    {...register(`domains.${index}.value`, {
                      required: 'Must Not Be Empty',
                      validate: (v) => isURL(v) || 'Must be Valid Email Domain'
                    })}
                  />
                </InputGroup>
              </>
            )}
          </FieldWrapper>
        )}
        {automateBy === 'only_domains' && (
          <FieldWrapper
            label={t('focusRuleForm.organizationCanOnlyBe')}
            buttonLabel='organization'
            descriptionText='Meeting only has attendees from'
            fields={onlyDomainFieldArray.fields}
            onAddClick={() => onlyDomainFieldArray.append({ value: '' })}
            onRemoveClick={(index) => onlyDomainFieldArray.remove(index)}
          >
            {(_field, index) => (
              <InputGroup w={64}>
                <InputLeftAddon {...addOnProps}>@</InputLeftAddon>
                <Input
                  placeholder='acmeinc.com'
                  {...register(`only_domains.${index}.value`, {
                    required: 'Must Not Be Empty',
                    validate: (v) => isURL(v) || 'Must be Valid Email Domain'
                  })}
                />
              </InputGroup>
            )}
          </FieldWrapper>
        )}
        {automateBy === 'not_domains' && (
          <FieldWrapper
            label={t('focusRuleForm.organizationIsNot2')}
            buttonLabel='organization'
            descriptionText='Meeting has at least'
            fields={notDomainFieldArray.fields}
            onAddClick={() => notDomainFieldArray.append({ invitees: 1, value: '' })}
            onRemoveClick={(index) => notDomainFieldArray.remove(index)}
          >
            {(_field, index) => (
              <>
                <Input
                  w={12}
                  type='number'
                  min={1}
                  {...register(`not_domains.${index}.invitees`, {
                    min: { value: 1, message: t('focusRuleForm.mustHaveAtLeast') }
                  })}
                />
                <Text>
                  invitees that are <b>{t('focusRuleForm.not')}</b> from
                </Text>
                <InputGroup w={64}>
                  <InputLeftAddon {...addOnProps}>@</InputLeftAddon>
                  <Input
                    placeholder='acmeinc.com'
                    {...register(`not_domains.${index}.value`, {
                      required: 'Must Not Be Empty',
                      validate: (v) => isURL(v) || 'Must be Valid Email Domain'
                    })}
                  />
                </InputGroup>
              </>
            )}
          </FieldWrapper>
        )}
        {automateBy === 'never_domains' && (
          <FieldWrapper
            label={t('focusRuleForm.organizationCanNeverBe')}
            buttonLabel='organization'
            fields={neverDomainFieldArray.fields}
            onAddClick={() => neverDomainFieldArray.append({ value: '' })}
            onRemoveClick={(index) => neverDomainFieldArray.remove(index)}
          >
            {(_field, index) => (
              <>
                <Text>{t('focusRuleForm.meetingCanNotHave')}</Text>
                <InputGroup w={64}>
                  <InputLeftAddon {...addOnProps}>@</InputLeftAddon>
                  <Input
                    placeholder='acmeinc.com'
                    {...register(`never_domains.${index}.value`, {
                      required: 'Must Not Be Empty',
                      validate: (v) => isURL(v) || 'Must be Valid Email Domain'
                    })}
                  />
                </InputGroup>
              </>
            )}
          </FieldWrapper>
        )}
        {automateBy === 'emails' && (
          <FieldWrapper
            label={t('focusRuleForm.meetingAttendeeEmailIs')}
            buttonLabel='attendee'
            fields={emailFieldArray.fields}
            onAddClick={() => emailFieldArray.append({ value: '' })}
            onRemoveClick={(index) => emailFieldArray.remove(index)}
          >
            {(_field, index) => (
              <Input
                type='email'
                placeholder={t('focusRuleForm.nameEmailComPlaceholder')}
                {...register(`emails.${index}.value`, {
                  required: 'Must Not Be Empty',
                  validate: (v) => isEmail(v) || 'Must be Valid Email'
                })}
              />
            )}
          </FieldWrapper>
        )}
        {automateBy === 'organizers' && (
          <FieldWrapper
            label={t('focusRuleForm.meetingOrganizerEmailIs')}
            buttonLabel='organizer'
            fields={emailFieldArray.fields}
            onAddClick={() => emailFieldArray.append({ value: '' })}
            onRemoveClick={(index) => emailFieldArray.remove(index)}
          >
            {(_field, index) => (
              <Input
                type='email'
                placeholder={t('focusRuleForm.nameEmailComPlaceholder')}
                {...register(`organizers.${index}.value`, {
                  required: 'Must Not Be Empty',
                  validate: (v) => isEmail(v) || 'Must be Valid Email'
                })}
              />
            )}
          </FieldWrapper>
        )}
        {formState.errors[automateBy] ? (
          <Box color='critical.primary'>
            {formState.errors[automateBy].map((error) => {
              const errValue = error?.value?.ref?.value;
              const errMsg = error?.value?.message ?? error?.invitees?.message;
              return (
                <Box key={`rule-form-${errMsg}`}>{`${
                  errValue ? `"${errValue}"` : `"${getRuleTypeLabel(automateBy)}" Values `
                } ${errMsg}`}</Box>
              );
            })}
          </Box>
        ) : null}
      </Flex>
    </form>
  );
}

function FieldWrapper({
  label,
  descriptionText,
  buttonLabel,
  fields,
  onAddClick,
  onRemoveClick,
  children
}) {
  const { t } = useTranslation();

  return (
    <Stack gap={3}>
      <Text fontWeight={600}>{label}</Text>
      {descriptionText && <Text fontSize='sm'>{descriptionText}</Text>}
      {fields.map((field, index) => (
        <HStack
          gap={2}
          fontSize='sm'
          key={field?.id}
        >
          {children(field, index)}
          <Spacer />
          <Button
            variant='reskinGhost'
            colorScheme='critical'
            size='reskinXs'
            px={2}
            iconSpacing={1}
            leftIcon={<CloseIcon />}
            onClick={() => onRemoveClick(index)}
          >
            {t('focusRuleForm.remove')}
          </Button>
        </HStack>
      ))}
      <Box>
        <Button
          size='reskinSm'
          variant='reskinLink'
          onClick={onAddClick}
        >
          {t('focusRuleForm.addAnother', { buttonLabel })}
        </Button>
      </Box>
    </Stack>
  );
}
