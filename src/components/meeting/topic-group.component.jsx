import {
  Flex,
  Box,
  Text,
  HStack,
  Icon,
  Collapse,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  UnorderedList,
  ListItem,
  Spacer,
  Stack,
  IconButton,
  Hide,
  Spinner
} from '@chakra-ui/react';
import { forwardRef, memo } from 'react';

import ThreeDotLoader from '@components/general/loader/three-dot-loader.component';
import { ChevronDownIcon, SFVideoFilled } from '@assets/icons';
import { MotionBox } from '@components/general/motion-box.component';
import { formatToStopwatchDuration } from '@util/helpers';
import { useBreakpoints } from '@util/hooks';

function TopicGroup(
  {
    startTime,
    rawStartTime,
    endTime,
    title,
    summaries,
    isLive,
    transcriptIndex,
    showLoading,
    onVideoClick,
    noCollapse = false,
    topicStatus,
    enableVideoButton
  },
  ref
) {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  const textColor = isLive ? 'live.primary' : 'surface.onSurfaceVariant';
  const notLoadingTextColor = 'surface.onSurfaceVariant';
  const topicGroupTimeColor = `${
    transcriptIndex === 'live' ? 'live.primary' : 'surface.onSurfaceVariant'
  }`;
  const defaultAccordionIndexes = isLive ? summaries?.map((_, idx) => idx) : [];

  return (
    <Stack
      flexDir={{ base: 'column', lg: 'row' }}
      gap={{ base: 4, lg: 0 }}
      ref={ref}
      w='full'
      style={{ scrollMarginTop: '30px' }}
    >
      <Stack
        w='full'
        gap={0}
      >
        {(title || isLive) && (
          <Flex bgColor='surface.container'>
            <Hide
              below='lg'
              ssr={false}
            >
              <HStack>
                {isLive && !topicStatus && (
                  <Spinner
                    size='sm'
                    speed='.75s'
                    color='live.primary'
                    ml={3}
                  />
                )}
                <TimeLabel
                  time={`${startTime}-${endTime}`}
                  showVideoButton={enableVideoButton && isOpen && !isLive}
                  textProps={{ color: topicGroupTimeColor }}
                  onClick={() => onVideoClick(rawStartTime)}
                  minW={{ base: '88px', lg: !topicStatus ? 36 : 44 }}
                />
              </HStack>
            </Hide>
            <HStack
              as={noCollapse ? 'div' : 'button'}
              flex={1}
              gap={4}
              p={3}
              pl={{ base: 3, lg: 6 }}
              onClick={!noCollapse ? onToggle : undefined}
            >
              <Text
                fontWeight={isOpen && 600}
                letterSpacing='tight'
                color={showLoading ? textColor : notLoadingTextColor}
                fontSize={{ base: 'sm', lg: 'md' }}
                textAlign='start'
              >
                {title}
              </Text>
              <Spacer />
              {/* rotating chevron. can be reused later on */}
              {!noCollapse && (
                <MotionBox
                  animate={{ rotate: isOpen ? -180 : 0 }}
                  initial={{ rotate: 0 }}
                  transition={{ type: 'tween', duration: 0.2 }}
                  boxSize={4}
                  display='flex'
                  alignItems='center'
                  justifyContent='center'
                >
                  <Icon
                    as={ChevronDownIcon}
                    color='surface.onSurfaceVariant'
                  />
                </MotionBox>
              )}
            </HStack>
          </Flex>
        )}
        {/* startingHeight to prevent jarring collapse */}
        <Collapse in={isOpen || noCollapse}>
          <Box>
            {summaries?.length > 0 && (
              <Accordion
                allowMultiple
                defaultIndex={defaultAccordionIndexes}
              >
                {summaries?.map((summary, index) => {
                  const isLast = summaries.length - 1 === index && showLoading;
                  return (
                    <AccordionItem
                      w='full'
                      key={summary?.title}
                      border='none'
                    >
                      {({ isExpanded }) => {
                        const statusColor = isLast ? 'live.primary' : 'surface.onSurfaceVariant';

                        return (
                          <>
                            <AccordionButton
                              p={0}
                              h='fit-content'
                            >
                              <HStack
                                gap={0}
                                w='full'
                                pr='9px'
                                position='relative'
                              >
                                {isLast && !isExpanded && index > 0 && (
                                  <Spinner
                                    size='sm'
                                    speed='.75s'
                                    color='live.primary'
                                    position='absolute'
                                    ml={3}
                                  />
                                )}
                                <TimeLabel
                                  showVideoButton={enableVideoButton && isExpanded && !isLive}
                                  iconSize='18px'
                                  bgColor='surface.containerLow'
                                  time={formatToStopwatchDuration(summary.time.rawStart * 1000)}
                                  textProps={{
                                    fontSize: 'sm',
                                    color: statusColor
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onVideoClick(summary.time.rawStart);
                                  }}
                                />
                                <Text
                                  pl={{ base: 3, lg: 6 }}
                                  textAlign='left'
                                  fontWeight={isExpanded && 600}
                                  fontSize={{ base: 'sm', lg: 'md' }}
                                  color={statusColor}
                                  letterSpacing='tight'
                                >
                                  {summary?.title}
                                </Text>
                                <Spacer />
                                <AccordionIcon color='surface.onSurfaceVariant' />
                              </HStack>
                            </AccordionButton>
                            <AccordionPanel
                              color='surface.onSurfaceVariant'
                              p={0}
                            >
                              <Flex>
                                <Box
                                  minW={{ base: '88px', lg: 44 }}
                                  bgColor='surface.containerLow'
                                  p={3}
                                >
                                  <Box
                                    borderRight='solid 1px'
                                    borderRightColor={statusColor}
                                    h='full'
                                  />
                                </Box>
                                <SummaryContent
                                  py={{ base: 2, lg: 3 }}
                                  spacing={3}
                                  contentLines={summary.contentLines}
                                  isLast={isLast}
                                />
                              </Flex>
                            </AccordionPanel>
                          </>
                        );
                      }}
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </Box>
        </Collapse>
      </Stack>
    </Stack>
  );
}

function SummaryContent({ contentLines, isLast, ...containerProps }) {
  return (
    <Box
      mt={2}
      pr={4}
      ml={{ base: 3, lg: 6 }}
    >
      <UnorderedList {...containerProps}>
        {contentLines?.map((line) => {
          return (
            <ListItem
              key={line}
              fontSize='sm'
              pl={3}
              color='surface.onSurfaceVariant'
            >
              {line}
            </ListItem>
          );
        })}
      </UnorderedList>
      {isLast && <ThreeDotLoader />}
    </Box>
  );
}

function TimeLabel({
  time,
  onClick,
  iconSize,
  showVideoButton,
  textProps = {},
  ...containerProps
}) {
  const { isMobile } = useBreakpoints();
  const enableVideoButton = showVideoButton && !isMobile;
  return (
    <Flex
      justify={enableVideoButton ? 'space-between' : 'flex-end'}
      p={3}
      minW={{ base: '88px', lg: 44 }}
      {...containerProps}
    >
      {enableVideoButton && (
        <IconButton
          size='sm'
          variant='reskinGhost'
          color='brandPrimary.primary'
          icon={<SFVideoFilled boxSize={iconSize} />}
          onClick={onClick}
        />
      )}
      <Text
        cursor='pointer'
        variant='aeonik'
        lineHeight='24px'
        whiteSpace='nowrap'
        {...textProps}
      >
        {time}
      </Text>
    </Flex>
  );
}

export default memo(forwardRef(TopicGroup));
