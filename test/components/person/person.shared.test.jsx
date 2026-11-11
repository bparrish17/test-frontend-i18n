import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PersonSectionHeader, DotSeparatedText } from '@components/person/person.shared.component';

describe('PersonSectionHeader', () => {
  it('renders with firstName and type', () => {
    render(
      <PersonSectionHeader
        firstName='John'
        type='Meetings'
        numOfDays={90}
      />
    );
    expect(screen.getByText("John's Meetings")).toBeInTheDocument();
    expect(screen.getByText('Past 90 days')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(
      <PersonSectionHeader
        title='Custom Section'
        numOfDays={90}
      />
    );
    expect(screen.getByText('Custom Section')).toBeInTheDocument();
  });

  it('renders with custom timeframe', () => {
    render(
      <PersonSectionHeader
        firstName='John'
        type='Meetings'
        timeframe='Last Week'
      />
    );
    expect(screen.getByText('Last Week')).toBeInTheDocument();
  });
});

describe('DotSeparatedText', () => {
  it('renders strings with dot separators', () => {
    render(<DotSeparatedText strings={['First Item', 'Second Item', 'Third Item']} />);
    expect(screen.getByText('First Item')).toBeInTheDocument();
    const dots = screen.getAllByText('•');
    expect(dots).toHaveLength(2);
  });

  it('handles empty strings array', () => {
    const { container } = render(<DotSeparatedText strings={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('handles single string', () => {
    render(<DotSeparatedText strings={['Single Item']} />);
    expect(screen.getByText('Single Item')).toBeInTheDocument();
    expect(screen.queryByText('•')).not.toBeInTheDocument();
  });

  it('applies custom text props', () => {
    const customClass = 'custom-text';
    render(
      <DotSeparatedText
        strings={['Test Item']}
        textProps={{ className: customClass }}
      />
    );
    const textElement = screen.getByText('Test Item');
    expect(textElement).toHaveClass(customClass);
  });
});
