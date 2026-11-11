import {
  Alert,
  AlertIcon,
  HStack,
  ModalCloseButton,
  Spacer,
  Text,
  Link,
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
import { partition } from 'lodash-es';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useEffect, useState } from 'react';

import { authorizeSlack, useSlackChannels } from '@services/query-services/slack.query-service';
import {
  convertChannelToFormValues,
  convertFormValuesToChannel,
  toSelectOptions
} from '@util/helpers';
import { useCreateDigest, useDigestModalConfigVals, useEditDigest } from '@util/hooks';
import { SFBoxWithPencil, SFPlusCircleIcon, SlackIcon } from '@assets/icons';
import CustomSelect from '@components/general/form/custom-select.component';
import DigestForm from './digest-form.component';
import StepWithLabelComponent from '@components/general/form/step-with-label.component';
import InfoBlurb from '@components/general/info-blurb.component';

const defaultValues = { cadenceInterval: 'daily' };

export default function SlackDigestModal({ disclosure, digest, isEdit }) {
  const [hasInitializedEditVals, setHasInitializedEditVals] = useState(false);
  const { data: allSlackChannels } = useSlackChannels();
  const slackChannelOptions = groupChannelOptions(allSlackChannels, disclosure.onClose);
  const { isPatching, onPatch } = useEditDigest('Slack', digest, () => disclosure.onClose());
  const { isCreating, onCreate } = useCreateDigest('Slack', () => disclosure.onClose());
  const { userTz, tenantTz, tenantHasAccess, isAdminOrExecutive } =
    useDigestModalConfigVals('Slack');

  const form = useForm({ defaultValues: digest ?? defaultValues });

  useEffect(() => {
    // reset form prefilling when new digest passed
    if (isEdit) {
      setHasInitializedEditVals(false);
    }
  }, [digest?.id, isEdit]);

  useEffect(() => {
    // populate all existing values when digest and channels are fetched
    if (isEdit && !hasInitializedEditVals && digest && allSlackChannels) {
      const channelIdentifiers = new Set(digest.identifiers);

      form.reset({
        ...convertChannelToFormValues(digest),
        identifiers: toSelectOptions(
          'id',
          'name',
          true
        )(allSlackChannels).filter((chOption) => channelIdentifiers.has(chOption.value))
      });
      setHasInitializedEditVals(true);
    }
  }, [isEdit, hasInitializedEditVals, digest, allSlackChannels, form.reset]);

  useEffect(() => {
    form.reset(defaultValues);
  }, [form.formState.isSubmitSuccessful]);

  const onSubmit = async (formValues) => {
    const channelBody = convertFormValuesToChannel(formValues, userTz ?? tenantTz);
    const action = isEdit ? onPatch : onCreate;
    await action(channelBody);
  };

  return (
    <Modal
      {...disclosure}
      variant='classic'
      size='2xl'
      onClose={() => {
        setHasInitializedEditVals(false);
        disclosure.onClose();
        form.reset(defaultValues);
      }}
    >
      <ModalOverlay />
      <ModalContent minH={{ base: 'unset', lg: 'fit-content' }}>
        <ModalHeader>
          <HStack>
            {isEdit ? (
              <SFBoxWithPencil color='brandPrimary.onPrimary' />
            ) : (
              <SFPlusCircleIcon
                color='brandPrimary.onPrimary'
                boxSize={7}
                p={1}
              />
            )}

            <Text variant='body-600-md'>{isEdit ? 'Edit' : 'Create a'} Slack Digest</Text>
            <Spacer />
            <ModalCloseButton rounded='full' />
          </HStack>
        </ModalHeader>
        <ModalBody>
          {tenantHasAccess ? (
            <FormProvider {...form}>
              <DigestForm
                isEdit={isEdit}
                sourceType='Slack'
                parentDisclosure={disclosure}
                isSubmitting={isCreating || isPatching}
                onSubmit={onSubmit}
              >
                <Controller
                  control={form.control}
                  name='identifiers'
                  rules={{ required: 'At least one channel is required' }}
                  render={({ field: { name, value, onChange }, fieldState }) => (
                    <StepWithLabelComponent
                      name={name}
                      fieldState={fieldState}
                      label='Which channels do you want to summarize?'
                    >
                      <CustomSelect
                        size='md'
                        getOptionLabel={(opt) => `#${opt?.name}`}
                        getOptionValue={(opt) => opt?.id}
                        placeholder='Enter Slack channel names'
                        isOptionDisabled={(opt) => !opt.is_member}
                        value={value}
                        onChange={onChange}
                        options={slackChannelOptions}
                        filterOption={filterOption}
                      />
                    </StepWithLabelComponent>
                  )}
                />
              </DigestForm>
            </FormProvider>
          ) : (
            <Box p={6}>
              <InfoBlurb
                title='Connect Slack'
                icon={<SlackIcon boxSize={10} />}
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
                        to='https://intercom.help/fora/en/articles/11145895-fora-slack-digest-configuration'
                        target='_blank'
                      >
                        Learn More
                      </Button>
                      <Button
                        size='reskinMd'
                        onClick={() => authorizeSlack()}
                      >
                        Connect Slack
                      </Button>
                    </ButtonGroup>
                  ) : null
                }
              >
                FORA needs access to Slack in order to create Slack Digests of your channels.
                Contact us or your admin for details.
              </InfoBlurb>
            </Box>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

// have to manually filter cause of the group labels
function filterOption(option, query) {
  try {
    const regex = new RegExp(query, 'i'); // 'i' makes it case-insensitive
    return regex.test(option.data?.label);
  } catch (e) {
    return false;
  }
}

/**
 *
 * @param {SlackConversation[]} slackChannels
 * @param {() => void} onLearnMoreClick
 * @returns
 */
function groupChannelOptions(slackChannels, onLearnMoreClick) {
  const channelOptions = toSelectOptions('id', 'name', true)(slackChannels);
  const [summarizableOptions, disabledOptions] = partition(channelOptions, 'is_member');
  return [
    {
      label: 'Ready to Summarize',
      options: summarizableOptions
    },
    {
      label: (
        <Alert status='warning'>
          <AlertIcon />
          <Text
            as='span'
            variant='body-reg-sm'
            textTransform='none'
          >
            Add FORA integration to these channels to enable summarization.&nbsp;
            <Link
              href='https://intercom.help/fora/en/articles/11145895-fora-slack-digest-configuration'
              target='_blank'
              textDecor='underline'
              onClick={onLearnMoreClick}
            >
              Learn more
            </Link>
          </Text>
        </Alert>
      ),
      options: disabledOptions
    }
  ];
}
