import { Flex, Stack, Switch, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import LabelSelect from '@components/general/labels/label-select.component';
import { useTranslation } from 'react-i18next';

const formKey = 'filters.labels';

export default function LabelsFilter({ control, watch, setValue, isViewOnlyMode }) {
  const { t } = useTranslation();

  const labels = watch(formKey);
  const notEmpty = labels?.length > 0;
  const [labelCache, setLabelCache] = useState(labels);
  const [isChecked, setIsChecked] = useState(notEmpty);

  const handleSwitchChange = (e) => {
    setIsChecked(e.target.checked);
    setValue(formKey, e.target.checked ? labelCache : null, { shouldDirty: true });
  };

  useEffect(() => {
    if (notEmpty) {
      setIsChecked(true);
      setLabelCache(labels);
    }
  }, [notEmpty]);

  return (
    <Stack gap={4}>
      <Flex
        justifyContent='space-between'
        alignItems='center'
      >
        <Switch
          isChecked={isChecked}
          onChange={handleSwitchChange}
          isDisabled={isViewOnlyMode}
        />
        <Stack
          direction={['column', 'row']}
          justifyContent='space-between'
          w='100%'
          mx='10px'
        >
          <Text
            fontSize='lg'
            variant={isChecked ? 'page-header' : ''}
          >
            {t('labelsFilter.labels')}
          </Text>
          <Text
            fontWeight={400}
            fontSize='sm'
            color='surface.onSurfaceVariant'
            lineHeight={6}
          >
            {t('labelsFilter.selectRelevantTagsTo')}
          </Text>
        </Stack>
      </Flex>
      {isChecked && (
        <Controller
          control={control}
          name='filters.labels'
          render={({ field: { onChange, value } }) => (
            <LabelSelect
              value={value}
              onChange={onChange}
            />
          )}
        />
      )}
    </Stack>
  );
}
