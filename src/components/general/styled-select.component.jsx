import { CheckIconBold, ChevronDownIcon } from '@assets/icons';
import {
  Box,
  Button,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Stack,
  Text
} from '@chakra-ui/react';
import { useMemo } from 'react';

/** @typedef {Object} StyledSelectOption
 * @property {string} value
 * @property {string} label
 * @property {JSX.Element} icon
 */

/**
 * @typedef {Object} StyledSelectProps
 * @property {StyledSelectOption[]} options
 * @property {string} placeholder
 * @property {string} [value]
 * @property {(value: string) => void} onChange
 * @property {import('@chakra-ui/react').MenuProps} props
 * @property {string} [selectLabel]
 * @property {import('@chakra-ui/react').ButtonProps} [menuButtonProps]
 */

/**
 * @param {StyledSelectProps} props
 */
export default function StyledSelect({
  placeholder,
  selectLabel,
  value,
  onChange,
  options,
  menuButtonProps = {},
  menuListProps = {},
  menuItemProps = {},
  ...menuProps
}) {
  const selectedOption = useMemo(
    () => options?.find((option) => option.value === value),
    [options, value]
  );

  return (
    <Menu
      variant='select'
      {...menuProps}
    >
      <MenuButton
        h='60px'
        w='full'
        as={Button}
        rightIcon={
          <Icon
            as={ChevronDownIcon}
            boxSize={6}
          />
        }
        variant='reskinWhite'
        p={4}
        rounded='lg'
        color='surface.onSurfaceVariant'
        fontWeight={400}
        {...menuButtonProps}
      >
        <HStack
          gap={3}
          w='full'
        >
          {selectedOption?.icon && <Box>{selectedOption?.icon}</Box>}
          <Stack
            gap={0}
            w='full'
          >
            {selectLabel && (
              <Text
                fontSize='11px'
                textAlign='left'
              >
                {selectLabel}
              </Text>
            )}
            <Text
              fontSize='16px'
              textAlign='left'
              layerStyle='ellipsis-text'
              mt={1}
              pr={3}
            >
              {selectedOption?.label || placeholder}
            </Text>
          </Stack>
        </HStack>
      </MenuButton>
      <MenuList {...menuListProps}>
        {options?.map((option) => {
          const isSelected = option.value === value;

          return (
            <MenuItem
              key={option.value}
              onClick={() => onChange(option.value)}
              {...menuItemProps}
            >
              {option.icon}
              {option.label}
              <Spacer />
              {isSelected && (
                <Icon
                  as={CheckIconBold}
                  color='brandPrimary.primary'
                />
              )}
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
