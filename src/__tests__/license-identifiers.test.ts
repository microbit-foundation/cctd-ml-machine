/**
 * @jest-environment jsdom
 */

import fs from 'fs';
import 'jest-expect-message';
import * as path from 'path';

// Place files you wish to ignore by name in here
const ignoredFiles: string[] = [];

const readFile = (fileLocation: string, expect: string) => {
  const fileContent = fs.readFileSync(fileLocation);
  return fileContent.toString().toLowerCase().includes(expect.toLowerCase());
};

type DirectoryContents = {
  files: string[];
  folders: string[];
};

const readDirectory = (directory: string, ignoreList: string[]): DirectoryContents => {
  const files: string[] = [];
  const folders: string[] = [];
  const filesRead = fs.readdirSync(directory);
  filesRead.forEach(file => {
    if (ignoreList.includes(file)) return;
    const fileLocation = path.join(directory, file);
    const stats = fs.statSync(fileLocation);
    if (stats.isFile()) {
      files.push(fileLocation);
    } else {
      folders.push(fileLocation);
    }
  });
  return { files: files, folders: folders };
};

const flattenDirectory = (directory: string): string[] => {
  const files: string[] = [];
  const content = readDirectory(directory, ignoredFiles);
  const filesFromSubFolders: string[] = [];
  content.folders.forEach(value => {
    const subFolderFlat = flattenDirectory(value);
    subFolderFlat.forEach(value => filesFromSubFolders.push(value));
  });
  filesFromSubFolders.forEach(value => files.push(value));
  content.files.forEach(value => files.push(value));
  return files;
};

const filesMissingIdentifier = (files: string[], expect: string): string[] => {
  const filesWithMissingIdentifier = [];

  for (let i = 0; i < files.length; i++) {
    if (!readFile('./' + files[i], expect)) {
      filesWithMissingIdentifier.push(files[i]);
    }
  }
  return filesWithMissingIdentifier;
};

const licenseIdentifierString =
  '(c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors';

describe('License identifier tests', () => {
  test(
    'All files should contain license identifier',
    () => {
      const flatten = flattenDirectory('./src/');
      const faultyFiles = filesMissingIdentifier(flatten, licenseIdentifierString);
      expect(
        faultyFiles.length,
        'Some files do not contain identifier! ' +
          faultyFiles
            .map(val => `\n \u001b[35m${val} \u001b[0mis missing identifier`)
            .join(),
      ).toEqual(0);
    },
    60000 * 10,
  );
});
