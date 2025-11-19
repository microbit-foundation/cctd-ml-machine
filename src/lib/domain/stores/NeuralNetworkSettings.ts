/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  writable,
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import StaticConfiguration from '../../../StaticConfiguration';
import type { NeuralNetworkModelBaseSettings } from '../../../core/model/neural-network/NeuralNetworkModelBaseSettings';

interface LegacyNeuralNetworkSettings extends NeuralNetworkModelBaseSettings {
  // legacy mutable properties kept for compatibility with existing store update code
  learningRate?: number;
  noOfEpochs?: number;
  validationSplit?: number;
  noOfUnits?: number;
  batchSize?: number;
}
class NeuralNetworkSettings implements Readable<LegacyNeuralNetworkSettings> {
  private store: Writable<LegacyNeuralNetworkSettings>;
  public constructor() {
    this.store = writable(StaticConfiguration.defaultNeuralNetworkSettings);
  }

  public subscribe(
    run: Subscriber<LegacyNeuralNetworkSettings>,
    invalidate?: Invalidator<LegacyNeuralNetworkSettings> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public setLearningRate(learningRate: number) {
    this.store.update(s => {
      s.learningRate = learningRate;
      return s;
    });
  }

  public setNoOfEpochs(noOfEpochs: number) {
    this.store.update(s => {
      s.noOfEpochs = noOfEpochs;
      return s;
    });
  }

  public setValidationSplit(validationSplit: number) {
    this.store.update(s => {
      s.validationSplit = validationSplit;
      return s;
    });
  }

  public setNoOfUnits(noOfUnits: number) {
    this.store.update(s => {
      s.noOfUnits = noOfUnits;
      return s;
    });
  }

  public setBatchSize(batchSize: number) {
    this.store.update(s => {
      s.batchSize = batchSize;
      return s;
    });
  }
}

export default NeuralNetworkSettings;
