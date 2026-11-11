import { textTheme as Text } from './component-themes/text.theme';
import { headingTheme as Heading } from './component-themes/heading.theme';
import { buttonTheme as Button } from './component-themes/button.theme';
import { inputTheme as Input } from './component-themes/input.theme';
import { tabsTheme as Tabs } from './component-themes/tabs.theme';
import { menuTheme as Menu } from './component-themes/menu.theme';
import { modalTheme as Modal } from './component-themes/modal.theme';
import { avatarTheme as Avatar } from './component-themes/avatar.theme';
import { progressTheme as Progress } from './component-themes/progress.theme';
import { switchTheme as Switch } from './component-themes/switch.theme';
import { alertTheme as Alert } from './component-themes/alert.theme';
import { radioTheme as Radio } from './component-themes/radio.theme';
import { selectTheme as Select } from './component-themes/select.theme';
import { formTheme as Form } from './component-themes/form.theme';
import { sliderTheme as Slider } from './component-themes/slider.theme';
import { tableTheme as Table } from './component-themes/table.theme';
import { textareaTheme as Textarea } from './component-themes/textarea.theme';
import { listTheme as List } from './component-themes/list.theme';
import { tagTheme as Tag } from './component-themes/tag.theme';
import { globalStyles } from './global.theme';
import { colors } from './colors.theme';
import { semanticTokens } from './semantic-tokens.theme';
import { get, mapValues, omit } from 'lodash-es';

/** @type {import('@chakra-ui/react').ChakraTheme} */
const baseTheme = {
  semanticTokens,
  colors,
  borders: {
    reskin: `1px solid ${get(colors, semanticTokens.colors.surface.outlineVariant)}`,
    reskinDark: `1px solid ${get(colors, semanticTokens.colors.surface.outline)}`,
    thick: `2px solid ${get(colors, semanticTokens.colors.surface.outlineVariant)}`
  },
  space: {
    2.5: '0.675rem',
    11: '2.75rem', // 44px
    22: '5.5rem' // 88px,
  },
  fontSizes: {
    '2.5xl': '1.75rem', // 28px
    '5xl': '2.75rem' // 44px
  },
  styles: { global: globalStyles },
  textStyles: {
    aeonik: {
      fontFamily: 'Aeonik Fono'
    },
    // expose every text variant as a textStyle as well (without text-specific attributes)
    ...mapValues(Text.variants, (styling) => omit(styling, ['font-feature-settings']))
  },
  initialColorMode: 'light',
  useSystemColorMode: true,
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1200px',
    '2xl': '1440px',
    '3xl': '1536px',
    '4xl': '1920px'
  },
  sizes: {
    'centered-page': '800px',
    11: '44px',
    15: '60px'
  },
  zIndices: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  },
  shadows: {
    light: '0px 4px 24px 0px rgba(0, 0, 0, 0.05)',
    'med-light': '0px 4px 24px 0px rgba(0, 0, 0, 0.1)',
    medium: '0px 4px 24px 0px rgba(0, 0, 0, 0.15)',
    'med-dark': '0px 4px 24px 0px rgba(0, 0, 0, 0.2)',
    dark: '0px 4px 24px 0px rgba(0, 0, 0, 0.25)'
  },
  layerStyles: {
    'section-card': {
      borderRadius: 'lg',
      bgColor: 'surface.containerLowest',
      border: 'reskin'
    },
    card: {
      border: 'reskin',
      borderX: { base: 'none', md: 'reskin' },
      bgColor: 'white',
      rounded: { base: 'none', md: '2xl' }
    },
    // todo: remove when data-sources.page and analytics.page brought to new designs
    'nav-card': {
      flexDir: 'column',
      gap: 2,
      bgColor: 'white',
      border: 'reskin',
      rounded: '2xl',
      p: 6,
      h: 'full',
      _hover: {
        bgColor: 'surface.containerLow',
        cursor: 'pointer'
      },
      transitionProperty: 'background-color',
      transitionDuration: '0.2s'
    },
    'ellipsis-text': {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    'reskin-card': {
      border: 'reskin',
      bgColor: 'white',
      w: 'full',
      h: 'fit-content',
      overflow: 'hidden',
      rounded: 'lg'
    }
  },
  components: {
    Text,
    Heading,
    Button,
    Input,
    Tabs,
    Menu,
    Modal: {
      ...Modal,
      zIndex: 20000
    },
    Avatar,
    Progress,
    Alert,
    Switch,
    Slider,
    Radio,
    Select,
    Form,
    Table,
    Textarea,
    Tag,
    List,
    Skeleton: {
      baseStyle: {
        borderRadius: 'md'
      }
    },
    Td: {
      baseStyle: {
        color: 'surface.onSurfaceVariant'
      }
    },
    Divider: {
      baseStyle: {
        opacity: 1
      }
    },
    Checkbox: {
      baseStyle: {
        control: {
          _checked: {
            bg: 'brandPrimary.primary',
            borderColor: 'brandPrimary.primary',
            _hover: {
              bg: 'brandPrimary.primary'
            }
          }
        }
      }
    }
  }
};

export default baseTheme;
