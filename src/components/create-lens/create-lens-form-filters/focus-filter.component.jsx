import { Flex, Stack, Switch, Text } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';

import { useInitiatives } from '@services/query-services/initiatives.query-service';
import CustomSelect from '@components/general/form/custom-select.component';

export default function FocusFilter({ control, watch, setValue, isViewOnlyMode }) {
  const focus = watch('filters.focus');
  const [focusesCache, setFocusesCache] = useState(focus);
  const [isChecked, setIsChecked] = useState(focus?.length > 0);
  const { data: focuses } = useInitiatives({ type: 'Focus' }, { refetchOnMount: true });

  const handleSwitchChange = (e) => {
    setIsChecked(e.target.checked);
    setValue('filters.focus', e.target.checked ? focusesCache : null, { shouldDirty: true });
  };

  useEffect(() => {
    if (focus?.length > 0) {
      setIsChecked(true);
      setFocusesCache(focus);
    }
  }, [focus]);

  return (
    <Flex
      flexDirection='column'
      w='100%'
      gap={4}
    >
      <Flex
        w='100%'
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
            Category
          </Text>
          <Text
            fontWeight={400}
            fontSize='sm'
            color='surface.onSurfaceVariant'
            lineHeight={6}
          >
            Set an organizational theme
          </Text>
        </Stack>
      </Flex>
      {isChecked && (
        <Controller
          control={control}
          name='filters.focus'
          render={({ field: { onChange, value } }) => (
            <CustomSelect
              selectProps={{ width: '100%' }}
              placeholder='Select category...'
              options={focuses?.map((focus) => ({
                value: focus.id,
                label: focus.title
              }))}
              getValueLabel={(opt) => {
                if (typeof opt === 'object') {
                  return opt.label;
                } else {
                  const match = focuses?.find((f) => f.id === opt);
                  return match?.title;
                }
              }}
              getOptionValue={(opt) => {
                return opt;
              }}
              value={value}
              onChange={onChange}
              isDisabled={isViewOnlyMode}
            />
          )}
        />
      )}
    </Flex>
  );
}
