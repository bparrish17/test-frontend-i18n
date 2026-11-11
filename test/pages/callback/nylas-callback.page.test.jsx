import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import NylasService from '@services/nylas.service';
import NylasCallbackPage from '@pages/callback/nylas-callback.page';
import { addDigestConfigToNewUser } from '@util/helpers/person.helpers';

// Mocks
vi.mock('@rollbar/react', () => ({ useRollbar: () => ({ error: vi.fn() }) }));
vi.mock('@util/hooks', () => ({
  useStyledToast: () => vi.fn(),
  useInvalidateQueries: () => vi.fn(),
  usePusherChannel: () => ({ channel: 'mock-channel' }),
  usePusherEvent: vi.fn(),
  useTimeout: vi.fn()
}));
vi.mock('@store/app.store', () => ({
  useUserStore: () => ({ id: '123' })
}));
vi.mock('@util/helpers/person.helpers', () => ({
  addDigestConfigToNewUser: vi.fn()
}));

describe('<NylasCallbackPage />', () => {
  let registerWithBackendMock;

  beforeEach(() => {
    vi.resetAllMocks();

    registerWithBackendMock = vi.fn(() => Promise.resolve({ id: 'grant-id-xyz' }));
    NylasService.prototype.registerWithBackend = registerWithBackendMock;
  });

  it('renders the loading text', () => {
    render(<NylasCallbackPage />, { wrapper: MemoryRouter });
    expect(screen.getByText('Connecting Your Calendar...')).toBeInTheDocument();
  });

  it('calls registerWithBackend when code and user are present', async () => {
    render(
      <MemoryRouter initialEntries={['/callback?code=testcode']}>
        <Routes>
          <Route
            path='/callback'
            element={<NylasCallbackPage />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(registerWithBackendMock).toHaveBeenCalledWith('testcode');
    });
  });

  it('calls addDigestConfigToNewUser when code and user are present', async () => {
    render(
      <MemoryRouter initialEntries={['/callback?code=testcode']}>
        <Routes>
          <Route
            path='/callback'
            element={<NylasCallbackPage />}
          />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(addDigestConfigToNewUser).toHaveBeenCalledWith({ id: '123' });
    });
  });
});
