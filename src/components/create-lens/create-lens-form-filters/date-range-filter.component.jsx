import { Flex, Stack, Switch, Text } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import DateRangeInput from '@components/general/form/date-range-input.component';

export default function DateRangeFilter({ control, watch, setValue, isViewOnlyMode }) {
  const date = watch('filters.date');
  const isChecked = date?.enabled;
  // const startAtFrom = date?.start_at_from;
  // const startAtTo = date?.start_at_to;

  const handleSwitchChange = (e) => {
    const isChecked = e.target.checked;
    setValue('filters.date.enabled', isChecked, { shouldDirty: true });
  };

  // some old logic that is here during QA in case i need to return to it
  // const isEmptyDateRange = !startAtFrom && !startAtTo;
  // useEffect(() => {
  //   setValue('filters.date.enabled', !isEmptyDateRange, { shouldDirty: true });
  // }, [isEmptyDateRange]);

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
          lineHeight={1}
        >
          <Text
            fontSize='lg'
            variant={isChecked ? 'page-header' : ''}
          >
            Date Range
          </Text>
          <Text
            fontWeight={400}
            fontSize='sm'
            color='surface.onSurfaceVariant'
            lineHeight={6}
          >
            Set a time period to focus on
          </Text>
        </Stack>
      </Flex>
      {isChecked && (
        <Flex
          gap={4}
          direction={['column', 'row']}
          align={['start', 'center']}
        >
          <Controller
            control={control}
            name='filters.date.start_at_from'
            render={({ field: { onChange, value } }) => (
              <DateRangeInput
                date={value}
                setDate={onChange}
                type='start'
              />
            )}
          />
          <Text>to</Text>
          <Controller
            control={control}
            name='filters.date.start_at_to'
            render={({ field: { onChange, value } }) => (
              <DateRangeInput
                date={value}
                setDate={onChange}
                type='end'
              />
            )}
          />
        </Flex>
      )}
    </Flex>
  );
}
