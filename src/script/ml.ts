import { alertUser, informUser, state } from './stores/uiStore';
import {
  bestPrediction,
  gestureConfidences,
  type GestureData,
  gestures,
  getPrevData,
  model,
  settings,
  //trainingState,
  TrainingStatus,
  trainingStatus,
} from './stores/mlStore';
import { peaks, standardDeviation, totalAcceleration } from './datafunctions';
import { get, type Unsubscriber } from 'svelte/store';
import { t } from '../i18n';
import * as tf from '@tensorflow/tfjs';
import { LayersModel, SymbolicTensor, Tensor } from '@tensorflow/tfjs';

let text: (key: string, vars?: object) => string;
t.subscribe(t => (text = t));

// Whenever model is trained, the settings at the time is saved in this variable
// Such that prediction continues on with the same settings as during training
let modelSettings: { axes: boolean[]; params: boolean[] };

// Hacky "timer" to pad the training time if needed
let trainingTimerPromise: Promise<boolean>;

// Add parameter to allow unsubscribing from store, when predicting ends.
// Prevents memory leak.
let unsubscribeFromSettings: Unsubscriber | undefined = undefined;

// Variable for accessing the predictionInterval
let predictionInterval: NodeJS.Timeout | undefined = undefined;

type accData =
  | 'ax_max'
  | 'ax_min'
  | 'ax_std'
  | 'ax_peaks'
  | 'ax_total'
  | 'ay_max'
  | 'ay_min'
  | 'ay_std'
  | 'ay_peaks'
  | 'ay_total'
  | 'az_max'
  | 'az_min'
  | 'az_std'
  | 'az_peaks'
  | 'az_total';

function createModel(): LayersModel {
  //const shape = get(settings).includedAxes * get(settings).includedParameters;
  const gestureData = get(gestures);
  const numberOfClasses: number = gestureData.length;

  const input = tf.input({ shape: [15] });
  const normalizer = tf.layers.batchNormalization().apply(input);
  const dense = tf.layers.dense({ units: 16, activation: 'relu' }).apply(normalizer);
  const softmax = tf.layers
    .dense({ units: numberOfClasses, activation: 'softmax' })
    .apply(dense) as SymbolicTensor;
  const model = tf.model({ inputs: input, outputs: softmax });

  model.compile({
    loss: 'categoricalCrossentropy',
    optimizer: tf.train.sgd(0.5),
    metrics: ['accuracy'],
  });

  return model;
}

function dataMapToFeatureArray(data: Map<accData, number>): number[] {
  const features: number[] = [];
  for (const value of data.values()) {
    features.push(value);
  }
  return features;
}

export function trainModel() {
  state.update(obj => {
    obj.isTraining = true;
    return obj;
  });
  if (!isTrainingAllowed()) {
    state.update(obj => {
      obj.isTraining = false;
      return obj;
    });
    return;
  }

  informUser(text('alert.beginModelSetup'));

  // Fetch data
  const gestureData = get(gestures);
  const features: Array<number[]> = [];
  const labels: Array<number[]> = [];
  const numberofClasses: number = gestureData.length;

  gestureData.forEach((MLClass, index) => {
    MLClass.recordings.forEach(recording => {
      // prepare features
      const x = recording.data.x;
      const y = recording.data.y;
      const z = recording.data.z;

      const inputs: Map<accData, number> = makeInputs(x, y, z);
      features.push(dataMapToFeatureArray(inputs));

      // Prepare labels
      const label: number[] = new Array(numberofClasses) as number[];
      label.fill(0, 0, numberofClasses);
      label[index] = 1;
      labels.push(label);
    });

    const tensorFeatures = tf.tensor(features);
    const tensorLabels = tf.tensor(labels);

    const nn: LayersModel = createModel();

    trainingTimerPromise = new Promise(resolve => {
      setTimeout(() => {
        resolve(true);
      }, 2500);
      // Promise resolves after 2.5 sec, making training take at least 2.5 sec from users perspective
      // See "finishedTraining" function to see how this works
    });

    nn.fit(tensorFeatures, tensorLabels, {
      epochs: get(settings).numEpochs,
      batchSize: 16,
      validationSplit: 0.1,
      //callbacks: { onEpochEnd } // <-- use this to make loading animation
    })
      .then(() => {
        finishedTraining();
      })
      .catch(err => {
        trainingStatus.update(() => TrainingStatus.Failure);
        console.error('tensorflow training process failed:', err);
      });

    model.set(nn);
  });
}

export function isParametersLegal(): boolean {
  const s = get(settings);
  return (
    s.includedAxes.reduce((sum, x) => sum || x) &&
    s.includedParameters.reduce((sum, x) => sum || x)
  );
}

// Assess whether
function isTrainingAllowed(messageUser = true) {
  const gestureData = get(gestures);

  // If less than two gestures
  if (!gestureData || gestureData.length < 2) {
    if (messageUser) {
      alertUser(text('alert.twoGestures'));
    }
    return false;
  }

  // If parameters aren't legal
  if (!isParametersLegal()) {
    if (messageUser) {
      alertUser(text('alert.oneDataRepresentation'));
    }
    return false;
  }

  // If gestures have less than three recordings per gesture.
  if (!sufficientGestureData(gestureData, messageUser)) {
    return false;
  }

  return true;
}

// Assess whether each gesture has sufficient data. (Limited by three)
export function sufficientGestureData(gestureData: GestureData[], messageUser: boolean) {
  let sufficientData = true;
  gestureData.forEach(gesture => {
    if (gesture.recordings.length < 3) {
      if (messageUser) {
        alertUser(text('alert.recordingsPerGesture'));
      }
      sufficientData = false;
    }
  });
  return sufficientData;
}

// Set state to not-Training and initiate prediction.
function finishedTraining() {
  // Wait for promise to resolve, to ensure a minimum of 2.5 sec of training from users perspective
  void trainingTimerPromise.then(() => {
    state.update(obj => {
      obj.isTraining = false;
      return obj;
    });
    setupPredictionInterval();
  });
}

// For each epoch, whileTraining is called.
// Updates trainingState, which components can listen to.
// function whileTraining(epoch: number, loss: { val_loss: number, val_acc: number, loss: number, acc: number }) {
// 	const numEpochs = get(settings).numEpochs + 1;

// 	trainingState.set({
// 		percentage: Math.round((epoch / numEpochs) * 100),
// 		loss: loss.val_loss,
// 		epochs: epoch
// 	});
// }

// makeInput reduces array of x, y and z inputs to a single object with values.
// Depending on user settings. There will be anywhere between 1-12 parameters in
// The return object.

export function makeInputs(x: number[], y: number[], z: number[]): Map<accData, number> {
  const obj: Map<accData, number> = new Map();

  if (!modelSettings) {
    modelSettings = {
      axes: get(settings).includedAxes,
      params: get(settings).includedParameters,
    };
  }
  if (modelSettings.axes[0]) {
    if (modelSettings.params[0]) {
      obj.set('ax_max', Math.max(...x));
    }
    if (modelSettings.params[1]) {
      obj.set('ax_min', Math.min(...x));
    }
    if (modelSettings.params[2]) {
      obj.set('ax_std', standardDeviation(x));
    }
    if (modelSettings.params[3]) {
      obj.set('ax_peaks', peaks(x).numPeaks);
    }
    if (modelSettings.params[4]) {
      obj.set('ax_total', totalAcceleration(x));
    }
  }

  if (modelSettings.axes[1]) {
    if (modelSettings.params[0]) {
      obj.set('ay_max', Math.max(...y));
    }
    if (modelSettings.params[1]) {
      obj.set('ay_min', Math.min(...y));
    }
    if (modelSettings.params[2]) {
      obj.set('ay_std', standardDeviation(y));
    }
    if (modelSettings.params[3]) {
      obj.set('ay_peaks', peaks(y).numPeaks);
    }
    if (modelSettings.params[4]) {
      obj.set('ay_total', totalAcceleration(y));
    }
  }

  if (modelSettings.axes[2]) {
    if (modelSettings.params[0]) {
      obj.set('az_max', Math.max(...z));
    }
    if (modelSettings.params[1]) {
      obj.set('az_min', Math.min(...z));
    }
    if (modelSettings.params[2]) {
      obj.set('az_std', standardDeviation(z));
    }
    if (modelSettings.params[3]) {
      obj.set('az_peaks', peaks(z).numPeaks);
    }
    if (modelSettings.params[4]) {
      obj.set('az_total', totalAcceleration(z));
    }
  }

  return obj;
}

// Set the global state. Telling components, that the program is prediction
function setIsPredicting(isPredicting: boolean): void {
  state.update(s => {
    s.isPredicting = isPredicting;
    return s;
  });
}

// Setup prediction. Listens for user-settings (Updates pr second).
// Whenever this changes, the updatesPrSecond also changes.
function setupPredictionInterval(): void {
  // Set state and fetch updatesPrSecond.
  setIsPredicting(true);
  const updatesPrSecond = get(settings).updatesPrSecond;

  const classifyAutomatically = get(settings).automaticClassification;

  if (classifyAutomatically) {
    predictionInterval = setInterval(classify, 1000 / updatesPrSecond);
  }

  // When user changes settings
  unsubscribeFromSettings = settings.subscribe(update => {
    // Only if the updatesPrSecond changed or buttons changed
    // TODO: Change to early exit structure
    if (
      update.updatesPrSecond !== updatesPrSecond ||
      update.automaticClassification !== classifyAutomatically
    ) {
      if (predictionInterval !== undefined) {
        clearInterval(predictionInterval);
      }
      predictionInterval = undefined;
      setupPredictionInterval();
    }
  });
}

// Classify data
export function classify() {
  // Get currentState to check whether the prediction has been interrupted by other processes
  const currentState = get(state);
  const hasBeenInterrupted =
    !currentState.isPredicting || currentState.isRecording || currentState.isTraining;

  if (hasBeenInterrupted) {
    if (predictionInterval !== undefined) {
      clearInterval(predictionInterval);
    }
    predictionInterval = undefined;
    setIsPredicting(false);
    unsubscribeFromSettings?.();
    // if (unsubscribeFromSettings) unsubscribeFromSettings();
    return;
  }

  if (!currentState.isInputConnected) return;

  // Get formatted version of previous data
  const { x, y, z } = getPrevData();
  const input: Map<accData, number> = makeInputs(x, y, z);
  const tfInput: number[] = dataMapToFeatureArray(input);
  const inputTensor = tf.tensor([tfInput]);
  const prediction: Tensor = get(model).predict(inputTensor) as Tensor;
  prediction
    .data()
    .then(data => {
      tfHandlePrediction(data as Float32Array);
    })
    .catch(err => console.error('Prediction error:', err));
}

function tfHandlePrediction(result: Float32Array) {
  let bestConfidence = 0;
  let bestGestureID: number | undefined = undefined;

  const gestureData = get(gestures);

  gestureData.forEach(({ ID }, index) => {
    gestureConfidences.update(confidenceMap => {
      confidenceMap[ID] = result[index];
      return confidenceMap;
    });

    if (result[index] > bestConfidence) {
      bestConfidence = result[index];
      bestGestureID = ID;
    }
  });

  for (const gesture of get(gestures)) {
    if (gesture.ID === bestGestureID) {
      bestPrediction.set({ ...gesture, confidence: bestConfidence });
    }
  }
}

// creates input parameters for the algortihm.
// Utilizes the learningParameter array and the user settings to
// Create an option array which the learning algorithm takes in.
// function createInputs(s: { axes: boolean[]; params: boolean[]; }) {
// 	const learningParameters = [
// 		"ax_max",
// 		"ax_min",
// 		"ax_std",
// 		"ax_peaks",
// 		"ax_total",
// 		"ay_max",
// 		"ay_min",
// 		"ay_std",
// 		"ay_peaks",
// 		"ay_total",
// 		"az_max",
// 		"az_min",
// 		"az_std",
// 		"az_peaks",
// 		"az_total"
// 	];
// 	const options: string[] = [];
// 	for (let axNum = 0; axNum < s.axes.length; axNum++) {
// 		for (let paramNum = 0; paramNum < s.params.length; paramNum++) {
// 			if (s.axes[axNum] && s.params[paramNum]) {
// 				const lookup = axNum * 5 + paramNum;
// 				options.push(learningParameters[lookup]);
// 			}
// 		}
// 	}
// 	return options;
// }
