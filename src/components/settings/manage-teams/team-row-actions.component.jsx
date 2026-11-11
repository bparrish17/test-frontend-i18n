import { IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { SFCopyLinkIcon, SFEllipsisIcon, SFPencilIcon, SFTrashIcon } from '@assets/icons';

export default function TeamRowActions({ team, onEdit, onShare, onDelete }) {
  const { t } = useTranslation();

  return (
    <Menu placement='bottom-end'>
      <MenuButton
        as={IconButton}
        variant='ghost'
        size='sm'
        icon={<SFEllipsisIcon />}
        aria-label={t('manageTeams.teamActions')}
      />
      <MenuList>
        <MenuItem
          icon={<SFPencilIcon />}
          onClick={() => onEdit(team)}
        >
          {t('common.edit')}
        </MenuItem>
        <MenuItem
          icon={<SFCopyLinkIcon />}
          onClick={() => onShare(team)}
        >
          {t('common.share')}
        </MenuItem>
        <MenuItem
          icon={<SFTrashIcon />}
          color='critical.500'
          onClick={() => onDelete(team)}
        >
          {t('common.delete')}
        </MenuItem>
      </MenuList>
    </Menu>
  );
}
