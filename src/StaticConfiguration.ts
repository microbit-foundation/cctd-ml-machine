/**
 * Static configuration values. These values are not expected to change, while the application is running.
 */
class StaticConfiguration {
  // in milliseconds, how long should be wait for reconnect before determining something catestrophic happened during the process?
  public static readonly reconnectTimeoutDuration: number = 5000;

  // How many pins do we wish to provide output for?
  public static readonly numberOfAvailablePins = 10;

  // What name should a downloaded hex file have?
  public static readonly downloadedHexFilename = 'firmware.hex';
}
export default StaticConfiguration;
