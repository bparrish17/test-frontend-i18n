import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { ChakraProvider } from '@chakra-ui/react';

import Transcripts from '@components/meeting/transcripts.component';
import { useUserStore } from '@store/app.store';
import { useMeetingBotStatuses, useUpdateBotFromPusherEvent } from '@util/hooks';
import { useBotTranscripts } from '@services/query-services/bots.query-service';

// Mock hooks and dependencies
vi.mock('@util/hooks', () => ({
  useMeetingBotStatuses: vi.fn(),
  useUpdateBotFromPusherEvent: vi.fn()
}));

vi.mock('@services/query-services/bots.query-service', () => ({
  useBotTranscripts: vi.fn()
}));

vi.mock('@store/app.store');

const mockPauseResume = vi.fn();
const mockOnClose = vi.fn();
const mockDisclosure = { onClose: mockOnClose };

const mockTranscript = [
  {
    speaker: 'Vinnie Vendemia',
    words: [
      {
        text: 'Smalley',
        start_time: 3.893815,
        end_time: 4.134775
      },
      {
        text: ' D.',
        start_time: 4.134775,
        end_time: 4.235175
      },
      {
        text: ' Whats',
        start_time: 4.255255,
        end_time: 5.379715
      },
      {
        text: ' up,',
        start_time: 5.399795,
        end_time: 5.520275
      },
      {
        text: ' man?',
        start_time: 5.540355,
        end_time: 5.941955
      }
    ],
    is_final: true,
    start_time: 3.893815,
    end_time: 6.684905,
    duration: 2.79109,
    segment: 'Smalley D.  Whats  up,  man?',
    participant: {
      avatar_url:
        'https://lh3.googleusercontent.com/a/ACg8ocLKIfZNxrfZq05I7i3vFlZedJNgt4ZJsp5CM1gt48x3Ct_nIaM=s96-c',
      company_name: 'FORA',
      name: 'Vinnie Vendemia',
      rank: 100,
      id: 'ba1d48af-1bb0-43bc-b20b-d78db84c739d',
      title: 'Principal Engineer',
      email: 'vinnie@fora.day',
      status: 'yes'
    }
  },
  {
    speaker: 'David Small',
    words: [
      {
        text: ' you',
        start_time: 6.704985,
        end_time: 6.825455
      },
      {
        text: ' doing,',
        start_time: 6.865615,
        end_time: 7.026255
      },
      {
        text: ' man?',
        start_time: 7.106575,
        end_time: 7.307375
      }
    ],
    is_final: true,
    start_time: 61.704985,
    end_time: 67.307375,
    duration: 0.6023898,
    segment: ' you  doing,  man?',
    participant: {
      avatar_url:
        'https://lh3.googleusercontent.com/a-/ALV-UjXUit17lPBsvpSsXmP4ORMYZq43QWOerm11SSGxegYr0X6sfos=s96-c',
      company_name: 'FORA',
      name: 'David Small',
      rank: 100,
      id: '8ecc07ba-7fd7-4b6c-870e-ca4b290d52c2',
      title: 'Head of Engineering',
      email: 'smalleyd@fora.day',
      status: 'yes'
    }
  }
];

// Utility to render with Chakra UI
const renderWithProviders = (ui) => {
  return render(<ChakraProvider>{ui}</ChakraProvider>);
};

const normalizeText = (text) => text.replace(/\s+/g, ' ').trim();

describe('Transcripts Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('FORA user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({
        email: 'test@example.com',
        isGuest: false
      });
    });

    test('renders loading state when transcripts are being fetched', () => {
      useMeetingBotStatuses.mockReturnValue({
        isLive: false,
        isOnPause: false,
        startedRecordingAt: 1739201442994,
        recordingPausedSegments: [],
        lastStatusChange: { created_at: new Date() }
      });

      const bot = {
        id: 123
      };

      useBotTranscripts.mockReturnValue({
        data: [],
        isLoading: true
      });

      renderWithProviders(
        <Transcripts
          bot={bot}
          pauseResume={mockPauseResume}
          disclosure={mockDisclosure}
        />
      );

      expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
      expect(useBotTranscripts).toHaveBeenCalledWith(bot.id, { enabled: true });
    });

    test('renders transcripts correctly', async () => {
      useMeetingBotStatuses.mockReturnValue({
        isLive: true,
        isOnPause: false,
        startedRecordingAt: 1739201442994,
        recordingPausedSegments: [],
        lastStatusChange: { created_at: new Date() }
      });

      useBotTranscripts.mockReturnValue({
        data: [],
        isLoading: false
      });

      const bot = {
        id: 123,
        transcripts: mockTranscript
      };

      renderWithProviders(
        <Transcripts
          bot={bot}
          pauseResume={mockPauseResume}
          disclosure={mockDisclosure}
        />
      );

      expect(useBotTranscripts).toHaveBeenCalledWith(bot.id, { enabled: true });
      expect(await screen.findByText('Vinnie Vendemia')).toBeInTheDocument();
      expect(await screen.findByText('3:30')).toBeInTheDocument();
      expect(
        await screen.getByText('Smalley D. Whats up, man?', {
          normalizer: normalizeText
        })
      ).toBeInTheDocument();

      expect(await screen.findByText('David Small')).toBeInTheDocument();
      expect(await screen.findByText('3:31')).toBeInTheDocument();
      expect(await screen.findByText('you doing, man?')).toBeInTheDocument();

      // showLoader is true so should render the loader component
      expect(document.querySelector('.chakra-spinner')).toBeInTheDocument();
      expect(await screen.findAllByTestId('mock-skeleton-text')).toHaveLength(3); // Example count
    });

    test('renders pause message when isOnPause is true', async () => {
      useMeetingBotStatuses.mockReturnValue({
        isLive: true,
        isOnPause: true,
        startedRecordingAt: 1739201442994,
        recordingPausedSegments: [],
        lastStatusChange: { created_at: new Date() }
      });

      const bot = {
        id: 123,
        transcripts: mockTranscript
      };

      useBotTranscripts.mockReturnValue({
        data: [],
        isLoading: false
      });

      renderWithProviders(
        <Transcripts
          bot={bot}
          pauseResume={mockPauseResume}
          disclosure={mockDisclosure}
        />
      );

      expect(await screen.findByText(/FORA has been paused/i)).toBeInTheDocument();
    });

    test('calls pauseResume and closes modal when pause/resume button is clicked', async () => {
      useMeetingBotStatuses.mockReturnValue({
        isLive: true,
        isOnPause: true,
        startedRecordingAt: 1739201442994,
        recordingPausedSegments: [],
        lastStatusChange: { created_at: new Date() }
      });

      useBotTranscripts.mockReturnValue({
        data: [],
        isLoading: false
      });

      const bot = {
        id: 123,
        transcripts: mockTranscript
      };

      renderWithProviders(
        <Transcripts
          bot={bot}
          pauseResume={mockPauseResume}
          disclosure={mockDisclosure}
        />
      );

      const button = await screen.findByText('Resume Recording');
      fireEvent.click(button);

      await waitFor(() => {
        expect(mockPauseResume).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('guest user', () => {
    beforeEach(() => {
      useUserStore.mockReturnValue({
        email: 'test@example.com',
        isGuest: true
      });
    });

    test('Does not fetch bot transcripts', () => {
      useMeetingBotStatuses.mockReturnValue({
        isLive: false,
        isOnPause: false,
        startedRecordingAt: 1739201442994,
        recordingPausedSegments: [],
        lastStatusChange: { created_at: new Date() }
      });

      const bot = {
        id: 123
      };

      useBotTranscripts.mockReturnValue({
        data: undefined,
        isLoading: false
      });

      renderWithProviders(
        <Transcripts
          bot={bot}
          pauseResume={mockPauseResume}
          disclosure={mockDisclosure}
        />
      );

      expect(useBotTranscripts).toHaveBeenCalledWith(bot.id, { enabled: false });
    });
  });
});
