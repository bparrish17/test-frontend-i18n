import { Alert, AlertTitle, Button, HStack, Stack } from '@chakra-ui/react';
import { useStyledToast } from '@util/hooks';
import { useTranslation } from 'react-i18next';

const alertCombos = [
  ['info', 'subtle'],
  ['info', 'solid'],
  ['success', 'subtle'],
  ['success', 'solid'],
  ['warning', 'subtle'],
  ['warning', 'solid'],
  ['error', 'subtle'],
  ['error', 'solid']
];

export default function AlertSection() {
  const { t } = useTranslation();

  const toast = useStyledToast();
  const openAllToasts = () => {
    const openToast = (status, variant) =>
      toast({
        status,
        variant,
        title: `Hello this is a ${status} toast`,
        isClosable: true,
        actionText: 'Testing',
        duration: 10000
      });
    alertCombos.forEach((combo) => openToast(...combo));
  };

  return (
    <HStack
      gap={12}
      align='flex-start'
    >
      <Button
        onClick={openAllToasts}
        variant='reskinOutline'
        size='reskinMd'
      >
        {t('alertSection.openAllToastVariants')}
      </Button>

      <Stack flex={1}>
        {alertCombos.map(([status, variant]) => (
          <Alert
            key={`${status}-${variant}`}
            status={status}
            variant={variant}
            w='500px'
          >
            <AlertTitle>{t('alertSection.thisIsAAlert', { status, variant })}</AlertTitle>
          </Alert>
        ))}
      </Stack>
    </HStack>
  );
}
