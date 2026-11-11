import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';

import LabelsFilter from '@components/create-lens/create-lens-form-filters/labels-filter.component';

const Wrapper = (props) => {
  const { control, watch, ...methods } = useForm({ defaultValues: {} });
  return (
    <FormProvider {...methods}>
      <LabelsFilter
        control={control}
        watch={watch}
        setValue={vi.fn()}
        {...props}
      />
    </FormProvider>
  );
};

vi.mock('@components/general/labels/label-select.component', () => ({
  default: () => <div data-testid='label-select' />
}));

describe('LabelsFilter', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders with expected text and description', () => {
    render(<Wrapper />);
    expect(screen.getByText('Labels')).toBeInTheDocument();
    expect(screen.getByText('Select relevant tags to focus on')).toBeInTheDocument();
  });

  it('displays label selector', () => {
    render(<Wrapper />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByTestId('label-select')).toBeInTheDocument();
  });

  it('sets original value from labelsCache if checkbox is on', async () => {
    const fakeLabels = [{ id: '123', title: 'fake-label1' }];
    const mockSetValue = vi.fn();
    render(
      <Wrapper
        watch={() => fakeLabels}
        setValue={mockSetValue}
      />
    );
    fireEvent.click(screen.getByRole('checkbox')); // flip off then back on to mimic user interaction
    fireEvent.click(screen.getByRole('checkbox'));
    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('filters.labels', fakeLabels, {
        shouldDirty: true
      });
    });
  });
});
