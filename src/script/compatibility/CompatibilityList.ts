/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

/// <reference types="web-bluetooth" />
import Bowser from 'bowser';

// REFERENCES FOR VALUES = https://github.com/lancedikson/bowser/blob/master/src/constants.js

export const nonAllowedPlatforms = ['mobile', 'tablet', 'tv'];

export const usbCompatibilityList = [
  {
    browser: Bowser.BROWSER_MAP.chrome,
    version: '56.*',
  },
  {
    browser: Bowser.BROWSER_MAP.chromium,
    version: '56.*',
  },
  {
    browser: Bowser.BROWSER_MAP.edge,
    version: '79.*',
  },
  {
    browser: Bowser.BROWSER_MAP.opera,
    version: '43.*',
  },
];
