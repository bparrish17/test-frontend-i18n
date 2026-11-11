import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import SourceLogo from '@components/general/source-logo.component';
import { getDocumentMetadataFromCard } from '@util/helpers';

// Mock all icons/images so they’re just identifiable text
vi.mock('@assets/icons', () => ({
  MailIcon: () => <div>MailIcon</div>,
  SFDollarSignCircleIcon: () => <div>DollarIcon</div>,
  ZoomLogoIcon: () => <div>ZoomIcon</div>,
  SFPlayCircleIcon: () => <div>PlayIcon</div>
}));

vi.mock('@assets/images', () => ({
  GoogleMeetLogo: 'google-meet.png',
  OutlookLogo: 'outlook.png',
  SlackLogo: 'slack.png',
  TeamsLogo: 'teams.png',
  GmailLogo: 'gmail.png'
}));

// Mock helpers and components
vi.mock('@util/helpers', () => ({
  getDocumentMetadataFromCard: vi.fn()
}));

vi.mock('@components/general/document-icon.component', () => ({
  default: ({ extension }) => <div>DocumentIcon-{extension}</div>
}));

describe('SourceLogo', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Meeting sourceType', () => {
    it('renders Google Meet logo', () => {
      render(
        <SourceLogo
          sourceType='Meeting'
          source={{ url: 'https://meet.google.com/abc' }}
        />
      );
      expect(screen.getByAltText('Google Meet Logo')).toBeInTheDocument();
    });

    it('renders Microsoft Teams logo', () => {
      render(
        <SourceLogo
          sourceType='Meeting'
          source={{ url: 'https://teams.microsoft.com/abc' }}
        />
      );
      expect(screen.getByAltText('Microsoft Teams Logo')).toBeInTheDocument();
    });

    it('renders Meeting Upload icon', () => {
      render(
        <SourceLogo
          sourceType='Meeting'
          tags={['meeting_upload']}
        />
      );
      expect(screen.getByText('PlayIcon')).toBeInTheDocument();
    });

    it('renders Zoom logo by default', () => {
      render(<SourceLogo sourceType='Meeting' />);
      expect(screen.getByText('ZoomIcon')).toBeInTheDocument();
    });
  });

  describe('Bot sourceType', () => {
    it('renders Earnings Call icon', () => {
      render(
        <SourceLogo
          sourceType='Bot'
          subSource='Earnings_Call'
        />
      );
      expect(screen.getByText('DollarIcon')).toBeInTheDocument();
    });
  });

  describe('Channel sourceType', () => {
    it('renders Slack logo', () => {
      render(
        <SourceLogo
          sourceType='Channel'
          source={{ source: 'Slack' }}
        />
      );
      expect(screen.getByAltText('Slack Logo')).toBeInTheDocument();
    });

    it('renders Teams logo', () => {
      render(
        <SourceLogo
          sourceType='Channel'
          source={{ source: 'Teams' }}
        />
      );
      expect(screen.getByAltText('Teams Logo')).toBeInTheDocument();
    });

    it('renders Document icon if extension is returned', () => {
      getDocumentMetadataFromCard.mockReturnValue({ extension: 'pdf' });
      render(
        <SourceLogo
          sourceType='Channel'
          source={{ source: 'Document' }}
          tags={['tag1']}
        />
      );
      expect(screen.getByText('DocumentIcon-pdf')).toBeInTheDocument();
    });

    it('renders nothing for Document if no extension', () => {
      getDocumentMetadataFromCard.mockReturnValue({ extension: null });
      const { container } = render(
        <SourceLogo
          sourceType='Channel'
          source={{ source: 'Document' }}
        />
      );
      expect(container.firstChild).toBeNull();
    });

    it('renders Outlook logo for Email', () => {
      render(
        <SourceLogo
          sourceType='Channel'
          source={{ source: 'Email', id: 'abc@outlook.com' }}
        />
      );
      expect(screen.getByAltText('Microsoft Outlook Logo')).toBeInTheDocument();
    });

    it('renders Gmail logo for Email', () => {
      render(
        <SourceLogo
          sourceType='Channel'
          source={{ source: 'Email', id: 'abc@gmail.com' }}
        />
      );
      expect(screen.getByAltText('Gmail Logo')).toBeInTheDocument();
    });

    it('renders default Email icon', () => {
      render(
        <SourceLogo
          sourceType='Channel'
          source={{ source: 'Email', id: 'abc@custom.com' }}
        />
      );
      expect(screen.getByText('MailIcon')).toBeInTheDocument();
    });
  });

  describe('includeText', () => {
    it('renders text label when includeText is true', () => {
      render(
        <SourceLogo
          sourceType='Meeting'
          includeText
        />
      );
      expect(screen.getByText('Zoom')).toBeInTheDocument(); // default case shows Zoom text
    });

    it('does not render text label by default', () => {
      render(<SourceLogo sourceType='Meeting' />);
      expect(screen.queryByText('Zoom')).not.toBeInTheDocument();
    });
  });
});
