import { useForm } from 'react-hook-form';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  VStack,
  Image
} from '@chakra-ui/react';

import { BlackOktaAura, BlackOktaWordmark } from '@assets/images';
import { initializeOktaAuth } from '@util/helpers';
import { useLoginShared } from '@util/hooks';
import { useTranslation } from 'react-i18next';

export default function OktaLoginPage() {
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  const { openErrorToast } = useLoginShared();

  const onSubmit = async (data) => {
    const { email } = data;

    const domain = email.split('@')[1]?.split('.')[0];
    if (!domain) {
      // TODO: Use toast
      openErrorToast('Invalid email format');
      return;
    }

    // TODO: Evenentually we will move this to an external store but for
    // now we'll keep these as ENV variables
    const oktaConfig = {};
    let redirectState = {};
    if (domain?.includes('apollo')) {
      oktaConfig.clientId = import.meta.env.VITE_OKTA_APOLLO_CLIENT_ID;
      oktaConfig.issuer = import.meta.env.VITE_OKTA_APOLLO_ISSUER;
    } else if (domain === 'fora') {
      oktaConfig.clientId = import.meta.env.VITE_OKTA_FORA_CLIENT_ID;
      oktaConfig.issuer = import.meta.env.VITE_OKTA_FORA_ISSUER;
      redirectState = { state: JSON.stringify({ subdomain: domain }) };
      oktaConfig.redirectUri = window.location.origin + '/callback/login/okta';
    } else if (domain === 'skullcandy') {
      oktaConfig.clientId = import.meta.env.VITE_OKTA_SKULLCANDY_CLIENT_ID;
      oktaConfig.issuer = import.meta.env.VITE_OKTA_SKULLCANDY_ISSUER;
      oktaConfig.redirectUri = window.location.origin + '/callback/login/okta';
      redirectState = { state: JSON.stringify({ subdomain: domain }) };
    } else if (domain?.includes('parachutehealth')) {
      oktaConfig.clientId = import.meta.env.VITE_OKTA_PARACHUTE_CLIENT_ID;
      oktaConfig.issuer = import.meta.env.VITE_OKTA_PARACHUTE_ISSUER;
      oktaConfig.redirectUri = window.location.origin + '/callback/login/okta';
      redirectState = { state: JSON.stringify({ subdomain: domain }) };
    } else if (domain?.includes('okta')) {
      oktaConfig.clientId = import.meta.env.VITE_OKTA_OKTA_CLIENT_ID;
      oktaConfig.issuer = import.meta.env.VITE_OKTA_OKTA_ISSUER;
      oktaConfig.redirectUri = window.location.origin + '/callback/login/okta';
      redirectState = { state: JSON.stringify({ subdomain: domain }) };
    } else {
      openErrorToast('Invalid email format');
      return;
    }

    const oktaAuth = initializeOktaAuth(oktaConfig);
    try {
      await oktaAuth.signInWithRedirect(redirectState);
    } catch (error) {
      console.log(`Error while connecting to okta: ${error}`);
      openErrorToast('Failed to connect to Okta. Please try again.');
    }
  };

  return (
    <Box
      maxW='sm'
      mx='auto'
      mt={8}
      p={6}
      borderWidth={1}
      borderRadius='md'
      boxShadow='md'
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={errors.email}>
            <FormLabel htmlFor='email'>{t('oktaLoginPage.emailAddress')}</FormLabel>
            <Input
              id='email'
              placeholder={t('oktaLoginPage.enterYourEmailAddressPlaceholder')}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: t('oktaLoginPage.invalidEmailAddress')
                }
              })}
            />
            <FormErrorMessage>{errors?.email?.message}</FormErrorMessage>
          </FormControl>

          <Button
            variant='reskinGhost'
            color='surface.onSurfaceVariant'
            bgColor='surface.surface'
            _hover={{ bg: 'surface.surfaceDim', color: 'surface' }}
            fontWeight={400}
            type='submit'
            width='full'
          >
            <Image
              src={BlackOktaAura}
              alt={t('oktaLoginPage.oktaLogoAlt')}
              h={8}
            />
            <Image
              src={BlackOktaWordmark}
              alt={t('oktaLoginPage.oktaLogoAlt')}
              h={8}
            />
          </Button>
        </VStack>
      </form>
    </Box>
  );
}
