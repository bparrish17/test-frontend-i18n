import {
  Button,
  HStack,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SettingsLayout from '@layouts/settings.layout';
import CenteredLayout from '@layouts/centered.layout';
import TeamRowActions from '@components/settings/manage-teams/team-row-actions.component';
import TeamFormModal from '@components/settings/manage-teams/team-form-modal.component';
import TeamDetailDrawer from '@components/settings/manage-teams/team-detail-drawer.component';
import TeamDeleteDialog from '@components/settings/manage-teams/team-delete-dialog.component';
import { useSetDocumentTitle } from '@util/hooks';

const SAMPLE_TEAMS = [
  {
    id: 1,
    name: 'Enterprise Sales',
    description: 'Strategic accounts in North America',
    category: 'Sales',
    memberCount: 12
  },
  {
    id: 2,
    name: 'Customer Success',
    description: 'Onboarding and renewals',
    category: 'Support',
    memberCount: 8
  },
  {
    id: 3,
    name: 'Product Research',
    description: 'User interviews and discovery calls',
    category: 'Product',
    memberCount: 1
  }
];

export default function ManageTeamsPage() {
  const { t } = useTranslation();
  useSetDocumentTitle(t('manageTeams.documentTitle'));
  const toast = useToast();
  const formDisclosure = useDisclosure();
  const [teams, setTeams] = useState(SAMPLE_TEAMS);
  const [editingTeam, setEditingTeam] = useState(null);
  const [viewingTeam, setViewingTeam] = useState(null);
  const [deletingTeam, setDeletingTeam] = useState(null);

  const openCreate = () => {
    setEditingTeam(null);
    formDisclosure.onOpen();
  };
  const openEdit = (team) => {
    setViewingTeam(null);
    setEditingTeam(team);
    formDisclosure.onOpen();
  };
  const shareTeam = (team) => {
    navigator.clipboard?.writeText(`${window.location.origin}/teams/${team.id}`);
    toast({ title: t('manageTeams.linkCopied'), status: 'success' });
  };
  const saveTeam = (values) => {
    setTeams((prev) =>
      editingTeam
        ? prev.map((team) => (team.id === editingTeam.id ? { ...team, ...values } : team))
        : [...prev, { ...values, id: Date.now(), memberCount: 0 }]
    );
    toast({ title: t('manageTeams.teamSaved'), status: 'success' });
  };
  const deleteTeam = () => {
    setTeams((prev) => prev.filter((team) => team.id !== deletingTeam.id));
    setViewingTeam(null);
    setDeletingTeam(null);
  };

  return (
    <SettingsLayout pageTitle={t('manageTeams.pageTitle')}>
      <CenteredLayout gap={6}>
        <HStack justifyContent='space-between'>
          <Text>{t('manageTeams.teamsGroupPeople')}</Text>
          <Button
            variant='reskinPrimary'
            onClick={openCreate}
          >
            {t('common.create')}
          </Button>
        </HStack>
        {teams.length === 0 ? (
          <Stack
            alignItems='center'
            py={10}
          >
            <Text variant='body-700-md'>{t('manageTeams.noTeamsYet')}</Text>
            <Button
              variant='reskinSecondary'
              onClick={openCreate}
            >
              {t('common.create')}
            </Button>
          </Stack>
        ) : (
          <Table>
            <Thead>
              <Tr>
                <Th>{t('common.name')}</Th>
                <Th>{t('common.description')}</Th>
                <Th>{t('common.category')}</Th>
                <Th>{t('common.people')}</Th>
                <Th />
              </Tr>
            </Thead>
            <Tbody>
              {teams.map((team) => (
                <Tr
                  key={team.id}
                  cursor='pointer'
                  onClick={() => setViewingTeam(team)}
                >
                  <Td>{team.name}</Td>
                  <Td>{team.description}</Td>
                  <Td>{team.category}</Td>
                  <Td>{t('manageTeams.memberCount', { count: team.memberCount })}</Td>
                  <Td onClick={(e) => e.stopPropagation()}>
                    <TeamRowActions
                      team={team}
                      onEdit={openEdit}
                      onShare={shareTeam}
                      onDelete={setDeletingTeam}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </CenteredLayout>
      <TeamFormModal
        disclosure={formDisclosure}
        team={editingTeam}
        onSubmit={saveTeam}
      />
      <TeamDetailDrawer
        team={viewingTeam}
        onClose={() => setViewingTeam(null)}
        onEdit={openEdit}
        onShare={shareTeam}
        onDelete={setDeletingTeam}
      />
      <TeamDeleteDialog
        team={deletingTeam}
        onCancel={() => setDeletingTeam(null)}
        onConfirm={deleteTeam}
      />
    </SettingsLayout>
  );
}
