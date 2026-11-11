import { renderWithProviders } from '@test/test.helpers';
import PersonCardHeader from '@components/person/person-card-header.component';

vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn(() => ({ isMobile: false }))
}));

const mockPersonProps = {
  email: 'john.doe@example.com',
  websiteUrl: 'https://example.com',
  photoUrl: 'https://example.com/avatar.jpg',
  name: 'John Doe',
  title: 'Software Engineer',
  titleLink: 'https://example.com/profile',
  subtitle: 'Frontend Developer',
  organizationName: 'Example Corp',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  isOrganization: false,
  bgColor: 'light_material.400',
  children: null
};

const mockOrgProps = {
  name: 'Acme Corporation',
  title: 'Technology Company',
  titleLink: 'https://acme.example.com',
  subtitle: 'Innovative solutions for tomorrow',
  organizationName: 'Acme Corporation',
  photoUrl: 'https://via.placeholder.com/150',
  linkedinUrl: 'https://linkedin.com/company/acme',
  websiteUrl: 'https://acme.example.com',
  isOrganization: true,
  email: 'contact@acme.example.com'
};

describe('PersonCardHeader', () => {
  it('should render person data', () => {
    const { getByText } = renderWithProviders(<PersonCardHeader {...mockPersonProps} />);
    expect(getByText('John Doe')).toBeInTheDocument();
    expect(getByText('Software Engineer at Example Corp')).toBeInTheDocument();
    expect(getByText('Frontend Developer')).toBeInTheDocument();
  });

  it('should render organization data', () => {
    const { getByText } = renderWithProviders(<PersonCardHeader {...mockOrgProps} />);
    expect(getByText('Acme Corporation')).toBeInTheDocument();
    expect(getByText('Technology Company')).toBeInTheDocument();
    expect(getByText('Innovative solutions for tomorrow')).toBeInTheDocument();
  });
});
