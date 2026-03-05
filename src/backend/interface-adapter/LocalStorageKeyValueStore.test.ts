/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import LocalStorageKeyValueStore from './LocalStorageKeyValueStore';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';

function createMockLocalStorage() {
  const store = new Map<string, string>();
  return {
    setItem(key: string, value: string) {
      store.set(key, String(value));
    },
    getItem(key: string) {
      const v = store.get(key);
      return v === undefined ? null : v;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    clear() {
      store.clear();
    },
    // for assertions
    _rawStore() {
      return store;
    },
  } as unknown as Storage & { _rawStore?: () => Map<string, string> };
}

describe('LocalStorageKeyValueStore', () => {
  let originalLocalStorage: any;

  beforeEach(() => {
    originalLocalStorage = (globalThis as any).localStorage;
  });

  afterEach(() => {
    // restore
    (globalThis as any).localStorage = originalLocalStorage;
  });

  it('stores and retrieves wrapped values with version', () => {
    (globalThis as any).localStorage = createMockLocalStorage();
    const store = new LocalStorageKeyValueStore<string>();

    store.setValue('foo', { a: 1 } as any);
    const raw = (globalThis as any).localStorage.getItem('kv:foo');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed).toHaveProperty('version');
    expect(parsed).toHaveProperty('value');
    expect(parsed.version).toBe(1);
    expect(parsed.value).toEqual({ a: 1 });

    const got = store.getValue<{ a: number }>('foo');
    expect(got).toEqual({ a: 1 });
  });

  it('returns undefined for missing keys', () => {
    (globalThis as any).localStorage = createMockLocalStorage();
    const store = new LocalStorageKeyValueStore<string>();
    expect(store.getValue('does-not-exist')).toBeUndefined();
  });

  it('deletes value when setValue called with undefined', () => {
    (globalThis as any).localStorage = createMockLocalStorage();
    const store = new LocalStorageKeyValueStore<string>();

    store.setValue('x', 123 as any);
    expect(store.getValue('x')).toEqual(123);

    store.setValue('x', undefined);
    expect(store.getValue('x')).toBeUndefined();
    expect((globalThis as any).localStorage.getItem('kv:x')).toBeNull();
  });

  it('removes legacy JSON (untagged) entries and returns undefined', () => {
    const ls = createMockLocalStorage();
    (globalThis as any).localStorage = ls;

    // store legacy JSON without version envelope
    ls.setItem('kv:legacy', JSON.stringify({ a: 42 }));

    const store = new LocalStorageKeyValueStore<string>();
    const v = store.getValue('legacy');
    expect(v).toBeUndefined();
    // legacy removed
    expect(ls.getItem('kv:legacy')).toBeNull();
  });

  it('removes legacy non-JSON raw entries and returns undefined', () => {
    const ls = createMockLocalStorage();
    (globalThis as any).localStorage = ls;

    ls.setItem('kv:plain', 'not-json');
    const store = new LocalStorageKeyValueStore<string>();
    const v = store.getValue('plain');
    expect(v).toBeUndefined();
    expect(ls.getItem('kv:plain')).toBeNull();
  });

  it('uses fallback Map when localStorage not available', () => {
    // ensure no global localStorage
    delete (globalThis as any).localStorage;
    const store = new LocalStorageKeyValueStore<string>();

    store.setValue('fm', { hello: 'world' } as any);
    const got = store.getValue<{ hello: string }>('fm');
    expect(got).toEqual({ hello: 'world' });
  });

  it('throws on circular structure during setValue', () => {
    (globalThis as any).localStorage = createMockLocalStorage();
    const store = new LocalStorageKeyValueStore<string>();

    const circ: any = { a: 1 };
    circ.self = circ;

    expect(() => store.setValue('c', circ)).toThrow();
  });

  it('accepts non-string keys (object keys are serialized)', () => {
    (globalThis as any).localStorage = createMockLocalStorage();
    const store = new LocalStorageKeyValueStore<object>();

    const key = { id: 5 };
    store.setValue(key, { ok: true } as any);

    const rawKey = 'kv:' + JSON.stringify(key);
    const raw = (globalThis as any).localStorage.getItem(rawKey);
    expect(raw).not.toBeNull();

    const got = store.getValue<{ ok: boolean }>(key);
    expect(got).toEqual({ ok: true });
  });
});
