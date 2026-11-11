import {
  Box,
  Button,
  Divider,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text
} from '@chakra-ui/react';
import { Controller, useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { sortBy } from 'lodash-es';

import { SFPlusIcon } from '@assets/icons';
import { useSetMeetingLabels } from '@services/query-services/meetings.query-service';
import { searchCards, useSetCardLabels } from '@services/query-services/cards.query-service';
import { useQueryStore, useUserStore } from '@store/app.store';
import { StatusTimeLabel } from '../card/status-time-label.component';
import ReskinCardHeader from '../card/reskin-card-structure/reskin-card-header.component';
import SourceLogo from '@components/general/source-logo.component';
import LabelSelect from '@components/general/labels/label-select.component';
import { useTranslation } from 'react-i18next';

const LabelsModal = ({ meeting, card: initialCard, disclosure }) => {
  const { t } = useTranslation();

  const feedCardsSearchBody = useQueryStore((state) => state.feedCardsSearchBody);
  const user = useUserStore((state) => state.user);
  const initialLabels = sortBy(meeting?.labels ?? initialCard?.labels ?? [], 'title');
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm({
    defaultValues: {
      labels: initialLabels
    }
  });

  const { mutateAsync: setMeetingLabels } = useSetMeetingLabels();
  const { mutateAsync: setCardLabels } = useSetCardLabels();

  const menuHeight = '120px';

  const onSubmit = async (values) => {
    const labels = values.labels.map((label) => ({
      id: label.id,
      title: label.title,
      match: label.match ?? 'Manual'
    }));

    const makeLabelsRequest = async (id, mutateAsync) => {
      if (labels?.length === 0) {
        return;
      }

      await mutateAsync({
        id,
        params: { sync: true },
        ...(labels?.length > 0 ? { body: labels } : {}),
        optimisticUpdateValue: labels
      });
    };

    if (meeting?.id) {
      await makeLabelsRequest(meeting?.id, setMeetingLabels);
    }

    const isInitialCardUsers = initialCard?.person?.id === user?.id;
    let usersCard;
    if (!isInitialCardUsers) {
      const cards = await searchCards({
        person_id: user?.id,
        source_data_id: initialCard?.source_data?.id,
        initiative_type: 'Focus'
      });
      usersCard = cards?.[0];
    }
    const card = isInitialCardUsers ? initialCard : usersCard;

    if (card?.id) {
      await makeLabelsRequest(card.id, setCardLabels);
    }

    const infiniteCardsQueryKey = ['cards', feedCardsSearchBody(user?.id)];
    const cardsQueryData = queryClient.getQueryData(infiniteCardsQueryKey);
    const updatedCardsQueryData = {
      ...cardsQueryData,
      pages: cardsQueryData?.pages?.map((page) => ({
        ...page,
        data: page.data.map((feedCard) => {
          if (card.id === feedCard.id) {
            feedCard.labels = labels;
          }
          return feedCard;
        })
      }))
    };
    queryClient.setQueryData(infiniteCardsQueryKey, updatedCardsQueryData);

    disclosure.onClose();
  };

  return (
    <Modal
      {...disclosure}
      variant='classic'
      scrollBehavior='outside'
    >
      <ModalOverlay />
      <ModalContent maxW='720px'>
        <ModalHeader>
          <HStack>
            <SFPlusIcon />
            <Text variant='body-600-md'>{t('labelsModal.addAndEditLabels')}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody data-testid='labels-modal'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack>
              <ReskinCardHeader
                title={initialCard?.source_data?.title ?? meeting?.title}
                p={4}
                leftElement={
                  initialCard && (
                    <SourceLogo
                      sourceType={initialCard?.source}
                      subSource={initialCard?.sub_source}
                      source={initialCard?.source_data}
                      tags={initialCard?.tags}
                      boxSize={4}
                    />
                  )
                }
              >
                <StatusTimeLabel
                  meeting={meeting}
                  bot={meeting?.bot}
                  showStatus={false}
                  includeDate
                  showFullDate
                  showAgoText
                  px={0}
                />
              </ReskinCardHeader>

              <Divider />

              <Stack
                px={6}
                py={4}
              >
                <Controller
                  control={control}
                  name='labels'
                  render={({ field: { onChange, value }, fieldState: { error } }) => {
                    return (
                      <>
                        <LabelSelect
                          value={value}
                          onChange={onChange}
                          getOptionValue={(opt) => opt?.id}
                          shouldAutoFocus={false}
                          chakraStyles={{
                            menuList: (baseStyles) => ({
                              ...baseStyles,
                              maxHeight: menuHeight
                            })
                          }}
                        />
                        {error && (
                          <Text
                            mt={1}
                            ml={4}
                            color='critical.primary'
                            fontSize='sm'
                          >
                            {error.message}
                          </Text>
                        )}
                      </>
                    );
                  }}
                />
                <Box h={menuHeight} />
                <HStack justify='space-between'>
                  <Button
                    onClick={disclosure.onClose}
                    variant='reskinSecondary'
                  >
                    {t('common.cancel')}
                  </Button>
                  <Button
                    isLoading={isSubmitting}
                    variant='reskinPrimary'
                    type='submit'
                  >
                    {t('common.done')}
                  </Button>
                </HStack>
              </Stack>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default LabelsModal;
