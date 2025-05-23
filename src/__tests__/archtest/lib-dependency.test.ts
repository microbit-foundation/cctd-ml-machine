/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { readFileSync } from 'fs';
import { getFilesInDirectory } from './fileloader';

const readSvelteFileScript = (fileLocation: string) => {
  const fullContent = readFileSync(fileLocation).toString();
  const scriptMatches = fullContent.match(/<script[^>]*>([\s\S]*?)<\/script>/g);
  return scriptMatches?.join('');
};

describe('Dependency direction test', () => {
  // A crude way to enforce direction of dependencies, inspired by ArchUnit for java
  test('Files in lib should not depend on files in components', () => {
    const libFiles = getFilesInDirectory('./src/lib');
    const libContent = libFiles.map(e => {
      return {
        file: e,
        content: readFileSync(e),
      };
    });
    const componentFiles = getFilesInDirectory('./src/components');
    const componentContent = componentFiles.map(e => {
      if (e.endsWith('.svelte')) {
        return {
          file: e,
          content: readSvelteFileScript(e),
        };
      } else {
        return {
          file: e,
          content: readFileSync(e),
        };
      }
    });

    const violatingFiles = libContent.filter(e => e.content.includes('components/'));

    const violationMessage = violatingFiles.reduce((pre, file) => {
      return (
        pre +
        `\n \u001b[35m${file.file}\t \u001b[0mis dependent on components, but is located in lib folder`
      );
    }, '');
    expect(violatingFiles.length, violationMessage).toBe(0);
  });
});
