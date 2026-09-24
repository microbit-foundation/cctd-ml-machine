/**
 * (c) 2023-2026, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import LiveDataBuffer from './LiveDataBuffer';
import type { LiveDataStore } from './LiveDataStore';
import type { LiveDataVector } from './vector/LiveDataVector';

export class InMemoryLiveDataStore<T extends LiveDataVector> implements LiveDataStore<T> {
  private dataBuffer: LiveDataBuffer<T>;
  private newest: T | undefined;

  constructor(bufferSize: number) {
    this.dataBuffer = new LiveDataBuffer<T>(bufferSize);
  }

  public getBuffer(): LiveDataBuffer<T> {
    return this.dataBuffer;
  }

  public put(data: T): void {
    this.dataBuffer.addValue(data);
    this.newest = data;
  }

  public getSeriesSize(): number {
    if (!this.newest) {
      return 0;
    }
    return this.newest.getSize();
  }

  public getLabels(): string[] {
    if (!this.newest) {
      return [];
    }
    return this.newest.getLabels();
  }
}
