import React from 'react';
import { vi } from 'vitest';

export const ChakraProvider = ({ children }) => <div>{children}</div>;
export const Stack = ({ children, ...props }) => (
  <div
    data-testid='stack'
    {...props}
  >
    {children}
  </div>
);
export const VStack = ({ children, ...props }) => (
  <div
    data-testid='vstack'
    {...props}
  >
    {children}
  </div>
);
export const HStack = ({ children, ...props }) => (
  <div
    data-testid='hstack'
    {...props}
  >
    {children}
  </div>
);
export const Text = ({ children, ...props }) => (
  <div
    data-testid='text'
    {...props}
  >
    {children}
  </div>
);
export const Heading = ({ children, ...props }) => (
  <h1
    data-testid='heading'
    {...props}
  >
    {children}
  </h1>
);
export const Icon = () => <span data-testid='icon'>icon</span>;
export const IconButton = ({ 'aria-label': ariaLabel, onClick, ...props }) => (
  <button
    data-testid='icon-button'
    aria-label={ariaLabel || 'Icon Button'}
    onClick={onClick}
    {...props}
  >
    Icon Button
  </button>
);
export const Spacer = () => <div data-testid='spacer' />;
export const Divider = () => <hr data-testid='divider' />;
export const Show = ({ children }) => <div data-testid='show'>{children}</div>;
export const Box = ({ children, ...props }) => (
  <div
    data-testid='box'
    {...props}
  >
    {children}
  </div>
);
export const Center = ({ children }) => <div data-testid='center'>{children}</div>;
export const Spinner = () => (
  <div
    data-testid='spinner'
    role='progressbar'
  >
    Loading...
  </div>
);
export const Skeleton = ({ children, ...props }) => (
  <div
    data-testid='skeleton'
    role='progressbar'
    {...props}
  >
    {children}
  </div>
);
export const Button = ({ children, leftIcon, onClick, ...props }) => (
  <button
    data-testid='button'
    onClick={onClick}
    {...props}
  >
    {leftIcon}
    {children}
  </button>
);
export const Menu = ({ children }) => (
  <div
    data-testid='menu'
    role='menu'
  >
    {children}
  </div>
);
export const MenuButton = ({ children, ...props }) => (
  <button
    data-testid='menu-button'
    aria-label='Icon Button'
    {...props}
  >
    {children}
  </button>
);
export const MenuList = ({ children }) => (
  <div
    data-testid='menu-list'
    role='menu'
  >
    {children}
  </div>
);
export const MenuItem = ({ children, onClick, ...props }) => (
  <button
    data-testid='menu-item'
    role='menuitem'
    onClick={onClick}
    {...props}
  >
    {children}
  </button>
);
export const MenuGroup = ({ children, title, ...props }) => (
  <div
    data-testid='menu-group'
    role='group'
    aria-label={title}
    {...props}
  >
    <div>{title}</div>
    {children}
  </div>
);
export const Tooltip = ({ children, label }) => (
  <div
    data-testid='tooltip'
    data-tooltip={label}
  >
    {children}
  </div>
);
export const Flex = ({ children, ...props }) => (
  <div
    data-testid='flex'
    {...props}
  >
    {children}
  </div>
);
export const Avatar = ({ name, src }) => (
  <img
    data-testid='avatar'
    aria-label={name || 'avatar'}
    src={src || 'mock-avatar.jpg'}
  />
);
export const Image = ({ src, alt, ...props }) => (
  <img
    data-testid='image'
    src={src}
    alt={alt}
    {...props}
  />
);
export const Container = ({ children, ...props }) => (
  <div
    data-testid='container'
    {...props}
  >
    {children}
  </div>
);
export const Input = ({ value, onChange, placeholder, ...props }) => (
  <input
    data-testid='input'
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    {...props}
  />
);
export const InputGroup = ({ children, ...props }) => (
  <div
    data-testid='input-group'
    {...props}
  >
    {children}
  </div>
);
export const InputRightElement = ({ children, ...props }) => (
  <div
    data-testid='input-right-element'
    {...props}
  >
    {children}
  </div>
);
export const TabList = ({ children, ...props }) => (
  <div
    data-testid='tab-list'
    role='tablist'
    {...props}
  >
    {children}
  </div>
);
export const Tabs = ({ children, ...props }) => (
  <div
    data-testid='tabs'
    {...props}
  >
    {children}
  </div>
);
export const Table = ({ children, ...props }) => (
  <table
    data-testid='table'
    {...props}
  >
    {children}
  </table>
);
export const Thead = ({ children, ...props }) => (
  <thead
    data-testid='thead'
    {...props}
  >
    {children}
  </thead>
);
export const Tbody = ({ children, ...props }) => (
  <tbody
    data-testid='tbody'
    {...props}
  >
    {children}
  </tbody>
);
export const Tr = ({ children, ...props }) => (
  <tr
    data-testid='tr'
    {...props}
  >
    {children}
  </tr>
);
export const Th = ({ children, ...props }) => (
  <th
    data-testid='th'
    {...props}
  >
    {children}
  </th>
);
export const Td = ({ children, ...props }) => (
  <td
    data-testid='td'
    {...props}
  >
    {children}
  </td>
);

// Hooks
export const useBreakpointValue = vi.fn(() => false);
export const useDisclosure = vi.fn(() => ({
  isOpen: false,
  onOpen: vi.fn(),
  onClose: vi.fn(),
  onToggle: vi.fn()
}));

const mockToast = vi.fn();
export const useToast = vi.fn(() => mockToast);
