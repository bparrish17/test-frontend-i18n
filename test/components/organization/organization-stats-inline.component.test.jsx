import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';

import { withinElementByTestId } from '@test/test.helpers';
import OrganizationStatsInline from '@components/organization/organization-stats-inline.component';

describe('OrganizationStatsInline', () => {
  const withinComponent = withinElementByTestId('organization-stats-inline');

  it('renders organization name', () => {
    render(
      <OrganizationStatsInline
        totalRecordedMeetings={5}
        totalTime='3 days'
        orgName='Acme Corp'
        numOfDays={90}
        isExternal={true}
      />
    );

    const orgName = withinComponent().getByText('Acme Corp');
    expect(orgName).toBeInTheDocument();
  });

  it('renders total recorded meetings count', () => {
    render(
      <OrganizationStatsInline
        totalRecordedMeetings={5}
        totalTime='3 days'
        orgName='Acme Corp'
        numOfDays={90}
        isExternal={true}
      />
    );

    const meetingsCount = withinComponent().getByText('5 recorded meetings');
    expect(meetingsCount).toBeInTheDocument();
  });

  it('includes "with your company" when isExternal is true', () => {
    render(
      <OrganizationStatsInline
        totalRecordedMeetings={5}
        totalTime='3 days'
        orgName='Acme Corp'
        numOfDays={90}
        isExternal={true}
      />
    );

    expect(screen.getByText(/with your company/)).toBeInTheDocument();
  });

  it('omits "with your company" when isExternal is false', () => {
    render(
      <OrganizationStatsInline
        totalRecordedMeetings={5}
        totalTime='3 days'
        orgName='Acme Corp'
        numOfDays={90}
        isExternal={false}
      />
    );

    const textElement = withinComponent().getByText(/in the past 90 days/);
    expect(textElement.textContent).not.toContain('with your company');
  });

  it('renders the number of days correctly', () => {
    render(
      <OrganizationStatsInline
        totalRecordedMeetings={5}
        totalTime='3 days'
        orgName='Acme Corp'
        numOfDays={30}
        isExternal={true}
      />
    );

    expect(withinComponent().getByText(/in the past 30 days/)).toBeInTheDocument();
  });

  it('renders the total time (last met ago) correctly', () => {
    render(
      <OrganizationStatsInline
        totalRecordedMeetings={5}
        totalTime='3 days'
        orgName='Acme Corp'
        numOfDays={90}
        isExternal={true}
      />
    );

    expect(withinComponent().getByText(/last met 3 days ago/)).toBeInTheDocument();
  });

  it('formats complete sentence properly', () => {
    render(
      <OrganizationStatsInline
        totalRecordedMeetings={10}
        totalTime='1 week'
        orgName='Test Company'
        numOfDays={60}
        isExternal={true}
      />
    );

    // Check main container text has appropriate styling
    const mainContainer = withinComponent()
      .getByText('Test Company', { exact: false })
      .closest('div');

    // Verify text content forms a coherent sentence
    expect(mainContainer).toHaveTextContent(
      'Test Company has had 10 recorded meetings with your company in the past 60 days. You last met 1 week ago.'
    );
  });

  it('handles singular meeting correctly', () => {
    render(
      <OrganizationStatsInline
        totalRecordedMeetings={1}
        totalTime='1 day'
        orgName='Single Meeting Corp'
        numOfDays={90}
        isExternal={true}
      />
    );

    expect(withinComponent().getByText('1 recorded meeting')).toBeInTheDocument();
  });

  it('handles plural meetings correctly', () => {
    const { rerender } = render(
      <OrganizationStatsInline
        totalRecordedMeetings={5}
        totalTime='3 days'
        orgName='Style Corp'
        numOfDays={90}
        isExternal={true}
      />
    );

    expect(withinComponent().getByText('5 recorded meetings')).toBeInTheDocument();
    rerender(
      <OrganizationStatsInline
        totalRecordedMeetings={5}
        totalTime='3 days'
        orgName='Style Corp'
        numOfDays={90}
        isExternal={true}
      />
    );

    const orgName = withinComponent().getByText('Style Corp');
    expect(orgName).toBeInTheDocument();

    const meetingsCount = withinComponent().getByText('5 recorded meetings');
    expect(meetingsCount).toBeInTheDocument();
  });
});
