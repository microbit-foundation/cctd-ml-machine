/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

/**
 * Static configuration values. These values are not expected to change, while the application is running.
 */
import { PinTurnOnState } from './components/output/PinSelectorUtil';
import MBSpecs from './script/microbit-interfacing/MBSpecs';
import { HexOrigin } from './script/microbit-interfacing/Microbits';
import { LayersModelTrainingSettings } from './script/mlmodels/LayersModelTrainer';

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
    'https://makecode.microbit.org/#pub:54705-16835-80762-83855';

  public static readonly isMicrobitOutdated = (origin: HexOrigin, version: number) => {
    // Current versions, remember to update these, whenever changes to firmware are made!
    if (origin === HexOrigin.UNKNOWN) return true;

    const versionNumbers = new Map();
    versionNumbers.set(HexOrigin.MAKECODE, 1); // Change the number to advise users to update old hex files
    versionNumbers.set(HexOrigin.PROPRIETARY, 1); // Change the number to advise users to update old hex files
    return versionNumbers.get(origin) !== version;
  };

  // Line colors are picked in the order of this array.
  public static readonly liveGraphColors = ['#f9808e', '#80f98e', '#808ef9', '#fad16c', '#4cfaee', '#fa4cfa'];

  // What will the min and max y-values on the livegraph be?
  public static readonly liveGraphValueBounds = {
    min: -2.5,
    max: 2.5,
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
   * The size of the accelerometer livedata buffer. Larger means more memory is consumed.
   * Insertions are O(1) and fetching is O(n) where n is the number of items fetched.
   */
  public static readonly accelerometerLiveDataBufferSize = 600;

  /**
   * The size of the magnetometer livedata buffer. Larger means more memory is consumed.
   * Insertions are O(1) and fetching is O(n) where n is the number of items fetched.
   */
  public static readonly magnetometerLiveDataBufferSize = 600;

  /**
   * The minimum number of recordings per gesture to indicate sufficient data.
   */
  public static readonly minNoOfRecordingsPerGesture = 3;

  /**
   * If insufficient data is found in the buffer, then how many fewer data points should we attempt to sample next attempt?
   */
  public static readonly pollingPredictionSampleSizeSearchStepSize = 3;

  /**
   * The minimum number of gestures to indicate sufficient data.
   */
  public static readonly minNoOfGestures = 2;

  // The settings given to the LayersModelTrainer
  public static readonly layersModelTrainingSettings: LayersModelTrainingSettings = {
    noOfEpochs: 80,
    batchSize: 16,
    learningRate: 0.5,
    validationSplit: 0.1,
    noOfUnits: 16, // size of hidden layer
  };

  public static readonly knnNeighbourCount = 10;
}
export default StaticConfiguration;
