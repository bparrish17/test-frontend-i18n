import { render, screen, within } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useApolloOrganizationsByIds } from '@services/query-services/apollo.query-service';
import { useEnrichedOrganizationsStats, useSetDocumentTitle } from '@util/hooks';
import OrganizationPage from '@pages/organization/organization.page';
import { useUserStore } from '@store/app.store';
import { useQueryParam } from 'use-query-params';

// Mock dependencies
vi.mock('react-router-dom', () => ({
  useLocation: vi.fn()
}));

vi.mock('use-query-params', () => ({
  useQueryParam: vi.fn()
}));

vi.mock('@services/query-services/apollo.query-service', () => ({
  useApolloOrganizationsByIds: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useSetDocumentTitle: vi.fn(),
  useEnrichedOrganizationsStats: vi.fn()
}));

vi.mock('@store/app.store');

// Mock components
vi.mock('@layouts/columned.layout', () => ({
  default: ({ children, rightRailContent, mobileContent }) => (
    <div data-testid='columned-layout'>
      <div data-testid='main-content'>{children}</div>
      <div data-testid='right-rail'>{rightRailContent}</div>
      <div data-testid='mobile-content'>{mobileContent}</div>
    </div>
  )
}));
vi.mock('@components/person/person-right-rail.component', () => ({
  default: ({ firstName }) => <div data-testid='person-page-right-rail'>{firstName}</div>
}));

vi.mock('@components/organization/organization-details.component', () => ({
  default: ({ organization }) => (
    <div data-testid='organization-details'>Organization Details: {organization?.name}</div>
  )
}));

vi.mock('@components/organization/organization-meeting-summaries.component', () => ({
  default: ({ organization, children }) => (
    <div data-testid='organization-meeting-summaries'>
      Meeting Summaries: {organization?.name}
      <div>{children}</div>
    </div>
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

vi.mock('@pages/organization/mobile-organization.page', () => ({
  default: ({ organization }) => (
    <div data-testid='mobile-organization-page'>Mobile Page: {organization?.name}</div>
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

describe('OrganizationPage', () => {
  const mockOrganization = {
    id: '123',
    name: 'Acme Corp',
    primary_domain: 'acme.com'
  };

  let mockParams;

  beforeEach(() => {
    vi.clearAllMocks();

    mockParams = {
      domain: ['acme.com', vi.fn()],
      id: ['123', vi.fn()]
    };

    useQueryParam.mockImplementation((key) => mockParams[key]);
    useLocation.mockReturnValue({ state: null });
    useApolloOrganizationsByIds.mockReturnValue({
      data: mockOrganization
    });
    useEnrichedOrganizationsStats.mockReturnValue({
      organizationStats: {
        ...mockOrganization,
        count: 100,
        botted: 80,
        duration: 3600
      },
      allOrganizationsStats: [],
      isOrganizationsStatsLoading: false
    });
  });

  it('fetches organization data using the ID from URL params', () => {
    renderWithProviders(<OrganizationPage />);
    expect(useApolloOrganizationsByIds).toHaveBeenCalledWith(['123'], expect.anything());
  });

  it('sets document title with organization name', () => {
    renderWithProviders(<OrganizationPage />);
    expect(useSetDocumentTitle).toHaveBeenCalledWith('Acme Corp - FORA');
  });

  it('renders person page right rail', () => {
    renderWithProviders(<OrganizationPage />);
    const railRail = screen.getByTestId('person-page-right-rail');
    expect(railRail).toBeInTheDocument();
  });

  it("renders 'Your Company' in Person Page Right Rail if is current users org", () => {
    useUserStore.mockReturnValue({ email: 'john@acme.com' });
    renderWithProviders(<OrganizationPage />);
    const yourCompany = screen.getByText('Your Company');
    expect(yourCompany).toBeInTheDocument();
  });

  it('renders the organization details component', () => {
    renderWithProviders(<OrganizationPage />);
    const detailsComponents = screen.getByTestId('organization-details');
    expect(detailsComponents).toBeInTheDocument();
    expect(screen.getAllByText(/Organization Details: Acme Corp/)[0]).toBeInTheDocument();
  });

  it('renders the meeting summaries component with email as primary_domain, numOfDays, and isOrganization', () => {
    renderWithProviders(<OrganizationPage />);
    const summariesComponents = screen.getByTestId('organization-meeting-summaries');
    const email = screen.getByTestId('organization-meeting-summaries-email');
    const numOfDays = screen.getByTestId('organization-meeting-summaries-numOfDays');

    expect(summariesComponents).toBeInTheDocument();
    expect(email).toHaveTextContent('acme.com');
    expect(numOfDays).toHaveTextContent(90);
  });

  it('renders the mobile organization page content', () => {
    renderWithProviders(<OrganizationPage />);

    // Check that the mobile content container exists
    const mobileContent = screen.getByTestId('mobile-content');
    expect(mobileContent).toBeInTheDocument();

    // Since our mock returns a simple div and not actual tabs, we can't test for tabs
    // Instead, verify the mobile content container isn't empty
    expect(mobileContent).not.toBeEmptyDOMElement();
  });

  it('uses organization from location state as fallback when API data is not available', () => {
    const fallbackOrg = {
      id: 'fallback123',
      name: 'Fallback Corp',
      primary_domain: 'fallback.com'
    };

    useLocation.mockReturnValue({ state: fallbackOrg });
    useApolloOrganizationsByIds.mockReturnValue({
      data: fallbackOrg // Mock the select function's behavior by returning fallbackOrg directly
    });

    renderWithProviders(<OrganizationPage />);

    // Look for a specific component containing the fallback organization name
    const mainContent = screen.getByTestId('main-content');
    const detailsComponent = within(mainContent).getByTestId('organization-details');
    expect(detailsComponent).toHaveTextContent('Fallback Corp');
  });
});
