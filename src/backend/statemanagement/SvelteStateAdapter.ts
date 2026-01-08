/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  get,
  type Invalidator,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import type { AbstractState } from './AbstractState';

export class SvelteStateAdapter<T> implements AbstractState<T>, Writable<T> {
  constructor(private svelteState: Writable<T>) {}

  public get(): T {
    return get(this.svelteState);
  }

  public set(value: T): void {
    return this.svelteState.set(value);
  }

  public update(updater: (currentValue: T) => T): void {
    return this.svelteState.update(() => updater(this.get()));
  }

  public subscribe(
    run: Subscriber<T>,
    invalidate?: Invalidator<T> | undefined,
  ): Unsubscriber {
    return this.svelteState.subscribe(
      () => run(this.get()),
      invalidate ? () => invalidate(this.get()) : undefined,
    );
  }
}

export const svelteState = <T>(state: AbstractState<T>): Writable<T> => {
  if (!state) {
    throw new Error('State is not defined');
  }
  return {
    set: val => state.set(val),
    update: updater => state.update(updater),
    subscribe: (run, invalidate) => state.subscribe(run, invalidate),
  };
};
