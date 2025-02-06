/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * Static configuration values. These values are not expected to change, while the application is running.
 */
import { MBSpecs } from 'microbyte';
import { PinTurnOnState } from './components/output/PinSelectorUtil';
import { type LayersModelTrainingSettings as NeuralNetworkModelTrainerSettings } from './script/mlmodels/LayersModelTrainer';
import { HexOrigin } from './script/microbit-interfacing/HexOrigin';

class StaticConfiguration {
  // in milliseconds, how long should be wait for reconnect before determining something catestrophic happened during the process?
  public static readonly reconnectTimeoutDuration: number = 7500;
  public static readonly connectTimeoutDuration: number = 10000; // initial connection

  // After how long should we consider the connection lost if ping was not able to conclude?
  public static readonly connectionLostTimeoutDuration: number = 3000;

  // In milliseconds, how long should each recording be?
  public static readonly recordingDuration = 1800;

  // Which pins are supported?
  public static supportedPins: MBSpecs.UsableIOPin[] = [0, 1, 2];
  public static readonly defaultOutputPin: MBSpecs.UsableIOPin = 0; // Which pin should be selected by default?
  // In milliseconds, after turning on, how long should an output be on for?
  public static readonly defaultPinToggleTime = 1500;
  public static readonly defaultPinTurnOnState: PinTurnOnState = PinTurnOnState.X_TIME;
  public static readonly pinIOEnabledByDefault: boolean = true;

  // What name should a downloaded hex file have?
  public static readonly downloadedHexFilename = 'firmware.hex';

  // How long may gesture names be?
  public static readonly gestureNameMaxLength = 18;

  // Default required confidence level
  public static readonly defaultRequiredConfidence = 0.8;

  // Duration before assuming the microbit is outdated? (in milliseconds)
  public static readonly versionIdentificationTimeoutDuration = 4000;

  // Link to the MakeCode firmware template
  public static readonly makecodeFirmwareUrl =
    'https://makecode.microbit.org/#pub:52042-28239-00563-08630';

  public static readonly isMicrobitOutdated = (origin: HexOrigin, version: number) => {
    // Current versions, remember to update these, whenever changes to firmware are made!
    if (origin === HexOrigin.UNKNOWN) return true;

    const versionNumbers = new Map();
    versionNumbers.set(HexOrigin.MAKECODE, 1); // Change the number to advise users to update old hex files
    versionNumbers.set(HexOrigin.PROPRIETARY, 1); // Change the number to advise users to update old hex files
    return versionNumbers.get(origin) !== version;
  };

  // Line colors are picked in the order of this array.
  public static readonly graphColors = [
    '#ff606e',
    '#30f09e',
    '#3030ff',
    '#58355E',
    '#E0FF4F',
    '#FF2ECC',
    '#F28F3B',
    '#C8553D',
  ];

  // Colors to assign to gestures, useful for identifying gestures on graphs.
  public static readonly gestureColors = [
    '#FCA311',
    '#00ff81',
    '#b1e400',
    '#ADFCF9',
    '#89A894',
    '#4B644A',
    '#49393B',
    '#341C1C',
  ];

  // What will the min and max y-values on the livegraph be?
  public static readonly liveGraphValueBounds = {
    min: -2,
    max: 2.3,
  };

  // How long should we wait in between each prediction? (in milliseconds) Higher is more performant, lower is smoother UI
  public static readonly pollingPredictionInterval: number = 80;

  /**
   * How many samples should we use for prediction?
   * Higher means more data for each prediction, which hopefully means a more accurate prediction, but the higher the value, the more samples must be in the LiveDataBuffer.
   * If this value is too high, the buffer may not contain enough data for predicting.
   */
  public static readonly pollingPredictionSampleSize = 35;

  /**
   * How far back in time should the engine look for sample data for it's current prediction? (in milliseconds).
   */
  public static readonly pollingPredictionSampleDuration = 1800;

  /**
   * The size od the accelerometer livedata buffer. Larger means more memory is consumed.
   * Insertions are O(1) and fetching is O(n) where n is the number of items fetched.
   */
  public static readonly accelerometerLiveDataBufferSize = 600;

  /**
   * The minimum number of recordings per gesture to indicate sufficient data.
   */
  public static readonly minNoOfRecordingsPerGesture = 3;

  /**
   * If insufficient data is found in the buffer, then how many fewer data points should we attempt to sample next attempt?
   */
  public static readonly pollingPredictionSampleSizeSearchStepSize = 3;

  /**
   * The minimum number of gesture to indicate sufficient data.
   */
  public static readonly minNoOfGestures = 2;

  /**
   * The neural network training settings
   */
  public static readonly defaultNeuralNetworkSettings: NeuralNetworkModelTrainerSettings =
    {
      noOfEpochs: 80,
      batchSize: 16,
      learningRate: 0.5,
      validationSplit: 0.1,
      noOfUnits: 16, // size of hidden layer
    };

  /**
   * How many samples should the KNN model use for prediction? i.e the k-value.
   */
  public static readonly defaultKnnNeighbourCount = 3;
}
export default StaticConfiguration;
