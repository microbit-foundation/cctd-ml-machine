import { type LiveDataVector } from './stores/LiveDataVector';

/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export type TimestampedData<T extends LiveDataVector> = {
  value: T;
  timestamp: number;
};

/**
 * A buffer for storing live data vectors, which allows for efficient retrieval of the most recent values.
 * Implemented as a circular buffer that can hold a fixed number of elements.
 */
class LiveDataBuffer<T extends LiveDataVector> {
  private buffer: (TimestampedData<T> | null)[];
  private bufferPtr = 0; // The buffer pointer keeps increasing from 0 to infinity each time a new item is added

  constructor(private maxLen: number) {
    this.buffer = new Array<TimestampedData<T> | null>(maxLen).fill(null);
  }

  /**
   * Returns true if no data points have been added to the buffer.
   */
  public isEmpty(): boolean {
    return this.bufferPtr === 0;
  }

  /**
   * Adds a new value to the buffer.
   */
  public addValue(value: T) {
    const bufferIndex = this.getBufferIndex();
    this.bufferPtr++;
    this.buffer[bufferIndex] = {
      timestamp: Date.now(),
      value: value,
    };
  }

  /**
   * Returns the newest n values in the buffer.
   */
  public getNewestValues(noOfDataPoints: number): (T | null)[] {
    const resultSize = Math.min(noOfDataPoints, this.maxLen);
    const values = new Array<T | null>(resultSize);

    for (let i = 0; i < resultSize; i++) {
      const item = this.buffer[this.getBufferIndexFrom(this.bufferPtr - (i + 1))];
      values[i] = item ? item.value : null;
    }

    return values;
  }

  /**
   * Returns the series of data points that are within the specified time frame.
   * The time is specified in milliseconds, and the number of elements to return is also specified.
   * If there are not enough elements in the buffer to satisfy the request within the specified timeframe, an error is thrown.
   */
  public getSeries(time: number, noOfElements: number) {
    const now = Date.now();
    let searchPointer = this.bufferPtr - 1;
    const resultSeries: TimestampedData<T>[] = [];

    let foundElements = 0;

    // First, find the starting point: the oldest element within the timeframe
    while (foundElements < this.maxLen) {
      const idx = this.getBufferIndexFrom(searchPointer);
      const element = this.buffer[idx];

      if (!element) {
        throw new Error('Found null element in LiveDataBuffer');
      }

      if (now - element.timestamp > time) {
        break;
      }

      foundElements++;
      searchPointer--;
    }

    if (foundElements < noOfElements) {
      throw new Error(
        'Insufficient buffer data! Try increasing the polling rate or decrease the number of elements requested',
      );
    }

    // Evenly sample the required number of elements
    const step = foundElements / noOfElements;
    for (let i = 0; i < noOfElements; i++) {
      const offset = Math.floor(i * step);
      const idx = this.getBufferIndexFrom(searchPointer + 1 + offset);
      const element = this.buffer[idx];

      if (!element) {
        throw new Error('Found null element in LiveDataBuffer during sampling');
      }

      resultSeries.push(element);
    }

    return resultSeries;
  }

  private getBufferIndex(): number {
    return this.getBufferIndexFrom(this.bufferPtr);
  }

  private getBufferIndexFrom(index: number): number {
    return index % this.maxLen;
  }
}

export default LiveDataBuffer;
