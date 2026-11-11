import { Box, Divider, Button } from '@chakra-ui/react';

import { SFListBulletIndentIcon, SFSquareOnSquareIcon } from '@assets/icons';
import { useMeetingManagementActions, useCopyToClipboard } from '@util/hooks';
import { useBotAsVTT } from '@services/query-services/bots.query-service';
import { HIDE_SCROLLBAR } from '@styles/css-configs';

import StyledModal from '@components/general/modals/styled-modal.component';
import Transcripts from '@components/meeting/transcripts.component';
import SectionHeader from '@components/meeting/section-header.component';
import { useTranslation } from 'react-i18next';

export default function TranscriptModal({ disclosure, meeting, bot, ...styledModalProps }) {
  const { t } = useTranslation();

  const copyToClipboard = useCopyToClipboard();
  const { pauseResume } = useMeetingManagementActions(meeting, bot);
  const { data: vtt } = useBotAsVTT(bot?.id, { enabled: !!bot?.id });

  return (
    <StyledModal
      title={t('transcriptModal.transcript')}
      disclosure={disclosure}
      modalProps={{ scrollBehavior: 'inside' }}
      modalContentProps={{ maxH: '80vh', minWidth: { base: '95%', sm: '60%' } }}
      modalBodyProps={{
        overflowy: 'scroll',
        sx: HIDE_SCROLLBAR
      }}
      customHeader={
        <>
          <Box px={1}>
            <SectionHeader
              headline='Transcript'
              meeting={meeting}
              icon={SFListBulletIndentIcon}
              inModal
            />
          </Box>
          <Divider />
        </>
      }
      customFooter={
        <Button
          position='absolute'
          bottom={4}
          right={4}
          zIndex='10'
          leftIcon={
            <SFSquareOnSquareIcon
              boxSize={5}
              color='brandPrimary.onPrimary'
            />
          }
          variant='reskinPrimary'
          onClick={() => copyToClipboard(vtt)}
        >
          {t('transcriptModal.copyTranscript')}
        </Button>
      }
      {...styledModalProps}
    >
      <Transcripts
        bot={bot}
        pauseResume={pauseResume}
        disclosure={disclosure}
      />
    </StyledModal>
  );
}
