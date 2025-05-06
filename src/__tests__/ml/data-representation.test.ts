/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import LiveDataBuffer from '../../lib/domain/LiveDataBuffer';
import MicrobitAccelerometerLiveData, {
  MicrobitAccelerometerDataVector,
} from '../../lib/livedata/MicrobitAccelerometerData';
import { repeat } from '../testUtils';
import { get } from 'svelte/store';
import { type LiveDataVector } from '../../lib/domain/stores/LiveDataVector';
import SmoothedLiveData from '../../lib/livedata/SmoothedLiveData';
import { smoothNewValue } from '../../lib/utils/graphUtils';
import type { LiveData } from '../../lib/domain/stores/LiveData';

describe('Data representation tests', () => {
  test('Creating accelerometer live data does not throw', () => {
    expect(() => {
      new MicrobitAccelerometerLiveData(new LiveDataBuffer(10));
    }).not.toThrow();
  });

  test('Number of elements in buffer does not exceed set amount', () => {
    const elemsInBuffer = 10;
    const liveData = new MicrobitAccelerometerLiveData(new LiveDataBuffer(elemsInBuffer));

    repeat(
      () => liveData.put(new MicrobitAccelerometerDataVector({ x: 0, y: 0, z: 0 })),
      20,
    );

    expect(() => liveData.getBuffer().getSeries(100, elemsInBuffer)).not.toThrow();
    expect(liveData.getBuffer().getSeries(100, 10).length).toEqual(10);

    expect(() => liveData.getBuffer().getSeries(100, elemsInBuffer + 1)).toThrow();
  });

  test('Can extract vectors from live data', () => {
    const liveData: LiveData<LiveDataVector> = new MicrobitAccelerometerLiveData(
      new LiveDataBuffer(10),
    );

    repeat(
      () => liveData.put(new MicrobitAccelerometerDataVector({ x: 1, y: 2, z: 3 })),
      20,
    );

    expect(() => get(liveData).getValue()).not.toThrow();
    expect(get(liveData).getValue()).toEqual([1, 2, 3]);
  });

  test('Test smoothed values', () => {
    const liveData: LiveData<MicrobitAccelerometerDataVector> =
      new MicrobitAccelerometerLiveData(new LiveDataBuffer(20));
    const smoothLiveData = new SmoothedLiveData(liveData, 2);

    const point1 = new MicrobitAccelerometerDataVector({ x: 3, y: 2, z: 1 });
    const point2 = new MicrobitAccelerometerDataVector({ x: 1, y: 2, z: 3 });

    liveData.put(point1);
    liveData.put(point2);

    expect(get(smoothLiveData).getValue()[0]).toBeCloseTo(
      smoothNewValue(point2.getValue()[0], point1.getValue()[0]),
      10,
    );
    expect(get(smoothLiveData).getValue()[1]).toBeCloseTo(
      smoothNewValue(point2.getValue()[1], point1.getValue()[1]),
      10,
    );
    expect(get(smoothLiveData).getValue()[2]).toBeCloseTo(
      smoothNewValue(point2.getValue()[2], point1.getValue()[2]),
      10,
    );
  });
});
