import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import PersonSummariesStats from '@components/person/person-summaries-stats.component';

describe('PersonSummariesStats', () => {
  const sectionHeaderProps = { firstName: 'John', type: 'Meetings', numOfDays: 90 };
  const summarySources = [
    { name: 'Zoom_Meeting', value: 1000 },
    { name: 'Teams_Meeting', value: 500 },
    { name: 'Slack_Digest', value: 200 }
  ];
  const defaultProps = { sectionHeaderProps, summarySources };

  it('renders the summaries section header', () => {
    render(<PersonSummariesStats {...defaultProps} />);
    expect(screen.getByText("John's Summaries")).toBeInTheDocument();
  });

  it('displays all source types in the chart', () => {
    render(<PersonSummariesStats {...defaultProps} />);
    expect(screen.getByAltText('Zoom Meeting')).toBeInTheDocument();
    expect(screen.getByAltText('Teams Meeting')).toBeInTheDocument();
    expect(screen.getByAltText('Slack Digest')).toBeInTheDocument();
  });

  it('shows correct summary counts for each source', () => {
    render(<PersonSummariesStats {...defaultProps} />);
    for (const source of summarySources) {
      const cleanedName = source.name.replace(/_/g, ' ');
      expect(screen.getByTestId(`source-${cleanedName}`)).toHaveTextContent(
        `${source.value} Summaries`
      );
    }
  });
});
