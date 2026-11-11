import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';

import { useTimeZones } from '@services/query-services/types.query-service';
import { usePatchPerson } from '@services/query-services/people.query-service';
import { useUserStore } from '@store/app.store';
import { useSetDocumentTitle } from '@util/hooks';
import EmailSubscriptionsPage from '@pages/settings/email-subscriptions.page';

const mockUser = { id: '123' };
vi.mock('@services/query-services/types.query-service', () => ({
  useTimeZones: vi.fn()
}));
vi.mock('@services/query-services/people.query-service');
vi.mock('@store/app.store', () => ({
  useUserStore: vi.fn()
}));
vi.mock('@util/hooks', () => ({
  useSetDocumentTitle: vi.fn(),
  useMutationToast: vi.fn(() => ({ onSuccess: vi.fn(), onError: vi.fn() }))
}));

describe('EmailSubscriptionsPage', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <QueryClientProvider client={new QueryClient()}>
          <EmailSubscriptionsPage />
        </QueryClientProvider>
      </MemoryRouter>
    );
  };

  let patchPersonMock;

  beforeEach(() => {
    patchPersonMock = vi.fn();
    usePatchPerson.mockReturnValue({
      mutateAsync: patchPersonMock,
      isLoading: false
    });
    useUserStore.mockReturnValue(mockUser);
    useTimeZones.mockReturnValue({
      data: [
        { id: 'tz1', name: 'Timezone 1' },
        { id: 'tz2', name: 'Timezone 2' }
      ]
    });
  });

  test('sets document title to "Email Subscriptions - FORA"', () => {
    renderComponent();
    expect(useSetDocumentTitle).toHaveBeenCalledWith('Email Subscriptions - FORA');
  });

  test('renders timezone selector, morning prep and evening summary toggles', () => {
    const { container } = renderComponent();

    const timezoneDropdown = container.querySelector('select');
    const toggleElements = screen.getAllByRole('checkbox');
    expect(timezoneDropdown).toBeInTheDocument();
    expect(screen.getByText(/FORA Morning Prep/i)).toBeInTheDocument();
    expect(screen.getByText(/FORA End-of-Day Summary/i)).toBeInTheDocument();
    expect(toggleElements).toHaveLength(2);
  });

  test('submits patchUser request when timezone is changed', async () => {
    const { container } = renderComponent();
    const timezoneDropdown = container.querySelector('select');

    await waitFor(() => {
      expect(timezoneDropdown.options.length).toBeGreaterThan(1);
    });

    fireEvent.change(timezoneDropdown, { target: { value: 'tz1' } });

    await waitFor(() => {
      expect(patchPersonMock).toHaveBeenCalledWith(
        {
          id: '123',
          time_zone_id: 'tz1'
        },
        expect.any(Object)
      );
    });
  });
});
