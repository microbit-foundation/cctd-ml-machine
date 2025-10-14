/**
 * (c) 2023-2025, Center for Computational Thinking and Design at Aarhus University and contributors
 *
 * SPDX-License-Identifier: MIT
 */

import {
  get,
  type Invalidator,
  type Subscriber,
  type Unsubscriber,
  type Writable,
} from 'svelte/store';

import PersistantWritable from '../repository/PersistantWritable';
import ConsoleLogger from '../../core/logging/ConsoleLogger';
import type Classifier from './stores/Classifier';
import type { ModelInfo } from '../../core/model/ModelRegistry';
import ModelRegistry from '../../core/model/ModelRegistry';

class SelectedModel implements Writable<ModelInfo> {
  private store: Writable<ModelInfo>;

  public constructor(
    private classifier: Classifier,
    private knnHasTrained: Writable<boolean>,
  ) {
    this.store = new PersistantWritable<ModelInfo>(
      ModelRegistry.NeuralNetwork,
      'selectedModel',
    );
  }

  public set(value: ModelInfo): void {
    ConsoleLogger.log('SelectedModel', `Setting selected model to ${value.title}`);
    if (value.id === ModelRegistry.KNN.id) {
      this.knnHasTrained.set(false);
    }
    this.classifier.getModel().markAsUntrained();
    this.store.set(value);
  }

  public update(updater: (state: ModelInfo) => ModelInfo): void {
    this.set(updater(get(this.store)));
  }

  public subscribe(
    run: Subscriber<ModelInfo>,
    invalidate?: Invalidator<ModelInfo>,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}

export default SelectedModel;
