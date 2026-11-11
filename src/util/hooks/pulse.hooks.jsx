import { useEffect, useState } from 'react';
import { delay } from 'lodash-es';
import { useSwipeable } from 'react-swipeable';

// todo: move this out
export const useAnimationHandling = (onClose) => {
  const [animateOut, setAnimateOut] = useState('');
  const [animateIn, setAnimateIn] = useState('');

  const handleSwipe = (direction, resetDeck) => {
    resetDeck();
    if (direction === 'prev' || direction === 'next') {
      setAnimateOut(direction === 'prev' ? 'slide-out-prev' : 'slide-out-next');
      setAnimateIn(direction === 'prev' ? 'slide-in-prev' : 'slide-in-next');
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

  return {
    animateOut,
    animateIn,
    handleSwipe
  };
};
export const useSwipeHandlers = ({ handleSwipe }) => {
  return useSwipeable({
    onSwipedDown: () => {
      handleSwipe('down');
    },
    onSwipedRight: () => {
      handleSwipe('prev');
    },
    onSwipedLeft: () => {
      handleSwipe('next');
    },
    trackMouse: true
  });
};
export function useMaxTopics(panel, topicType) {
  const TOPICS_MAX_COUNT = {
    1200: 4,
    1000: 3,
    800: 2,
    600: 1
  };

  function calculateMaxTopics() {
    const viewportHeight = window.innerHeight;
    return Object.keys(TOPICS_MAX_COUNT).reduce((acc, key) => {
      return viewportHeight >= key ? TOPICS_MAX_COUNT[key] : acc;
    }, 2);
  }

  const [maxTopics, setMaxTopics] = useState(calculateMaxTopics);

  useEffect(() => {
    const handleResize = () => {
      setMaxTopics(calculateMaxTopics());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const currTopics = panel.source_data.topics
    .filter((topic) => topic.strategic_vs_tactical === topicType)
    .slice(0, maxTopics);

  return currTopics;
}
export function useMaxFollowups(bot) {
  const FOLLOWUPS_MAX_COUNT = {
    1200: 6,
    1000: 5,
    800: 4,
    600: 3
  };

  function calculateMaxFollowups() {
    const viewportHeight = window.innerHeight;
    return Object.keys(FOLLOWUPS_MAX_COUNT).reduce((acc, key) => {
      return viewportHeight >= key ? FOLLOWUPS_MAX_COUNT[key] : acc;
    }, 2);
  }

  const [maxFollowups, setMaxFollowups] = useState(calculateMaxFollowups);

  useEffect(() => {
    const handleResize = () => {
      setMaxFollowups(calculateMaxFollowups());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const currFollowups = bot.followups.slice(0, maxFollowups);

  return currFollowups;
}
export function useMaxParticipants() {
  const PARTICIPANTS_MAX_COUNT = {
    1200: 4,
    1000: 3,
    800: 2,
    600: 1
  };

  function calculateMaxParticipants() {
    const viewportHeight = window.innerHeight;
    return Object.keys(PARTICIPANTS_MAX_COUNT).reduce((acc, key) => {
      return viewportHeight >= key ? PARTICIPANTS_MAX_COUNT[key] : acc;
    }, 2);
  }

  const [maxParticipants, setMaxParticipants] = useState(calculateMaxParticipants);

  useEffect(() => {
    const handleResize = () => {
      setMaxParticipants(calculateMaxParticipants());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return maxParticipants;
}
