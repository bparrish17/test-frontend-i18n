import {
  Text,
  Stack,
  HStack,
  Flex,
  useDisclosure,
  Collapse,
  IconButton,
  Icon
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { Fragment } from 'react';

import { useBotById } from '@services/query-services/bots.query-service';
import { useTopicGroupsAndSummaries } from '@util/hooks';
import { ChevronDownIcon, ChevronUpIcon, SFCalendarIcon } from '@assets/icons';
import { formatToStopwatchDuration, hours } from '@util/helpers';

export default function VideoModalTranscript({ meeting, bot, progress, duration, onTimeClick }) {
  // fetch full bot object if not on meeting page
  const { data: fullBot } = useBotById(bot?.id, { enabled: !bot?.transcripts });
  const { topicGroups } = useTopicGroupsAndSummaries(meeting, bot?.transcripts ? bot : fullBot);

  const getTimeHighlighting = (summary, isLastTotalSummary) => {
    // if time matches last summary, highlight all the way to end of video
    // - 1 to compensate for Math.floor in progress calculation
    const endTimeToCheck = isLastTotalSummary ? duration : summary?.time?.rawEnd - 1;
    // inclusive if at end of all summaries, exclusive otherwise
    const isBeforeEnd = isLastTotalSummary ? progress <= endTimeToCheck : progress < endTimeToCheck;
    return summary?.time?.rawStart - 1 <= progress && isBeforeEnd;
  };

  return (
    <Stack
      gap={0}
      flex={1}
      borderTopRightRadius='inherit'
      borderBottomRightRadius='inherit'
      maxH='inherit'
      position='relative'
      bgColor='surface.container'
    >
      <HStack
        px={3}
        bgColor='brandPrimary.primary'
        borderTopRightRadius='inherit'
        color='brandPrimary.onPrimary'
        position='sticky'
        fontSize='sm'
        py={2}
        align='flex-start'
        boxShadow='md'
      >
        <SFCalendarIcon
          boxSize={4}
          mt={0.5}
        />
        <Flex wrap='wrap'>
          <Text
            fontWeight={500}
            mr={2}
          >
            {meeting?.title}
          </Text>
          <Text opacity={0.6}>{format(meeting?.start_at, 'E MMM d, p')}</Text>
        </Flex>
      </HStack>
      <Stack
        gap={0}
        overflow='scroll'
        borderBottomRightRadius='inherit'
        style={{ scrollbarWidth: 'thin' }}
      >
        {topicGroups?.map((topicGroup, topicIdx, topicArr) => (
          <Fragment key={topicGroup?.title}>
            {topicGroup?.summaries?.map((summary, summaryIdx, summaryArr) => (
              <TimeTitleRow
                key={summary?.title}
                item={summary}
                isHighlighted={getTimeHighlighting(
                  summary,
                  topicIdx === topicArr?.length - 1 && summaryIdx === summaryArr?.length - 1
                )}
                onTimeClick={onTimeClick}
              >
                <Stack alignItems='flex-start'>
                  {summary?.contentLines?.map((contentLine) => (
                    <Text
                      key={contentLine}
                      textAlign='left'
                      fontSize='sm'
                    >
                      {contentLine}
                    </Text>
                  ))}
                </Stack>
              </TimeTitleRow>
            ))}
          </Fragment>
        ))}
      </Stack>
    </Stack>
  );
}

const colorVariants = (isHighlighted) => ({
  bgColor: isHighlighted ? 'brandPrimary.onPrimary' : 'surface.container',
  titleColor: isHighlighted ? 'brandPrimary.primary' : 'surface.onSurfaceVariant',
  timeBgColor: isHighlighted ? 'brandPrimary.primary' : 'surface.containerLowest',
  timeColor: isHighlighted ? 'brandPrimary.onPrimary' : 'surface.onSurfaceVariant'
});

function TimeTitleRow({ item, children, isHighlighted, onTimeClick }) {
  const { isOpen, onOpen, onToggle } = useDisclosure();
  const { bgColor, titleColor, timeColor, timeBgColor } = colorVariants(isHighlighted);

  return (
    <HStack
      p={2}
      bgColor={bgColor}
      cursor='pointer'
      _hover={{ bgColor: !isOpen && !isHighlighted && 'surface.containerHigh' }}
      onClick={() => {
        onOpen();
        onTimeClick(item?.time?.rawStart);
      }}
    >
      <Flex
        w={10}
        align='center'
        justify='center'
        h='18px'
        mt='1px'
        bgColor={timeBgColor}
        borderRadius='4px'
        textStyle='aeonik'
        alignSelf='flex-start'
        color={timeColor}
        fontSize={item?.time?.rawStart * 1000 > hours(1) ? '11px' : '13px'}
      >
        {formatToStopwatchDuration(item?.time?.rawStart * 1000)}
      </Flex>
      <Stack flex={1}>
        <Text
          h='full'
          color={titleColor}
          fontSize='sm'
          textAlign='left'
        >
          {item?.title}
        </Text>
        <Collapse
          in={isOpen}
          animateOpacity
        >
          {children}
        </Collapse>
      </Stack>
      <IconButton
        size='xs'
        variant='ghost'
        colorScheme='surface'
        icon={
          <Icon
            as={isOpen ? ChevronUpIcon : ChevronDownIcon}
            boxSize={4}
            color='brandPrimary.primary'
          />
        }
        isRound
        alignSelf='flex-start'
        _hover={{ bgColor: 'surface.surfaceDim' }}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      />
    </HStack>
  );
}
