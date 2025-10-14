/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export interface KeyValueStore<T> {
    getValue<U>(key: T): U
    setValue<U>(key: T, value: U): void;
}