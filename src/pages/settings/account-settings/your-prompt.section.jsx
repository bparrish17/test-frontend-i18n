import { Button, Link, Spinner, Stack, Text, Textarea } from '@chakra-ui/react';

import { SFClipboardIcon } from '@assets/icons';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useUserStore } from '@store/app.store';
import { usePatchPerson } from '@services/query-services/people.query-service';
import { useMutationToast } from '@util/hooks';
import InfoBlurb from '@components/general/info-blurb.component';

export default function YourPromptSection() {
  const user = useUserStore((state) => state?.user);
  const setUser = useUserStore((state) => state.setUser);
  const [showPromptAlert, setShowPromptAlert] = useState(true);
  const { handleSubmit, register, watch } = useForm({ defaultValues: { context: user?.context } });

  const contextFormVal = watch('context');
  const { mutateAsync: updatePrompt, isLoading: isUpdatingPrompt } = usePatchPerson();
  const { onSuccess, onError } = useMutationToast({
    success: {
      title: 'Prompt Saved',
      callback: setUser
    },
    error: { title: 'Something went wrong while saving prompt. Please try again. ' }
  });

  const onSubmit = async (values) => {
    await updatePrompt(
      { id: user?.id, context: values.context },
      {
        onSuccess,
        onError
      }
    );
  };

  return (
    <>
      <Stack
        as='form'
        gap='inherit'
        onSubmit={handleSubmit(onSubmit)}
      >
        <Text color='surface.onSurfaceVariant'>
          How do you like your summaries? FORA will use whatever you put in this box to tailor the
          form and content of summaries to your tastes.
        </Text>
        <Textarea
          resize='vertical'
          variant='filled'
          minH={36}
          h='fit-content'
          placeholder='Enter your user prompt...'
          whiteSpace='pre-wrap'
          {...register('context')}
        />
        <Button
          type='submit'
          size='reskinLg'
          alignSelf='flex-end'
          isDisabled={isUpdatingPrompt || contextFormVal === user?.context}
        >
          Save Prompt
          {isUpdatingPrompt && (
            <Spinner
              size='xs'
              ml={3}
            />
          )}
        </Button>
      </Stack>

      {showPromptAlert && (
        <InfoBlurb
          title='On Writing Prompts'
          icon={
            <SFClipboardIcon
              boxSize={7}
              pl={1}
            />
          }
          iconWrapperProps={{ bgColor: 'brandPrimary.containerHigh' }}
          onCloseClick={() => setShowPromptAlert(false)}
        >
          To write an effective prompt, be specific about your desired outcome, including details
          about format, tone, and length to help the AI understand exactly what you&apos;re looking
          for.&nbsp;
          <Link
            href='https://intercom.help/fora/en/articles/11101314-writing-your-personal-fora-prompt'
            target='_blank'
            _hover={{ textDecoration: 'underline' }}
          >
            Check out these example prompts.
          </Link>
        </InfoBlurb>
      )}
    </>
  );
}
