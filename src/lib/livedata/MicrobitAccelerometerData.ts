/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  type Subscriber,
  type Unsubscriber,
  type Writable,
  writable,
} from 'svelte/store';
import LiveDataBuffer from '../domain/LiveDataBuffer';
import type { LiveDataVector } from '../domain/stores/LiveDataVector';
import type { LiveData } from '../domain/stores/LiveData';
import type { Vector } from '../domain/Vector';
import BaseVector from '../domain/BaseVector';

export type MicrobitAccelerometerData = {
  x: number;
  y: number;
  z: number;
};

export const asAccelerometerData = (input: LiveDataVector) => {
  if (input.getSize() != 3) {
    throw new Error('Cannot cast input as accelerometer data, size is not 3');
  }
  const data = new MicrobitAccelerometerDataVector({
    x: input.getValue()[0],
    y: input.getValue()[1],
    z: input.getValue()[2],
  });

  input.getLabels().forEach((label, index) => {
    if (data.getLabels()[index] !== label) {
      throw new Error('Cannot cast input as accelerometer data, labels do not match');
    }
  });
  return data;
};

export class MicrobitAccelerometerDataVector implements LiveDataVector {
  public constructor(private data: MicrobitAccelerometerData) {}

  public getLabels(): string[] {
    return ['X', 'Y', 'Z'];
  }
  public getSize(): number {
    return this.getValue().length;
  }

  public getValue(): number[] {
    return [this.data.x, this.data.y, this.data.z];
  }

  public getAccelerometerData(): MicrobitAccelerometerData {
    return this.data;
  }

  public divide(vector: Vector): MicrobitAccelerometerDataVector {
    const baseVec = new BaseVector(this.getValue());
    const divided = baseVec.divide(vector);
    return new MicrobitAccelerometerDataVector({
      x: divided.getValue()[0],
      y: divided.getValue()[1],
      z: divided.getValue()[2],
    });
  }

  public add(vector: Vector): MicrobitAccelerometerDataVector {
    const baseVec = new BaseVector(this.getValue());
    const divided = baseVec.add(vector);
    return new MicrobitAccelerometerDataVector({
      x: divided.getValue()[0],
      y: divided.getValue()[1],
      z: divided.getValue()[2],
    });
  }

  public subtract(vector: Vector): MicrobitAccelerometerDataVector {
    const baseVec = new BaseVector(this.getValue());
    const divided = baseVec.subtract(vector);
    return new MicrobitAccelerometerDataVector({
      x: divided.getValue()[0],
      y: divided.getValue()[1],
      z: divided.getValue()[2],
    });
  }
}

class MicrobitAccelerometerLiveData implements LiveData<MicrobitAccelerometerDataVector> {
  private store: Writable<MicrobitAccelerometerDataVector>;
  constructor(private dataBuffer: LiveDataBuffer<MicrobitAccelerometerDataVector>) {
    this.store = writable(
      new MicrobitAccelerometerDataVector({
        x: 1,
        y: 1,
        z: 1,
      }),
    );
  }

  public getBuffer(): LiveDataBuffer<MicrobitAccelerometerDataVector> {
    return this.dataBuffer;
  }

  public put(data: MicrobitAccelerometerDataVector): void {
    this.store.set(data);
    this.dataBuffer.addValue(data);
  }

  public getSeriesSize(): number {
    // TODO: Could be replaced with the version in the store, as it is initialized in constructor
    return new MicrobitAccelerometerDataVector({ x: 0, y: 0, z: 0 }).getSize();
  }

  public getLabels(): string[] {
    // TODO: Could be replaced with the version in the store, as it is initialized in constructor
    return new MicrobitAccelerometerDataVector({ x: 0, y: 0, z: 0 }).getLabels();
  }

  public subscribe(
    run: Subscriber<MicrobitAccelerometerDataVector>,
    invalidate?:
      | ((value?: MicrobitAccelerometerDataVector | undefined) => void)
      | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}

export default MicrobitAccelerometerLiveData;
