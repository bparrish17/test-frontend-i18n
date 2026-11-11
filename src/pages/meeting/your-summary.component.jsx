import {
  Stack,
  Text,
  Divider,
  Icon,
  MenuItem,
  Box,
  Tabs,
  TabList,
  useTab,
  TabPanels,
  TabPanel,
  Flex
} from '@chakra-ui/react';
import { forwardRef, useState, useLayoutEffect, useEffect, useRef } from 'react';
import pluralize from 'pluralize';
import { useLocation } from 'react-router-dom';

import { SFBoltFillIcon, SFSquareOnSquareIcon, SFExclamationMarkCircleFilled } from '@assets/icons';
import { useCopyToClipboard } from '@util/hooks';
import { updateURL } from '@util/helpers';
import { useMeetingPageStore } from '@store/app.store';

import GeneratingCustomSummary from '@components/meeting/generating-custom-summary.component';
import ReskinSummaryCardMenu from '@components/general/card/reskin-summary-card/reskin-summary-card-menu.component';
import CustomSummaryMenu from '@components/custom-summary/custom-summary-menu.component';
import StyledTabBox from '@components/general/styled-tab-box.component';
import MeetingSummary from '@components/meeting/meeting-summary.component';
import { useTranslation } from 'react-i18next';

const overallInitiative = { title: 'Overall', icon: SFBoltFillIcon };

export default function YourSummarySection({
  scrollToStartOfSection,
  initialCard,
  cardsArr,
  meeting,
  onCardActionClick,
  hideCustomSummaryStuff
}) {
  const [maxLenses, setMaxLenses] = useState(2);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const lensId = urlParams.get('initiativeId') || location?.state?.lensId;
  const lensIndex = cardsArr?.findIndex((card) => card?.initiative?.id === lensId);
  const cardsSlice = cardsArr?.slice(0, maxLenses);
  const defaultIndex = lensIndex !== -1 ? lensIndex : 0;
  const [tabIndex, setTabIndex] = useState(defaultIndex);
  const hasCustomSummaries = cardsArr?.length > 0;
  const videoDisclosure = useMeetingPageStore((state) => state.videoDisclosure);

  const isProgrammaticUpdate = useRef(false);

  useEffect(() => {
    if (!cardsArr?.length) {
      return;
    }
    updateURL({
      cardsArr,
      tabIndex,
      location,
      videoDisclosure,
      urlParams
    });
  }, [cardsArr, tabIndex]);

  useLayoutEffect(() => {
    if (!lensId) {
      return;
    }

    if (lensIndex !== -1) {
      isProgrammaticUpdate.current = true;
      setTabIndex(lensIndex);
    }
  }, [lensIndex, lensId]);

  return (
    <Stack data-testid='your-summary'>
      <Flex w='full'>
        <Text
          variant='content-section-header'
          textTransform='uppercase'
          lineHeight={6}
          whiteSpace='nowrap'
        >
          Your {pluralize('Summary', cardsArr?.length)}
        </Text>
        <Divider m={3} />
        {!hideCustomSummaryStuff && (
          <CustomSummaryMenu
            meeting={meeting}
            allCards={cardsArr}
          />
        )}
      </Flex>
      <Tabs
        display='flex'
        flexDir='column'
        gap={6}
        index={tabIndex}
        onChange={(index) => {
          if (isProgrammaticUpdate.current) {
            // Reset the ref since the programmatic update is complete
            isProgrammaticUpdate.current = false;
            return;
          }
          setTabIndex(index);
        }}
      >
        <TabList
          hidden={hideCustomSummaryStuff || !hasCustomSummaries}
          flexDirection='column'
          alignItems='top'
          border='none'
          borderRadius='xl'
          onKeyDown={(e) => e.preventDefault()}
        >
          <Box
            gap={4}
            width='100%'
          >
            {cardsSlice?.map((card) => {
              return (
                <LensTab
                  key={card?.id}
                  highpriority={card?.high_priority?.toString()}
                  outline='none'
                  initiative={
                    card?.initiative?.id === initialCard?.initiative?.id
                      ? overallInitiative
                      : card?.initiative
                  }
                />
              );
            })}
            {cardsArr?.length > maxLenses && (
              <StyledTabBox
                bgColor='surface.surface'
                color='surface.onSurfaceVariant'
                onClick={() => setMaxLenses(undefined)}
              >
                +{cardsArr?.length - maxLenses} More
              </StyledTabBox>
            )}
          </Box>
        </TabList>
        <TabPanels px={0}>
          {cardsArr?.map((card, i) => (
            <TabPanel
              key={card?.id}
              p={0}
            >
              {card?.id === 'generating-summary' ? (
                <GeneratingCustomSummary />
              ) : (
                <MeetingSummary
                  key={card?.id}
                  enabled={tabIndex === i}
                  card={card}
                  meeting={meeting}
                  onDeleteFinished={() => {
                    scrollToStartOfSection();
                    setTabIndex(0);
                  }}
                  menuChildren={
                    <ReskinSummaryCardMenu
                      card={card}
                      onCardActionClick={onCardActionClick}
                      additionalCardMenuItems={<CopySummaryMenuItem card={card} />}
                    />
                  }
                />
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Stack>
  );
}

export function CopySummaryMenuItem({ card }) {
  const { t } = useTranslation();

  const copyToClipboard = useCopyToClipboard();

  return (
    <MenuItem
      icon={<SFSquareOnSquareIcon w={5} />}
      onClick={() =>
        copyToClipboard(
          `${card?.headline}\n\n${card?.sections
            ?.map((sec) => `${sec?.title}\n${sec?.content}`)
            .join('\n\n')}`,
          'Summary'
        )
      }
    >
      {t('yourSummary.copySummary')}
    </MenuItem>
  );
}

function _LensTab({ highPriority, ...props }, ref) {
  const tabProps = useTab({ ...props, ref });
  const isSelected = !!tabProps['aria-selected'];
  const isHighPriority = highPriority === 'true';

  const tagStylesMap = {
    highPrioritySelected: {
      bgColor: 'brandTertiary.onContainer',
      iconColor: 'brandTertiary.inverse',
      color: 'brandPrimary.onPrimary'
    },
    highPriority: {
      bgColor: 'brandTertiary.containerLow',
      color: 'brandTertiary.primary'
    },
    selected: {
      bgColor: 'surface.outlineVariant',
      color: 'surface.onSurface'
    },
    default: {
      bgColor: 'surface.surface',
      color: 'surface.onSurfaceVariant'
    }
  };

  let tagStyles = tagStylesMap.default;

  if (isSelected && isHighPriority) {
    tagStyles = tagStylesMap.highPrioritySelected;
  } else if (isSelected) {
    tagStyles = tagStylesMap.selected;
  } else if (isHighPriority) {
    tagStyles = tagStylesMap.highPriority;
  }

  return (
    <StyledTabBox
      tabProps={tabProps}
      bgColor={tagStyles.bgColor}
      color={tagStyles.color}
    >
      {isHighPriority && (
        <Icon
          as={SFExclamationMarkCircleFilled}
          color={tagStyles.iconColor ?? tagStyles.color}
          boxSize={4}
          mr={1}
        />
      )}
      {props?.initiative?.title}
    </StyledTabBox>
  );
}

const LensTab = forwardRef(_LensTab);
