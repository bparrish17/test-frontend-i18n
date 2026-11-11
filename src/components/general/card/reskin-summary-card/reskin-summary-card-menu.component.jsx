import { MenuItem, MenuGroup } from '@chakra-ui/react';

import {
  SFArchiveFilled,
  SFArchiveOutlined,
  SFCopyIcon,
  SFSaveIconFilled,
  SFSaveIconOutlined
} from '@assets/icons';
import { useCopyToClipboard } from '@util/hooks';
import { useTranslation } from 'react-i18next';

export default function ReskinSummaryCardMenu({
  meeting,
  card,
  showCardActions = true,
  onCardActionClick,
  additionalCardMenuItems,
  children
}) {
  const { t } = useTranslation();

  const copyToClipboard = useCopyToClipboard();

  const sourceDataLink = `${card?.source === 'Meeting' ? 'meeting' : 'cards'}/${card?.id}`;
  const link = meeting ? `meeting/${meeting?.id}` : sourceDataLink;

  return (
    <>
      {!!card && showCardActions && (
        <MenuGroup title={t('reskinSummaryCardMenu.summaryOptions')}>
          <MenuItem
            icon={<SFCopyIcon w={5} />}
            onClick={() => copyToClipboard(`${window?.location?.origin}/${link}`)}
          >
            {t('reskinSummaryCardMenu.copyLink')}
          </MenuItem>
          <MenuItem
            icon={card?.preferred ? <SFSaveIconFilled w={5} /> : <SFSaveIconOutlined w={5} />}
            onClick={() => onCardActionClick('save', !card?.preferred, card)}
          >
            {card?.preferred ? t('reskinSummaryCardMenu.unsave') : t('reskinSummaryCardMenu.save')}
          </MenuItem>
          <MenuItem
            icon={card?.archived ? <SFArchiveFilled w={5} /> : <SFArchiveOutlined w={5} />}
            onClick={() => onCardActionClick('archive', !card?.archived, card)}
          >
            {card?.archived
              ? t('reskinSummaryCardMenu.unarchive')
              : t('reskinSummaryCardMenu.archive')}
          </MenuItem>
          {additionalCardMenuItems}
        </MenuGroup>
      )}
      {children}
    </>
  );
}
