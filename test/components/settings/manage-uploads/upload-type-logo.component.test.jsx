import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SourceLogo from '@components/general/source-logo.component';
import { findMatchingCard } from '@util/helpers';
import UploadTypeLogo from '@components/settings/manage-uploads/upload-type-logo.component';

// Mock dependencies
vi.mock('@util/helpers', () => ({
  findMatchingCard: vi.fn()
}));

vi.mock('@components/general/source-logo.component', () => ({
  default: ({ sourceType, subSource, source, tags }) => (
    <div data-testid='mock-source-logo'>
      <div data-testid='source-type'>{sourceType}</div>
      <div data-testid='sub-source'>{subSource}</div>
      <div data-testid='source'>{JSON.stringify(source)}</div>
      <div data-testid='tags'>{JSON.stringify(tags)}</div>
    </div>
  )
}));

describe('UploadTypeLogo', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders SourceLogo with merged tags and card props', () => {
    const upload = { tags: ['uploadTag'] };
    const card = {
      tags: ['cardTag'],
      source: 'Zoom',
      sub_source: 'API',
      source_data: { id: 123 }
    };

    findMatchingCard.mockReturnValue(card);

    render(
      <UploadTypeLogo
        upload={upload}
        cards={['dummy']}
        type='Meeting'
      />
    );

    // Verify SourceLogo rendered
    expect(screen.getByTestId('mock-source-logo')).toBeInTheDocument();

    expect(screen.getByTestId('source-type')).toHaveTextContent('Zoom');
    expect(screen.getByTestId('sub-source')).toHaveTextContent('API');
    expect(screen.getByTestId('source')).toHaveTextContent(JSON.stringify({ id: 123 }));
    expect(screen.getByTestId('tags')).toHaveTextContent(JSON.stringify(['cardTag', 'uploadTag']));
  });

  it('falls back to type as sourceType and uses only upload tags when no card', () => {
    const upload = { tags: ['uploadTag'] };
    findMatchingCard.mockReturnValue(undefined);

    render(
      <UploadTypeLogo
        upload={upload}
        cards={[]}
        type='Document'
      />
    );

    expect(screen.getByTestId('source-type')).toHaveTextContent('Document');
    expect(screen.getByTestId('sub-source')).toBeEmptyDOMElement();
    expect(screen.getByTestId('source')).toBeEmptyDOMElement();
    expect(screen.getByTestId('tags')).toHaveTextContent(JSON.stringify(['uploadTag']));
  });
});
