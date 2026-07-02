/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { KeyValueStore } from './KeyValueStore';

type StorageLike = Storage | Map<string, string>;

export default class LocalStorageKeyValueStore<T> implements KeyValueStore<T> {
  private prefix: string;
  private keySerializer: (key: T) => string;
  private fallback?: Map<string, string>;
  private version: number = 1;

  constructor() {
    this.prefix = 'kv:';
    this.keySerializer = (k: T) =>
      typeof k === 'string' ? (k as unknown as string) : JSON.stringify(k);

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

  private parseStored(raw: string): { version: number; value: unknown } {
    try {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed === 'object' &&
        'version' in parsed &&
        'value' in parsed
      ) {
        return {
          version: (parsed as any).version as number,
          value: (parsed as any).value,
        };
      }
      // Legacy/untagged value
      return { version: 0, value: parsed };
    } catch {
      // Not JSON — treat as legacy raw string
      return { version: 0, value: raw };
    }
  }

  getValue<U>(key: T): U | undefined {
    const fs = this.storage();
    const raw =
      fs instanceof Map ? fs.get(this.fullKey(key)) : fs.getItem(this.fullKey(key));
    if (raw == null) return undefined;

    const stored = this.parseStored(raw);

    if (stored.version === this.version) {
      return stored.value as U;
    }

    // Version mismatch — no upgrader configured, remove stale value
    try {
      if (fs instanceof Map) fs.delete(this.fullKey(key));
      else fs.removeItem(this.fullKey(key));
    } catch {}
    return undefined;
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

    const toStore = JSON.stringify({ version: this.version, value });
    if (fs instanceof Map) {
      fs.set(k, toStore);
    } else {
      fs.setItem(k, toStore);
    }
  }
}
