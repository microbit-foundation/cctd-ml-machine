/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureProvider } from "./FeatureProvider";
import type { FeatureKey, FeatureToken } from "./FeatureToken";

export class JSONFeatureProvider implements FeatureProvider {
    private values: Record<string, unknown>;
    private factories = new Map<string | symbol, () => unknown>();
    private idToName = new Map<symbol, string>();

    constructor(values: Record<string, unknown>, tokens?: Record<string, FeatureToken>) {
        this.values = values;

        // build reverse map from token.id -> key name (when tokens map is provided)
        if (tokens) {
            for (const k of Object.keys(tokens) as Array<string>) {
                const token = (tokens as any)[k] as FeatureToken;
                if (token?.id && token?.name) this.idToName.set(token.id, token.name);
            }
        }
    }

    private resolveKey<T>(key: FeatureKey<T>): string | symbol {
        if (typeof key === "string" || typeof key === "symbol") return key;
        // FeatureToken: prefer name, fall back to reverse lookup by id
        if ((key as FeatureToken).name) return (key as FeatureToken).name as string;
        const id = (key as FeatureToken).id;
        const name = this.idToName.get(id);
        return name ?? id;
    }

    public get<T>(key: FeatureKey<T>): T | undefined {
        const resolved = this.resolveKey(key);
        if (typeof resolved === "symbol") {
            const f = this.factories.get(resolved);
            return f ? (f() as T) : undefined;
        }
        if (resolved in this.values) return this.values[resolved as string] as T;
        const f = this.factories.get(resolved);
        return f ? (f() as T) : undefined;
    }

    public require<T>(key: FeatureKey<T>): T {
        const v = this.get(key);
        if (v === undefined) {
            const id = typeof key === "string" ? key : (key as any).name ?? String((key as any).id);
            throw new Error(`Missing feature: ${id}`);
        }
        return v;
    }

    public has<T>(key: FeatureKey<T>): boolean {
        return this.get(key) !== undefined;
    }

    public listKeys(): Array<string | symbol> {
        // include JSON keys and token names (de-duplicated)
        const keys = new Set<string | symbol>(Object.keys(this.values));
        for (const name of this.idToName.values()) keys.add(name);
        return Array.from(keys);
    }

    public register<T>(key: FeatureKey<T>, value: T): void {
        const resolved = this.resolveKey(key);
        if (typeof resolved === "symbol") {
            this.factories.set(resolved, () => value as unknown);
        } else {
            this.values[resolved as string] = value;
        }
    }

    public registerFactory<T>(key: FeatureKey<T>, factory: () => T): void {
        const resolved = this.resolveKey(key);
        this.factories.set(resolved, factory as () => unknown);
    }

    public extend(other: FeatureProvider): FeatureProvider {
        const self = this;
        return {
            get: (k) => self.get(k) ?? other.get(k),
            require: (k) => {
                const v = self.get(k);
                return v !== undefined ? (v as any) : other.require(k);
            },
            has: (k) => self.has(k) || other.has(k),
            listKeys: () => Array.from(new Set([...self.listKeys(), ...other.listKeys()])),
            register: (k, v) => self.register?.(k as any, v),
            registerFactory: (k, f) => self.registerFactory?.(k as any, f),
            extend: (o) => self.extend?.(o) ?? o
        };
    }
}