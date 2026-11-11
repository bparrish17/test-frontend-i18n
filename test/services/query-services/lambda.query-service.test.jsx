import { vi, describe, it, expect } from 'vitest';
import { render, waitFor, renderHook, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import {
  makeLambdaRequest,
  useViews,
  useZoomMeetingRecordingStatus,
  usePostZoomDownloadMeetingRecording,
  processChannelById,
  getOktaToken,
  useGenerateLabelPrompts,
  getOktaConfig,
  useRingCentralOauth,
  getPresignedUrl,
  useZoomAccountSettings,
  usePatchZoomAccountSettings,
  useZoomUsers,
  useZoomUserSettings,
  usePatchZoomUserSettings
} from '@services/query-services/lambda.query-service';

vi.mock('axios');

// Create a reusable QueryClient for testing
const createQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Disable retries for easier testing
        staleTime: 0
      }
    }
  });

describe('makeLambdaRequest', () => {
  it('should make a correct Axios request', async () => {
    axios.mockResolvedValueOnce({ data: { success: true } });

    const response = await makeLambdaRequest({
      method: 'GET',
      endpoint: 'test-endpoint',
      data: { key: 'value' },
      params: { id: 123 },
      headers: { 'Content-Type': 'application/json' }
    });

    expect(axios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${process.env.VITE_LAMBDA_API}/test-endpoint`,
      data: { key: 'value' },
      params: { id: 123 },
      headers: { 'Content-Type': 'application/json' }
    });
    expect(response).toEqual({ success: true });
  });
});

describe('useViews', () => {
  it('should call makeLambdaRequest with correct arguments and render fetched data', async () => {
    axios.mockResolvedValueOnce({
      data: {
        total_views: 93,
        non_shared_viewers: 8,
        shared_viewers: [
          {
            email: 'test@fora.day',
            first_name: 'Test',
            last_name: 'Tester',
            name: 'Test Tester',
            created_at: 1732648517931
          }
        ]
      }
    });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const TestComponent = () => {
      const { data, isLoading } = useViews(123);

      if (isLoading) return <p>Loading...</p>;
      if (data) return <div>Data: {JSON.stringify(data)}</div>;
      return null;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // Wait for the query to complete and assert Axios was called with the correct arguments
    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${import.meta.env.VITE_LAMBDA_API}/meetings/views`,
        data: {},
        params: { meeting_id: 123 },
        headers: {}
      });
    });
  });
});

describe('useZoomMeetingRecordingStatus', () => {
  it('should call makeLambdaRequest with correct arguments and render fetched data', async () => {
    axios.mockResolvedValueOnce({
      data: { code: 200, message: 'Recording transcript available' }
    });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const TestComponent = () => {
      const { data, isLoading } = useZoomMeetingRecordingStatus(
        'zoom-cred',
        'zoom-id',
        'meeting-id',
        true
      );

      if (isLoading) return <p>Loading...</p>;
      if (data) return <div>Data: {JSON.stringify(data)}</div>;
      return null;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // Wait for the query to complete and assert Axios was called with the correct arguments
    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${import.meta.env.VITE_LAMBDA_API}/integrations/zoom/meeting-recording-status`,
        data: {},
        params: {
          zoom_oauth_credential_id: 'zoom-cred',
          meeting_id: 'zoom-id',
          fora_meeting_id: 'meeting-id'
        },
        headers: {}
      });
    });
  });
});

describe('usePostZoomDownloadMeetingRecording', () => {
  it('makes a POST request to the zoom/download-meeting-recording endpoint', async () => {
    const mockResponse = { success: true };
    axios.mockResolvedValueOnce({ data: mockResponse });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePostZoomDownloadMeetingRecording(), {
      wrapper: Wrapper
    });

    await act(async () => {
      const res = await result.current.mutateAsync({
        meeting_id: '12345',
        person: { email: 'test@fora.day' },
        fora_meeting: { id: '55555' }
      });

      expect(res).toEqual(mockResponse);

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: `${import.meta.env.VITE_LAMBDA_API}/integrations/zoom/download-meeting-recording`,
        data: {
          meeting_id: '12345',
          person: { email: 'test@fora.day' },
          fora_meeting: { id: '55555' }
        },
        params: {},
        headers: {}
      });
    });
  });
});

describe('processChannelById', () => {
  it('makes a POST request to the process-channel-by-id endpoint', async () => {
    const mockResponse = { success: true };
    axios.mockResolvedValueOnce({ data: mockResponse });

    await processChannelById('channel-1', { custom: 'param' });
    expect(axios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${import.meta.env.VITE_LAMBDA_API}/channel/process-channel-by-id`,
      params: {
        custom: 'param'
      },
      data: { channel_id: 'channel-1' },
      headers: {}
    });
  });
});

describe('getOktaToken', () => {
  it('makes a GET request to the okta/token endpoint', async () => {
    const mockResponse = { accessToken: 'token', idToken: 'id-token' };
    axios.mockResolvedValueOnce({ data: mockResponse });

    await getOktaToken('subdomain', 'code', 'code-verifier', 'https://redirect.com');
    expect(axios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${import.meta.env.VITE_LAMBDA_API}/okta/token`,
      params: {
        subdomain: 'subdomain',
        code: 'code',
        code_verifier: 'code-verifier',
        redirect_uri: 'https://redirect.com'
      },
      data: {},
      headers: {}
    });
  });
});

describe('useGenerateLabelPrompts', () => {
  it('makes a POST request to the label-prompts/generate-label-prompts endpoint', async () => {
    const mockResponse = { lens_config: {}, formatting_instructions: '' };
    axios.mockResolvedValueOnce({ data: mockResponse });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGenerateLabelPrompts(), {
      wrapper: Wrapper
    });

    await act(async () => {
      const res = await result.current.mutateAsync({
        title: 'title',
        description: 'description',
        tenantId: 'tenant-123'
      });

      expect(res).toEqual(mockResponse);

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: `${import.meta.env.VITE_LAMBDA_API}/label-prompts/generate-label-prompts`,
        data: {
          title: 'title',
          description: 'description',
          tenantId: 'tenant-123'
        },
        params: {},
        headers: {}
      });
    });
  });
});

describe('getOktaConfig', () => {
  it('makes a GET request to the okta/config endpoint', async () => {
    const mockResponse = { domain: 'domain', clientId: 'client-id' };
    axios.mockResolvedValueOnce({ data: mockResponse });

    await getOktaConfig('subdomain');
    expect(axios).toHaveBeenCalledWith({
      method: 'GET',
      url: `${import.meta.env.VITE_LAMBDA_API}/okta/config`,
      params: {
        subdomain: 'subdomain'
      },
      data: {},
      headers: {}
    });
  });
});

describe('useRingCentralOauth', () => {
  it('makes a POST request to the ringcentral/oauth endpoint', async () => {
    const mockResponse = {};
    axios.mockResolvedValueOnce({ data: mockResponse });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useRingCentralOauth(), {
      wrapper: Wrapper
    });

    await act(async () => {
      const res = await result.current.mutateAsync({
        code: 'code',
        tenantId: 'tenant-123'
      });

      expect(res).toEqual(mockResponse);

      expect(axios).toHaveBeenCalledWith({
        method: 'POST',
        url: `${import.meta.env.VITE_LAMBDA_API}/ringcentral/oauth`,
        data: {
          code: 'code',
          tenantId: 'tenant-123'
        },
        params: {},
        headers: {}
      });
    });
  });
});

describe('getPresignedUrl', () => {
  it('makes a POST request to the general/s3-presigned-url endpoint', async () => {
    const mockResponse = { url: 'https://test.com' };
    axios.mockResolvedValueOnce({ data: mockResponse });

    await getPresignedUrl({ command: 'get', bucket: 'test-bucket', fileName: '/test.pdf' });
    expect(axios).toHaveBeenCalledWith({
      method: 'POST',
      url: `${import.meta.env.VITE_LAMBDA_API}/general/s3-presigned-url`,
      data: { command: 'get', bucket: 'test-bucket', file_name: '/test.pdf' },
      headers: {},
      params: {}
    });
  });
});

describe('useZoomAccountSettings', () => {
  it('should call makeLambdaRequest with correct arguments and render fetched data', async () => {
    axios.mockResolvedValueOnce({
      data: {
        recording: true,
        auto_recording: 'local',
        cloud_recording: false
      }
    });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const TestComponent = () => {
      const { data, isLoading } = useZoomAccountSettings('zoom-cred-123');

      if (isLoading) return <p>Loading...</p>;
      if (data) return <div>Data: {JSON.stringify(data)}</div>;
      return null;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${import.meta.env.VITE_LAMBDA_API}/integrations/zoom/account-settings`,
        data: {},
        params: { zoom_oauth_credential_id: 'zoom-cred-123' },
        headers: {}
      });
    });
  });
});

describe('usePatchZoomAccountSettings', () => {
  it('makes a PATCH request to the integrations/zoom/account-settings endpoint', async () => {
    const mockResponse = { success: true };
    axios.mockResolvedValueOnce({ data: mockResponse });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePatchZoomAccountSettings(), {
      wrapper: Wrapper
    });

    await act(async () => {
      const res = await result.current.mutateAsync({
        zoom_oauth_credential_id: 'zoom-cred-123',
        auto_recording: 'cloud'
      });

      expect(res).toEqual(mockResponse);

      expect(axios).toHaveBeenCalledWith({
        method: 'PATCH',
        url: `${import.meta.env.VITE_LAMBDA_API}/integrations/zoom/account-settings`,
        data: {
          zoom_oauth_credential_id: 'zoom-cred-123',
          auto_recording: 'cloud'
        },
        params: {},
        headers: {}
      });
    });
  });
});

describe('useZoomUsers', () => {
  it('should call makeLambdaRequest with correct arguments and render fetched data', async () => {
    axios.mockResolvedValueOnce({
      data: {
        users: [
          {
            id: 'user1',
            first_name: 'John',
            last_name: 'Doe',
            email: 'john@example.com'
          }
        ]
      }
    });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const TestComponent = () => {
      const { data, isLoading } = useZoomUsers('zoom-cred-456');

      if (isLoading) return <p>Loading...</p>;
      if (data) return <div>Data: {JSON.stringify(data)}</div>;
      return null;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${import.meta.env.VITE_LAMBDA_API}/integrations/zoom/users`,
        data: {},
        params: { zoom_oauth_credential_id: 'zoom-cred-456' },
        headers: {}
      });
    });
  });
});

describe('useZoomUserSettings', () => {
  it('should call makeLambdaRequest with correct arguments and render fetched data', async () => {
    axios.mockResolvedValueOnce({
      data: {
        recording: true,
        auto_recording: 'local',
        user_id: 'user123'
      }
    });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const TestComponent = () => {
      const { data, isLoading } = useZoomUserSettings('zoom-cred-789', 'user123');

      if (isLoading) return <p>Loading...</p>;
      if (data) return <div>Data: {JSON.stringify(data)}</div>;
      return null;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    await waitFor(() => {
      expect(axios).toHaveBeenCalledWith({
        method: 'GET',
        url: `${import.meta.env.VITE_LAMBDA_API}/integrations/zoom/user-settings`,
        data: {},
        params: { zoom_oauth_credential_id: 'zoom-cred-789', user_id: 'user123' },
        headers: {}
      });
    });
  });
});

describe('usePatchZoomUserSettings', () => {
  it('makes a PATCH request to the integrations/zoom/user-settings endpoint', async () => {
    const mockResponse = { success: true };
    axios.mockResolvedValueOnce({ data: mockResponse });

    const Wrapper = ({ children }) => (
      <QueryClientProvider client={createQueryClient()}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => usePatchZoomUserSettings(), {
      wrapper: Wrapper
    });

    await act(async () => {
      const res = await result.current.mutateAsync({
        zoom_oauth_credential_id: 'zoom-cred-999',
        user_id: 'user456',
        auto_recording: 'none'
      });

      expect(res).toEqual(mockResponse);

      expect(axios).toHaveBeenCalledWith({
        method: 'PATCH',
        url: `${import.meta.env.VITE_LAMBDA_API}/integrations/zoom/user-settings`,
        data: {
          zoom_oauth_credential_id: 'zoom-cred-999',
          user_id: 'user456',
          auto_recording: 'none'
        },
        params: {},
        headers: {}
      });
    });
  });
});
