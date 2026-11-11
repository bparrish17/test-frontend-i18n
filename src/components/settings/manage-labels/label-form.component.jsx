import {
  Button,
  Collapse,
  HStack,
  Input,
  Spacer,
  Stack,
  Text,
  Textarea,
  useConst
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import {
  useCreateInitiative,
  usePatchInitiative
} from '@services/query-services/initiatives.query-service';
import { useMutationToast } from '@util/hooks';
import MeetingTypeRadioGroup, {
  MEETING_TYPE_OPTIONS
} from '@components/settings/manage-labels/meeting-type-radio-group.component';
import { useGenerateLabelPrompts } from '@services/query-services/lambda.query-service';
import { useUserStore } from '@store/app.store';
import { useTranslation } from 'react-i18next';

export default function LabelForm({
  disclosure,
  isEditing,
  refetch,
  selectedLabel,
  onCreateLabel
}) {
  const { t } = useTranslation();

  const tenant = useUserStore((state) => state.tenant);
  const meetingTypes = useConst(MEETING_TYPE_OPTIONS.map((o) => o.value));
  const [isLoading, setIsLoading] = useState(false);
  const { onSuccess: onSaveSuccess, onError: onSaveError } = useMutationToast(
    'label',
    isEditing ? 'update' : 'create'
  );
  const { onError: onTitleAlreadyInUseError } = useMutationToast({
    error: {
      title: t('labelForm.titleIsAlreadyIn'),
      description: ''
    }
  });
  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors }
  } = useForm();
  const title = watch('title');
  const maxChars = 50;

  const { mutateAsync: createLabel } = useCreateInitiative();
  const { mutateAsync: patchLabel } = usePatchInitiative({
    optimisticUpdateConfig: { enabled: true, type: 'id' }
  });
  const { mutateAsync: generateLabelPrompts } = useGenerateLabelPrompts();

  const onSubmit = async ({ title, description, meetingType }) => {
    setIsLoading(true);

    const labelPrompts = await generateLabelPrompts({
      title,
      description,
      tenantId: tenant.id
    });
    const initiative = {
      title,
      description,
      type: 'Label',
      formatting_instructions: labelPrompts.formatting_instructions,
      lens_config: labelPrompts.lens_config,
      visibility: 'Tenant',
      tags: ['not-compliance', meetingType]
    };
    const mutateOptions = {
      onSuccess: onSaveSuccess,
      onError: (e) => {
        if (e.response.data.errors.includes('The title is already in use by another Initiative.')) {
          onTitleAlreadyInUseError(e);
        } else {
          onSaveError(e);
        }
        setIsLoading(false);
      }
    };
    let newLabel;
    if (isEditing) {
      await patchLabel(
        {
          ...initiative,
          id: selectedLabel?.id
        },
        mutateOptions
      );
      refetch();
    } else {
      newLabel = await createLabel(initiative, mutateOptions);
    }

    setIsLoading(false);
    await onCreateLabel({ ...newLabel, match: 'Manual' });
    disclosure.onClose();
    reset();
  };

  useEffect(() => {
    const labelMeetingType = selectedLabel?.tags?.find((tag) => meetingTypes.includes(tag));
    reset({
      title: selectedLabel?.title || '',
      description: selectedLabel?.description || '',
      meetingType: labelMeetingType || 'either'
    });
  }, [selectedLabel]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack
        gap={6}
        p={6}
      >
        <Text
          variant='body-reg-sm'
          color='surface.onSurfaceVariant'
        >
          {isEditing
            ? t('labelForm.noteEditingAndDeleting')
            : t('labelForm.pleaseProvideDetailsAbout')}
        </Text>
        <Stack gap={3}>
          <HStack>
            <Text variant='body-700-sm'>{t('common.title')}</Text>
            <Spacer />
            <Text
              variant='label-lighter-md'
              color='surface.outline'
            >
              {t('labelForm.chars', { length: title?.length, maxChars })}
            </Text>
          </HStack>
          <Input
            data-testid='title-input'
            placeholder={t('labelForm.enterALabelNamePlaceholder')}
            textStyle='body-reg-sm'
            _placeholder={{
              textStyle: 'body-reg-sm',
              color: 'surface.outline'
            }}
            {...register('title', {
              required: 'Please enter a label name.',
              maxLength: {
                value: maxChars,
                message: `Title cannot be more than ${maxChars} characters.`
              }
            })}
            maxLength={maxChars}
          />
          <Collapse in={!!errors.title}>
            <Text
              color='critical.primary'
              fontSize='sm'
            >
              {errors?.title?.message}
            </Text>
          </Collapse>
        </Stack>
        <Stack gap={3}>
          <Text variant='body-700-sm'>{t('common.description')}</Text>
          <Text
            variant='body-reg-sm'
            color='surface.onSurfaceVariant'
          >
            {t('labelForm.howShouldForaInterpret')}
          </Text>
          <Textarea
            data-testid='description-textarea'
            placeholder={t('labelForm.enterADescriptionPlaceholder')}
            size='sm'
            _placeholder={{
              textStyle: 'body-reg-sm',
              color: 'surface.outline'
            }}
            textStyle='body-reg-sm'
            {...register('description', {
              required: 'Please enter a label description.'
            })}
          />
          <Collapse in={!!errors.description}>
            <Text
              color='critical.primary'
              fontSize='sm'
            >
              {errors.description?.message}
            </Text>
          </Collapse>
        </Stack>
        <Stack gap={3}>
          <Text variant='body-700-sm'>{t('labelForm.internalVsExternal')}</Text>
          <Text
            variant='body-reg-sm'
            color='surface.onSurfaceVariant'
          >
            {t('labelForm.shouldForaApplyThis')}
          </Text>
          <Controller
            control={control}
            name='meetingType'
            render={({ field: { value, onChange } }) => (
              <MeetingTypeRadioGroup
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Stack>
        <HStack>
          <Spacer />
          <Button
            type='submit'
            borderRadius='lg'
            bgColor='brandPrimary.onContainer'
            _hover={{
              bgColor: 'brandPrimary.onSurface'
            }}
            isLoading={isLoading}
          >
            {isEditing ? t('common.save') : t('common.create')}
          </Button>
        </HStack>
      </Stack>
    </form>
  );
}
