/**
 * (c) 2023, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */
import {
  get,
  writable,
  type Invalidator,
  type Readable,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';
import type { LayersModelTrainingSettings } from '../../mlmodels/LayersModelTrainer';
import StaticConfiguration from '../../../StaticConfiguration';

class NeuralNetworkSettings implements Readable<LayersModelTrainingSettings> {
  private store: Writable<LayersModelTrainingSettings>;
  public constructor() {
    this.store = writable(StaticConfiguration.defaultNeuralNetworkSettings);
  }

  public subscribe(
    run: Subscriber<LayersModelTrainingSettings>,
    invalidate?: Invalidator<LayersModelTrainingSettings> | undefined,
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
