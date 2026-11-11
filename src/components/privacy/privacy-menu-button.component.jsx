import { Spinner, IconButton, MenuButton } from '@chakra-ui/react';

import { SFUnlockIcon, SFLockIcon } from '@assets/icons';
import { totalPeopleWithAccess } from '@util/helpers/privacy.helpers';
import analyticsService from '@services/analytics.service';

export default function PrivacyMenuButton({ disclosure, isLoading, isSensitive, accessStats }) {
  const onClick = () => {
    analyticsService.trackButtonClick('Privacy Popover Open Click', {
      route: window?.location?.pathname
    });
    return disclosure.onToggle();
  };
  return (
    <MenuButton
      as={IconButton}
      variant={disclosure.isOpen ? 'reskinPrimary' : 'reskinWhite'}
      leftIcon={
        isSensitive ? (
          <SFLockIcon
            boxSize='16px'
            color={disclosure.isOpen ? 'brandPrimary.onPrimary' : 'brandPrimary.primary'}
            data-testid='lock-icon'
          />
        ) : (
          <SFUnlockIcon
            boxSize='16px'
            color={disclosure.isOpen ? 'brandPrimary.onPrimary' : 'brandPrimary.primary'}
            data-testid='unlock-icon'
          />
        )
      }
      size='reskinMd'
      px={2}
      onClick={onClick}
      border='none'
      borderRadius='none'
    >
      {isLoading ? <Spinner size='xs' /> : totalPeopleWithAccess(accessStats, isSensitive)}
    </MenuButton>
  );
}
