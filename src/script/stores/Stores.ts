/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import Repositories from '../repository/Repositories';
import Gestures from '../domain/Gestures';
import Classifier from '../domain/Classifier';
import PollingPredictorEngine from '../engine/PollingPredictorEngine';
import LiveData from '../domain/LiveData';
import MicrobitAccelerometerLiveData, {
  MicrobitAccelerometerData,
} from '../livedata/MicrobitAccelerometerData';
import LiveDataBuffer from '../domain/LiveDataBuffer';

const repositories = new Repositories();

const gestures: Gestures = new Gestures(repositories.getGestureRepository());
const classifier: Classifier = repositories.getModelRepository().getClassifier();

const accelerometerDataBuffer = new LiveDataBuffer<MicrobitAccelerometerData>(400);
const liveAccelerometerData: LiveData<MicrobitAccelerometerData> =
  new MicrobitAccelerometerLiveData(accelerometerDataBuffer);

const engine: PollingPredictorEngine = new PollingPredictorEngine(
  classifier,
  liveAccelerometerData,
);

// Export the stores here. Please be mindful when exporting stores, avoid whenever possible.
export { engine, gestures, classifier, liveAccelerometerData };