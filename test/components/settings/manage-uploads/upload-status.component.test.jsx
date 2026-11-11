import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { getDocumentUploadStatus } from '@util/helpers';
import { useControlBarState } from '@util/hooks';

import UploadStatus from '@components/settings/manage-uploads/upload-status.component';

// Mock the helpers & hooks
vi.mock('@util/helpers', () => ({
  getDocumentUploadStatus: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useControlBarState: vi.fn()
}));

describe('UploadStatus', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Document type', () => {
    it('renders status icon and text from getDocumentUploadStatus', () => {
      getDocumentUploadStatus.mockReturnValue({
        text: 'Summarizing',
        icon: <div data-testid='mock-icon'>ICON</div>
      });

      render(
        <UploadStatus
          type='Document'
          upload={{ id: 1 }}
          cards={[]}
        />
      );

      // Icon should be present
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();

      // Text should be present
      expect(screen.getByText('Summarizing')).toBeInTheDocument();
    });
  });

  describe('Meeting type', () => {
    it('renders text from useControlBarState', () => {
      useControlBarState.mockReturnValue({ text: 'In Progress' });

      render(
        <UploadStatus
          type='Meeting'
          upload={{ id: 2 }}
          cards={[]}
        />
      );

      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });
});
