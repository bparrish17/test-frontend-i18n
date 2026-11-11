import { render } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePersonData, useInfinitePersonRecentlyMetWith } from '@util/hooks';
import RecentlyMetWithTableModal from '@components/person/recently-met-with-modal.component';
import { BrowserRouter } from 'react-router-dom';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { withinElementByTestId } from '@test/test.helpers';
import { peopleHeaders, companiesHeaders } from '@components/person/person.shared.component';

// Mock the hooks with the correct hook name
vi.mock('@util/hooks', () => ({
  usePersonData: vi.fn(),
  useDebouncedProp: (v) => v
}));

// Helper function to render with all required providers
const renderWithProviders = (mockProps) => {
  const queryClient = new QueryClient();
  return render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <QueryParamProvider adapter={ReactRouter6Adapter}>
          <RecentlyMetWithTableModal {...mockProps} />
        </QueryParamProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

describe('RecentlyMetWithModal', () => {
  const withinComponent = withinElementByTestId('recently-met-with-modal');
  const peopleData = [
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Doe',
      title: 'Software Engineer',
      count: 5,
      botted: 4,
      duration: 18000000 // 5 hours in milliseconds
    }
  ];

  const organizationsData = [
    {
      id: '1',
      name: 'Test Corp',
      count: 10,
      botted: 6,
      duration: 36000000 // 10 hours in milliseconds
    }
  ];

  // Mock the fetch function for infiniteQuery
  const mockFetchNextPage = vi.fn();

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
          item: person,
          key: person.id,
          disabled: !!person?.id && !!person?.email,
          to: `/person?email=${person.email}&id=${person.id}`
        }),
        avatarStack: {
          maxAvatars: 5,
          maxNameChars: 20
        },
        table: {
          headers: peopleHeaders,
          tableData: peopleData
        }
      },
      {
        id: 'organizations',
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
                disabled: !company?.id,
                as: Text,
                color: 'surface.onSurface',
                _hover: {}
              })
        }),
        avatarStack: {
          maxAvatars: 5,
          maxNameChars: 20
        },
        table: {
          headers: companiesHeaders,
          tableData: organizationsData
        }
      }
    ],
    disclosure: {
      isOpen: true
    },
    activeType: 'person'
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock usePersonData to return the test data
    usePersonData.mockReturnValue({
      ...mockProps,
      isLoading: false
    });
  });

  it('renders section headers correctly', () => {
    renderWithProviders(mockProps);

    // For the tabs, check that the section titles are present
    expect(withinComponent().getByText('1 person')).toBeInTheDocument();
    expect(withinComponent().getByText('1 company')).toBeInTheDocument();
  });

  it('displays people stats correctly', () => {
    renderWithProviders(mockProps);

    // Look for text with proper spacing or partial content to be more resilient
    expect(withinComponent().getByText('John Doe')).toBeInTheDocument();
    expect(withinComponent().getByText(/4 recorded meetings/)).toBeInTheDocument();
  });

  it('displays organization stats correctly', () => {
    renderWithProviders({ ...mockProps, activeType: 'company' });

    // Look for text with proper spacing or partial content to be more resilient
    expect(withinComponent().getByText('Test Corp')).toBeInTheDocument();
    expect(withinComponent().getByText(/6 recorded meetings/)).toBeInTheDocument();
  });
});
