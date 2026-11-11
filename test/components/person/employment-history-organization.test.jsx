import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import EmploymentHistoryOrganization from '@components/person/employment-history-organization.component';
import { BrowserRouter } from 'react-router-dom';

describe('EmploymentHistoryOrganization', () => {
  const mockEmploymentHistoryOrg = {
    organization: {
      id: '123',
      name: 'Test Company',
      industry: 'technology',
      logo_url: 'https://example.com/logo.png'
    },
    positions: [
      {
        title: 'Software Engineer',
        start_date: '2020-01-01',
        end_date: '2021-01-01',
        current: false
      },
      {
        title: 'Senior Engineer',
        start_date: '2021-01-01',
        end_date: null,
        current: true
      }
    ]
  };

  it('renders organization information correctly', () => {
    render(
      <BrowserRouter>
        <EmploymentHistoryOrganization employmentHistoryOrg={mockEmploymentHistoryOrg} />
      </BrowserRouter>
    );

    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByText('Senior Engineer')).toBeInTheDocument();
  });

  it('renders organization link when ID is provided', () => {
    render(
      <BrowserRouter>
        <EmploymentHistoryOrganization employmentHistoryOrg={mockEmploymentHistoryOrg} />
      </BrowserRouter>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/organizations/123');
  });

  it('does not render organization link when ID is not provided', () => {
    const orgWithoutId = {
      ...mockEmploymentHistoryOrg,
      organization: {
        ...mockEmploymentHistoryOrg.organization,
        id: null
      }
    };

    render(
      <BrowserRouter>
        <EmploymentHistoryOrganization employmentHistoryOrg={orgWithoutId} />
      </BrowserRouter>
    );

    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});
