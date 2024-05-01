/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import LocalStorageRepositories from '../repository/LocalStorageRepositories';
import PollingPredictorEngine from '../engine/PollingPredictorEngine';
import MicrobitAccelerometerLiveData, { MicrobitAccelerometerDataVector } from '../livedata/MicrobitAccelerometerData';
import LiveDataBuffer from '../domain/LiveDataBuffer';
import StaticConfiguration from '../../StaticConfiguration';
import Repositories from '../domain/Repositories';
import Gestures from '../domain/stores/gesture/Gestures';
import Classifier from '../domain/stores/Classifier';
import Engine from '../domain/stores/Engine';
import LiveData from '../domain/stores/LiveData';
import { LiveDataVector } from '../domain/stores/LiveDataVector';

const repositories: Repositories = new LocalStorageRepositories();

const gestures: Gestures = new Gestures(repositories.getGestureRepository());
const classifier: Classifier = repositories.getClassifierRepository().getClassifier();

const accelerometerDataBuffer = new LiveDataBuffer<MicrobitAccelerometerDataVector>(
  StaticConfiguration.accelerometerLiveDataBufferSize,
);
const liveData: LiveData<LiveDataVector> =
  new MicrobitAccelerometerLiveData(accelerometerDataBuffer);

const engine: Engine = new PollingPredictorEngine(classifier, liveData);

// Export the stores here. Please be mindful when exporting stores, avoid whenever possible.
// This helps us avoid leaking too many objects, that aren't meant to be interacted with
export { engine, gestures, classifier, liveData as liveAccelerometerData };
