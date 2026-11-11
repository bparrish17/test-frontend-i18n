import { Spinner } from '@chakra-ui/react';
import { differenceInMinutes } from 'date-fns';

import { SFCheckIconCircleFilled, SFExclamationMarkTriangleOutlined } from '@assets/icons';

export const getUploadName = (upload) => {
  // If it's a meeting, use the title
  if (!upload || !Array.isArray(upload.results)) {
    return upload?.title || 'Untitled Meeting';
  }

  const originalFileEntry = getOriginalFileEntry(upload);
  if (!originalFileEntry) {
    return 'Unnamed File';
  }

  // Extract filename after the last slash
  const parts = originalFileEntry.split('/');
  let filename = parts[parts.length - 1];

  // Remove leading timestamp (digits followed by underscore)
  filename = filename.replace(/^\d+_/, '');

  return filename || 'Unnamed File';
};

export const findMatchingCard = (upload, cards, type) => {
  return cards?.find((c) => {
    if (type === 'Meeting') {
      return c.source_data.id === upload?.id;
    } else {
      return c.batch_id === upload.id;
    }
  });
};

export const getUploadLink = (upload, cards, type) => {
  if (type === 'Meeting') return `/meeting/${upload?.id}`;

  const card = findMatchingCard(upload, cards, type);
  if (card) return `/cards/${card.id}`;

  return null;
};

export const getDocumentUploadStatus = (upload, cards) => {
  const card = findMatchingCard(upload, cards, 'document');
  const isOldUpload = differenceInMinutes(new Date(), upload?.created_at) > 60;

  if (card) {
    return {
      icon: (
        <SFCheckIconCircleFilled
          color='brandPrimary.onContainer'
          boxSize={4}
        />
      ),
      text: 'Summarized'
    };
  } else if (isOldUpload) {
    return {
      icon: (
        <SFExclamationMarkTriangleOutlined
          color='brandPrimary.onContainer'
          boxSize={4}
        />
      ),
      text: 'Upload Failed'
    };
  } else {
    return {
      icon: (
        <Spinner
          size='sm'
          speed='0.8s'
          color='brandPrimary.primary'
          mr={1}
        />
      ),
      text: 'Summarizing'
    };
  }
};

export const getOriginalFileEntry = (upload) => {
  if (!upload || !Array.isArray(upload.results)) {
    return null;
  }

  return upload.results
    .find((r) => r.startsWith('original_file:'))
    ?.split('original_file:')
    ?.pop();
};
