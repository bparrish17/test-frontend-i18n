import { render, screen } from '@testing-library/react';
import { expect } from 'vitest';
import userEvent from '@testing-library/user-event';

import Label from '@components/general/labels/label.component';
import { useBreakpoints } from '@util/hooks';

vi.mock('@util/hooks', () => ({
  useBreakpoints: vi.fn()
}));

describe('Label', () => {
  const mockOnRemove = vi.fn();
  const mockLabel = {
    title: 'title',
    description: 'description'
  };

  const mockLabelProps = {
    label: mockLabel,
    isEditing: false,
    onRemove: mockOnRemove,
    match: 'Manual'
  };

  beforeEach(() => {
    useBreakpoints.mockReturnValue({ isDesktop: true });
  });

  it('renders variant for manually applied labels', () => {
    render(<Label {...mockLabelProps} />);
    const aiLabel = screen.queryByTestId('ai-label-icon');
    expect(aiLabel).not.toBeInTheDocument();
  });

  it('renders variant for manually applied labels', () => {
    render(
      <Label
        {...mockLabelProps}
        match='Auto'
      />
    );
    const aiLabel = screen.queryByTestId('ai-label-icon');
    expect(aiLabel).toBeInTheDocument();
  });

  it('renders Remove button and disables tooltip when editing', async () => {
    const user = userEvent.setup();
    render(<Label isEditing />);
    const labelContainer = screen.getByTestId('label-container');
    await user.click(labelContainer);

    expect(screen.queryByTestId('label-tooltip')).not.toBeInTheDocument();
    expect(screen.getByTestId('label-remove-button')).toBeInTheDocument();
  });

  describe('LabelTooltip', async () => {
    it('is rendered on click on desktop', async () => {
      const user = userEvent.setup();
      render(<Label {...mockLabelProps} />);

      const labelContainer = screen.getByTestId('label-container');
      await user.click(labelContainer);

      const aiLabel = screen.getByTestId('label-tooltip-ai-label');
      expect(aiLabel).toBeInTheDocument();
    });

    it('is disabled on mobile', async () => {
      const user = userEvent.setup();
      useBreakpoints.mockReturnValue({ isDesktop: false });
      render(<Label {...mockLabelProps} />);

      const labelContainer = screen.getByTestId('label-container');
      await user.click(labelContainer);

      const aiLabel = screen.queryByTestId('label-tooltip-ai-label');
      expect(aiLabel).not.toBeInTheDocument();
    });
  });
});
