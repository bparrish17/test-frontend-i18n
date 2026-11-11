import { describe, it, expect, vi, beforeEach } from 'vitest';
import Axios from 'axios';
import {
  authenticateWithGoogle,
  authenticateWithMicrosoft,
  authenticateWithOkta
} from '@services/oauth.service';

vi.mock('axios');

describe('authenticateWith', () => {
  const mockAccessToken = 'mockAccessToken';
  const mockIdToken = 'mockIdToken';
  const mockResponse = { data: { success: true } };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should make a single successful non-guest login request', async () => {
    Axios.mockResolvedValueOnce(mockResponse);

    const result = await authenticateWithGoogle(mockAccessToken);

    // Assertions
    expect(Axios).toHaveBeenCalledTimes(1);
    expect(Axios).toHaveBeenCalledWith({
      method: 'POST',
      url: 'oauth/google',
      data: { accessToken: mockAccessToken, rememberMe: true, guest: false }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('should make a second guest login request if non-guest login fails', async () => {
    Axios.mockRejectedValueOnce(new Error('Non-guest login failed')); // First request fails
    Axios.mockResolvedValueOnce(mockResponse); // Second request succeeds

    const result = await authenticateWithGoogle(mockAccessToken, mockIdToken);

    // Assertions
    expect(Axios).toHaveBeenCalledTimes(2);
    expect(Axios).toHaveBeenNthCalledWith(1, {
      method: 'POST',
      url: 'oauth/google',
      data: { accessToken: mockAccessToken, idToken: mockIdToken, rememberMe: true, guest: false }
    });
    expect(Axios).toHaveBeenNthCalledWith(2, {
      method: 'POST',
      url: 'oauth/google',
      data: { accessToken: mockAccessToken, idToken: mockIdToken, rememberMe: true, guest: true }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('should throw an error if both login attempts fail', async () => {
    Axios.mockRejectedValue(new Error('Both attempts failed'));

    await expect(authenticateWithGoogle(mockAccessToken, mockIdToken)).rejects.toThrow(
      'Both attempts failed'
    );

    // Assertions
    expect(Axios).toHaveBeenCalledTimes(2);
    expect(Axios).toHaveBeenNthCalledWith(1, {
      method: 'POST',
      url: 'oauth/google',
      data: { accessToken: mockAccessToken, idToken: mockIdToken, rememberMe: true, guest: false }
    });
    expect(Axios).toHaveBeenNthCalledWith(2, {
      method: 'POST',
      url: 'oauth/google',
      data: { accessToken: mockAccessToken, idToken: mockIdToken, rememberMe: true, guest: true }
    });
  });

  it('should work for microsoft', async () => {
    Axios.mockResolvedValueOnce(mockResponse);

    const result = await authenticateWithMicrosoft(mockAccessToken, mockIdToken);
    // Assertions
    expect(Axios).toHaveBeenCalledTimes(1);

    // Microsoft
    expect(Axios).toHaveBeenNthCalledWith(1, {
      method: 'POST',
      url: 'oauth/microsoft',
      data: { accessToken: mockAccessToken, idToken: mockIdToken, rememberMe: true, guest: false }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('should work for okta', async () => {
    Axios.mockResolvedValueOnce(mockResponse);

    const result = await authenticateWithOkta(mockAccessToken, mockIdToken);
    // Assertions
    expect(Axios).toHaveBeenCalledTimes(1);

    // Microsoft
    expect(Axios).toHaveBeenNthCalledWith(1, {
      method: 'POST',
      url: 'oauth/okta',
      data: { accessToken: mockAccessToken, idToken: mockIdToken, rememberMe: true, guest: false }
    });
    expect(result).toEqual(mockResponse.data);
  });

  it('should allow domain and realm to be passed in', async () => {
    Axios.mockResolvedValueOnce(mockResponse);

    const result = await authenticateWithOkta(
      mockAccessToken,
      mockIdToken,
      'trial-7694437',
      'custom'
    );
    // Assertions
    expect(Axios).toHaveBeenCalledTimes(1);

    // Microsoft
    expect(Axios).toHaveBeenNthCalledWith(1, {
      method: 'POST',
      url: 'oauth/okta',
      data: {
        accessToken: mockAccessToken,
        idToken: mockIdToken,
        rememberMe: true,
        guest: false,
        domain: 'trial-7694437',
        realm: 'custom'
      }
    });
    expect(result).toEqual(mockResponse.data);
  });
});
