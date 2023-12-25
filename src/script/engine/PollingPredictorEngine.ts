/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import { Subscriber, Unsubscriber, Writable, derived, get, writable } from 'svelte/store';
import Classifier from '../domain/Classifier';
import Engine, { EngineData } from '../domain/Engine';
import LiveData from '../domain/LiveData';
import AccelerometerClassifierInput from '../mlmodels/AccelerometerClassifierInput';
import { MicrobitAccelerometerData } from '../livedata/MicrobitAccelerometerData';
import StaticConfiguration from '../../StaticConfiguration';
import { TimestampedData } from '../domain/LiveDataBuffer';

class PollingPredictorEngine implements Engine {
  private pollingInterval: ReturnType<typeof setInterval> | undefined;
  private isRunning: Writable<boolean>;

  constructor(
    private classifier: Classifier,
    private liveData: LiveData<MicrobitAccelerometerData>,
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
    if (this.classifier.getModel().isTrained() && get(this.isRunning)) {
      void this.classifier.classify(this.bufferToInput());
    }
  }

  private bufferToInput(): AccelerometerClassifierInput {
    const bufferedData = this.getRawDataFromBuffer(
      StaticConfiguration.pollingPredictionSampleSize,
    );
    const xs = bufferedData.map(data => data.value.x);
    const ys = bufferedData.map(data => data.value.y);
    const zs = bufferedData.map(data => data.value.z);
    return new AccelerometerClassifierInput(xs, ys, zs);
  }

  /**
   * Searches for an applicable amount of data, by iterately trying fewer data points if buffer fetch fails
   */
  private getRawDataFromBuffer(
    sampleSize: number,
  ): TimestampedData<MicrobitAccelerometerData>[] {
    try {
      return this.liveData
        .getBuffer()
        .getSeries(StaticConfiguration.pollingPredictionSampleDuration, sampleSize);
    } catch (_e) {
      if (sampleSize < 8) {
        throw new Error(
          'Was unable to correct buffer data. Less than 8 points were applicable.',
        );
      } else {
        return this.getRawDataFromBuffer(
          sampleSize - StaticConfiguration.pollingPredictionSampleSizeSearchStepSize,
        );
      }
    }
  }
}

export default PollingPredictorEngine;
