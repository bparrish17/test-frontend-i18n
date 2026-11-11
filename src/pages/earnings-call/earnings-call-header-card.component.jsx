import { Flex, HStack, Spacer, Stack, StackDivider, Text } from '@chakra-ui/react';
import { format } from 'date-fns';

import { SFCheckIconCircleFilled, SFDollarSignCircleIcon } from '@assets/icons';
import ReskinCardHeader from '@components/general/card/reskin-card-structure/reskin-card-header.component';
import EarningsCallHeaderMenu from './earnings-call-header-menu.component';
import ShareEarningsCallModal from './share-earnings-call-modal.component';

export default function EarningsCallHeaderCard({ card, bot, earningsCallDate, topicGroups }) {
  return (
    <EarningsCallHeaderCardWrapper
      card={card}
      earningsCallDate={earningsCallDate}
    >
      <HStack
        p='13px'
        gap={3}
        bg='brandPrimary.container'
        borderBottomLeftRadius='inherit'
        borderBottomRightRadius='inherit'
      >
        <Flex
          gap={1.5}
          align='center'
          flex={1}
          color='brandPrimary.primary'
        >
          <SFCheckIconCircleFilled
            boxSize={4}
            p='1px'
          />
          <Text
            fontSize='sm'
            fontWeight={500}
          >
            Summarized
          </Text>
        </Flex>
        <Spacer />
        <ShareEarningsCallModal
          card={card}
          earningsCallDate={earningsCallDate}
          topicGroups={topicGroups}
        />
        <EarningsCallHeaderMenu
          card={card}
          bot={bot}
          earningsCallDate={earningsCallDate}
        />
      </HStack>
    </EarningsCallHeaderCardWrapper>
  );
}

export function EarningsCallHeaderCardWrapper({ card, earningsCallDate, children }) {
  return (
    <Stack
      gap={0}
      divider={<StackDivider style={{ margin: 0 }} />}
      layerStyle='section-card'
    >
      <EarningsCallHeaderTitle
        card={card}
        earningsCallDate={earningsCallDate}
      />
      {children}
    </Stack>
  );
}

export function EarningsCallHeaderTitle({ card, earningsCallDate }) {
  return (
    <ReskinCardHeader
      title={card?.source_data?.title}
      leftElement={
        <SFDollarSignCircleIcon
          boxSize={5}
          color='brandPrimary.primary'
          p='1px'
        />
      }
    >
      <Text
        as='span'
        fontSize={{ base: 'xs', xl: '13px' }}
        fontWeight={600}
      >
        {earningsCallDate && format(new Date(earningsCallDate), 'EEEE MMMM d, yyyy ')}
      </Text>
    </ReskinCardHeader>
  );
}

/*

<HStack
  spacing={0}
  borderRadius='lg'
  border='reskin'
  overflow='hidden'
>
  <ControlledTooltip
    placement='bottom'
    label='Visible to everyone in your organization'
    bgColor='etc.scrim_90'
    p={3}
    borderRadius='lg'
    hasArrow
  >
    {(tooltipProps) => (
      <HStack
        bgColor='surface.containerLowest'
        py='4.5px'
        px={2}
        gap={1.5}
        {...tooltipProps}
      >
        <SFTwoBuildings
          boxSize={4}
          color='brandPrimary.primary'
        />
        <Text
          as='span'
          fontSize='sm'
          color='surface.onSurfaceVariant'
        >
          All
        </Text>
      </HStack>
    )}
  </ControlledTooltip>
    <ViewsMenu meeting={meeting} />
  </HStack>

  */
