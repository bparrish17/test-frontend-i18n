import { Stack, Switch, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import MeetingSummary from '@components/meeting/meeting-summary.component';
import { CustomSummaryStep } from './custom-summary-shared-ui.component';
import { useTranslation } from 'react-i18next';

export default function SummaryPreview({ form, card, meeting }) {
  const { t } = useTranslation();

  const { control } = form;

  return (
    <CustomSummaryStep>
      <Text
        fontWeight={600}
        fontSize='lg'
      >
        {t('customSummaryPreview.preview')}
      </Text>
      <MeetingSummary
        card={card}
        meeting={meeting}
        showMenu={false}
      />
      <Stack
        flexDir='row'
        gap={3}
      >
        <Controller
          control={control}
          name='autoMatch'
          render={({ field: { onChange, value } }) => (
            <Switch
              colorScheme='brandPrimary'
              isChecked={value}
              onChange={onChange}
              size='md'
              mt={1}
            />
          )}
        />
        <Stack gap={1}>
          <Text fontWeight={600}>{t('customSummaryPreview.haveForaAutomaticallyApply')}</Text>
          <Text
            fontSize='sm'
            color='surface.onSurfaceVariant'
          >
            {t('customSummaryPreview.whenThisIsOn')}
          </Text>
        </Stack>
      </Stack>
    </CustomSummaryStep>
  );
}
