import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useApolloOrganizationsByDomains } from '@services/query-services/apollo.query-service';
import { EARNINGS_CALL_TOC_SECTIONS } from '@pages/earnings-call/earnings-call-detail.page';
import EarningsCallRightRail from '@pages/earnings-call/earnings-call-right-rail.component';

vi.mock('@services/query-services/apollo.query-service');

const mockBotEarningsCall = {
  company_name: 'Test Company',
  domain: 'test.com'
};

const mockBot = {
  earnings_call: mockBotEarningsCall
};

const mockApolloOrg = {
  id: '1',
  name: 'Apollo Org',
  industry: 'Technology',
  logo_url: 'https://example.com/logo.png'
};

describe('EarningsCallRightRail', () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false
      }
    }
  });

  const renderRightRail = (props = {}) =>
    render(
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <EarningsCallRightRail
            bot={mockBot}
            closestRefIndex={0}
            onSectionClick={vi.fn()}
            sections={EARNINGS_CALL_TOC_SECTIONS}
            {...props}
          />
        </BrowserRouter>
      </QueryClientProvider>
    );
  beforeEach(() => {
    useApolloOrganizationsByDomains.mockReturnValue({ data: mockApolloOrg });
  });

  it('renders correctly with expected sections', () => {
    renderRightRail();
    expect(screen.getByText('Table of Contents')).toBeInTheDocument();
    expect(screen.getByText('Summary')).toBeInTheDocument();
    expect(screen.getByText('Topic Analysis')).toBeInTheDocument();
    expect(screen.getByText('Meeting Timeline')).toBeInTheDocument();
    expect(screen.getByText('Apollo Org')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('calls onSectionClick when a section is clicked', () => {
    const onSectionClick = vi.fn();
    renderRightRail({ onSectionClick });
    fireEvent.click(screen.getByText('Summary'));
    expect(onSectionClick).toHaveBeenCalledWith(0);
    fireEvent.click(screen.getByText('Topic Analysis'));
    expect(onSectionClick).toHaveBeenCalledWith(1);
    fireEvent.click(screen.getByText('Insights'));
    expect(onSectionClick).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByText('Meeting Timeline'));
    expect(onSectionClick).toHaveBeenCalledWith(3);
  });

  it('renders organization name and industry correctly', () => {
    renderRightRail();
    expect(screen.getByText('Apollo Org')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('renders company name if apollo organization is not available', () => {
    useApolloOrganizationsByDomains.mockReturnValue({ data: null, isLoading: false });
    renderRightRail();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
  });
});
