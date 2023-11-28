/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Subscriber, Unsubscriber, Writable, writable } from 'svelte/store';
import LiveData from '../domain/LiveData';
import LiveDataBuffer from '../domain/LiveDataBuffer';

export type MicrobitAccelerometerData = {
  accelX: number;
  accelY: number;
  accelZ: number;
  smoothedAccelX: number;
  smoothedAccelY: number;
  smoothedAccelZ: number;
};

class MicrobitAccelerometerLiveData implements LiveData<MicrobitAccelerometerData> {
  private store: Writable<MicrobitAccelerometerData>;
  constructor(private dataBuffer: LiveDataBuffer<MicrobitAccelerometerData>) {
    this.store = writable({
      accelX: 0,
      accelY: 0,
      accelZ: 0,
      smoothedAccelX: 0,
      smoothedAccelY: 0,
      smoothedAccelZ: 0,
    });
  }

  public getBuffer(): LiveDataBuffer<MicrobitAccelerometerData> {
    return this.dataBuffer;
  }

  public put(data: MicrobitAccelerometerData): void {
    this.store.set(data);
    this.dataBuffer.addValue(data);
  }

  public subscribe(
    run: Subscriber<MicrobitAccelerometerData>,
    invalidate?: ((value?: MicrobitAccelerometerData | undefined) => void) | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}

export default MicrobitAccelerometerLiveData;
