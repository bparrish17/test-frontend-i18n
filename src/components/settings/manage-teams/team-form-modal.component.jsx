import { Button, FormControl, FormLabel, HStack, Input, Stack, Textarea } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import StyledModal from '@components/general/modals/styled-modal.component';

const EMPTY_TEAM = { name: '', description: '', category: '', people: '' };

export default function TeamFormModal({ disclosure, team, onSubmit }) {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm({ defaultValues: EMPTY_TEAM });

  useEffect(() => {
    reset(team ?? EMPTY_TEAM);
  }, [team, reset]);

  const submit = (values) => {
    onSubmit(values);
    disclosure.onClose();
  };

  return (
    <StyledModal
      disclosure={disclosure}
      title={team ? t('common.edit') : t('common.create')}
      modalContentProps={{ w: '540px' }}
    >
      <Stack
        as='form'
        gap={4}
        onSubmit={handleSubmit(submit)}
      >
        <FormControl isRequired>
          <FormLabel>{t('common.name')}</FormLabel>
          <Input
            placeholder={t('manageTeams.teamNamePlaceholder')}
            {...register('name')}
          />
        </FormControl>
        <FormControl>
          <FormLabel>{t('common.description')}</FormLabel>
          <Textarea {...register('description')} />
        </FormControl>
        <FormControl>
          <FormLabel>{t('common.category')}</FormLabel>
          <Input {...register('category')} />
        </FormControl>
        <FormControl>
          <FormLabel>{t('common.people')}</FormLabel>
          <Input
            placeholder={t('manageTeams.addPeoplePlaceholder')}
            {...register('people')}
          />
        </FormControl>
        <HStack justifyContent='space-between'>
          <Button
            variant='ghost'
            onClick={() => reset(team ?? EMPTY_TEAM)}
          >
            {t('common.reset')}
          </Button>
          <HStack>
            <Button
              variant='reskinSecondary'
              onClick={disclosure.onClose}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type='submit'
              variant='reskinPrimary'
            >
              {t('common.save')}
            </Button>
          </HStack>
        </HStack>
      </Stack>
    </StyledModal>
  );
}
