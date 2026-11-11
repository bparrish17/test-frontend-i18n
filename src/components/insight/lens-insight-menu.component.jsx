import {
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList
} from '@chakra-ui/react';

import {
  EyeIcon,
  HorizontalDotMenuIcon,
  SFLensIcon,
  SFSquareAndPencil,
  SFXMarkFilled
} from '@assets/icons';
import { Link as ReactRouterLink } from 'react-router-dom';
import { useUserStore } from '@store/app.store';
import { useLensActivation } from '@services/query-services/lens-activation.query-service';
import {
  DeactivateLensModal,
  ReactivateLensModal
} from '@components/lens/lens-activation-modals.component';
import { useTranslation } from 'react-i18next';

const InsightMenuItem = ({ title, icon, ...props }) => (
  <MenuItem
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

/**
 *
 * @param {{ insight: Insight }} props
 * @returns
 */
export default function LensInsightMenu({ lens }) {
  const { t } = useTranslation();

  const user = useUserStore((state) => state?.user);
  const isUserTheCreator = lens?.creator?.id === user?.id;
  const { disclosure, deactivateLens, reactivateLens } = useLensActivation();
  const isArchived = !!lens?.archived_at;

  return (
    <Menu
      closeOnSelect={false}
      placement='left-start'
    >
      <MenuButton
        as={IconButton}
        variant='reskinGhost'
        colorScheme='surface'
        size='reskinMd'
        px={1.5}
        isRound
        icon={
          <Icon
            as={HorizontalDotMenuIcon}
            color='brandPrimary.primary'
            boxSize={5}
          />
        }
      />
      <MenuList>
        {/* reskin todo: add check for bot live status here as well */}
        <MenuGroup title={t('lensInsightMenu.insightOptions')}>
          {isUserTheCreator ? (
            <>
              <InsightMenuItem
                title={t('lensInsightMenu.editLensSettings')}
                icon={SFSquareAndPencil}
                as={ReactRouterLink}
                to={`/lenses/${lens?.id}/edit`}
              />
              {!isArchived ? (
                <InsightMenuItem
                  title={t('lensInsightMenu.deactivateLens')}
                  icon={SFXMarkFilled}
                  onClick={disclosure.onOpen}
                />
              ) : (
                <InsightMenuItem
                  title={t('lensInsightMenu.reactivateLens')}
                  icon={SFLensIcon}
                  onClick={disclosure.onOpen}
                />
              )}
            </>
          ) : (
            <InsightMenuItem
              title={t('lensInsightMenu.viewLensDetails')}
              icon={EyeIcon}
              as={ReactRouterLink}
              to={`/lenses/${lens?.id}/edit`}
            />
          )}
        </MenuGroup>
      </MenuList>
      {isUserTheCreator && !isArchived && (
        <DeactivateLensModal
          disclosure={disclosure}
          onConfirm={() => deactivateLens(lens?.id)}
        />
      )}
      {isUserTheCreator && isArchived && (
        <ReactivateLensModal
          disclosure={disclosure}
          onConfirm={() => reactivateLens(lens?.id)}
        />
      )}
    </Menu>
  );
}
