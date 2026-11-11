import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi } from 'vitest';
import InDevelopmentRoute from '@routes/in-development.route-guard';

const mockClient = {
  checkGate: vi.fn()
};

// Mock dependencies
vi.mock('@statsig/react-bindings', () => ({
  useStatsigClient: () => ({ checkGate: mockClient.checkGate })
}));

const mockToast = vi.fn();
vi.mock('@util/hooks', () => ({
  useStyledToast: () => mockToast
}));

describe('InDevelopmentRoute', () => {
  const TestComponent = () => <div>Test Component</div>;
  const FallbackComponent = () => <div>Fallback Component</div>;

  const renderWithRouter = ({ gateName }) => {
    return render(
      <MemoryRouter initialEntries={['/test']}>
        <Routes>
          <Route
            element={
              <InDevelopmentRoute
                gateName={gateName}
                fallbackComponent={FallbackComponent}
              />
            }
          >
            <Route
              path='/test'
              element={<TestComponent />}
            />
          </Route>
        </Routes>
      </MemoryRouter>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockClient.checkGate.mockReset();
  });

  it('should render fallback when no gate name is provided', () => {
    renderWithRouter({});

    expect(screen.getByText('Fallback Component')).toBeInTheDocument();
    expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
  });

  it('should render fallback when feature is disabled', () => {
    mockClient.checkGate.mockReturnValue(false);

    renderWithRouter({ gateName: 'test-gate' });

    expect(screen.getByText('Fallback Component')).toBeInTheDocument();
    expect(screen.queryByText('Test Component')).not.toBeInTheDocument();
  });

  it('should render outlet content when feature is enabled', () => {
    mockClient.checkGate.mockReturnValue(true);

    renderWithRouter({ gateName: 'test-gate' });

    expect(screen.getByText('Test Component')).toBeInTheDocument();
    expect(screen.queryByText('Fallback Component')).not.toBeInTheDocument();
  });

  it('should check gate with correct name', () => {
    mockClient.checkGate.mockReturnValue(true);

    renderWithRouter({ gateName: 'test-gate' });

    expect(mockClient.checkGate).toHaveBeenCalledWith('test-gate');
  });
});
