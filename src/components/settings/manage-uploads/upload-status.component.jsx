import { Text, Flex } from '@chakra-ui/react';

import { getDocumentUploadStatus } from '@util/helpers';
import { useControlBarState } from '@util/hooks';

export default function UploadStatus({ upload, cards, type }) {
  if (type === 'Meeting') return <UploadStatusMeeting upload={upload} />;

  return (
    <UploadStatusDocument
      upload={upload}
      cards={cards}
    />
  );
}

function UploadStatusDocument({ upload, cards }) {
  const status = getDocumentUploadStatus(upload, cards);

  return (
    <Flex
      gap={1.5}
      align='center'
    >
      {status.icon}
      <Text
        fontSize='sm'
        textAlign='right'
        color='surface.onSurfaceVariant'
        whiteSpace='nowrap'
        overflow='hidden'
        textOverflow='ellipsis'
      >
        {status.text}
      </Text>
    </Flex>
  );
}

function UploadStatusMeeting({ upload }) {
  const controlBarState = useControlBarState(upload, upload?.bot);

  return (
    <Flex gap={1.5}>
      <Text
        w='200px'
        fontSize='sm'
        color='surface.onSurfaceVariant'
        whiteSpace='nowrap'
        overflow='hidden'
        textOverflow='ellipsis'
      >
        {controlBarState.text}
      </Text>
    </Flex>
  );
}
