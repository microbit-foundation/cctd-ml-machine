/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import da from '../../assets/messages/ui.da.json';
import en from '../../assets/messages/ui.en.json';
import de from '../../assets/messages/ui.de.json';

describe('Translation tests', () => {
  test('Should be same number of translations', () => {
    const danishTranslationCount = Object.keys(da).length;
    const englishTranslationCount = Object.keys(en).length;
    const germanTranslationCount = Object.keys(de).length;
    expect(danishTranslationCount).toEqual(englishTranslationCount);
    expect(danishTranslationCount).toEqual(germanTranslationCount);
  });

  test('Translations are the same', () => {
    const danishTranslationKeys = Object.getOwnPropertyNames(da) as (keyof typeof da)[];
    for (let i = 0; i < danishTranslationKeys.length; i++) {
      const danishKey = danishTranslationKeys[i];
      expect(en[danishKey], 'Something not the same -> ' + danishKey).toBeDefined();
      expect(de[danishKey], 'Something not the same -> ' + danishKey).toBeDefined();
    }
  });

  // Mostly an architecture test
  test('Translations should be in the same order', () => {
    const danishTranslationKeys = Object.getOwnPropertyNames(da);
    const englishTranslationKeys = Object.getOwnPropertyNames(en);
    const germanTranslationkeys = Object.getOwnPropertyNames(de);
    for (let i = 0; i < englishTranslationKeys.length; i++) {
      const danishKey = danishTranslationKeys[i];
      const englishKey = englishTranslationKeys[i];
      const germanTranslationkey = germanTranslationkeys[i];
      expect(danishKey, 'Not the same order found for -> ' + danishKey).toEqual(
        englishKey,
      );
      expect(danishKey, 'Not the same order found for -> ' + danishKey).toEqual(
        germanTranslationkey,
      );
    }
  });
});

export {};
