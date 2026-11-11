import { describe, it, expect, beforeEach, beforeAll, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Topics from '@components/meeting/topics.component';

vi.mock('@util/hooks', () => ({
  translateSentiment: vi.fn().mockReturnValue({
    bgColor: '#test',
    color: '#test',
    copy: 'Neutral'
  })
}));

const mockTopics = [
  {
    title: 'Topic 1',
    strategic_vs_tactical: 'strategic',
    sentiment: 'positive',
    details: 'Details 1'
  },
  {
    title: 'Topic 2',
    strategic_vs_tactical: 'tactical',
    sentiment: 'negative',
    details: 'Details 2'
  }
];

const mockSection = {
  enabled: true,
  name: 'Topic Analysis'
};

describe('MeetingTopics', () => {
  beforeAll(() => {
    window.scrollTo = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders topic list with correct initial state', () => {
    render(
      <Topics
        topics={mockTopics}
        section={mockSection}
      />
    );

    expect(screen.getByText('Topic Analysis')).toBeTruthy();
    expect(screen.getByText('Topics')).toBeTruthy();
    expect(screen.getByText('Type')).toBeTruthy();
    expect(screen.getByText('Sentiment')).toBeTruthy();
  });
});
