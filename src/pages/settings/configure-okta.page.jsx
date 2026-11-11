import { useForm } from 'react-hook-form';
import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from '@chakra-ui/react';

import SettingsLayout from '@layouts/settings.layout';
import CenteredLayout from '@layouts/centered.layout';

export default function ConfigureOktaPage() {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();

  // TODO: Eventually we will add support for configuring okta
  const onSubmit = (data) => {
    console.log('TODO: ', data);
  };

  return (
    <SettingsLayout>
      <CenteredLayout gap={6}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing={4}>
            <FormControl isInvalid={errors.clientId}>
              <FormLabel htmlFor='clientId'>Client ID</FormLabel>
              <Input
                id='clientId'
                placeholder='Enter your Okta Client ID'
                {...register('clientId', { required: 'Client ID is required' })}
              />
              <FormErrorMessage>{errors.clientId && errors.clientId.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.oktaUrl}>
              <FormLabel htmlFor='oktaUrl'>Okta URL</FormLabel>
              <Input
                id='oktaUrl'
                placeholder='https://your-okta-domain.com'
                {...register('oktaUrl', {
                  required: 'Okta URL is required',
                  pattern: {
                    value: /^https:\/\/.+$/,
                    message: 'Okta URL must start with https://'
                  }
                })}
              />
              <FormErrorMessage>{errors.oktaUrl && errors.oktaUrl.message}</FormErrorMessage>
            </FormControl>

            <Button
              variant='reskinPrimary'
              type='submit'
              width='full'
            >
              Submit
            </Button>
          </VStack>
        </form>
      </CenteredLayout>
    </SettingsLayout>
  );
}
