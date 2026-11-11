import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { useSlackChannels } from '@services/query-services/slack.query-service';
import { useCreateDigest, useDigestModalConfigVals, useEditDigest } from '@util/hooks';
import SlackDigestModal from '@components/digest/slack-digest-modal.component';

vi.mock('@services/query-services/slack.query-service', () => ({
  useSlackChannels: vi.fn()
}));

vi.mock('@util/hooks', () => ({
  useCreateDigest: vi.fn(),
  useEditDigest: vi.fn(),
  useDigestModalConfigVals: vi.fn()
}));

vi.mock('@assets/icons', async (importActual) => ({
  ...(await importActual()),
  SFPlusCircleIcon: () => <div>SFPlusCircleIcon</div>,
  SFBoxWithPencil: () => <div>SFBoxWithPencil</div>
}));

// vi.mock('react-hook-form', async (importActual) => ({
//   ...(await importActual()),
//   Controller: ({ render }) => <div>{render()}</div>
// }));

vi.mock('@chakra-ui/react', async (importActual) => ({
  ...(await importActual()),
  ModalContent: ({ children }) => <div data-testid='modal-content'>{children}</div>,
  ModalHeader: ({ children }) => <div data-testid='modal-header'>{children}</div>,
  ModalOverlay: () => <div>ModalOverlay</div>,
  ModalCloseButton: () => <div>ModalCloseButton</div>
}));

vi.mock('@components/general/form/custom-select.component.jsx', () => ({
  default: ({ options }) => (
    <select data-testid='custom-select'>
      {options.map((group) =>
        group.options.map((opt) => (
          <option
            key={opt.id}
            data-testid={`option-${opt.id}`}
          >
            {opt.name}
          </option>
        ))
      )}
    </select>
  )
}));

vi.mock('@components/general/info-blurb.component', () => ({
  default: () => <div>InfoBlurb</div>
}));

vi.mock('@components/digest/digest-form.component', () => ({
  default: ({ children }) => <div data-testid='digest-form'>{children}</div>
}));

vi.mock('@components/general/form/step-with-label.component', () => ({
  default: ({ children }) => <div data-testid='step-with-label'>{children}</div>
}));

describe('SlackDigestModal', () => {
  const createChannelMock = vi.fn();
  const disclosure = { onOpen: vi.fn(), onClose: vi.fn(), isOpen: true };

  beforeAll(() => {
    useDigestModalConfigVals.mockReturnValue({
      tenantHasAccess: true,
      userTz: 'EST5EDT',
      tenantTz: 'EDST5EDT',
      isAdminOrExecutive: true
    });
    useCreateDigest.mockReturnValue({ onCreate: createChannelMock, isCreating: false });
    useEditDigest.mockReturnValue({ onPatch: vi.fn(), isPatching: false });
    useSlackChannels.mockReturnValue({
      data: [
        { id: 'C04C6LCUADB', name: 'random', is_member: true },
        { id: 'C04CL80FBCJ', name: 'eng', is_member: true },
        { id: 'C08DDHX046N', name: 'theblog' },
        { id: 'C08PN51R8CT', name: 'prompt-grievances' }
      ]
    });
  });

  it('renders a modal with expected header', () => {
    render(<SlackDigestModal disclosure={disclosure} />);
    expect(screen.getByText('SFPlusCircleIcon')).toBeInTheDocument();
    expect(screen.getByTestId('modal-header')).toBeInTheDocument();
    expect(screen.getByText('ModalCloseButton')).toBeInTheDocument();
    expect(screen.getByText('Create a Slack Digest')).toBeInTheDocument();
  });

  it('renders edit text if isEdit=true', () => {
    render(
      <SlackDigestModal
        disclosure={disclosure}
        isEdit
        digest={{}}
      />
    );
    expect(screen.getByText('SFBoxWithPencil')).toBeInTheDocument();
    expect(screen.getByText('Edit Slack Digest')).toBeInTheDocument();
  });

  it('renders a modal with create digest form as a child', () => {
    render(<SlackDigestModal disclosure={disclosure} />);
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByTestId('digest-form')).toBeInTheDocument();
    expect(screen.getByTestId('step-with-label')).toBeInTheDocument();
  });

  it('renders custom select with expected options', () => {
    render(<SlackDigestModal disclosure={disclosure} />);
    expect(screen.getByTestId('custom-select')).toBeInTheDocument();
    expect(screen.getByTestId('option-C04C6LCUADB')).toBeInTheDocument();
    expect(screen.getByTestId('option-C04CL80FBCJ')).toBeInTheDocument();
  });

  it('renders an InfoBlurb about connecting slack if not configured', () => {
    useDigestModalConfigVals.mockReturnValue({
      tenantHasAccess: false,
      userTz: 'EST5EDT',
      tenantTz: 'EDST5EDT',
      isAdminOrExecutive: true
    });
    render(<SlackDigestModal disclosure={disclosure} />);
    expect(screen.getByText('InfoBlurb')).toBeInTheDocument();
  });
});
