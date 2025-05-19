/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import fs from 'fs';
import * as path from 'path';

export interface DirectoryContents {
  files: string[];
  folders: string[];
}

export const readDirectory = (
  directory: string,
  ignoreList: string[],
): DirectoryContents => {
  const files: string[] = [];
  const folders: string[] = [];
  const filesRead = fs.readdirSync(directory);
  filesRead.forEach(file => {
    if (ignoreList.includes(file)) return;
    if (file.endsWith('.json')) return; // Json cant have comments
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

export const getFilesInDirectory = (
  directory: string,
  ignoredFiles: string[] = [],
): string[] => {
  const files: string[] = [];
  const content = readDirectory(directory, ignoredFiles);
  const filesFromSubFolders: string[] = [];
  content.folders.forEach(value => {
    const subFolderFlat = getFilesInDirectory(value, ignoredFiles);
    subFolderFlat.forEach(value => filesFromSubFolders.push(value));
  });
  filesFromSubFolders.forEach(value => files.push(value));
  content.files.forEach(value => files.push(value));
  return files;
};
