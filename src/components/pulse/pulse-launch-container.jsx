import { Box, Flex, IconButton, Skeleton, SkeletonText, useDisclosure } from '@chakra-ui/react';
import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { findIndex, keys, throttle, uniqueId } from 'lodash-es';
import { useEventListener, useMemoizedFn } from 'ahooks/es';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCards } from '@services/query-services/cards.query-service.js';
import { useUserStore } from '@store/app.store.js';
import PulseDeck from '@components/pulse/pulse-deck.component.jsx';
import PulseLaunchCard from '@components/pulse/pulse-launch-card.jsx';
import PulseLaunchButton from '@components/pulse/pulse-launch-button.jsx';

/**
 * Container component for displaying meeting cards in a scrollable horizontal list or as a single button.
 * Provides functionality for viewing meeting details in a modal or navigating directly to meeting pages.
 *
 * @param {Object} props
 * @param {Object} [props.singleMeetingData] - Data for a single meeting. If provided, displays a single launch button instead of a list.
 * @param {boolean} [props.shouldRouteToMeeting=false] - When true, clicking a meeting card navigates directly to the meeting page instead of opening a modal.
 * @param {Array} [props.cardsToUse] - Optional array of cards to use instead of fetching from the API.
 * @returns {JSX.Element} A horizontal scrollable list of meeting cards or a single launch button.
 *
 * @example
 * // Display a scrollable list of meeting cards that open in a modal
 * <PulseLaunchContainer />
 *
 * @example
 * // Display a single meeting button that navigates directly to the meeting page
 * <PulseLaunchContainer singleMeetingData={meetingData} shouldRouteToMeeting={true} />
 *
 * @example
 * // Display a list of cards from a provided array
 * <PulseLaunchContainer cardsToUse={sourceAndReferenceCards} shouldRouteToMeeting={true} />
 */
function PulseLaunchContainer({ singleMeetingData, shouldRouteToMeeting, cardsToUse }) {
  const flexRef = useRef(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMeeting, setSelectedMeeting] = useState();
  const [scrollPosition, setScrollPosition] = useState(0);
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();

  // Define query parameters based on conditions
  const queryParams = useMemo(() => {
    if (cardsToUse) {
      // Return null to disable the query when using provided cards
      return { enabled: false };
    }

    if (singleMeetingData) {
      return {
        person_id: user?.id,
        source_data_id: singleMeetingData?.id
      };
    }

    return {
      person_id: user?.id,
      source: 'Meeting',
      sort: 'created_at',
      asc: false,
      pageSize: 20
    };
  }, [cardsToUse, singleMeetingData, user?.id]);

  // Fetch cards using the query parameters
  const { data: fetchedCards } = useCards(queryParams);

  // Determine which cards to use
  const meetingCards = useMemo(() => {
    if (cardsToUse) {
      return cardsToUse;
    }

    if (!fetchedCards) {
      return [];
    }

    // Filter cards with at least 2 participants
    return fetchedCards.filter((card) => {
      const participants = card?.source_data?.participants;
      return keys(participants).length >= 2;
    });
  }, [cardsToUse, fetchedCards]);

  const renderMeetingCards = useMemoizedFn((meetingCards, setSelectedMeeting, onOpen) => {
    if (!meetingCards || meetingCards.length === 0) {
      return Array.from({ length: 25 }).map(() => (
        <Skeleton
          key={uniqueId()}
          minWidth='150px'
          width='150px'
          height='200px'
        >
          <SkeletonText
            color='critical.primary'
            minWidth='120px'
            width='120px'
            height='20px'
          />
        </Skeleton>
      ));
    }

    return meetingCards.map((meeting, meetingIndex) => (
      <PulseLaunchCard
        onCardClicked={(currMeeting) => {
          if (shouldRouteToMeeting) {
            navigate(`/meeting/${currMeeting.source_data.id}`);
            return;
          }
          setSelectedMeeting({
            ...currMeeting,
            meetingIndex
          });
          onOpen();
        }}
        meeting={meeting}
        key={uniqueId()}
      />
    ));
  });

  const renderedCards = useMemo(
    () => renderMeetingCards(meetingCards, setSelectedMeeting, onOpen),
    [meetingCards, setSelectedMeeting, onOpen]
  );

  function renderSideContainer(isNext) {
    const positionStyles = isNext
      ? { right: 0, borderRadius: '10px 0 0 10px', transform: 'rotate(0deg)' }
      : { left: 0, borderRadius: '0 10px 10px 0', transform: 'rotate(0deg)' };

    const scrollContainer = flexRef.current;
    const maxScrollLeft = scrollContainer
      ? scrollContainer.scrollWidth - scrollContainer.clientWidth
      : 0;

    // only show left side if scrolling has started
    if (!isNext && scrollPosition <= 10) {
      return null;
    }

    // only show right side if not fully scrolled
    if (isNext && scrollPosition >= maxScrollLeft) {
      return null;
    }

    return (
      <Box
        position='absolute'
        top={0}
        bottom={0}
        width='20px'
        background={`linear-gradient(${
          isNext ? '270deg' : '90deg'
        }, #F3F7FB 0%, rgba(243, 247, 251, 0.00) 100%)`}
        zIndex={1}
        {...positionStyles}
      >
        <IconButton
          className={`arrow-button-${isNext ? 'right' : 'left'}`}
          position='absolute'
          top='50%'
          transform='translateY(-50%)'
          opacity={1}
          transition='opacity 0.3s'
          background='transparent'
          _hover={{ background: 'transparent' }}
          onClick={() => handleScroll(isNext)}
          icon={
            isNext ? (
              <FaAngleRight
                style={{
                  marginRight: '10px',
                  height: '24px',
                  width: '100%',
                  color: '#525E74',
                  background: 'transparent'
                }}
              />
            ) : (
              <FaAngleLeft
                style={{
                  left: '-10px',
                  marginLeft: '-27px',
                  height: '24px',
                  width: '100%',
                  color: '#525E74',
                  background: 'transparent'
                }}
              />
            )
          }
        />
      </Box>
    );
  }

  const onMeetingChange = (direction) => {
    const currentIndex = findIndex(meetingCards, { id: selectedMeeting.id });
    let newIndex;

    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? 0 : currentIndex - 1;
    } else if (direction === 'next') {
      newIndex =
        currentIndex === meetingCards.length - 1 ? meetingCards.length - 1 : currentIndex + 1;
    }

    setSelectedMeeting({
      ...meetingCards[newIndex],
      meetingIndex: newIndex
    });
  };

  const handleScroll = useCallback(
    (isNext) => {
      const scrollContainer = flexRef.current;
      if (scrollContainer) {
        const newScrollPosition = isNext
          ? scrollContainer.scrollLeft + scrollContainer.clientWidth
          : scrollContainer.scrollLeft - scrollContainer.clientWidth;
        scrollContainer.scrollBy({
          left: newScrollPosition - scrollContainer.scrollLeft,
          behavior: 'smooth'
        });
        setScrollPosition(newScrollPosition);
      }
    },
    [flexRef, setScrollPosition]
  );

  useEventListener(
    'scroll',
    throttle(() => {
      if (flexRef.current) {
        setScrollPosition(flexRef.current.scrollLeft);
      }
    }, 500),
    { target: flexRef }
  );

  const RenderedPulseDeck = (
    <PulseDeck
      launchCards={renderedCards}
      variant='internal'
      isOpen={isOpen}
      onClose={onClose}
      isSingleMeeting={!!singleMeetingData}
      onMeetingChange={onMeetingChange}
      meeting={selectedMeeting}
    />
  );

  if (singleMeetingData) {
    return (
      <Fragment>
        {meetingCards && (
          <PulseLaunchButton
            meeting={meetingCards[0]}
            meetingIndex={0}
            setSelectedMeeting={setSelectedMeeting}
            onOpen={onOpen}
            shouldRouteToMeeting={shouldRouteToMeeting}
          />
        )}
        {!!meetingCards?.length && selectedMeeting && RenderedPulseDeck}
      </Fragment>
    );
  } else {
    return (
      <Fragment>
        <Box
          position='relative'
          width='100%'
        >
          <Flex
            ref={flexRef}
            py={2}
            height='auto'
            width='100%'
            overflowX='auto'
            display='flex'
            flexWrap='nowrap'
            gap={4}
          >
            {renderedCards}
          </Flex>
          {renderSideContainer(false)}
          {renderSideContainer(true)}
        </Box>

        {!!meetingCards?.length && selectedMeeting && RenderedPulseDeck}
      </Fragment>
    );
  }
}

export default PulseLaunchContainer;
