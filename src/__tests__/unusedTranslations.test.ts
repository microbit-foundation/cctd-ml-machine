/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import en from './../messages/ui.en.json';
import * as fs from 'fs';
import * as path from 'path';

const ignoredFiles = ['translations.ts', 'smoothie.js', '__tests__'];

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

const filesIncludesExpression = (files: string[], expect: string): boolean => {
  for (let i = 0; i < files.length; i++) {
    if (readFile('./' + files[i], expect)) {
      return true;
    }
  }
  return false;
};

test(
  'All translations should be used',
  () => {
    const translationKeys = Object.getOwnPropertyNames(en);
    const flatten = flattenDirectory('./src/');
    for (let i = 0; i < translationKeys.length; i++) {
      const translationKey = translationKeys[i];
      expect(
        filesIncludesExpression(flatten, translationKey),
        "unused translation --> '" +
          translationKey +
          "' \n confirm with command .. \n grep -rnw ./src -e '" +
          translationKey +
          "'",
      ).toEqual(true);
    }
  },
  60000 * 10,
);
