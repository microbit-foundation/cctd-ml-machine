/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  type Subscriber,
  type Invalidator,
  type Unsubscriber,
  type Writable,
  writable,
  get,
} from 'svelte/store';
import LiveDataBuffer from '../../../script/domain/LiveDataBuffer';
import { type LiveData } from '../../../script/domain/stores/LiveData';
import BaseLiveDataVector from '../../../script/domain/BaseLiveDataVector';
import BaseVector from '../../../script/domain/BaseVector';

export class SyntheticLiveData implements LiveData<BaseLiveDataVector> {
  private store: Writable<BaseLiveDataVector>;
  private buffer: LiveDataBuffer<BaseLiveDataVector>;
  public constructor(labels: string[]) {
    this.store = writable(
      new BaseLiveDataVector(new BaseVector(new Array(labels.length).fill(0)), labels),
    );
    this.buffer = new LiveDataBuffer(200);
  }
  put(data: BaseLiveDataVector): void {
    this.store.set(data);
    this.buffer.addValue(data);
  }
  getBuffer(): LiveDataBuffer<BaseLiveDataVector> {
    return this.buffer;
  }
  getSeriesSize(): number {
    return get(this.store).getSize();
  }
  getLabels(): string[] {
    return get(this.store).getLabels();
  }
  subscribe(
    run: Subscriber<BaseLiveDataVector>,
    invalidate?: Invalidator<BaseLiveDataVector> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}
