import { Flex, HStack, Stack, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Link as ReactRouterLink } from 'react-router-dom';

import SourceButton from '@components/general/source-button.component';
import SourceInfo from '@components/lens/source-info.component';
import SourceModal from '@components/general/modals/source-modal.component';
import PrivateLabel from '@components/general/private-label.component';
import SourceModalHeader from '@components/general/modals/source-modal-header.component';
import SourceModalSubheader from '@components/general/modals/source-modal-subheader.component';
import SourceLogo from '@components/general/source-logo.component';
import { getCardSourceLink } from '@util/helpers';
import ExplorerAnalyzeButton from '@components/explorer/explorer-analyze-button.component';
import { useStatsigClient } from '@statsig/react-bindings';

const showViewMoreAfter = 3;

/**
 * A generic panel component that can display either Sources or References
 * @typedef {Object} GenericInsightPanelProps
 * @property {Array} items - Array of sources or references
 * @property {Object} fullCards - Map of full card data
 * @property {string} headerText - Text to display in the header
 * @property {boolean} useNumbering - Whether to use numbers (true) or bullets (false)
 * @property {boolean} [forceHideShowMore] - Whether to hide the internal View More button
 * @property {React.ReactNode} [customIcon] - Custom icon to use instead of the default source icon
 * @property {boolean} [disableHeaderClick] - Whether to disable clicking on the header to open modal
 * @property {number} [titleNoOfLines] - Number of lines to show for the title text before truncating
 * @property {boolean} [shouldLinkToSource] - Whether if card should link to its source data's respective page
 * @property {boolean} [showDate] - Whether to show the date in the source info (defaults to true)
 *
 * @param {GenericInsightPanelProps}
 */
export default function GenericInsightPanel({
  items = [],
  fullCards = {},
  headerText,
  useNumbering = false,
  forceHideShowMore = false,
  customIcon,
  disableHeaderClick = false,
  titleNoOfLines,
  shouldLinkToSource,
  showDate = true,
  showAnalyzeButton = false
}) {
  const [showAll, setShowAll] = useState(!showViewMoreAfter);
  const visibleItems = showAll
    ? items
    : items?.slice(0, showViewMoreAfter).filter((item) => !!item);
  const hasMore = showViewMoreAfter && items?.length > showViewMoreAfter;
  const shouldShowViewMoreButton = hasMore && !forceHideShowMore;
  const { checkGate } = useStatsigClient();
  const isExplorerEnabled = checkGate('explorer-access-buttons');

  return (
    <Stack spacing={6}>
      <HStack
        display={showAnalyzeButton ? 'flex' : ''}
        justifyContent='space-between'
      >
        <Text
          color='surface.onSurfaceVariant'
          variant='body-500-md'
        >
          {headerText}
        </Text>
        {isExplorerEnabled && showAnalyzeButton && (
          <ExplorerAnalyzeButton
            sourcesToSet={items?.filter((item) => !!item).map((item) => fullCards?.[item?.id])}
          />
        )}
      </HStack>
      <Stack spacing={4}>
        {visibleItems?.map((item, index) => {
          const cardId = item?.id;
          if (!cardId) return null;
          const fullCard = fullCards?.[cardId];
          return (
            <HStack
              key={cardId}
              align='start'
              id={useNumbering ? `source-${index + 1}` : undefined}
            >
              {!customIcon && (
                <ItemPrefix
                  useNumbering={useNumbering}
                  fullCard={fullCard}
                  index={index}
                />
              )}
              <Stack
                ml={customIcon ? 0 : 1}
                spacing={1}
              >
                {fullCard ? (
                  <>
                    <CardContent
                      fullCard={fullCard}
                      customIcon={customIcon}
                      disableHeaderClick={disableHeaderClick}
                      shouldLinkToSource={shouldLinkToSource}
                      referenceProps={useNumbering ? { referenceId: index + 1 } : {}}
                    />
                    <SourceInfo
                      fullCard={fullCard}
                      titleNoOfLines={titleNoOfLines}
                      showDate={showDate}
                    />
                  </>
                ) : (
                  <Text
                    variant='title-sm'
                    color='brandPrimary.primary'
                  >
                    {item.title}
                  </Text>
                )}
              </Stack>
            </HStack>
          );
        })}
        {shouldShowViewMoreButton && (
          <Text
            cursor='pointer'
            color='brandPrimary.primary'
            alignSelf='flex-start'
            variant='title-sm'
            onClick={() => setShowAll(!showAll)}
          >
            View&nbsp;{showAll ? 'Less' : 'More'}
          </Text>
        )}
      </Stack>
    </Stack>
  );
}

function ItemPrefix({ useNumbering, fullCard, index }) {
  if (useNumbering) {
    return (
      <SourceButton
        mt={0.5}
        sourceInfo={fullCard && <SourceInfo fullCard={fullCard} />}
        card={{ referenceId: index + 1, ...fullCard }}
      >
        {index + 1}
      </SourceButton>
    );
  }

  return (
    <Text
      color='surface.onSurfaceVariant'
      lineHeight='19px'
    >
      •
    </Text>
  );
}

function CardContent({
  fullCard,
  disableHeaderClick,
  customIcon,
  shouldLinkToSource,
  referenceProps
}) {
  const sourceImage = customIcon ?? (
    <SourceLogo
      sourceType={fullCard?.source}
      subSource={fullCard?.sub_source}
      source={fullCard?.source_data}
      tags={fullCard?.tags}
      boxSize={4}
      alignSelf='center'
    />
  );

  if (disableHeaderClick) {
    return (
      <SourceTitleStack
        fullCard={fullCard}
        sourceImage={sourceImage}
      />
    );
  }

  if (shouldLinkToSource) {
    return (
      <SourceTitleStack
        fullCard={fullCard}
        sourceImage={sourceImage}
        as={ReactRouterLink}
        to={getCardSourceLink(fullCard)}
        _hover={{ textDecoration: 'none' }}
      />
    );
  }

  const cardWithReferenceProps = { ...referenceProps, ...fullCard };

  return (
    <SourceModal
      forceTitle
      useBoltIcon
      card={cardWithReferenceProps}
      headerContent={<SourceModalHeader card={cardWithReferenceProps} />}
      subheaderContent={<SourceModalSubheader card={cardWithReferenceProps} />}
      sourceInfo={<SourceInfo fullCard={fullCard} />}
    >
      <SourceTitleStack
        fullCard={fullCard}
        sourceImage={sourceImage}
      />
    </SourceModal>
  );
}

function SourceTitleStack({ fullCard, sourceImage, ...props }) {
  return (
    <Flex
      gap={2}
      {...props}
    >
      {fullCard?.source ? sourceImage : null}
      <Text
        variant='title-sm'
        color='brandPrimary.primary'
        cursor='pointer'
      >
        {fullCard?.source_data?.title}
      </Text>
      {fullCard?.source_data?.sensitive && <PrivateLabel />}
    </Flex>
  );
}
