/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export type Unsubscriber = () => void

/**
 * Abstraction for state management
 */
export interface AbstractState<T> {
    get(): T;
    set(value: T): void;
    update(updater: (currentValue: T) => T): void;
    subscribe(run: (value: T) => void, invalidate?: (value?: T) => void): Unsubscriber;
}