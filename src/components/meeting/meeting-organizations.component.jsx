import { pluralized } from '@util/helpers';
import ReskinOrganizationStack from '@components/general/reskin-organization-stack.component';

export default function MeetingOrganizations({ meetingId, organizations }) {
  return (
    <ReskinOrganizationStack
      organizations={organizations}
      title={(organization) => pluralized('Attendee', organization.meetings[meetingId])}
    />
  );
}
