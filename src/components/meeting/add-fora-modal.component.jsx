import { Button, Divider, Flex, HStack, Spacer, Text, useDisclosure } from '@chakra-ui/react';
import { useState } from 'react';

import {
  useScheduleBotForMeeting,
  useUpdateMeetingInitiative
} from '@services/query-services/meetings.query-service.js';
import { formatMeetingDateTime } from '@util/helpers';
import SourceInfoStack from '@components/general/source-info-stack.component.jsx';
import FocusSelect from '@components/general/focus-select.component.jsx';
import StyledModal from '@components/general/modals/styled-modal.component';
import { useStyledToast } from '@util/hooks';
import { useTranslation } from 'react-i18next';

export default function AddForaModal({ meeting, disclosure }) {
  const { t } = useTranslation();

  const toast = useStyledToast();
  const [newInitiative, setNewInitiative] = useState(meeting?.initiative);
  const { mutateAsync: updateMeetingInitiative, isLoading: isUpdatingMeetingInitiative } =
    useUpdateMeetingInitiative();
  const { mutateAsync: scheduleBotForMeeting, isLoading: isScheduling } =
    useScheduleBotForMeeting();

  // reskin todo: this is _sort of_ a copy of `useAddFora`. Let's try and simplify the logic with this and the rest of the meeting actions menu
  const addFORA = async () => {
    await updateMeetingInitiative({
      id: meeting.id,
      value: newInitiative.id
    });
    await scheduleBotForMeeting(
      {
        meetingId: meeting?.id
      },
      {
        onSuccess: disclosure.onClose,
        onError: (err) => {
          const resErrMsg = err?.response?.data?.errors[0];
          let reason = 'Please try again.';
          if (resErrMsg === 'url must be provided.') {
            reason = 'Meeting does not have a URL.';
          }
          toast({ status: 'error', title: `Could not add FORA to meeting. ${reason}` });
        }
      }
    );
  };

  const focusSelectDisclosure = useDisclosure();

  return (
    <StyledModal
      disclosure={disclosure}
      title={t('addForaModal.addForaToThis')}
      modalContentProps={{ w: '440px' }}
    >
      <Flex
        flexDir='column'
        gap={6}
        p={4}
        mt={2}
      >
        <Flex
          flexDir='column'
          gap={2}
        >
          <Text
            fontSize='lg'
            fontWeight={700}
          >
            {meeting?.title}
          </Text>
          <HStack gap={4}>
            <SourceInfoStack
              source={meeting}
              sourceType='Meeting'
              participants={meeting?.nylas?.participants || []}
              participantsFormat='short'
              gap={4}
            />
            <Text
              fontSize='sm'
              color='surface.onSurfaceVariant'
            >
              {formatMeetingDateTime(meeting, 'short-P')}
            </Text>
          </HStack>
        </Flex>
        <Divider />
        <Flex
          flexDir='column'
          gap={4}
        >
          <Text variant='content-section-header'>{t('addForaModal.category')}</Text>
          <FocusSelect
            isOpen={focusSelectDisclosure.isOpen}
            onOpen={focusSelectDisclosure.onOpen}
            onClose={focusSelectDisclosure.onClose}
            focus={newInitiative}
            onChange={(i) => setNewInitiative(i)}
            initiativeMatch={meeting?.initiative_match}
          />
        </Flex>
        <Spacer />
        <Button
          size='reskinLg'
          w='full'
          variant='reskinPrimary'
          onClick={() => addFORA()}
          isLoading={isUpdatingMeetingInitiative || isScheduling}
        >
          {t('addForaModal.addFora')}
        </Button>
      </Flex>
    </StyledModal>
  );
}
