/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Subscriber, Unsubscriber, Writable, get, writable } from 'svelte/store';
import LiveDataBuffer from '../domain/LiveDataBuffer';
import LiveData from '../domain/stores/LiveData';
import { LiveDataVector } from '../domain/stores/LiveDataVector';

export type MicrobitAccelerometerData = {
  x: number;
  y: number;
  z: number;
};

export class MicrobitAccelerometerDataVector implements LiveDataVector {

  public constructor(private data: MicrobitAccelerometerData) {
  }

  getVector(): number[] {
    return [this.data.x, this.data.y, this.data.z]
  }
}

class MicrobitAccelerometerLiveData implements LiveData<MicrobitAccelerometerDataVector> {
  private store: Writable<MicrobitAccelerometerDataVector>;
  constructor(private dataBuffer: LiveDataBuffer<MicrobitAccelerometerDataVector>) {
    this.store = writable(new MicrobitAccelerometerDataVector({
      x: 0,
      y: 0,
      z: 0,
    }));
  }

  public getBuffer(): LiveDataBuffer<MicrobitAccelerometerDataVector> {
    return this.dataBuffer;
  }

  public put(data: MicrobitAccelerometerDataVector): void {
    this.store.set(data);
    this.dataBuffer.addValue(data);
  }

  public getSeriesSize(): number {
    return 3;
  }

  public getLabels(): string[] {
    return ['X', 'Y', 'Z'];
  }

  public getPropertyNames(): string[] {
    return Object.getOwnPropertyNames(get(this.store));
  }

  public subscribe(
    run: Subscriber<MicrobitAccelerometerDataVector>,
    invalidate?: ((value?: MicrobitAccelerometerDataVector | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}

export default MicrobitAccelerometerLiveData;
