/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import type { AbstractReadonlyState } from './AbstractReadonlyState';

/**
 * Abstraction for state management
 */
export interface AbstractState<T> extends AbstractReadonlyState<T> {
  set(value: T): void;
  update(updater: (currentValue: T) => T): void;
  readOnly(): AbstractReadonlyState<T>;
}
