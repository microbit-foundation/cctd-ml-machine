/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
export type TimestampedData<T> = {
  value: T;
  timestamp: number;
};
class LiveDataBuffer<T> {
  private buffer: (TimestampedData<T> | null)[];
  private bufferPtr = 0; // The buffer pointer keeps increasing from 0 to infinity each time a new item is added
  private bufferUtilization = 0;
  constructor(private maxLen: number) {
    this.buffer = new Array<TimestampedData<T> | null>(maxLen).fill(null);
  }

  public addValue(value: T) {
    const bufferIndex = this.getBufferIndex();
    this.bufferPtr++;
    this.buffer[bufferIndex] = {
      timestamp: Date.now(),
      value: value,
    };
  }

  public getNewestValues(noOfValues: number): (T | null)[] {
    const values = [];
    for (let i = 0; i < noOfValues; i++) {
      const item = this.buffer[this.getBufferIndexFrom(this.bufferPtr - (i + 1))];
      if (item) {
        values.push(item.value);
      } else {
        values.push(null);
      }
    }

    return values;
  }

  public getSeries(time: number, noOfElements: number) {
    let searchPointer = this.bufferPtr;
    this.bufferUtilization = 0;
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

    this.bufferUtilization = Math.max(
      series.length / this.maxLen,
      noOfElements / this.maxLen,
    );

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

  public getBufferUtilization() {
    return this.bufferUtilization;
  }

  private getBufferIndex(): number {
    return this.getBufferIndexFrom(this.bufferPtr);
  }

  private getBufferIndexFrom(index: number): number {
    return index % this.maxLen;
  }
}

export default LiveDataBuffer;
