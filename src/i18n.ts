/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { init, locale, register } from 'svelte-i18n';
export { t } from 'svelte-i18n';
import { get } from 'svelte/store';
import browserLang from 'browser-lang';
import PersistantWritable from './script/repository/PersistantWritable';

register('en', () => import('./messages/ui.en.json'));
register('da', () => import('./messages/ui.da.json'));
register('de', () => import('./messages/ui.de.json'));

const initialLocale = browserLang({
  languages: ['en', 'da', 'de'],
  fallback: 'en',
});

const persistantLocale = new PersistantWritable(initialLocale, 'lang');

locale.subscribe(newLocal => {
  if (newLocal) {
    persistantLocale.set(newLocal);
  }
});

await init({
  fallbackLocale: 'en',
  initialLocale: get(persistantLocale),
});
