import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import axios from 'axios';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

// Mock dependencies
vi.mock('fs');
vi.mock('child_process');
vi.mock('axios');
vi.mock('@aws-sdk/client-s3');

// Dynamically import the plugin *after* mocks are set up
// Assuming the test file is in fora-frontend/test/build-helpers/
// and the plugin is in fora-frontend/build-helpers/
let buildInfoPluginModule;
let buildInfoPluginFn; // To hold the function exported by default
let mockS3ClientInstance;

describe('vite-build-info-plugin', () => {
  beforeEach(async () => {
    vi.resetAllMocks();

    mockS3ClientInstance = { send: vi.fn() };
    S3Client.mockImplementation(() => mockS3ClientInstance);
    GetObjectCommand.mockImplementation((input) => ({ type: 'GetObjectCommand', input }));

    // Default mock implementations for fs
    fs.readFileSync.mockImplementation((filePath) => {
      if (String(filePath).endsWith('package.json')) {
        return JSON.stringify({ name: 'test-app', version: '1.0.0' });
      }
      // Default for other files to avoid breaking path.resolve or other internal calls if any
      return '';
    });
    fs.writeFileSync.mockReturnValue(undefined);
    fs.existsSync.mockReturnValue(true);
    fs.readdirSync.mockReturnValue([]);
    fs.statSync.mockReturnValue({ isDirectory: () => false, isFile: () => true });

    execSync.mockReturnValue('test-branch');
    axios.get.mockResolvedValue({ data: { data: [] } });
    mockS3ClientInstance.send.mockResolvedValue({
      Body: { transformToString: async () => JSON.stringify([]) }
    });

    // Ensure dynamic import happens after mocks are fully set up each time if needed, or once if module caching is fine.
    buildInfoPluginModule = await import('../../build-helpers/vite-build-info.plugin.js');
    buildInfoPluginFn = buildInfoPluginModule.default;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create a build-info.json file with basic details and empty flags if APIs fail or return no data', async () => {
    const pluginInstance = buildInfoPluginFn();
    const mockConfig = { root: '/fake/project/root', env: { PROD: true } };

    // Simulate API/S3 errors or empty returns explicitly for this test
    axios.get.mockResolvedValueOnce({ data: { data: [] } }); // No flags from API
    mockS3ClientInstance.send.mockResolvedValueOnce({
      Body: { transformToString: async () => JSON.stringify([]) }
    }); // No serverless data

    await pluginInstance.configResolved(mockConfig);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    const writeCallArgs = fs.writeFileSync.mock.calls[0];
    expect(writeCallArgs[0]).toBe(path.resolve(mockConfig.root, 'build-helpers/build-info.json'));

    const buildInfoContent = JSON.parse(writeCallArgs[1]);
    expect(buildInfoContent.Name).toBe('test-app');
    expect(buildInfoContent.Version).toBe('1.0.0');
    expect(buildInfoContent.Branch).toBe('test-branch');
    expect(buildInfoContent['Build Date']).toBeDefined();
    expect(buildInfoContent['Build Time']).toBeDefined();
    expect(buildInfoContent.featureFlagUsage).toEqual([]);
  });

  it('should fetch flags from API and S3, scan frontend code, and combine usage', async () => {
    const pluginInstance = buildInfoPluginFn();
    const mockConfig = { root: '/fake/project/root/fora-frontend', env: { PROD: true } }; // Specific root for src path

    axios.get.mockResolvedValueOnce({
      data: {
        data: [{ name: 'flagOne' }, { name: 'flagTwo' }, { name: 'flagNotInCode' }]
      }
    });

    mockS3ClientInstance.send.mockResolvedValueOnce({
      Body: {
        transformToString: async () =>
          JSON.stringify([
            { name: 'flagTwo', codeStatus: 'Yes' },
            { name: 'flagSlsOnly', codeStatus: 'Commented' }
          ])
      }
    });

    // Mock fs for scanning frontend code
    const srcPath = path.resolve(mockConfig.root, 'src');
    fs.readdirSync.mockImplementation((dirPath) => {
      if (dirPath === srcPath) return ['file1.js', 'file2.js'];
      return [];
    });
    fs.statSync.mockImplementation((filePath) => {
      if (String(filePath).endsWith('.js')) return { isDirectory: () => false, isFile: () => true };
      // Important: for the base 'src' directory itself, it needs to be seen as a directory
      if (filePath === srcPath) return { isDirectory: () => true, isFile: () => false };
      return { isDirectory: () => false, isFile: () => true }; // Default for other files within src if any
    });

    fs.readFileSync.mockImplementation((filePath) => {
      if (String(filePath).endsWith('package.json')) {
        return JSON.stringify({ name: 'test-app', version: '1.0.0' });
      }
      if (String(filePath).includes('file1.js'))
        return 'const result = checkGate("flagOne");\n// const otherResult = checkGate("flagTwo");';
      if (String(filePath).includes('file2.js')) return "const someOtherVar = 'hello';";
      return '';
    });

    await pluginInstance.configResolved(mockConfig);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    const buildInfoContent = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    const usage = buildInfoContent.featureFlagUsage;

    expect(usage).toContainEqual({
      name: 'flagOne',
      frontendCodeStatus: 'Yes',
      serverlessCodeStatus: 'N/A'
    });
    expect(usage).toContainEqual({
      name: 'flagTwo',
      frontendCodeStatus: 'Commented',
      serverlessCodeStatus: 'Yes'
    });
    expect(usage).toContainEqual({
      name: 'flagNotInCode',
      frontendCodeStatus: 'No',
      serverlessCodeStatus: 'N/A'
    });
    expect(usage).toContainEqual({
      name: 'flagSlsOnly',
      frontendCodeStatus: 'N/A',
      serverlessCodeStatus: 'Commented'
    });
  });

  it('should handle error when fetching serverless usage from S3 (NoSuchKey)', async () => {
    const pluginInstance = buildInfoPluginFn();
    const mockConfig = { root: '/fake/project/root', env: { PROD: true } };

    const s3Error = new Error('File not found in S3');
    s3Error.name = 'NoSuchKey';
    mockS3ClientInstance.send.mockRejectedValueOnce(s3Error);
    axios.get.mockResolvedValueOnce({ data: { data: [{ name: 'apiFlag' }] } }); // API provides one flag

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await pluginInstance.configResolved(mockConfig);

    expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
    const buildInfoContent = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Could not fetch serverless Statsig usage from S3')
    );
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining(
        'File not found: s3://serverless-events/statsig-analyzed-flags/serverless.json'
      )
    );
    expect(buildInfoContent.featureFlagUsage).toEqual([
      { name: 'apiFlag', frontendCodeStatus: 'No', serverlessCodeStatus: 'N/A' }
    ]);
    consoleWarnSpy.mockRestore();
  });

  it('should handle generic error when fetching serverless usage from S3', async () => {
    const pluginInstance = buildInfoPluginFn();
    const mockConfig = { root: '/fake/project/root', env: { PROD: true } };

    mockS3ClientInstance.send.mockRejectedValueOnce(new Error('Generic S3 Error'));
    axios.get.mockResolvedValueOnce({ data: { data: [{ name: 'anotherApiFlag' }] } });

    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    await pluginInstance.configResolved(mockConfig);
    const buildInfoContent = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      'Could not fetch serverless Statsig usage from S3: Generic S3 Error'
    );
    expect(buildInfoContent.featureFlagUsage).toEqual([
      { name: 'anotherApiFlag', frontendCodeStatus: 'No', serverlessCodeStatus: 'N/A' }
    ]);
    consoleWarnSpy.mockRestore();
  });

  it('should handle error when fetching flag definitions from API', async () => {
    const pluginInstance = buildInfoPluginFn();
    const mockConfig = { root: '/fake/project/root', env: { PROD: true } };

    axios.get.mockRejectedValueOnce(new Error('API Fetch Error'));
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    await pluginInstance.configResolved(mockConfig);

    const buildInfoContent = JSON.parse(fs.writeFileSync.mock.calls[0][1]);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error fetching flag definitions from Statsig API: API Fetch Error'
    );
    // If API fails, allKnownFlagNames will be based only on serverlessFlagData (which is empty by default here)
    // So, effectively, featureFlagUsage should be empty or only contain serverless-only flags if S3 succeeded.
    // Let's make S3 also return empty for this specific test for clarity.
    mockS3ClientInstance.send.mockResolvedValueOnce({
      Body: { transformToString: async () => JSON.stringify([]) }
    });
    await pluginInstance.configResolved(mockConfig); // Re-run with S3 also empty
    const finalBuildInfoContent = JSON.parse(fs.writeFileSync.mock.calls[1][1]);
    expect(finalBuildInfoContent.featureFlagUsage).toEqual([]);
    consoleErrorSpy.mockRestore();
  });

  // Conceptual test for getAllFiles logic - as it's not directly exported
  describe('getAllFiles (conceptual test)', () => {
    const originalFs =
      // Store original fs methods
      {
        readdirSync: fs.readdirSync,
        statSync: fs.statSync
      };

    // This is a copy of the getAllFiles logic for testing purposes
    const testableGetAllFiles = (dirPath, arrayOfFiles = [], extensions, excludePatterns = []) => {
      const files = fs.readdirSync(dirPath);
      files.forEach((file) => {
        const fullPath = path.join(dirPath, file);
        if (
          excludePatterns.some((pattern) => fullPath.includes(pattern.replace(/\//g, path.sep)))
        ) {
          return;
        }
        if (fs.statSync(fullPath).isDirectory()) {
          testableGetAllFiles(fullPath, arrayOfFiles, extensions, excludePatterns);
        } else {
          if (extensions.includes(path.extname(file))) {
            arrayOfFiles.push(fullPath);
          }
        }
      });
      return arrayOfFiles;
    };

    beforeEach(() => {
      fs.readdirSync = vi.fn();
      fs.statSync = vi.fn();
    });

    afterEach(() => {
      fs.readdirSync = originalFs.readdirSync;
      fs.statSync = originalFs.statSync;
    });

    it('should find all files with specified extensions and exclude patterns', () => {
      fs.readdirSync.mockImplementation((dir) => {
        if (dir === 'src') return ['file1.js', 'sub', 'ignored.txt', 'test'];
        if (dir === path.join('src', 'sub')) return ['file2.jsx'];
        if (dir === path.join('src', 'test')) return ['testfile.js'];
        return [];
      });
      fs.statSync.mockImplementation((fp) => ({
        isDirectory: () => !fp.includes('.'), // Better check: anything without a dot is a directory
        isFile: () => fp.includes('.')
      }));

      // Test with just .js extension
      const files = testableGetAllFiles('src', [], ['.js'], [path.sep + 'test' + path.sep]);
      expect(files).toEqual([path.join('src', 'file1.js')]);
      expect(files).not.toContain(path.join('src', 'sub', 'file2.jsx'));
      expect(files).not.toContain(path.join('src', 'ignored.txt'));
      expect(files).not.toContain(path.join('src', 'test', 'testfile.js'));

      // Use toContain for more flexible testing that doesn't depend on order
      const filesWithBothExtensions = testableGetAllFiles(
        'src',
        [],
        ['.js', '.jsx'],
        [path.sep + 'test' + path.sep]
      );
      expect(filesWithBothExtensions).toContainEqual(path.join('src', 'file1.js'));
      expect(filesWithBothExtensions).toContainEqual(path.join('src', 'sub', 'file2.jsx'));
      expect(filesWithBothExtensions).not.toContainEqual(path.join('src', 'ignored.txt'));
      expect(filesWithBothExtensions).not.toContainEqual(path.join('src', 'test', 'testfile.js'));
      // Also check the length to ensure we have exactly 2 files
      expect(filesWithBothExtensions.length).toBe(2);
    });
  });
});
