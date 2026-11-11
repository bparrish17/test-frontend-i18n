import { SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { isEmpty, size } from 'lodash-es';
import { Link as ReactRouterLink } from 'react-router-dom';

import { buildOrgLink, pluralized } from '@util/helpers';
import AvatarPreview from '@components/general/avatar-preview/avatar-preview.component';

export default function ReskinOrganizationStack({ organizations, title }) {
  if (isEmpty(organizations)) {
    return null;
  }

  return (
    <Stack gap={8}>
      <Text variant='content-section-header'>Organizations</Text>
      <SimpleGrid
        columns={{ base: 1, md: 2, lg: 1 }}
        gap={8}
      >
        {organizations?.map((organization) => {
          return (
            <AvatarPreview
              key={organization?.id}
              name={organization?.name}
              size='lg'
              title={
                title?.(organization) ?? `${pluralized('Meeting', size(organization.meetings))}`
              }
              photoUrl={organization?.logo_url}
              titleProps={{ fontSize: 'sm' }}
              nameProps={{
                fontSize: 'md',
                _hover: { textDecor: 'underline' }
              }}
              as={ReactRouterLink}
              to={buildOrgLink({ id: organization?.id, domain: organization?.primary_domain })}
              state={organization}
            />
          );
        })}
      </SimpleGrid>
    </Stack>
  );
}
