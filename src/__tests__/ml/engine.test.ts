/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get } from 'svelte/store';
import LiveDataBuffer from '../../lib/domain/LiveDataBuffer';
import MicrobitAccelerometerLiveData from '../../lib/livedata/MicrobitAccelerometerData';
import { stores } from '../../lib/stores/Stores';

describe('Engine behaviour test', () => {
  test('Engine should stop predicting when the LiveData store is set', () => {
    const liveData = new MicrobitAccelerometerLiveData(new LiveDataBuffer(10));
    stores.setLiveData(liveData);
    const engine = stores.getEngine();
    expect(get(engine).isRunning).toBe(true);
    const newLiveData = new MicrobitAccelerometerLiveData(new LiveDataBuffer(10));
    stores.setLiveData(newLiveData);
    expect(get(engine).isRunning).toBe(false);
    expect(get(stores.getEngine()).isRunning).toBe(true);
  });
});
