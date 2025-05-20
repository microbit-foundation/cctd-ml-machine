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
import type SelectedModel from '../domain/SelectedModel';

export interface ModelTrainingStore {}

class ModelTraining implements Readable<ModelTrainingStore> {
  private store: Writable<ModelTrainingStore>;

  public constructor(private selectedModel: SelectedModel) {
    this.store = writable({});
  }

  public getSelectedModel(): SelectedModel {
    return this.selectedModel;
  }

  public subscribe(
    run: Subscriber<ModelTrainingStore>,
    invalidate?: Invalidator<ModelTrainingStore> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }
}

export default ModelTraining;
