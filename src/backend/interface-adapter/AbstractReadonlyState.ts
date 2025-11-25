/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

export type Unsubscriber = () => void;

/**
 * Abstraction for state management
 */
export interface AbstractReadonlyState<T> {
  get(): T;
  subscribe(run: (value: T) => void, invalidate?: (value?: T) => void): Unsubscriber;
}
