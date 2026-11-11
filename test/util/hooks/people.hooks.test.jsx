// test/util/hooks/people.hooks.test.js
import { renderHook, waitFor, act } from '@testing-library/react';
import { describe, it, vi, beforeEach, expect } from 'vitest';
import { useToast } from '@chakra-ui/react';

import {
  useEnrichedOrganizationsStats,
  usePersonData,
  usePatchPersonFromDetailsPage,
  useAvatarUpload
} from '@util/hooks';
import { useUserStore } from '@store/app.store';
import {
  useApolloPerson,
  useApolloOrganizationsByDomains
} from '@services/query-services/apollo.query-service';
import { useCards, useCardSubSources } from '@services/query-services/cards.query-service';
import { usePersonById, usePatchPerson } from '@services/query-services/people.query-service';
import {
  useMeetings,
  useOrganizationsStats,
  usePeopleStats
} from '@services/query-services/meetings.query-service';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useContacts } from '@services/query-services/contacts.query-service';
import NylasService from '@services/nylas.service';
import S3Bucket from '@services/s3bucket.service';

// Mock all the imported services
vi.mock('@services/query-services/apollo.query-service');
vi.mock('@services/query-services/cards.query-service');
vi.mock('@services/query-services/people.query-service');
vi.mock('@services/query-services/meetings.query-service');
vi.mock('@services/query-services/contacts.query-service');
vi.mock('@store/app.store');
vi.mock('@services/nylas.service', () => {
  const mockInstance = {
    deleteNylasGrant: vi.fn()
  };

  return {
    default: {
      getInstance: vi.fn(() => mockInstance)
    }
  };
});

vi.mock('@chakra-ui/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useToast: vi.fn(() => vi.fn())
  };
});
vi.mock('@util/hooks', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useEnrichedOrganizationsStats: vi.fn()
  };
});

describe('usePersonData', () => {
  const mockUser = {
    email: 'test@example.com',
    type: 'Executive'
  };

  const mockApolloPerson = {
    id: 'apollo-1',
    name: 'John Apollo',
    email: 'john@example.com'
  };

  const mockPeopleStats = [
    { id: '1', email: 'person1@example.com', name: 'Person One', count: 5, duration: 18000000 },
    { id: '2', email: 'person2@example.com', name: 'Person Two', count: 3, duration: 10800000 }
  ];

  const mockOrgStats = [
    {
      id: '1',
      email: 'company1.com',
      title: 'Industry 1',
      name: 'Company One',
      count: 10,
      duration: 36000000
    },
    {
      id: '2',
      email: 'company2.com',
      title: 'Industry 2',
      name: 'Company Two',
      count: 7,
      duration: 25200000
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    useUserStore.mockImplementation((selector) => selector({ user: mockUser }));

    useContacts.mockReturnValue({ data: null, isInitialLoading: false });
    useApolloPerson.mockReturnValue({ data: null, isInitialLoading: false });
    useApolloOrganizationsByDomains.mockReturnValue({ data: [], isInitialLoading: false });
    useCards.mockReturnValue({ data: [] });
    usePersonById.mockReturnValue({ data: null, isInitialLoading: false });
    useMeetings.mockReturnValue({ data: [], isInitialLoading: false });

    useEnrichedOrganizationsStats.mockReturnValue({
      organizationStats: mockOrgStats[0],
      allOrganizationsStats: mockOrgStats,
      isOrganizationsStatsLoading: false
    });
    useOrganizationsStats.mockReturnValue({ data: [], isInitialLoading: false });
    usePeopleStats.mockReturnValue({ data: [], isInitialLoading: false });
    useCardSubSources.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: vi.fn()
    });
  });

  it('should handle invalid person case', () => {
    const { result } = renderHook(() => usePersonData(null, null));

    expect(result.current.isInvalidPerson).toBe(true);
  });

  it('should identify when person is current user', () => {
    useApolloPerson.mockReturnValue({
      data: mockApolloPerson,
      isInitialLoading: false
    });

    const { result } = renderHook(() => usePersonData('id-1', mockUser.email));
    expect(result.current.personIsCurrentUser).toBe(true);
  });

  it('should handle loading states correctly', async () => {
    // Set initial loading state for all relevant queries
    const mockEmptyQueryResult = {
      data: null,
      isInitialLoading: true
    };
    useApolloPerson.mockReturnValue(mockEmptyQueryResult);
    usePersonById.mockReturnValue(mockEmptyQueryResult);
    usePeopleStats.mockReturnValue(mockEmptyQueryResult);
    useOrganizationsStats.mockReturnValue(mockEmptyQueryResult);
    useMeetings.mockReturnValue(mockEmptyQueryResult);

    const { result, rerender } = renderHook(() => usePersonData('id-1', 'test@example.com'));
    expect(result.current.isLoading).toBe(true);

    // Update all queries to loaded state
    useApolloPerson.mockReturnValue({
      data: mockApolloPerson,
      isInitialLoading: false
    });
    usePersonById.mockReturnValue({
      data: null,
      isInitialLoading: false
    });
    usePeopleStats.mockReturnValue({
      data: [],
      isInitialLoading: false
    });
    useOrganizationsStats.mockReturnValue({
      data: [],
      isInitialLoading: false
    });
    useMeetings.mockReturnValue({
      data: [],
      isInitialLoading: false
    });

    // Trigger a rerender with the new mock values
    rerender();

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );
  });

  it('should return contact from contacts search', () => {
    const person1 = { id: 1, email: 'test@example.com' };
    useContacts.mockReturnValue({ data: person1 });
    const { result } = renderHook(() => usePersonData('id-1', 'test@example.com'));
    expect(result.current.contact).toEqual(person1);
  });

  it('should partition meetings into external and internal', () => {
    const mockMeetings = [
      {
        id: 1,
        nylas: {
          participants: [{ email: 'external@other.com', external: true }]
        }
      },
      {
        id: 2,
        nylas: {
          participants: [{ email: 'internal@company.com', external: false }]
        }
      }
    ];

    useMeetings.mockReturnValue({
      data: mockMeetings,
      isInitialLoading: false
    });

    const { result } = renderHook(() => usePersonData('id-1', 'test@example.com'));

    expect(result.current.personExternalMeetings).toHaveLength(1);
    expect(result.current.personInternalMeetings).toHaveLength(1);
  });

  it('should process organization and people stats correctly', () => {
    // Set up mock data for people stats with the current user's stats included
    const peopleStatsWithUser = [
      ...mockPeopleStats,
      { id: 'id-1', email: 'test@example.com', name: 'Current User', count: 10, duration: 36000000 }
    ];

    usePeopleStats.mockReturnValue({
      data: peopleStatsWithUser,
      isInitialLoading: false
    });

    useOrganizationsStats.mockReturnValue({
      data: mockOrgStats,
      isInitialLoading: false
    });

    useApolloOrganizationsByDomains.mockReturnValue({
      data: [
        { id: 'org-1', primary_domain: 'company1.com', name: 'Apollo Company One' },
        { id: 'org-2', primary_domain: 'company2.com', name: 'Apollo Company Two' }
      ],
      isInitialLoading: false
    });

    const { result } = renderHook(() => usePersonData('id-1', 'test@example.com'));
    // Check that person stats were processed correctly
    expect(result.current.peopleStats).toHaveLength(2); // Should exclude the current user
    expect(result.current.personStats).toEqual(
      expect.objectContaining({ id: 'id-1', email: 'test@example.com' })
    );

    // Check organization stats
    expect(result.current.organizationsStats).toBeDefined();
    expect(result.current.organizations).toBeDefined();
  });
});

describe('usePatchPersonFromDetailsPage', () => {
  let mockPatchPerson;
  let mockDeleteNylasGrant;
  let queryClient;

  beforeEach(() => {
    queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    mockPatchPerson = vi.fn();
    mockDeleteNylasGrant = vi.fn();

    usePatchPerson.mockReturnValue({
      mutateAsync: mockPatchPerson
    });

    const nylasInstance = NylasService.getInstance();
    nylasInstance.deleteNylasGrant = mockDeleteNylasGrant;
  });

  it('should patch person data correctly', async () => {
    const mockToast = vi.fn();
    const mockSetIsSubmitting = vi.fn();

    mockPatchPerson.mockImplementation((data, { onSuccess }) => {
      onSuccess({ id: 1, active: true });
      return Promise.resolve({ id: 1, active: true });
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePatchPersonFromDetailsPage(), { wrapper });
    await act(() => {
      result.current(1, { name: 'Test User' }, mockToast, mockSetIsSubmitting);
    });

    expect(mockPatchPerson).toHaveBeenCalledWith(
      { id: 1, name: 'Test User' },
      expect.objectContaining({
        onSuccess: expect.any(Function),
        onError: expect.any(Function)
      })
    );

    expect(mockToast).toHaveBeenCalledWith({
      title: 'User updated successfully',
      status: 'success',
      duration: 9000,
      isClosable: true
    });
  });

  it('should also delete Nylas grant if user is deactivated', async () => {
    const mockToast = vi.fn();
    const mockSetIsSubmitting = vi.fn();

    const deactivatedUser = {
      id: 1,
      active: false,
      nylas_account_id: 'nylas-123'
    };

    mockPatchPerson.mockImplementation((data, { onSuccess }) => {
      onSuccess(deactivatedUser);
      return Promise.resolve(deactivatedUser);
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePatchPersonFromDetailsPage(), { wrapper });

    await act(() => {
      result.current(1, { active: false }, mockToast, mockSetIsSubmitting);
    });

    expect(mockPatchPerson).toHaveBeenCalled();
    expect(mockDeleteNylasGrant).toHaveBeenCalledWith('nylas-123', true);
    expect(mockToast).toHaveBeenCalledWith({
      title: 'User updated successfully',
      status: 'success',
      duration: 9000,
      isClosable: true
    });
  });

  it('should NOT delete nylas grant if user is active', async () => {
    const mockToast = vi.fn();
    const mockSetIsSubmitting = vi.fn();

    const activeUser = {
      id: 1,
      active: true,
      nylas_account_id: 'nylas-123'
    };

    mockPatchPerson.mockImplementation((data, { onSuccess }) => {
      onSuccess(activeUser);
      return Promise.resolve(activeUser);
    });

    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePatchPersonFromDetailsPage(), { wrapper });
    await act(() => {
      result.current(1, { name: 'Updated User' }, mockToast, mockSetIsSubmitting);
    });

    expect(mockPatchPerson).toHaveBeenCalled();
    expect(mockDeleteNylasGrant).not.toHaveBeenCalled();
    expect(mockToast).toHaveBeenCalledWith({
      title: 'User updated successfully',
      status: 'success',
      duration: 9000,
      isClosable: true
    });
  });
});

describe('useAvatarUpload', () => {
  let mockQueryClient;
  let mockToast;
  let mockPatchPerson;
  let mockUploadFile;
  let mockSetUser;

  beforeEach(() => {
    mockQueryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    mockToast = vi.fn();
    mockPatchPerson = vi.fn();
    mockSetUser = vi.fn();

    mockUploadFile = vi.fn();
    S3Bucket.prototype.uploadFile = mockUploadFile;

    useUserStore.mockImplementation((selector) => {
      const state = {
        user: { id: 'user-123', name: 'Test User' },
        tenant: { id: 'tenant-456' },
        setUser: mockSetUser
      };

      return selector(state);
    });

    usePatchPerson.mockReturnValue({
      mutateAsync: mockPatchPerson
    });

    useToast.mockReturnValue(mockToast);
  });

  const createWrapper =
    () =>
    ({ children }) =>
      <QueryClientProvider client={mockQueryClient}>{children}</QueryClientProvider>;

  it('should return upload state and handlers', () => {
    const { result } = renderHook(() => useAvatarUpload(mockQueryClient), {
      wrapper: createWrapper()
    });

    expect(result.current).toEqual({
      isUploading: false,
      uploadAvatar: expect.any(Function),
      handleFileSelect: expect.any(Function)
    });
  });

  it('should validate file type and show error for non-image files', async () => {
    const { result } = renderHook(() => useAvatarUpload(mockQueryClient), {
      wrapper: createWrapper()
    });

    const textFile = new File(['test'], 'test.txt', { type: 'text/plain' });
    await act(() => {
      result.current.uploadAvatar(textFile);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Invalid file type',
      description: 'Please select an image file',
      status: 'error',
      duration: 5000,
      isClosable: true
    });
    expect(mockUploadFile).not.toHaveBeenCalled();
  });

  it('should validate file size and show error for large files', async () => {
    const { result } = renderHook(() => useAvatarUpload(mockQueryClient), {
      wrapper: createWrapper()
    });

    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });

    await act(() => {
      result.current.uploadAvatar(largeFile);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'File too large',
      description: 'Please select an image smaller than 5MB',
      status: 'error',
      duration: 5000,
      isClosable: true
    });
    expect(mockUploadFile).not.toHaveBeenCalled();
  });

  it('should successfully upload avatar and update user', async () => {
    const { result } = renderHook(() => useAvatarUpload(mockQueryClient), {
      wrapper: createWrapper()
    });

    const imageFile = new File(['image data'], 'avatar.jpg', { type: 'image/jpeg' });

    mockUploadFile.mockResolvedValue('tenant-456/user-123.jpg');
    mockPatchPerson.mockResolvedValue({
      id: 'user-123',
      avatar_url: 'https://fora-avatars.s3.amazonaws.com/tenant-456/user-123.jpg'
    });

    await act(() => {
      result.current.uploadAvatar(imageFile);
    });

    expect(mockUploadFile).toHaveBeenCalledWith(imageFile, {
      fileKey: 'tenant-456/user-123.jpg',
      fileName: 'avatar.jpg'
    });

    expect(mockPatchPerson).toHaveBeenCalledWith({
      id: 'user-123',
      avatar_url: 'https://fora-avatars.s3.amazonaws.com/tenant-456/user-123.jpg'
    });

    expect(mockSetUser).toHaveBeenCalledWith({
      id: 'user-123',
      name: 'Test User',
      avatar_url: 'https://fora-avatars.s3.amazonaws.com/tenant-456/user-123.jpg'
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Profile photo updated',
      description: 'Your profile photo has been successfully updated',
      status: 'success',
      duration: 5000,
      isClosable: true
    });
  });

  it('should handle upload errors gracefully', async () => {
    const { result } = renderHook(() => useAvatarUpload(mockQueryClient), {
      wrapper: createWrapper()
    });

    const imageFile = new File(['image data'], 'avatar.jpg', { type: 'image/jpeg' });
    mockUploadFile.mockRejectedValue(new Error('S3 upload failed'));

    await act(() => {
      result.current.uploadAvatar(imageFile);
    });

    expect(mockToast).toHaveBeenCalledWith({
      title: 'Upload failed',
      description: 'Failed to upload your profile photo. Please try again.',
      status: 'error',
      duration: 5000,
      isClosable: true
    });

    expect(mockPatchPerson).not.toHaveBeenCalled();
    expect(mockSetUser).not.toHaveBeenCalled();
  });

  it('should call uploadAvatar when file is selected', async () => {
    const { result } = renderHook(() => useAvatarUpload(mockQueryClient), {
      wrapper: createWrapper()
    });

    const imageFile = new File(['image data'], 'avatar.jpg', { type: 'image/jpeg' });
    const mockEvent = { target: { files: [imageFile] } };

    act(() => {
      result.current.handleFileSelect(mockEvent);
    });

    // assert some side effect that uploadAvatar produces, e.g.
    expect(result.current.isUploading).toBe(true);
  });

  it('should do nothing if no file is provided', async () => {
    const { result } = renderHook(() => useAvatarUpload(mockQueryClient), {
      wrapper: createWrapper()
    });

    await act(() => {
      result.current.uploadAvatar(null);
    });

    expect(mockUploadFile).not.toHaveBeenCalled();
    expect(mockPatchPerson).not.toHaveBeenCalled();
    expect(mockToast).not.toHaveBeenCalled();
  });
});
