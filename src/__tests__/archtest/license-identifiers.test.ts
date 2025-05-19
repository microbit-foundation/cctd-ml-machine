/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import fs from 'fs';
import * as path from 'path';
import { getFilesInDirectory } from './fileloader';

// Place files you wish to ignore by name in here
const ignoredFiles: string[] = ['.DS_Store', 'ui.da.json', 'ui.en.json', 'README.md'];
const directoriesToScan = ['./src/', './microbit/v2/source/', './microbit/v1/source/'];

const copyrightTime = '(c) 2023-2025';

const licenseIdentifierStringContributors =
  'Center for Computational Thinking and Design at Aarhus University and contributors';

const licenseIdentifierStringSPDX = 'SPDX-License-Identifier:';

const readFile = (fileLocation: string, expect: string) => {
  const fileContent = fs.readFileSync(fileLocation);
  return fileContent.toString().toLowerCase().includes(expect.toLowerCase());
};

const filesMissingIdentifier = (files: string[], expects: string[]): string[] => {
  const filesWithMissingIdentifier: string[] = [];

  for (let i = 0; i < files.length; i++) {
    for (const expect of expects) {
      if (!readFile('./' + files[i], expect)) {
        if (!filesWithMissingIdentifier.includes(files[i])) {
          filesWithMissingIdentifier.push(files[i]);
        }
      }
    }
  }
  return filesWithMissingIdentifier;
};

describe('License identifier tests', () => {
  test(
    'All files should contain license identifier',
    () => {
      const flatten = directoriesToScan.reduce((acc: string[], current) => {
        return acc.concat(getFilesInDirectory(current, ignoredFiles));
      }, []);

      const faultyFiles = filesMissingIdentifier(flatten, [
        licenseIdentifierStringContributors,
        licenseIdentifierStringSPDX,
        copyrightTime,
      ]);
      expect(
        faultyFiles.length,
        'Some files do not contain identifier! ' +
          faultyFiles
            .map(val => `\n \u001b[35m${val} \u001b[0mis missing license identifier`)
            .join(),
      ).toEqual(0);
    },
    60000 * 10,
  );
});
