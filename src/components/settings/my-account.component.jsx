import { EyeIcon, EyeOffIcon } from '@assets/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Heading,
  IconButton,
  Spinner,
  useColorModeValue,
  VStack
} from '@chakra-ui/react';
import FormInput from '@components/general/form/form-input.component';
import { useChangePassword } from '@services/query-services/people.query-service';
import { useMutationToast } from '@util/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

function PasswordInput({ placeholder, errors, formConfig }) {
  const [showPassword, setShowPassword] = useState(false);
  const error = errors ? errors[formConfig?.name] : null;

  return (
    <Box
      position='relative'
      w='full'
    >
      <FormInput
        size='lg'
        label={placeholder}
        errorMsg={error?.message}
        type={showPassword ? 'text' : 'password'}
        formControlProps={{ isInvalid: error, w: 'full' }}
        registerProps={{ ...formConfig }}
      />
      <IconButton
        position='absolute'
        right={4}
        top={3.5}
        aria-label={`Show ${placeholder}`}
        variant='ghost'
        size='sm'
        icon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
        onClick={() => setShowPassword(!showPassword)}
      />
    </Box>
  );
}

export default function MyAccount() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    setError,
    reset: resetForm,
    formState: { errors, isSubmitting }
  } = useForm({ mode: 'onBlur' });
  const { mutateAsync: changePassword } = useChangePassword();
  const { onSuccess: successToast, onError: errorToast } = useMutationToast('password', 'update');

  const onSubmit = async (values) => {
    const { currentPwd, newPwd, confirmPwd } = values;
    await changePassword(
      { value: currentPwd, newValue: newPwd, confirmValue: confirmPwd },
      {
        onSuccess: () => {
          resetForm();
          successToast();
        },
        onError: (e) => {
          const response = e?.response ?? {};
          if (response?.status === 422) {
            const apiErrors = response?.data?.errors ?? [];
            if (apiErrors.includes('Invalid credentials')) {
              setError('currentPwd', {
                type: 'invalid',
                message: t('myAccount.invalidCredentials')
              });
            } else if (apiErrors.includes('must match')) {
              setError('newPwd', { type: 'match', message: t('myAccount.newPasswordHasInvalid') });
            }
          } else {
            errorToast();
          }
        }
      }
    );
  };

  const getValidations = (placeholder) => {
    return {
      required: { value: true, message: `${placeholder} is Required` },
      minLength: { value: 8, message: `${placeholder} Must be Between 8 and 32 Characters` },
      maxLength: { value: 32, message: `${placeholder} Must be Between 8 and 32 Characters` }
    };
  };

  const confirmValidations = {
    ...getValidations('Confirm Password'),
    validate: {
      equals: (value, formValues) => value === formValues.newPwd || 'Passwords Must Match'
    }
  };

  return (
    <Flex
      flexDirection='column'
      gap={6}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card
          display='flex'
          gap={6}
          flexDir='column'
          variant='unstyled'
          w='full'
          minW='xl'
          direction='column'
          px={6}
          py={8}
          rounded='2xl'
          transitionProperty='background-color'
          transitionDuration='0.2s'
          transitionTimingFunction='ease-in-out'
          border={useColorModeValue('1px solid #e9e9e9', '1px solid #303030')}
          bgColor={useColorModeValue('white', '#252525')}
        >
          <CardHeader>
            <Heading fontSize='2xl'>{t('myAccount.changePassword')}</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <PasswordInput
                placeholder={t('myAccount.currentPasswordPlaceholder')}
                errors={errors}
                formConfig={register('currentPwd', getValidations('Current Password'))}
              />
              <PasswordInput
                placeholder={t('myAccount.newPasswordPlaceholder')}
                errors={errors}
                formConfig={register('newPwd', getValidations('New Password'))}
              />
              <PasswordInput
                placeholder={t('myAccount.confirmPasswordPlaceholder')}
                errors={errors}
                formConfig={register('confirmPwd', confirmValidations)}
              />
            </VStack>
          </CardBody>
          <CardFooter justify='flex-end'>
            <Button
              variant='reskinPrimary'
              type='submit'
              leftIcon={isSubmitting && <Spinner size='xs' />}
              isDisabled={isSubmitting}
            >
              {t('myAccount.save')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Flex>
  );
}
