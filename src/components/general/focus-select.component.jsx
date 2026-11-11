import { Button, HStack, Icon, Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react';
import { ChevronDownIcon, InitiativeMatchIcon } from '@assets/icons/index.jsx';
import { useInitiatives } from '@services/query-services/initiatives.query-service';
import { useTranslation } from 'react-i18next';

/**
 *
 * @param {Object} focus
 * @param {function} onChange
 * @param {"Auto" | "Manual"} initiativeMatch
 * @param {boolean} isOpen
 * @param {function} onClose
 * @param {function} onOpen
 * @param {boolean} listOnly
 * @param {import("@chakra-ui/react").MenuProps} menuProps
 * @returns {JSX.Element}
 */
export default function FocusSelect({
  focus,
  onChange,
  initiativeMatch,
  isOpen,
  onClose,
  onOpen,
  listOnly = false,
  menuProps
}) {
  const { t } = useTranslation();

  const { data: focuses } = useInitiatives({ type: 'Focus' });

  return (
    <Menu
      isOpen={isOpen}
      onClose={onClose}
      onOpen={onOpen}
      matchWidth
      strategy='fixed'
      computePositionOnMount
      offset={[0, -365]}
      {...menuProps}
    >
      {listOnly || (
        <MenuButton
          as={Button}
          textAlign='left'
          variant='reskinWhite'
          fontWeight={400}
          rightIcon={<ChevronDownIcon />}
        >
          {focus?.title ?? t('focusSelect.chooseACategory')}
        </MenuButton>
      )}
      <MenuList
        h={80}
        w='full'
        minW='320px'
        overflowY='scroll'
      >
        {focuses?.map((focusOption) => {
          return (
            <MenuItem
              key={focusOption?.id}
              h={10}
              w='full'
              onClick={() => onChange(focusOption)}
            >
              <HStack
                fontSize='sm'
                fontWeight={400}
                gap={4}
              >
                <Text>{focusOption.title}</Text>
                {initiativeMatch === 'Auto' && focus?.id === focusOption?.id && (
                  <HStack
                    gap={1}
                    color='brandPrimary.primary'
                  >
                    <Icon as={InitiativeMatchIcon} />
                    <Text>{t('focusSelect.foraSuggestion')}</Text>
                  </HStack>
                )}
              </HStack>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
}
