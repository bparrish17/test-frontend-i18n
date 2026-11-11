import { describe, it, expect, vi, beforeEach } from 'vitest';
import { differenceInMinutes } from 'date-fns';
import { Spinner } from '@chakra-ui/react';

import { SFCheckIconCircleFilled, SFExclamationMarkTriangleOutlined } from '@assets/icons';

import {
  getUploadName,
  findMatchingCard,
  getUploadLink,
  getDocumentUploadStatus,
  getOriginalFileEntry
} from '@util/helpers/uploads.helpers';

// Mock differenceInMinutes to control "age" behavior
vi.mock('date-fns', () => ({
  differenceInMinutes: vi.fn()
}));

describe('getUploadName', () => {
  it('returns "Untitled Meeting" when upload is null', () => {
    expect(getUploadName(null)).toBe('Untitled Meeting');
  });

  it('returns upload.title when no results array', () => {
    expect(getUploadName({ title: 'My Meeting' })).toBe('My Meeting');
  });

  it('returns "Unnamed File" when no original_file entry', () => {
    const upload = { results: ['not_original_file:123'] };
    expect(getUploadName(upload)).toBe('Unnamed File');
  });

  it('strips timestamp from filename', () => {
    const upload = { results: ['original_file:/path/to/12345_hello.pdf'] };
    expect(getUploadName(upload)).toBe('hello.pdf');
  });

  it('falls back to "Unnamed File" when filename is empty', () => {
    const upload = { results: ['original_file:/'] };
    expect(getUploadName(upload)).toBe('Unnamed File');
  });
});

describe('findMatchingCard', () => {
  const cards = [
    { source_data: { id: 1 }, batch_id: 5, id: 'c1' },
    { source_data: { id: 2 }, batch_id: 6, id: 'c2' }
  ];

  it('finds matching Meeting card by source_data.id', () => {
    const upload = { id: 1 };
    expect(findMatchingCard(upload, cards, 'Meeting')).toEqual(cards[0]);
  });

  it('finds matching batch card by batch_id', () => {
    const upload = { id: 6 };
    expect(findMatchingCard(upload, cards, 'Document')).toEqual(cards[1]);
  });

  it('returns undefined when no match found', () => {
    const upload = { id: 99 };
    expect(findMatchingCard(upload, cards, 'Document')).toBeUndefined();
  });
});

describe('getUploadLink', () => {
  const cards = [{ id: '123', batch_id: 5 }];

  it('returns meeting link for Meeting type', () => {
    expect(getUploadLink({ id: 1 }, cards, 'Meeting')).toBe('/meeting/1');
  });

  it('returns card link when matching card found', () => {
    expect(getUploadLink({ id: 5 }, cards, 'Document')).toBe('/cards/123');
  });

  it('returns null when no matching card', () => {
    expect(getUploadLink({ id: 9 }, cards, 'Document')).toBeNull();
  });
});

describe('getDocumentUploadStatus', () => {
  const newUpload = { created_at: new Date() };
  const oldUpload = { created_at: new Date('2020-01-01') };
  const cards = [{ id: '1', batch_id: 1 }];

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('returns Summarized status when card exists', () => {
    differenceInMinutes.mockReturnValue(10);
    const upload = { created_at: new Date(), id: 1 };
    const result = getDocumentUploadStatus(upload, cards);
    expect(result.text).toBe('Summarized');
    expect(result.icon).toEqual(
      <SFCheckIconCircleFilled
        color='brandPrimary.onContainer'
        boxSize={4}
      />
    );
  });

  it('returns Upload Failed when upload is old and no card', () => {
    differenceInMinutes.mockReturnValue(61);
    const result = getDocumentUploadStatus(oldUpload, []);
    expect(result.text).toBe('Upload Failed');
    expect(result.icon).toEqual(
      <SFExclamationMarkTriangleOutlined
        color='brandPrimary.onContainer'
        boxSize={4}
      />
    );
  });

  it('returns Summarizing when upload is recent and no card', () => {
    differenceInMinutes.mockReturnValue(10);
    const result = getDocumentUploadStatus(newUpload, []);
    expect(result.text).toBe('Summarizing');
    expect(result.icon).toEqual(
      <Spinner
        size='sm'
        speed='0.8s'
        color='brandPrimary.primary'
        mr={1}
      />
    );
  });
});

describe('getOriginalFileEntry', () => {
  it('returns null when upload is null', () => {
    expect(getOriginalFileEntry(null)).toBe(null);
  });

  it('returns null when no results array', () => {
    expect(getOriginalFileEntry({ title: 'My Meeting' })).toBe(null);
  });

  it('returns null when no original_file entry', () => {
    const upload = { results: ['not_original_file:123'] };
    expect(getOriginalFileEntry(upload)).toBe(undefined);
  });

  it('returns entry', () => {
    const upload = { results: ['original_file:/path/to/12345_hello.pdf'] };
    expect(getOriginalFileEntry(upload)).toBe('/path/to/12345_hello.pdf');
  });
});
