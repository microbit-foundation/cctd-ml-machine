/**
 * @vitest-environment jsdom
 */
/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import exp from 'constants';
import LiveDataBuffer from '../script/domain/LiveDataBuffer';
import LiveData from '../script/domain/stores/LiveData';
import MicrobitAccelerometerLiveData, { MicrobitAccelerometerDataVector } from '../script/livedata/MicrobitAccelerometerData';
import { gestures } from '../script/stores/Stores';
import { repeat } from './testUtils';
import { get } from 'svelte/store';
import { LiveDataVector } from '../script/domain/stores/LiveDataVector';

describe('Data representation tests', () => {
    test('Creating accelerometer live data does not throw', () => {
        expect(() => {
            new MicrobitAccelerometerLiveData(new LiveDataBuffer(10))
        }).not.toThrow();
    });

    test('Number of elements in buffer does not exceed set amount', () => {
        const elemsInBuffer = 10;
        const liveData = new MicrobitAccelerometerLiveData(new LiveDataBuffer(elemsInBuffer))

        repeat(() => liveData.put(new MicrobitAccelerometerDataVector({ x: 0, y: 0, z: 0 })), 20)


        expect(() => liveData.getBuffer().getSeries(100, elemsInBuffer)).not.toThrow();
        expect(liveData.getBuffer().getSeries(100, 10).length).toEqual(10);

        expect(() => liveData.getBuffer().getSeries(100, elemsInBuffer + 1)).toThrow();
    })

    test("Can extract vectors from live data", () => {
        const liveData: LiveData<LiveDataVector> = new MicrobitAccelerometerLiveData(new LiveDataBuffer(10))

        repeat(() => liveData.put(new MicrobitAccelerometerDataVector({ x: 1, y: 2, z: 3 })), 20)

        expect(() => get(liveData).getVector()).not.toThrow();
        expect(get(liveData).getVector()).toEqual([1, 2, 3])
    })
});

