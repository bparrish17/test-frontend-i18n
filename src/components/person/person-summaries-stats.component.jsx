import { Stack, HStack, Image, Text, SkeletonText, Skeleton } from '@chakra-ui/react';
import { useMemo } from 'react';

import { TeamsLogo, SlackLogo, OutlookLogo, GoogleMeetLogo, ZoomTitleLogo } from '@assets/images';
import { pluralized } from '@util/helpers';
import { PersonSectionHeader } from './person.shared.component';

const PersonSummariesStats = ({ sectionHeaderProps, summarySources }) => {
  const barChartData = useMemo(() => getPopulatedBarChartMap(summarySources), [summarySources]);

  const maxBarChartValue = useMemo(
    () => Math.max(...barChartData.map((item) => item.value)),
    [barChartData]
  );

  return (
    <Stack id='summaries-stats'>
      <PersonSectionHeader
        {...sectionHeaderProps}
        type='Summaries'
      />
      <Stack gap={0}>
        {barChartData.map((item) => (
          <SourcesBarChartItem
            key={item.name}
            {...item}
            total={maxBarChartValue}
            value={item.value}
          />
        ))}
      </Stack>
    </Stack>
  );
};

export default PersonSummariesStats;

const barChartMap = [
  {
    name: 'Zoom Meeting',
    color: '#0B5CFF',
    icon: ZoomTitleLogo,
    imgProps: { rounded: 'xl' }
  },
  { name: 'Teams Meeting', color: '#876CE5', icon: TeamsLogo },
  { name: 'Slack Digest', color: '#009EAD', icon: SlackLogo },
  { name: 'Teams Digest', color: '#463C89', icon: TeamsLogo },
  { name: 'Email Thread', color: '#6A9EEC', icon: OutlookLogo },
  { name: 'Google Meeting', color: '#2F8B3B', icon: GoogleMeetLogo }
];

/** @param {{name: string, value: number}[]} sources */
const getPopulatedBarChartMap = (sources) => {
  if (!sources) {
    return barChartMap;
  }

  return barChartMap
    .map((item) => {
      const value = sources.find((s) => s.name.split('_').join(' ') === item.name)?.value || 0;
      if (value === 0) {
        return null;
      }

      return { ...item, value };
    })
    .filter(Boolean)
    .sort((a, b) => b.value - a.value);
};

const SourcesBarChartItem = ({ name, value, total, boxSize = 8, color, icon, imgProps }) => (
  <HStack
    data-testid={`source-${name}`}
    w='full'
    h={16}
  >
    <HStack
      gap={4}
      w='200px'
    >
      <Image
        boxSize={boxSize}
        src={icon}
        alt={name}
        {...imgProps}
      />
      <Stack gap={0.5}>
        <Text
          variant='title-sm'
          color='brandPrimary.primary'
          fontWeight={600}
        >
          {name}
        </Text>
        <SkeletonText
          noOfLines={1}
          h={1}
          w='full'
          isLoaded={!!value || value === 0}
        >
          <Text
            variant='label-md'
            color='surface.onSurfaceVariant'
            data-testid={`source-${name}-summary-count`}
          >
            {pluralized('Summary', value)}
          </Text>
        </SkeletonText>
      </Stack>
    </HStack>
    <HStack
      flex={1}
      align='center'
      h='full'
      borderLeft='reskin'
    >
      <Stack
        w='full'
        h={6}
        borderRadius='full'
        position='relative'
      >
        <Skeleton
          w='full'
          h='full'
          isLoaded={!!value || value === 0}
          borderLeftRadius={0}
        >
          <Stack
            w={`${(value / total) * 100}%`}
            h='full'
            bgColor={color}
            borderRightRadius='md'
          />
        </Skeleton>
      </Stack>
    </HStack>
  </HStack>
);
