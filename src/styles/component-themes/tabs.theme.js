import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(
  tabsAnatomy.keys
);

const underlineVariant = definePartsStyle({
  tab: {
    color: 'surface.onSurfaceVariant',
    borderBottom: '2px solid',
    borderColor: 'transparent',
    px: 0,
    py: 0.5,
    fontWeight: 600,
    _selected: {
      color: 'surface.onSurface',
      borderColor: 'surface.onSurface'
    }
  },
  tablist: {
    gap: 8
  },
  tabpanel: {
    p: 0
  }
});

const sourcesVariant = definePartsStyle({
  tab: {
    overflow: 'hidden',
    color: 'surface.outline',
    textOverflow: 'ellipsis',
    borderBottom: '2px solid',
    borderColor: 'transparent',
    px: 0,
    py: 0,
    fontSize: 'lg',
    fontWeight: 600,
    _selected: {
      variant: 'headline-regular-sm',
      color: 'surface.onSurface'
    },
    _hover: {
      color: 'surface.onSurface'
    }
  },
  tablist: {
    gap: 4,
    borderBottom: '0px solid',
    borderColor: 'surface.outlineVariant'
  },
  tabpanel: {
    p: 0,
    pt: 6
  }
});
const navVariant = definePartsStyle({
  tab: {
    p: 0,
    color: 'bay_governor.300',
    fontSize: '16px',
    fontWeight: 600,
    _selected: {
      color: 'brandPrimary.primary'
    }
  },
  tablist: {
    gap: 4
  },
  tabpanel: {
    p: 0
  }
});

const navDarkVariant = definePartsStyle({
  tab: {
    p: 0,
    color: 'brandPrimary.fixed',
    fontSize: '16px',
    fontWeight: 600,
    _selected: {
      color: 'brandPrimary.onPrimary'
    }
  },
  tablist: {
    gap: 4
  },
  tabpanel: {
    p: 0
  }
});

const insightVariant = definePartsStyle({
  tab: {
    fontFamily: '"Suisse Intl"',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: 400,
    lineHeight: '150%',
    letterSpacing: '0.32px',
    color: 'surface.onSurfaceVariant',
    p: 0,
    _selected: {
      fontFamily: '"Suisse Intl"',
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: 450,
      lineHeight: '150%', // 24px
      letterSpacing: '0.32px',
      color: 'surface.onSurface'
    }
  },
  tablist: {
    gap: '24px',
    borderBottom: '0px solid',
    borderColor: 'surface.outline'
  },
  tabpanel: {
    p: 0
  }
});

const explorerVariant = definePartsStyle({
  tab: {
    bg: 'brandPrimary.container',
    color: 'surface.onSurfaceVariant',
    borderRadius: '10px',
    px: 6,
    py: 3,
    fontWeight: 500,
    fontSize: 'sm',
    minH: '36px',
    scrollbarWidth: 'none',
    _selected: {
      bg: 'brandPrimary.primary',
      color: 'white'
    },
    _hover: {
      bg: 'surface.surfaceContainerHigh',
      _selected: {
        bg: 'brandPrimary.primary'
      }
    },
    _disabled: {
      opacity: 0.5,
      cursor: 'not-allowed'
    }
  },
  tablist: {
    gap: 2,
    borderBottom: 'none',
    bg: 'surface.surfaceContainerLow',
    borderRadius: '10px',
    scrollbarWidth: 'none',
    p: 1
  },
  tabpanel: {
    p: 0,
    pt: 4,
    scrollbarWidth: 'none'
  }
});

const variants = {
  underline: underlineVariant,
  sourcesTabs: sourcesVariant,
  nav: navVariant,
  navDark: navDarkVariant,
  insight: insightVariant,
  explorer: explorerVariant
};

export const tabsTheme = defineMultiStyleConfig({ variants });
