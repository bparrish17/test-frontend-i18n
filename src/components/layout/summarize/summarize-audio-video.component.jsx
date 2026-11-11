import {
  Button,
  Collapse,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stack,
  Text,
  Input,
  VStack
} from '@chakra-ui/react';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { format, set, add } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

import { SFPlusCircleIcon, SFCalendarIcon } from '@assets/icons';

import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import { maxFileSizeBytes, createFileValidator } from '@util/helpers';
import { useInitiativeOptions } from '@services/query-services/initiatives.query-service';
import CustomSelect from '@components/general/form/custom-select.component';
import ReskinCalendar from '@components/general/reskin-calendar.component';
import S3Bucket from '@services/s3bucket.service';
import { usePostConvertFromVideo } from '@services/query-services/lambda.query-service';

import StepWithLabelComponent from '@components/general/form/step-with-label.component';
import DocumentDropzone from './document-dropzone.component';

import { MAX_AV_FILE_SIZE_MB, ACCEPTED_AV_FILE_FORMATS } from '@util/constants';
import { useTranslation } from 'react-i18next';

const SummarizeAudioVideo = ({ disclosure }) => {
  const { t } = useTranslation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryClient = useQueryClient();
  const toast = useStyledToast();
  const user = useUserStore((state) => state.user);
  const tenant = useUserStore((state) => state.tenant);
  const getSessionId = useUserStore((state) => state?.getSessionId);
  const { data: focusOptions } = useInitiativeOptions({ type: 'Focus' });
  const { mutateAsync: convertVideoToMeeting } = usePostConvertFromVideo();

  const {
    handleSubmit,
    control,
    register,
    watch,
    formState: { errors },
    setError,
    clearErrors,
    getFieldState,
    reset: resetForm
  } = useForm({
    defaultValues: {
      date: new Date(),
      time: format(new Date(), 'HH:mm')
    }
  });

  const file = watch('file');
  const validateFile = createFileValidator({ maxSizeMB: MAX_AV_FILE_SIZE_MB });

  const tabProps = {
    color: 'brandPrimary.primary',
    borderRadius: 'xl',
    px: 4,
    py: 3,
    fontWeight: 500,
    _selected: { bg: 'brandPrimary.onContainer', color: 'brandPrimary.onPrimary' },
    whiteSpace: 'nowrap'
  };

  const onSubmit = async (formValues) => {
    setIsSubmitting(true);
    if (!file && !formValues.link) {
      setError('file', { type: 'required', message: t('summarizeAudioVideo.addAFileOr') });
      setIsSubmitting(false);
      return;
    }

    const [hours, minutes] = formValues.time.split(':');
    const startDateTime = set(new Date(formValues.date), {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0
    });

    if (startDateTime > new Date()) {
      setError('time', { message: t('summarizeAudioVideo.timeMustNotBe') });
      setIsSubmitting(false);
      return;
    }

    const endDateTime = add(startDateTime, { hours: 1 });
    const payloadToSend = {
      session_id: getSessionId(),
      name: formValues.title,
      start_at: startDateTime,
      end_at: endDateTime,
      is_public_url: !file,
      tenant_id: tenant?.id,
      creator_id: user?.id,
      initiative_id: formValues?.initiative?.value
    };

    if (file) {
      const s3 = new S3Bucket('fora-meeting-uploads', {
        queryClient,
        user,
        tenant
      });
      payloadToSend.file_location = await s3.uploadFile(file);
    } else {
      payloadToSend.file_location = formValues.link;
    }

    await convertVideoToMeeting(payloadToSend, {
      onSuccess: async () => {
        toast({
          title: t('summarizeAudioVideo.videoUploadSuccessProcessing'),
          status: 'success',
          duration: 9000,
          isClosable: true
        });
        setIsSubmitting(false);
        disclosure.onClose();
      },
      onError: () => {
        toast({ status: 'error', title: t('summarizeAudioVideo.failedToUploadMeeting') });
        setIsSubmitting(false);
      }
    });
  };

  return (
    <Modal
      {...disclosure}
      variant='classic'
      onCloseComplete={() => {
        resetForm();
        setIsSubmitting(false);
      }}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack>
            <SFPlusCircleIcon
              boxSize={7}
              p={1}
            />
            <Text variant='body-600-md'>{t('summarizeAudioVideo.summarizeMeetingAudioOr')}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={11}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={6}>
              <Stack gap={3}>
                <Tabs
                  variant='enclosed'
                  align='center'
                  isFitted
                >
                  <TabList
                    display='inline-flex'
                    gap={1}
                    bg='brandPrimary.containerLow'
                    p={1}
                    borderRadius='xl'
                  >
                    <Tab
                      {...tabProps}
                      data-testid='upload-file-tab'
                    >
                      {t('summarizeAudioVideo.uploadFile')}
                    </Tab>
                    <Tab
                      {...tabProps}
                      data-testid='add-link-tab'
                    >
                      {t('summarizeAudioVideo.addLink')}
                    </Tab>
                  </TabList>
                  <TabPanels
                    p={0}
                    mt={3}
                  >
                    <TabPanel
                      p={0}
                      data-testid='document-tab-panel'
                    >
                      <Controller
                        control={control}
                        name='file'
                        render={({ field: { value, onChange } }) => (
                          <DocumentDropzone
                            file={value}
                            onFileLoad={(file) => onChange(file)}
                            onFileRemove={() => {}}
                            validateFile={validateFile}
                            maxFileSize={maxFileSizeBytes(MAX_AV_FILE_SIZE_MB)}
                            helperText={{
                              heading: 'Drag & drop audio or video files here',
                              subtext: 'Upload MP3 or MP4 (Max size: 2GB)'
                            }}
                            accept={ACCEPTED_AV_FILE_FORMATS}
                            maxFiles={1}
                            onError={(error) => {
                              if (!error) {
                                clearErrors('file');
                              } else {
                                setError('file', { message: error.message });
                              }
                            }}
                          />
                        )}
                      />
                    </TabPanel>
                    <TabPanel
                      p={0}
                      mt={3}
                      data-testid='link-tab-panel'
                    >
                      <VStack
                        bgColor='brandPrimary.containerLow'
                        borderRadius='lg'
                        minH='200px'
                        p={7}
                        display='flex'
                        justify='center'
                        flexDir='column'
                        spacing={0}
                        align='stretch'
                      >
                        <StepWithLabelComponent
                          label={t('summarizeAudioVideo.linkToAMeeting')}
                          name='link'
                          fieldState={getFieldState('link')}
                        >
                          <Input
                            placeholder={t('summarizeAudioVideo.enterASupportedLinkPlaceholder')}
                            data-testid='link-input'
                            {...register('link', {
                              maxLength: {
                                value: 512,
                                message: t('summarizeAudioVideo.linkMustBe512')
                              },
                              pattern: {
                                value: /^(https):\/\/[\w.\-/!:#?=&%,@]+$/i,
                                message: t('summarizeAudioVideo.pleaseEnterAValid')
                              }
                            })}
                          />
                          <Text
                            align='left'
                            variant='body-sm'
                            color='surface.outline'
                          >
                            {t('summarizeAudioVideo.mustBeFromA')}
                          </Text>
                        </StepWithLabelComponent>
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>

                <Collapse in={!!errors?.file}>
                  <Text
                    color='critical.primary'
                    variant='label-600-md'
                  >
                    {errors?.file?.message}
                  </Text>
                </Collapse>
              </Stack>

              <HStack w='100%'>
                <Controller
                  control={control}
                  name='date'
                  render={({ field: { onChange, value } }) => (
                    <StepWithLabelComponent
                      label={t('summarizeAudioVideo.meetingDate')}
                      name='date'
                      fieldState={getFieldState('date')}
                      stackProps={{ flex: 1 }}
                    >
                      <ReskinCalendar
                        trigger={
                          <Button
                            variant='reskinWhite'
                            size='reskinLg'
                            rightIcon={<SFCalendarIcon boxSize='13px' />}
                            justifyContent='space-between'
                            w='100%'
                          >
                            {format(value, 'PP')}
                          </Button>
                        }
                        date={value}
                        maxDate={new Date()}
                        setDate={onChange}
                        fadePastDates={false}
                        placement='top'
                        strategy='fixed'
                        popoverContentProps={{ ml: { base: 3, lg: 'unset' } }}
                      />
                    </StepWithLabelComponent>
                  )}
                />

                <StepWithLabelComponent
                  label={t('summarizeAudioVideo.meetingTime')}
                  name='time'
                  fieldState={getFieldState('time')}
                  stackProps={{ flex: 1 }}
                >
                  <Input
                    type='time'
                    placeholder={t('summarizeAudioVideo.n1230pmPlaceholder')}
                    data-testid='meeting-time-input'
                    {...register('time', { required: 'Pick a time' })}
                  />
                </StepWithLabelComponent>
              </HStack>

              <StepWithLabelComponent
                label={t('common.title')}
                name='title'
                fieldState={getFieldState('title')}
              >
                <Input
                  placeholder={t('summarizeAudioVideo.yourMeetingTitlePlaceholder')}
                  data-testid='meeting-title-input'
                  {...register('title', { required: 'Add a meeting title' })}
                />
              </StepWithLabelComponent>

              <Controller
                control={control}
                name='initiative'
                rules={{ required: 'Pick a category' }}
                render={({ field: { name, value, onChange }, fieldState }) => (
                  <StepWithLabelComponent
                    label={t('common.category')}
                    name={name}
                    fieldState={fieldState}
                  >
                    <CustomSelect
                      size='md'
                      isMulti={false}
                      placeholder={t('summarizeAudioVideo.chooseCategoryPlaceholder')}
                      options={focusOptions}
                      value={value}
                      onChange={onChange}
                      menuPlacement='top'
                    />
                  </StepWithLabelComponent>
                )}
              />

              <Button
                alignSelf='end'
                type='submit'
                variant='reskinPrimary'
                size='reskinLg'
                borderRadius='lg'
                isLoading={isSubmitting}
                data-testid='summarize-meeting-button'
              >
                {t('summarizeAudioVideo.summarize')}
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SummarizeAudioVideo;
