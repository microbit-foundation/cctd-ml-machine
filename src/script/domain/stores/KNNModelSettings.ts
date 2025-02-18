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

interface KNNModelSettingsType {
  k: number;
  normalized: boolean;
}

class KNNModelSettings implements Readable<KNNModelSettingsType> {

  private store: Writable<KNNModelSettingsType>;

  public constructor(private selectedModel: SelectedModel) {
    this.store = writable({
      k: StaticConfiguration.defaultKnnNeighbourCount,
      normalized: StaticConfiguration.knnNormalizedDefault,
    });
  }

  public subscribe(
    run: Subscriber<KNNModelSettingsType>,
    invalidate?: Invalidator<KNNModelSettingsType> | undefined,
  ): Unsubscriber {
    return this.store.subscribe(run, invalidate);
  }

  public setNormalized(normalized: boolean) {
    this.store.set({
      k: get(this.store).k,
      normalized,
    });
    if (get(this.selectedModel).id === ModelRegistry.KNN.id) {
      trainModel(ModelRegistry.KNN);
    }
  }

  public setK(k: number) {
    this.store.set({
      k,
      normalized: get(this.store).normalized,
    });
    if (get(this.selectedModel).id === ModelRegistry.KNN.id) {
      trainModel(ModelRegistry.KNN);
    }
  }

  public isNormalized() {
    return get(this.store).normalized
  }
}

export default KNNModelSettings;
