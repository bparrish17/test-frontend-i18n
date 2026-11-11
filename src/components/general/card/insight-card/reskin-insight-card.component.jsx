import { Flex, Box, Text, Heading, Stack, Icon, StackDivider } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { format, isToday, isYesterday } from 'date-fns';
import { useStatsigClient } from '@statsig/react-bindings';

import { SFCalendarIcon } from '@assets/icons';
import {
  getLensIconComponent,
  removeFootnotesFromInsightSection,
  getCardSourceLink
} from '@util/helpers';

import InsightCarousel from './insight-carousel.component';
import HighPriorityExplanation from '@components/general/high-priority-explanation.component';

// const numberIcons = [
//   SFNumberOneCircleOutlined,
//   SFNumberTwoCircleOutlined,
//   SFNumberThreeCircleOutlined,
//   SFNumberFourCircleOutlined,
//   SFNumberFiveCircleOutlined
// ];

/**
 *
 * @param {{ insight: Insight }} props
 * @returns
 */
export default function ReskinInsightCard({ insight }) {
  return (
    <Stack gap={6}>
      <Flex
        gap={2}
        align='center'
        color={insight?.initiative?.color ?? 'brandPrimary.primary'}
      >
        <Icon
          as={getLensIconComponent(insight?.initiative, 'lens')}
          boxSize='24px'
        />
        <Text fontWeight={600}>{insight?.initiative?.title}</Text>
      </Flex>
      <Heading
        size={{ base: 'md', md: 'lg', xl: 'xl' }}
        letterSpacing='tight'
        as={ReactRouterLink}
        cursor='pointer'
        to={`/insights/${insight?.id}`}
      >
        {insight?.headline}
      </Heading>

      <Text as='span'>
        <Text
          as='span'
          variant='brand-label'
          mr={2}
        >
          {getHeadlineDateTime(insight?.updated_at)}
        </Text>
        <Text
          as='span'
          color='surface.onSurfaceVariant'
        >
          {insight?.subheadline}
        </Text>
      </Text>
      <Stack gap={6}>
        <Text mt={-2}>
          {removeFootnotesFromInsightSection(insight?.sections[0]?.content)}
          <Text
            as={ReactRouterLink}
            pl={1}
            to={`/insights/${insight?.id}`}
            color='brandPrimary.primary'
            fontWeight={500}
            _hover={{ textDecor: 'underline' }}
          >
            Read More
          </Text>
        </Text>
        <Flex gap={11}>
          <InsightCarousel>
            {insight?.cards?.map((card) => (
              <InsightSourceCard
                key={card.id}
                card={card}
              />
            ))}
          </InsightCarousel>
        </Flex>
      </Stack>
    </Stack>
  );
}

function InsightSourceCard({ card }) {
  const { checkGate } = useStatsigClient();
  const enableHighPriority = checkGate('high-priority-cards');

  return (
    <Box
      flex={1}
      layerStyle='section-card'
      borderRadius='md'
      p={3}
      as={ReactRouterLink}
      to={getCardSourceLink(card)}
      state={{ lensId: card?.initiative?.id }}
      cursor='pointer'
      w='full'
    >
      <Stack
        divider={<StackDivider />}
        h='full'
      >
        <Text
          fontWeight={600}
          color='brandPrimary.primary'
          mb='auto'
        >
          {card?.title}
        </Text>
        {enableHighPriority && card?.high_priority && card?.high_priority_explanation && (
          <HighPriorityExplanation
            rounded='xl'
            card={card}
          />
        )}
        {card?.source_data && (
          <Flex
            gap={1}
            align='center'
            fontSize='sm'
            fontWeight={500}
          >
            <Text as='span'>Source: </Text>
            <Flex
              align='center'
              color='brandPrimary.primary'
              gap={0.5}
            >
              {card?.source === 'Meeting' && (
                <SFCalendarIcon
                  boxSize={6}
                  p={1}
                />
              )}
              <Text>{card?.source_data?.title}</Text>
            </Flex>
          </Flex>
        )}
      </Stack>
    </Box>
  );
}

//

function getHeadlineDateTime(createdAt) {
  let dateTime;
  if (isToday(createdAt)) {
    dateTime = 'Today';
  } else if (isYesterday(createdAt)) {
    dateTime = 'Yesterday';
  } else {
    dateTime = format(createdAt, 'ccc, LLL d');
  }
  return `${dateTime} ${format(createdAt, 'h:mma')}`;
}
