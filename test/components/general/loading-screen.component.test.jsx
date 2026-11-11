import { render, act, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import LoadingScreen from '@components/general/loading-screen.component';

describe('LoadingScreen', () => {
  const title = 'Test Title';
  it('shows loading text', () => {
    const { getByText } = render(<LoadingScreen />);
    expect(getByText('Loading')).toBeInTheDocument();
  });

  it('displays title when provided', () => {
    const { getByText } = render(<LoadingScreen title={title} />);
    expect(getByText(title)).toBeInTheDocument();
  });

  it('fades in title with animation', async () => {
    const { getByText } = render(<LoadingScreen title={title} />);

    const titleContainer = getByText(title).closest('div');
    expect(titleContainer).toHaveStyle({
      opacity: '0'
    });

    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
    });

    expect(titleContainer).toHaveStyle({
      opacity: '1'
    });
  });

  it('handles window resize', async () => {
    const addEventListenerSpy = vi.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');

    const { unmount } = render(<LoadingScreen title='Test' />);

    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));

    fireEvent(window, new Event('resize'));

    unmount();
    expect(removeEventListenerSpy).toHaveBeenCalled();
  });
});
