/*
  Script for splitting generated tests.

    My recipe:
  1. Install repomix
  2. Select a folder of components to test (`repomix src/components/person` for Person components)
  3. `cat repomix-output.txt | pbcopy`
  4. Paste it in Claude or whatever. Hint that you want output of tests in one file
  5. Copy and create a file somewhere (i.e personTests.js) with code like:
  ```
  // component-1.test.jsx
  ...

  // component-2.test.jsx
  ...
  ```
  6. node test/splitTests.js personTests.js test/components/person
  7. npx vitest --run test/person/components/**
*/

import fs from 'fs';
import path from 'path';

// Function to create directory if it doesn't exist
function ensureDirectoryExists(directory) {
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// Function to extract test blocks and write to files
function splitTestFile(inputContent, outputDir) {
  // Ensure output directory exists
  ensureDirectoryExists(outputDir);

  // Regular expression to match test file blocks
  const testFileRegex = /\/\/ ([^\.]+\.test\.jsx[\r\n]+)([\s\S]*?)(?=\/\/ [^\.]+\.test\.jsx|$)/g;

  let match;
  while ((match = testFileRegex.exec(inputContent)) !== null) {
    const fileName = match[1].trim();
    const fileContent = match[2].trim();

    // Create complete file content with imports
    const completeContent = `${fileContent}\n`;

    // Write to file
    const outputPath = path.join(outputDir, fileName);
    fs.writeFileSync(outputPath, completeContent, 'utf8');
    console.log(`Created: ${outputPath}`);
  }
}

// Main execution
function main() {
  const inputPath = process.argv[2];
  const outputDir = process.argv[3] || './test/components/person';

  if (!inputPath) {
    console.error('Please provide an input file path');
    process.exit(1);
  }

  try {
    // Read input file
    const inputContent = fs.readFileSync(inputPath, 'utf8');

    // Split and write test files
    splitTestFile(inputContent, outputDir);

    console.log('Test files have been successfully split!');
  } catch (error) {
    console.error('Error processing files:', error);
    process.exit(1);
  }
}

main();
