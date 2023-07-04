/**
 * Static configuration values. These values are not expected to change, while the application is running.
 */
import { PinTurnOnState } from './components/output/PinSelectorUtil';
import { Axes, Filters, FilterType } from './script/datafunctions';
import MBSpecs from './script/microbit-interfacing/MBSpecs';

class StaticConfiguration {
  // in milliseconds, how long should be wait for reconnect before determining something catestrophic happened during the process?
  public static readonly reconnectTimeoutDuration: number = 5000;

  // After how long should we consider the connection lost if ping was not able to conclude?
  public static readonly connectionLostTimeoutDuration: number = 3000;

  // Which pins are supported?
  public static supportedPins: MBSpecs.UsableIOPin[] = [0, 1, 2];
  public static readonly defaultOutputPin: MBSpecs.UsableIOPin = 0; // Which pin should be selected by default?
  // In milliseconds, after turning on, how long should an output be on for?
  public static readonly defaultPinToggleTime = 1500;
  public static readonly defaultPinTurnOnState: PinTurnOnState = PinTurnOnState.X_TIME;

  // What name should a downloaded hex file have?
  public static readonly downloadedHexFilename = 'firmware.hex';

  // How long may gesture names be?
  public static readonly gestureNameMaxLength = 25;

  // Default required confidence level
  public static readonly defaultRequiredConfidence = 80;

  public static initialMLSettings = {
    duration: 1800,
    numSamples: 80,
    minSamples: 80,
    automaticClassification: false,
    updatesPrSecond: 4,
    numEpochs: 80,
    learningRate: 0.5,
    includedAxes: [Axes.X, Axes.Y, Axes.Z],
    includedFilters: new Set<FilterType>([
      Filters.MAX,
      Filters.MEAN,
      Filters.MIN,
      Filters.STD,
      Filters.PEAKS,
      Filters.ACC,
      Filters.ZCR,
      Filters.RMS,
    ]),
  };
}
export default StaticConfiguration;
