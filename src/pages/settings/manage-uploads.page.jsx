import SettingsLayout from '@layouts/settings.layout';
import CenteredLayout from '@layouts/centered.layout';

import { useUserStore } from '@store/app.store';
import ManageUploadsTable from '@components/settings/manage-uploads/manage-uploads-table.component';
import { useSetDocumentTitle, useDocumentUploads, useMeetingUploads } from '@util/hooks';

export default function ManageUploadsPage() {
  useSetDocumentTitle('Manage Uploads - FORA');
  const user = useUserStore((state) => state.user);
  const { batches, cards: batchCards } = useDocumentUploads({ user });
  const { meetings, cards: meetingCards } = useMeetingUploads();

  return (
    <SettingsLayout pageTitle='Manage Uploads'>
      <CenteredLayout gap={6}>
        {batches && batchCards && (
          <ManageUploadsTable
            uploads={batches}
            cards={batchCards}
            type='Document'
          />
        )}
        {meetings && meetingCards && (
          <ManageUploadsTable
            uploads={meetings}
            cards={meetingCards}
            type='Meeting'
          />
        )}
      </CenteredLayout>
    </SettingsLayout>
  );
}
