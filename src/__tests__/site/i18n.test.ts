/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import { afterEach, beforeEach, vi } from 'vitest';

describe('Initialization tests', () => {
  beforeEach(() => {
    const storage = new Map<string, string>();
    vi.stubGlobal('localStorage', {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
      clear: () => {
        storage.clear();
      },
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.doUnmock('browser-lang');
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  test('Language is set to danish when it is the preferred browser option', async () => {
    vi.doMock('browser-lang', () => ({
      default: () => 'da',
    }));
    const i18n = await import('../../i18n');
    const getText = get(i18n.t);

    const translatedText = getText('alert.isRecording');

    expect(translatedText).toBe('Du er i gang med at optage!');
  });

  test('Language falls back to english when an unsupported language is selected', async () => {
    vi.doMock('browser-lang', () => ({
      default: () => 'random-language',
    }));
    const i18n = await import('../../i18n');
    const getText = get(i18n.t);

    const translatedText = getText('alert.isRecording');

    expect(translatedText).toBe('You are currently recording!');
  });
});
