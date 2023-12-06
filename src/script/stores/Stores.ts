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

throw new Error("Todo: Split up the MicrobitAccelerometerLiveData into a raw version, and a smoothed version, that is derived from the other, such that the micro:bit do not have the responsibility of smoothing data" +
"It should be generic as well, the LiveGraph.svelte component should not have to know about the MicrobitAccelerometerData, as it means it cannot be replicated with magnetic stuff."+
"The question then arises, how to handle the labels on each line? How to handle color(probably just the responsibility of the livegraph)?"+
"i am adding this reminder, because i suspect there will be a merge conflict, and therefore i am going to stop now :))))")
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
export {engine, gestures, classifier, liveAccelerometerData}