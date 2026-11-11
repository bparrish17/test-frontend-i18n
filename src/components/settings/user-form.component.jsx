import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';

import { Button, Flex, Stack, Switch, Text, VStack } from '@chakra-ui/react';
import CustomSelect from '@components/general/form/custom-select.component';
import FormInput from '@components/general/form/form-input.component';

import StyledSelect from '@components/general/styled-select.component';
import { userTypeOptions } from '@util/constants';
import { useTranslation } from 'react-i18next';

export default function UserForm({ onFinish, managerOptions = [], user, isSubmitting }) {
  const { t } = useTranslation();

  const form = useForm({ defaultValues: { ...user } });
  const {
    register,
    formState: { errors, isDirty }
  } = form;
  const { handleSubmit, reset, control } = form;
  const [manager, setManager] = useState();
  const initialDepartments = user?.departments
    ? user.departments.map((dept) => ({ label: dept, value: dept, id: 'custom' }))
    : [];
  const [departments, setDepartments] = useState(initialDepartments);
  const fromForaDay = !user?.external_id;

  useEffect(() => {
    const curManager = managerOptions.find((option) => option?.id === user?.manager?.id);
    if (curManager) {
      const { name, email, id } = curManager;
      setManager({ label: `${name} <${email}>`, id, email, name });
    }
  }, [user?.manager]);

  useEffect(() => {
    if (isSubmitting === 'success') {
      setDepartments('');
      setManager('');
      reset();
    }
  }, [isSubmitting]);

  // READ ONLY VARIANT OF CONTENT
  const staticContent = (
    <>
      <Text>{t('userForm.notePleaseVisitYour')}</Text>
      {user?.first_name && (
        <VStack
          gap={1}
          alignItems='flex-start'
        >
          <Text
            color='surface.onSurfaceVariant'
            pt='1px'
          >
            {t('userForm.firstName')}
          </Text>
          <Text>{user.first_name}</Text>
        </VStack>
      )}
      {user?.last_name && (
        <VStack
          gap={1}
          alignItems='flex-start'
        >
          <Text
            color='surface.onSurfaceVariant'
            pt='1px'
          >
            {t('userForm.lastName')}
          </Text>
          <Text>{user.last_name}</Text>
        </VStack>
      )}
      {user?.email && (
        <VStack
          gap={1}
          alignItems='flex-start'
        >
          <Text
            color='surface.onSurfaceVariant'
            pt='1px'
          >
            {t('userForm.email')}
          </Text>
          <Text>{user.email}</Text>
        </VStack>
      )}

      {user?.title && (
        <VStack
          gap={1}
          alignItems='flex-start'
        >
          <Text
            color='surface.onSurfaceVariant'
            pt='1px'
          >
            {t('common.title')}
          </Text>
          <Text>{user.title}</Text>
        </VStack>
      )}

      {departments?.length > 0 && (
        <VStack
          gap={1}
          alignItems='flex-start'
        >
          <Text
            color='surface.onSurfaceVariant'
            pt='1px'
          >
            {t('userForm.departments')}
          </Text>
          <Text>{departments.map((dept) => dept.value).join(', ')}</Text>
        </VStack>
      )}
      {user?.manager && (
        <VStack
          gap={1}
          alignItems='flex-start'
        >
          <Text
            color='surface.onSurfaceVariant'
            pt='1px'
          >
            {t('userForm.manager')}
          </Text>
          <Text>{user.manager.name}</Text>
        </VStack>
      )}
    </>
  );

  const editableContent = (
    <>
      <FormInput
        type='text'
        size='md'
        registerProps={{ ...register('first_name', { required: true }) }}
        label={t('userForm.firstName')}
        errorMsg='First name is required.'
        formControlProps={{ isInvalid: errors?.first_name }}
        formErrorMessageProps={{ color: 'critical.primary' }}
        bg='surface.containerLow'
      />

      <FormInput
        type='text'
        size='md'
        registerProps={{ ...register('last_name', { required: true }) }}
        label={t('userForm.lastName')}
        errorMsg='Last name is required.'
        formControlProps={{ isInvalid: errors?.last_name }}
        formErrorMessageProps={{ color: 'critical.primary' }}
        bg='surface.containerLow'
      />

      <FormInput
        type='email'
        size='md'
        registerProps={{ ...register('email', { required: true }) }}
        label={t('userForm.email')}
        errorMsg='Email is required.'
        formControlProps={{ isInvalid: errors?.email }}
        formErrorMessageProps={{ color: 'critical.primary' }}
        bg='surface.containerLow'
      />

      <FormInput
        type='text'
        size='lg'
        registerProps={{ ...register('title', { required: false }) }}
        label={t('common.title')}
        bg='surface.containerLow'
      />

      <CustomSelect
        isCreatable
        selectProps={{ width: '100%' }}
        placeholder={t('userForm.departmentsPlaceholder')}
        noOptionsMessage={() => null}
        value={departments}
        onChange={setDepartments}
        chakraStyles={{
          dropdownIndicator: (b) => ({
            ...b,
            display: 'none'
          })
        }}
      />

      <CustomSelect
        selectProps={{ width: '100%' }}
        placeholder={t('userForm.managerPlaceholder')}
        options={managerOptions.map((person) => ({
          value: person.id,
          label: `${person.name} <${person.email}>`,
          name: person.name,
          email: person.email,
          id: person.id
        }))}
        value={manager}
        onChange={(args) => {
          if (args.length > 0) {
            setManager(args.pop());
          } else {
            setManager([]);
          }
        }}
      />
    </>
  );

  return (
    <form
      onSubmit={handleSubmit((values) => {
        onFinish({
          ...values,
          departments: departments.map((dept) => dept.label),
          manager
        });
      })}
    >
      <Stack
        layerStyle='section-card'
        px={{ base: 4, lg: 11 }}
        py={{ base: 8, lg: 11 }}
        gap={10}
      >
        <Flex
          w='100%'
          justifyContent='space-between'
          alignItems='center'
        >
          <Controller
            control={control}
            name='active'
            render={({ field: { onChange, value } }) => (
              <>
                <Switch
                  isChecked={!!value}
                  name='active'
                  onChange={onChange}
                />
                <Stack
                  direction={['column', 'row']}
                  justifyContent='space-between'
                  w='100%'
                  mx='10px'
                >
                  <Text
                    fontSize='lg'
                    variant='page-header'
                  >
                    {t('userForm.active')}
                  </Text>
                </Stack>
              </>
            )}
          />
        </Flex>
        <Flex
          w='fit-content'
          gap={2}
          direction='column'
        >
          <Controller
            control={control}
            name='type'
            rules={{ validate: (v) => !!v }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <StyledSelect
                  selectLabel='User Type'
                  placeholder={t('userForm.selectUserTypePlaceholder')}
                  options={userTypeOptions}
                  value={value}
                  onChange={onChange}
                  menuProps={{ style: { width: '50%' } }}
                />
                {error && (
                  <Text
                    fontSize='sm'
                    color='critical.primary'
                  >
                    {t('userForm.pleaseSelectAUser')}
                  </Text>
                )}
              </>
            )}
          />
        </Flex>
        {fromForaDay || !user ? editableContent : staticContent}

        <Button
          type='submit'
          variant='reskinPrimary'
          w={96}
          label={t('userForm.submit')}
          isLoading={isSubmitting === 'submitting'}
          loadingText={t('userForm.submitting')}
          isDisabled={!isDirty}
        >
          {t('userForm.submit')}
        </Button>
      </Stack>
    </form>
  );
}
