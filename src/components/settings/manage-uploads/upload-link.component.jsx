import { useState } from 'react';
import { IconButton, Spinner } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { SFLinkIcon } from '@assets/icons';
import { getUploadLink, getOriginalFileEntry } from '@util/helpers';
import { getPresignedUrl } from '@services/query-services/lambda.query-service';

const DEFAULT_BUCKET_NAME = 'email-parser-processing';

export default function UploadLink({ upload, cards, type }) {
  const [isLoading, setIsLoading] = useState(false);
  const link = getUploadLink(upload, cards, type);

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const fileName = getOriginalFileEntry(upload);

      // Get presigned URL from backend
      const { url } = await getPresignedUrl({
        command: 'get',
        bucket: DEFAULT_BUCKET_NAME,
        fileName
      });

      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (err) {
      console.error('Failed to download file:', err);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <Spinner
        size='sm'
        speed='0.8s'
        color='brandPrimary.primary'
        mr={1}
        data-testid='loading-spinner'
      />
    );
  }

  return (
    <IconButton
      icon={<SFLinkIcon />}
      color='brandPrimary.primary'
      bgColor='white'
      _hover={{
        bgColor: 'brandPrimary.containerLow',
        textDecor: 'none'
      }}
      {...(type === 'Meeting'
        ? { as: Link, to: link }
        : {
            onClick: () => {
              handleDownload();
            }
          })}
    />
  );
}
