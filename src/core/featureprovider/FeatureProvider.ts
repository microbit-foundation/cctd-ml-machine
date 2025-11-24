/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { FeatureKey } from "./FeatureToken";

export interface FeatureProvider {
    /**
     * Retrieve a feature by key. Returns undefined when not present.
     */
    get<T>(key: FeatureKey<T>): T | undefined

    /**
     * Like get, but throws if the feature is missing.
     */
    require<T>(key: FeatureKey<T>): T

    /**
     * Test whether the provider has the given feature.
     */
    has<T>(key: FeatureKey<T>): boolean

    /**
     * List all known keys
     */
    listKeys(): Array<string | symbol>

    /**
     * Optional: register a concrete value. Not all implementations must provide
     * mutation; this is useful for simple DI containers or tests.
     */
    register?<T>(key: FeatureKey<T>, value: T): void

    /**
     * Optional: register a lazy factory. Implementation may cache factory result.
     */
    registerFactory?<T>(key: FeatureKey<T>, factory: () => T): void

    /**
     * Optional: create a new provider that composes this provider with another
     * (lookup falls back to the other provider when missing).
     */
    extend?(other: FeatureProvider): FeatureProvider;
}
