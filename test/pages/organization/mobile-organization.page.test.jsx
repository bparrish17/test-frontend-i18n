import { render, screen } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';

import MobileOrganizationPage from '@pages/organization/mobile-organization.page';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@components/organization/organization-details.component', () => ({
  default: ({ organization }) => (
    <div data-testid='organization-details'>Organization Details: {organization?.name}</div>
  )
}));

vi.mock('@components/person/person-recent-meeting-summaries.component', () => ({
  default: ({ email, numOfDays }) => (
    <div data-testid='organization-meeting-summaries'>
      <span data-testid='organization-meeting-summaries-email'>{email}</span>
      <span data-testid='organization-meeting-summaries-numOfDays'>{numOfDays}</span>
    </div>
  )
}));

const renderWithProviders = (ui) => {
  const queryClient = new QueryClient();
  return render(ui, {
    wrapper: ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    )
  });
};

describe('MobileOrganizationPage', () => {
  const mockOrganization = {
    id: 'org123',
    name: 'Acme Corp',
    primary_domain: 'acme.com'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders organization details', () => {
    renderWithProviders(<MobileOrganizationPage organization={mockOrganization} />);
    expect(screen.getByTestId('organization-details')).toBeInTheDocument();
    expect(screen.getByText('Organization Details: Acme Corp')).toBeInTheDocument();
  });

  it('renders revent meeting summaries with org primary_domain as email and 90 days', () => {
    renderWithProviders(<MobileOrganizationPage organization={mockOrganization} />);
    const summariesComponents = screen.getByTestId('organization-meeting-summaries');
    const email = screen.getByTestId('organization-meeting-summaries-email');
    const numOfDays = screen.getByTestId('organization-meeting-summaries-numOfDays');

    expect(summariesComponents).toBeInTheDocument();
    expect(email).toHaveTextContent('acme.com');
    expect(numOfDays).toHaveTextContent(90);
  });
});
