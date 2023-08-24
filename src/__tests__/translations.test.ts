/**
 * @jest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import translations from '../translations';

describe('Translation tests', () => {
  test('Should be same number of translations', () => {
    const danishTranslationCount = Object.keys(translations.da).length;
    const englishTranslationCount = Object.keys(translations.en).length;
    expect(danishTranslationCount).toEqual(englishTranslationCount);
  });

  test('Translations are the same', () => {
    const danishTranslationKeys = Object.getOwnPropertyNames(
      translations.da,
    ) as (keyof typeof translations.da)[];
    for (let i = 0; i < danishTranslationKeys.length; i++) {
      const danishKey = danishTranslationKeys[i];
      expect(
        translations.en[danishKey],
        'Something not the same -> ' + danishKey,
      ).toBeDefined();
    }
  });

  // Mostly an architecture test
  test('Translations should be in the same order', () => {
    const danishTranslationKeys = Object.getOwnPropertyNames(translations.da);
    const englishTranslationKeys = Object.getOwnPropertyNames(translations.en);
    for (let i = 0; i < englishTranslationKeys.length; i++) {
      const danishKey = danishTranslationKeys[i];
      const englishKey = englishTranslationKeys[i];
      expect(danishKey, 'Not the same order found for -> ' + danishKey).toEqual(
        englishKey,
      );
    }
  });
});

export {};
