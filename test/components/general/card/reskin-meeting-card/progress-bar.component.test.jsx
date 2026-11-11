import { render, screen } from '@testing-library/react';

import ProgressBar from '@components/general/card/reskin-meeting-card/progress-bar.component';
import { seconds } from '@util/helpers';

describe('ProgressBar Component', () => {
  const defaultProps = {
    elapsedTime: seconds(120),
    isDone: false,
    isStartingRecording: false,
    botWasScheduled: true,
    isOnPause: false,
    progress: 0.5 // 50%
  };

  test('renders correctly with valid props', () => {
    render(<ProgressBar {...defaultProps} />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('2 min')).toBeInTheDocument();
    expect(document.querySelector('.chakra-icon')).toBeInTheDocument();
  });

  test('returns null when elapsedTime is 0', () => {
    const { container } = render(
      <ProgressBar
        {...defaultProps}
        elapsedTime={0}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('returns null when elapsedTime is NaN', () => {
    const { container } = render(
      <ProgressBar
        {...defaultProps}
        elapsedTime={NaN}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('returns null when elapsedTime is undefined', () => {
    const { container } = render(
      <ProgressBar
        {...defaultProps}
        elapsedTime={undefined}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('returns null when elapsedTime is negative', () => {
    const { container } = render(
      <ProgressBar
        {...defaultProps}
        elapsedTime={-1}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('returns null when isDone is true', () => {
    const { container } = render(
      <ProgressBar
        {...defaultProps}
        isDone
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('returns null when isStartingRecording is true', () => {
    const { container } = render(
      <ProgressBar
        {...defaultProps}
        isStartingRecording
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('returns null when botWasScheduled is false', () => {
    const { container } = render(
      <ProgressBar
        {...defaultProps}
        botWasScheduled={false}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  test('displays "< 1 min" when elapsedTime is less than 60 seconds', () => {
    render(
      <ProgressBar
        {...defaultProps}
        elapsedTime={seconds(30)}
      />
    );
    expect(screen.getByText('< 1 min')).toBeInTheDocument();
  });

  test('progress bar has correct value', () => {
    render(<ProgressBar {...defaultProps} />);
    const progressBar = screen.getByRole('progressbar');

    expect(progressBar).toHaveAttribute('aria-valuenow', '50'); // Progress is 50% (0.5 * 100)
  });
});
