import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { useForm, FormProvider } from 'react-hook-form';

import ContentTypeFilter, {
  contentTypeFilterOptions
} from '@components/create-lens/create-lens-form-filters/content-type-filter.component';

const Wrapper = (props) => {
  const { control, ...methods } = useForm({ defaultValues: {} });
  return (
    <FormProvider {...methods}>
      <ContentTypeFilter
        control={control}
        {...props}
      />
    </FormProvider>
  );
};

describe('ContentTypeFilter', () => {
  it('renders without errors', () => {
    render(<Wrapper />);
    expect(screen.getByText('Content Types')).toBeInTheDocument();
  });

  it('displays all checkbox for non-Earnings Call options', () => {
    render(<Wrapper />);
    contentTypeFilterOptions()
      .slice(0, -1)
      .forEach((option) => {
        expect(screen.getByLabelText(option.label)).toBeInTheDocument();
      });
  });

  it('displays all checkbox for Earnings Call option', () => {
    render(<Wrapper />);
    expect(screen.getByText('Earnings Calls')).toBeInTheDocument();
    expect(screen.getByText('• This may contain external sources of data')).toBeInTheDocument();
  });

  it('handles selection of checkboxes', () => {
    render(<Wrapper />);
    const checkbox = screen.getByLabelText('Meetings');
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it('should display error text if present', () => {
    const message = "you didn't select any options ya silly goose";
    render(<Wrapper error={{ message }} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });
});
