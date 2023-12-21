/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { get, writable } from 'svelte/store';
import { LayersModel } from '@tensorflow/tfjs-layers';
import { PersistantGestureData } from '../domain/Gestures';
import Gesture, { GestureData } from '../domain/Gesture';
import { classifier, gestures, liveAccelerometerData } from './Stores';
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

export function loadDatasetFromFile(file: File) {
  const reader = new FileReader();
  reader.onload = function (e: ProgressEvent<FileReader>) {
    if (!e.target) {
      return;
    }
    const contents = e.target.result;
    if (typeof contents === 'string') {
      const gestureData: PersistantGestureData[] = JSON.parse(
        contents,
      ) as PersistantGestureData[];
      gestures.importFrom(gestureData);
    }
  };
  reader.readAsText(file as Blob);
}

export function downloadDataset() {
  const element = document.createElement('a');
  element.setAttribute(
    'href',
    'data:application/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(get(gestures), null, 2)),
  );
  element.setAttribute('download', 'dataset');

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();
  document.body.removeChild(element);
}

export type LiveData = {
  //TODO: remove this
  accelX: number;
  accelY: number;
  accelZ: number;
  smoothedAccelX: number;
  smoothedAccelY: number;
  smoothedAccelZ: number;
};

export const livedata = writable<LiveData>({
  accelX: 0,
  accelY: 0,
  accelZ: 0,
  smoothedAccelX: 0,
  smoothedAccelY: 0,
  smoothedAccelZ: 0,
});

// Store for current gestures
export const chosenGesture = writable<Gesture | null>(null);

// TODO: Should be deleted, and model should automatically be marked as untrained, markAsUntrained should not be called in practice
export function addGesture(name: string): void {
  classifier.getModel().markAsUntrained();
  gestures.createGesture(name);
}


// TODO: Should be deleted, and model should automatically be marked as untrained, markAsUntrained should not be called in practice
export function removeGesture(gesture: GestureData) {
  classifier.getModel().markAsUntrained();
  gestures.removeGesture(gesture.ID);
}

// TODO: Should be deleted, and model should automatically be marked as untrained, markAsUntrained should not be called in practice
export function addRecording(gestureID: number, recording: RecordingData) {
  classifier.getModel().markAsUntrained();
  gestures.getGesture(gestureID).addRecording(recording);
}

// TODO: Should be deleted, and model should automatically be marked as untrained, markAsUntrained should not be called in practice
export function removeRecording(gestureID: number, recordingID: number) {
  classifier.getModel().markAsUntrained();
  gestures.getGesture(gestureID).removeRecording(recordingID);
}

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
    x[i] = data[oldDataIndex].accelX;
    y[i] = data[oldDataIndex].accelY;
    z[i] = data[oldDataIndex].accelZ;
  }

  return { x, y, z };
}
