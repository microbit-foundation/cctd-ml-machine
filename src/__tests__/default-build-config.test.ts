/**
 * @jest-environment jsdom
 */

import fs from 'fs';

describe('Default build config test', () => {
  test('Windi config should not be ml-machine', () => {
    const fileContent = fs.readFileSync('windi.config.js');
    expect(fileContent.includes("primary: '#2B5EA7'")).toBeFalsy();
    expect(fileContent.includes("secondary: '#2CCAC0'")).toBeFalsy();
  });
});
