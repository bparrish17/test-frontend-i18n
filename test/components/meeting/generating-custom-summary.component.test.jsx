import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { act } from 'react-dom/test-utils';
// import userEvent from '@testing-library/user-event';
import GeneratingCustomSummary from '@components/meeting/generating-custom-summary.component';

describe('GeneratingCustomSummary Component', () => {
  beforeEach(() => {
    vi.useFakeTimers(); // Use fake timers to control setInterval
  });

  afterEach(() => {
    vi.clearAllTimers(); // Clear timers after each test
    vi.restoreAllMocks(); // Restore original implementations
  });

  it('renders the component with all elements', () => {
    render(<GeneratingCustomSummary />);

    expect(screen.getByText(/Generating\.\.\./)).toBeInTheDocument();
    expect(
      screen.getByText(/Your custom summary will be available to view in a few minutes or less/)
    ).toBeInTheDocument();
    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow', '0'); // Progress bar starts at 0
  });

  it('increments the progress value over time', async () => {
    render(<GeneratingCustomSummary />);

    const progressBar = screen.getByRole('progressbar');

    // Initially, the progress value should be 0
    expect(progressBar).toHaveAttribute('aria-valuenow', '0');

    // Wrap timer advancement in act()
    await act(() => {
      vi.advanceTimersByTime(1000); // Advance the timer by 1 second
    });

    // Calculate expected progress
    const expectedProgress = (100 * 1000) / (2 * 60 * 1000);

    // Wait for the DOM to update with the expected progress
    const actualProgress = parseFloat(progressBar.getAttribute('aria-valuenow'));
    expect(actualProgress).toBeCloseTo(expectedProgress, 2);
  });

  it('cleans up the interval when unmounted', () => {
    const { unmount } = render(<GeneratingCustomSummary />);

    // Check there is an active timer
    expect(vi.getTimerCount()).toBe(1);

    // Unmount the component
    unmount();

    // Check the timer is cleared
    expect(vi.getTimerCount()).toBe(0);
  });
});
