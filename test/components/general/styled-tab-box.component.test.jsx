import StyledTabBox from '@components/general/styled-tab-box.component.jsx';

import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

describe('StyledTabBox Component', () => {
  it('renders children correctly', () => {
    render(<StyledTabBox>Test Tab</StyledTabBox>);
    expect(screen.getByText('Test Tab')).toBeInTheDocument();
  });

  it('applies custom styles based on props', () => {
    render(
      <StyledTabBox
        bgColor='red'
        color='green'
      >
        Styled Tab
      </StyledTabBox>
    );

    const tabBox = screen.getByText('Styled Tab');
    expect(tabBox).toHaveStyle({ 'background-color': 'rgb(255, 0, 0)', color: 'rgb(0, 128, 0)' });
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<StyledTabBox onClick={handleClick}>Clickable Tab</StyledTabBox>);

    const tabBox = screen.getByText('Clickable Tab');
    fireEvent.click(tabBox);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies additional props via tabProps', () => {
    render(<StyledTabBox tabProps={{ 'data-testid': 'styled-tab' }}>Test Tab</StyledTabBox>);
    expect(screen.getByTestId('styled-tab')).toBeInTheDocument();
  });
});
