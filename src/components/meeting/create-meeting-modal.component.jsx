import {
  Button,
  Divider,
  HStack,
  Stack,
  ModalCloseButton,
  Text,
  FormControl,
  Input,
  FormErrorMessage,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Modal,
  Collapse,
  Spacer,
  Icon,
  Select
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { addHours, format, isBefore, set } from 'date-fns';
import { Controller, useForm } from 'react-hook-form';
import { useRollbar } from '@rollbar/react';
import { useStatsigClient } from '@statsig/react-bindings';

import { SFCalendarIcon } from '@assets/icons';
import { useUserStore } from '@store/app.store';
import {
  useCreateMeeting,
  useScheduleBotForMeeting
} from '@services/query-services/meetings.query-service.js';
import { useInitiativeOptions } from '@services/query-services/initiatives.query-service';
import { useBreakpoints, useStyledToast } from '@util/hooks';
import CustomSelect from '@components/general/form/custom-select.component';
import FormInput from '@components/general/form/form-input.component';
import StyledModal from '@components/general/modals/styled-modal.component';
import { useTranslation } from 'react-i18next';

const zoomPattern = /https:\/\/[\w-]*\.?zoom.us\/(j|my|w)\/[\d\w?=-]+/;
const meetPattern = /https:\/\/meet.google.com\/[a-z]{3}-[a-z]{4}-[a-z]{3}/;
const teamsPattern = /https:\/\/teams.microsoft.com\/.+/;

export default function CreateMeetingModal(props) {
  const { checkGate } = useStatsigClient();
  const isSummarizeMenuEnabled = checkGate('summarize-menu');
  return isSummarizeMenuEnabled ? (
    <NewCreateMeetingModal {...props} />
  ) : (
    <LegacyCreateMeetingModal {...props} />
  );
}

function NewCreateMeetingModal({ disclosure, modalContentProps, onClose }) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const isGuest = user?.isGuest;
  const { data: initiativeOptions } = useInitiativeOptions(
    { type: 'Focus' },
    { enabled: !!(user && !isGuest) }
  );
  const { mutateAsync: createMeeting, isLoading: isCreatingMeeting } = useCreateMeeting();
  const { mutateAsync: scheduleBotForMeeting, isLoading: isSchedulingBot } =
    useScheduleBotForMeeting();
  const navigate = useNavigate();
  const toast = useStyledToast();
  const rollbar = useRollbar();

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: user?.name ? `${user.name}'s Meeting` : ''
    }
  });

  const onSubmit = async (values) => {
    try {
      const meeting = await createMeeting({
        title: values.title,
        description: values.url,
        url: values.url.trim(),
        start_at: new Date().getTime(),
        // add 1 hour
        end_at: addHours(new Date(), 1).getTime(),
        bot_attendee: true,
        initiative: values.initiative ? { id: values.initiative.value } : null,
        attendees: [
          {
            id: user?.id,
            status: { id: 'a' }
          }
        ]
      });

      await scheduleBotForMeeting(
        {
          meetingId: meeting?.id
        },
        {
          onSuccess: () => {
            disclosure.onClose();
            // additional onClose function can be triggered.
            // Used primarily on mobile (closing the header component)
            if (onClose) onClose();
            navigate(`/meeting/${meeting?.id}`);
          }
        }
      );
    } catch (e) {
      rollbar?.error('Error creating meeting', e);
      toast({
        title: t('createMeetingModal.somethingWentWrongWhile'),
        description: `Desc: ${e}`,
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <Modal
      {...disclosure}
      variant='classic'
      scrollBehavior='inside'
      onCloseComplete={() => {
        reset();
      }}
    >
      <ModalOverlay />
      <ModalContent
        maxW='434px'
        {...modalContentProps}
      >
        <ModalHeader>
          <HStack>
            <SFCalendarIcon
              boxSize={7}
              p={1}
            />
            <Text variant='body-600-md'>{t('createMeetingModal.addForaToA')}</Text>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody data-testid='create-meeting-modal'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack
              gap={6}
              p={6}
            >
              <Stack>
                <Text
                  variant='label-caps-600-sm'
                  color='surface.onSurfaceVariant'
                >
                  {t('createMeetingModal.addLink')}
                </Text>
                <Input
                  data-testid='link-input'
                  placeholder={t('createMeetingModal.conferenceLinkPlaceholder')}
                  textStyle='label-600-sm'
                  {...register('url', {
                    required: true,
                    validate: {
                      checkUrl: (v) => {
                        if (!v) return true;
                        v = v.trim();
                        return (
                          zoomPattern.test(v) ||
                          meetPattern.test(v) ||
                          teamsPattern.test(v) ||
                          'Please enter a valid videoconferencing link.'
                        );
                      }
                    }
                  })}
                />
                <Collapse in={!!errors.url}>
                  <Text
                    color='critical.primary'
                    fontSize='sm'
                  >
                    {t('createMeetingModal.pleaseEnterAValid')}
                  </Text>
                </Collapse>
              </Stack>
              <Stack>
                <Text
                  variant='label-caps-600-sm'
                  color='surface.onSurfaceVariant'
                >
                  {t('createMeetingModal.meetingName')}
                </Text>
                <Input
                  data-testid='meeting-name-input'
                  placeholder={t('createMeetingModal.meetingNamePlaceholder')}
                  textStyle='label-600-sm'
                  {...register('title', {
                    required: true
                  })}
                />
                <Collapse in={!!errors.title}>
                  <Text
                    color='critical.primary'
                    fontSize='sm'
                  >
                    {t('createMeetingModal.pleaseEnterAMeeting')}
                  </Text>
                </Collapse>
              </Stack>
              <Stack>
                <Text
                  variant='label-caps-600-sm'
                  color='surface.onSurfaceVariant'
                >
                  {t('createMeetingModal.meetingCategory')}
                </Text>
                <FormControl
                  key='initiative'
                  w='full'
                  isInvalid={errors.initiative}
                >
                  <Controller
                    control={control}
                    name='initiative'
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                      <CustomSelect
                        getValueLabel={(opt) => opt?.label}
                        getOptionValue={(opt) => opt?.value}
                        menuPosition='fixed'
                        size='md'
                        isMulti={false}
                        placeholder={t('createMeetingModal.chooseCategoryPlaceholder')}
                        options={initiativeOptions}
                        value={value}
                        onChange={onChange}
                      />
                    )}
                  />
                  {errors?.initiative && (
                    <FormErrorMessage
                      color='critical.primary'
                      size='lg'
                    >
                      {t('createMeetingModal.pleaseSelectAMeeting')}
                    </FormErrorMessage>
                  )}
                </FormControl>
              </Stack>
              <Divider />
              <Button
                placeSelf='end'
                type='submit'
                variant='reskinPrimary'
                isLoading={isCreatingMeeting || isSchedulingBot}
              >
                {t('createMeetingModal.addFora')}
              </Button>
            </Stack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

const fieldProps = {
  fontWeight: 500,
  bgColor: 'surface.container',
  _hover: { bgColor: 'surface.container' },
  _focusVisible: { bgColor: 'surface.container' }
};

function LegacyCreateMeetingModal({ disclosure, modalContentProps, onClose }) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const { data: initiativeOptions } = useInitiativeOptions({ type: 'Focus' });
  const { mutateAsync: createMeeting, isLoading: isCreatingMeeting } = useCreateMeeting();
  const { mutateAsync: scheduleBotForMeeting, isLoading: isSchedulingBot } =
    useScheduleBotForMeeting();
  const navigate = useNavigate();
  const toast = useStyledToast();
  const rollbar = useRollbar();

  const defaultValues = {
    start_at: format(new Date(), 'HH:mm'),
    end_at: format(addHours(new Date(), 1), 'HH:mm')
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors }
  } = useForm({ defaultValues });

  const { isMobile } = useBreakpoints();

  const validationProps = {
    deps: ['start_at', 'end_at'],
    setValueAs: (v) => {
      if (!v) return null;
      const [h, m] = v.split(':');
      return set(new Date(), { hours: h, minutes: m });
    },
    validate: {
      startIsBeforeEnd: (_v, formValues) => {
        const start = formValues.start_at;
        const end = formValues.end_at;
        return isBefore(start, end) || (!start && !end) || 'Start Time must be before End Time';
      }
    }
  };

  useEffect(() => {
    if (!disclosure.isOpen) {
      reset(defaultValues);
    }
  }, [disclosure.isOpen]);

  const onSubmit = async (values) => {
    try {
      const meeting = await createMeeting({
        title: values.title,
        description: values.url,
        url: values.url.trim(),
        start_at: (values?.start_at ?? new Date()).getTime(),
        // add 1 hour
        end_at: (values?.end_at ?? addHours(new Date(), 1)).getTime(),
        bot_attendee: true,
        initiative: values.initiative ? { id: values.initiative } : null,
        attendees: [
          {
            id: user?.id,
            status: { id: 'a' }
          }
        ]
      });

      await scheduleBotForMeeting(
        {
          meetingId: meeting?.id
        },
        {
          onSuccess: () => {
            disclosure.onClose();
            // additional onClose function can be triggered.
            // Used primarily on mobile (closing the header component)
            if (onClose) onClose();
            navigate(`/meeting/${meeting?.id}`);
          }
        }
      );
    } catch (e) {
      rollbar?.error('Error creating meeting', e);
      toast({
        title: t('createMeetingModal.somethingWentWrongWhile'),
        description: `Desc: ${e}`,
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <StyledModal
      disclosure={disclosure}
      modalContentProps={modalContentProps}
      customHeader={
        <HStack
          color='brandPrimary.onPrimary'
          bgColor='brandPrimary.primary'
          p={4}
          px={{ base: 6, sm: 4 }}
        >
          <Icon
            as={SFCalendarIcon}
            boxSize={5}
          />
          <Text fontWeight={500}>{t('createMeetingModal.addForaToA')}</Text>
          <Spacer />
          <ModalCloseButton />
        </HStack>
      }
    >
      <form
        data-testid='legacy-create-meeting-modal'
        onSubmit={handleSubmit(onSubmit)}
        style={{ width: '100%' }}
      >
        <Stack
          gap={6}
          p={6}
        >
          <Text>{t('createMeetingModal.whenYouAddFora')}</Text>
          <FormInput
            size='lg'
            w='100%'
            label={t('createMeetingModal.meetingTitle')}
            registerProps={{
              ...register('title', {
                required: true
              })
            }}
            formControlProps={{ isInvalid: errors?.title }}
            formErrorMessageProps={{ color: 'critical.primary' }}
            errorMsg='Please enter a meeting title.'
            {...fieldProps}
          />
          <FormInput
            size='lg'
            w='100%'
            label={t('createMeetingModal.videoconferencingLink')}
            registerProps={{
              ...register('url', {
                required: true,
                validate: {
                  checkUrl: (v) => {
                    if (!v) return true;
                    v = v.trim();
                    return (
                      zoomPattern.test(v) ||
                      meetPattern.test(v) ||
                      teamsPattern.test(v) ||
                      'Please enter a valid videoconferencing link.'
                    );
                  }
                }
              })
            }}
            formControlProps={{ isInvalid: errors?.url }}
            formErrorMessageProps={{ color: 'critical.primary' }}
            errorMsg='Please enter a valid videoconferencing link.'
            {...fieldProps}
          />
          <Stack>
            <HStack gap={2}>
              <FormControl
                key='start_at'
                variant='floating'
                w={{ base: '100%', md: 'fit-content' }}
              >
                <Input
                  type='time'
                  required={false}
                  {...fieldProps}
                  {...register('start_at', validationProps)}
                />
              </FormControl>
              <Text mx={3}>{t('createMeetingModal.to')}</Text>
              <FormControl
                key='end_at'
                variant='floating'
                w={{ base: '100%', md: 'fit-content' }}
              >
                <Input
                  type='time'
                  required={false}
                  {...fieldProps}
                  {...register('end_at', validationProps)}
                />
              </FormControl>
            </HStack>
            {errors?.start_at && (
              <Text
                color='critical.primary'
                fontSize='sm'
              >
                {errors?.start_at?.message}
              </Text>
            )}
          </Stack>
          <FormControl
            key='initiative'
            w={{ base: '100%', md: '50%' }}
            isInvalid={errors.initiative}
          >
            <Select
              key='initiative'
              placeholder={t('createMeetingModal.meetingTypePlaceholder')}
              {...register('initiative', { required: true })}
              {...fieldProps}
            >
              {initiativeOptions?.map((option) => {
                const { value: optionValue, label: optionLabel } = option;
                return (
                  <option
                    key={optionValue}
                    value={optionValue}
                  >
                    {optionLabel}
                  </option>
                );
              })}
            </Select>
            {errors?.initiative && (
              <FormErrorMessage
                color='critical.primary'
                size='lg'
              >
                {t('createMeetingModal.pleaseSelectAMeeting2')}
              </FormErrorMessage>
            )}
          </FormControl>
          <Divider />
          {isMobile ? (
            <Stack justifyContent='flex-end'>
              <ActionButtons
                disclosure={disclosure}
                isCreatingMeeting={isCreatingMeeting}
                isSchedulingBot={isSchedulingBot}
              />
            </Stack>
          ) : (
            <HStack justifyContent='flex-end'>
              <ActionButtons
                disclosure={disclosure}
                isCreatingMeeting={isCreatingMeeting}
                isSchedulingBot={isSchedulingBot}
              />
            </HStack>
          )}
        </Stack>
      </form>
    </StyledModal>
  );
}

function ActionButtons({ disclosure, isCreatingMeeting, isSchedulingBot }) {
  const { t } = useTranslation();

  return (
    <>
      <Button
        variant='reskinSecondary'
        onClick={disclosure.onClose}
      >
        {t('common.cancel')}
      </Button>
      <Button
        type='submit'
        variant='reskinPrimary'
        isLoading={isCreatingMeeting || isSchedulingBot}
      >
        {t('createMeetingModal.addFora')}
      </Button>
    </>
  );
}
