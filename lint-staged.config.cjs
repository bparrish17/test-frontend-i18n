const { ESLint } = require('eslint');

/**
 * Filters out files that are ignored by ESLint.
 * @param {string[]} files - An array of file paths to filter.
 * @returns {Promise<string>} A promise that resolves to a space-separated string of non-ignored file paths.
 */
const removeIgnoredFiles = async (files) => {
  const eslint = new ESLint();
  const isIgnored = await Promise.all(
    files.map((file) => {
      return eslint.isPathIgnored(file);
    })
  );
  const filteredFiles = files.filter((_, i) => !isIgnored[i]);
  return filteredFiles.join(' '); // Join files into a space-separated string
};

module.exports = {
  /**
   * Linter and formatter commands for JavaScript/TypeScript files.
   * Filters out ESLint-ignored files, then runs Prettier and ESLint.
   * @param {string[]} files - An array of file paths provided by lint-staged.
   * @returns {Promise<string[]>} A promise that resolves to an array of commands to run.
   */
  '*.{js,jsx,ts,tsx}': async (files) => {
    const filesToProcess = await removeIgnoredFiles(files);
    // Ensure filesToProcess is not empty before constructing commands
    if (!filesToProcess || filesToProcess.length === 0) {
      return [];
    }
    return [
      `prettier --write ${filesToProcess}`,
      `eslint --max-warnings=0 ${filesToProcess}`
    ];
  }
};
