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

  public isEmpty(): boolean {
    return this.bufferPtr === 0;
  }

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
    let searchPointer = this.bufferPtr;
    // Search for elements that fit the time frame
    const series = [];
    const dateStart = Date.now();
    let i = 0;
    while (i < this.maxLen) {
      const element = this.buffer[this.getBufferIndexFrom(searchPointer - 1)];
      if (!element) {
        throw new Error('Found null element in LiveDataBuffer');
      }
      const timeElapsed = dateStart - element.timestamp;
      if (timeElapsed > time) {
        break;
      }
      series.push(element);
      searchPointer--;
      i++;
    }

    // Now the series array is filled with elements within the timeframe.
    // We should now find `noOfElements` number of items to return
    if (series.length < noOfElements) {
      throw new Error(
        'Insufficient buffer data! Try increasing the polling rate or decrease the number of elements requested',
      );
    }

    // We will spread out the values evenly and return the result
    const resultSeries = [];
    for (let i = 0; i < noOfElements; i++) {
      const index = Math.floor(series.length / noOfElements) * i;
      resultSeries.push(series[index]);
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
