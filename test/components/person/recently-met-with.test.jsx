import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePersonData, useInfinitePersonRecentlyMetWith } from '@util/hooks';
import { useRef } from 'react';
import RecentlyMetWith from '@components/person/recently-met-with.component';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the hooks with the correct hook name
vi.mock('@util/hooks', () => ({
  usePersonData: vi.fn(),
  useInfinitePersonRecentlyMetWith: vi.fn(),
  useDebouncedProp: (v) => v
}));

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    Avatar: vi.fn((props) => (
      <div
        className='chakra_avatar'
        {...props}
      ></div>
    ))
  };
});

// Helper function to render with all required providers
const renderWithProviders = (mockProps) => {
  const queryClient = new QueryClient();
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <RecentlyMetWith {...mockProps} />
        </QueryParamProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('RecentlyMetWith', () => {
  const peopleData = [
    {
      id: '1',
      internalId: '1',
      email: 'john@example.com',
      name: 'John Doe',
      title: 'Software Engineer',
      count: 5,
      botted: 4,
      photo_url: 'fakeimg.com',
      duration: 18000000 // 5 hours in milliseconds
    }
  ];

  const organizationsData = [
    {
      id: '1',
      name: 'Test Corp',
      count: 10,
      botted: 6,
      photo_url: 'fakeorgimg.com',
      duration: 36000000 // 10 hours in milliseconds
    }
  ];

  // Create proper sections structure expected by the component
  const mockProps = {
    sections: [
      {
        id: 'people',
        type: 'person',
        title: 'People',
        items: peopleData,
        maxItems: 4,
        itemPreview: (person) => ({
          item: { ...person, internalId: person?.id },
          key: person.id,
          disabled: !person?.id && !person?.email
        }),
        avatarStack: {
          maxAvatars: 5,
          maxNameChars: 20
        }
      },
      {
        id: 'companies',
        type: 'company',
        title: 'Companies',
        items: organizationsData,
        maxItems: 4,
        itemPreview: (company) => ({
          avatarVariant: '',
          item: company,
          key: company.id,
          ...(company?.id
            ? {
                to: `/organizations/${company?.id}`
              }
            : {
                disabled: true,
                as: Text,
                color: 'surface.onSurface',
                _hover: {}
              })
        }),
        avatarStack: {
          maxAvatars: 5,
          maxNameChars: 20
        }
      }
    ],
    numOfDays: 90,
    isLoading: false
  };

  beforeEach(() => {
    vi.clearAllMocks();

    usePersonData.mockReturnValue({
      ...mockProps,
      isLoading: false
    });

    useInfinitePersonRecentlyMetWith.mockReturnValue({
      data: {
        pages: [
          {
            peoples: peopleData,
            organizations: organizationsData
          }
        ]
      },
      isLoading: false,
      isFetching: false,
      hasNextPage: false,
      fetchNextPage: vi.fn()
    });
  });

  it('renders section headers correctly', () => {
    renderWithProviders(mockProps);

    expect(screen.getByText('People')).toBeInTheDocument();
    expect(screen.getByText('Companies')).toBeInTheDocument();
  });

  it('displays people stats correctly', () => {
    renderWithProviders(mockProps);

    expect(screen.getByText('John Doe')).toBeInTheDocument();

    const personStats = screen.getByTestId('person-stats-dot-separated');
    expect(personStats).toHaveTextContent('4 recorded meetings');
  });

  it('displays organization stats correctly', () => {
    renderWithProviders(mockProps);

    expect(screen.getByText('Test Corp')).toBeInTheDocument();

    const companyStats = screen.getByTestId('company-stats-dot-separated');
    expect(companyStats).toHaveTextContent('6 recorded meetings');
  });

  it('handles grayscale filter: enabled for people avatars, but not organization avatars', async () => {
    renderWithProviders(mockProps);

    const companyAvatar = screen.getByTestId('company-avatar').querySelector('.chakra_avatar');
    expect(companyAvatar).toHaveAttribute('variant', '');

    const personAvatar = screen.getByTestId('person-avatar').querySelector('.chakra_avatar');
    // it's grayscale by default, so this means it's not overridden
    expect(personAvatar).toHaveAttribute('variant', 'grayscale');
  });

  it('updates link based on entity type', () => {
    renderWithProviders(mockProps);
    const personAvatarLink = screen.getByTestId('person-avatar');
    expect(personAvatarLink).toHaveAttribute('href', '/person?email=john@example.com&id=1');

    const companyAvatarLink = screen.getByTestId('company-avatar');
    expect(companyAvatarLink).toHaveAttribute('href', '/organizations/1');
  });
});
