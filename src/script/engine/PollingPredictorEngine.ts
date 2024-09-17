/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Subscriber, Unsubscriber, Writable, derived, get, writable } from 'svelte/store';
import AccelerometerClassifierInput from '../mlmodels/AccelerometerClassifierInput';
import StaticConfiguration from '../../StaticConfiguration';
import { TimestampedData } from '../domain/LiveDataBuffer';
import Engine, { EngineData } from '../domain/stores/Engine';
import Classifier from '../domain/stores/Classifier';
import LiveData from '../domain/stores/LiveData';
import { LiveDataVector } from '../domain/stores/LiveDataVector';

/**
 * The PollingPredictorEngine will predict on the current input with consistent intervals.
 */
class PollingPredictorEngine implements Engine {
  private pollingInterval: ReturnType<typeof setInterval> | undefined;
  private isRunning: Writable<boolean>;

  constructor(
    private classifier: Classifier,
    private liveData: LiveData<LiveDataVector>,
  ) {
    this.isRunning = writable(true);
    this.startPolling();
  }

  public subscribe(
    run: Subscriber<EngineData>,
    invalidate?: ((value?: EngineData | undefined) => void) | undefined,
  ): Unsubscriber {
    return derived([this.isRunning], stores => {
      const isRunning = stores[0];
      return {
        isRunning: isRunning,
      };
    }).subscribe(run, invalidate);
  }

  public start(): void {
    this.isRunning.set(true);
  }

  public stop(): void {
    this.isRunning.set(false);
  }

  private stopPolling() {
    clearInterval(this.pollingInterval);
  }

  private startPolling() {
    this.pollingInterval = setInterval(() => {
      void this.predict();
    }, StaticConfiguration.pollingPredictionInterval);
  }

  private predict() {
    if (!this.classifier.getModel().isTrained()) {
      return;
    }
    if (!get(this.isRunning)) {
      return;
    }
    const input = this.bufferToInput();
    const numberOfSamples = input.getNumberOfSamples();
    const requiredNumberOfSamples = Math.max(
      ...get(this.classifier.getFilters()).map(filter => filter.getMinNumberOfSamples()),
    );
    if (numberOfSamples < requiredNumberOfSamples) {
      return;
    }
    void this.classifier.classify(input);
  }

  private bufferToInput(): AccelerometerClassifierInput {
    const bufferedData = this.getRawDataFromBuffer(
      StaticConfiguration.pollingPredictionSampleSize,
    );
    const xs = bufferedData.map(data => data.value.getVector()[0]);
    const ys = xs.map(e => 0);
    const zs = xs.map(e => 0);
    // TODO: Generalize
    return new AccelerometerClassifierInput(xs, ys, zs);
  }

  /**
   * Searches for an applicable amount of data, by iterately trying fewer data points if buffer fetch fails
   */
  private getRawDataFromBuffer(sampleSize: number): TimestampedData<LiveDataVector>[] {
    try {
      return this.liveData
        .getBuffer()
        .getSeries(StaticConfiguration.pollingPredictionSampleDuration, sampleSize);
    } catch (_e) {
      if (sampleSize < 8) {
        return []; // The minimum number of points is 8, otherwise the filters will throw an exception
      } else {
        // If too few samples are available, try again with fewer samples
        return this.getRawDataFromBuffer(
          sampleSize - StaticConfiguration.pollingPredictionSampleSizeSearchStepSize,
        );
      }
    }
  }
}

export default PollingPredictorEngine;
