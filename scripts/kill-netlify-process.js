/**
 * Cross-platform utility to kill Netlify processes bound to a specific port
 *
 * This script identifies and terminates any processes using a specified port,
 * which is helpful when Netlify CLI fails to shut down properly. It supports
 * Windows, macOS, and Linux operating systems with platform-specific commands.
 *
 * Usage: node kill-netlify-process.js [port]
 * Default port is 8888 if not specified.
 */

import { execSync } from 'child_process';
import os from 'os';

const port = process.argv[2] || '8888';
const platform = os.platform();

console.log(`Checking for process on port ${port}...`);

let findProcessCmd;
let pid;

try {
  if (platform === 'win32') {
    findProcessCmd = `netstat -ano | findstr ":${port}"`;
    const output = execSync(findProcessCmd).toString();
    const lines = output.trim().split('\n');
    if (lines.length > 0) {
      const parts = lines[0].trim().split(/\s+/);
      pid = parts[parts.length - 1];
    }
  } else {
    findProcessCmd = `lsof -ti :${port} 2>/dev/null`;
    pid = execSync(findProcessCmd).toString().trim();
  }

  if (pid && pid !== '0') {
    console.log(`Found process ${pid} using port ${port}. Attempting to kill...`);
    try {
      if (platform === 'win32') {
        execSync(`taskkill /F /PID ${pid}`);
      } else {
        execSync(`kill -9 ${pid}`);
      }
      console.log(`Successfully killed process ${pid}.`);
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (killError) {
      console.error(`Failed to kill process ${pid}:`, killError.message);
    }
  } else {
    console.log(`No process found running on port ${port}.`);
  }
} catch (findError) {
  if (
    findError.stdout?.toString().includes('findstr') ||
    findError.stderr?.toString().includes('lsof')
  ) {
    console.log(`No process found running on port ${port} (command failed or returned no output).`);
  } else {
    console.error(`Error finding process on port ${port}:`, findError.message);
  }
}

console.log('Port check complete.');
