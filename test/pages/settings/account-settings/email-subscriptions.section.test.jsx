import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import '@testing-library/jest-dom';

import { useTimeZones } from '@services/query-services/types.query-service';
import { usePatchPerson } from '@services/query-services/people.query-service';
import { useUserStore } from '@store/app.store';
import { utcMinutesToHHMM } from '@util/helpers';
import EmailSubscriptionsSection from '@pages/settings/account-settings/email-subscriptions.section';

const mockUser = { id: '123' };
vi.mock('react-hook-form', async (importActual) => ({
  ...(await importActual()),
  Controller: ({ children, render }) => (
    <div>
      {children}
      <div>{render({ field: { onChange: vi.fn(), value: true } })}</div>
    </div>
  ),
  useForm: vi.fn()
}));
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

describe('EmailSubscriptionsSection', () => {
  const renderComponent = () => {
    return render(
      <MemoryRouter>
        <EmailSubscriptionsSection />
      </MemoryRouter>
    );
  };

  const mockUseForm = (args = {}) => {
    useForm.mockReturnValue({
      handleSubmit: (fn) => vi.fn(fn),
      register: vi.fn(),
      watch: vi.fn(),
      reset: vi.fn(),
      formState: {},
      control: {},
      ...args
    });
  };

  let patchPersonMock;

  beforeEach(() => {
    patchPersonMock = vi.fn();
    mockUseForm();
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

  it('renders morning prep and end-of-day subscription sections with save button', () => {
    renderComponent();
    expect(screen.getByText('FORA Morning Prep')).toBeInTheDocument();
    expect(screen.getByText('Prepare for the day')).toBeInTheDocument();
    expect(screen.getByText('FORA End-of-Day Summary')).toBeInTheDocument();
    expect(screen.getByText('Review recently summarized information')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save Subscriptions' })).toBeInTheDocument();
  });

  it('sets display user-friendly timezone to user next to input fields', async () => {
    mockUseForm({
      watch: (controlName) => controlName === 'meetingPrepEnabled',
      formState: { errors: {} }
    });
    useUserStore.mockImplementation((selector) => {
      const state = {
        user: {
          ...mockUser,
          time_zone_id: 'PST8PDT',
          digest_configs: { morning: 640 }
        }
      };
      return selector(state);
    });
    renderComponent();
    expect(screen.getByText('PST')).toBeInTheDocument();
  });

  it("sets user morning and evening digest values to hh:mm based on user's digest_configs and time_zone_id configs", async () => {
    useUserStore.mockImplementation((selector) => {
      const state = {
        user: {
          ...mockUser,
          time_zone_id: 'PST8PDT',
          digest_configs: { morning: { time_of_day: 640 } }
        }
      };
      return selector(state);
    });
    renderComponent();
    expect(useForm).toHaveBeenCalledWith({
      defaultValues: {
        meetingPrepEnabled: true,
        meetingPrepTime: utcMinutesToHHMM(640, 'PST8PDT'),
        summariesEnabled: false,
        summariesTime: ''
      }
    });
  });

  it("sets user morning and evening digest values to hh:mm based on user's digest_configs and time_zone_id configs", async () => {
    useUserStore.mockImplementation((selector) => {
      const state = {
        user: {
          ...mockUser,
          time_zone_id: 'PST8PDT',
          digest_configs: { morning: { time_of_day: 640 } }
        }
      };
      return selector(state);
    });
    renderComponent();
    const buttonElement = screen.getByRole('button', { name: /Save Subscriptions/i });
    expect(buttonElement).toHaveAttribute('type', 'submit');
  });

  it('handles for submission on clicking Save Subscriptions', () => {
    const mockSubmit = vi.fn();
    mockUseForm({ handleSubmit: () => mockSubmit() });
    renderComponent();
    const buttonElement = screen.getByRole('button', { name: /Save Subscriptions/i });
    fireEvent.click(buttonElement);
    expect(mockSubmit).toHaveBeenCalled();
  });
});
