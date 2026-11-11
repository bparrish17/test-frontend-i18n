import {
  Alert,
  AlertTitle,
  Button,
  HStack,
  Image,
  Input,
  Spacer,
  Spinner,
  Stack,
  Text,
  Link,
  Flex,
  Tooltip
} from '@chakra-ui/react';
import { Controller, useFormContext } from 'react-hook-form';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useState } from 'react';

import { useInitiativeOptions } from '@services/query-services/initiatives.query-service';
import { SlackLogo } from '@assets/images';
import { SFInfoIcon } from '@assets/icons';
import CustomSelect from '@components/general/form/custom-select.component';
import HorizontalRadio from '@components/general/form/horizontal-radio.component';
import InfoBlurb from '@components/general/info-blurb.component';
import StepWithLabelComponent from '@components/general/form/step-with-label.component';
import { useTranslation } from 'react-i18next';

const cadenceOptions = [
  // { label: 'Just Once', value: 'once', description: 'Single Summary' },
  { label: 'Daily', value: 'daily', description: 'At Midnight' },
  { label: 'Weekly', value: 'weekly', description: 'Every Sunday' },
  { label: 'Monthly', value: 'monthly', description: 'Last Day of Month' }
];

/**
 *
 * @param {{
 *  onSubmit: (channelBody: Partial<Channel>) => void
 *  sourceType: 'Slack' | 'Teams'
 *  isSubmitting: boolean
 *  children: JSX.Element
 * }} CreateDigestFormProps
 * @returns
 */
export default function DigestForm({
  isEdit,
  onSubmit,
  parentDisclosure,
  sourceType,
  isSubmitting,
  children
}) {
  const { t } = useTranslation();

  const isSlack = sourceType === 'Slack';
  const [showAboutBlurb, setShowAboutBlurb] = useState(isSlack);
  const { data: focusOptions } = useInitiativeOptions({ type: 'Focus' });
  const {
    handleSubmit,
    register,
    control,
    getFieldState,
    formState: { isValid, isSubmitted }
  } = useFormContext();

  return (
    <Stack
      as='form'
      data-testid='create-digest-form'
      onSubmit={handleSubmit(onSubmit)}
      p={{ base: 4, lg: 6 }}
      gap={6}
    >
      <HStack justify='space-between'>
        <Text variant='body-700-md'>{t('digestForm.summarizeOneOrMultiple', { sourceType })}</Text>
        {!isEdit && (
          <Button
            variant='reskinWhite'
            size='reskinMd'
            as={ReactRouterLink}
            to='/settings/manage-digests'
            onClick={parentDisclosure.onClose}
          >
            {t('digestForm.manageDigests')}
          </Button>
        )}
      </HStack>
      {showAboutBlurb && (
        <InfoBlurb
          title={t('digestForm.aboutSlackIntegration')}
          icon={
            <Image
              src={SlackLogo}
              p='9px'
            />
          }
          iconWrapperProps={{ bgColor: 'surface.containerLowest', borderRadius: 'xl' }}
          onCloseClick={() => setShowAboutBlurb(false)}
        >
          {t('digestForm.makeSureTheFora')}
          <Link
            textDecor='underline'
            href='https://intercom.help/fora/en/articles/11145895-fora-slack-digest-configuration'
            target='_blank'
          >
            {t('digestForm.learnMore')}
          </Link>
        </InfoBlurb>
      )}
      {children}
      <Controller
        control={control}
        name='cadenceInterval'
        render={({ field: { name, value, onChange }, fieldState }) => (
          <StepWithLabelComponent
            label={`${sourceType} Digest Frequency`}
            labelChildren={
              <Tooltip
                minW='436px'
                pl={5}
                py={1}
                borderRadius='lg'
                hasArrow
                label={
                  <ul>
                    <li>{t('digestForm.dailyRepeatsEvery24')}</li>
                    <li>{t('digestForm.weeklyRepeatsEverySunday')}</li>
                    <li>{t('digestForm.monthlyRepeatsOnThe')}</li>
                  </ul>
                }
              >
                <Flex
                  as='span'
                  cursor='pointer'
                >
                  <SFInfoIcon color='surface.onSurfaceVariant' />
                </Flex>
              </Tooltip>
            }
            name={name}
            fieldState={fieldState}
          >
            <HorizontalRadio
              options={cadenceOptions}
              value={value}
              control={control}
              onChange={onChange}
            />
          </StepWithLabelComponent>
        )}
      />
      <StepWithLabelComponent
        label={`${sourceType} Digest Title`}
        name='name'
        fieldState={getFieldState('name')}
      >
        <Input
          placeholder={`Your ${sourceType} Digest Title`}
          {...register('name', { required: 'Add a Title' })}
        />
      </StepWithLabelComponent>

      <Controller
        control={control}
        name='initiative'
        rules={{ required: 'Category is Required' }}
        render={({ field: { name, value, onChange }, fieldState }) => (
          <StepWithLabelComponent
            label={t('digestForm.category')}
            name={name}
            fieldState={fieldState}
          >
            <CustomSelect
              size='md'
              isMulti={false}
              placeholder={t('digestForm.chooseCategoryPlaceholder')}
              options={focusOptions}
              value={value}
              onChange={onChange}
              menuPlacement='auto'
            />
          </StepWithLabelComponent>
        )}
      />
      <HStack gap={6}>
        {!isValid && isSubmitted && (
          <Alert
            h={10}
            status='error'
          >
            <AlertTitle>{t('digestForm.pleaseResolveTheRequired')}</AlertTitle>
          </Alert>
        )}
        <Spacer />
        <Button
          type='submit'
          alignSelf='flex-end'
          size='reskinLg'
          isDisabled={isSubmitting}
        >
          <Text as='span'>
            {isEdit ? t('digestForm.save') : t('digestForm.create')} {sourceType} Digest
          </Text>
          {isSubmitting && (
            <Spinner
              size='xs'
              color='brandPrimary.onPrimary'
              ml={2}
            />
          )}
        </Button>
      </HStack>
    </Stack>
  );
}
