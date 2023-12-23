/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable } from 'svelte/store';
import { LayersModel } from '@tensorflow/tfjs-layers';
import Gesture, { GestureData } from '../domain/Gesture';
import { liveAccelerometerData } from './Stores';
import StaticConfiguration from '../../StaticConfiguration';
import { MicrobitAccelerometerData } from '../livedata/MicrobitAccelerometerData';

export type RecordingData = {
  ID: number;
  data: {
    x: number[];
    y: number[];
    z: number[];
  };
};

// Store for current gestures
export const chosenGesture = writable<Gesture | null>(null);

export const gestureConfidences = writable<{ [id: string]: number }>({});

// TODO: This is only used one place. Remove store and compute best prediction at said component?
export const bestPrediction = writable<GestureData | undefined>(undefined);

// Store for components to assess model status
export const model = writable<LayersModel>(undefined);

// Stores and manages previous data-elements. Used for classifying current gesture
// TODO: Only used for 'getPrevData' (which is only used for ml.ts). Do we even want this as global state?
export const prevData = writable<MicrobitAccelerometerData[]>(
  new Array(StaticConfiguration.pollingPredictionSampleSize),
);

let liveDataIndex = 0;
liveAccelerometerData.subscribe(data => {
  prevData.update((prevDataArray: MicrobitAccelerometerData[]) => {
    prevDataArray[liveDataIndex] = data;
    return prevDataArray;
  });
  liveDataIndex++;
  if (liveDataIndex >= StaticConfiguration.pollingPredictionSampleSize) {
    liveDataIndex = 0;
  }
});

// TODO: Should be replaced by the livedata buffer instead
export function getPrevData(): { x: number[]; y: number[]; z: number[] } | undefined {
  const data: MicrobitAccelerometerData[] = get(prevData);
  const dataLength: number = data.length;
  // Returns undefined if there has not being collected minSamples data yet
  if (Object.values(data).length !== data.length) {
    return undefined;
  }
  const x: number[] = new Array<number>(dataLength);
  const y: number[] = new Array<number>(dataLength);
  const z: number[] = new Array<number>(dataLength);

  for (let i = 0; i < dataLength; i++) {
    const oldDataIndex = (i + liveDataIndex) % dataLength;
    x[i] = data[oldDataIndex].x;
    y[i] = data[oldDataIndex].y;
    z[i] = data[oldDataIndex].z;
  }

  return { x, y, z };
}
