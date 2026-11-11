import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { format as formatDateFns, utcToZonedTime } from 'date-fns-tz';
import { format as formatDate } from 'date-fns';
import axios from 'axios';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';

/**
 * Recursively retrieves all files from a directory and its subdirectories
 * that match the given extensions and do not match exclusion patterns.
 * @param {string} dirPath - The path to the directory to scan.
 * @param {string[]} [arrayOfFiles=[]] - Accumulator for file paths (used for recursion).
 * @param {string[]} extensions - Array of file extensions to include (e.g., ['.js', '.jsx']).
 * @param {string[]} [excludePatterns=[]] - Array of string patterns. Files/directories whose paths include any of these patterns will be excluded.
 * @returns {string[]} An array of absolute file paths.
 */
const getAllFiles = (dirPath, arrayOfFiles = [], extensions, excludePatterns = []) => {
  const files = fs.readdirSync(dirPath);
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (excludePatterns.some((pattern) => fullPath.includes(pattern.replace(/\//g, path.sep)))) {
      return;
    }
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles, extensions, excludePatterns);
    } else {
      if (extensions.includes(path.extname(file))) {
        arrayOfFiles.push(fullPath);
      }
    }
  });
  return arrayOfFiles;
};

// --- Constants ---
const S3_BUCKET_SERVERLESS_USAGE = 'serverless-events';
const S3_KEY_SERVERLESS_USAGE = 'statsig-analyzed-flags/serverless.json';
const STATSIG_GATES_API_URL = 'https://app.fora.day/.netlify/functions/get-feature-gates';

// --- Refactored Helper Functions for buildInfoPlugin ---

/**
 * Extracts basic build details like name, version, branch, and build timestamp.
 * @param {string} packageJsonPath - Absolute path to the package.json file.
 * @returns {Promise<object>} An object containing name, version, branch, buildDate, and buildTime.
 */
async function getBasicBuildDetails(packageJsonPath) {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const version = packageJson.version;
  const name = packageJson.name;
  let branch = 'unknown';
  try {
    branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (e) {
    console.warn('Could not determine git branch:', e.message);
  }
  const commitHash = execSync('git rev-parse HEAD').toString().trim();
  const buildDate = formatDate(new Date(), 'EEE, MMM d yyyy');
  const estTimeZone = 'America/New_York';
  const buildTime = formatDateFns(utcToZonedTime(new Date(), estTimeZone), 'hh:mm:ss a zzz', {
    timeZone: estTimeZone
  });
  return { name, version, branch, buildDate, buildTime, commitHash };
}

/**
 * Fetches and parses the serverless Statsig usage JSON from S3.
 * @param {string} awsRegion - The AWS region where the S3 bucket resides.
 * @returns {Promise<Array<object>>} An array of serverless flag usage data, or an empty array if fetch fails.
 */
async function fetchServerlessFlagUsage(awsRegion, viteEnv = {}) {
  let serverlessFlagData = [];
  if (!viteEnv.PROD) return serverlessFlagData;

  try {
    console.log(
      `Fetching serverless Statsig usage from s3://${S3_BUCKET_SERVERLESS_USAGE}/${S3_KEY_SERVERLESS_USAGE}`
    );
    console.log(`AWS Region: ${awsRegion}`);

    // Try to get AWS credentials from multiple sources (CI credentials first)
    const awsAccessKeyId =
      viteEnv.AWS_ACCESS_KEY_ID_FOR_CI ||
      process.env.AWS_ACCESS_KEY_ID_FOR_CI ||
      viteEnv.VITE_AWS_ACCESS_KEY_ID ||
      process.env.VITE_AWS_ACCESS_KEY_ID ||
      process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey =
      viteEnv.AWS_SECRET_ACCESS_KEY_FOR_CI ||
      process.env.AWS_SECRET_ACCESS_KEY_FOR_CI ||
      viteEnv.VITE_AWS_SECRET_ACCESS_KEY ||
      process.env.VITE_AWS_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY;

    console.log(
      `AWS Access Key ID: ${awsAccessKeyId ? awsAccessKeyId.substring(0, 8) + '...' : 'NOT SET'}`
    );
    console.log(`AWS Secret Access Key: ${awsSecretAccessKey ? 'SET' : 'NOT SET'}`);

    const s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey
      }
    });
    const command = new GetObjectCommand({
      Bucket: S3_BUCKET_SERVERLESS_USAGE,
      Key: S3_KEY_SERVERLESS_USAGE
    });
    const response = await s3Client.send(command);
    const bodyContents = await response.Body?.transformToString('utf-8');
    if (bodyContents) {
      serverlessFlagData = JSON.parse(bodyContents);
      console.log(
        `Successfully fetched serverless Statsig usage from S3 (${serverlessFlagData.length} flags).`
      );
    } else {
      console.warn('S3 object body for serverless usage was empty or not transformable to string.');
    }
  } catch (s3Error) {
    console.warn(`Could not fetch serverless Statsig usage from S3: ${s3Error.message}`);
    if (s3Error.name === 'NoSuchKey') {
      console.warn(`File not found: s3://${S3_BUCKET_SERVERLESS_USAGE}/${S3_KEY_SERVERLESS_USAGE}`);
    }
  }
  return serverlessFlagData;
}

/**
 * Fetches all feature flag definitions (names) from the central Statsig API endpoint.
 * @returns {Promise<Array<string>>} An array of flag names, or an empty array if fetch fails.
 */
async function fetchAllFlagNamesFromApi(viteEnv) {
  let flagNamesFromApi = [];
  if (!viteEnv.PROD) return flagNamesFromApi;

  try {
    console.log(`Fetching all flag definitions from ${STATSIG_GATES_API_URL}...`);
    const response = await axios.get(STATSIG_GATES_API_URL);
    if (response.data && Array.isArray(response.data.data)) {
      flagNamesFromApi = response.data.data.map((gate) => gate.name).filter((name) => name);
      console.log(`Fetched ${flagNamesFromApi.length} flag names from Statsig API.`);
    } else {
      console.warn('Statsig API flag definitions not in expected format.');
    }
  } catch (error) {
    console.error(`Error fetching flag definitions from Statsig API: ${error.message}`);
  }
  return flagNamesFromApi;
}

/**
 * Scans the specified codebase path for usage of the given flag names.
 * @param {string} projectSrcPath - The root path of the source code to scan.
 * @param {Array<string>} flagNames - An array of flag names to search for.
 * @param {Array<string>} relevantExtensions - File extensions to include in the scan (e.g., ['.js', '.jsx']).
 * @param {Array<string>} excludeDirSegments - Directory name segments to exclude from scanning.
 * @returns {object} An object mapping flag names to their usage status ({ codeStatus: 'Yes'/'No'/'Commented' }).
 */
function scanCodebaseForFlags(
  projectSrcPath,
  flagNames,
  relevantExtensions,
  excludeDirSegments,
  viteEnv
) {
  const scannedUsage = {}; // Store as { flagName: { codeStatus: 'Yes'/'No'/'Commented'}}
  if (!viteEnv.PROD) return scannedUsage;

  const excludePatterns = excludeDirSegments.map(
    (segment) => `${path.sep}${segment.split(path.sep).pop()}${path.sep}`
  );
  let allRelevantFiles = [];
  if (fs.existsSync(projectSrcPath)) {
    allRelevantFiles = getAllFiles(projectSrcPath, [], relevantExtensions, excludePatterns);
  }
  console.log(
    `Scanning ${allRelevantFiles.length} files in ${projectSrcPath} for ${flagNames.length} flags...`
  );

  for (const flagName of flagNames) {
    if (!flagName || typeof flagName !== 'string' || flagName.trim() === '') continue;

    let totalOccurrences = 0;
    let activeOccurrences = 0;
    const escapedFlagNameForRegex = flagName.replace(/[.*+?^${}()|[\\\]]/g, '\\$&');

    // Create specific patterns for feature gate usage
    const featureGatePatterns = [
      // checkGate('flagName') or checkGate("flagName")
      `checkGate\\s*\\(\\s*['"]${escapedFlagNameForRegex}['"]\\s*\\)`,
      // checkGate(user, 'flagName') or checkGate(user, "flagName")
      `checkGate\\s*\\([^,]+,\\s*['"]${escapedFlagNameForRegex}['"]\\s*\\)`,
      // Statsig.checkGate(user, 'flagName')
      `Statsig\\.checkGate\\s*\\([^,]+,\\s*['"]${escapedFlagNameForRegex}['"]\\s*\\)`,
      // useFeatureGate('flagName') or similar hooks
      `useFeatureGate\\s*\\(\\s*['"]${escapedFlagNameForRegex}['"]\\s*\\)`,
      // Any other .checkGate patterns
      `\\.checkGate\\s*\\([^,]*,?\\s*['"]${escapedFlagNameForRegex}['"]\\s*\\)`
    ];

    const combinedPattern = featureGatePatterns.join('|');
    const featureGateRegex = new RegExp(combinedPattern, 'gi');
    const activeLinePattern = `^(?![ \t\r\n\f\v]*//).*(?:${combinedPattern})`;

    for (const filePath of allRelevantFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const matches = content.match(featureGateRegex) || [];
        totalOccurrences += matches.length;

        const lines = content.split('\n');
        for (const line of lines) {
          if (new RegExp(activeLinePattern, 'i').test(line)) {
            activeOccurrences++;
          }
        }
      } catch (fileReadError) {
        /* ignore */
      }
    }
    let status = 'No';
    if (totalOccurrences > 0) status = activeOccurrences > 0 ? 'Yes' : 'Commented';
    scannedUsage[flagName] = { codeStatus: status };
  }
  return scannedUsage;
}

// --- Main Plugin Function ---
/**
 * Vite plugin to generate build information.
 * This includes basic build details, feature flag usage from the frontend codebase,
 * and feature flag usage from the serverless codebase (fetched from S3).
 * The combined information is written to `build-helpers/build-info.json`.
 * @returns {import('vite').Plugin}
 The Vite plugin object.
 */
export default function buildInfoPlugin() {
  return {
    name: 'vite-plugin-build-info',
    async configResolved(config) {
      // Access environment variables from Vite's config
      const viteEnv = config.env || {};
      const basicDetails = await getBasicBuildDetails(path.resolve(config.root, 'package.json'));

      const awsRegion = process.env.AWS_REGION || 'us-east-1';
      const serverlessFlagData = await fetchServerlessFlagUsage(awsRegion, viteEnv);
      const flagNamesFromApi = await fetchAllFlagNamesFromApi(viteEnv);

      const projectSrcPathFE = path.resolve(config.root, 'src');
      const relevantExtensionsFE = ['.js', '.jsx', '.ts', '.tsx'];
      const excludeDirSegmentsFE = [path.join('src', 'test'), path.join('src', '__mocks__')];
      const frontendFlagUsage = scanCodebaseForFlags(
        projectSrcPathFE,
        flagNamesFromApi,
        relevantExtensionsFE,
        excludeDirSegmentsFE,
        viteEnv
      );

      // Combine data
      const combinedFeatureUsage = [];
      const allKnownFlagNames = new Set([
        ...flagNamesFromApi,
        ...serverlessFlagData.map((f) => f.name)
      ]);

      for (const flagName of allKnownFlagNames) {
        if (!flagName) continue;
        const feUsage = frontendFlagUsage[flagName];
        const serverlessEntry = serverlessFlagData.find((sf) => sf.name === flagName);

        combinedFeatureUsage.push({
          name: flagName,
          frontendCodeStatus: feUsage
            ? feUsage.codeStatus
            : flagNamesFromApi.includes(flagName)
            ? 'No'
            : 'N/A',
          serverlessCodeStatus: serverlessEntry ? serverlessEntry.codeStatus : 'N/A'
        });
      }

      const buildInfo = {
        Name: basicDetails.name,
        Version: basicDetails.version,
        Branch: basicDetails.branch,
        Env: process.env.NODE_ENV || config.mode,
        'Build Date': basicDetails.buildDate,
        'Build Time': basicDetails.buildTime,
        'Commit Hash': basicDetails.commitHash,
        featureFlagUsage: combinedFeatureUsage
      };

      const buildInfoPath = path.resolve(config.root, 'build-helpers/build-info.json');
      fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2), 'utf-8');
      if (viteEnv.PROD)
        console.log(`Build info with combined feature flag usage written to ${buildInfoPath}`);
    }
  };
}
