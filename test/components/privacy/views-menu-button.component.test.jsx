import { Menu } from '@chakra-ui/react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';

import ViewsMenuButton from '@components/privacy/views-menu-button.component';

vi.mock('@assets/icons', async (original) => ({
  ...(await original()),
  SFEyeIcon: vi.fn(() => <div data-testid='eye-icon' />)
}));

describe('ViewsMenuButton', () => {
  const mockDisclosure = {
    isOpen: false,
    onToggle: vi.fn()
  };

  const mockViews = [
    {
      id: 'zack@fora.day',
      name: 'Zack Elias',
      avatar_url:
        'https://lh3.google.com/ao/AHP4FtkloTguZHutZlebR1y5dXkjYpb-ouBXuVq_LGigG1UKcyzYrYBntImoSe1E6og_Vi8c=s96-c',
      count: 4,
      created_at: 1734708575015
    },
    {
      id: 'vinnie@fora.day',
      name: 'Vinnie Vendemia',
      avatar_url:
        'https://lh3.googleusercontent.com/a/ACg8ocLKIfZNxrfZq05I7i3vFlZedJNgt4ZJsp5CM1gt48x3Ct_nIaM=s96-c',
      count: 2,
      created_at: 1734709328350
    },
    {
      id: 'shared-user@gmail.com',
      count: 2,
      created_at: 1734709183675
    }
  ];

  it('renders the eye icon', () => {
    render(
      <Menu>
        <ViewsMenuButton
          disclosure={mockDisclosure}
          isLoading={false}
          views={mockViews}
        />
      </Menu>
    );

    expect(screen.getByTestId('eye-icon')).toBeInTheDocument();
  });

  it('renders a spinner when isLoading is true', () => {
    render(
      <Menu>
        <ViewsMenuButton
          disclosure={mockDisclosure}
          isLoading
          views={mockViews}
        />
      </Menu>
    );

    expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
    expect(screen.queryByText(/totalPeopleWithAccess/i)).not.toBeInTheDocument();
  });

  it('displays the total views when isLoading is false', () => {
    render(
      <Menu>
        <ViewsMenuButton
          disclosure={mockDisclosure}
          isLoading={false}
          views={mockViews}
        />
      </Menu>
    );

    expect(screen.getByText('8')).toBeInTheDocument();
    expect(document.querySelector('.chakra-spinner')).not.toBeInTheDocument();
  });

  it('displays 1 when total_views is 0', () => {
    render(
      <Menu>
        <ViewsMenuButton
          disclosure={mockDisclosure}
          isLoading={false}
          views={[]}
        />
      </Menu>
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(document.querySelector('.chakra-spinner')).not.toBeInTheDocument();
  });

  it('calls disclosure.onToggle when clicked', () => {
    render(
      <Menu>
        <ViewsMenuButton
          disclosure={mockDisclosure}
          isLoading={false}
          views={mockViews}
        />
      </Menu>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockDisclosure.onToggle).toHaveBeenCalledTimes(1);
  });
});
