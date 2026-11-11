import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import RingCentralCallbackPage from '@pages/callback/ringcentral-callback.page';

// Mocks
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ search: '?code=123' })
}));

const mockToast = vi.fn();
vi.mock('@util/hooks', () => ({
  useStyledToast: () => mockToast
}));

const mockMutateAsync = vi.fn();
vi.mock('@services/query-services/lambda.query-service', () => ({
  useRingCentralOauth: () => ({
    mutateAsync: mockMutateAsync
  })
}));

vi.mock('@store/app.store', () => ({
  useUserStore: (fn) => fn({ user: { tenants: [{ id: 'tenant-1' }] } })
}));

// Silence the loader import (not tested here)
vi.mock('@components/general/loader/full-page-loader.component', () => ({
  default: ({ children }) => <div>{children}</div>
}));

describe('RingCentralCallbackPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loader and connecting text', () => {
    render(<RingCentralCallbackPage />);
    expect(screen.getByText('Connecting Your RingCentral Account...')).toBeInTheDocument();
  });

  it('calls RingCentral OAuth flow when code and user exist', async () => {
    mockMutateAsync.mockResolvedValueOnce({});

    render(<RingCentralCallbackPage />);

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith(
        { code: '123', tenantId: 'tenant-1' },
        expect.any(Object) // The options object with onSuccess/onError
      );
    });
  });

  it('shows success toast on success', async () => {
    mockMutateAsync.mockImplementationOnce((_, opts) => {
      opts.onSuccess();
      return Promise.resolve();
    });

    render(<RingCentralCallbackPage />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'RingCentral connected successfully.',
          status: 'success'
        })
      );
    });
  });

  it('shows error toast on failure', async () => {
    mockMutateAsync.mockImplementationOnce((_, opts) => {
      opts.onError();
      return Promise.resolve();
    });

    render(<RingCentralCallbackPage />);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'error',
          title: 'Something went wrong. You might already have RingCentral connected.'
        })
      );
    });
  });
});
