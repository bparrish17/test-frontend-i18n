import { Box, Checkbox, CheckboxGroup, Heading, Stack, Text } from '@chakra-ui/react';
import { useStatsigClient } from '@statsig/react-bindings';
import { Controller } from 'react-hook-form';

export const contentTypeFilterOptions = (isTeamsEnabled) =>
  [
    {
      value: 'Meeting',
      label: 'Meetings'
    },
    { value: 'Slack_Digest', label: 'Slack Digests' },
    isTeamsEnabled ? { value: 'Teams_Digest', label: 'Teams Digests' } : null,
    { value: 'Email_Thread', label: 'Email Threads' },
    {
      value: 'Earnings_Call',
      label: (
        <>
          Earnings Calls
          <Text
            as='span'
            color='surface.outline'
          >
            &nbsp;• This may contain external sources of data
          </Text>
        </>
      )
    }
  ].filter(Boolean);

export default function ContentTypeFilter({ control, error, isViewOnlyMode }) {
  const { checkGate } = useStatsigClient();
  const isTeamsEnabled = checkGate('teams-digests');

  return (
    <Stack gap={6}>
      <Heading size='sm'>Content Types</Heading>
      <Box>
        <Stack
          layerStyle='section-card'
          bgColor='surface.containerLow'
          borderColor={!!error && 'critical.primary'}
          p={3}
          gap={{ base: 4, md: 6 }}
        >
          <Controller
            control={control}
            name='filters.sub_sources'
            rules={{
              validate: (v) => (v?.length === 0 ? 'Please select at least one content type' : null)
            }}
            render={({ field: { onChange, value } }) => (
              <CheckboxGroup
                value={value}
                onChange={onChange}
                isDisabled={isViewOnlyMode}
              >
                <Stack
                  gap={{ base: 4, md: 6 }}
                  flexWrap='wrap'
                  direction={{ base: 'column', md: 'row' }}
                >
                  {contentTypeFilterOptions(isTeamsEnabled).map((opt) => (
                    <Checkbox
                      key={opt.value}
                      value={opt.value}
                    >
                      <Text variant='label-500-lg'>{opt.label}</Text>
                    </Checkbox>
                  ))}
                </Stack>
              </CheckboxGroup>
            )}
          />
        </Stack>
        {!!error && (
          <Text
            color='critical.primary'
            fontSize='sm'
            mt={1}
          >
            {error?.message}
          </Text>
        )}
      </Box>
    </Stack>
  );
}
