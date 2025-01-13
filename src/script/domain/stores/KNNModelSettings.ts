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
import StaticConfiguration from '../../../StaticConfiguration';
import type SelectedModel from '../SelectedModel';
import ModelRegistry from '../ModelRegistry';
import { trainModel } from '../../../pages/training/TrainingPage';

class KNNModelSettings implements Readable<{ k: number }> {
  private store: Writable<{ k: number }>;
  public constructor(private selectedModel: SelectedModel) {
    this.store = writable({ k: StaticConfiguration.defaultKnnNeighbourCount });
  }

  public subscribe(
    run: Subscriber<{ k: number }>,
    invalidate?: Invalidator<{ k: number }> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public setK(k: number) {
    this.store.set({
      k,
    });
    if (get(this.selectedModel).id === ModelRegistry.KNN.id) {
      trainModel(ModelRegistry.KNN);
    }
  }
}

export default KNNModelSettings;
