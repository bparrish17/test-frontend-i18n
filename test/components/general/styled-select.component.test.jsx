import { render, screen, fireEvent, within } from '@testing-library/react';

import StyledSelect from '@components/general/styled-select.component.jsx';
import { CheckIconBold } from '@assets/icons';

describe('StyledSelect', () => {
  const options = [
    { value: 'one', label: 'Option One', icon: <span data-testid='icon-one'>1</span> },
    { value: 'two', label: 'Option Two', icon: <span data-testid='icon-two'>2</span> }
  ];
  const placeholder = 'Select an option';

  it('renders with placeholder when no value is selected', () => {
    render(
      <StyledSelect
        options={options}
        placeholder={placeholder}
        value={undefined}
        onChange={() => {}}
      />
    );
    expect(screen.getByText(placeholder)).toBeInTheDocument();
  });

  it('renders selectLabel if provided', () => {
    render(
      <StyledSelect
        options={options}
        placeholder={placeholder}
        selectLabel='Test Label'
        value={undefined}
        onChange={() => {}}
      />
    );
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders selected option label and icon', () => {
    render(
      <StyledSelect
        options={options}
        placeholder={placeholder}
        value='two'
        onChange={() => {}}
        menuListProps={{ 'data-testid': 'menu-list' }}
      />
    );

    const menuList = screen.queryByTestId('menu-list');
    expect(within(menuList).getByText('Option Two')).toBeInTheDocument();
    expect(within(menuList).getByTestId('icon-two')).toBeInTheDocument();
  });

  it('calls onChange when an option is clicked', () => {
    const handleChange = vi.fn();
    render(
      <StyledSelect
        options={options}
        placeholder={placeholder}
        value={undefined}
        onChange={handleChange}
      />
    );
    // Open the menu
    fireEvent.click(screen.getByRole('button'));
    // Click the first option
    fireEvent.click(screen.getByText('Option One'));
    expect(handleChange).toHaveBeenCalledWith('one');
  });

  it('shows check icon for selected option', () => {
    render(
      <StyledSelect
        options={options}
        placeholder={placeholder}
        value='one'
        onChange={() => {}}
        menuButtonProps={{ 'data-testid': 'menu-button' }}
      />
    );
    // Open the menu
    fireEvent.click(screen.getByRole('button'));

    const menuButton = screen.queryByTestId('menu-button');
    expect(within(menuButton).getByTestId('icon-one')).toBeInTheDocument();
  });
});
