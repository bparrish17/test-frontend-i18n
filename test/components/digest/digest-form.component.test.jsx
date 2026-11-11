import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeAll, vi } from 'vitest';
import { FormProvider, useForm } from 'react-hook-form';
import { startOfDay } from 'date-fns';

import DigestForm from '@components/digest/digest-form.component';
import { useInitiativeOptions } from '@services/query-services/initiatives.query-service';
import { useDisclosure } from '@chakra-ui/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('date-fns');

vi.mock('@services/query-services/initiatives.query-service', () => ({
  useInitiativeOptions: vi.fn()
}));

vi.mock('@components/general/info-blurb.component', () => ({
  default: ({ title }) => <div>{title}</div>
}));

vi.mock('@components/general/form/custom-select.component', () => ({
  default: () => <div>Custom Select</div>
}));

vi.mock('@components/general/form/horizontal-radio.component', () => ({
  default: () => <div>Horizontal Radio</div>
}));

describe('DigestForm Component', () => {
  const mockOnSubmit = vi.fn();

  const WrappedCreateDigestForm = ({ defaultValues = { cadenceInterval: 'daily' } }) => {
    const form = useForm({ defaultValues });
    const parentDisclosure = useDisclosure();

    return (
      <MemoryRouter>
        <FormProvider {...form}>
          <DigestForm
            onSubmit={mockOnSubmit}
            sourceType='Slack'
            parentDisclosure={parentDisclosure}
          />
        </FormProvider>
      </MemoryRouter>
    );
  };

  beforeAll(() => {
    startOfDay.mockReturnValue(new Date());
    useInitiativeOptions.mockReturnValue({
      data: [
        { value: '1', label: 'Initiative 1' },
        { value: '2', label: 'Initiative 2' }
      ]
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('renders the component with the correct sourceType text', () => {
    render(<WrappedCreateDigestForm />);
    expect(
      screen.getByText('Summarize one or multiple Slack channels at once as a digest.')
    ).toBeInTheDocument();
  });

  it('displays the InfoBlurb when showAboutBlurb is true', () => {
    render(<WrappedCreateDigestForm />);
    expect(screen.getByText('About Slack Integration')).toBeInTheDocument();
  });

  it('has form with identifiers, frequency, title, and initiative form fields', () => {
    render(<WrappedCreateDigestForm />);
    const form = screen.getByTestId('create-digest-form');
    expect(form).toBeInTheDocument();
    const frequency = screen.getByText(/digest frequency/i);
    const title = screen.getByText(/digest title/i);
    const category = screen.getByText(/category/i);
    [frequency, title, category].forEach((el) => expect(el).toBeInTheDocument());
  });

  it('updates the displayed text based on the sourceType prop', async () => {
    const mockFormVal = {
      identifiers: [1234, 5678],
      name: 'digest title',
      cadenceInterval: 'daily',
      initiative: { value: '1', label: 'Initiative 1' }
    };
    render(<WrappedCreateDigestForm defaultValues={mockFormVal} />);
    const form = screen.getByTestId('create-digest-form');
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Test Digest' } });
    fireEvent.click(document.body); // fake input and blur to prep form for submission
    fireEvent.submit(form);
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        { ...mockFormVal, name: 'Test Digest' },
        expect.any(Object)
      );
    });
  });
});
