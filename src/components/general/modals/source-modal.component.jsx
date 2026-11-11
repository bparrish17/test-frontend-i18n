import {
  Box,
  Circle,
  HStack,
  Icon,
  ListItem,
  ModalCloseButton,
  Spacer,
  Stack,
  TagLeftIcon,
  Text,
  UnorderedList,
  VStack
} from '@chakra-ui/react';
import { format } from 'date-fns';
import { first } from 'lodash-es';
import { useStatsigClient } from '@statsig/react-bindings';
import { Link as ReactRouterLink } from 'react-router-dom';

import StyledModal from '@components/general/modals/styled-modal.component';
import { ChevronRightIcon, SFBoltFillIcon } from '@assets/icons';
import CardSection from '@pages/meeting/card-section.component';
import { useInsights } from '@services/query-services/insights.query-service';
import { ICON_MAPPING } from '@util/constants';
import HighPriorityExplanation from '@components/general/high-priority-explanation.component';

/**
 * This higher order component wraps an element you would want
 * to launch a modal to display the content of a Lens Source
 *
 * @param {*} card :Lens Source
 * @param {boolean} [titleToInsight=true] : enables title click through (cheveron)
 * @param {*} children
 * @param {React.ReactNode} [headerContent] : optional custom header content
 * @param {React.ReactNode} [subheaderContent] : optional custom subheader content
 */

export default function SourceModal({
  children,
  card,
  headerContent,
  subheaderContent,
  sourceInfo,
  forceTitle = false,
  useBoltIcon = false,
  titleToInsight = false
}) {
  const { data: insightTitleLinkProps } = useInsights(
    {
      initiative_type: 'Lens',
      initiative_ids: card?.initiative?.id,
      person_id: card?.person?.id
    },
    {
      enabled: titleToInsight && !headerContent && !subheaderContent,
      select: (insightsByLens) => ({
        as: ReactRouterLink,
        to: `/insights/${first(insightsByLens)?.id}`
      })
    }
  );

  const lensIcon = card?.initiative?.icon ?? 'lens';
  const lensTitle = card?.initiative?.title || card?.title || '';

  const sectionIcon = useBoltIcon ? SFBoltFillIcon : ChevronRightIcon;

  const getDate = () => {
    if (card?.source_data?.start_at) {
      return new Date(card.source_data.start_at);
    }
    if (card?.created_at) {
      return new Date(card.created_at);
    }
    return null;
  };

  const date = getDate();

  const { checkGate } = useStatsigClient();
  const enableHighPriority = checkGate('high-priority-cards');

  return (
    <StyledModal
      openButton={children}
      modalProps={{
        scrollBehavior: 'inside',
        blockScrollOnMount: true,
        returnFocusOnClose: false
      }}
      modalContentProps={{
        maxH: '80vh',
        w: { base: '600px' },
        borderRadius: '10',
        position: 'relative'
      }}
      modalBodyProps={{
        overflowY: 'auto',
        pb: 0
      }}
      customHeader={
        <VStack
          alignItems='flex-start'
          color='brandPrimary.onPrimary'
          bgColor='brandPrimary.onContainer'
          pt={4}
          pb={2}
          px={{ base: 6, sm: 4 }}
        >
          {/* Optional custom header content */}
          {headerContent && <Box mb={2}>{headerContent}</Box>}
          {/* Optional custom subheader content */}
          {/* Default header content if no custom content provided */}
          {!headerContent && !subheaderContent && (
            <>
              <HStack gap={0}>
                <TagLeftIcon
                  m={0}
                  boxSize='24px'
                  as={ICON_MAPPING[lensIcon]?.icon}
                />
                <Text
                  {...insightTitleLinkProps}
                  ml={3}
                  display='flex'
                  alignItems='center'
                  fontWeight={500}
                >
                  {lensTitle}
                  {titleToInsight && !useBoltIcon && (
                    <Icon
                      as={ChevronRightIcon}
                      boxSize='20px'
                      color='brandPrimary.onPrimary'
                      ml={2}
                    />
                  )}
                </Text>
                <Spacer />
                <ModalCloseButton />
              </HStack>

              <HStack
                width='100%'
                spacing={4}
                position='relative'
              >
                {card?.referenceId && (
                  <Circle
                    mt={4}
                    size='20px'
                    bg='brandPrimary.primary'
                    color='white'
                    fontSize='sm'
                    fontWeight='600'
                  >
                    {card?.referenceId}
                  </Circle>
                )}
                <Text
                  mt={5}
                  fontSize='xl'
                  fontWeight='600'
                  lineHeight='25px'
                  flex={1}
                >
                  {forceTitle && date
                    ? `${card?.source_data?.title}  - ${format(date, 'MMMM d, yyyy')}`
                    : card?.headline}
                </Text>
              </HStack>
              <Box ml={9}>{sourceInfo}</Box>
            </>
          )}
          {/* Always show close button */}
          {(headerContent || subheaderContent) && <ModalCloseButton mt='-2px' />}
        </VStack>
      }
    >
      <Stack
        gap={0}
        py={5}
        bgColor='surface.surfaceBright'
      >
        {subheaderContent && <Box mb={4}>{subheaderContent}</Box>}

        {enableHighPriority && card?.high_priority && card?.high_priority_explanation && (
          <HighPriorityExplanation
            card={card}
            mx={4}
            mb={5}
          />
        )}
        {card?.sections?.map((section) =>
          card?.initiative?.type === 'Lens' ? (
            <CardSection
              key={section?.title}
              title={section?.title}
              icon={sectionIcon}
              borderRadius={0}
              bgColor='surface.surfaceBright'
            >
              <Text
                fontWeight={500}
                fontSize='sm'
                color='surface.onSurfaceVariant'
                pl={9}
                pr={5}
                lineHeight={6}
              >
                {section?.content}
              </Text>
            </CardSection>
          ) : (
            <CardSection
              key={section?.title}
              title={section?.title}
              icon={sectionIcon}
              borderRadius={0}
              bgColor='surface.surfaceBright'
            >
              <UnorderedList
                color='surface.onSurfaceVariant'
                fontWeight={400}
                fontSize='sm'
                pl={10}
                ml={1}
              >
                {section?.content
                  ?.split('* ')
                  .slice(1)
                  ?.map((item) => {
                    return (
                      <ListItem
                        key={item}
                        sx={{ '&:not(:last-child)': { paddingBottom: '1px' } }}
                      >
                        {item.replace('\\n', '')}
                      </ListItem>
                    );
                  })}
              </UnorderedList>
            </CardSection>
          )
        )}
      </Stack>
    </StyledModal>
  );
}
