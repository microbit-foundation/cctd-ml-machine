/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import { alertUser, state } from './stores/uiStore';
import {
  bestPrediction,
  gestureConfidences,
  type GestureData,
  getPrevData,
  model,
  settings,
  TrainingStatus,
  trainingStatus,
} from './stores/mlStore';
import { FilterType, Axes, determineFilter, AxesType } from './datafunctions';
import { get, type Unsubscriber } from 'svelte/store';
import { t } from '../i18n';
import * as tf from '@tensorflow/tfjs';
import { LayersModel, SymbolicTensor, Tensor } from '@tensorflow/tfjs';
import { gestures } from './stores/Stores';
import Repositories from './Repositories';
import Event from "./Event";

let text: (key: string, vars?: object) => string;
t.subscribe(t => (text = t));

// Whenever model is trained, the settings at the time is saved in this variable
// Such that prediction continues on with the same settings as during training
let modelSettings: { axes: AxesType[]; filters: Set<FilterType> };

// Hacky "timer" to pad the training time if needed
let trainingTimerPromise: Promise<boolean>;

// Add parameter to allow unsubscribing from store, when predicting ends.
// Prevents memory leak.
let unsubscribeFromSettings: Unsubscriber | undefined = undefined;

// Variable for accessing the predictionInterval
let predictionInterval: NodeJS.Timeout | undefined = undefined;

function createModel(): LayersModel {
  const gestureData = get(gestures);
  const numberOfClasses: number = gestureData.length;
  const inputShape = [
    get(settings).includedFilters.size * get(settings).includedAxes.length,
  ];

  const input = tf.input({ shape: inputShape });
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

// GET WEIGHTS
export type ModelLayer = {
  weights: number[];
  biases: number[];
}

export type LabelConfidencePair = {
  label: string;
  confidence: number;
}

export type PredictionResults = LabelConfidencePair[];

/**
 * Get an array of layers within the current model.
 * Each layer consists of two flat arrays of respectively weights and biases
 * @returns Layers of model
 */
 export function getWeights(): Promise<ModelLayer[]> {
  const neuralNetwork: LayersModel = get(model);
  return new Promise<ModelLayer[]>((resolve, reject) => {
    if (neuralNetwork === undefined) {
      reject("No model is present");
      return;
    }

    const extractedLayers : ModelLayer[] = [];
    console.log("Model layers: ", neuralNetwork);
    resolve([
      {
          "weights": {
              "0": 0.22975851595401764,
              "1": 0.006445590872317553,
              "2": 0.3651563823223114,
              "3": 0.15232855081558228,
              "4": 0.256447434425354,
              "5": 0.16391021013259888,
              "6": 0.0012586814118549228,
              "7": 0.2568777799606323,
              "8": 0.661003589630127,
              "9": 0.32864779233932495,
              "10": 0.1868351697921753,
              "11": 0.09628582000732422,
              "12": 0.4638656675815582,
              "13": 0.10542968660593033,
              "14": 0.13951319456100464,
              "15": 0.043497178703546524,
              "16": 0.5447653532028198,
              "17": 0.18145360052585602,
              "18": 0.35326874256134033,
              "19": 0.4246135652065277,
              "20": 0.21941885352134705,
              "21": 0.06613405793905258,
              "22": 0.15227526426315308,
              "23": 0.18965251743793488,
              "24": 0.5864914655685425,
              "25": 0.6089742183685303,
              "26": 0.21753616631031036,
              "27": 0.19422811269760132,
              "28": 0.28684717416763306,
              "29": 0.1884368360042572,
              "30": 0.18458625674247742,
              "31": 0.02081356756389141,
              "32": 0.2882952094078064,
              "33": 0.03261197358369827,
              "34": 0.8379471898078918,
              "35": 0.37246835231781006,
              "36": 0.025962237268686295,
              "37": 0.2031194418668747,
              "38": 0.05229736492037773,
              "39": 0.19423121213912964,
              "40": 0.39530202746391296,
              "41": 0.6619464755058289,
              "42": 0.30651387572288513,
              "43": 0.2829100489616394,
              "44": 0.07977516204118729,
              "45": 0.17614758014678955,
              "46": 0.1032099723815918,
              "47": 0.49961167573928833,
              "48": 0.2072754204273224,
              "49": 0.13193371891975403,
              "50": 0.3951583802700043,
              "51": 0.4398827850818634,
              "52": 0.03153643757104874,
              "53": 0.3379824161529541,
              "54": 0.09364543855190277,
              "55": 0.37654349207878113,
              "56": 0.6366833448410034,
              "57": 0.5644657611846924,
              "58": 0.13486501574516296,
              "59": 0.11356453597545624,
              "60": 0.5461100935935974,
              "61": 0.29706504940986633,
              "62": 0.01285259798169136,
              "63": 0.7686774134635925,
              "64": 0.1153133288025856,
              "65": 0.31371885538101196,
              "66": 0.2412048876285553,
              "67": 0.2031463235616684,
              "68": 0.06176621839404106,
              "69": 0.18344374001026154,
              "70": 0.3783668577671051,
              "71": 0.2914965748786926,
              "72": 0.05589932203292847,
              "73": 0.562262237071991,
              "74": 0.3901219069957733,
              "75": 0.08633102476596832,
              "76": 0.12797896564006805,
              "77": 0.1552605926990509,
              "78": 0.2523828148841858,
              "79": 0.11892596632242203,
              "80": 0.14284881949424744,
              "81": 0.4516315758228302,
              "82": 0.11559627205133438,
              "83": 0.017779456451535225,
              "84": 0.13742069900035858,
              "85": 0.18653765320777893,
              "86": 0.7201366424560547,
              "87": 1.0469825267791748,
              "88": 0.39436689019203186,
              "89": 0.3110939860343933,
              "90": 0.20331108570098877,
              "91": 0.09105582535266876,
              "92": 0.6225259304046631,
              "93": 0.3662862777709961,
              "94": 0.24124673008918762,
              "95": 0.010165385901927948
          },
          "biases": {
              "0": 0,
              "1": 0,
              "2": 0.11272893100976944,
              "3": 0.1139492616057396,
              "4": 0.01928190514445305,
              "5": 0.18754713237285614,
              "6": 0.31069624423980713,
              "7": 0.43518856167793274,
              "8": 0.14972706139087677,
              "9": 0.1413734257221222,
              "10": 0.02907503955066204,
              "11": 0,
              "12": 0.14413250982761383,
              "13": 0,
              "14": 0,
              "15": 0.10365673899650574
          }
      },
      {
          "weights": {
              "0": 0.0642457827925682,
              "1": 0.10625755786895752,
              "2": 0.2637644410133362,
              "3": 0.11878874897956848,
              "4": 0.4763989746570587,
              "5": 0.7926439642906189,
              "6": 0.4274751842021942,
              "7": 0.4763071835041046,
              "8": 0.36912789940834045,
              "9": 0.04928659275174141,
              "10": 0.14920277893543243,
              "11": 0.135368213057518,
              "12": 0.6258533000946045,
              "13": 0.36930662393569946,
              "14": 0.5447409749031067,
              "15": 0.8076516389846802,
              "16": 0.47769778966903687,
              "17": 0.7187826633453369,
              "18": 0.44273942708969116,
              "19": 1.0828588008880615,
              "20": 0.42193591594696045,
              "21": 0.07196920365095139,
              "22": 0.3618513345718384,
              "23": 0.5839062929153442,
              "24": 0.22663575410842896,
              "25": 0.235091894865036,
              "26": 0.6365035176277161,
              "27": 0.19433802366256714,
              "28": 0.4274584949016571,
              "29": 0.10867241024971008,
              "30": 0.6487986445426941,
              "31": 0.3368111550807953
          },
          "biases": {
              "0": 0.9695621132850647,
              "1": 0.9695621132850647
          }
      }
  ]);
    // const modelLayers = neuralNetwork.neuralNetwork.model.layers;

    // for (let i = 0; i < modelLayers.length; i++) {
    //   const modelWeightLayers = modelLayers[i].getWeights();
    //   const modelWeights = modelWeightLayers[0].dataSync();
    //   const modelBiases = modelWeightLayers[1].dataSync();

    //   const extractedLayer : ModelLayer = {
    //     weights: modelWeights.map(Math.abs),
    //     biases: modelBiases.map(Math.abs)
    //   };
    //   extractedLayers.push(extractedLayer);
    // }

    // resolve(extractedLayers);
  });
}

/**
 * Compare function for sorting results from prediction
 * @param a confidencePair
 * @param b confidencePair
 * @returns (-1 means a is first), (1 means b is first), 0 means they're equal
 */
export function compareLabelAlphabetically(a: LabelConfidencePair, b: LabelConfidencePair) : number {
  if (a.label < b.label) {
    return -1;
  }
  if (a.label > b.label) {
    return 1;
  }
  return 0;
}

// function getInputs() : any {
//   // push data from data-points
//   const { x, y, z } = getPrevData();

//   // Turn the data into an object of up to 12 parameters
//   return makeInputs(x, y, z);
// }

// // Classify data synchronously
// export function classifySync() : PredictionResults {
//   const currentState = get(state);
//   const classifyingUnavailable = !currentState.isInputConnected || !currentState.isPredicting || currentState.isRecording || currentState.isTraining;
//   if (classifyingUnavailable) return [];

//   // Pass parameters to classify
//   const results : PredictionResults = get(model).classifySync(getInputs());
//   results.sort(compareLabelAlphabetically)
//   classifyEvent.invoke(results);
//   return results;
// }

export function classifySync() {
  return [
    {
        "1637677921852": 0.9734976887702942,
        "label": "1637677921852",
        "confidence": 0.9734976887702942
    },
    {
        "1637677924329": 0.02650230936706066,
        "label": "1637677924329",
        "confidence": 0.02650230936706066
    }
  ]
}

export function getIndexOfGreatestPrediction(predictions: PredictionResults) : number {
    let max = 0;
    let indexOfMax = 0;
    for (let i = 0; i < predictions.length; i++) {
      const confidence = predictions[i].confidence;
      if (max > confidence) continue;
      max = confidence;
      indexOfMax = i;
    }
    return indexOfMax;
}

// GET WEIGHTS END

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

  // Freeze modelSetting untill next training
  modelSettings = {
    axes: get(settings).includedAxes,
    filters: get(settings).includedFilters,
  };

  // Fetch data
  const gestureData = get(gestures);
  const features: Array<number[]> = [];
  const labels: Array<number[]> = [];
  const numberofClasses: number = gestureData.length;

  gestureData.forEach((MLClass, index) => {
    MLClass.recordings.forEach(recording => {
      // prepare features
      const inputs: number[] = makeInputs(recording.data);
      features.push(inputs);

      // Prepare labels
      const label: number[] = new Array(numberofClasses) as number[];
      label.fill(0, 0, numberofClasses);
      label[index] = 1;
      labels.push(label);
    });
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


  const onTrainEnd = () => finishedTraining();

  nn.fit(tensorFeatures, tensorLabels, {
    epochs: get(settings).numEpochs,
    batchSize: 16,
    validationSplit: 0.1,
    callbacks: { onTrainEnd }, // onEpochEnd <-- use this to make loading animation
  }).catch(err => {
    trainingStatus.set(TrainingStatus.Failure);
    console.error('tensorflow training process failed:', err);
  });
  trainingStatus.set(TrainingStatus.Success);
  model.set(nn);
}

export function isParametersLegal(): boolean {
  const s = get(settings);
  return s.includedAxes.length > 0 && s.includedFilters.size > 0;
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

// makeInput reduces array of x, y and z inputs to a single number array with values.
// Depending on user settings. There will be anywhere between 1-24 parameters in

function makeInputs(sample: { x: number[]; y: number[]; z: number[] }): number[] {
  const dataRep: number[] = [];

  if (!modelSettings) {
    throw new Error('Model settings not found');
  }

  // We use modelSettings to determine which filters to use. In this way the classify function
  // will be called with the same filters and axes untill the next training
  modelSettings.filters.forEach(filter => {
    const filterOutput = determineFilter(filter);
    if (modelSettings.axes.includes(Axes.X))
      dataRep.push(filterOutput.computeOutput(sample.x));
    if (modelSettings.axes.includes(Axes.Y))
      dataRep.push(filterOutput.computeOutput(sample.y));
    if (modelSettings.axes.includes(Axes.Z))
      dataRep.push(filterOutput.computeOutput(sample.z));
  });

  return dataRep;
}

// Set the global state. Telling components, that the program is predicting
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

export const classifyEvent = new Event<PredictionResults>();

// Classify data
export function classify() {
  // Get currentState to check whether the prediction has been interrupted by other processes
  const currentState = get(state);
  const currentTrainingStatus = get(trainingStatus);
  const hasBeenInterrupted =
    !currentState.isPredicting ||
    currentState.isRecording ||
    currentState.isTraining ||
    currentTrainingStatus !== TrainingStatus.Success;

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

  // Mock of classifysync
  const mockResult = [
    {
        "1637677921852": 0.9734976887702942,
        "label": "1637677921852",
        "confidence": 0.9734976887702942
    },
    {
        "1637677924329": 0.02650230936706066,
        "label": "1637677924329",
        "confidence": 0.02650230936706066
    }
  ]

  mockResult.sort(compareLabelAlphabetically)
  classifyEvent.invoke(mockResult);



  // Get formatted version of previous data
  const data = getPrevData();
  if (data === undefined)
    throw new Error('Unsufficient amount of data to make prediction');
  const input: number[] = makeInputs(data);
  const inputTensor = tf.tensor([input]);
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
    Repositories.getInstance()
      .getModelRepository()
      .setGestureConfidence(ID, result[index]);

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
      bestPrediction.set({
        ...gesture,
        confidence: {
          currentConfidence: bestConfidence,
          requiredConfidence: gesture.confidence.requiredConfidence,
          isConfident: gesture.confidence.isConfident,
        },
      });
    }
  }
}