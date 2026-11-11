import { describe, it, expect } from 'vitest';
import PersonStatsInline from '@components/person/person-stats-inline.component';

import { renderWithProviders } from '@test/test.helpers';
import { withinElementByTestId } from '@test/test.helpers';

describe('PersonStatsInline', () => {
  const withinComponent = withinElementByTestId('person-stats-inline');

  const mockProps = {
    firstName: 'John',
    isExternal: false,
    totalRecordedMeetings: 10,
    totalTime: '5 hours',
    orgId: '123',
    orgName: 'Test Corp',
    orgDomain: 'test.com',
    orgLogoUrl: 'https://example.com/logo.png',
    numOfDays: 90
  };

  it('renders basic stats correctly', () => {
    renderWithProviders(<PersonStatsInline {...mockProps} />);

    expect(withinComponent().getByText(/John/)).toBeInTheDocument();
    expect(withinComponent().getByText(/10 recorded meetings/)).toBeInTheDocument();
    expect(withinComponent().getByText(/Test Corp/)).toBeInTheDocument();
    expect(withinComponent().getByText(/90 days/)).toBeInTheDocument();
  });

  it('includes external context when isExternal is true', () => {
    renderWithProviders(
      <PersonStatsInline
        {...mockProps}
        isExternal={true}
      />
    );

    expect(withinComponent().getByText(/with your company/)).toBeInTheDocument();
  });

  it('renders organization link when org data is provided', () => {
    renderWithProviders(<PersonStatsInline {...mockProps} />);

    const link = withinComponent().getByRole('link');
    expect(link).toHaveAttribute('href', '/organization?domain=test.com&id=123');
  });
});
