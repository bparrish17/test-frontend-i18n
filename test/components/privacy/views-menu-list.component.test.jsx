import { Menu } from '@chakra-ui/react';
import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import ViewsMenuList from '@components/privacy/views-menu-list.component';

vi.mock('@components/privacy/views-share-card.component', () => ({
  default: ({ view }) => <div data-testid={`views-share-card-${view.id}`}></div>
}));

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

describe('ViewsMenuList', () => {
  const mockMeeting = {
    id: 1,
    shares: [
      {
        email: 'test@fora.day'
      },
      {
        email: 'test2@fora.day'
      }
    ]
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
      id: 'test@fora.day',
      name: 'Jeff Lebowski',
      count: 2,
      created_at: 1
    },
    {
      id: 'test2@fora.day',
      count: 2,
      name: 'The Dude',
      created_at: 2
    }
  ];

  it('should render views', () => {
    render(
      <Menu>
        <ViewsMenuList
          views={mockViews}
          meeting={mockMeeting}
        />
      </Menu>
    );

    expect(screen.getByText('VIEWS')).toBeInTheDocument();
    expect(screen.getByText('RECENT VIEWS FROM SHARING')).toBeInTheDocument();
    expect(
      screen.getByText('6 views from 2 people with org access', {
        normalizer: normalizeText
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText('4 views from 2 people with sharing access', {
        normalizer: normalizeText
      })
    ).toBeInTheDocument();
    expect(screen.getByTestId('views-share-card-test@fora.day')).toBeInTheDocument();
    expect(screen.getByTestId('views-share-card-test2@fora.day')).toBeInTheDocument();
  });

  it('should say 1 if total views is 0', () => {
    render(
      <Menu>
        <ViewsMenuList
          views={[]}
          meeting={mockMeeting}
        />
      </Menu>
    );

    expect(
      screen.getByText('1 view from 1 person with org access', {
        normalizer: normalizeText
      })
    ).toBeInTheDocument();
  });

  it('should say view and person if shared viewer count is 1', () => {
    render(
      <Menu>
        <ViewsMenuList
          views={[
            {
              id: 'test@fora.day',
              name: 'Jeff Lebowski',
              count: 1,
              created_at: 1734709183675
            }
          ]}
          meeting={mockMeeting}
        />
      </Menu>
    );

    expect(
      screen.getByText('1 view from 1 person with sharing access', {
        normalizer: normalizeText
      })
    ).toBeInTheDocument();
  });

  it('should say "person" if only 1 viewer', () => {
    render(
      <Menu>
        <ViewsMenuList
          views={[
            {
              id: 'zack@fora.day',
              name: 'Zack Elias',
              avatar_url:
                'https://lh3.google.com/ao/AHP4FtkloTguZHutZlebR1y5dXkjYpb-ouBXuVq_LGigG1UKcyzYrYBntImoSe1E6og_Vi8c=s96-c',
              count: 4,
              created_at: 1734708575015
            }
          ]}
          meeting={mockMeeting}
        />
      </Menu>
    );

    expect(
      screen.getByText('4 views from 1 person with org access', {
        normalizer: normalizeText
      })
    ).toBeInTheDocument();
  });

  it('should hide shared viewers if no sharers', () => {
    render(
      <Menu>
        <ViewsMenuList
          views={[
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
            }
          ]}
        />
      </Menu>
    );

    expect(screen.getByText('VIEWS')).toBeInTheDocument();

    const basicCopy = screen.getByText('0 views from 0 people with sharing access', {
      normalizer: normalizeText
    });
    expect(basicCopy).not.toBeVisible();

    // Ensure sharing views are hidden
    const titleElement = screen.getByText('RECENT VIEWS FROM SHARING');
    expect(titleElement).not.toBeVisible();

    expect(
      screen.getByText('6 views from 2 people with org access', {
        normalizer: normalizeText
      })
    ).toBeInTheDocument();
    expect(screen.queryByTestId('views-share-card')).not.toBeInTheDocument();
  });
});
