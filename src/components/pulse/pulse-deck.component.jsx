import React, { useEffect, useState, useRef, Suspense } from 'react';
import {
  Grid,
  GridItem,
  Modal,
  ModalCloseButton,
  ModalContent,
  IconButton,
  ModalOverlay,
  Text,
  Flex,
  Box
} from '@chakra-ui/react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import CoverPulsePanel from '@components/pulse/pp-cover.component';
import {
  calculateNetSentimentScore,
  calculateNetStrategicTacticalScore,
  PANEL_DECK_MAP
} from '@util/helpers/pulse.helpers.js';

import SummaryPulsePanel from '@components/pulse/pp-summary.component';
import SentimentPulsePanel from '@components/pulse/pp-sentiment.component.jsx';
import TopicsPulsePanel from '@components/pulse/pp-topics.component';
import FollowupsPulsePanel from '@components/pulse/pp-followups.component';
import ParticipantsPulsePanel from '@components/pulse/pp-participants.component';
import { delay, get, keys } from 'lodash-es';
import { useSwipeHandlers } from '@util/hooks/pulse.hooks';
import { configResponsive, useResponsive, useKeyPress, useUpdate, useUnmount } from 'ahooks/es';
import { useMeetingPageState } from '@util/hooks/index.js';
import { useNavigate } from 'react-router-dom';
import { usePulseStore } from '@store/pulse.store';
import { useReadCard } from '@services/query-services/cards.query-service.js';
import { lazyWithRetry } from '@util/helpers';
import { useTranslation } from 'react-i18next';
// import { getRandomPulseImage } from '@util/helpers/index.js';
const StoriesLazy = lazyWithRetry(() => import('react-insta-stories'));

configResponsive({
  showCard1: 1280,
  showCard2: 1616,
  showNav: 1086
});

const panelComponents = {
  Cover: {
    component: CoverPulsePanel,
    name: 'Cover',
    additionalCardPrep: (card) => {
      return {
        ...card,
        type: 'Cover',
        net_sentiment_score: calculateNetSentimentScore(card.source_data.topics),
        net_strategic_tactical_score: calculateNetStrategicTacticalScore(card.source_data.topics)
      };
    }
  },
  Summary: {
    component: SummaryPulsePanel,
    name: 'Your Personal Summary',
    countPath: 'sections.length',
    additionalCardPrep: (card) => {
      return {
        ...card,
        type: 'Summary',
        source_data: {
          ...card.source_data
          // todo: make this image dynamic?
          // background_image: getRandomPulseImage()
        }
      };
    }
  },
  Sentiment: {
    component: SentimentPulsePanel,
    name: 'Topics By Sentiment',
    countPath: 'source_data.topics.length',
    additionalCardPrep: (card) => {
      return {
        ...card,
        type: 'Sentiment'
      };
    }
  },
  Topics: {
    component: TopicsPulsePanel,
    name: 'Strategic & Tactical Topics',
    countPath: 'source_data.topics.length',
    additionalCardPrep: (card) => {
      return {
        ...card,
        type: 'Topics'
      };
    }
  },
  Topics_S: {
    component: TopicsPulsePanel,
    name: 'Strategic Topics',
    countPath: 'source_data.topics.length',
    additionalCardPrep: (card) => {
      return {
        ...card,
        topicType: 'strategic',
        type: 'Topics'
      };
    }
  },
  Topics_T: {
    component: TopicsPulsePanel,
    name: 'Tactical Topics',
    countPath: 'bot.topics.length',
    additionalCardPrep: (card) => {
      return {
        ...card,
        topicType: 'tactical',
        type: 'Topics'
      };
    }
  },
  Followups: {
    component: FollowupsPulsePanel,
    name: 'Followups',
    countPath: 'bot.followups.length',
    additionalCardPrep: (card) => {
      return {
        ...card,
        type: 'FollowUps'
      };
    }
  },
  Participants: {
    component: ParticipantsPulsePanel,
    name: 'Participants',
    countPath: 'source_data.participants.length',
    additionalCardPrep: (card) => {
      return {
        ...card,
        type: 'Participants'
      };
    }
  }
  // todo: add more panels here when needed
};

const iconBtnStyle = {
  borderRadius: '16px',
  background: 'rgba(103, 123, 152, 0.15)',
  height: '48px',
  minHeight: '40px',
  padding: '8px 12px',
  marginBottom: '12px',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
};

function PulseDeck({
  isOpen,
  onClose,
  onMeetingChange,
  meeting,
  variant,
  launchCards,
  isSingleMeeting = false
}) {
  const { t } = useTranslation();

  // TODO: make countPath the only source of truth
  // use item name there as well
  // all new carousel functionality

  const panels = PANEL_DECK_MAP[variant];
  let { bot, attendees } = useMeetingPageState(meeting?.source_data?.id);
  const [animateOut, setAnimateOut] = useState('');
  const [animateIn, setAnimateIn] = useState('');
  const [storiesKey, setStoriesKey] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [stories, setStories] = useState([]);
  const isPaused = usePulseStore((state) => state?.isPaused);
  const setIsPaused = usePulseStore((state) => state?.setIsPaused);
  const { mutate: readCard } = useReadCard({});
  const initNavState = {
    previous: undefined,
    next: undefined,
    nextLaunchCards: [undefined, undefined],
    previousLaunchCards: [undefined, undefined]
  };
  const [panelNavigation, setPanelNavigation] = useState(initNavState);
  const visibleIndex = useRef(0);
  const closeButtonRef = useRef(null);
  const hasBootstrapped = useRef(false);
  const update = useUpdate();
  const navigate = useNavigate();
  const { showCard1, showCard2, showNav } = useResponsive();

  // DECK MANAGEMENT
  const _resetDeck = () => {
    visibleIndex.current = 0;
    setSelectedIndex(0);
    bot = null;
    attendees = null;
    hasBootstrapped.current = false;
    setStoriesKey((prevKey) => prevKey + 1);
  };
  const _updatePanelNavigation = (index, shouldReset) => {
    // console.log('updating panel nav', index, shouldReset);
    if (shouldReset) {
      setPanelNavigation(initNavState);
      return;
    }

    let prevPanel = panelComponents[panels[index - 1]];
    let nextPanel = panelComponents[panels[index + 1]];
    const prevPanelPath = prevPanel?.countPath;
    const nextPanelPath = nextPanel?.countPath;
    const { meetingIndex } = meeting;

    const fullMeeting = {
      ...meeting,
      bot,
      attendees
    };

    prevPanel = {
      ...prevPanel,
      count: get(fullMeeting, prevPanelPath, undefined)
    };
    nextPanel = {
      ...nextPanel,
      count: get(fullMeeting, nextPanelPath, undefined)
    };

    const previousLaunchCards = [
      meetingIndex > 1 ? launchCards[meetingIndex - 2] : undefined,
      meetingIndex > 0 ? launchCards[meetingIndex - 1] : undefined
    ];

    const nextLaunchCards = [
      meetingIndex < launchCards.length - 1 ? launchCards[meetingIndex + 1] : undefined,
      meetingIndex < launchCards.length - 2 ? launchCards[meetingIndex + 2] : undefined
    ];

    setPanelNavigation({
      previous: index === 0 ? { name: 'Previous Meeting' } : prevPanel,
      next: index === panels.length - 1 ? { name: 'Next Meeting' } : nextPanel,
      previousLaunchCards,
      nextLaunchCards
    });

    // update();
  };
  const _buildDeck = () => {
    return panels.map((panelType) => {
      const { component, additionalCardPrep } = panelComponents[panelType];
      const newCard = additionalCardPrep ? additionalCardPrep(meeting) : meeting;

      if (!component) {
        console.error(`Unknown panel type: ${panelType}`);
        return null;
      }

      return component({
        panel: {
          ...newCard,
          attendees,
          bot
        }
      });
    });
  };

  // RENDERERS
  const renderSideNavSection = ({ direction, onClick }) => {
    const isNext = direction === 'next';
    const icon = isNext ? (
      <FaAngleRight
        style={{
          height: '24px',
          width: '24px'
        }}
      />
    ) : (
      <FaAngleLeft
        style={{
          height: '24px',
          width: '24px'
        }}
      />
    );

    const isOnLastSingleMeetingPanel =
      isSingleMeeting && visibleIndex.current === panels.length - 1;
    const isOnFirstSingleMeetingPanel = isSingleMeeting && visibleIndex.current === 0;
    const panel = isNext ? panelNavigation?.next : panelNavigation?.previous;
    const launchCards = isNext
      ? panelNavigation?.nextLaunchCards
      : panelNavigation?.previousLaunchCards;

    let arrowContainerWidth;
    if (showCard2 && showCard1) {
      arrowContainerWidth = '140px';
    } else if (showCard1) {
      arrowContainerWidth = '70px';
    } else {
      arrowContainerWidth = '0px';
    }

    const arrowContainer = (
      <Box
        width='140px'
        marginTop='45px'
        mx={2}
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        height='150px'
        alignSelf='flex-start'
      >
        <Flex justifyContent='center'>
          <IconButton
            onClick={onClick}
            style={{
              ...iconBtnStyle
            }}
            aria-label={isNext ? t('pulseDeck.nextPulse') : t('pulseDeck.previousPulse')}
            icon={icon}
          />
        </Flex>

        <Flex
          mt={3}
          flexDir='column'
          justifyContent='center'
          alignItems='center'
        >
          <Text
            textAlign='center'
            color='#789DF1'
            variant='body-reg-sm'
          >
            {panel?.name}
          </Text>

          {panel?.count && (
            <Text
              mt={1}
              color='#A6B3C4'
              variant='label-reg-lg'
            >
              {t('pulseDeck.items', { count: panel?.count })}
            </Text>
          )}
        </Flex>
      </Box>
    );

    // on the edges of a single meeting, dont show nav
    if (isOnLastSingleMeetingPanel && isNext) {
      return <Box width='100%' />;
    }

    if (isOnFirstSingleMeetingPanel && !isNext) {
      return <Box width='100%' />;
    }

    return (
      <Flex
        alignItems='center'
        justifyContent='center'
        width='100%'
      >
        <Box
          width='100%'
          display='flex'
          flexDirection='row'
        >
          {isNext && animateOut === '' && arrowContainer}
          <Flex
            justifyContent='center'
            width='calc(100% - 140px)'
          >
            <Flex
              flexDir={isNext ? 'row' : 'row-reverse'}
              justifyContent='center'
              width={arrowContainerWidth}
              gap={4}
              px={4}
            >
              {!isNext && showCard1 && !animateOut && bot && attendees && launchCards[1]}
              {isNext && showCard1 && !animateOut && bot && attendees && launchCards[0]}
              {!isNext && showCard2 && !animateOut && bot && attendees && launchCards[0]}
              {isNext && showCard2 && !animateOut && bot && attendees && launchCards[1]}
            </Flex>
          </Flex>
          {!isNext && animateOut === '' && arrowContainer}
        </Box>
      </Flex>
    );
  };
  // STORY CHANGE HANDLERS
  const onStoryStart = (index) => {
    // mark card read as soon as first pulse panel is reached
    if (!meeting.read_at) {
      readCard({
        id: meeting?.id,
        value: true
      });
    }
    visibleIndex.current = index;
    update(); // man i hate react sometimes
  };
  const onNextClicked = (skipIndexManip) => {
    if (visibleIndex.current === stories.length - 1) {
      handleSwipe('next');
      onMeetingChange('next');
    }
    if (skipIndexManip !== true) {
      const setNum = selectedIndex === stories.length - 1 ? 0 : selectedIndex + 1;
      visibleIndex.current = setNum;
      setSelectedIndex(setNum);
    }
  };
  const onPreviousClicked = (skipIndexManip) => {
    if (visibleIndex.current === 0) {
      handleSwipe('prev');
      onMeetingChange('prev');
    }
    if (skipIndexManip !== true) {
      const setNum = selectedIndex === 0 ? 0 : selectedIndex - 1;
      visibleIndex.current = setNum;
      setSelectedIndex(setNum);
    }
  };

  // SHORTCUT KEY HANDLERS
  useKeyPress(['downarrow'], () => {
    setIsPaused(!isPaused);
  });
  useKeyPress(['shift.rightarrow'], () => {
    handleSwipe('next');
    onMeetingChange('next');
  });
  useKeyPress(['shift.leftarrow'], () => {
    handleSwipe('prev');
    // onMeetingChange('prev'); todo: figure out why this isnt needed here?
  });

  // SWIPE HANDLERS
  const handleSwipe = (direction) => {
    // dont animate if at end of carousel
    const { meetingIndex } = meeting;
    if (
      (direction === 'prev' && meetingIndex === 0) ||
      (direction === 'next' && meetingIndex === launchCards.length - 1)
    ) {
      return;
    }

    _resetDeck();
    if (direction === 'prev' || direction === 'next') {
      // setAnimateOut(direction === 'prev' ? 'slide-out-prev' : 'slide-out-next');
      // setAnimateIn(direction === 'prev' ? 'slide-in-prev' : 'slide-in-next');
      setAnimateOut('fade-out');
      setAnimateIn('fade-in');
      delay(() => {
        setAnimateOut('');
        setAnimateIn('');
      }, 300);
    } else if (direction === 'down') {
      setAnimateOut('slide-out-down');

      delay(() => {
        setAnimateOut('');
        onClose();
      }, 300);
    }
  };
  const swipeHandlers = useSwipeHandlers({
    handleSwipe,
    onMeetingChange
  });

  // build deck only when all req'd calls resolve
  useEffect(() => {
    if (
      !hasBootstrapped.current &&
      bot?.speakers &&
      keys(bot.speakers).length > 0 &&
      attendees?.length > 0
    ) {
      setStories(_buildDeck());
      hasBootstrapped.current = true;

      // focus close button so keyboard still works after meeting change
      delay(() => {
        closeButtonRef?.current?.focus();
      }, 500);
    }
  }, [bot, attendees]);

  // reset bootstrapped flag and side navs when meeting changes
  useEffect(() => {
    hasBootstrapped.current = false;
    _updatePanelNavigation(visibleIndex.current);
  }, [meeting?.source_data?.id]);

  // more reset catching and forcing next cards to recalc
  useEffect(() => {
    if (isOpen) {
      _updatePanelNavigation(visibleIndex.current);
    } else {
      _resetDeck();
      _updatePanelNavigation(0, true);
    }
  }, [isOpen, visibleIndex.current]);

  useUnmount(() => {
    _resetDeck();
    _updatePanelNavigation(0, true);
  });

  return (
    <Modal
      width='100vw'
      height='100vh'
      size='full'
      isCentered
      isOpen={isOpen}
      onClose={onClose}
    >
      <ModalOverlay
        bg='blackAlpha.900'
        backdropFilter='blur(5px)'
      />
      <ModalContent
        alignItems='center'
        bg='transparent'
        shadow='none'
        className={`${animateOut} ${animateIn}`}
      >
        <Grid
          width='100vw'
          height='100vh'
          templateColumns={{
            base: '1fr',
            md: '1fr minmax(428px, 700px) 1fr'
          }}
        >
          {animateOut === '' && (
            <ModalCloseButton
              ref={closeButtonRef}
              variant='reskinOutline'
              color='white'
            />
          )}
          {showNav && (
            <GridItem
              display={{
                base: 'none',
                md: 'flex'
              }}
              visibility={{
                base: 'hidden',
                md: 'visible'
              }}
              // justifyContent="center"
              // alignItems="center"
            >
              {!(meeting.meetingIndex === 0 && visibleIndex.current === 0) &&
                renderSideNavSection({
                  direction: 'prev',
                  onClick: onPreviousClicked
                })}
            </GridItem>
          )}
          <GridItem
            {...swipeHandlers}
            onClick={(evt) => {
              // this is a hack because putting any kind of link in the header makes
              // the whole story a link for some reason (and left/right presses not work)
              if (
                evt.target.hasAttribute('data-is-link') ||
                evt.target.parentElement.hasAttribute('data-is-link')
              ) {
                // const panelType = evt.target.getAttribute('data-is-link');
                // let endOfURL = '';
                // switch (panelType) {
                //   case 'Cover':
                //     endOfURL = '';
                //     break;
                //   case 'Summary':
                //     endOfURL = '#personal-summary';
                //     break;
                //   case 'Sentiment':
                //     endOfURL = '?topicSort=2|desc#insight-from-lenses';
                //     break;
                //   case 'Topics':
                //     endOfURL = '#key-points';
                //     break;
                //   case 'Topics_S':
                //     endOfURL = '?topicSort=1|asc#insight-from-lenses';
                //     break;
                //   case 'Topics_T':
                //     endOfURL = '?topicSort=1|desc#insight-from-lenses';
                //     break;
                //   case 'FollowUps':
                //     endOfURL = '#follow-ups';
                //     break;
                //   case 'Participants':
                //     endOfURL = '#meeting-prep';
                //     break;
                //   default:
                //     // eslint-disable-next-line
                //     endOfURL = '';
                //     break;
                // }
                navigate(`/meeting/${meeting?.source_data?.id}`);
                // if we want the top nav to scroll to the right section
                // navigate(`/meeting/${meeting?.source_data?.id}${endOfURL}`);
              }
            }}
            // border="1px solid red"
            maxHeight='100vh'
            maxW={{
              base: 'initial',
              md: '700px'
            }}
            height={{
              base: '100vh',
              md: '96vh'
            }}
            mt={{
              base: '0vh',
              md: '2vh'
            }}
            display='flex'
            alignItems='center'
            justifyContent='center'
            gridColumn={{
              base: '1 / -1',
              md: '2 / 3'
            }} // Center horizontally
          >
            <Box
              // border="1px solid teal"
              mt={{
                base: '0vh',
                md: '2vh'
              }}
              height={{
                base: '100vh',
                md: '96vh'
              }}
              maxH={{
                base: '100vh',
                md: '96vh'
              }}
              width='100%'
              minW={{
                base: 'initial',
                md: '428px'
              }}
              aspectRatio={{
                base: 'initial',
                md: '428 / 760'
              }}
              position='relative'
            >
              <Box
                minWidth={{
                  base: 'initial',
                  md: '428px'
                }}
                width='100%'
                maxWidth={{
                  base: 'initial',
                  md: '700px'
                }}
                maxHeight={{
                  base: 'initial',
                  md: '96vh'
                }}
                height='100%'
                position='absolute'
                top='0'
                left='0'
                display='flex'
                alignItems='center'
                justifyContent='center'
              >
                {bot && attendees && (
                  <Suspense>
                    <StoriesLazy
                      keyboardNavigation
                      preloadCount={3}
                      defaultInterval={8000}
                      width='100%'
                      height='100%'
                      progressContainerStyles={{
                        padding: '14px',
                        filter: 'none'
                      }}
                      progressWrapperStyles={{
                        border: '1px solid rgba(18, 22, 29, 0.10)',
                        borderRadius: '4px',
                        height: '6px',
                        zIndex: 4,
                        background: 'rgba(18, 22, 29, 0.10)'
                      }}
                      progressStyles={{
                        border: 'none',
                        borderRadius: '4px',
                        background: '#FEFFFF',
                        height: '4px'
                      }}
                      storyContainerStyles={{
                        backgroundColor: 'transparent !important',
                        background: 'transparent !important'
                      }}
                      isPaused={isPaused}
                      stories={stories}
                      key={storiesKey}
                      currentIndex={selectedIndex}
                      onStoryStart={onStoryStart}
                      onAllStoriesEnd={() => {
                        onNextClicked(true);
                      }}
                      onNext={() => {
                        onNextClicked(true);
                      }}
                      onPrevious={() => {
                        onPreviousClicked(true);
                      }}
                    />
                  </Suspense>
                )}
              </Box>
            </Box>
            {/* todo: something like this test is needed to prevent flash on slide down */}
          </GridItem>
          {showNav && (
            <GridItem
              display={{
                base: 'none',
                md: 'flex'
              }}
              visibility={{
                base: 'hidden',
                md: 'visible'
              }}
            >
              {renderSideNavSection({
                direction: 'next',
                onClick: onNextClicked
              })}
            </GridItem>
          )}
        </Grid>
      </ModalContent>
    </Modal>
  );
}

export default PulseDeck;
