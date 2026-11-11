import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithProviders } from '@test/test.helpers';

import ShareSummaryForm from '@components/share-summary/share-summary-form.component.jsx';

vi.mock('@services/query-services/people.query-service', () => ({
  usePeople: () => ({ data: [] })
}));

vi.mock('@components/general/form/custom-select.component.jsx', () => ({
  default: ({ onChange, value }) => (
    <div>
      <div data-testid='mock-custom-select'>{JSON.stringify(value)}</div>
      <button
        data-testid='add-mock-value'
        onClick={() => onChange([{ id: '1', name: 'Test User', email: 'test@example.com' }])}
      >
        Add Value
      </button>
    </div>
  )
}));

describe('ShareSummaryForm', () => {
  const attendees = [
    { email: 'test@example.com' },
    { email: 'alice@example.com' },
    { email: 'bob@example.com' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderForm = (props = {}) => {
    const onSubmit = vi.fn();
    renderWithProviders(
      <ShareSummaryForm
        isPDF={false}
        attendees={attendees}
        onSubmit={onSubmit}
        {...props}
      >
        <button type='submit'>Submit</button>
      </ShareSummaryForm>
    );

    return { onSubmit };
  };

  it('renders the Add attendees button when attendees exist', () => {
    renderForm();

    expect(screen.getByTestId('all-attendees-button')).toBeInTheDocument();
  });

  it('does not render the Add attendees button when no attendees provided', () => {
    renderForm({ attendees: [] });

    expect(screen.queryByTestId('all-attendees-button')).not.toBeInTheDocument();
  });

  it('updates recipients when a value is added to the custom select', () => {
    const { onSubmit } = renderForm();

    // Initially no recipients
    expect(screen.getByTestId('mock-custom-select')).toHaveTextContent('');

    // Simulate adding a value via mock button
    fireEvent.click(screen.getByTestId('add-mock-value'));

    // The value should appear
    expect(screen.getByTestId('mock-custom-select')).toHaveTextContent('test@example.com');
  });

  it('adds all attendees when the "all attendees" button is clicked', () => {
    const { onSubmit } = renderForm();

    // add the mock value, then all attendees to ensure data is appended
    fireEvent.click(screen.getByTestId('add-mock-value'));
    expect(screen.getByTestId('mock-custom-select')).toHaveTextContent('test@example.com');

    fireEvent.click(screen.getByTestId('all-attendees-button'));

    const valueText = JSON.parse(screen.getByTestId('mock-custom-select').textContent);

    // Does not duplicate test@example.com, since it's already in the list
    expect(valueText.length).toBe(3);

    // Should now have all 3.  Notice value 0 comes from the add-mock-value
    // and does not have the custom-attendee id
    expect(valueText[0]).toEqual({ id: '1', name: 'Test User', email: 'test@example.com' });
    expect(valueText[1]).toEqual({
      id: 'custom-attendee-alice@example.com',
      name: 'alice@example.com',
      email: 'alice@example.com'
    });
    expect(valueText[2]).toEqual({
      id: 'custom-attendee-bob@example.com',
      name: 'bob@example.com',
      email: 'bob@example.com'
    });
  });
});
