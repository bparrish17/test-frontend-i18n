import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  CloseButton,
  Divider,
  Flex,
  HStack,
  Icon,
  ListItem,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spacer,
  Spinner,
  Stack,
  Tag,
  Text,
  Textarea,
  UnorderedList,
  useDisclosure
} from '@chakra-ui/react';
import { map } from 'lodash-es';
import { useState } from 'react';
import { Controller } from 'react-hook-form';

import { usePeople } from '@services/query-services/people.query-service';
import { COLOR_OPTIONS, DURATION_OPTIONS, ICON_MAPPING, VISIBILITY_OPTIONS } from '@util/constants';
import { useBreakpoints } from '@util/hooks';
import { filterForaEmailsInOtherTenants, getMinSimilarityScoreTier } from '@util/helpers';
import {
  SFExclamationMarkTriangleOutlined,
  SFLensIcon,
  SFLightbulbOutlinedIcon
} from '@assets/icons';

import CreateLensStepWrapper from '@components/create-lens/step-wrapper.component';
import CustomSelect from '@components/general/form/custom-select.component';
import FormInput from '@components/general/form/form-input.component';
import StyledSelect from '@components/general/styled-select.component';
import FollowersChangeAlertDialog from './followers-change-alert-dialog.component';
import ContentTypeFilter from './create-lens-form-filters/content-type-filter.component';
import PeopleFilter from './create-lens-form-filters/people-filter.component';
import CompanyDomainsFilter from './create-lens-form-filters/company-domains-filter.component';
import DateRangeFilter from './create-lens-form-filters/date-range-filter.component';
import FocusFilter from './create-lens-form-filters/focus-filter.component';
import LabelsFilter from './create-lens-form-filters/labels-filter.component';
import { useTranslation } from 'react-i18next';

export default function CreateLensForm({ lensForm, isEdit }) {
  const { t } = useTranslation();

  const { isMobile } = useBreakpoints();
  const [isFollowersChanged, setIsFollowersChanged] = useState(false); // page-level flag for showoing followers change
  const followersAlertDisclosure = useDisclosure();
  const [suggestion, setSuggestion] = useState();
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  const {
    control,
    sections,
    submit,
    register,
    handleSubmit,
    isSubmitting,
    setValue,
    formState,
    getSuggestion,
    patch,
    isViewOnlyMode,
    creator,
    watch
  } = lensForm;

  const { settings, description, filtering } = sections;

  // support for our existing "select people" autocomplete
  const { data: collaboratorOptions } = usePeople(
    { not_types: ['Associate'], active: true },
    {
      select: (people) => filterForaEmailsInOtherTenants(people)
    }
  );

  const minSimilarityScore = watch('lens_config.min_similarity_score');
  const minSimilarityScoreTier = getMinSimilarityScoreTier(minSimilarityScore);
  const curColor = watch('color');

  const textareaStyles = {
    backgroundColor: 'surface.containerLow',
    borderColor: 'surface.outlineVariant'
  };

  return (
    <form onSubmit={isEdit ? handleSubmit(patch) : handleSubmit(submit)}>
      <Stack
        w='full'
        pt={11}
        gap={12}
        px={{ base: 4, lg: 11, xl: 88 }}
        color='surface.onSurfaceVariant'
      >
        {!isMobile && (
          <HStack
            w='full'
            color='brandPrimary.primary'
          >
            <SFLensIcon boxSize='18px' />
            <Text
              as='span'
              fontWeight={600}
            >
              {isEdit ? t('common.edit') : t('common.create')} Lens
            </Text>
          </HStack>
        )}
        {isViewOnlyMode && (
          <Alert status='warning'>
            <SFExclamationMarkTriangleOutlined
              mr={3}
              boxSize={6}
            />
            <AlertTitle>
              You are in view-only mode for this Lens. To make changes, please reach out to{' '}
              {creator?.name} ({creator?.email}), the creator of this lens.
            </AlertTitle>
          </Alert>
        )}
        <CreateLensStepWrapper
          title={isEdit ? t('createLensForm.editLensSettings') : t('createLensForm.createYourLens')}
          description={
            isEdit
              ? t('createLensForm.editTheTitleCustomization')
              : t('createLensForm.addATitleCustomization')
          }
          id='settings'
          section={settings}
        >
          <Flex
            gap={8}
            direction='column'
            width='100%'
          >
            <Divider
              pt='25px'
              mb='10px'
            />
            <FormInput
              size='lg'
              w='100%'
              label={t('createLensForm.lensTitle')}
              registerProps={{ ...register('title', { required: true }) }}
              formControlProps={{ isInvalid: !!formState?.errors?.title }}
              errorMsg='Please enter a lens title.'
              isDisabled={isViewOnlyMode}
            />
            <Flex
              w='100%'
              gap={4}
              direction={['column', 'row']}
            >
              <Controller
                control={control}
                name='visibility'
                render={({ field: { onChange, value } }) => {
                  return (
                    <StyledSelect
                      selectLabel='Privacy'
                      placeholder={t('createLensForm.selectVisibilityPlaceholder')}
                      options={VISIBILITY_OPTIONS.map((visOption) => ({
                        ...visOption,
                        icon: (
                          <Icon
                            as={visOption.icon}
                            boxSize={4}
                          />
                        )
                      }))}
                      value={value}
                      onChange={onChange}
                      menuButtonProps={{
                        isDisabled: isViewOnlyMode,
                        backgroundColor: 'surface.containerLow'
                      }}
                    />
                  );
                }}
              />
              <Controller
                control={control}
                name='color'
                render={({ field: { onChange, value } }) => (
                  <StyledSelect
                    selectLabel='Color'
                    placeholder={t('createLensForm.selectColorPlaceholder')}
                    options={COLOR_OPTIONS.map((colorOption) => ({
                      ...colorOption,
                      icon: (
                        <Box
                          boxSize={4}
                          bgColor={colorOption.value}
                          rounded='sm'
                        />
                      )
                    }))}
                    value={value}
                    onChange={onChange}
                    menuButtonProps={{
                      isDisabled: isViewOnlyMode,
                      backgroundColor: 'surface.containerLow'
                    }}
                  />
                )}
              />
              <Controller
                control={control}
                name='icon'
                render={({ field: { onChange, value } }) => (
                  <StyledSelect
                    selectLabel='Icon'
                    placeholder={t('createLensForm.selectIconPlaceholder')}
                    placement='auto'
                    options={map(ICON_MAPPING, (iconConfig, iconKey) => {
                      return {
                        value: iconKey,
                        label: iconConfig.label,
                        icon: (
                          <Icon
                            as={iconConfig.icon}
                            boxSize={7}
                            color={curColor}
                          />
                        )
                      };
                    })}
                    value={value}
                    onChange={onChange}
                    menuButtonProps={{
                      isDisabled: isViewOnlyMode,
                      backgroundColor: 'surface.containerLow'
                    }}
                  />
                )}
              />
            </Flex>
            <Box w='100%'>
              <Controller
                control={control}
                name='collaborators'
                render={({ field: { onChange, value } }) => (
                  <CustomSelect
                    selectProps={{ width: '100%' }}
                    placeholder={t('createLensForm.selectFollowersPlaceholder')}
                    getOptionLabel={(opt) => opt?.name}
                    getOptionValue={(opt) => opt?.id}
                    options={collaboratorOptions}
                    value={value}
                    onChange={(...args) => {
                      !isFollowersChanged && followersAlertDisclosure.onOpen();
                      onChange(...args);
                    }}
                    isDisabled={isViewOnlyMode}
                  />
                )}
              />
            </Box>
            <Divider
              pt='10px'
              mb='10px'
            />
            <DescribeStepFieldWrapper
              w='full'
              title={t('createLensForm.duration')}
              description={t('createLensForm.howOftenDoYou')}
              isOptional
            >
              <Select
                variant='reskinFilled'
                size='reskinLg'
                textIndent='0px'
                isDisabled={isViewOnlyMode}
                {...register('insight_config.duration_days')}
              >
                {(DURATION_OPTIONS ?? []).map(({ value, label }) => (
                  <option
                    key={value}
                    value={value}
                  >
                    {label}
                  </option>
                ))}
              </Select>
            </DescribeStepFieldWrapper>
          </Flex>
        </CreateLensStepWrapper>
        <CreateLensStepWrapper
          title={t('createLensForm.describeYourLens')}
          description={t('createLensForm.theFollowingPromptsHelp')}
          id='description'
          section={description}
        >
          <Stack
            gap={11}
            w='full'
          >
            <Divider pt='25px' />
            <DescribeStepFieldWrapper
              title={t('createLensForm.topicsThemes')}
              description={t('createLensForm.whatSpecificTopicsThemes')}
            >
              <Textarea
                placeholder={t('createLensForm.yourPromptHerePlaceholder')}
                {...register('lens_config.match_prompt', { required: true })}
                isDisabled={isViewOnlyMode}
                size='md'
                minH='200px'
                backgroundColor='surface.containerLow'
                isInvalid={!!formState?.errors?.lens_config?.match_prompt}
                {...textareaStyles}
              />
            </DescribeStepFieldWrapper>
            <DescribeStepFieldWrapper
              w='full'
              description={t('createLensForm.howPreciseShouldFora')}
            >
              <Stack>
                <Controller
                  control={control}
                  name='lens_config.min_similarity_score'
                  render={({ field: { onChange, value } }) => (
                    <Slider
                      aria-label={t('createLensForm.precisionSliderAriaLabel')}
                      value={value}
                      size='lg'
                      step={25}
                      isDisabled={isViewOnlyMode}
                      onChange={onChange}
                    >
                      <SliderTrack>
                        <SliderFilledTrack />
                      </SliderTrack>
                      <SliderThumb />
                    </Slider>
                  )}
                />
                <HStack fontSize='sm'>
                  <Text
                    variant='brand-label'
                    letterSpacing='widest'
                  >
                    {minSimilarityScoreTier.label}
                  </Text>
                  <Text color='surface.outline'>{minSimilarityScoreTier.description}</Text>
                  <Spacer />
                  <Text
                    variant='brand-label'
                    letterSpacing='normal'
                    textTransform='none'
                    whiteSpace='nowrap'
                  >
                    {minSimilarityScoreTier.tier + 1} of {5}
                  </Text>
                </HStack>
              </Stack>
            </DescribeStepFieldWrapper>
            <Divider />
            <DescribeStepFieldWrapper
              title={t('createLensForm.whyThisIsImportant')}
              description={t('createLensForm.shareWhyYouDecided')}
            >
              <Textarea
                placeholder={t('createLensForm.yourPromptHerePlaceholder')}
                {...register('lens_config.explanatory_prompt', { required: true })}
                isDisabled={isViewOnlyMode}
                size='md'
                minH='150px'
                isInvalid={!!formState?.errors?.lens_config?.explanatory_prompt}
                {...textareaStyles}
              />
            </DescribeStepFieldWrapper>
            <Divider />
            <DescribeStepFieldWrapper
              title={t('createLensForm.highPriorityItems')}
              description={t('createLensForm.whatAreSomeExamples')}
              isOptional
            >
              <Textarea
                placeholder={t('createLensForm.yourPromptHerePlaceholder')}
                {...register('lens_config.high_priority_examples_prompt')}
                isDisabled={isViewOnlyMode}
                size='md'
                minH='100px'
                {...textareaStyles}
              />
            </DescribeStepFieldWrapper>
            <Divider />
            <StepFooter
              icon={SFLightbulbOutlinedIcon}
              highlightedText='Need help?'
              text={t('createLensForm.onceYouStartThese')}
            >
              <Button
                px='40px'
                py='5px'
                variant='reskinSecondary'
                colorScheme='brandPrimary'
                onClick={() => getSuggestion(setSuggestion, setSuggestionLoading)}
                isDisabled={!formState.isValid || isViewOnlyMode}
              >
                {suggestionLoading && (
                  <Spinner
                    size='xs'
                    mr='15px'
                  />
                )}
                Get Suggestions
              </Button>
            </StepFooter>
            {suggestion && (
              <Alert>
                <AlertTitle>{suggestion}</AlertTitle>
                <CloseButton onClick={() => setSuggestion('')} />
              </Alert>
            )}
          </Stack>
        </CreateLensStepWrapper>
        <CreateLensStepWrapper
          title={t('createLensForm.filteringOptions')}
          description={t('createLensForm.byDefaultLensesLook')}
          id='filtering'
          section={filtering}
          isOptional
          pb={3}
        >
          <Stack
            gap={8}
            mt={5}
          >
            <Text
              variant='content-section-header'
              lineHeight={7}
            >
              {t('createLensForm.filterBy')}
            </Text>
            <LabelsFilter
              control={control}
              watch={watch}
              setValue={setValue}
              isViewOnlyMode={isViewOnlyMode}
            />
            <PeopleFilter
              control={control}
              watch={watch}
              setValue={setValue}
              isViewOnlyMode={isViewOnlyMode}
            />
            <FocusFilter
              watch={watch}
              control={control}
              setValue={setValue}
              isViewOnlyMode={isViewOnlyMode}
            />
            <DateRangeFilter
              control={control}
              watch={watch}
              isViewOnlyMode={isViewOnlyMode}
              setValue={setValue}
            />
            <CompanyDomainsFilter
              control={control}
              watch={watch}
              setValue={setValue}
              isViewOnlyMode={isViewOnlyMode}
            />
            <ContentTypeFilter
              control={control}
              error={formState?.errors?.filters?.sub_sources}
              isViewOnlyMode={isViewOnlyMode}
            />
            {/*

              https://foraday.atlassian.net/browse/FORA-880
              Disable Preview Lens Sources

              <StepFooter
                icon={EyeIcon}
                highlightedText="Want to check your work?"
                text="Based on the above prompt & settings, FORA can show you the sources that it will
                    use to generate the next insight."
              >
                <PreviewLensSourcesModal
                  isDisabled={!formState?.isValid || isViewOnlyMode}
                  disclosure={previewDisclosure}
                  generateSourcesPreview={generateSourcesPreview}
                />
              </StepFooter>
            */}
          </Stack>
        </CreateLensStepWrapper>
      </Stack>
      <Stack
        align='flex-end'
        px={{ base: 4, lg: 11, xl: 88 }}
        py={6}
        gap={4}
      >
        <ValidationMessage formState={formState} />
        <Button
          type='submit'
          variant='reskinPrimary'
          w={96}
          isDisabled={isViewOnlyMode || isSubmitting}
        >
          {isEdit ? t('common.save') : t('createLensForm.finishSave')}
        </Button>
      </Stack>
      <FollowersChangeAlertDialog
        disclosure={followersAlertDisclosure}
        onClose={() => setIsFollowersChanged(true)}
      />
    </form>
  );
}

function ValidationMessage({ formState }) {
  const { t } = useTranslation();

  if (formState?.isValid || !formState?.isSubmitted) {
    return null;
  }
  return (
    <Alert
      status='error'
      fontSize='sm'
    >
      <Box>
        <AlertTitle>{t('createLensForm.pleaseResolveTheFollowing')}</AlertTitle>
        <AlertDescription>
          <UnorderedList>
            {formState?.errors?.title && <ListItem>{t('common.title')}</ListItem>}
            {formState?.errors?.lens_config?.match_prompt && (
              <ListItem>{t('createLensForm.topicsThemesPrompt')}</ListItem>
            )}
            {formState?.errors?.lens_config?.explanatory_prompt && (
              <ListItem>{t('createLensForm.whyThisIsImportant2')}</ListItem>
            )}
            {formState?.errors?.filters?.sub_sources && (
              <ListItem>{t('createLensForm.contentType')}</ListItem>
            )}
          </UnorderedList>
        </AlertDescription>
      </Box>
    </Alert>
  );
}

function DescribeStepFieldWrapper({ title, description, isOptional, children, ...containerProps }) {
  const { t } = useTranslation();

  return (
    <Stack
      gap='30px'
      {...containerProps}
    >
      <Stack gap={3}>
        <Flex
          justifyContent='space-between'
          alignItems='center'
        >
          <Text
            variant='content-section-header'
            lineHeight={6}
            fontSize={16}
            fontWeight={400}
            letterSpacing={4}
          >
            {title}
          </Text>
          {isOptional && <Tag variant='label'>{t('createLensForm.optional')}</Tag>}
        </Flex>
        <Text>{description}</Text>
      </Stack>
      {children}
    </Stack>
  );
}

function StepFooter({ icon, text, highlightedText, children }) {
  return (
    <Flex
      direction={{ base: 'column', lg: 'row' }}
      gap={4}
      alignItems='end'
    >
      <Flex
        alignItems='center'
        gap={6}
        w='full'
      >
        <Icon
          as={icon}
          color='brandPrimary.primary'
        />
        <Text
          fontSize='13px'
          fontWeight={500}
        >
          <Text
            as='span'
            color='brandPrimary.primary'
          >
            {highlightedText}{' '}
          </Text>
          {text}
        </Text>
      </Flex>
      {children}
    </Flex>
  );
}
