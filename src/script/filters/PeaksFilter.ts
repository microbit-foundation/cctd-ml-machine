/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import FilterWithMaths from './FilterWithMaths';

class PeaksFilter extends FilterWithMaths {
  public filter(inValues: number[]): number {
    const lag = 5;
    const threshold = 3.5;
    const influence = 0.5;

    let peaksCounter = 0;

    if (inValues.length < lag + 2) {
      throw new Error('data sample is too short');
    }

    // init variables
    const signals = Array(inValues.length).fill(0) as number[];
    const filteredY = inValues.slice(0);
    const lead_in = inValues.slice(0, lag);

    const avgFilter: number[] = [];
    avgFilter[lag - 1] = this.mean(lead_in);
    const stdFilter: number[] = [];
    stdFilter[lag - 1] = this.stddev(lead_in);

    for (let i = lag; i < inValues.length; i++) {
      if (
        Math.abs(inValues[i] - avgFilter[i - 1]) > 0.1 &&
        Math.abs(inValues[i] - avgFilter[i - 1]) > threshold * stdFilter[i - 1]
      ) {
        if (inValues[i] > avgFilter[i - 1]) {
          signals[i] = +1; // positive signal
          if (i - 1 > 0 && signals[i - 1] == 0) {
            peaksCounter++;
          }
        } else {
          signals[i] = -1; // negative signal
        }
        // make influence lower
        filteredY[i] = influence * inValues[i] + (1 - influence) * filteredY[i - 1];
      } else {
        signals[i] = 0; // no signal
        filteredY[i] = inValues[i];
      }

      // adjust the filters
      const y_lag = filteredY.slice(i - lag, i);
      avgFilter[i] = this.mean(y_lag);
      stdFilter[i] = this.stddev(y_lag);
    }
    return peaksCounter;
  }
}

export default PeaksFilter;
