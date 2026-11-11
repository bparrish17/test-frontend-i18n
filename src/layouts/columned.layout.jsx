import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Divider, HStack, Show } from '@chakra-ui/react';

import { createBrowserHistory } from 'history';
import { useRefStore, useUserStore } from '@store/app.store';
import { HIDE_SCROLLBAR } from '@styles/css-configs';
import { useSetDocumentTitle } from '@util/hooks';

/**
 * Two-column layout with main content and right rail
 * Supports mobile view and scroll position restoration
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Main content to display in left column
 * @param {React.ReactNode} props.rightRailContent - Content for right sidebar
 * @param {React.ReactNode} props.mobileContent - Content to display on mobile view instead of columns
 * @param {boolean} props.isRightRailExpanded - Whether the right rail should be visible/expanded
 * @returns {JSX.Element} Columned layout component
 */
export default function ColumnedLayout({
  children,
  rightRailContent,
  mobileContent,
  isRightRailExpanded = true,
  ...props
}) {
  useSetDocumentTitle();
  const agendaMainRef = useRefStore((state) => state.agendaMainRef);

  const location = useLocation();
  const setScrollPosition = useUserStore((state) => state?.setScrollPosition);
  const getScrollPosition = useUserStore((state) => state?.getScrollPosition);

  const history = createBrowserHistory();

  const refCurrent = agendaMainRef.current;
  const handleScroll = () => {
    if (refCurrent && location.pathname === '/summaries') {
      setScrollPosition(agendaMainRef.current.scrollTop);
    }
  };

  useEffect(() => {
    if (refCurrent) {
      refCurrent.addEventListener('scroll', handleScroll);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (refCurrent) {
        refCurrent.removeEventListener('scroll', handleScroll);
      }
    };
  }, [refCurrent]);

  useEffect(() => {
    if (location.pathname !== '/summaries') {
      return;
    }
    history.listen((update) => {
      if (update.action === 'POP') {
        setTimeout(() => {
          if (agendaMainRef.current) {
            agendaMainRef.current.scrollTo(0, getScrollPosition());
          }
        }, 0);
      }
    });
  }, [location]);

  return (
    <>
      {mobileContent && (
        <Show
          below='1023px'
          data-testid='columned-layout-mobile'
        >
          {mobileContent}
        </Show>
      )}
      <Show
        above={mobileContent ? '1024px' : '0px'}
        data-testid='columned-layout'
      >
        <HStack
          w='full'
          h='full'
          gap={0}
          justifyContent='center'
          {...props}
        >
          <Box
            maxW={isRightRailExpanded ? 'calc(720px + 5.50rem)' : 'none'}
            ref={agendaMainRef}
            as='section'
            flex={isRightRailExpanded ? 2 : 1}
            h='full'
            overflowY='scroll'
            sx={HIDE_SCROLLBAR}
          >
            {children}
          </Box>
          {isRightRailExpanded && (
            <Divider
              orientation='vertical'
              visibility={{ base: 'hidden', '1024px': 'visible' }}
            />
          )}
          {isRightRailExpanded && (
            <Box
              as='section'
              flex={1}
              h='full'
              overflowY='scroll'
              sx={HIDE_SCROLLBAR}
              maxW='528px'
              minW='360px'
              visibility={{ base: 'hidden', '1024px': 'visible' }}
              pointerEvents={{ base: 'none', '1024px': 'auto' }}
            >
              {rightRailContent}
            </Box>
          )}
        </HStack>
      </Show>
    </>
  );
}
