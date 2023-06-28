/**
 * @jest-environment jsdom
 */
import translations from '../translations';

describe('Translation tests', () => {
  test('Should be same number of translations', () => {
    const danishTranslationCount = Object.keys(translations.da).length;
    const englishTranslationCount = Object.keys(translations.en).length;
    expect(danishTranslationCount).toEqual(englishTranslationCount);
  });

  test('Translations are the same', () => {
    const danishTranslationKeys = Object.getOwnPropertyNames(translations.da);
    for (let i = 0; i < danishTranslationKeys.length; i++) {
      const danishKey = danishTranslationKeys[i] as keyof typeof translations.en;
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
