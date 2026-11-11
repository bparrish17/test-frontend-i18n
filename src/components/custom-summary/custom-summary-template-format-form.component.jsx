import {
  Button,
  Collapse,
  Divider,
  FormControl,
  FormErrorMessage,
  HStack,
  Input,
  Link,
  Spacer,
  Stack,
  StackDivider,
  Text,
  Textarea
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import {
  getFormattingInstructionsSuggestion,
  useGenerateImprovedFormattingInstructions
} from '@services/query-services/initiatives.query-service';
import { useUserStore } from '@store/app.store';
import { TEMPLATE_EXAMPLES_URL } from '@util/constants';
import { CustomSummaryStep } from './custom-summary-shared-ui.component';
import { useTranslation } from 'react-i18next';

export default function SummaryTemplateFormatForm({
  form,
  undoRedo,
  createNewSummary,
  suggestion,
  setSuggestion,
  isGenerating,
  isGenerated,
  regenerateWithNewInstructions
}) {
  const { t } = useTranslation();

  const tenant = useUserStore((state) => state.tenant);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = form;

  const { mutateAsync: generateImprovedFormattingInstructions } =
    useGenerateImprovedFormattingInstructions();

  const emptyInstructionsResponse =
    'Please write something first, so we can suggest a format for you.';
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [isRewriting, setIsRewriting] = useState(false);
  const emptyInstructionsError = suggestion === emptyInstructionsResponse;

  const formattingInstructions = watch('formattingInstructions');
  const initiativeTitle = watch('initiativeTitle');

  const emptyInstructions = !formattingInstructions || formattingInstructions.length === 0;
  const emptyTitle = !initiativeTitle || initiativeTitle.length === 0;

  const {
    state: instructionsState,
    setState: setInstructionsState,
    canRedo,
    canUndo,
    redo,
    undo,
    nextState: nextInstructionsState,
    prevState: prevInstructionsState
  } = undoRedo;

  const updateSuggestion = async () => {
    if (emptyInstructions) {
      setSuggestion(emptyInstructionsResponse);
      return;
    }

    setIsSuggestionLoading(true);
    const { value } = await getFormattingInstructionsSuggestion({
      formatting_instructions: formattingInstructions,
      title: initiativeTitle,
      tenant
    });
    setSuggestion(value);
    setIsSuggestionLoading(false);
  };

  let onSubmit = createNewSummary;
  if (isGenerated) {
    onSubmit = regenerateWithNewInstructions;
  }

  const rewriteWithAi = async () => {
    if (emptyInstructions || emptyTitle) {
      return;
    }

    setIsRewriting(true);
    setInstructionsState(formattingInstructions);
    const newFormattingInstructions = await generateImprovedFormattingInstructions({
      title: initiativeTitle,
      formatting_instructions: formattingInstructions
    });
    setIsRewriting(false);
    setInstructionsState(newFormattingInstructions.value);
  };

  const handleUndo = () => {
    if (canUndo) {
      undo();
      setValue('formattingInstructions', prevInstructionsState);
    }
  };

  const handleRedo = () => {
    if (canRedo) {
      redo();
      setValue('formattingInstructions', nextInstructionsState);
    }
  };

  useEffect(() => {
    if (!isRewriting && instructionsState && instructionsState?.length > 0) {
      setValue('formattingInstructions', instructionsState);
    }
  }, [instructionsState, isRewriting]);

  return (
    <form
      id='template-format-form'
      style={{ height: '100%' }}
      onSubmit={handleSubmit(onSubmit)}
    >
      <CustomSummaryStep>
        <Text
          fontWeight={600}
          fontSize='lg'
        >
          {t('customSummaryTemplateFormatForm.writeYourTemplate')}
        </Text>
        <Text color='surface.onSurfaceVariant'>
          {t('customSummaryTemplateFormatForm.describeDifferentSectionsWith')}
        </Text>
        <Text color='surface.onSurfaceVariant'>
          You can also enter a few words or phrases and select{' '}
          <Text
            as='span'
            fontWeight={500}
          >
            {t('customSummaryTemplateFormatForm.rewriteWithAi')}
          </Text>{' '}
          to generate a format for you.
        </Text>
        <FormControl isInvalid={errors?.initiativeTitle?.message}>
          <Stack>
            <FormErrorMessage>{errors?.initiativeTitle?.message}</FormErrorMessage>
            <Input
              placeholder={t('customSummaryTemplateFormatForm.templateNamePlaceholder')}
              {...register('initiativeTitle', { required: true, disabled: isGenerating })}
              size='md'
              border='reskin'
              borderColor={
                errors?.initiativeTitle?.message ? 'critical.primary' : 'surface.outline'
              }
            />
          </Stack>
        </FormControl>

        <FormControl isInvalid={errors?.formattingInstructions?.message}>
          <Stack>
            <FormErrorMessage>{errors?.formattingInstructions?.message}</FormErrorMessage>
            <Stack
              rounded='lg'
              border='reskin'
              borderColor={
                errors?.formattingInstructions?.message ? 'critical.primary' : 'surface.outline'
              }
              bg='surface.surfaceBright'
              _hover={{
                bg: 'surface.surfaceBright'
              }}
              gap={0}
              position='relative'
            >
              <HStack
                p={4}
                overflowX='scroll'
              >
                <HStack>
                  <Button
                    onMouseEnter={() => {
                      if (formattingInstructions !== instructionsState) {
                        setInstructionsState(formattingInstructions);
                      }
                    }}
                    isLoading={isRewriting}
                    onClick={rewriteWithAi}
                    isDisabled={emptyInstructions || emptyTitle}
                    variant='reskinOutline'
                  >
                    {t('customSummaryTemplateFormatForm.rewriteWithAi')}
                  </Button>
                  {(canUndo || canRedo) && (
                    <>
                      <Divider orientation='vertical' />
                      <Button
                        onClick={handleUndo}
                        isDisabled={!canUndo || isRewriting}
                        variant='reskinOutline'
                      >
                        {t('customSummaryTemplateFormatForm.undo')}
                      </Button>
                      <Divider orientation='vertical' />
                      <Button
                        onClick={handleRedo}
                        isDisabled={!canRedo || isRewriting}
                        variant='reskinOutline'
                      >
                        {t('customSummaryTemplateFormatForm.redo')}
                      </Button>
                    </>
                  )}
                </HStack>
                <Spacer />
                <HStack divider={<StackDivider orientation='vertical' />}>
                  <Button
                    isLoading={isSuggestionLoading}
                    onClick={updateSuggestion}
                    as={Link}
                    isDisabled={emptyInstructions || isRewriting}
                    variant='reskinOutline'
                  >
                    {t('customSummaryTemplateFormatForm.suggestions')}
                  </Button>
                  <Button
                    as={Link}
                    href={TEMPLATE_EXAMPLES_URL}
                    isExternal
                    variant='reskinOutline'
                  >
                    {t('customSummaryTemplateFormatForm.examples')}
                  </Button>
                </HStack>
              </HStack>

              <Textarea
                disabled={isRewriting}
                variant='unstyled'
                placeholder={t('customSummaryTemplateFormatForm.templateContentsPlaceholder')}
                _placeholder={{
                  color: 'surface.onSurfaceVariant',
                  opacity: 0.5,
                  fontWeight: 500
                }}
                size='md'
                minH='200px'
                px={4}
                {...register('formattingInstructions', {
                  required: true,
                  disabled: isGenerating
                })}
              />
            </Stack>
          </Stack>
        </FormControl>
        <Collapse in={!!suggestion}>
          <Text
            color={emptyInstructionsError ? 'critical.onContainer' : 'surface.onSurfaceVariant'}
            bgColor={emptyInstructionsError ? 'critical.container' : 'surface.surfaceDim'}
            rounded='lg'
            p={4}
            opacity={isSuggestionLoading ? 0.5 : 1}
            transition='opacity 0.2s'
          >
            {suggestion}
          </Text>
        </Collapse>
      </CustomSummaryStep>
    </form>
  );
}
