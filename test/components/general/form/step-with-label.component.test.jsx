import { render, screen } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import { describe, it, expect } from 'vitest';

import StepWithLabelComponent from '@components/general/form/step-with-label.component';

function renderWithChakra(ui) {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
}

describe('StepWithLabelComponent', () => {
  it('renders the label text', () => {
    renderWithChakra(
      <StepWithLabelComponent
        label='Test Label'
        name='test'
        fieldState={{}}
      >
        <div>Child content</div>
      </StepWithLabelComponent>
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders children content', () => {
    renderWithChakra(
      <StepWithLabelComponent
        label='Label'
        name='test'
        fieldState={{}}
      >
        <div>Child content</div>
      </StepWithLabelComponent>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('shows error message when fieldState.error is present', () => {
    renderWithChakra(
      <StepWithLabelComponent
        label='Label'
        name='test'
        fieldState={{
          invalid: true,
          error: { message: 'This field is required' }
        }}
      >
        <input />
      </StepWithLabelComponent>
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders labelChildren if provided', () => {
    renderWithChakra(
      <StepWithLabelComponent
        label='Label'
        name='test'
        fieldState={{}}
        labelChildren={<span data-testid='extra-label'>Extra</span>}
      >
        <input />
      </StepWithLabelComponent>
    );
    expect(screen.getByTestId('extra-label')).toBeInTheDocument();
  });
});
