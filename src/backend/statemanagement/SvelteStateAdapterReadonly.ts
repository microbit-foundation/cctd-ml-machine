/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  get,
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import type { AbstractState } from './AbstractState';
import type { AbstractReadonlyState } from './AbstractReadonlyState';

export class SvelteStateAdapterReadonly<T> implements AbstractState<T>, Readable<T> {
  constructor(private svelteState: Readable<T>) { }

  readOnly(): AbstractReadonlyState<T> {
    return {
      get: () => get(this.svelteState),
      subscribe: (run, invalidate) => this.svelteState.subscribe(run, invalidate),
    };
  }

  set(value: T): void {
    throw new Error('Method not implemented.');
  }
  update(updater: (currentValue: T) => T): void {
    throw new Error('Method not implemented.');
  }

  public get(): T {
    return get(this.svelteState);
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
