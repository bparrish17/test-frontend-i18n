import {
  Divider,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Text,
  useDisclosure
} from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { pick } from 'lodash-es';

import { useUserStore } from '@store/app.store';
import { usePatchCard } from '@services/query-services/cards.query-service';
import { useIsUserType, useMutationToast } from '@util/hooks';
import { HorizontalDotMenuIcon, SFGearIcon } from '@assets/icons';
import CategoryModal from '@components/general/card/category-modal.component';
import CategorySelector from '@components/general/card/category-selector.component';
import SFDocOutlined from '@assets/icons/sf-icons/doc-outlined.icon';
import TranscriptModal from '@components/general/card/reskin-meeting-card/transcript-modal.component';
import { EarningsCallHeaderTitle } from './earnings-call-header-card.component';
import { useTranslation } from 'react-i18next';

export default function EarningsCallHeaderMenu({ card, bot, earningsCallDate }) {
  const { t } = useTranslation();

  const isGuest = useUserStore((state) => state.user?.isGuest);
  const isExecutiveOrAdmin = useIsUserType('Executive', 'Admin');
  const categoryModalDisclosure = useDisclosure();
  const transcriptDisclosure = useDisclosure();
  const { onSuccess, onError } = useMutationToast('Earnings Call Category', 'update');
  const { mutateAsync: patchCard, isLoading: isPatchingCard } = usePatchCard();

  const handleInitiativeUpdated = async (initiative) => {
    categoryModalDisclosure.onClose();
    await patchCard(
      { id: card?.id, initiative: pick(initiative, ['id', 'title', 'type']) },
      { onSuccess, onError }
    );
  };

  return (
    <Menu
      closeOnSelect={false}
      placement='left-start'
    >
      <MenuButton
        as={IconButton}
        variant='reskinWhite'
        isLoading={isPatchingCard}
        size='sm'
        borderRadius='lg'
        icon={
          <Icon
            as={HorizontalDotMenuIcon}
            boxSize='13px'
            color='brandPrimary.primary'
          />
        }
      />
      <MenuList>
        {!isGuest && (
          <>
            <CategorySelector
              initiativeTitle={card?.initiative?.title}
              disclosure={categoryModalDisclosure}
              titleProps={{ mt: !card && 3 }}
            />
            <MenuDivider />
          </>
        )}
        {isExecutiveOrAdmin && (
          <MenuItem
            icon={<SFGearIcon />}
            as={ReactRouterLink}
            to='/settings/earnings-calls'
          >
            <Text
              as='span'
              variant='label-600-md'
            >
              {t('earningsCallHeaderMenu.manageEarningsCallSubscriptions')}
            </Text>
          </MenuItem>
        )}
        <MenuItem
          icon={<SFDocOutlined boxSize='18px' />}
          onClick={transcriptDisclosure.onOpen}
        >
          {t('earningsCallHeaderMenu.transcript')}
        </MenuItem>
      </MenuList>
      <CategoryModal
        disclosure={categoryModalDisclosure}
        title={t('earningsCallHeaderMenu.earningsCallCategory')}
        initialValue={card?.initiative?.id}
        handleCategoryUpdated={handleInitiativeUpdated}
      />
      <TranscriptModal
        meeting={null}
        bot={bot}
        disclosure={transcriptDisclosure}
        customHeader={
          <>
            <EarningsCallHeaderTitle
              card={card}
              earningsCallDate={earningsCallDate}
            />
            <Divider />
          </>
        }
      />
    </Menu>
  );
}
