import { forwardRef } from 'react';
import { Icon, IconButton, Menu, MenuButton, MenuItem, MenuList, Tooltip } from '@chakra-ui/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { pick, reject } from 'lodash-es';

import {
  useFollowInitiative,
  useUnfollowInitiative
} from '@services/query-services/initiatives.query-service';
import { useUserStore } from '@store/app.store';
import { isUserACollaborator } from '@util/helpers';
import { useStyledToast } from '@util/hooks';
import { useLensActivation } from '@services/query-services/lens-activation.query-service';
import {
  EyeIcon,
  HorizontalDotMenuIcon,
  SFCheckIconCircleFilled,
  SFSquareAndPencil,
  SFXMarkFilled,
  SFLensIcon
} from '@assets/icons';
import {
  DeactivateLensModal,
  ReactivateLensModal
} from '@components/lens/lens-activation-modals.component';
import { useTranslation } from 'react-i18next';

// forwardRef for passing tooltip
const LensMenuItem = forwardRef(({ title, icon, ...props }, ref) => {
  return (
    <MenuItem
      ref={ref}
      icon={
        <Icon
          as={icon}
          boxSize={4}
        />
      }
      w='full'
      {...props}
    >
      {title}
    </MenuItem>
  );
});

/**
 *
 * @param {{ lens: Initiative }} props
 * @returns
 */
export default function LensCardMenu({ lens, optimisticUpdateConfig }) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state.user);
  const toast = useStyledToast();
  const isUserTheCreator = lens?.creator?.id === user?.id;
  const { disclosure, deactivateLens, reactivateLens } = useLensActivation();
  const isArchived = !!lens?.archived_at;

  const { mutateAsync: followLens } = useFollowInitiative({
    optimisticUpdateConfig,
    onSuccess: () => {
      toast({
        title: t('lensCardMenu.youAreNowFollowing'),
        status: 'success',
        isClosable: true
      });
    }
  });
  const { mutateAsync: unfollowLens } = useUnfollowInitiative({
    optimisticUpdateConfig,
    onSuccess: () => {
      toast({
        title: t('lensCardMenu.youAreNoLonger'),
        status: 'success',
        isClosable: true
      });
    }
  });

  if (!lens) return null;

  const canFollow =
    lens?.visibility === 'Tenant' && !isUserACollaborator(lens, user) && !isUserTheCreator;
  const canUnfollow =
    (lens?.visibility === 'Tenant' || lens?.visibility === 'Collaborators') &&
    isUserACollaborator(lens, user) &&
    !isUserTheCreator;

  const follow = async () => {
    await followLens({
      id: lens?.id,
      optimisticUpdateAttribute: 'collaborators',
      optimisticUpdateValue: [...(lens.collaborators ?? []), pick(user, ['id', 'name'])]
    });
  };

  const unfollow = async () => {
    await unfollowLens({
      id: lens?.id,
      optimisticUpdateAttribute: 'collaborators',
      optimisticUpdateValue: reject(lens?.collaborators, { id: user?.id })
    });
  };

  return (
    <Menu
      closeOnSelect
      isLazy
      lazyBehavior='keepMounted'
      placement='left-start'
      py={0}
    >
      <MenuButton
        as={IconButton}
        variant='reskinGhost'
        colorScheme='surface'
        size='sm'
        isRound
        icon={
          <Icon
            transform='scale(1.5)'
            as={HorizontalDotMenuIcon}
            color='surface.outline'
          />
        }
      />
      <MenuList py={2}>
        {isUserTheCreator ? (
          <>
            <LensMenuItem
              title={t('lensCardMenu.editLensSettings')}
              icon={SFSquareAndPencil}
              as={ReactRouterLink}
              to={`/lenses/${lens.id}/edit`}
            />
            {!isArchived ? (
              <LensMenuItem
                title={t('lensCardMenu.deactivateLens')}
                icon={SFXMarkFilled}
                onClick={disclosure.onOpen}
              />
            ) : (
              <LensMenuItem
                title={t('lensCardMenu.reactivateLens')}
                icon={SFLensIcon}
                onClick={disclosure.onOpen}
              />
            )}
          </>
        ) : (
          <LensMenuItem
            title={t('lensCardMenu.viewLensDetails')}
            icon={EyeIcon}
            as={ReactRouterLink}
            to={`/lenses/${lens.id}/edit`}
          />
        )}
        {canFollow && (
          <LensMenuItem
            title={t('lensCardMenu.followLens')}
            icon={SFCheckIconCircleFilled}
            onClick={follow}
            isDisabled={lens?.visibility === 'Collaborators'}
          />
        )}
        {canUnfollow && (
          <Tooltip
            label={t('lensCardMenu.youWereAddedAs')}
            isDisabled={lens?.visibility !== 'Collaborators'}
          >
            <LensMenuItem
              title={t('lensCardMenu.unfollowLens')}
              icon={SFXMarkFilled}
              onClick={unfollow}
            />
          </Tooltip>
        )}
      </MenuList>
      {isUserTheCreator && !isArchived && (
        <DeactivateLensModal
          disclosure={disclosure}
          onConfirm={() => deactivateLens(lens.id)}
        />
      )}
      {isUserTheCreator && isArchived && (
        <ReactivateLensModal
          disclosure={disclosure}
          onConfirm={() => reactivateLens(lens.id)}
        />
      )}
    </Menu>
  );
}
