import {
  Button,
  Collapse,
  Flex,
  HStack,
  ModalCloseButton,
  Spacer,
  Stack,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { useState } from 'react';
import { map } from 'lodash-es';

import { useUserStore } from '@store/app.store';
import { useStyledToast } from '@util/hooks';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import { SFEnvelopeIcon, SFEyeIcon, SFPaperPlaneIcon } from '@assets/icons';
import { useShareCard } from '@services/query-services/cards.query-service';

import { EarningsCallHeaderCardWrapper } from '@pages/earnings-call/earnings-call-header-card.component';
import StyledModal from '@components/general/modals/styled-modal.component';
import ShareSummary from '@components/share-summary/share-summary.component';
import EarningsCallPDF from '@components/pdf/earnings-call-pdf.component';
import MeetingSummary from '@components/meeting/meeting-summary.component';
import { useTranslation } from 'react-i18next';

export default function ShareEarningsCallModal({ card, topicGroups, earningsCallDate }) {
  const { t } = useTranslation();

  const toast = useStyledToast();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const shareEarningsCallDisclosure = useDisclosure();
  const userName = useUserStore((state) => state?.user?.name);
  const tenantName = useUserStore((state) => state.tenant?.mname);
  const { mutateAsync: shareCard, isLoading: isSharing } = useShareCard();

  const handleShareSubmit = async (values) => {
    await shareCard(
      {
        id: card?.id,
        body: {
          emails: map(values?.recipients, 'email'),
          message: values?.message,
          guest: values?.guest
        }
      },
      {
        onSuccess: () => {
          toast({
            title: t('shareEarningsCallModal.successfullySharedEarningsCall'),
            status: 'success',
            isClosable: true
          });
          shareEarningsCallDisclosure.onClose();
        },
        onError: () => {
          toast({
            title: t('shareEarningsCallModal.somethingWentWrongWhile'),
            status: 'error',
            isClosable: true
          });
        }
      }
    );
  };

  return (
    <StyledModal
      title={t('shareEarningsCallModal.sendTo')}
      openButton={
        <Button
          size='reskinMd'
          variant='reskinWhite'
          px={2}
          leftIcon={
            <SFPaperPlaneIcon
              boxSize='16px'
              color='brandPrimary.primary'
            />
          }
        >
          {t('common.share')}
        </Button>
      }
      disclosure={shareEarningsCallDisclosure}
      modalProps={{ scrollBehavior: 'inside', blockScrollOnMount: false }}
      modalContentProps={{ maxH: 'calc(100vh - 48px)', w: { base: '550px' } }}
      modalBodyProps={{
        overflowY: 'scroll',
        sx: HIDE_SCROLLBAR
      }}
      customHeader={
        <HStack
          color='brandPrimary.onPrimary'
          bgColor='brandPrimary.primary'
          py={4}
          px={{ base: 6, sm: 4 }}
        >
          <SFEnvelopeIcon boxSize={5} />
          <Text fontWeight={500}>{t('shareEarningsCallModal.shareSummary')}</Text>
          <Spacer />
          <ModalCloseButton />
        </HStack>
      }
    >
      {shareEarningsCallDisclosure.isOpen && (
        <ShareSummary
          isSensitive={false}
          enableShareViaWeb={false}
          isSubmitting={isSharing}
          onSubmit={handleShareSubmit}
          disclosure={shareEarningsCallDisclosure}
          pdfTitle={card?.source_data?.title}
          pdfDocument={
            <EarningsCallPDF
              card={card}
              earningsCallDate={earningsCallDate}
              topicGroups={topicGroups}
              userName={userName}
              tenantName={tenantName}
            />
          }
        >
          <EarningsCallHeaderCardWrapper
            card={card}
            earningsCallDate={earningsCallDate}
          >
            <Flex
              as='button'
              gap={1.5}
              p='13px'
              align='center'
              borderBottomLeftRadius={isPreviewOpen ? 'unset' : 'inherit'}
              borderBottomRightRadius={isPreviewOpen ? 'unset' : 'inherit'}
              bg='brandPrimary.container'
              color='brandPrimary.primary'
              onClick={() => setIsPreviewOpen(true)}
            >
              <SFEyeIcon
                boxSize={6}
                p='1px'
              />
              <Text
                fontSize='sm'
                fontWeight={500}
              >
                {t('shareEarningsCallModal.previewSharedSummary')}
              </Text>
            </Flex>
            {isPreviewOpen && (
              <Collapse
                in={isPreviewOpen}
                animateOpacity
              >
                <Stack
                  maxH={44}
                  overflowY='scroll'
                >
                  <MeetingSummary
                    card={card}
                    showMenu={false}
                    border='none'
                    bgColor='transparent'
                  />
                </Stack>
              </Collapse>
            )}
          </EarningsCallHeaderCardWrapper>
        </ShareSummary>
      )}
    </StyledModal>
  );
}
