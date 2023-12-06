/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable } from 'svelte/store';
import LiveDataBuffer from './LiveDataBuffer';

interface LiveData<T> extends Readable<T> {
  put(data: T): void;
  getBuffer(): LiveDataBuffer<T>;

  /**
   * The size of the data series (used by graphs).
   * I.e for x,y,z the series size should be 3.
   */
  getSeriesSize(): number
}

export default LiveData;
