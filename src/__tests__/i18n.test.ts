/**
 * @jest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import * as i18n from '../i18n';

describe('Initialization tests', () => {
  let windowSpy: jest.SpyInstance;

  beforeEach(() => {
    windowSpy = jest.spyOn(window, 'window', 'get');
  });

  afterEach(() => {
    windowSpy.mockRestore();
    localStorage.clear();
    jest.resetModules();
  });

  test('Language is set to danish when it is the preferred browser option', () => {
    windowSpy.mockImplementation(() => ({
      navigator: {
        languages: ['da'],
      },
    }));
    const getText = get(i18n.t);

    const translatedText = getText('alert.isRecording');

    expect(translatedText).toBe('Du er i gang med at optage!');
  });

  test('Language falls back to english when an unsupported language is selected', () => {
    windowSpy.mockImplementation(() => ({
      navigator: {
        languages: ['random-language'],
      },
    }));
    const getText = get(i18n.t);

    const translatedText = getText('alert.isRecording');

    expect(translatedText).toBe('You are currently recording!');
  });
});
