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
  private buffer: TimestampedData<T>[];
  private bufferPtr = 0;
  private bufferUtilization = 0;
  constructor(private maxLen: number) {
    this.buffer = new Array<TimestampedData<T>>(maxLen).fill(null!);
  }

  public addValue(value: T) {
    const bufferIndex = this.getBufferIndex();
    this.bufferPtr++;
    this.buffer[bufferIndex] = {
      timestamp: Date.now(),
      value: value,
    };
  }

  public getSeries(time: number, noOfElements: number) {
    let searchPointer = this.bufferPtr;
    this.bufferUtilization = 0; // for debugging
    // Search for elements that fit the time frame
    const series = [];
    const dateStart = Date.now();
    let i = 0;
    while (i < this.maxLen) {
      const element = this.buffer[this.getBufferIndexFrom(searchPointer - 1)];
      if (!element) {
        console.warn('Found nulll element');
        break;
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
      console.error(
        'Insufficient buffer data! Try increasing the polling rate or decrease the number of elements requested',
      );
    }

    if (series.length > 10 * noOfElements) {
      console.warn(
        'The number of values in LiveDataBuffer, that fit the timeframe is greater than 1000%! Maybe decrease the polling frequency or increase the number of elements fetched from buffer to improve performance',
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
