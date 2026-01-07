/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { KeyValueStore } from '../domain/KeyValueStore';

type StorageLike = Storage | Map<string, string>;

export default class LocalStorageKeyValueStore<T> implements KeyValueStore<T> {
  private prefix: string;
  private keySerializer: (key: T) => string;
  private fallback?: Map<string, string>;

  constructor(options?: { prefix?: string; keySerializer?: (key: T) => string }) {
    this.prefix = options?.prefix ?? 'kv:';
    this.keySerializer =
      options?.keySerializer ??
      ((k: T) => (typeof k === 'string' ? (k as unknown as string) : JSON.stringify(k)));

    if (!this.isLocalStorageAvailable()) {
      this.fallback = new Map<string, string>();
    }
  }

  private isLocalStorageAvailable(): boolean {
    try {
      if (typeof globalThis === 'undefined') return false;
      const ls = (globalThis as any).localStorage;
      if (!ls) return false;
      const testKey = '__kv_test__';
      ls.setItem(testKey, '1');
      ls.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }

  private storage(): StorageLike {
    return this.fallback ?? ((globalThis as any).localStorage as Storage);
  }

  private fullKey(key: T) {
    return `${this.prefix}${this.keySerializer(key)}`;
  }

  getValue<U>(key: T): U | undefined {
    const fs = this.storage();
    const raw =
      fs instanceof Map ? fs.get(this.fullKey(key)) : fs.getItem(this.fullKey(key));
    if (raw == null) {
      return undefined;
    }

    try {
      return JSON.parse(raw) as U;
    } catch {
      // If stored value is not JSON, return raw as any
      return raw as unknown as U;
    }
  }

  setValue<U>(key: T, value: U | undefined): void {
    const fs = this.storage();
    const k = this.fullKey(key);
    if (value === undefined) {
      if (fs instanceof Map) {
        fs.delete(k);
      } else {
        fs.removeItem(k);
      }
      return;
    }

    const toStore = JSON.stringify(value);
    if (fs instanceof Map) {
      fs.set(k, toStore);
    } else {
      fs.setItem(k, toStore);
    }
  }
}
