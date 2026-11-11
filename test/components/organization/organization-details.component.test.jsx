import { render } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';

import OrganizationDetails from '@components/organization/organization-details.component';
import { useOrganizationsStats } from '@services/query-services/meetings.query-service';
import { useUserStore } from '@store/app.store';
import * as helpers from '@util/helpers';
import { useEnrichedOrganizationsStats } from '@util/hooks';
import { renderWithProviders } from '@test/test.helpers';

vi.mock('@assets/icons', () => ({
  LinkedinCircledLogoIcon: () => <div data-testid='linkedin-icon'>LinkedinIcon</div>,
  SalesforceIcon: () => <div data-testid='salesforce-icon'>SalesforceIcon</div>,
  SFLinkIcon: () => <div data-testid='website-icon'>SFLinkIcon</div>
}));

vi.mock('@services/query-services/meetings.query-service', () => ({
  useOrganizationsStats: vi.fn(),
  usePeopleStats: vi.fn().mockReturnValue({
    data: [],
    isLoading: false
  })
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

// Mock the hooks import
vi.mock('@util/hooks', () => ({
  usePeopleStats: vi.fn().mockImplementation((data) => ({
    peopleStats: data || []
  })),
  useEnrichedOrganizationsStats: vi.fn(),
  useBreakpoints: vi.fn().mockReturnValue({
    isMobile: false
  })
}));

vi.mock('@assets/icons', async (importActual) => ({
  ...(await importActual()),
  LinkedinCircledLogoIcon: () => <div data-testid='linkedin-icon' />,
  SFLinkIcon: () => <div data-testid='website-icon' />,
  SFCustomersIcon: () => <div data-testid='customers-icon' />,
  SFLockedIconOutlined: () => <div data-testid='locked-icon' />,
  SFBookPagesOutlinedIcon: () => <div data-testid='book-pages-icon' />,
  SFPieChartIcon: () => <div data-testid='pie-chart-icon' />,
  SFTwoBuildings: () => <div data-testid='two-buildings-icon' />,
  InfoIcon: () => <div data-testid='info-icon' />,
  SFCalendarIcon: () => <div data-testid='calendar-icon' />,
  SFChatBubblesIconOutlined: () => <div data-testid='chat-bubbles-icon' />,
  SFLineChartIcon: () => <div data-testid='line-chart-icon' />
}));

describe('OrganizationDetails', () => {
  const mockOrganization = {
    name: 'Acme Corp',
    logo_url: 'https://example.com/logo.png',
    primary_domain: 'acme.com',
    industry: 'technology',
    city: 'San Francisco',
    state: 'ca',
    country: 'United States',
    description: 'A fictional company',
    short_description: 'A short description of Acme Corp',
    seo_description: 'A SEO description of Acme Corp',
    linkedin_url: 'https://linkedin.com/company/acme',
    website_url: 'https://acme.com'
  };

  const mockStats = {
    botted: 5,
    duration: 3600, // 1 hour in seconds
    email: 'acme.com',
    name: 'Acme Corp'
  };

  const mockUser = {
    id: 'user123',
    apollo_profile: {
      organization_id: 'org456',
      organization: {
        name: 'Test Org'
      }
    }
  };

  const mockProps = {
    organization: mockOrganization,
    domain: mockOrganization.primary_domain,
    isExternal: true,
    userOrgDomain: 'fora.day'
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Default mocks
    useUserStore.mockReturnValue({ user: mockUser });

    // Fix: Return an array instead of a single object
    useOrganizationsStats.mockReturnValue({
      data: [mockStats],
      isLoading: false
    });

    useEnrichedOrganizationsStats.mockReturnValue({
      organizationStats: {
        ...mockOrganization,
        ...mockStats
      },
      allOrganizationsStats: [],
      isOrganizationsStatsLoading: false
    });

    // Mock the formatDurationWithUnits function
    vi.spyOn(helpers, 'formatDurationWithUnits').mockReturnValue('1 hour');
    vi.spyOn(helpers, 'capitalizeFullString').mockImplementation((str) =>
      str ? str.charAt(0).toUpperCase() + str.slice(1) : str
    );
    vi.spyOn(helpers, 'getOrgDescription').mockReturnValue('A SEO description of Acme Corp');
  });

  it('renders organization stats when available', () => {
    const { getByTestId } = renderWithProviders(<OrganizationDetails {...mockProps} />);

    const statsElement = getByTestId('organization-stats-inline');
    expect(statsElement).toBeInTheDocument();
    expect(statsElement).toHaveTextContent(
      'Acme Corp has had 5 recorded meetings with your company in the past 90 days. You last met 1 hour ago.'
    );
  });

  it('renders organization description when available', () => {
    const { getByText } = renderWithProviders(<OrganizationDetails {...mockProps} />);

    expect(getByText('A SEO description of Acme Corp')).toBeInTheDocument();
  });

  it('renders LinkedIn button when LinkedIn URL is available', () => {
    const { getByText, getByTestId } = renderWithProviders(<OrganizationDetails {...mockProps} />);

    expect(getByText('LinkedIn')).toBeInTheDocument();
    expect(getByTestId('linkedin-icon')).toBeInTheDocument();
    expect(getByText('LinkedIn').closest('a')).toHaveAttribute(
      'href',
      'https://linkedin.com/company/acme'
    );
  });

  it('renders Website button when website URL is available', () => {
    const { getByText, getByTestId } = renderWithProviders(<OrganizationDetails {...mockProps} />);

    expect(getByText('Website')).toBeInTheDocument();
    expect(getByTestId('website-icon')).toBeInTheDocument();
    expect(getByText('Website').closest('a')).toHaveAttribute('href', 'https://acme.com');
  });

  it('LinkedIn button is disabled when LinkedIn URL is not available', () => {
    const orgWithoutLinkedIn = { ...mockOrganization, linkedin_url: null };
    const { getByText } = renderWithProviders(
      <OrganizationDetails
        {...mockProps}
        organization={orgWithoutLinkedIn}
      />
    );

    expect(getByText('LinkedIn')).toHaveAttribute('disabled');
  });

  it('Website button is disabled when website URL is not available', () => {
    const orgWithoutWebsite = { ...mockOrganization, website_url: null };
    const { getByText } = renderWithProviders(
      <OrganizationDetails
        {...mockProps}
        organization={orgWithoutWebsite}
      />
    );

    expect(getByText('Website')).toHaveAttribute('disabled');
  });

  it('formats location correctly for US addresses', () => {
    const { getByText } = renderWithProviders(<OrganizationDetails {...mockProps} />);

    expect(getByText('Technology')).toBeInTheDocument();
    expect(getByText('San Francisco')).toBeInTheDocument();
  });

  it('formats location correctly for international addresses', () => {
    const internationalOrg = {
      ...mockOrganization,
      city: 'London',
      state: null,
      country: 'United Kingdom'
    };

    const { getByText } = renderWithProviders(
      <OrganizationDetails
        {...mockProps}
        organization={internationalOrg}
      />
    );

    expect(getByText('Technology')).toBeInTheDocument();
    expect(getByText('London, United Kingdom')).toBeInTheDocument();
  });

  it('sets isExternal flag correctly when viewing another organization', () => {
    // User org doesn't match the viewed org
    useUserStore.mockReturnValue({
      user: {
        id: 'user123',
        apollo_profile: { organization_id: 'org456' }
      }
    });

    const { getByTestId } = renderWithProviders(<OrganizationDetails {...mockProps} />);

    const statsElement = getByTestId('organization-stats-inline');
    expect(statsElement).toHaveTextContent('with your company');
  });

  it('does not fetch stats when primary domain is not available', () => {
    const orgWithoutDomain = { ...mockOrganization, primary_domain: null };

    useOrganizationsStats.mockClear();

    renderWithProviders(
      <OrganizationDetails
        {...mockProps}
        organization={orgWithoutDomain}
      />
    );

    const orgStatsCalls = useOrganizationsStats.mock.calls;
    expect(orgStatsCalls.length).toBe(0);
  });
});
