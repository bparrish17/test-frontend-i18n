import {
  Box,
  Center,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuGroup,
  MenuItem,
  MenuList,
  Text
} from '@chakra-ui/react';
import { Fragment } from 'react';

const inheritRadius = {
  '&:first-of-type': {
    borderTopLeftRadius: 'inherit',
    borderTopRightRadius: 'inherit'
  },
  '&:last-child': {
    borderBottomLeftRadius: 'inherit',
    borderBottomRightRadius: 'inherit'
  }
};

/**
 * @typedef {Object} MenuItem
 * @property {string} name
 * @property {React.ReactElement} icon
 * @property {function} onClick
 * @property {string} [additional]
 * @property {boolean} [hasDivider]
 * @property {import('@chakra-ui/react').MenuItemProps} [props]
 *
 * @typedef {Object} DropdownProps
 * @property {'small' | 'default' | 'large' | 'simple'} variant
 * @property {MenuItem[]} menuItems
 * @property {import('@chakra-ui/react').MenuProps} menuStyles
 * @property {'icon' | 'button'} triggerButtonType
 * @property {React.ReactElement | string} triggerButton
 * @property {import('@chakra-ui/react').ButtonProps | import('@chakra-ui/react').IconButtonProps} triggerButtonProps
 * @property {Icon | React.ReactElement} icon
 * @property {boolean} isOpen
 * @property {function} onOpen
 * @property {function} onClose
 */

/**
 * @param {DropdownProps}
 * @returns {JSX.Element}
 */
export default function Dropdown({
  variant = 'default',
  menuItems,
  menuStyles,
  triggerButtonType = 'icon',
  triggerButton,
  triggerButtonProps,
  icon,
  disabled = false,
  descriptionText,
  isOpen,
  onOpen,
  onClose,
  onCloseDelay = 0
}) {
  const defaultTriggerButtonProps =
    triggerButtonType === 'button' ? { as: Box } : { as: IconButton, rounded: 'full', icon };

  const listStyles = {
    small: {
      gap: 0,
      py: 2
    },
    default: {
      rounded: 'xl',
      gap: 0,
      py: 0
    },
    large: {
      minW: { base: '95vw', md: '400px' },
      gap: 2,
      mx: { base: 2, md: 0 },
      rounded: '2xl'
    },
    simple: {
      gap: 0,
      py: 0,
      rounded: '2xl'
    }
  };

  const menuItemStyles = {
    default: { px: 4, py: 3, sx: inheritRadius },
    large: { px: 5 },
    simple: { py: 3, px: 4, sx: inheritRadius }
  };

  const menuTextStyles = {
    small: {
      fontSize: 'sm'
    },
    default: {
      fontWeight: 600
    },
    large: {
      fontWeight: 600
    },
    simple: {
      fontWeight: 600,
      fontSize: 'md'
    }
  };

  const MenuItemIcons = (icon, iconProps = {}) => ({
    default: (
      <Icon
        as={icon}
        boxSize='18px'
        {...iconProps}
      />
    ),
    large: (
      <Center
        p={1.5}
        rounded='full'
      >
        <Icon
          as={icon}
          boxSize={6}
          {...iconProps}
        />
      </Center>
    ),
    simple: null
  });

  return (
    <Menu
      isOpen={disabled ? false : isOpen}
      onOpen={disabled || onOpen}
      onClose={disabled || onClose}
      {...menuStyles}
      closeOnSelect={false}
    >
      {({ onClose: controlledOnClose }) => (
        <>
          <MenuButton
            {...defaultTriggerButtonProps}
            {...triggerButtonProps}
            onClick={(e) => e?.stopPropagation()}
          >
            {triggerButton}
          </MenuButton>
          <MenuList
            display='flex'
            shadow='xl'
            flexDir='column'
            overflow='hidden'
            border='1px solid'
            borderColor='hsla(215, 20%, 65%, 1)'
            {...listStyles[variant]}
          >
            {menuItems.map((menuItem) => {
              return (
                <Fragment key={menuItem.name}>
                  <MenuItem
                    gap={2}
                    onClick={(e) => {
                      e.stopPropagation();
                      menuItem.onClick(e);
                      setTimeout(onClose ?? controlledOnClose, onCloseDelay);
                    }}
                    {...menuItemStyles[variant]}
                    {...menuItem?.props}
                  >
                    {menuItem.icon && MenuItemIcons(menuItem.icon, menuItem.iconProps)[variant]}
                    {menuItem.render ?? (
                      <>
                        <Text {...menuTextStyles[variant]}>{menuItem.name}</Text>
                        <Text
                          fontSize='xs'
                          mb={0.5}
                          color='surface.onSurfaceVariant'
                        >
                          {menuItem.additional}
                        </Text>
                      </>
                    )}
                  </MenuItem>
                  {menuItem.hasDivider ? (
                    <MenuDivider
                      style={{ margin: 0 }}
                      borderColor='surface.outline'
                    />
                  ) : null}
                </Fragment>
              );
            })}
            {descriptionText && (
              <MenuGroup
                title={descriptionText}
                fontWeight={400}
              />
            )}
          </MenuList>
        </>
      )}
    </Menu>
  );
}
