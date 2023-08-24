/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { derived } from 'svelte/store';
import translations from './translations';
import { persistantWritable } from './script/stores/storeUtil';

const initialLang = determineInitialLang();
// export let locale: string;
export const locale = persistantWritable('lang', initialLang);

export const locales: string[] = Object.keys(translations);

function translate(locale: string, key: string, vars: object): string {
  // Let's throw some errors if we're trying to use keys/locales that don't exist.
  // We could improve this by using Typescript and/or fallback values.
  // if (!key) throw new Error("no key provided to $t()");
  // if (!locale) throw new Error(`no translation for key "${key}"`);

  // Grab the translation from the translations object.
  // @ts-ignore
  let text: string | undefined = translations[locale][key];
  if (text == null) {
    console.warn(`no translation found for ${locale}.${key}`);
    return key; // Use the key as fallback
  }

  // Replace any passed in variables in the translation string.
  Object.keys(vars).map(k => {
    const regex = new RegExp(`{{${k}}}`, 'g');
    // @ts-ignore
    text = text.replace(regex, vars[k]);
  });

  return text;
}

export const t = derived(
  locale,
  $locale =>
    (key: string, vars = {}) =>
      translate($locale, key, vars),
);

function determineInitialLang() {
  const urlParams = new URLSearchParams(window.location.search);
  const urlLang = urlParams.get('lang');
  if (urlLang === 'da' || urlLang === 'en') return urlLang;
  return 'da';
}
