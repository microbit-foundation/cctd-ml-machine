/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { get } from 'svelte/store';
import { FilterType } from '../domain/FilterTypes';
import FilterWithMaths from './FilterWithMaths';
import { t } from 'svelte-i18n';

class PeaksFilter extends FilterWithMaths {
  private lag = 5;
  private threshold = 3.5;
  private influence = 0.5;
  public getName(): string {
    return get(t)('content.filters.peaks.title');
  }
  public getDescription(): string {
    return get(t)('content.filters.peaks.description');
  }
  public getType(): FilterType {
    return FilterType.PEAKS;
  }

  public filter(inValues: number[]): number {
    let peaksCounter = 0;

    if (inValues.length < this.lag + 2) {
      throw new Error('data sample is too short');
    }

    // init variables
    const signals = Array(inValues.length).fill(0) as number[];
    const filteredY = inValues.slice(0);
    const lead_in = inValues.slice(0, this.lag);

    const avgFilter: number[] = [];
    avgFilter[this.lag - 1] = this.mean(lead_in);
    const stdFilter: number[] = [];
    stdFilter[this.lag - 1] = this.stddev(lead_in);

    for (let i = this.lag; i < inValues.length; i++) {
      if (
        Math.abs(inValues[i] - avgFilter[i - 1]) > 0.1 &&
        Math.abs(inValues[i] - avgFilter[i - 1]) > this.threshold * stdFilter[i - 1]
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
        filteredY[i] =
          this.influence * inValues[i] + (1 - this.influence) * filteredY[i - 1];
      } else {
        signals[i] = 0; // no signal
        filteredY[i] = inValues[i];
      }

      // adjust the filters
      const y_lag = filteredY.slice(i - this.lag, i);
      avgFilter[i] = this.mean(y_lag);
      stdFilter[i] = this.stddev(y_lag);
    }
    return peaksCounter;
  }

  public getMinNumberOfSamples(): number {
    return this.lag + 2;
  }
}

export default PeaksFilter;
