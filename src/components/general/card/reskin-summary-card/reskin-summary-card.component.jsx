import {
  Box,
  Divider,
  Flex,
  Stack,
  Text,
  useBreakpointValue,
  useDisclosure,
  Button
} from '@chakra-ui/react';
import { memo, useState } from 'react';
import { format } from 'date-fns';
import { Link as ReactRouterLink } from 'react-router-dom';

import { useUserStore } from '@store/app.store';
import { useBreakpoints } from '@util/hooks';
import { getCardSourceLink, formatTimeDistance, getDocumentMetadataFromCard } from '@util/helpers';
import ReskinCardHeader from '@components/general/card/reskin-card-structure/reskin-card-header.component';
import SourceLogo from '@components/general/source-logo.component';
import LabelsBar from '@components/general/labels/labels-bar.component';
import CardActions from './reskin-summary-card-actions.component';
import { useTranslation } from 'react-i18next';

/**
 * @typedef {Object} ReskinSummaryCardProps
 * @property {Card} card
 * @property {(action: string; value: any; card: Card) => void} onCardActionClick
 * @property {boolean} showBody
 * @property {boolean} showFooter
 *
 * @param {ReskinSummaryCardProps} props
 */
function ReskinSummaryCard({
  card,
  onCardActionClick,
  showBody = true,
  showFooter = true,
  isExplorerRightRailCard = false,
  navigateOnClick = true,
  removeFn,
  enableLabels = true
}) {
  const { t } = useTranslation();

  const shareMeetingDisclosure = useDisclosure();
  const user = useUserStore((state) => state.user);
  const [isHovering, setIsHovering] = useState(false);
  const titleLink = getCardSourceLink(card, true, user);
  const documentTitle = getDocumentMetadataFromCard(card).name;
  const { isMobile } = useBreakpoints();
  const timeDistanceVariant = useBreakpointValue({ base: 'single', md: 'long' });
  const headerSizeVariant = useBreakpointValue({ base: 'md', md: 'lg' });

  const cardActionsProps = {
    card,
    onCardActionClick,
    isHovering,
    isMobile,
    showBody,
    shareMeetingDisclosure
  };

  return (
    <Stack
      layerStyle='section-card'
      borderRadius='xl'
      data-testid='reskin-summary-card'
      gap={0}
      onMouseOver={() => setIsHovering(true)}
      onMouseLeave={() => {
        if (!shareMeetingDisclosure.isOpen) {
          setIsHovering(false);
        }
      }}
    >
      <ReskinCardHeader
        title={documentTitle ?? card?.source_data?.title}
        titleLink={navigateOnClick ? titleLink : ''}
        size={headerSizeVariant}
        leftElement={
          <SourceLogo
            sourceType={card?.source}
            subSource={card?.sub_source}
            source={card?.source_data}
            tags={card?.tags}
            boxSize='18px'
            m={1.5}
          />
        }
        isDocument={!!documentTitle}
        headerChildren={
          removeFn ? (
            <Button
              variant='ghost'
              size='sm'
              onClick={removeFn}
            >
              X
            </Button>
          ) : (
            ''
          )
        }
      >
        <Flex
          flexDir={isExplorerRightRailCard ? 'column' : { base: 'column', md: 'row' }}
          gap={{ base: '7px', md: 'unset' }}
        >
          {card?.created_at && (
            <Text
              variant='label-reg-lg'
              color='surface.onSurfaceVariant'
            >
              {format(card?.created_at, 'ccc, LLL d, yyyy h:mm a')}
              <Text
                as='span'
                ml={3}
              >
                {formatTimeDistance(card?.created_at, timeDistanceVariant)}
              </Text>
            </Text>
          )}
          {card?.initiative && (
            <Flex ml={isExplorerRightRailCard ? 0 : { base: 0, md: 'auto' }}>
              <Text
                as='span'
                color='surface.onSurfaceVariant'
                variant='label-lighter-md'
                lineHeight='18px'
                mr={1.5}
              >
                {t('reskinSummaryCard.in')}
              </Text>
              <Text
                as='span'
                color={card?.initiative?.color}
                variant='label-caps-600-md'
                letterSpacing='1.5px'
                layerStyle='ellipsis-text'
              >
                {card?.initiative?.title}
              </Text>
            </Flex>
          )}
        </Flex>
      </ReskinCardHeader>
      {(showBody || showFooter) && <Divider style={{ margin: 0 }} />}
      {showBody && (
        <Box
          as={ReactRouterLink}
          to={titleLink}
          px={{ base: 4, md: 8 }}
          pt={3}
          pb={1.5}
        >
          <Text
            variant='body-lighter-md'
            as='span'
          >
            {card?.headline}
          </Text>
        </Box>
      )}

      {isMobile && enableLabels && (
        <LabelsBar
          meeting={card?.source === 'Meeting' ? card?.source_data : null}
          card={card}
        />
      )}

      {showFooter && (
        <Flex
          justify='space-between'
          px={{ base: 3, md: 6 }}
          pb={{ base: 2, md: 0 }}
        >
          {!isMobile &&
            (enableLabels ? (
              <LabelsBar
                meeting={card?.source === 'Meeting' ? card?.source_data : null}
                card={card}
              >
                <CardActions {...cardActionsProps} />
              </LabelsBar>
            ) : (
              <>
                <Box h={8} />
                <CardActions {...cardActionsProps} />
              </>
            ))}
          {isMobile && <CardActions {...cardActionsProps} />}
        </Flex>
      )}
    </Stack>
  );
}

export default memo(ReskinSummaryCard);
