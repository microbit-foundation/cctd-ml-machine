/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import LocalStorageRepositories from '../repository/LocalStorageRepositories';
import PollingPredictorEngine from '../engine/PollingPredictorEngine';
import MicrobitAccelerometerLiveData, {
  MicrobitAccelerometerData,
} from '../livedata/MicrobitAccelerometerData';
import LiveDataBuffer from '../domain/LiveDataBuffer';
import StaticConfiguration from '../../StaticConfiguration';
import Repositories from '../domain/Repositories';
import Gestures from '../domain/stores/gesture/Gestures';
import Classifier from '../domain/stores/Classifier';
import Engine from '../domain/stores/Engine';
import LiveData from '../domain/stores/LiveData';
import { derived } from 'svelte/store';

const repositories: Repositories = new LocalStorageRepositories();

const gestures: Gestures = new Gestures(repositories.getGestureRepository());
const classifier: Classifier = repositories.getClassifierRepository().getClassifier();

const accelerometerDataBuffer = new LiveDataBuffer<MicrobitAccelerometerData>(
  StaticConfiguration.accelerometerLiveDataBufferSize,
);
const liveAccelerometerData: LiveData<MicrobitAccelerometerData> =
  new MicrobitAccelerometerLiveData(accelerometerDataBuffer);

const engine: Engine = new PollingPredictorEngine(classifier, liveAccelerometerData);

// I'm not sure if this one should be
const confidences = derived([gestures, ...gestures.getGestures()], stores => {
  const confidenceMap = new Map();

  const [_, ...gestureStores] = stores;
  gestureStores.forEach(store => {
    confidenceMap.set(store.ID, store.confidence);
  });
  return confidenceMap;
});
// Export the stores here. Please be mindful when exporting stores, avoid whenever possible.
// This helps us avoid leaking too many objects, that aren't meant to be interacted with
export { engine, gestures, classifier, liveAccelerometerData, confidences };
