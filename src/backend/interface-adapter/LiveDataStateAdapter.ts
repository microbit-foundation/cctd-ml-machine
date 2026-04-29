/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable, type Writable } from 'svelte/store';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { Unsubscriber } from '../statemanagement/AbstractReadonlyState';
import type { AbstractState } from '../statemanagement/AbstractState';
import type { LiveDataStore } from '../../core/LiveDataStore';
import { InMemoryLiveDataStore } from '../../core/InMemoryLiveDataStore';

export class LiveDataStateAdapter
  implements AbstractState<LiveDataStore<LiveDataVector>>
{
  private store: Writable<LiveDataStore<LiveDataVector>>;
  constructor(bufferLen: number) {
    this.store = writable(new InMemoryLiveDataStore(bufferLen));
  }

  set(value: LiveDataStore<LiveDataVector>): void {
    return this.store.set(value);
  }
  update(
    updater: (
      currentValue: LiveDataStore<LiveDataVector>,
    ) => LiveDataStore<LiveDataVector>,
  ): void {
    return this.store.update(updater);
  }

  get(): LiveDataStore<LiveDataVector> {
    return get(this.store);
  }
  subscribe(
    run: (value: LiveDataStore<LiveDataVector>) => void,
    invalidate?:
      | ((value?: LiveDataStore<LiveDataVector> | undefined) => void)
      | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}
