import { Stack, Spacer } from '@chakra-ui/react';
import { noop } from 'lodash-es';

import { useLocation, Link as ReactRouterLink } from 'react-router-dom';

import {
  usePrefetchAgendaMeetings,
  usePrefetchFeedCards,
  usePrefetchFeedInsights
} from '@util/hooks';
import { useGlobalSearchStore, useUserStore, useRefStore } from '@store/app.store';
import { PAGE_HEADER_HEIGHT } from '@util/constants';
import AddMenu from '@components/layout/add-menu.component';
import { SFCalendarIcon, SFClockIcon, SFHomeIcon, SFLensIcon, SFInfoIcon } from '@assets/icons';
import ReskinNavItem from '@components/layout/reskin-nav-item.component';

export default function Sider() {
  const pathname = useLocation().pathname;
  const user = useUserStore((state) => state.user);
  const tenant = useUserStore((state) => state.tenant);
  const userType = user?.type;
  const isGuest = user?.isGuest;
  const agendaMainRef = useRefStore((state) => state.agendaMainRef);
  const setGlobalSearchInput = useGlobalSearchStore((state) => state.setInput);
  const prefetchAgendaMeetings = usePrefetchAgendaMeetings();
  const prefetchFeedCards = usePrefetchFeedCards();
  const prefetchFeedInsights = usePrefetchFeedInsights();

  const feConfig = tenant?.fe_config || {};

  const handleNavItemOnClick = (to, isActive) => {
    if (to === 'summaries') {
      agendaMainRef.current.scrollTop = 0;
    }

    return !isActive && setGlobalSearchInput('');
  };

  const guestPages = [
    {
      title: 'home',
      to: '/',
      icon: SFHomeIcon,
      iconProps: { boxSize: '28px' },
      onHover: noop
    },
    {
      title: 'info',
      to: 'https://fora.day/product',
      icon: SFInfoIcon,
      iconProps: { boxSize: '28px', color: 'surface.onSurfaceVariant' },
      onHover: noop,
      target: '_blank'
    }
  ];

  const userPages = [
    {
      title: 'home',
      to: '/home',
      icon: SFHomeIcon,
      disabled: userType === 'Associate' || !(feConfig?.home_enabled ?? true),
      iconProps: { boxSize: '28px' },
      onHover: () => prefetchFeedInsights()
    },
    {
      title: 'lenses',
      to: '/lenses',
      disabled: userType === 'Associate' || !(feConfig?.lenses_enabled ?? true),
      icon: SFLensIcon,
      iconProps: { boxSize: 8 },
      onHover: noop
    },
    {
      title: 'agenda',
      to: '/agenda',
      icon: SFCalendarIcon,
      disabled: userType === 'Associate' || !(feConfig?.agenda_enabled ?? true),
      onHover: () => prefetchAgendaMeetings(new Date())
    },
    {
      title: 'recent',
      to: '/summaries',
      icon: SFClockIcon,
      disabled: userType === 'Associate' || !(feConfig?.summaries_enabled ?? true),
      onHover: () => prefetchFeedCards()
    }
  ].filter((p) => !p.disabled);

  const pages = isGuest ? guestPages : userPages;

  return (
    <Stack
      as='nav'
      h={`calc(100vh - ${PAGE_HEADER_HEIGHT}px)`}
      w={20}
      bgColor='surface.containerLow'
      position='fixed'
      zIndex='docked'
      pt={11}
      pb={6}
    >
      {pages.map((page) => {
        const { to, title, icon, iconProps, onHover, target } = page;
        const isActive = pathname === to;
        return (
          <ReskinNavItem
            key={title}
            isActive={isActive}
            as={ReactRouterLink}
            to={to}
            title={title}
            icon={icon}
            iconProps={iconProps}
            onMouseEnter={onHover}
            onClick={() => handleNavItemOnClick(to, isActive)}
            target={target}
          />
        );
      })}
      {!isGuest && userType !== 'Associate' && (feConfig?.add_menu_enabled ?? true) && <AddMenu />}
      <Spacer />
    </Stack>
  );
}
