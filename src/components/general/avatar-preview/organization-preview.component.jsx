import AvatarPreview from '@components/general/avatar-preview/avatar-preview.component';
import { buildOrgLink } from '@util/helpers';
import pluralize from 'pluralize';
import { Link as ReactRouterLink } from 'react-router-dom';

export default function OrganizationPreview({
  organization,
  attendeeCount,
  variant,
  ...containerProps
}) {
  return (
    <AvatarPreview
      key={organization?.name}
      name={organization?.name}
      title={`${attendeeCount} ${pluralize('Attendee', attendeeCount)}`}
      photoUrl={organization?.logo_url}
      flex={1}
      variant={variant}
      nameProps={{
        as: ReactRouterLink,
        to: buildOrgLink({ id: organization?.id, domain: organization?.primary_domain }),
        _hover: { textDecor: 'underline' }
      }}
      {...containerProps}
    />
  );
}
