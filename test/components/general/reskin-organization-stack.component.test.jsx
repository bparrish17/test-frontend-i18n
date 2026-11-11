import { screen } from '@testing-library/react';
import { expect } from 'vitest';

import { renderWithProviders } from '@test/test.helpers';
import ReskinOrganizationStack from '@components/general/reskin-organization-stack.component';

const mockOrganizations = [
  {
    id: 'org1',
    name: 'Org 1',
    meetings: {
      meeting1: {}
    }
  }
];

describe('ReskinOrganizationStack', () => {
  it('renders people with defaults', () => {
    renderWithProviders(<ReskinOrganizationStack organizations={mockOrganizations} />);
    expect(screen.getByText('1 Meeting')).toBeInTheDocument();
  });
  it('renders organizations with custom title', () => {
    renderWithProviders(
      <ReskinOrganizationStack
        organizations={mockOrganizations}
        title={(org) => org.id}
      />
    );
    expect(screen.getByText('org1')).toBeInTheDocument();
  });
});
