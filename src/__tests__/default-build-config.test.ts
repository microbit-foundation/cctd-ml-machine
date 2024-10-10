/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import fs from 'fs';

describe('Default build config test', () => {
  test('Windi config should not be ml-machine when unbranded', () => {
    const fileContent = fs.readFileSync(
      'src/__viteBuildVariants__/unbranded/windi.config.js',
    );
    expect(fileContent.includes("primary: '#2B5EA7'")).toBeFalsy();
    expect(fileContent.includes("secondary: '#2CCAC0'")).toBeFalsy();
  });

  test('Default config should be unbranded', () => {
    const windiContent = fs.readFileSync('windi.config.js');

    const featuresContent = fs.readFileSync('features.json');
    const features = JSON.parse(featuresContent.toString()) as Partial<{ title: string }>;

    const message =
      "The default config file was determined to be a branded version of ML machine. Please run command 'node prepEnv.js unbranded' before committing";

    expect(windiContent.includes("primary: '#2B5EA7'"), message).toBeFalsy();
    expect(windiContent.includes("secondary: '#2CCAC0'"), message).toBeFalsy();
    expect(features.title, message).toBe('Learning tool');
  });
});
