/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { init, locale, register } from 'svelte-i18n';
export { t } from 'svelte-i18n';
import { get } from 'svelte/store';
import { persistantWritable } from './script/stores/storeUtil';
import browserLang from 'browser-lang';

register('en', () => import('./messages/ui.en.json'));
register('da', () => import('./messages/ui.da.json'));

const initialLocale = browserLang({
  languages: ['en', 'da'],
  fallback: 'en',
});

const persistantLocale = persistantWritable('lang', initialLocale);

locale.subscribe(newLocal => {
  if (newLocal) {
    persistantLocale.set(newLocal);
  }
});

await init({
  fallbackLocale: 'en',
  initialLocale: get(persistantLocale),
});
