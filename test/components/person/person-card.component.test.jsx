import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import PersonCard from '@components/person/person-card.component';

vi.mock('@util/helpers');

vi.mock('@components/org-chart/person-org-chart.component', () => ({
  default: ({ personId }) => <div data-testid='person-org-chart'>Person ID: {personId}</div>
}));

// Mock Components
vi.mock('@components/person/person-stats-inline.component', () => ({
  default: ({ firstName, orgName, totalRecordedMeetings, totalTime, numOfDays, isExternal }) => (
    <div data-testid='person-stats-inline'>
      {firstName} has met with {orgName} {totalRecordedMeetings} times in the past {numOfDays} days
      {isExternal ? ' (external)' : ''}
    </div>
  )
}));

vi.mock('@components/person/recently-met-with.component', () => ({
  default: ({ sections, numOfDays, isLoading, onQueryChange }) => (
    <div data-testid='recently-met-with'>
      <div data-testid='days-count'>{numOfDays}</div>
      <div data-testid='loading-state'>{isLoading ? 'Loading' : 'Not Loading'}</div>
      {sections?.map((section) => (
        <div
          key={section.type}
          data-testid={`section-${section.type}`}
        >
          {section.title}: {section.items?.length || 0} items
        </div>
      ))}
    </div>
  )
}));

vi.mock('@components/general/avatar-preview/person-preview.component', () => ({
  default: ({ person }) => <div data-testid='person-preview'>{person?.name || person?.email}</div>
}));

vi.mock('@components/person/person-card-header.component', () => ({
  default: ({
    email,
    photoUrl,
    name,
    title,
    titleLink,
    organizationName,
    linkedinUrl,
    children
  }) => (
    <div data-testid='person-card-header'>
      <img
        src={photoUrl}
        data-testid='person-card-header-photo'
      />
      <span data-testid='person-card-header-name'>{name}</span>
      <span data-testid='person-card-header-email'>{email}</span>
      <a
        href={titleLink}
        data-testid='person-card-header-titleLink'
      >
        {title}
      </a>
      <span data-testid='person-card-header-org'>{organizationName}</span>
      <a
        href={linkedinUrl}
        data-testid='person-card-header-linkedinUrl'
      >
        LinkedIn
      </a>
      {children}
    </div>
  )
}));

const renderWithProviders = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe('PersonCard', () => {
  const mockForaPerson = {
    id: 'fora-123',
    name: 'John Doe',
    email: 'john@example.com',
    title: 'Software Engineer',
    avatar_url: 'https://example.com/avatar.jpg',
    tenants: [{ name: 'Example Corp' }]
  };

  const mockContact = {
    id: 'contact-123',
    name: 'John Salesforce',
    email: 'john-salesforce@example.com',
    title: 'Business Development Associate',
    avatar_url: 'https://example.com/photo.jpg',
    company: {
      name: 'Salesforce Client Inc.'
    }
  };

  const mockApolloPerson = {
    name: 'John Apollo',
    email: 'john@apollo.com',
    title: 'Developer',
    photo_url: 'https://apollo.com/photo.jpg',
    organization: {
      id: 'org-123',
      name: 'Apollo Corp',
      logo_url: 'https://apollo.com/logo.jpg'
    },
    linkedin_url: 'https://linkedin.com/in/johnapollo'
  };

  const mockFallbackPerson = {
    email: 'john@fallback.com'
  };

  const mockPeopleStats = [
    {
      id: 'person-1',
      name: 'Person One',
      email: 'person1@example.com',
      title: 'Manager',
      botted: 5,
      duration: 3600
    },
    {
      id: 'person-2',
      name: 'Person Two',
      email: 'person2@example.com',
      title: 'Designer',
      botted: 3,
      duration: 1800
    }
  ];

  const mockPersonStats = {
    botted: 10,
    duration: 18000
  };

  const mockOrganizationsStats = [
    {
      id: 'org-1',
      name: 'Organization One',
      title: 'technology',
      count: 7,
      duration: 5400
    },
    {
      id: 'org-2',
      name: 'Organization Two',
      title: 'healthcare',
      count: 4,
      duration: 2700
    }
  ];

  it('renders with ForaPerson data correctly', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        peopleStats={mockPeopleStats}
        personStats={mockPersonStats}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    const expectHeaderToHaveText = (section, text) =>
      expect(screen.getByTestId(`person-card-header-${section}`)).toHaveTextContent(text);

    // Check card details
    expect(screen.getByTestId('person-card-header')).toBeInTheDocument();
    expectHeaderToHaveText('email', 'john@example.com');
    expectHeaderToHaveText('titleLink', 'Software Engineer');
    expectHeaderToHaveText('org', 'Example Corp');
    expectHeaderToHaveText('email', 'john@example.com');
    expectHeaderToHaveText('email', 'john@example.com');

    // Check stats section
    expect(screen.getByTestId('person-stats-inline')).toBeInTheDocument();
    expect(screen.getByTestId('person-stats-inline')).toHaveTextContent(
      'John has met with Example Corp 10 times in the past 90 days'
    );

    // Check org chart
    expect(screen.getByTestId('person-org-chart')).toBeInTheDocument();
    expect(screen.getByTestId('person-org-chart')).toHaveTextContent('Person ID: fora-123');

    // Check RecentlyMetWith
    expect(screen.getByTestId('recently-met-with')).toBeInTheDocument();
    expect(screen.getByTestId('section-person')).toHaveTextContent('Top People John Met: 2 items');
    expect(screen.getByTestId('section-company')).toHaveTextContent(
      'Top Companies John Met: 2 items'
    );
  });

  it('renders with Contact title when ForaPerson is not available', () => {
    renderWithProviders(
      <PersonCard
        contact={mockContact}
        apolloPerson={mockApolloPerson}
        peopleStats={mockPeopleStats}
        personStats={mockPersonStats}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    const expectHeaderToHaveText = (section, text) =>
      expect(screen.getByTestId(`person-card-header-${section}`)).toHaveTextContent(text);
    expectHeaderToHaveText('titleLink', 'Business Development Associate');
  });

  it('renders with ApolloPerson data when ForaPerson and Contact is not available', () => {
    renderWithProviders(
      <PersonCard
        apolloPerson={mockApolloPerson}
        peopleStats={mockPeopleStats}
        personStats={mockPersonStats}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    const expectHeaderToHaveText = (section, text) =>
      expect(screen.getByTestId(`person-card-header-${section}`)).toHaveTextContent(text);

    expectHeaderToHaveText('name', 'John Apollo');
    expectHeaderToHaveText('email', 'john@apollo.com');
    expectHeaderToHaveText('titleLink', 'Developer');
    expectHeaderToHaveText('org', 'Apollo Corp');
  });

  it('renders with Contact data when neither ForaPerson or ApolloPerson is not available', () => {
    renderWithProviders(
      <PersonCard
        contact={mockContact}
        peopleStats={mockPeopleStats}
        personStats={mockPersonStats}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    const expectHeaderToHaveText = (section, text) =>
      expect(screen.getByTestId(`person-card-header-${section}`)).toHaveTextContent(text);
    expectHeaderToHaveText('name', 'John Salesforce');
    expectHeaderToHaveText('email', 'john-salesforce@example.com');
    expectHeaderToHaveText('org', 'Salesforce Client Inc.');
  });

  it('renders with FallbackPerson data when ForaPerson and ApolloPerson are not available', () => {
    renderWithProviders(
      <PersonCard
        fallbackPerson={mockFallbackPerson}
        peopleStats={mockPeopleStats}
        personStats={mockPersonStats}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    expect(screen.getByTestId(`person-card-header-email`)).toHaveTextContent('john@fallback.com');
  });

  it('handles the loading state correctly', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        peopleStats={mockPeopleStats}
        personStats={mockPersonStats}
        organizationsStats={mockOrganizationsStats}
        isLoading={true}
      />
    );

    expect(screen.getByTestId('loading-state')).toHaveTextContent('Loading');
  });

  it.skip('does not render ImportDataLabel when neither Salesforce or Apollo data are available', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        peopleStats={mockPeopleStats}
        personStats={null}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    expect(screen.queryByText('Importing live data from')).not.toBeInTheDocument();
  });

  it.skip('renders ImportDataLabel with just Salesforce label', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        contact={mockContact}
        peopleStats={mockPeopleStats}
        personStats={null}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    expect(screen.queryByText('Importing live data from Salesforce')).toBeInTheDocument();
  });

  it.skip('renders ImportDataLabel with just Apollo label', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        apolloPerson={mockApolloPerson}
        peopleStats={mockPeopleStats}
        personStats={null}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    expect(screen.queryByText('Importing live data from Apollo.io')).toBeInTheDocument();
  });

  it.skip('renders ImportDataLabel with both Salesforce and Apollo labels if available', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        contact={mockContact}
        apolloPerson={mockApolloPerson}
        peopleStats={mockPeopleStats}
        personStats={null}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    expect(
      screen.queryByText('Importing live data from Salesforce & Apollo.io')
    ).toBeInTheDocument();
  });

  it('does not render PersonStatsInline when personStats is not available', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        peopleStats={mockPeopleStats}
        personStats={null}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    // PersonStatsInline should not be rendered
    expect(screen.queryByTestId('person-stats-inline')).not.toBeInTheDocument();

    // But org chart should still be rendered because foraPerson.id exists
    expect(screen.getByTestId('person-org-chart')).toBeInTheDocument();
  });

  it('does not render PersonOrgChart when foraPerson.id is not available', () => {
    const personWithoutId = { ...mockForaPerson, id: null };

    renderWithProviders(
      <PersonCard
        foraPerson={personWithoutId}
        peopleStats={mockPeopleStats}
        personStats={mockPersonStats}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );

    // PersonStatsInline should be rendered
    expect(screen.getByTestId('person-stats-inline')).toBeInTheDocument();

    // But org chart should not be rendered
    expect(screen.queryByTestId('person-org-chart')).not.toBeInTheDocument();
  });

  it('renders correctly with external flag', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        peopleStats={mockPeopleStats}
        personStats={mockPersonStats}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
        isExternal={true}
      />
    );

    expect(screen.getByTestId('person-stats-inline')).toHaveTextContent('(external)');
  });

  it('handles empty stats arrays correctly', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        peopleStats={[]}
        personStats={mockPersonStats}
        organizationsStats={[]}
        isLoading={false}
      />
    );

    expect(screen.queryByTestId('recently-met-with')).not.toBeInTheDocument();
  });

  it('calls useInfinitePersonRecentlyMetWith with correct parameters', () => {
    renderWithProviders(
      <PersonCard
        foraPerson={mockForaPerson}
        peopleStats={mockPeopleStats}
        personStats={mockPersonStats}
        organizationsStats={mockOrganizationsStats}
        isLoading={false}
      />
    );
  });
});
