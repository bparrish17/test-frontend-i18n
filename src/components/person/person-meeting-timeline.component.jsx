import { Box, VStack, Text, Flex, useConst } from '@chakra-ui/react';
import { memo, useState } from 'react';
import { Chart as ChartJS, LinearScale, TimeScale, PointElement, Tooltip, Legend } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Bubble } from 'react-chartjs-2';
import { enUS } from 'date-fns/locale';
import { differenceInDays, format, subDays } from 'date-fns';

import { useMeetings } from '@services/query-services/meetings.query-service';
import { formatDurationWithUnits, normalizeTimestamp } from '@util/helpers';
import { PersonSectionHeader } from './person.shared.component';
import StyledSelect from '@components/general/styled-select.component';

ChartJS.register(LinearScale, TimeScale, PointElement, Tooltip, Legend);

const generateDataset = (meetings) => {
  if (!meetings) {
    return [];
  }

  return meetings?.map((m) => {
    const center = true;
    const timestamp = center
      ? (normalizeTimestamp(m?.start_at) + normalizeTimestamp(m?.end_at)) / 2
      : normalizeTimestamp(m?.start_at);
    const date = new Date(timestamp);
    return {
      x: date,
      y: 0,
      r: (100 / 3600) * m?.minutes * 10
    };
  });
};

/**
 * Generate date ticks for the x-axis
 * @param {number} count
 * @returns {import('chart.js').Tick[]}
 */
const generateDateTicks = (firstDate, amountOfMeetings) => {
  if (!firstDate || !amountOfMeetings) {
    return [];
  }
  const today = new Date();
  const max = today;

  const ticks = [];
  let tickDate = max;

  for (let i = 0; i < differenceInDays(max, firstDate); i++) {
    tickDate = subDays(max, i);
    const tickEstMidnight = new Date(tickDate.toISOString().split('T')[0] + 'T05:00:00Z');

    ticks.push(tickEstMidnight.getTime());
  }

  return ticks;
};

const MeetingTimeline = ({ id, email, numOfDays }) => {
  const today = useConst(new Date());
  const [amountOfMeetings, setAmountOfMeetings] = useState(20);

  const { data: meetingDurations } = useMeetings(
    {
      nylas_participant_emails: [email],
      // produces better results, results from user's agenda
      // creator_id: id,
      start_at_from: subDays(today, numOfDays).getTime(),
      pageSize: amountOfMeetings,
      sort: 'start_at',
      start_at_to: today.getTime()
    },
    {
      enabled: !!id,
      select: (meetings) =>
        meetings?.map((meeting) => ({
          meeting,
          start_at: meeting?.start_at,
          end_at: meeting?.end_at,
          minutes: parseInt(
            formatDurationWithUnits(meeting?.end_at - meeting?.start_at, {
              minUnit: 'minutes',
              maxUnit: 'minutes'
            })?.split(' ')[0]
          )
        }))
    }
  );

  const firstDataset = generateDataset(meetingDurations?.slice(0, meetingDurations?.length / 3));
  const secondDataset = generateDataset(
    meetingDurations?.slice(meetingDurations?.length / 3, (meetingDurations?.length / 3) * 2)
  );
  const thirdDataset = generateDataset(
    meetingDurations?.slice((meetingDurations?.length / 3) * 2, meetingDurations?.length)
  );

  const data = {
    datasets: [
      {
        label: 'Red dataset',
        data: firstDataset,
        backgroundColor: 'rgba(255, 99, 132, 0.5)'
      },
      {
        label: 'Green dataset',
        data: secondDataset,
        backgroundColor: 'rgba(75, 192, 192, 0.5)'
      },
      {
        label: 'Blue dataset',
        data: thirdDataset,
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  };

  return (
    <Box
      w='full'
      py={4}
    >
      <PersonSectionHeader
        title='Meeting Timeline'
        timeframe={
          <Flex
            align='center'
            mr={2}
            w='full'
            whiteSpace='nowrap'
          >
            <Text
              as='span'
              mr={2}
            >
              Last
            </Text>
            <StyledSelect
              placeholder='Select'
              value={amountOfMeetings}
              onChange={setAmountOfMeetings}
              menuButtonProps={{ w: 'fit-content', h: 'fit-content', p: 1, mb: 1 }}
              options={[
                {
                  value: 20,
                  label: '20'
                },
                {
                  value: 50,
                  label: '50'
                },
                {
                  value: 100,
                  label: '100'
                }
              ]}
            />
            <Text
              as='span'
              ml={2}
            >
              Meetings
            </Text>
          </Flex>
        }
      />
      <VStack w='full'>
        <BubbleChart
          amountOfMeetings={amountOfMeetings}
          firstDate={thirdDataset[thirdDataset?.length - 1]?.x}
          data={data}
        />
      </VStack>
    </Box>
  );
};

const BubbleChart = memo(({ data, firstDate, amountOfMeetings }) => {
  const dateTicks = generateDateTicks(firstDate, amountOfMeetings);

  return (
    <Bubble
      options={{
        responsive: true,
        borderColor: 'rgba(0, 0, 0, 0.1)',
        clip: false,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'day',
              displayFormats: {
                day: 'MMM d'
              }
            },
            adapters: {
              date: { locale: enUS }
            },
            grid: { drawTicks: false },
            ticks: {
              autoSkip: false,
              textStrokeColor: '#778FB2',
              display: true,
              font: {
                family: "Aeonik Fono, 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
                size: 11,
                weight: 500
              },
              callback: (value, i, arr) => {
                if (i === arr?.length - 1) {
                  return 'Today';
                }

                return dateTicks.includes(value) ? format(value, 'MMM d') : undefined;
              }
            },

            border: { dash: [8, 8] }
          },
          y: { display: false }
        },
        plugins: {
          legend: { display: false }
        }
      }}
      data={data}
    />
  );
});

export default MeetingTimeline;
