/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable, type Writable } from 'svelte/store';
import type { LiveDataVector } from '../../core/vector/LiveDataVector';
import type { LiveData } from '../../lib/domain/stores/LiveData';
import type { Unsubscriber } from './AbstractReadonlyState';
import type { AbstractState } from './AbstractState';
import MicrobitAccelerometerLiveData from '../../lib/livedata/MicrobitAccelerometerData';
import LiveDataBuffer from '../../core/LiveDataBuffer';

export class LiveDataStateAdapter implements AbstractState<LiveData<LiveDataVector>> {
  private store: Writable<LiveData<LiveDataVector>>;
  constructor() {
    this.store = writable(new MicrobitAccelerometerLiveData(new LiveDataBuffer(600)));
  }

  set(value: LiveData<LiveDataVector>): void {
    return this.store.set(value);
  }
  update(
    updater: (currentValue: LiveData<LiveDataVector>) => LiveData<LiveDataVector>,
  ): void {
    return this.store.update(updater);
  }

  get(): LiveData<LiveDataVector> {
    return get(this.store);
  }
  subscribe(
    run: (value: LiveData<LiveDataVector>) => void,
    invalidate?: ((value?: LiveData<LiveDataVector> | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}
