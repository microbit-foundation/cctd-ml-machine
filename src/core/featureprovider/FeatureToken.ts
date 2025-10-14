/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export type FeatureKey<T> = FeatureToken<T> | string | symbol

export interface FeatureToken<T = unknown> {
    readonly id: symbol
    readonly name?: string
}

export function createFeatureToken<U extends string, T = unknown>(name?: U): FeatureToken<T> {
    return { id: Symbol(name), name }
}