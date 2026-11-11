import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, vi, expect } from 'vitest';

import ViewsShareCard from '@components/privacy/views-share-card.component';

import { useApolloPerson } from '@services/query-services/apollo.query-service';
import { usePeople } from '@services/query-services/people.query-service';

import { sanitizeView } from '@util/helpers/privacy.helpers';

vi.mock('@services/query-services/apollo.query-service', () => ({
  useApolloPerson: vi.fn()
}));

vi.mock('@services/query-services/people.query-service', () => ({
  usePeople: vi.fn()
}));

vi.mock('@util/helpers/privacy.helpers', () => ({
  sanitizeView: vi.fn()
}));

describe('ViewsShareCard', () => {
  it('renders the avatar, name, and date correctly', () => {
    // Mocking hook and helper function responses
    const mockApolloPerson = { name: 'Apollo User', photo_url: 'apollo-avatar.png' };
    const mockForaPerson = { name: 'Fora User', avatar_url: 'fora-avatar.png' };
    const mockView = { id: 'test@fora.day', created_at: 1736270216179 };

    useApolloPerson.mockReturnValue({
      data: mockApolloPerson
    });

    usePeople.mockReturnValue({
      data: [mockForaPerson]
    });

    sanitizeView.mockReturnValue({
      name: 'Fora User',
      avatar_url: 'fora-avatar.png',
      date: 'Today, 12:22 PM'
    });

    render(<ViewsShareCard view={mockView} />);

    const name = screen.getByText('Fora User');
    const date = screen.getByText('Today, 12:22 PM');

    expect(document.querySelectorAll('.chakra-avatar')).toHaveLength(1);
    expect(name).toBeInTheDocument();
    expect(date).toBeInTheDocument();

    // Verify hooks and helper function calls
    expect(useApolloPerson).toHaveBeenCalledWith('test@fora.day', {
      enabled: true,
      retry: false
    });

    expect(usePeople).toHaveBeenCalledWith(
      { email_x: 'test@fora.day' },
      {
        enabled: true,
        retry: false
      }
    );
    expect(sanitizeView).toHaveBeenCalledWith(mockView, mockForaPerson, mockApolloPerson);
  });

  it('handles missing data gracefully', () => {
    const mockView = { id: 'test@fora.day', created_at: null };

    useApolloPerson.mockReturnValue({
      data: null
    });

    usePeople.mockReturnValue({
      data: null
    });

    sanitizeView.mockReturnValue({
      name: 'test@fora.day',
      avatar_url: null,
      date: 'N/A'
    });

    render(<ViewsShareCard view={mockView} />);

    const name = screen.getByText('test@fora.day');
    const date = screen.getByText('N/A');

    expect(document.querySelectorAll('.chakra-avatar')).toHaveLength(1);
    expect(name).toBeInTheDocument();
    expect(date).toBeInTheDocument();

    // Verify hooks and helper function calls
    expect(useApolloPerson).toHaveBeenCalledWith('test@fora.day', {
      enabled: true,
      retry: false
    });

    expect(usePeople).toHaveBeenCalledWith(
      { email_x: 'test@fora.day' },
      {
        enabled: true,
        retry: false
      }
    );
    expect(sanitizeView).toHaveBeenCalledWith(mockView, undefined, null);
  });
});
