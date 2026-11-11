import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useDeleteChannel } from '@services/query-services/channels.query-service';
import { useStyledToast } from '@util/hooks';
import { useDisclosure } from '@chakra-ui/react';
import DeleteDigestModal from '@components/digest/delete-digest-modal.component.jsx';

vi.mock('@services/query-services/channels.query-service', () => ({
  useDeleteChannel: vi.fn()
}));

vi.mock('@chakra-ui/react', async (importActual) => ({
  ...(await importActual()),
  useDisclosure: vi.fn(),
  IconButton: ({ icon }) => <button>{icon}</button>
}));

vi.mock('@assets/icons', async (importActual) => ({
  ...(await importActual()),
  SFTrashIcon: () => <span>SFTrashIcon</span>
}));

vi.mock('@util/hooks', () => ({
  useStyledToast: vi.fn()
}));

describe('DeleteDigestModal', () => {
  const mockDeleteChannel = vi.fn();
  const mockToast = vi.fn();
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    useDisclosure.mockReturnValue({ isOpen: true, onOpen: vi.fn(), onClose: mockOnClose });
    useDeleteChannel.mockReturnValue({ mutateAsync: mockDeleteChannel });
    useStyledToast.mockReturnValue(mockToast);
  });

  const digest = { id: '123', name: 'Test Digest' };

  it('renders trigger button when disclosure is closed', () => {
    useDisclosure.mockReturnValue({ isOpen: false });
    render(<DeleteDigestModal digest={digest} />);
    expect(screen.getByRole('button', { name: /SFTrashIcon/i })).toBeInTheDocument();
  });

  it('opens the modal when the IconButton is clicked', () => {
    render(<DeleteDigestModal digest={digest} />);
    expect(screen.getByText(/Deactivate Digest\?/i)).toBeInTheDocument();
  });

  it('closes the modal when the Cancel button is clicked', async () => {
    render(<DeleteDigestModal digest={digest} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    await waitFor(() => {
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('calls deleteChannel and shows success toast on successful deletion', async () => {
    mockDeleteChannel.mockResolvedValueOnce();
    render(<DeleteDigestModal digest={digest} />);
    fireEvent.click(screen.getByRole('button', { name: /deactivate/i }));
    await waitFor(() =>
      expect(mockDeleteChannel).toHaveBeenCalledWith(digest.id, expect.any(Object))
    );
  });
});
