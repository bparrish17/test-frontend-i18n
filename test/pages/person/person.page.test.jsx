import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { QueryParamProvider } from 'use-query-params';
import { ReactRouter6Adapter } from 'use-query-params/adapters/react-router-6';
import { BrowserRouter } from 'react-router-dom';

import { capitalize } from 'lodash-es';

import { renderWithProviders } from '@test/test.helpers';
import PersonPage from '@pages/person/person.page';
import { isExternalToUser } from '@util/helpers';
import { useUserStore } from '@store/app.store';
import { useBreakpoints, usePersonData, useSetDocumentTitle, useStyledToast } from '@util/hooks';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const original = await importOriginal();
  return {
    ...original,
    useNavigate: () => mockNavigate
  };
});

const mockToast = vi.fn();
vi.mock('@util/hooks', () => ({
  usePersonData: vi.fn(),
  useBreakpoints: vi.fn(),
  useSetDocumentTitle: vi.fn(),
  useStyledToast: vi.fn(() => mockToast)
}));

const mockIsExternalToUser = vi.fn();
vi.mock('@util/helpers', () => ({
  isExternalToUser: vi.fn(),
  capitalize: capitalize
}));

vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));

const mockSetId = vi.fn();
vi.mock('use-query-params', async (importOriginal) => {
  const original = await importOriginal();
  const actualUseQueryParam = original.useQueryParam;

  return {
    ...original,
    useQueryParam: (paramName, options) => {
      const [value, actualSetter] = actualUseQueryParam(paramName, options);
      if (paramName === 'id') {
        return [value, mockSetId];
      }

      return [value, actualSetter];
    }
  };
});

vi.mock('@components/person/person-card-skeleton.component', () => ({
  default: () => <div data-testid='person-card-skeleton'>PersonCardSkeleton</div>
}));
vi.mock('@components/person/person-card.component', () => ({
  default: (props) => (
    <div
      data-testid='person-card'
      data-props={JSON.stringify(props)}
    >
      PersonCard:{' '}
      {props.apolloPerson?.name ||
        props.apolloPerson?.email ||
        props.foraPerson?.name ||
        props.fallbackPerson?.email}{' '}
      Border: {props.borderTop}
    </div>
  )
}));
vi.mock('@components/person/person-recent-meeting-summaries.component', () => ({
  default: (props) => (
    <div
      data-testid='recent-meeting-summaries'
      data-props={JSON.stringify(props)}
    >
      RecentMeetingSummaries
    </div>
  )
}));
vi.mock('@components/person/person-right-rail.component', () => ({
  default: (props) => (
    <div
      data-testid='right-rail'
      data-props={JSON.stringify(props)}
    >
      PersonPageRightRail: {props.firstName}
    </div>
  )
}));
vi.mock('@layouts/columned.layout', () => ({
  default: ({ children, rightRailContent, 'data-cy': dataCy }) => (
    <div
      data-testid='columned-layout'
      data-cy={dataCy}
    >
      <div data-testid='main-content'>{children}</div>
      <div data-testid='right-rail-content'>{rightRailContent}</div>
    </div>
  )
}));
vi.mock('@components/general/loading-screen.component', () => ({
  default: (props) => (
    <div
      data-testid='loading-screen'
      data-props={JSON.stringify(props)}
    >
      LoadingScreen: {props.title}
    </div>
  )
}));

describe('PersonPage', () => {
  const renderComponent = () => renderWithProviders(<PersonPage />);

  const defaultUser = {
    id: 'user1',
    tenants: [{ id: 'tenant1' }],
    email: 'user@company.com',
    name: 'Test User'
  };

  const defaultPersonData = {
    isInvalidPerson: false,
    isPersonLoading: false,
    isLoading: false,
    apolloPerson: {
      id: 'apollo1',
      name: 'John Apollo',
      email: 'john@example.com'
    },
    foraPerson: null,
    contact: { id: 'contact1', name: 'John Contact' },
    organizationsStats: { workedAt: 1 },
    personSummarySources: [{ type: 'ai', content: 'Summary' }],
    peopleStats: { connections: 5 },
    personStats: { interactions: 10 },
    personInternalMeetings: [],
    personExternalMeetings: [{ id: 'm1', title: 'External Meeting' }],
    numOfDays: 90
  };

  const setUrl = (url = '/person?id=apollo1&email=john@example.com') => {
    window.history.pushState({}, '', url);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    setUrl();

    useUserStore.mockImplementation((selector) => selector({ user: defaultUser }));
    usePersonData.mockReturnValue(defaultPersonData);
    isExternalToUser.mockReturnValue(false);
    useBreakpoints.mockReturnValue({ isMobile: false });
    useSetDocumentTitle.mockImplementation(() => {});
    useStyledToast.mockReturnValue(mockToast);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should navigate back and toast when person is invalid', async () => {
    const invalidEmail = 'invalid@example.com';
    setUrl(`/person?email=${invalidEmail}`);
    usePersonData.mockReturnValue({
      ...defaultPersonData,
      isInvalidPerson: true,
      isLoading: false
    });

    renderComponent();

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: `Person with the email "${invalidEmail}" not found`
      });
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  it('should show person card with correct data', async () => {
    setUrl(`/person?id=apollo1&email=john@example.com`);
    usePersonData.mockReturnValue({
      ...defaultPersonData,
      isLoading: false,
      isPersonLoading: false
    });
    renderComponent();

    await waitFor(() => expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument());
    expect(screen.getByTestId('person-card')).toBeInTheDocument();
    expect(screen.getByTestId('person-card')).toHaveTextContent('PersonCard: John Apollo');
  });

  it('should show loading skeleton when person is loading (but main data fetch done)', async () => {
    setUrl(`/person?id=apollo1&email=john@example.com`);
    usePersonData.mockReturnValue({
      ...defaultPersonData,
      isLoading: false,
      isPersonLoading: true,
      apolloPerson: null
    });
    renderComponent();

    await waitFor(() => expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument());
    expect(screen.getByTestId('person-card-skeleton')).toBeInTheDocument();
    expect(screen.queryByTestId('person-card')).not.toBeInTheDocument();
  });

  it('should render right rail with correct data (e.g., first name)', async () => {
    setUrl(`/person?id=apollo1&email=john@example.com`);
    usePersonData.mockReturnValue({
      ...defaultPersonData,
      isLoading: false,
      isPersonLoading: false
    });
    renderComponent();
    await waitFor(() => expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument());
    expect(screen.getByTestId('right-rail')).toBeInTheDocument();
    expect(screen.getByTestId('right-rail')).toHaveTextContent('PersonPageRightRail: John');
  });

  it('should render recent meeting summaries', async () => {
    setUrl(`/person?id=apollo1&email=john@example.com`);
    usePersonData.mockReturnValue({
      ...defaultPersonData,
      isLoading: false,
      isPersonLoading: false
    });

    renderComponent();
    await waitFor(() => expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument());
    expect(screen.getByTestId('recent-meeting-summaries')).toBeInTheDocument();
  });

  it('should update document title', async () => {
    setUrl(`/person?id=apollo1&email=john@example.com`);
    usePersonData.mockReturnValue({
      ...defaultPersonData,
      apolloPerson: { name: 'John Apollo', email: 'john@example.com' },
      isLoading: false,
      isPersonLoading: false
    });

    renderComponent();
    await waitFor(() => {
      expect(useSetDocumentTitle).toHaveBeenCalledWith('John Apollo - FORA');
    });
  });

  it('should handle missing person name gracefully (using email in title and card)', async () => {
    const testEmail = 'noname@example.com';
    setUrl(`/person?email=${testEmail}`);
    usePersonData.mockReturnValue({
      ...defaultPersonData,
      apolloPerson: { name: undefined, email: testEmail },
      foraPerson: null,
      isLoading: false,
      isPersonLoading: false
    });

    renderComponent();

    await waitFor(() => {
      expect(useSetDocumentTitle).toHaveBeenCalledWith(`${testEmail} - FORA`);
    });

    await waitFor(() => expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument());
    const personCard = screen.getByTestId('person-card');
    expect(personCard).toHaveTextContent(`PersonCard: ${testEmail}`);
  });

  it('should pass mobile border style props to PersonCard when mobile', async () => {
    useBreakpoints.mockReturnValue({ isMobile: true });
    usePersonData.mockReturnValue({
      ...defaultPersonData,
      isLoading: false,
      isPersonLoading: false
    });
    setUrl(`/person?id=apollo1&email=john@example.com`);
    renderComponent();

    await waitFor(() => expect(screen.queryByTestId('loading-screen')).not.toBeInTheDocument());
    const personCard = screen.getByTestId('person-card');
    const personCardProps = JSON.parse(personCard.getAttribute('data-props'));

    expect(personCardProps.borderTop).toBe('none');

    expect(personCard).toHaveTextContent('Border: none');
  });

  it('should call setId(null) when id is "undefined"', async () => {
    const testEmail = 'test@example.com';
    setUrl(`/person?id=undefined&email=${testEmail}`);
    usePersonData.mockReturnValue({
      ...defaultPersonData,
      isLoading: false,
      isPersonLoading: false
    });

    renderComponent();

    await waitFor(() => {
      expect(mockSetId).toHaveBeenCalledWith(null, 'replaceIn');
    });
  });
});
