import {
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  HStack,
  Stack,
  Text
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

const DetailRow = ({ label, value }) => (
  <Stack gap={1}>
    <Text variant='body-700-sm'>{label}</Text>
    <Text>{value}</Text>
  </Stack>
);

export default function TeamDetailDrawer({ team, onClose, onEdit, onShare, onDelete }) {
  const { t } = useTranslation();

  return (
    <Drawer
      isOpen={!!team}
      onClose={onClose}
      placement='right'
      size='md'
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton aria-label={t('common.close')} />
        <DrawerHeader>{team?.name}</DrawerHeader>
        <DrawerBody>
          {team && (
            <Stack gap={5}>
              <DetailRow
                label={t('common.name')}
                value={team.name}
              />
              <DetailRow
                label={t('common.description')}
                value={team.description}
              />
              <DetailRow
                label={t('common.category')}
                value={team.category}
              />
              <DetailRow
                label={t('common.people')}
                value={t('manageTeams.memberCount', { count: team.memberCount })}
              />
            </Stack>
          )}
        </DrawerBody>
        <DrawerFooter justifyContent='space-between'>
          <Button
            variant='reskinOutline'
            colorScheme='critical'
            onClick={() => onDelete(team)}
          >
            {t('common.delete')}
          </Button>
          <HStack>
            <Button
              variant='reskinSecondary'
              onClick={() => onShare(team)}
            >
              {t('common.share')}
            </Button>
            <Button
              variant='reskinSecondary'
              onClick={() => onEdit(team)}
            >
              {t('common.edit')}
            </Button>
            <Button
              variant='reskinPrimary'
              onClick={onClose}
            >
              {t('common.done')}
            </Button>
          </HStack>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
