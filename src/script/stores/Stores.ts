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

export const gestures: Gestures = new Gestures(repositories.getGestureRepository());
export const classifier: Classifier = repositories.getModelRepository().getClassifier();
const liveDataBuffer = new LiveDataBuffer<MicrobitAccelerometerData>(400);
export const liveData: LiveData<MicrobitAccelerometerData> =
  new MicrobitAccelerometerLiveData(liveDataBuffer);
export const engine: PollingPredictorEngine = new PollingPredictorEngine(
  classifier,
  liveData,
);
