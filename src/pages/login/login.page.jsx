import {
  Box,
  Flex,
  Image,
  Spinner,
  VStack,
  IconButton,
  Button,
  Center,
  Text
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import { useUserStore } from '@store/app.store';
import { useLoginShared, useSetDocumentTitle } from '@util/hooks';
import { EyeIcon, EyeOffIcon } from '@assets/icons';
import { ForaLogoWhite } from '@assets/images';
import FormInput from '@components/general/form/form-input.component';
import TermsAndConditions from '@components/login/terms-conditions.component';
import OAuthStack from './oauth-stack.component';
import { useRollbar } from '@rollbar/react';
import { useTranslation } from 'react-i18next';

function LoginPage() {
  const { t } = useTranslation();

  useSetDocumentTitle('Login - FORA');
  const location = useLocation();
  const {
    handleSubmit,
    register,
    formState: { dirtyFields, isSubmitting, errors }
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticatingDefault, setIsAuthenticatingDefault] = useState(false);
  const navigate = useNavigate();
  const authenticate = useUserStore((state) => state.authenticate);
  const redirectUrl = location?.state?.callbackUrl || '/';
  const { openCredsErrorToast, openErrorToast } = useLoginShared();
  const rollbar = useRollbar();

  const handleDefaultSignIn = async ({ email, password }) => {
    if (!email || !password) return;
    setIsAuthenticatingDefault(true);
    try {
      await authenticate(email, password);
      setIsAuthenticatingDefault(false);
      navigate(redirectUrl);
    } catch (e) {
      if (e?.status !== 422) {
        rollbar?.error('Non-credentials error during login', e);
      }
      openCredsErrorToast(e);
      setIsAuthenticatingDefault(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(handleDefaultSignIn);
    }
  };

  return (
    <Flex
      data-cy='login-page'
      h='full'
      alignItems='flex-start'
      bgColor='surface.containerLow'
      flexDir='column'
    >
      <Center
        h='full'
        w='full'
        px={{ base: 8, lg: 0 }}
      >
        <VStack
          w='sm'
          bgColor='surface.containerLowest'
          border='reskin'
          borderRadius='xl'
        >
          <Flex
            h='60px'
            w='full'
            bgColor='brandPrimary.primary'
            align='center'
            justify='center'
            borderTopRadius='xl'
          >
            <Image
              src={ForaLogoWhite}
              alt={t('loginPage.logoAlt')}
              maxBlockSize={4}
              onClick={() => navigate('/feed')}
              cursor='pointer'
              zIndex={20}
            />
          </Flex>
          {isSubmitting ? (
            <Spinner
              size='lg'
              thickness='3px'
              speed='0.75s'
              mt={12}
              mb={24}
            />
          ) : (
            <>
              <Flex
                as='form'
                flexDir='column'
                width='full'
                gap={8}
                onSubmit={handleSubmit(handleDefaultSignIn)}
                py={1.5}
                px={4}
              >
                <OAuthStack
                  redirectUrl={redirectUrl}
                  isSubmitting={isSubmitting}
                  openCredsErrorToast={openCredsErrorToast}
                  openErrorToast={openErrorToast}
                />

                <Text
                  color='surface.onSurfaceVariant'
                  align='center'
                  fontWeight={400}
                >
                  {t('loginPage.orContinueWith')}
                </Text>
                <VStack gap={4}>
                  <FormInput
                    key='email'
                    type='email'
                    label={t('loginPage.emailAddress')}
                    errorMsg={errors.email?.message}
                    registerProps={{ ...register('email', { required: true }) }}
                    size='lg'
                    onKeyDown={handleKeyDown}
                    bgColor='surface.surface'
                    _hover={{ bgColor: 'surface.surfaceDim' }}
                    _focus={{ bgColor: 'surface.surfaceDim' }}
                  />
                  <Box
                    position='relative'
                    w='full'
                  >
                    <FormInput
                      key='password'
                      name='password'
                      type={showPassword ? 'text' : 'password'}
                      label={t('loginPage.password')}
                      errorMsg={errors.password?.message}
                      registerProps={{ ...register('password', { required: true }) }}
                      size='lg'
                      onKeyDown={handleKeyDown}
                      bgColor='surface.surface'
                      _hover={{ bgColor: 'surface.surfaceDim' }}
                      _focus={{ bgColor: 'surface.surfaceDim' }}
                    />
                    {dirtyFields?.password && (
                      <IconButton
                        aria-label={t('loginPage.showPwAriaLabel')}
                        variant='ghost'
                        size='sm'
                        position='absolute'
                        right={4}
                        top={3}
                        icon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </Box>
                  <Button
                    type='submit'
                    variant='reskinPrimary'
                    w='full'
                    h='48px'
                    isDisabled={isAuthenticatingDefault || isSubmitting}
                    onClick={handleDefaultSignIn}
                    color='brandPrimary.onPrimary'
                  >
                    <Box position='relative'>
                      Sign in
                      {(isAuthenticatingDefault || isSubmitting) && (
                        <Spinner
                          size='xs'
                          position='absolute'
                          top={0.5}
                          right={-6}
                        />
                      )}
                    </Box>
                  </Button>
                </VStack>
              </Flex>
              <TermsAndConditions />
            </>
          )}
        </VStack>
      </Center>
    </Flex>
  );
}

export default LoginPage;
