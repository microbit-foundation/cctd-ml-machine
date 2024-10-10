/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Readable } from 'svelte/store';
import LiveDataBuffer from '../LiveDataBuffer';
import { LiveDataVector } from './LiveDataVector';

/**
 * A container for real-time data. Uses a LiveDataBuffer to store data points.
 */
interface LiveData<T extends LiveDataVector> extends Readable<T> {
  /**
   * Inserts a new data point to the LiveData object
   */
  put(data: T): void;

  /**
   * Returns the buffer that holds the most recent data points.
   */
  getBuffer(): LiveDataBuffer<T>;

  /**
   * The size of the data series (used by graphs).
   * I.e for x,y,z the series size should be 3.
   */
  getSeriesSize(): number;

  /**
   * Returns labels accociated with each data point (Such as for the LiveGraph)
   */
  getLabels(): string[];
}

export default LiveData;
