import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import { useTimeZones } from '@services/query-services/types.query-service';
import { usePatchPerson } from '@services/query-services/people.query-service';
import { useUserStore } from '@store/app.store';
import TimezoneSection from '@pages/settings/account-settings/timezone.section';
import { useMutationToast } from '@util/hooks';

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

describe('TimezoneSection', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <TimezoneSection />
      </MemoryRouter>
    );
  };

  let patchPersonMock;
  const setUserMock = vi.fn();

  beforeEach(() => {
    patchPersonMock = vi.fn();
    usePatchPerson.mockReturnValue({
      mutateAsync: patchPersonMock,
      isLoading: false
    });
    useUserStore.mockImplementation((selector) => {
      const state = {
        user: {
          ...mockUser,
          time_zone_id: 'PST8PDT',
          digest_configs: { morning: 640 }
        },
        setUser: setUserMock
      };
      return selector(state);
    });
    useTimeZones.mockReturnValue({
      data: [
        { id: 'tz1', name: 'Timezone 1' },
        { id: 'tz2', name: 'Timezone 2' }
      ]
    });
  });

  it('renders timezone selector, morning prep and evening summary toggles', () => {
    const { container } = renderComponent();
    const timezoneDropdown = container.querySelector('select');
    expect(timezoneDropdown).toBeInTheDocument();
  });

  it('submits patchUser request when timezone is changed', async () => {
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

  it('updates app store user value on successful patch', async () => {
    renderComponent();
    expect(useMutationToast).toHaveBeenCalledWith(
      expect.objectContaining({
        success: { title: expect.any(String), callback: setUserMock }
      })
    );
  });
});
