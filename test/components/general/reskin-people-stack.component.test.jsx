import { screen } from '@testing-library/react';
import { expect } from 'vitest';

import { renderWithProviders } from '@test/test.helpers';
import ReskinPeopleStack from '@components/general/reskin-people-stack.component';

const mockPeople = [
  {
    id: 'user1',
    name: 'User 1'
  }
];

describe('ReskinPeopleStack', () => {
  it('renders people with defaults', () => {
    renderWithProviders(<ReskinPeopleStack people={mockPeople} />);
    expect(screen.getByText('User 1')).toBeInTheDocument();
  });

  it('renders people with custom element', () => {
    renderWithProviders(
      <ReskinPeopleStack
        people={mockPeople}
        personRightElement={({ person }) => <div>{person.id}</div>}
      />
    );
    expect(screen.getByText('user1')).toBeInTheDocument();
  });
});
