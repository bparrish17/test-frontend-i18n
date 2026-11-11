import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import UploadName from '@components/settings/manage-uploads/upload-name.component';
import { getUploadName, getUploadLink } from '@util/helpers';

// Mock the helpers so we control outputs
vi.mock('@util/helpers', () => ({
  getUploadName: vi.fn(),
  getUploadLink: vi.fn()
}));

// Mock react-router Link so we can inspect its "to" prop
vi.mock('react-router-dom', () => ({
  Link: ({ to, children }) => (
    <a
      data-testid='mock-link'
      href={to}
    >
      {children}
    </a>
  )
}));

describe('UploadName', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders upload name as a link using helpers', () => {
    const upload = { id: 1 };
    const cards = [{ id: 'c1' }];
    const type = 'Document';

    getUploadName.mockReturnValue('My Upload');
    getUploadLink.mockReturnValue('/cards/c1');

    render(
      <UploadName
        upload={upload}
        cards={cards}
        type={type}
      />
    );

    // Check that the link rendered
    const linkElement = screen.getByTestId('mock-link');
    expect(linkElement).toBeInTheDocument();

    // Check the link destination
    expect(linkElement).toHaveAttribute('href', '/cards/c1');

    // Check the displayed text
    expect(linkElement).toHaveTextContent('My Upload');

    // Ensure helpers were called with correct args
    expect(getUploadLink).toHaveBeenCalledWith(upload, cards, type);
    expect(getUploadName).toHaveBeenCalledWith(upload);
  });
});
