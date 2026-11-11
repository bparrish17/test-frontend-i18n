import { useStyledToast } from './general.hooks';

export function useLoginShared() {
  const toast = useStyledToast();

  const openErrorToast = (msg, description) =>
    toast({
      title: msg,
      description,
      status: 'error',
      isClosable: true,
      duration: 4000
    });

  const openCredsErrorToast = (e) =>
    openErrorToast('Invalid Login Attempt', (e?.response?.data?.errors ?? []).join(', '));

  return { openErrorToast, openCredsErrorToast };
}
