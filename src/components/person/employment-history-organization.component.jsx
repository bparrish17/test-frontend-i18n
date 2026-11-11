import { Stack, Flex, Avatar, Text } from '@chakra-ui/react';

import { capitalizeFullString } from '@util/helpers';
import BulletedList from '@components/general/bulleted-list.component';
import StyledLink from '@components/general/styled-link.component';
import EmploymentHistoryPosition from './employment-history-position.component';

export default function EmploymentHistoryOrganization({ employmentHistoryOrg }) {
  const { organization, positions } = employmentHistoryOrg;

  return (
    <Flex
      gap={{ base: 4, md: 8 }}
      flexDir={{ base: 'column', md: 'initial' }}
    >
      <EmploymentHistoryOrgWrapper organizationId={organization.id}>
        <Avatar
          src={organization?.logo_url}
          name={organization?.name}
          size='sm'
        />
        <Stack gap={0.5}>
          <Text fontWeight={600}>{organization?.name}</Text>
          <Text
            fontSize='xs'
            lineHeight='normal'
          >
            {capitalizeFullString(organization?.industry)}
          </Text>
        </Stack>
      </EmploymentHistoryOrgWrapper>
      <BulletedList
        flexGrow={1}
        bullets={positions}
        ml={{ base: 3, sm: 0 }}
      >
        {(position, i) => (
          <EmploymentHistoryPosition
            key={i}
            position={position}
            positionIndex={i}
            positions={positions}
          />
        )}
      </BulletedList>
    </Flex>
  );
}

function EmploymentHistoryOrgWrapper({ organizationId, children }) {
  const flexProps = {
    gap: 4,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: { base: 'unset', md: '300px' }
  };
  return organizationId ? (
    <StyledLink
      display='flex'
      {...flexProps}
      fontSize='md'
      to={`/organizations/${organizationId}`}
      color='inherit'
    >
      {children}
    </StyledLink>
  ) : (
    <Flex {...flexProps}>{children}</Flex>
  );
}
