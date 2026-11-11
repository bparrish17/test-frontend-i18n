import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import StyledLink from '@components/general/styled-link.component';

describe('StyledLink Component', () => {
  it('renders children correctly', () => {
    render(
      <BrowserRouter>
        <StyledLink to='/home'>Go to Home</StyledLink>
      </BrowserRouter>
    );

    // Check if the text "Go to Home" is rendered
    const linkElement = screen.getByText(/go to home/i);
    expect(linkElement).toBeInTheDocument();
  });

  it('applies the correct styles from Chakra UI', () => {
    render(
      <BrowserRouter>
        <StyledLink to='/home'>Go to Home</StyledLink>
      </BrowserRouter>
    );

    // Check if the link has the ChakraLink styles
    const linkElement = screen.getByText(/go to home/i);
    expect(linkElement).toHaveStyle('color: brandPrimary.primary');
    expect(linkElement).toHaveStyle('font-weight: 500');
    expect(linkElement).toHaveStyle('text-decoration: none');
  });

  it('passes the "to" prop to ReactRouterLink', () => {
    render(
      <BrowserRouter>
        <StyledLink to='/home'>Go to Home</StyledLink>
      </BrowserRouter>
    );

    const linkElement = screen.getByText(/go to home/i);

    // Check if the "to" prop is correctly passed to the underlying ReactRouterLink
    expect(linkElement.closest('a')).toHaveAttribute('href', '/home');
  });
});
