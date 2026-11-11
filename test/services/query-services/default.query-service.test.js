import { describe, it, expect, vi } from 'vitest';
import Axios from 'axios';
import {
  getById,
  getVideoContentType,
  getByAttribute,
  deleteAttribute,
  usePrefetchInfiniteSearchQuery,
  infiniteSearch
} from '@services/query-services/default.query-service';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';

vi.mock('axios'); // Mock Axios

vi.mock('@tanstack/react-query', () => ({
  ...vi.importActual('@tanstack/react-query'),
  useQueryClient: vi.fn(),
  QueryClient: vi.fn()
}));

vi.mock('@services/query-services/default.query-service', async (importOriginal) => {
  // ...(await importOriginal('@services/query-services/default.query-service')),
  // const originalModule = await importOriginal('@services/query-services/default.query-service');
  return {
    ...(await importOriginal('@services/query-services/default.query-service')),
    infiniteSearch: vi.fn()
  };
});

const queryClient = new QueryClient();

/****************************************************
 * API Calls
 ****************************************************/

describe('getVideoContentType', () => {
  it('should return the correct content type of the video', async () => {
    const videoUrl = 'https://example.com/video.mp4';
    const mockContentType = 'video/mp4';

    // Mock Axios response
    Axios.mockResolvedValue({
      headers: {
        'content-type': mockContentType
      }
    });

    // Call the function
    const result = await getVideoContentType(videoUrl);

    // Assertions
    expect(Axios).toHaveBeenCalledWith({
      method: 'GET',
      url: videoUrl,
      headers: {
        Range: 'bytes=0-1'
      }
    });

    expect(result).toEqual({ contentType: mockContentType });
  });

  it('should throw an error if the request fails', async () => {
    const videoUrl = 'https://example.com/video.mp4';

    // Mock Axios to throw an error
    Axios.mockRejectedValue(new Error('Request failed'));

    // Assertions for error
    await expect(getVideoContentType(videoUrl)).rejects.toThrow('Request failed');
  });
});

describe('getById', () => {
  afterEach(() => {
    vi.clearAllMocks(); // Clear mock calls and instances between tests
  });

  it('should make a GET request with the correct URL and params for model "cards"', async () => {
    // Mock Axios response
    const mockResponse = { data: { id: '12345', name: 'Test Card' } };
    Axios.mockResolvedValue(mockResponse);

    const result = await getById({ model: 'cards', id: '12345' });

    expect(Axios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/cards/12345',
      params: { more: true, full: true },
      headers: {} // Default empty headers
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('should make a GET request with the correct URL and no params for other models', async () => {
    const mockResponse = { data: { id: '67890', name: 'Test User' } };
    Axios.mockResolvedValue(mockResponse);

    const result = await getById({ model: 'users', id: '67890' });

    expect(Axios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/users/67890',
      params: {}, // No params for non-"cards" model
      headers: {} // Default empty headers
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('should include optional headers if provided', async () => {
    const mockResponse = { data: { id: '12345', name: 'Test Card' } };
    Axios.mockResolvedValue(mockResponse);

    const result = await getById({
      model: 'cards',
      id: '12345',
      headers: { 'X-Fora-Actor': 'manual' }
    });

    expect(Axios).toHaveBeenCalledWith({
      method: 'GET',
      url: '/cards/12345',
      params: { more: true, full: true },
      headers: { 'X-Fora-Actor': 'manual' }
    });

    expect(result).toEqual(mockResponse.data);
  });
});

describe('getByAttribute', () => {
  it('should fetch data based on model, id, and attribute', async () => {
    // Mocked response
    const mockResponse = { data: { someKey: 'someValue' } };
    Axios.mockResolvedValue(mockResponse);

    // Call the function with test inputs
    const model = 'testModel';
    const id = '123';
    const attribute = 'testAttribute';
    const result = await getByAttribute({ model, id, attribute });

    // Assertions
    expect(Axios).toHaveBeenCalledWith({
      method: 'GET',
      url: `/${model}/${id}/${attribute}`
    });

    expect(result).toEqual(mockResponse.data);
  });

  it('should handle cases where no data is returned', async () => {
    // Mocked response with no data
    Axios.mockResolvedValue({});

    // Call the function
    const result = await getByAttribute({
      model: 'testModel',
      id: '123',
      attribute: 'testAttribute'
    });

    // Assertions
    expect(result).toBeUndefined();
  });

  it('should handle request failures gracefully', async () => {
    // Mocked error response
    Axios.mockRejectedValue(new Error('Request failed'));

    // Call the function and expect it to throw
    await expect(
      getByAttribute({ model: 'testModel', id: '123', attribute: 'testAttribute' })
    ).rejects.toThrow('Request failed');
  });
});

describe('deleteAttribute', () => {
  const model = 'meetings';
  const attribute = 'share';

  it('should send a DELETE request with the correct URL and parameters', async () => {
    const mockResponse = { success: true };
    Axios.mockResolvedValue(mockResponse); // Mock Axios response

    const queryParameters = { force: true };
    const data = { id: 123, body: ['keanu@fora.day'] };

    const deleteFn = deleteAttribute({ model, attribute, queryParameters });
    const response = await deleteFn(data);

    // Check Axios call
    expect(Axios).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'meetings/123/share',
      params: { wait: true, force: true },
      data: ['keanu@fora.day']
    });

    // Check response
    expect(response).toEqual(mockResponse);
  });

  it('should handle missing queryParameters', async () => {
    const mockResponse = { success: true };
    Axios.mockResolvedValue(mockResponse); // Mock Axios response

    const data = { id: 456, body: ['vinnie@fora.day'] };
    const deleteFn = deleteAttribute({ model, attribute });
    const response = await deleteFn(data);

    // Check Axios call
    expect(Axios).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'meetings/456/share',
      params: { wait: true }, // Default wait:true should be added
      data: ['vinnie@fora.day']
    });

    // Check response
    expect(response).toEqual(mockResponse);
  });

  it('should handle missing body', async () => {
    const mockResponse = { success: true };
    Axios.mockResolvedValue(mockResponse); // Mock Axios response

    const data = { id: 456 };
    const deleteFn = deleteAttribute({ model, attribute });
    const response = await deleteFn(data);

    // Check Axios call
    expect(Axios).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'meetings/456/share',
      params: { wait: true }
    });

    // Check response
    expect(response).toEqual(mockResponse);
  });
});

/****************************************************
 * Prefetching
 ****************************************************/

describe('usePrefetchInfiniteSearchQuery', () => {
  const model = 'testModel';
  const defaultBody = { serviceKey: 'serviceValue' };
  const body = { componentKey: 'componentValue' };
  const queryOptions = { staleTime: 1000 };

  beforeEach(() => {
    vi.clearAllMocks();
    useQueryClient.mockReturnValue(queryClient);
    infiniteSearch.mockImplementation(({ pageParam, body: { pageSize = 50 } }) => ({
      nextPage: pageParam + 1,
      page: pageParam,
      pageSize
    }));
  });

  it('should return a function', async () => {
    const { result } = renderHook(() =>
      usePrefetchInfiniteSearchQuery({ model, defaultBody })(body, queryOptions)
    );
    expect(result.current).toBeInstanceOf(Function);
  });

  it('should invoke queryClient.prefetchInfiniteQuery', async () => {
    queryClient.prefetchInfiniteQuery = vi.fn();

    const { result } = renderHook(() =>
      usePrefetchInfiniteSearchQuery({ model, defaultBody })(body, queryOptions)
    );

    await result.current();

    expect(queryClient.prefetchInfiniteQuery).toHaveBeenCalled();
  });

  it('should invoke queryClient.prefetchInfiniteQuery with service-level params', async () => {
    queryClient.prefetchInfiniteQuery = vi.fn();

    const { result } = renderHook(() =>
      usePrefetchInfiniteSearchQuery({
        model: 'service-model',
        defaultBody: { ...defaultBody, hello: 'world' }
      })(body, queryOptions)
    );

    await result.current();

    expect(queryClient.prefetchInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: ['service-model', body]
      })
    );
  });

  it('should invoke queryClient.prefetchInfiniteQuery with component-level params', async () => {
    queryClient.prefetchInfiniteQuery = vi.fn();
    const selectMock = vi.fn();
    const { result } = renderHook(() =>
      usePrefetchInfiniteSearchQuery({
        model: 'service-model'
      })({ howdy: 'partner' }, { select: selectMock })
    );

    await result.current();

    expect(queryClient.prefetchInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        select: selectMock,
        queryKey: ['service-model', { howdy: 'partner' }]
      })
    );
  });

  it('should invoke queryClient.prefetchInfiniteQuery with getNextPage and queryFn function params', async () => {
    queryClient.prefetchInfiniteQuery = vi.fn();
    const { result } = renderHook(() =>
      usePrefetchInfiniteSearchQuery({ model })({ hello: 'world' })
    );

    await result.current();

    expect(queryClient.prefetchInfiniteQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryFn: expect.any(Function),
        getNextPageParam: expect.any(Function)
      })
    );
  });
});
