/**
 * Static configuration values. These values are not expected to change, while the application is running.
 */
class StaticConfiguration {
  // in milliseconds, how long should be wait for reconnect before determining something catestrophic happened during the process?
  public static readonly reconnectTimeoutDuration: number = 5000;

  // How many pins do we wish to provide output for?
  public static readonly numberOfAvailablePins = 10;
  public static readonly defaultOutputPin = 0; // Which should be selected by default?
  // In milliseconds, after turning on, how long should an output be on for?
  public static readonly pinToggleTime = 1500;

  // What name should a downloaded hex file have?
  public static readonly downloadedHexFilename = 'firmware.hex';

  // How long may gesture names be?
  public static readonly gestureNameMaxLength = 25;

  // Default required confidence level
  public static readonly defaultRequiredConfidence = 80;
}
export default StaticConfiguration;
