import {
  HStack,
  ModalCloseButton,
  Spacer,
  Text,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Box,
  Button,
  ButtonGroup
} from '@chakra-ui/react';
import { Controller, FormProvider, useForm } from 'react-hook-form';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { convertTeamsChannelToFormValues, convertTeamsFormValuesToChannel } from '@util/helpers';
import {
  authorizeMicrosoftAsAdmin,
  useMultipleTeamChannels,
  useMyTeams
} from '@services/query-services/teams.query-service';
import { useCreateDigest, useDigestModalConfigVals, useEditDigest } from '@util/hooks';
import { SFPlusCircleIcon, TeamsIcon } from '@assets/icons';

import DigestForm from './digest-form.component';
import StepWithLabelComponent from '@components/general/form/step-with-label.component';
import TeamsChannelsSelector from './teams-channels-selector.component';
import InfoBlurb from '@components/general/info-blurb.component';
import { useTranslation } from 'react-i18next';

const defaultValues = {
  cadenceInterval: 'daily',
  metadata: {
    channels: {}
  },
  identifiers: new Set()
};

export default function TeamsDigestModal({ isEdit, digest, disclosure }) {
  const { t } = useTranslation();

  const [hasInitializedEditVals, setHasInitializedEditVals] = useState(false);
  const { onPatch, isPatching } = useEditDigest('Teams', digest, () => disclosure.onClose());
  const { onCreate, isCreating } = useCreateDigest('Teams', () => disclosure.onClose());
  const { userTz, tenantTz, tenantHasAccess, isAdminOrExecutive } =
    useDigestModalConfigVals('Teams');
  const form = useForm({ defaultValues });

  // queries
  const { data: allTeams } = useMyTeams();
  const allTeamsChannelQueries = useMultipleTeamChannels({
    teamIds: allTeams?.map((team) => team.id),
    mine: true
  });
  const allTeamsChannels = allTeamsChannelQueries.map((query) => query.data);

  // form
  const channels = form.watch('metadata.channels');
  const onChannelsChange = (metadata) => form.setValue('metadata.channels', metadata);
  const toSelectAllChannelsOption = {
    label: (
      <HStack textStyle='label-500-lg'>
        <Text as='span'>{t('teamsDigestModal.summarizeAllCurrentFuture')}</Text>
        <Text
          as='span'
          color='surface.outline'
        >
          {t('teamsDigestModal.addsFutureChannelsAutomatically')}
        </Text>
      </HStack>
    ),
    value: 'allChannels'
  };

  useEffect(() => {
    // reset form prefilling when new digest passed
    if (isEdit) {
      setHasInitializedEditVals(false);
    }
  }, [digest?.id, isEdit]);

  useEffect(() => {
    // populate all existing values when digest and channels are fetched
    if (isEdit && !hasInitializedEditVals && digest && allTeamsChannels) {
      form.reset(convertTeamsChannelToFormValues(digest));
      setHasInitializedEditVals(true);
    }
  }, [isEdit, hasInitializedEditVals, digest, allTeamsChannels, form.reset]);

  useEffect(() => {
    form.reset(defaultValues);
  }, [form.formState.isSubmitSuccessful]);

  const onSubmit = async (formValues) => {
    const action = isEdit ? onPatch : onCreate;
    await action(convertTeamsFormValuesToChannel(formValues, true, userTz ?? tenantTz));
  };

  return (
    <Modal
      {...disclosure}
      onClose={() => {
        setHasInitializedEditVals(false);
        disclosure.onClose();
        form.reset(defaultValues);
      }}
      variant='classic'
      size='2xl'
    >
      <ModalOverlay />
      <ModalContent minH={{ base: 'unset', lg: 'fit-content' }}>
        <ModalHeader>
          <HStack>
            <SFPlusCircleIcon
              color='brand.onPrimary'
              boxSize={7}
              p={1}
            />
            <Text variant='body-600-md'>
              {isEdit ? t('common.edit') : t('teamsDigestModal.createA')} Teams Digest
            </Text>
            <Spacer />
            <ModalCloseButton rounded='full' />
          </HStack>
        </ModalHeader>
        <ModalBody>
          {tenantHasAccess ? (
            <FormProvider {...form}>
              <DigestForm
                isEdit={isEdit}
                sourceType='Teams'
                parentDisclosure={disclosure}
                isSubmitting={isCreating || isPatching}
                onSubmit={onSubmit}
              >
                <Controller
                  control={form.control}
                  name='identifiers'
                  rules={{
                    validate: {
                      required: (ids) => {
                        if (!ids || ids?.size === 0) {
                          return 'Select channel(s) to summarize';
                        }
                      }
                    }
                  }}
                  render={({ field: { name, value, onChange }, fieldState }) => (
                    <StepWithLabelComponent
                      name={name}
                      fieldState={fieldState}
                      label={t('teamsDigestModal.whichTeamsChannelsDo')}
                    >
                      <TeamsChannelsSelector
                        isInvalid={fieldState.invalid}
                        allTeams={allTeams}
                        allTeamsChannels={allTeamsChannels}
                        identifiers={value}
                        onIdentifiersChange={onChange}
                        channels={channels}
                        onChannelsChange={onChannelsChange}
                        toSelectAllChannelsOption={toSelectAllChannelsOption}
                      />
                    </StepWithLabelComponent>
                  )}
                />
              </DigestForm>
            </FormProvider>
          ) : (
            <Box p={6}>
              <InfoBlurb
                title={t('teamsDigestModal.connectTeams')}
                icon={<TeamsIcon boxSize={10} />}
                iconWrapperProps={{
                  bgColor: 'surface.containerLowest',
                  borderRadius: 'xl'
                }}
                onCloseClick={() => disclosure.onClose()}
                footer={
                  isAdminOrExecutive ? (
                    <ButtonGroup alignSelf='flex-end'>
                      <Button
                        size='reskinMd'
                        variant='reskinWhite'
                        border='none'
                        as={ReactRouterLink}
                        to='https://intercom.help/fora/en/articles/11464187-fora-teams-digest-configuration'
                        target='_blank'
                      >
                        {t('teamsDigestModal.learnMore')}
                      </Button>
                      <Button
                        size='reskinMd'
                        onClick={() => authorizeMicrosoftAsAdmin()}
                      >
                        {t('teamsDigestModal.connectTeams')}
                      </Button>
                    </ButtonGroup>
                  ) : null
                }
              >
                FORA needs access to your Microsoft Teams workspace in order to create digests of
                your teams and channels.
                {!isAdminOrExecutive && t('teamsDigestModal.contactUsOrYour')}
              </InfoBlurb>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
