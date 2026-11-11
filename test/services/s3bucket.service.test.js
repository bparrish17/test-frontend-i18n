import { QueryClient } from '@tanstack/react-query';
import { vi } from 'vitest';
import axios from 'axios';

import S3Bucket from '@services/s3bucket.service';

const API_URL = 'https://api.example.com';
const PRESIGNED_URL = 'https://example.com/test.txt';

vi.mock('axios');

vi.stubEnv('VITE_LAMBDA_API', API_URL);

describe('S3Bucket', () => {
  const fakeNow = Date.now();

  beforeEach(() => {
    vi.resetAllMocks();

    axios.mockImplementation((config) => {
      if (config.url === `${API_URL}/general/s3-presigned-url`) {
        return Promise.resolve({
          data: { url: PRESIGNED_URL }
        });
      }

      if (config.url === `${API_URL}/document-parser`) {
        return Promise.resolve({
          data: { success: true }
        });
      }

      if (config.url === PRESIGNED_URL) {
        return Promise.resolve({
          data: { fileKey: 'test.txt' }
        });
      }

      return Promise.resolve({ data: {} });
    });

    vi.useFakeTimers();
    vi.setSystemTime(fakeNow); // Freeze time
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  const createInstance = () => {
    const s3 = new S3Bucket('bucket', {
      queryClient: new QueryClient({
        defaultOptions: {
          queries: {
            retry: false
          }
        }
      }),
      user: {},
      tenant: { id: 'tenant-1' }
    });
    return s3;
  };

  const uploadTestFile = async (s3) => {
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const response = await s3.uploadFile(file, { fileKey: 'test.txt', fileName: 'test.txt' });
    return { s3Instance: s3, response };
  };

  it('should upload a single file to S3', async () => {
    const s3 = createInstance();
    const { response } = await uploadTestFile(s3);

    expect(response).toEqual('test.txt');
    expect(s3.files).toHaveLength(1);
    expect(s3.files[0].fileName).toBe('test.txt');
    // One call for presigned URL, one for upload
    expect(axios).toHaveBeenCalledTimes(2);
  });

  it('should upload a file with a custom file name', async () => {
    const s3 = createInstance();
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    await s3.uploadFile(file, { fileName: 'custom.txt' });

    expect(s3.files).toHaveLength(1);
    expect(s3.files[0].fileName).toBe('custom.txt');
  });

  it('should upload multiple files to S3', async () => {
    const s3 = createInstance();
    const file1 = new File(['test1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['test2'], 'test2.txt', { type: 'text/plain' });
    const file1Response = await s3.uploadFile(file1);
    const file2Response = await s3.uploadFile(file2);

    expect(file1Response).toEqual(`tenant-1/${fakeNow}_test1.txt`);
    expect(file2Response).toEqual(`tenant-1/${fakeNow}_test2.txt`);

    expect(s3.files).toHaveLength(2);
    expect(s3.files[0].file.name).toEqual('test1.txt');
    expect(s3.files[0].fileKey).toEqual(`tenant-1/${fakeNow}_test1.txt`);
    expect(s3.files[1].file.name).toEqual('test2.txt');
    expect(s3.files[1].fileKey).toEqual(`tenant-1/${fakeNow}_test2.txt`);
  });

  it('should sanitize filenames with invalid characters', async () => {
    const s3 = createInstance();
    const file = new File(['test'], 'my*illegal^file.txt', { type: 'text/plain' });
    const fileKey = await s3.uploadFile(file);
    expect(fileKey).toEqual(`tenant-1/${fakeNow}_myillegalfile.txt`);
    expect(s3.files[0].fileKey).toEqual(`tenant-1/${fakeNow}_myillegalfile.txt`);
  });

  it('should handle filenames with only invalid characters by defaulting to "file"', async () => {
    const s3 = createInstance();
    const file = new File(['test'], '***^^^', { type: 'text/plain' });
    const fileKey = await s3.uploadFile(file);
    expect(fileKey).toEqual(`tenant-1/${fakeNow}_file`);
    expect(s3.files[0].fileKey).toEqual(`tenant-1/${fakeNow}_file`);
  });

  it('should preserve allowed special characters in filenames', async () => {
    const s3 = createInstance();
    const file = new File(['test'], 'file!@#$.txt', { type: 'text/plain' });
    const fileKey = await s3.uploadFile(file);
    // $ is not allowed, so it should be removed
    expect(fileKey).toEqual(`tenant-1/${fakeNow}_file!@#.txt`);
    expect(s3.files[0].fileKey).toEqual(`tenant-1/${fakeNow}_file!@#.txt`);
  });

  it('should queue multiple files for summarization', async () => {
    const s3 = createInstance();
    const file1 = new File(['test1'], 'test1.txt', { type: 'text/plain' });
    const file2 = new File(['test2'], 'test2.txt', { type: 'text/plain' });
    await s3.uploadFile(file1);
    await s3.uploadFile(file2);

    const result = await s3.queueDocumentParsing();
    expect(result).toEqual({ success: true });
    // state is reset after queueing
    expect(s3.files).toHaveLength(0);
  });

  it('should throw if no files were uploaded to the instance', async () => {
    const s3 = createInstance();
    await expect(s3.queueDocumentParsing()).rejects.toThrow('Files have to be uploaded first');
  });
});
