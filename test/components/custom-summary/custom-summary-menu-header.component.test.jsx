import { render, screen } from '@testing-library/react';

import CustomSummaryMenuHeader from '@components/custom-summary/custom-summary-menu-header.component';

describe('CustomSummaryMenuHeader', () => {
  it('renders the heading and subtext correctly', () => {
    render(
      <CustomSummaryMenuHeader
        heading='Test Heading'
        subtext='Test Subtext'
      />
    );

    // Check that the heading is rendered
    const heading = screen.getByText('Test Heading');
    expect(heading).toBeInTheDocument();

    // Check that the subtext is rendered
    const subtext = screen.getByText('Test Subtext');
    expect(subtext).toBeInTheDocument();
    expect(subtext).toHaveStyle('color: surface.onSurfaceVariant');
  });

  it('renders the icon when provided', () => {
    const IconMock = () => <svg data-testid='mock-icon'></svg>;

    render(
      <CustomSummaryMenuHeader
        icon={<IconMock />}
        heading='Test Heading'
        subtext='Test Subtext'
      />
    );

    // Check that the icon is rendered
    const icon = screen.getByTestId('mock-icon');
    expect(icon).toBeInTheDocument();
  });

  it('does not render the icon when not provided', () => {
    render(
      <CustomSummaryMenuHeader
        heading='Test Heading'
        subtext='Test Subtext'
      />
    );

    // Ensure the icon is not rendered
    const icon = screen.queryByTestId('mock-icon');
    expect(icon).not.toBeInTheDocument();
  });

  it('renders the correct structure of HStack and VStack', () => {
    render(
      <CustomSummaryMenuHeader
        heading='Test Heading'
        subtext='Test Subtext'
      />
    );

    // Check the main container
    const hStack = document.querySelector('.chakra-stack');
    expect(hStack).toBeInTheDocument();

    // Check for VStack inside
    const vStack = hStack.querySelector('.chakra-stack');
    expect(vStack).toBeInTheDocument();
  });
});
