import { vi } from 'vitest';
import React from 'react';

vi.mock('@chakra-ui/react', () => ({
  ChakraProvider: ({ children }) => children,
  Stack: ({ children, ...props }) => <div data-testid='stack' {...props}>{children}</div>,
  VStack: ({ children, ...props }) => <div data-testid='vstack' {...props}>{children}</div>,
  HStack: ({ children, ...props }) => <div data-testid='hstack' {...props}>{children}</div>,
  Text: ({ children, ...props }) => <span data-testid='text' {...props}>{children}</span>,
  Heading: ({ children, ...props }) => <h2 data-testid='heading' {...props}>{children}</h2>,
  Icon: ({ as: Component, ...props }) => (
    <span data-testid='icon' {...props}>
      {Component ? <Component /> : null}
    </span>
  ),
  IconButton: ({ 'aria-label': ariaLabel, icon, children, ...props }) => (
    <button data-testid='icon-button' {...props} aria-label={ariaLabel}>
      {icon}
      {children}
    </button>
  ),
  Spacer: () => <div data-testid='spacer' />,
  Divider: () => <hr data-testid='divider' />,
  Show: ({ children }) => children,
  Box: ({ children, ...props }) => <div data-testid='box' {...props}>{children}</div>,
  Center: ({ children, ...props }) => <div data-testid='center' {...props}>{children}</div>,
  Spinner: ({ ...props }) => (
    <div data-testid='spinner' role='progressbar' {...props} />
  ),
  Skeleton: ({ children, ...props }) => <div data-testid='skeleton' {...props}>{children}</div>,
  Button: ({ children, ...props }) => (
    <button data-testid='button' {...props} type='button'>
      {children}
    </button>
  ),
  Menu: ({ children, ...props }) => <div data-testid='menu' {...props}>{children}</div>,
  MenuButton: ({ children, ...props }) => (
    <button data-testid='menu-button' {...props} type='button'>
      {children}
    </button>
  ),
  MenuList: ({ children, ...props }) => <div data-testid='menu-list' {...props}>{children}</div>,
  MenuItem: ({ children, ...props }) => <div data-testid='menu-item' {...props}>{children}</div>,
  Tooltip: ({ children, label }) => <div data-testid='tooltip' data-tooltip={label}>{children}</div>,
  Flex: ({ children, ...props }) => <div data-testid='flex' {...props}>{children}</div>,
  Container: ({ children, ...props }) => <div data-testid='container' {...props}>{children}</div>,
  Grid: ({ children, ...props }) => <div data-testid='grid' {...props}>{children}</div>,
  GridItem: ({ children, ...props }) => <div data-testid='grid-item' {...props}>{children}</div>,
  Image: ({ src, alt, ...props }) => (
    <img data-testid='image' src={src} alt={alt} {...props} />
  ),
  Link: ({ children, ...props }) => <a data-testid='link' {...props}>{children}</a>,
  Avatar: ({ name, src, ...props }) => <div data-testid='avatar' {...props}>{name}</div>,
  AvatarGroup: ({ children, ...props }) => <div data-testid='avatar-group' {...props}>{children}</div>,
  Badge: ({ children, ...props }) => <span data-testid='badge' {...props}>{children}</span>,
  Card: ({ children, ...props }) => <div data-testid='card' {...props}>{children}</div>,
  CardHeader: ({ children, ...props }) => <div data-testid='card-header' {...props}>{children}</div>,
  CardBody: ({ children, ...props }) => <div data-testid='card-body' {...props}>{children}</div>,
  CardFooter: ({ children, ...props }) => <div data-testid='card-footer' {...props}>{children}</div>,
  Tabs: ({ children, ...props }) => <div data-testid='tabs' {...props}>{children}</div>,
  TabList: ({ children, ...props }) => <div data-testid='tab-list' {...props}>{children}</div>,
  Tab: ({ children, ...props }) => <button data-testid='tab' {...props}>{children}</button>,
  TabPanels: ({ children, ...props }) => <div data-testid='tab-panels' {...props}>{children}</div>,
  TabPanel: ({ children, ...props }) => <div data-testid='tab-panel' {...props}>{children}</div>,
  Accordion: ({ children, ...props }) => <div data-testid='accordion' {...props}>{children}</div>,
  AccordionItem: ({ children, ...props }) => <div data-testid='accordion-item' {...props}>{children}</div>,
  AccordionButton: ({ children, ...props }) => <button data-testid='accordion-button' {...props}>{children}</button>,
  AccordionPanel: ({ children, ...props }) => <div data-testid='accordion-panel' {...props}>{children}</div>,
  AccordionIcon: () => <span data-testid='accordion-icon'>▼</span>,
  Drawer: ({ children, isOpen, ...props }) => (isOpen ? <div data-testid='drawer' {...props}>{children}</div> : null),
  DrawerOverlay: ({ children, ...props }) => <div data-testid='drawer-overlay' {...props}>{children}</div>,
  DrawerContent: ({ children, ...props }) => <div data-testid='drawer-content' {...props}>{children}</div>,
  DrawerHeader: ({ children, ...props }) => <div data-testid='drawer-header' {...props}>{children}</div>,
  DrawerBody: ({ children, ...props }) => <div data-testid='drawer-body' {...props}>{children}</div>,
  DrawerFooter: ({ children, ...props }) => <div data-testid='drawer-footer' {...props}>{children}</div>,
  Modal: ({ children, isOpen, ...props }) => (isOpen ? <div data-testid='modal' {...props}>{children}</div> : null),
  ModalOverlay: ({ children, ...props }) => <div data-testid='modal-overlay' {...props}>{children}</div>,
  ModalContent: ({ children, ...props }) => <div data-testid='modal-content' {...props}>{children}</div>,
  ModalHeader: ({ children, ...props }) => <div data-testid='modal-header' {...props}>{children}</div>,
  ModalBody: ({ children, ...props }) => <div data-testid='modal-body' {...props}>{children}</div>,
  ModalFooter: ({ children, ...props }) => <div data-testid='modal-footer' {...props}>{children}</div>,
  ModalCloseButton: ({ ...props }) => <button data-testid='modal-close-button' {...props}>×</button>,
  Popover: ({ children, ...props }) => <div data-testid='popover' {...props}>{children}</div>,
  PopoverTrigger: ({ children }) => children,
  PopoverContent: ({ children, ...props }) => <div data-testid='popover-content' {...props}>{children}</div>,
  PopoverHeader: ({ children, ...props }) => <div data-testid='popover-header' {...props}>{children}</div>,
  PopoverBody: ({ children, ...props }) => <div data-testid='popover-body' {...props}>{children}</div>,
  PopoverFooter: ({ children, ...props }) => <div data-testid='popover-footer' {...props}>{children}</div>,
  PopoverCloseButton: ({ ...props }) => <button data-testid='popover-close-button' {...props}>×</button>,
  Circle: ({ children, ...props }) => <div data-testid='circle' {...props}>{children}</div>,
  TagLeftIcon: ({ as: Component, ...props }) => (
    <div data-testid='tag-left-icon' {...props}>
      {Component ? <Component /> : null}
    </div>
  ),
  UnorderedList: ({ children, ...props }) => (
    <ul data-testid='unordered-list' {...props}>
      {children}
    </ul>
  ),
  ListItem: ({ children, ...props }) => (
    <li data-testid='list-item' {...props}>
      {children}
    </li>
  ),
  useDisclosure: () => ({
    isOpen: false,
    onOpen: vi.fn(),
    onClose: vi.fn(),
    onToggle: vi.fn()
  }),
  useToast: () => ({
    isActive: false,
    show: vi.fn(),
    close: vi.fn(),
    closeAll: vi.fn()
  }),
  useModalContext: () => ({
    isOpen: true,
    onClose: vi.fn()
  })
}));
