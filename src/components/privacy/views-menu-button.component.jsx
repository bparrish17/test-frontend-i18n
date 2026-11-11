import { Spinner, IconButton, MenuButton } from '@chakra-ui/react';

import { SFEyeIcon } from '@assets/icons';
import { totalViews } from '@util/helpers/privacy.helpers';
import analyticsService from '@services/analytics.service';

export default function ViewsMenuButton({ disclosure, isLoading, views }) {
  const onClick = () => {
    analyticsService.trackButtonClick('Views Popover Open Click', {
      route: window?.location?.pathname
    });
    return disclosure.onToggle();
  };

  return (
    <MenuButton
      as={IconButton}
      variant={disclosure.isOpen ? 'reskinPrimary' : 'reskinWhite'}
      leftIcon={
        <SFEyeIcon
          boxSize='16px'
          color={disclosure.isOpen ? 'brandPrimary.onPrimary' : 'brandPrimary.primary'}
          data-testid='lock-icon'
        />
      }
      size='reskinMd'
      px={2}
      onClick={onClick}
      border='none'
      borderRadius='none'
      borderLeft='reskin'
    >
      {isLoading ? <Spinner size='xs' /> : totalViews(views) || 1}
    </MenuButton>
  );
}
