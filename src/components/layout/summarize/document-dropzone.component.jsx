import {
  Button,
  Center,
  CloseButton,
  defineStyle,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
  VStack
} from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';

import { SFCheckIconCircleFilled, UploadIcon } from '@assets/icons';
import { useTranslation } from 'react-i18next';

/**
 * @typedef {Object} FileError
 * @property {string} message
 * @property {ErrorCode | string} code
 */

/**
 * accept file if null is returned, reject if error/s
 * @typedef {FileError | FileError[] | null} ValidationResponse
 */

/**
 * @param {File} file
 * @returns {ValidationResponse}
 */

/**
 * @param {Object} props
 * @param {(file: File) => void} props.onFileLoad
 * @param {() => void} props.onFileRemove
 * @param {(error: FileError) => void} props.onError
 */
const DocumentDropzone = ({
  file,
  onFileLoad,
  onFileRemove,
  onError,
  helperText,
  validateFile,
  maxFileSize,
  accept,
  maxFiles = 10
}) => {
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const removeFile = () => {
    onFileRemove();
    onFileLoad(null);
  };

  const onDrop = () => {
    setIsLoading(true);
  };

  const onDropAccepted = (acceptedFiles) => {
    setIsLoading(false);
    onFileLoad(acceptedFiles[0]);
  };

  const onDropRejected = () => {
    setIsLoading(false);
  };

  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject, isDragActive } =
    useDropzone({
      onDrop,
      onDropAccepted,
      onDropRejected,
      multiple: false,
      validator: (file) => validateFile(file, onError),
      maxSize: maxFileSize,
      maxFiles,
      accept
    });

  const dragActiveStyle = defineStyle({
    borderColor: 'brandPrimary.primary'
  });

  const focusedStyle = defineStyle({
    borderColor: 'brandPrimary.primary'
  });

  const acceptStyle = defineStyle({
    borderColor: 'positive.primary'
  });

  const rejectStyle = defineStyle({
    borderColor: 'critical.primary'
  });

  const stateStyles = useMemo(
    () => ({
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
      ...(isDragActive ? dragActiveStyle : {})
    }),
    [isFocused, isDragAccept, isDragReject, isDragActive]
  );

  const hasFile = !!file;
  const hasStartedUploading = isLoading || hasFile;
  const isUploaded = hasFile && !isLoading;

  return (
    <Stack
      {...getRootProps()}
      justify='center'
      minH='200px'
      borderRadius='xl'
      bgColor='brandPrimary.containerLow'
      color='surface.onSurfaceVariant'
      {...stateStyles}
    >
      {hasStartedUploading ? (
        <VStack p={5}>
          <HStack
            key={file.name}
            w='fit-content'
            rounded='lg'
            bgColor='brandPrimary.onContainer'
            color='brandPrimary.onPrimary'
            px={5}
            py={3}
            gap={3}
          >
            <Center boxSize={5}>
              {isUploaded ? (
                <SFCheckIconCircleFilled
                  w='full'
                  h='full'
                />
              ) : (
                <Spinner
                  h='full'
                  w='full'
                />
              )}
            </Center>
            <Text
              variant='body-600-md'
              maxW='500px'
              data-testid='dropzone-file-name'
            >
              {file?.name}
            </Text>
            <CloseButton
              size='sm'
              rounded='full'
              border='1px solid'
              borderColor='brandPrimary.onPrimary'
              top={2}
              right={2}
              onClick={() => removeFile()}
              data-testid='dropzone-close-button'
            />
          </HStack>
          <Text
            variant='body-500-sm'
            color='surface.onSurfaceVariant'
          >
            {isLoading ? 'Uploading...' : t('documentDropzone.uploadComplete')}
          </Text>
        </VStack>
      ) : (
        <VStack
          gap={0}
          p={5}
        >
          <Input
            {...getInputProps()}
            data-testid='dropzone-input'
          />
          <UploadIcon color='brandPrimary.primary' />
          <Text
            variant='body-600-md'
            color='surface.onSurface'
          >
            {helperText?.heading}
          </Text>
          <Text
            mt={1}
            variant='body-500-sm'
            data-testid='dropzone-help-text'
          >
            {helperText?.subtext}
          </Text>
          <Button
            mt={3}
            variant='reskinOutline'
            size='reskinMd'
            borderRadius='md'
          >
            {t('documentDropzone.selectFile')}
          </Button>
        </VStack>
      )}
    </Stack>
  );
};

export default DocumentDropzone;
