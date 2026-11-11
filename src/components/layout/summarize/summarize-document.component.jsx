import {
  Button,
  Collapse,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { useRollbar } from '@rollbar/react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';

import { SFPlusCircleIcon } from '@assets/icons';
import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import { maxFileSizeBytes, createFileValidator } from '@util/helpers';
import { formatRollbarTitle } from '@util/helpers/error-boundary.helpers';
import S3Bucket from '@services/s3bucket.service';

import DocumentDropzone from './document-dropzone.component';

import { MAX_DOC_FILE_SIZE_MB, ACCEPTED_DOC_FILE_FORMATS } from '@util/constants';
import { useTranslation } from 'react-i18next';

/**
 * A modal component for uploading and summarizing documents.
 * It uses a DocumentDropzone for file input and S3Bucket service for uploading.
 * Displays a toast message during summarization and handles errors with Rollbar.
 * @param {object} props - Component props.
 * @param {object} props.disclosure - Chakra UI disclosure object for controlling the modal state (isOpen, onClose, etc.).
 * @returns {JSX.Element} The SummarizeDocument modal component.
 */
const SummarizeDocument = ({ disclosure }) => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useStyledToast();
  const rollbar = useRollbar();
  const user = useUserStore((state) => state.user);
  const tenant = useUserStore((state) => state.tenant);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    setError,
    setValue,
    clearErrors,
    reset: resetForm
  } = useForm();

  const file = watch('file');
  const fileName = watch('fileName');

  /**
   * Handles the form submission for document summarization.
   * Validates if files are present, shows an info toast, uploads files to S3,
   * and queues them for parsing. Reports errors to Rollbar.
   * Resets the form and closes the modal on completion.
   * @async
   */
  const onSubmit = async () => {
    setIsSubmitting(true);
    toast({
      status: 'info',
      title: `Summarizing file ${file?.name}`,
      containerProps: { minW: '0px', w: 'fit-content', maxW: 'unset' },
      titleProps: { maxW: '475px' },
      duration: 10000,
      isClosable: true
    });

    try {
      const s3 = new S3Bucket('email-parser-processing', {
        queryClient,
        user,
        tenant
      });

      await s3.uploadFile(file, { fileName });
      await s3.queueDocumentParsing();
    } catch (error) {
      rollbar.error(formatRollbarTitle('Upload', 'Document Upload Error'), error);
      setIsSubmitting(false);
    }

    setIsSubmitting(false);
    resetForm();
    disclosure.onClose();
  };

  const validateFile = createFileValidator({ maxSizeMB: MAX_DOC_FILE_SIZE_MB });

  return (
    <Modal
      {...disclosure}
      variant='classic'
      scrollBehavior='inside'
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
            <Text variant='body-600-md'>{t('summarizeDocument.summarizeADocument')}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={6}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack gap={6}>
              <Stack gap={2}>
                <Text
                  variant='body-600-sm'
                  color={errors?.file ? 'critical.primary' : 'surface.onSurface'}
                >
                  {t('summarizeDocument.uploadFile')}
                </Text>
                <Controller
                  control={control}
                  name='file'
                  rules={{
                    required: 'Add a file'
                  }}
                  render={({ field: { value, onChange } }) => (
                    <DocumentDropzone
                      file={value}
                      onFileLoad={(file) => {
                        onChange(file);
                        setValue('fileName', file.name);
                      }}
                      onFileRemove={() => setValue('fileName', '')}
                      validateFile={validateFile}
                      maxFileSize={maxFileSizeBytes(MAX_DOC_FILE_SIZE_MB)}
                      helperText={{
                        heading: 'Drag & drop document files here',
                        subtext: `Upload PDF, CSV, TXT, DOC(X), XLS(X) (Max size: ${MAX_DOC_FILE_SIZE_MB}MB)`
                      }}
                      accept={ACCEPTED_DOC_FILE_FORMATS}
                      onError={(error) => {
                        if (!error) {
                          clearErrors('file');
                        } else {
                          setError('file', { message: error.message });
                          setValue('fileName', '');
                        }
                      }}
                    />
                  )}
                />
                <Collapse in={!!errors?.file}>
                  <Text
                    color='critical.primary'
                    variant='label-600-md'
                  >
                    {errors?.file?.message}
                  </Text>
                </Collapse>
              </Stack>
              <Stack gap={2}>
                <Text
                  variant='body-600-sm'
                  color={errors?.fileName ? 'critical.primary' : 'surface.onSurface'}
                >
                  {t('summarizeDocument.fileName')}
                </Text>
                <Input
                  placeholder={t('summarizeDocument.yourFileNamePlaceholder')}
                  {...register('fileName', { required: 'Add a file name' })}
                />
                <Collapse in={!!errors?.fileName}>
                  <Text
                    color='critical.primary'
                    variant='label-600-md'
                  >
                    {errors?.fileName?.message}
                  </Text>
                </Collapse>
              </Stack>
              <HStack w='full'>
                <Collapse
                  style={{ width: '100%' }}
                  in={!!errors?.fileName || !!errors?.file}
                >
                  <HStack
                    h={10}
                    w='full'
                    bgColor='critical.containerLow'
                    borderRadius='8px'
                  >
                    <Text
                      px={5}
                      py={2}
                      color='critical.onContainer'
                      variant='body-reg-sm'
                    >
                      {t('summarizeDocument.pleaseResolveTheRequired')}
                    </Text>
                  </HStack>
                </Collapse>
                <Spacer />
                <Button
                  alignSelf='end'
                  type='submit'
                  variant='reskinPrimary'
                  size='reskinLg'
                  borderRadius='lg'
                  isLoading={isSubmitting}
                  data-testid='summarize-document-button'
                >
                  {t('summarizeDocument.summarize')}
                </Button>
              </HStack>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SummarizeDocument;
