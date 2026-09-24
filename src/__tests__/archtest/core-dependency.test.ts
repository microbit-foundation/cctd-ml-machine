/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
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
  test('Files in core should not depend on files in components', () => {
    const libFiles = getFilesInDirectory('./src/core');
    const libContent = libFiles.map(e => {
      return {
        file: e,
        content: readFileSync(e),
      };
    });
    const componentFiles = [...getFilesInDirectory('./src/frontend')];
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

    const violatingFiles = libContent.filter(
      e => e.content.includes('components/') || e.content.includes('lib/'),
    );

    const violationMessage = violatingFiles.reduce((pre, file) => {
      return (
        pre +
        `\n \u001b[35m${file.file}\t \u001b[0mis dependent on components/lib, but is located in core folder`
      );
    }, '');
    expect(violatingFiles.length, violationMessage).toBe(0);
  });
});
