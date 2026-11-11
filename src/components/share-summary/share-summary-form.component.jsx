import { Divider, Stack, Textarea, Text, Box, Button, Icon } from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';

import { usePeople } from '@services/query-services/people.query-service';
import { filterForaEmailsInOtherTenants } from '@util/helpers';
import CustomSelect from '@components/general/form/custom-select.component.jsx';
import { SFPlusCircleFilledIcon } from '@assets/icons';

const validateEmails = (recipients) => {
  if (!recipients || recipients.length === 0) {
    return false;
  }

  return (
    recipients.every((recipient) =>
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(recipient.email)
    ) || 'One or more emails are invalid'
  );
};

const mergeAttendeesIntoRecipients = (attendees = [], currentRecipients = []) => {
  const currentEmails = new Set(currentRecipients.map((v) => v?.email?.toLowerCase()));

  const attendeeOptions = attendees
    .map((a) => a?.email.trim())
    .filter((email) => email.length > 0)
    .map((email) => ({ id: `custom-attendee-${email}`, name: email, email }))
    .filter((opt) => !currentEmails.has(opt.email.toLowerCase()));

  return [...currentRecipients, ...attendeeOptions];
};

export default function ShareSummaryForm({ isPDF, onSubmit, children, attendees }) {
  const { handleSubmit, register, control } = useForm();

  const { data: peopleOptions } = usePeople(
    { not_types: ['Associate'], active: true },
    { select: (people) => filterForaEmailsInOtherTenants(people) }
  );

  return (
    <Stack
      as='form'
      gap={6}
      onSubmit={handleSubmit(onSubmit)}
      style={{ width: '100%' }}
    >
      {!isPDF && (
        <>
          <Controller
            control={control}
            name='recipients'
            rules={{
              required: 'At least one recipient is required',
              validate: validateEmails
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => {
              return (
                <Box>
                  <CustomSelect
                    isCreatable
                    size='md'
                    selectProps={{ width: '100%' }}
                    placeholder='Add people and teams'
                    getOptionLabel={(opt) => {
                      if (opt?.__isNew__) return opt?.label;
                      return opt?.name && opt?.email ? `${opt?.name} (${opt?.email})` : '';
                    }}
                    getValueLabel={(opt) => opt?.name}
                    // eslint-disable-next-line
                    autoFocus
                    getOptionValue={(opt) => opt?.id}
                    options={peopleOptions}
                    value={value}
                    onChange={onChange}
                    chakraStyles={{
                      menuList: (baseStyles) => ({
                        ...baseStyles,
                        maxHeight: '90px'
                      })
                    }}
                  />
                  {attendees?.length > 0 && (
                    <Box
                      mt={2}
                      display='flex'
                      justifyContent='flex-end'
                    >
                      <Button
                        data-testid='all-attendees-button'
                        size='xs'
                        variant='reskinPrimary'
                        leftIcon={
                          <Icon
                            as={SFPlusCircleFilledIcon}
                            boxSize={4}
                            color='brandPrimary.onPrimary'
                          />
                        }
                        onClick={() => onChange(mergeAttendeesIntoRecipients(attendees, value))}
                      >
                        all attendees
                      </Button>
                    </Box>
                  )}
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
                </Box>
              );
            }}
          />
          <Textarea
            placeholder='Message (optional)'
            {...register('message', { required: false })}
            size='md'
          />
          <Divider />
        </>
      )}
      {children}
    </Stack>
  );
}
